'use client'

import { useState, useTransition } from 'react'
import { removeEnrollment } from '@/actions/enrollments'
import Button from './Button'
import Modal from './Modal'

interface RemoveEnrollmentButtonProps {
  enrollmentId: string
  courseId: string
  studentName: string
}

export default function RemoveEnrollmentButton({
  enrollmentId,
  courseId,
  studentName,
}: RemoveEnrollmentButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleRemove = () => {
    startTransition(async () => {
      await removeEnrollment(enrollmentId, courseId)
      setIsOpen(false)
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-lg p-2 text-muted hover:bg-secondary hover:text-error transition-colors"
        title="Remove from course"
      >
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
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="18" y1="8" x2="23" y2="13" />
          <line x1="23" y1="8" x2="18" y2="13" />
        </svg>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Remove Student">
        <div className="space-y-4">
          <p className="text-foreground">
            Are you sure you want to remove <span className="font-semibold">{studentName}</span> from
            this course?
          </p>
          <p className="text-sm text-muted">
            This will also delete all attendance records for this student in this course.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRemove} isLoading={isPending}>
              Remove Student
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
