'use client'

import { useState, useTransition } from 'react'
import { enrollMultipleStudents } from '@/actions/enrollments'
import { Student } from '@/types/database'
import Button from './Button'
import Modal from './Modal'

interface EnrollStudentButtonProps {
  courseId: string
  availableStudents: Student[]
}

export default function EnrollStudentButton({ courseId, availableStudents }: EnrollStudentButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleToggle = (studentId: string) => {
    const newSet = new Set(selectedStudents)
    if (newSet.has(studentId)) {
      newSet.delete(studentId)
    } else {
      newSet.add(studentId)
    }
    setSelectedStudents(newSet)
  }

  const handleSelectAll = () => {
    if (selectedStudents.size === availableStudents.length) {
      setSelectedStudents(new Set())
    } else {
      setSelectedStudents(new Set(availableStudents.map(s => s.id)))
    }
  }

  const handleEnroll = () => {
    if (selectedStudents.size === 0) return

    setError(null)
    startTransition(async () => {
      try {
        await enrollMultipleStudents(courseId, Array.from(selectedStudents))
        setIsOpen(false)
        setSelectedStudents(new Set())
      } catch (e) {
        setError(e instanceof Error ? e.message : 'נכשל ברישום התלמידים')
      }
    })
  }

  const handleClose = () => {
    if (!isPending) {
      setIsOpen(false)
      setSelectedStudents(new Set())
      setError(null)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
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
          className="mr-2"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
        רשום תלמידים
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose} title="רשום תלמידים">
        <div className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
              {error}
            </div>
          )}

          {availableStudents.length === 0 ? (
            <p className="text-muted text-center py-8">
              כל התלמידים כבר רשומים לקורס זה.
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted">
                  {selectedStudents.size} מתוך {availableStudents.length} נבחרו
                </p>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-sm text-primary hover:underline"
                >
                  {selectedStudents.size === availableStudents.length ? 'בטל בחירת הכל' : 'בחר הכל'}
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto border border-border rounded-lg divide-y divide-border">
                {availableStudents.map((student) => (
                  <label
                    key={student.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.has(student.id)}
                      onChange={() => handleToggle(student.id)}
                      className="h-4 w-4 rounded border-border bg-secondary text-primary focus:ring-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{student.full_name}</p>
                      <p className="text-sm text-muted truncate">{student.email}</p>
                    </div>
                  </label>
                ))}
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={handleClose} disabled={isPending}>
              ביטול
            </Button>
            <Button
              onClick={handleEnroll}
              isLoading={isPending}
              disabled={selectedStudents.size === 0}
            >
              רשום {selectedStudents.size > 0 && `(${selectedStudents.size})`}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
