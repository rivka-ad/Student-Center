'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { CourseInsert, CourseUpdate } from '@/types/database'

export async function getCourses(activeOnly = false) {
  const supabase = await createClient()
  
  let query = supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data: courses, error } = await query

  if (error) {
    console.error('Error fetching courses:', error)
    throw new Error('Failed to fetch courses')
  }

  return courses
}

export async function getCourse(id: string) {
  const supabase = await createClient()
  
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching course:', error)
    return null
  }

  return course
}

export async function getCourseWithStats(id: string) {
  const supabase = await createClient()
  
  const [courseResult, enrollmentsResult, lessonsResult] = await Promise.all([
    supabase.from('courses').select('*').eq('id', id).single(),
    supabase.from('enrollments').select('id').eq('course_id', id).eq('status', 'active'),
    supabase.from('lessons').select('id').eq('course_id', id),
  ])

  if (courseResult.error) {
    console.error('Error fetching course:', courseResult.error)
    return null
  }

  return {
    ...courseResult.data,
    studentCount: enrollmentsResult.data?.length || 0,
    lessonCount: lessonsResult.data?.length || 0,
  }
}

export async function createCourse(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('You must be logged in to create a course')
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string | null
  const color = formData.get('color') as string || '#6366f1'
  const startDate = formData.get('start_date') as string | null
  const endDate = formData.get('end_date') as string | null

  if (!name) {
    throw new Error('Course name is required')
  }

  const courseData: CourseInsert = {
    user_id: user.id,
    name,
    description: description || null,
    color,
    start_date: startDate || null,
    end_date: endDate || null,
    is_active: true,
  }

  const { error } = await supabase.from('courses').insert(courseData)

  if (error) {
    console.error('Error creating course:', error)
    throw new Error('Failed to create course')
  }

  revalidatePath('/courses')
  redirect('/courses')
}

export async function updateCourse(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const description = formData.get('description') as string | null
  const color = formData.get('color') as string || '#6366f1'
  const startDate = formData.get('start_date') as string | null
  const endDate = formData.get('end_date') as string | null
  const isActive = formData.get('is_active') === 'true'

  if (!name) {
    throw new Error('Course name is required')
  }

  const courseData: CourseUpdate = {
    name,
    description: description || null,
    color,
    start_date: startDate || null,
    end_date: endDate || null,
    is_active: isActive,
  }

  const { error } = await supabase
    .from('courses')
    .update(courseData)
    .eq('id', id)

  if (error) {
    console.error('Error updating course:', error)
    throw new Error('Failed to update course')
  }

  revalidatePath('/courses')
  revalidatePath(`/courses/${id}`)
  redirect(`/courses/${id}`)
}

export async function deleteCourse(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting course:', error)
    throw new Error('Failed to delete course')
  }

  revalidatePath('/courses')
  redirect('/courses')
}

export async function toggleCourseActive(id: string, isActive: boolean) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('courses')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) {
    console.error('Error toggling course:', error)
    throw new Error('Failed to update course')
  }

  revalidatePath('/courses')
  revalidatePath(`/courses/${id}`)
}
