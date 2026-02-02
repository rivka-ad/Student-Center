'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Course, Student } from '@/types/database'
import Button from './Button'
import { Card } from './Card'

interface AttendanceFiltersProps {
  courses: Course[]
  students: Student[]
  currentFilters: {
    course?: string
    student?: string
    status?: string
    from?: string
    to?: string
  }
}

export default function AttendanceFilters({
  courses,
  students,
  currentFilters,
}: AttendanceFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isExpanded, setIsExpanded] = useState(
    !!(currentFilters.course || currentFilters.student || currentFilters.status || currentFilters.from || currentFilters.to)
  )

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
      
      return params.toString()
    },
    [searchParams]
  )

  const handleFilterChange = (key: string, value: string) => {
    router.push(`/attendance?${createQueryString({ [key]: value || null })}`)
  }

  const handleClearFilters = () => {
    router.push('/attendance')
  }

  const hasActiveFilters = !!(
    currentFilters.course ||
    currentFilters.student ||
    currentFilters.status ||
    currentFilters.from ||
    currentFilters.to
  )

  return (
    <Card className="mb-6">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
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
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filters
            {hasActiveFilters && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-primary text-white">
                Active
              </span>
            )}
          </button>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {isExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Course filter */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Course</label>
              <select
                value={currentFilters.course || ''}
                onChange={(e) => handleFilterChange('course', e.target.value)}
                className="w-full text-sm"
              >
                <option value="">All courses</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Student filter */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Student</label>
              <select
                value={currentFilters.student || ''}
                onChange={(e) => handleFilterChange('student', e.target.value)}
                className="w-full text-sm"
              >
                <option value="">All students</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status filter */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Status</label>
              <select
                value={currentFilters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full text-sm"
              >
                <option value="">All statuses</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="excused">Excused</option>
              </select>
            </div>

            {/* Date from */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">From date</label>
              <input
                type="date"
                value={currentFilters.from || ''}
                onChange={(e) => handleFilterChange('from', e.target.value)}
                className="w-full text-sm"
              />
            </div>

            {/* Date to */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">To date</label>
              <input
                type="date"
                value={currentFilters.to || ''}
                onChange={(e) => handleFilterChange('to', e.target.value)}
                className="w-full text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
