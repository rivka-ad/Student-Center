'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { LessonInsert, LessonUpdate } from '@/types/database'

export async function getLessons(courseId: string) {
  const supabase = await createClient()
  
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('lesson_date', { ascending: true })

  if (error) {
    console.error('Error fetching lessons:', error)
    throw new Error('Failed to fetch lessons')
  }

  return lessons
}

export async function getLesson(id: string) {
  const supabase = await createClient()
  
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select(`
      *,
      courses (*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching lesson:', error)
    return null
  }

  return lesson
}

export async function getUpcomingLessons(limit = 5) {
  const supabase = await createClient()
  
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select(`
      *,
      courses (id, name, color)
    `)
    .gte('lesson_date', new Date().toISOString())
    .order('lesson_date', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('Error fetching upcoming lessons:', error)
    return []
  }

  return lessons
}

export async function createLesson(courseId: string, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('You must be logged in to create a lesson')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string | null
  const lessonDate = formData.get('lesson_date') as string
  const lessonTime = formData.get('lesson_time') as string
  const durationMinutes = parseInt(formData.get('duration_minutes') as string) || 60
  const location = formData.get('location') as string | null

  if (!title || !lessonDate || !lessonTime) {
    throw new Error('Title, date, and time are required')
  }

  // Combine date and time
  const dateTime = new Date(`${lessonDate}T${lessonTime}`)

  const lessonData: LessonInsert = {
    user_id: user.id,
    course_id: courseId,
    title,
    description: description || null,
    lesson_date: dateTime.toISOString(),
    duration_minutes: durationMinutes,
    location: location || null,
  }

  const { error } = await supabase.from('lessons').insert(lessonData)

  if (error) {
    console.error('Error creating lesson:', error)
    throw new Error('Failed to create lesson')
  }

  revalidatePath(`/courses/${courseId}`)
  redirect(`/courses/${courseId}`)
}

export async function updateLesson(id: string, courseId: string, formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string | null
  const lessonDate = formData.get('lesson_date') as string
  const lessonTime = formData.get('lesson_time') as string
  const durationMinutes = parseInt(formData.get('duration_minutes') as string) || 60
  const location = formData.get('location') as string | null

  if (!title || !lessonDate || !lessonTime) {
    throw new Error('Title, date, and time are required')
  }

  const dateTime = new Date(`${lessonDate}T${lessonTime}`)

  const lessonData: LessonUpdate = {
    title,
    description: description || null,
    lesson_date: dateTime.toISOString(),
    duration_minutes: durationMinutes,
    location: location || null,
  }

  const { error } = await supabase
    .from('lessons')
    .update(lessonData)
    .eq('id', id)

  if (error) {
    console.error('Error updating lesson:', error)
    throw new Error('Failed to update lesson')
  }

  revalidatePath(`/courses/${courseId}`)
  revalidatePath(`/courses/${courseId}/lessons/${id}`)
  redirect(`/courses/${courseId}/lessons/${id}`)
}

export async function deleteLesson(id: string, courseId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting lesson:', error)
    throw new Error('Failed to delete lesson')
  }

  revalidatePath(`/courses/${courseId}`)
  redirect(`/courses/${courseId}`)
}
