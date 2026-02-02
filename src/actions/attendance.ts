'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { AttendanceStatus } from '@/types/database'

export interface AttendanceFilters {
  courseId?: string
  studentId?: string
  lessonId?: string
  status?: AttendanceStatus
  dateFrom?: string
  dateTo?: string
}

export async function getAttendanceForLesson(lessonId: string) {
  const supabase = await createClient()
  
  // First get the lesson's course_id
  const { data: lesson } = await supabase
    .from('lessons')
    .select('course_id')
    .eq('id', lessonId)
    .single()

  if (!lesson) return []

  // Get all enrollments for the course with their attendance for this lesson
  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      students (*),
      attendance!left (
        id,
        status,
        notes,
        marked_at
      )
    `)
    .eq('course_id', lesson.course_id)
    .eq('status', 'active')
    .eq('attendance.lesson_id', lessonId)

  if (error) {
    console.error('Error fetching attendance:', error)
    return []
  }

  return enrollments
}

export async function getAttendanceWithFilters(filters: AttendanceFilters) {
  const supabase = await createClient()
  
  let query = supabase
    .from('attendance')
    .select(`
      *,
      enrollments (
        *,
        students (*),
        courses (*)
      ),
      lessons (*)
    `)
    .order('marked_at', { ascending: false })

  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching attendance:', error)
    return []
  }

  // Filter by course, student, lesson, and date on the client side
  // (Supabase doesn't support filtering by nested relation fields directly)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let results: any[] = data || []

  if (filters.courseId) {
    results = results.filter((a) => 
      a.enrollments?.course_id === filters.courseId
    )
  }

  if (filters.studentId) {
    results = results.filter((a) => 
      a.enrollments?.student_id === filters.studentId
    )
  }

  if (filters.lessonId) {
    results = results.filter((a) => a.lesson_id === filters.lessonId)
  }

  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom)
    results = results.filter((a) => 
      new Date(a.lessons?.lesson_date) >= fromDate
    )
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo)
    toDate.setHours(23, 59, 59, 999)
    results = results.filter((a) => 
      new Date(a.lessons?.lesson_date) <= toDate
    )
  }

  return results
}

export async function getAttendanceStats(courseId?: string, studentId?: string) {
  const supabase = await createClient()
  
  let query = supabase.from('attendance').select(`
    status,
    enrollments!inner (
      course_id,
      student_id
    )
  `)

  if (courseId) {
    query = query.eq('enrollments.course_id', courseId)
  }

  if (studentId) {
    query = query.eq('enrollments.student_id', studentId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching attendance stats:', error)
    return { present: 0, absent: 0, late: 0, excused: 0, total: 0 }
  }

  const stats = {
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    total: data?.length || 0,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?.forEach((record: any) => {
    if (record.status === 'present') stats.present++
    else if (record.status === 'absent') stats.absent++
    else if (record.status === 'late') stats.late++
    else if (record.status === 'excused') stats.excused++
  })

  return stats
}

export async function markAttendance(
  lessonId: string,
  enrollmentId: string,
  status: AttendanceStatus,
  notes?: string
) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('You must be logged in to mark attendance')
  }

  // Upsert attendance record
  const { error } = await supabase
    .from('attendance')
    .upsert({
      user_id: user.id,
      lesson_id: lessonId,
      enrollment_id: enrollmentId,
      status,
      notes: notes || null,
    }, {
      onConflict: 'enrollment_id,lesson_id',
    })

  if (error) {
    console.error('Error marking attendance:', error)
    throw new Error('Failed to mark attendance')
  }

  // Get the course_id for revalidation
  const { data: lesson } = await supabase
    .from('lessons')
    .select('course_id')
    .eq('id', lessonId)
    .single()

  if (lesson) {
    revalidatePath(`/courses/${lesson.course_id}/lessons/${lessonId}`)
    revalidatePath(`/courses/${lesson.course_id}/lessons/${lessonId}/attendance`)
  }
  revalidatePath('/attendance')
}

export async function bulkMarkAttendance(
  lessonId: string,
  attendanceRecords: { enrollmentId: string; status: AttendanceStatus; notes?: string }[]
) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('You must be logged in to mark attendance')
  }

  const records = attendanceRecords.map(record => ({
    user_id: user.id,
    lesson_id: lessonId,
    enrollment_id: record.enrollmentId,
    status: record.status,
    notes: record.notes || null,
  }))

  const { error } = await supabase
    .from('attendance')
    .upsert(records, {
      onConflict: 'enrollment_id,lesson_id',
    })

  if (error) {
    console.error('Error bulk marking attendance:', error)
    throw new Error('Failed to mark attendance')
  }

  // Get the course_id for revalidation
  const { data: lesson } = await supabase
    .from('lessons')
    .select('course_id')
    .eq('id', lessonId)
    .single()

  if (lesson) {
    revalidatePath(`/courses/${lesson.course_id}/lessons/${lessonId}`)
    revalidatePath(`/courses/${lesson.course_id}/lessons/${lessonId}/attendance`)
  }
  revalidatePath('/attendance')
}

export async function getStudentAttendanceHistory(studentId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('attendance')
    .select(`
      *,
      lessons (*),
      enrollments!inner (
        student_id,
        courses (*)
      )
    `)
    .eq('enrollments.student_id', studentId)
    .order('marked_at', { ascending: false })

  if (error) {
    console.error('Error fetching student attendance:', error)
    return []
  }

  return data
}
