'use client'

import { useActionState } from 'react'
import { createCourse, updateCourse } from '@/actions/courses'
import { Course } from '@/types/database'
import Button from './Button'
import Input from './Input'
import Textarea from './Textarea'
import Link from 'next/link'

interface CourseFormProps {
  course?: Course
}

interface FormState {
  error?: string
}

const colorOptions = [
  '#6366f1', // Indigo
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
]

export default function CourseForm({ course }: CourseFormProps) {
  const isEditing = !!course

  const formAction = async (_prevState: FormState, formData: FormData): Promise<FormState> => {
    try {
      if (isEditing) {
        await updateCourse(course.id, formData)
      } else {
        await createCourse(formData)
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
        name="name"
        label="Course Name"
        placeholder="e.g., Introduction to Mathematics"
        defaultValue={course?.name}
        required
      />

      <Textarea
        name="description"
        label="Description"
        placeholder="Describe what this course covers..."
        defaultValue={course?.description || ''}
        rows={3}
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <label key={color} className="cursor-pointer">
              <input
                type="radio"
                name="color"
                value={color}
                defaultChecked={course?.color === color || (!course && color === '#6366f1')}
                className="sr-only peer"
              />
              <div
                className="w-8 h-8 rounded-full border-2 border-transparent peer-checked:border-white peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-offset-background transition-all"
                style={{ backgroundColor: color, boxShadow: `0 0 0 2px ${color}20` }}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="start_date"
          type="date"
          label="Start Date"
          defaultValue={course?.start_date || ''}
        />
        <Input
          name="end_date"
          type="date"
          label="End Date"
          defaultValue={course?.end_date || ''}
        />
      </div>

      {isEditing && (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="is_active"
            id="is_active"
            value="true"
            defaultChecked={course?.is_active}
            className="h-4 w-4 rounded border-border bg-secondary text-primary focus:ring-primary"
          />
          <label htmlFor="is_active" className="text-sm text-foreground">
            Course is active
          </label>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Link href={isEditing ? `/courses/${course.id}` : '/courses'}>
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </Link>
        <Button type="submit" isLoading={isPending}>
          {isEditing ? 'Save Changes' : 'Create Course'}
        </Button>
      </div>
    </form>
  )
}
