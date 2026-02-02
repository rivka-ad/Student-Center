'use client'

import { useActionState } from 'react'
import { createStudent, updateStudent } from '@/actions/students'
import { Student } from '@/types/database'
import Button from './Button'
import Input from './Input'
import Textarea from './Textarea'
import Link from 'next/link'

interface StudentFormProps {
  student?: Student
}

interface FormState {
  error?: string
}

export default function StudentForm({ student }: StudentFormProps) {
  const isEditing = !!student

  const formAction = async (_prevState: FormState, formData: FormData): Promise<FormState> => {
    try {
      if (isEditing) {
        await updateStudent(student.id, formData)
      } else {
        await createStudent(formData)
      }
      return {}
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'משהו השתבש',
      }
    }
  }

  const [state, action, isPending] = useActionState(formAction, {})

  return (
    <form action={action} className="space-y-6">
      {state.error && (
        <div className="p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
          {state.error}
        </div>
      )}

      <Input
        name="full_name"
        label="שם מלא"
        placeholder="הזן את שם התלמיד המלא"
        defaultValue={student?.full_name}
        required
      />

      <Input
        name="email"
        type="email"
        label="כתובת אימייל"
        placeholder="student@example.com"
        defaultValue={student?.email}
        required
      />

      <Input
        name="phone"
        type="tel"
        label="מספר טלפון"
        placeholder="050-1234567"
        defaultValue={student?.phone || ''}
      />

      <Textarea
        name="notes"
        label="הערות"
        placeholder="הוסף הערות על התלמיד..."
        defaultValue={student?.notes || ''}
        rows={4}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Link href={isEditing ? `/students/${student.id}` : '/dashboard'}>
          <Button type="button" variant="secondary">
            ביטול
          </Button>
        </Link>
        <Button type="submit" isLoading={isPending}>
          {isEditing ? 'שמור שינויים' : 'הוסף תלמיד'}
        </Button>
      </div>
    </form>
  )
}
