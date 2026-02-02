'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { EnrollmentStatus } from '@/types/database'

export async function getEnrollmentsByCourse(courseId: string) {
  const supabase = await createClient()
  
  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      students (*)
    `)
    .eq('course_id', courseId)
    .order('enrolled_at', { ascending: false })

  if (error) {
    console.error('Error fetching enrollments:', error)
    throw new Error('Failed to fetch enrollments')
  }

  return enrollments
}

export async function getEnrollmentsByStudent(studentId: string) {
  const supabase = await createClient()
  
  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      courses (*)
    `)
    .eq('student_id', studentId)
    .order('enrolled_at', { ascending: false })

  if (error) {
    console.error('Error fetching enrollments:', error)
    throw new Error('Failed to fetch enrollments')
  }

  return enrollments
}

export async function getStudentsNotInCourse(courseId: string) {
  const supabase = await createClient()
  
  // Get all students
  const { data: allStudents, error: studentsError } = await supabase
    .from('students')
    .select('*')
    .order('full_name')

  if (studentsError) {
    console.error('Error fetching students:', studentsError)
    return []
  }

  // Get enrolled student IDs
  const { data: enrollments, error: enrollmentError } = await supabase
    .from('enrollments')
    .select('student_id')
    .eq('course_id', courseId)

  if (enrollmentError) {
    console.error('Error fetching enrollments:', enrollmentError)
    return allStudents || []
  }

  const enrolledIds = new Set(enrollments?.map(e => e.student_id) || [])
  return allStudents?.filter(s => !enrolledIds.has(s.id)) || []
}

export async function enrollStudent(courseId: string, studentId: string, notes?: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('You must be logged in to enroll students')
  }

  const { error } = await supabase.from('enrollments').insert({
    user_id: user.id,
    course_id: courseId,
    student_id: studentId,
    notes: notes || null,
    status: 'active',
  })

  if (error) {
    if (error.code === '23505') {
      throw new Error('Student is already enrolled in this course')
    }
    console.error('Error enrolling student:', error)
    throw new Error('Failed to enroll student')
  }

  revalidatePath(`/courses/${courseId}`)
  revalidatePath(`/courses/${courseId}/students`)
}

export async function enrollMultipleStudents(courseId: string, studentIds: string[]) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('You must be logged in to enroll students')
  }

  const enrollments = studentIds.map(studentId => ({
    user_id: user.id,
    course_id: courseId,
    student_id: studentId,
    status: 'active',
  }))

  const { error } = await supabase.from('enrollments').insert(enrollments)

  if (error) {
    console.error('Error enrolling students:', error)
    throw new Error('Failed to enroll students')
  }

  revalidatePath(`/courses/${courseId}`)
  revalidatePath(`/courses/${courseId}/students`)
}

export async function updateEnrollmentStatus(
  enrollmentId: string, 
  status: EnrollmentStatus,
  courseId: string
) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('enrollments')
    .update({ status })
    .eq('id', enrollmentId)

  if (error) {
    console.error('Error updating enrollment:', error)
    throw new Error('Failed to update enrollment')
  }

  revalidatePath(`/courses/${courseId}`)
  revalidatePath(`/courses/${courseId}/students`)
}

export async function removeEnrollment(enrollmentId: string, courseId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('enrollments')
    .delete()
    .eq('id', enrollmentId)

  if (error) {
    console.error('Error removing enrollment:', error)
    throw new Error('Failed to remove enrollment')
  }

  revalidatePath(`/courses/${courseId}`)
  revalidatePath(`/courses/${courseId}/students`)
}
