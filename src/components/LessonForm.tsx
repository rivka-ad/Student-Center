'use client'

import { useActionState } from 'react'
import { createLesson, updateLesson } from '@/actions/lessons'
import { Lesson } from '@/types/database'
import Button from './Button'
import Input from './Input'
import Textarea from './Textarea'
import Link from 'next/link'

interface LessonFormProps {
  courseId: string
  lesson?: Lesson
}

interface FormState {
  error?: string
}

export default function LessonForm({ courseId, lesson }: LessonFormProps) {
  const isEditing = !!lesson

  // Parse existing lesson date/time
  const lessonDateTime = lesson ? new Date(lesson.lesson_date) : null
  const defaultDate = lessonDateTime
    ? lessonDateTime.toISOString().split('T')[0]
    : ''
  const defaultTime = lessonDateTime
    ? lessonDateTime.toTimeString().slice(0, 5)
    : ''

  const formAction = async (_prevState: FormState, formData: FormData): Promise<FormState> => {
    try {
      if (isEditing) {
        await updateLesson(lesson.id, courseId, formData)
      } else {
        await createLesson(courseId, formData)
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
        name="title"
        label="Lesson Title"
        placeholder="e.g., Introduction to Algebra"
        defaultValue={lesson?.title}
        required
      />

      <Textarea
        name="description"
        label="Description"
        placeholder="What will be covered in this lesson..."
        defaultValue={lesson?.description || ''}
        rows={3}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="lesson_date"
          type="date"
          label="Date"
          defaultValue={defaultDate}
          required
        />
        <Input
          name="lesson_time"
          type="time"
          label="Time"
          defaultValue={defaultTime}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="duration_minutes"
          type="number"
          label="Duration (minutes)"
          placeholder="60"
          defaultValue={lesson?.duration_minutes || 60}
          min={15}
          max={480}
        />
        <Input
          name="location"
          label="Location"
          placeholder="e.g., Room 101"
          defaultValue={lesson?.location || ''}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Link href={isEditing ? `/courses/${courseId}/lessons/${lesson.id}` : `/courses/${courseId}`}>
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </Link>
        <Button type="submit" isLoading={isPending}>
          {isEditing ? 'Save Changes' : 'Create Lesson'}
        </Button>
      </div>
    </form>
  )
}
