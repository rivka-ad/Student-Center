import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourse } from '@/actions/courses'
import { getEnrollmentsByCourse, getStudentsNotInCourse } from '@/actions/enrollments'
import AppLayout from '@/components/AppLayout'
import Button from '@/components/Button'
import Badge from '@/components/Badge'
import { Card, CardHeader, CardContent } from '@/components/Card'
import EnrollStudentButton from '@/components/EnrollStudentButton'
import RemoveEnrollmentButton from '@/components/RemoveEnrollmentButton'

interface CourseStudentsPageProps {
  params: Promise<{ id: string }>
}

export default async function CourseStudentsPage({ params }: CourseStudentsPageProps) {
  const { id } = await params
  const course = await getCourse(id)

  if (!course) {
    notFound()
  }

  const [enrollments, availableStudents] = await Promise.all([
    getEnrollmentsByCourse(id),
    getStudentsNotInCourse(id),
  ])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>
      case 'completed':
        return <Badge variant="info">Completed</Badge>
      case 'dropped':
        return <Badge variant="error">Dropped</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <AppLayout>
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link href="/courses" className="text-muted hover:text-foreground transition-colors">
              Courses
            </Link>
          </li>
          <li className="text-muted">/</li>
          <li>
            <Link href={`/courses/${id}`} className="text-muted hover:text-foreground transition-colors">
              {course.name}
            </Link>
          </li>
          <li className="text-muted">/</li>
          <li className="text-foreground">Students</li>
        </ol>
      </nav>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Enrolled Students</h1>
          <p className="text-muted mt-1">
            {enrollments.length === 0
              ? 'No students enrolled in this course yet.'
              : `${enrollments.length} student${enrollments.length === 1 ? '' : 's'} enrolled`}
          </p>
        </div>
        <EnrollStudentButton courseId={id} availableStudents={availableStudents} />
      </div>

      {/* Students list */}
      <Card>
        {enrollments.length === 0 ? (
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No students enrolled</h3>
            <p className="text-muted mb-4">Enroll students to this course to get started.</p>
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted hidden md:table-cell">
                    Enrolled
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {enrollments.map((enrollment) => {
                  const student = enrollment.students as unknown as { id: string; full_name: string; email: string }
                  return (
                    <tr key={enrollment.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                            {student?.full_name?.charAt(0).toUpperCase()}
                          </div>
                          <Link
                            href={`/students/${student?.id}`}
                            className="font-medium text-foreground hover:text-primary transition-colors"
                          >
                            {student?.full_name}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted">{student?.email}</td>
                      <td className="px-6 py-4 text-muted hidden md:table-cell">
                        {formatDate(enrollment.enrolled_at)}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(enrollment.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <RemoveEnrollmentButton
                          enrollmentId={enrollment.id}
                          courseId={id}
                          studentName={student?.full_name}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AppLayout>
  )
}
