'use client'

import { useActionState } from 'react'
import { sendStudentEmail } from '@/actions/email'
import { Student } from '@/types/database'
import Button from './Button'
import Input from './Input'
import Textarea from './Textarea'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface SendEmailFormProps {
  student: Student
}

interface FormState {
  success?: boolean
  error?: string
}

export default function SendEmailForm({ student }: SendEmailFormProps) {
  const router = useRouter()

  const formAction = async (_prevState: FormState, formData: FormData): Promise<FormState> => {
    const response = await sendStudentEmail(student.id, formData)
    return response
  }

  const [state, action, isPending] = useActionState(formAction, {})

  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        router.push(`/students/${student.id}`)
      }, 1500)
    }
  }, [state.success, router, student.id])

  return (
    <form action={action} className="space-y-6">
      {state.success && (
        <div className="p-4 rounded-lg bg-success/10 border border-success/20 text-success text-sm flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          האימייל נשלח בהצלחה!
        </div>
      )}

      {state.error && (
        <div className="p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
          {state.error}
        </div>
      )}

      <div className="p-4 rounded-lg bg-secondary border border-border">
        <p className="text-sm text-muted">
          אל: <span className="text-foreground font-medium">{student.email}</span>
        </p>
      </div>

      <Input
        name="subject"
        label="נושא"
        placeholder="הזן נושא אימייל"
        required
        disabled={isPending}
      />

      <Textarea
        name="body"
        label="הודעה"
        placeholder="כתוב את ההודעה שלך כאן..."
        required
        rows={8}
        disabled={isPending}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Link href={`/students/${student.id}`}>
          <Button type="button" variant="secondary" disabled={isPending}>
            ביטול
          </Button>
        </Link>
        <Button type="submit" isLoading={isPending}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          שלח אימייל
        </Button>
      </div>
    </form>
  )
}
