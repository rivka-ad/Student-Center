import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLesson } from '@/actions/lessons'
import { getAttendanceForLesson } from '@/actions/attendance'
import AppLayout from '@/components/AppLayout'
import Button from '@/components/Button'
import Badge from '@/components/Badge'
import { Card, CardHeader, CardContent } from '@/components/Card'
import DeleteLessonButton from '@/components/DeleteLessonButton'

interface LessonPageProps {
  params: Promise<{ id: string; lessonId: string }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id, lessonId } = await params
  const lesson = await getLesson(lessonId)

  if (!lesson) {
    notFound()
  }

  const course = lesson.courses as unknown as { id: string; name: string; color: string }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enrollmentsWithAttendance: any[] = await getAttendanceForLesson(lessonId)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isPast = new Date(lesson.lesson_date) < new Date()

  // Calculate attendance stats
  const totalStudents = enrollmentsWithAttendance.length
  const markedAttendance = enrollmentsWithAttendance.filter(
    (e) => e.attendance && e.attendance.length > 0
  ).length
  const presentCount = enrollmentsWithAttendance.filter(
    (e) => e.attendance?.[0]?.status === 'present'
  ).length
  const absentCount = enrollmentsWithAttendance.filter(
    (e) => e.attendance?.[0]?.status === 'absent'
  ).length
  const lateCount = enrollmentsWithAttendance.filter(
    (e) => e.attendance?.[0]?.status === 'late'
  ).length

  const getStatusBadge = (status: string | undefined) => {
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
        return <Badge variant="default">Not Marked</Badge>
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
          <li className="text-foreground">{lesson.title}</li>
        </ol>
      </nav>

      {/* Lesson header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
        <div className="flex items-start gap-4">
          <div
            className="h-14 w-14 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: course.color + '20' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke={course.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-foreground">{lesson.title}</h1>
              <Badge variant={isPast ? 'default' : 'info'}>
                {isPast ? 'Past' : 'Upcoming'}
              </Badge>
            </div>
            <p className="text-muted">
              {formatDate(lesson.lesson_date)} at {formatTime(lesson.lesson_date)}
              {lesson.duration_minutes && ` · ${lesson.duration_minutes} min`}
              {lesson.location && ` · ${lesson.location}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/courses/${id}/lessons/${lessonId}/attendance`}>
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <path d="m9 14 2 2 4-4" />
              </svg>
              Take Attendance
            </Button>
          </Link>
          <Link href={`/courses/${id}/lessons/${lessonId}/edit`}>
            <Button variant="secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </Button>
          </Link>
          <DeleteLessonButton lessonId={lessonId} courseId={id} lessonTitle={lesson.title} />
        </div>
      </div>

      {/* Description */}
      {lesson.description && (
        <Card className="mb-8">
          <CardContent className="py-5">
            <h3 className="text-sm font-medium text-muted mb-2">Description</h3>
            <p className="text-foreground whitespace-pre-wrap">{lesson.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Attendance summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted mb-1">Total Students</p>
            <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted mb-1">Marked</p>
            <p className="text-2xl font-bold text-foreground">{markedAttendance}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted mb-1">Present</p>
            <p className="text-2xl font-bold text-success">{presentCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted mb-1">Absent</p>
            <p className="text-2xl font-bold text-error">{absentCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted mb-1">Late</p>
            <p className="text-2xl font-bold text-amber-500">{lateCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance list */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Attendance</h2>
          <Link href={`/courses/${id}/lessons/${lessonId}/attendance`}>
            <Button variant="ghost" size="sm">Edit Attendance</Button>
          </Link>
        </CardHeader>
        {enrollmentsWithAttendance.length === 0 ? (
          <CardContent className="py-12 text-center">
            <p className="text-muted">No students enrolled in this course yet.</p>
          </CardContent>
        ) : (
          <div className="divide-y divide-border">
            {enrollmentsWithAttendance.map((enrollment) => {
              const student = enrollment.students as { full_name: string; email: string }
              const attendance = enrollment.attendance?.[0]
              return (
                <div key={enrollment.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                      {student?.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{student?.full_name}</p>
                      <p className="text-sm text-muted">{student?.email}</p>
                    </div>
                  </div>
                  {getStatusBadge(attendance?.status)}
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </AppLayout>
  )
}
