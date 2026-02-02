'use server'

import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/resend'
import { revalidatePath } from 'next/cache'

interface SendStudentEmailResult {
  success: boolean
  error?: string
}

export async function sendStudentEmail(
  studentId: string,
  formData: FormData
): Promise<SendStudentEmailResult> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'You must be logged in to send emails' }
  }

  const subject = formData.get('subject') as string
  const body = formData.get('body') as string

  if (!subject || !body) {
    return { success: false, error: 'Subject and message are required' }
  }

  // Get student email
  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('email, full_name')
    .eq('id', studentId)
    .single()

  if (studentError || !student) {
    return { success: false, error: 'Student not found' }
  }

  let status: 'sent' | 'failed' = 'sent'
  let errorMessage: string | undefined

  try {
    await sendEmail({
      to: student.email,
      subject: subject,
      body: body,
    })
  } catch (error) {
    status = 'failed'
    errorMessage = error instanceof Error ? error.message : 'Failed to send email'
  }

  // Log the email
  await supabase.from('email_logs').insert({
    user_id: user.id,
    student_id: studentId,
    subject: subject,
    body: body,
    status: status,
  })

  revalidatePath(`/students/${studentId}`)

  if (status === 'failed') {
    return { success: false, error: errorMessage }
  }

  return { success: true }
}

export async function getEmailLogs(studentId: string) {
  const supabase = await createClient()
  
  const { data: logs, error } = await supabase
    .from('email_logs')
    .select('*')
    .eq('student_id', studentId)
    .order('sent_at', { ascending: false })

  if (error) {
    console.error('Error fetching email logs:', error)
    return []
  }

  return logs
}
