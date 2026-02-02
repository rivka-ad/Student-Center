import Link from 'next/link'
import { getAttendanceWithFilters, AttendanceFilters } from '@/actions/attendance'
import Badge from './Badge'
import { Card } from './Card'
import SortableHeader from './SortableHeader'

interface AttendanceTableProps {
  filters: {
    course?: string
    student?: string
    status?: string
    from?: string
    to?: string
    sort?: string
    order?: string
  }
}

export default async function AttendanceTable({ filters }: AttendanceTableProps) {
  const attendanceFilters: AttendanceFilters = {
    courseId: filters.course,
    studentId: filters.student,
    status: filters.status as AttendanceFilters['status'],
    dateFrom: filters.from,
    dateTo: filters.to,
  }

  let records = await getAttendanceWithFilters(attendanceFilters)

  // Sort records
  const sortField = filters.sort || 'date'
  const sortOrder = filters.order || 'desc'

  records = [...records].sort((a, b) => {
    let comparison = 0
    
    switch (sortField) {
      case 'student':
        comparison = ((a.enrollments as { students: { full_name: string } })?.students?.full_name || '').localeCompare(
          (b.enrollments as { students: { full_name: string } })?.students?.full_name || ''
        )
        break
      case 'course':
        comparison = ((a.enrollments as { courses: { name: string } })?.courses?.name || '').localeCompare(
          (b.enrollments as { courses: { name: string } })?.courses?.name || ''
        )
        break
      case 'lesson':
        comparison = ((a.lessons as { title: string })?.title || '').localeCompare(
          (b.lessons as { title: string })?.title || ''
        )
        break
      case 'status':
        comparison = a.status.localeCompare(b.status)
        break
      case 'date':
      default:
        comparison = new Date((a.lessons as { lesson_date: string })?.lesson_date).getTime() -
          new Date((b.lessons as { lesson_date: string })?.lesson_date).getTime()
        break
    }
    
    return sortOrder === 'asc' ? comparison : -comparison
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="success">Present</Badge>
      case 'absent':
        return <Badge variant="error">Absent</Badge>
      case 'late':
        return <Badge variant="warning">Late</Badge>
      case 'excused':
        return <Badge variant="info">Excused</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (records.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No attendance records found</h3>
        <p className="text-muted">
          {filters.course || filters.student || filters.status || filters.from || filters.to
            ? 'Try adjusting your filters to see more results.'
            : 'Start taking attendance in your lessons to see records here.'}
        </p>
      </Card>
    )
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <SortableHeader field="date" currentSort={filters.sort} currentOrder={filters.order}>
                Date
              </SortableHeader>
              <SortableHeader field="student" currentSort={filters.sort} currentOrder={filters.order}>
                Student
              </SortableHeader>
              <SortableHeader field="course" currentSort={filters.sort} currentOrder={filters.order}>
                Course
              </SortableHeader>
              <SortableHeader field="lesson" currentSort={filters.sort} currentOrder={filters.order}>
                Lesson
              </SortableHeader>
              <SortableHeader field="status" currentSort={filters.sort} currentOrder={filters.order}>
                Status
              </SortableHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {records.map((record) => {
              const enrollment = record.enrollments as {
                students: { id: string; full_name: string }
                courses: { id: string; name: string }
              }
              const lesson = record.lessons as { id: string; title: string; lesson_date: string }

              return (
                <tr key={record.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-muted whitespace-nowrap">
                    {formatDate(lesson?.lesson_date)}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/students/${enrollment?.students?.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {enrollment?.students?.full_name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/courses/${enrollment?.courses?.id}`}
                      className="text-muted hover:text-foreground transition-colors"
                    >
                      {enrollment?.courses?.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/courses/${enrollment?.courses?.id}/lessons/${lesson?.id}`}
                      className="text-muted hover:text-foreground transition-colors"
                    >
                      {lesson?.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(record.status)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-border text-sm text-muted">
        Showing {records.length} record{records.length === 1 ? '' : 's'}
      </div>
    </Card>
  )
}
