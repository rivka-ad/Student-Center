'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { bulkMarkAttendance } from '@/actions/attendance'
import { AttendanceStatus } from '@/types/database'
import Button from './Button'
import { Card } from './Card'

interface EnrollmentWithAttendance {
  id: string
  students: {
    full_name: string
    email: string
  }
  attendance?: {
    id: string
    status: string
    notes: string | null
  }[]
}

interface AttendanceFormProps {
  lessonId: string
  courseId: string
  enrollments: EnrollmentWithAttendance[]
}

interface AttendanceRecord {
  enrollmentId: string
  status: AttendanceStatus
  notes?: string
}

const statusOptions: { value: AttendanceStatus; label: string; color: string }[] = [
  { value: 'present', label: 'Present', color: 'bg-success/10 text-success border-success/30' },
  { value: 'absent', label: 'Absent', color: 'bg-error/10 text-error border-error/30' },
  { value: 'late', label: 'Late', color: 'bg-amber-500/10 text-amber-500 border-amber-500/30' },
  { value: 'excused', label: 'Excused', color: 'bg-primary/10 text-primary border-primary/30' },
]

export default function AttendanceForm({ lessonId, courseId, enrollments }: AttendanceFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Initialize attendance state from existing data
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceRecord>>(() => {
    const initial: Record<string, AttendanceRecord> = {}
    enrollments.forEach((enrollment) => {
      const existing = enrollment.attendance?.[0]
      initial[enrollment.id] = {
        enrollmentId: enrollment.id,
        status: (existing?.status as AttendanceStatus) || 'present',
        notes: existing?.notes || undefined,
      }
    })
    return initial
  })

  const handleStatusChange = (enrollmentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [enrollmentId]: { ...prev[enrollmentId], status },
    }))
  }

  const handleMarkAllAs = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceRecord> = {}
    enrollments.forEach((enrollment) => {
      updated[enrollment.id] = {
        ...attendanceMap[enrollment.id],
        status,
      }
    })
    setAttendanceMap(updated)
  }

  const handleSubmit = async () => {
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      try {
        const records = Object.values(attendanceMap)
        await bulkMarkAttendance(lessonId, records)
        setSuccess(true)
        setTimeout(() => {
          router.push(`/courses/${courseId}/lessons/${lessonId}`)
        }, 1000)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to save attendance')
      }
    })
  }

  // Count by status
  const counts = {
    present: Object.values(attendanceMap).filter((a) => a.status === 'present').length,
    absent: Object.values(attendanceMap).filter((a) => a.status === 'absent').length,
    late: Object.values(attendanceMap).filter((a) => a.status === 'late').length,
    excused: Object.values(attendanceMap).filter((a) => a.status === 'excused').length,
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg bg-success/10 border border-success/20 text-success text-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Attendance saved successfully! Redirecting...
        </div>
      )}

      {/* Quick actions */}
      <Card>
        <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-success">Present: {counts.present}</span>
            <span className="text-error">Absent: {counts.absent}</span>
            <span className="text-amber-500">Late: {counts.late}</span>
            <span className="text-primary">Excused: {counts.excused}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">Mark all as:</span>
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleMarkAllAs(option.value)}
                className={`px-2 py-1 text-xs font-medium rounded border transition-colors hover:opacity-80 ${option.color}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Student list */}
      <Card>
        <div className="divide-y divide-border">
          {enrollments.map((enrollment) => {
            const student = enrollment.students
            const currentStatus = attendanceMap[enrollment.id]?.status || 'present'

            return (
              <div
                key={enrollment.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                    {student?.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{student?.full_name}</p>
                    <p className="text-sm text-muted">{student?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-13 sm:pl-0">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleStatusChange(enrollment.id, option.value)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${
                        currentStatus === option.value
                          ? option.color + ' ring-2 ring-offset-2 ring-offset-background'
                          : 'bg-secondary border-border text-muted hover:text-foreground hover:border-muted'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="secondary"
          onClick={() => router.push(`/courses/${courseId}/lessons/${lessonId}`)}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} isLoading={isPending}>
          Save Attendance
        </Button>
      </div>
    </div>
  )
}
