'use client'

import { useState, useTransition } from 'react'
import { deleteCourse } from '@/actions/courses'
import Button from './Button'
import Modal from './Modal'

interface DeleteCourseButtonProps {
  courseId: string
  courseName: string
}

export default function DeleteCourseButton({ courseId, courseName }: DeleteCourseButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      await deleteCourse(courseId)
    })
  }

  return (
    <>
      <Button variant="danger" onClick={() => setIsOpen(true)}>
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
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
        Delete
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Delete Course">
        <div className="space-y-4">
          <p className="text-foreground">
            Are you sure you want to delete <span className="font-semibold">{courseName}</span>?
          </p>
          <p className="text-sm text-muted">
            This will also delete all lessons, enrollments, and attendance records associated with this course. This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isPending}>
              Delete Course
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
