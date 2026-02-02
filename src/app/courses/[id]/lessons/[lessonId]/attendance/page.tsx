import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLesson } from '@/actions/lessons'
import { getAttendanceForLesson } from '@/actions/attendance'
import AppLayout from '@/components/AppLayout'
import AttendanceForm from '@/components/AttendanceForm'

interface AttendancePageProps {
  params: Promise<{ id: string; lessonId: string }>
}

export default async function AttendancePage({ params }: AttendancePageProps) {
  const { id, lessonId } = await params
  const lesson = await getLesson(lessonId)

  if (!lesson) {
    notFound()
  }

  const course = lesson.courses as unknown as { id: string; name: string; color: string }
  const enrollmentsWithAttendance = await getAttendanceForLesson(lessonId)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
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
          <li>
            <Link
              href={`/courses/${id}/lessons/${lessonId}`}
              className="text-muted hover:text-foreground transition-colors"
            >
              {lesson.title}
            </Link>
          </li>
          <li className="text-muted">/</li>
          <li className="text-foreground">Attendance</li>
        </ol>
      </nav>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Take Attendance</h1>
        <p className="text-muted mt-1">
          {lesson.title} · {formatDate(lesson.lesson_date)}
        </p>
      </div>

      {/* Attendance form */}
      {enrollmentsWithAttendance.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No students enrolled</h3>
          <p className="text-muted mb-4">Enroll students in this course to take attendance.</p>
          <Link
            href={`/courses/${id}/students`}
            className="text-primary hover:underline"
          >
            Go to enrollment page
          </Link>
        </div>
      ) : (
        <AttendanceForm
          lessonId={lessonId}
          courseId={id}
          enrollments={enrollmentsWithAttendance as unknown as Parameters<typeof AttendanceForm>[0]['enrollments']}
        />
      )}
    </AppLayout>
  )
}
