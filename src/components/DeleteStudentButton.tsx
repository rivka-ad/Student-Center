'use client'

import { useState, useTransition } from 'react'
import { deleteStudent } from '@/actions/students'
import Button from './Button'
import Modal from './Modal'

interface DeleteStudentButtonProps {
  studentId: string
  studentName: string
}

export default function DeleteStudentButton({ studentId, studentName }: DeleteStudentButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      await deleteStudent(studentId)
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
        מחק
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="מחק תלמיד">
        <div className="space-y-4">
          <p className="text-foreground">
            האם אתה בטוח שברצונך למחוק את <span className="font-semibold">{studentName}</span>?
            פעולה זו אינה ניתנת לביטול.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              ביטול
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isPending}>
              מחק תלמיד
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
