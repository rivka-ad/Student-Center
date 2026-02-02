'use client'

import { useState, useTransition } from 'react'
import { deleteLesson } from '@/actions/lessons'
import Button from './Button'
import Modal from './Modal'

interface DeleteLessonButtonProps {
  lessonId: string
  courseId: string
  lessonTitle: string
}

export default function DeleteLessonButton({ lessonId, courseId, lessonTitle }: DeleteLessonButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      await deleteLesson(lessonId, courseId)
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

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Delete Lesson">
        <div className="space-y-4">
          <p className="text-foreground">
            Are you sure you want to delete <span className="font-semibold">{lessonTitle}</span>?
          </p>
          <p className="text-sm text-muted">
            This will also delete all attendance records for this lesson. This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isPending}>
              Delete Lesson
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
