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
        error: error instanceof Error ? error.message : 'Something went wrong',
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
        label="Full Name"
        placeholder="Enter student's full name"
        defaultValue={student?.full_name}
        required
      />

      <Input
        name="email"
        type="email"
        label="Email Address"
        placeholder="student@example.com"
        defaultValue={student?.email}
        required
      />

      <Input
        name="phone"
        type="tel"
        label="Phone Number"
        placeholder="(555) 123-4567"
        defaultValue={student?.phone || ''}
      />

      <Textarea
        name="notes"
        label="Notes"
        placeholder="Add any notes about this student..."
        defaultValue={student?.notes || ''}
        rows={4}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Link href={isEditing ? `/students/${student.id}` : '/dashboard'}>
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </Link>
        <Button type="submit" isLoading={isPending}>
          {isEditing ? 'Save Changes' : 'Add Student'}
        </Button>
      </div>
    </form>
  )
}
