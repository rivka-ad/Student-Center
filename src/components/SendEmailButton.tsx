'use client'

import { useState, useTransition } from 'react'
import { sendStudentEmail } from '@/actions/email'
import { Student } from '@/types/database'
import Button from './Button'
import Input from './Input'
import Textarea from './Textarea'
import Modal from './Modal'

interface SendEmailButtonProps {
  student: Student
}

export default function SendEmailButton({ student }: SendEmailButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null)

  const handleSubmit = (formData: FormData) => {
    setResult(null)
    startTransition(async () => {
      const response = await sendStudentEmail(student.id, formData)
      setResult(response)
      if (response.success) {
        // Close modal after a short delay to show success message
        setTimeout(() => {
          setIsOpen(false)
          setResult(null)
        }, 1500)
      }
    })
  }

  const handleClose = () => {
    if (!isPending) {
      setIsOpen(false)
      setResult(null)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
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
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        שלח אימייל
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose} title="שלח אימייל">
        <form action={handleSubmit} className="space-y-4">
          {result?.success && (
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

          {result?.error && (
            <div className="p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
              {result.error}
            </div>
          )}

          <div className="p-3 rounded-lg bg-secondary border border-border">
            <p className="text-sm text-muted">
              אל: <span className="text-foreground">{student.email}</span>
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
            rows={6}
            disabled={isPending}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={isPending}>
              ביטול
            </Button>
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
      </Modal>
    </>
  )
}
