'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { StudentInsert, StudentUpdate } from '@/types/database'

export async function getStudents() {
  const supabase = await createClient()
  
  const { data: students, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching students:', error)
    throw new Error('Failed to fetch students')
  }

  return students
}

export async function getStudent(id: string) {
  const supabase = await createClient()
  
  const { data: student, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching student:', error)
    return null
  }

  return student
}

export async function createStudent(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('You must be logged in to create a student')
  }

  const fullName = formData.get('full_name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string | null
  const notes = formData.get('notes') as string | null

  if (!fullName || !email) {
    throw new Error('Full name and email are required')
  }

  const studentData: StudentInsert = {
    user_id: user.id,
    full_name: fullName,
    email: email,
    phone: phone || null,
    notes: notes || null,
  }

  const { error } = await supabase
    .from('students')
    .insert(studentData)

  if (error) {
    console.error('Error creating student:', error)
    throw new Error('Failed to create student')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function updateStudent(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const fullName = formData.get('full_name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string | null
  const notes = formData.get('notes') as string | null

  if (!fullName || !email) {
    throw new Error('Full name and email are required')
  }

  const studentData: StudentUpdate = {
    full_name: fullName,
    email: email,
    phone: phone || null,
    notes: notes || null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('students')
    .update(studentData)
    .eq('id', id)

  if (error) {
    console.error('Error updating student:', error)
    throw new Error('Failed to update student')
  }

  revalidatePath('/dashboard')
  revalidatePath(`/students/${id}`)
  redirect(`/students/${id}`)
}

export async function deleteStudent(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting student:', error)
    throw new Error('Failed to delete student')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
