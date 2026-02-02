import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseWithStats } from '@/actions/courses'
import { getLessons } from '@/actions/lessons'
import { getEnrollmentsByCourse } from '@/actions/enrollments'
import AppLayout from '@/components/AppLayout'
import Button from '@/components/Button'
import Badge from '@/components/Badge'
import { Card, CardHeader, CardContent } from '@/components/Card'
import DeleteCourseButton from '@/components/DeleteCourseButton'
import EmptyState from '@/components/EmptyState'

interface CoursePageProps {
  params: Promise<{ id: string }>
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params
  const course = await getCourseWithStats(id)

  if (!course) {
    notFound()
  }

  const [lessons, enrollments] = await Promise.all([
    getLessons(id),
    getEnrollmentsByCourse(id),
  ])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const upcomingLessons = lessons.filter(
    (l) => new Date(l.lesson_date) >= new Date()
  )
  const pastLessons = lessons.filter(
    (l) => new Date(l.lesson_date) < new Date()
  )

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
          <li className="text-foreground">{course.name}</li>
        </ol>
      </nav>

      {/* Course header */}
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
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-foreground">{course.name}</h1>
              <Badge variant={course.is_active ? 'success' : 'default'}>
                {course.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            {course.description && (
              <p className="text-muted">{course.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/courses/${id}/students`}>
            <Button variant="secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Students
            </Button>
          </Link>
          <Link href={`/courses/${id}/edit`}>
            <Button variant="secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </Button>
          </Link>
          <DeleteCourseButton courseId={course.id} courseName={course.name} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted mb-1">Enrolled Students</p>
            <p className="text-2xl font-bold text-foreground">{course.studentCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted mb-1">Total Lessons</p>
            <p className="text-2xl font-bold text-foreground">{course.lessonCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted mb-1">Upcoming</p>
            <p className="text-2xl font-bold text-foreground">{upcomingLessons.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted mb-1">Completed</p>
            <p className="text-2xl font-bold text-foreground">{pastLessons.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Lessons */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Lessons</h2>
              <Link href={`/courses/${id}/lessons/new`}>
                <Button size="sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Lesson
                </Button>
              </Link>
            </CardHeader>
            {lessons.length === 0 ? (
              <CardContent>
                <EmptyState
                  title="No lessons yet"
                  description="Add your first lesson to this course."
                  actionLabel="Add Lesson"
                  actionHref={`/courses/${id}/lessons/new`}
                />
              </CardContent>
            ) : (
              <div className="divide-y divide-border">
                {lessons.map((lesson) => {
                  const isPast = new Date(lesson.lesson_date) < new Date()
                  return (
                    <Link
                      key={lesson.id}
                      href={`/courses/${id}/lessons/${lesson.id}`}
                      className="flex items-center justify-between px-6 py-4 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${isPast ? 'bg-secondary' : 'bg-primary/10'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isPast ? '#71717a' : course.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{lesson.title}</p>
                          <p className="text-sm text-muted">{formatDate(lesson.lesson_date)}</p>
                        </div>
                      </div>
                      <Badge variant={isPast ? 'default' : 'info'}>
                        {isPast ? 'Past' : 'Upcoming'}
                      </Badge>
                    </Link>
                  )
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Enrolled students preview */}
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Students</h2>
              <Link href={`/courses/${id}/students`}>
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            {enrollments.length === 0 ? (
              <CardContent>
                <p className="text-sm text-muted text-center py-4">No students enrolled yet</p>
              </CardContent>
            ) : (
              <div className="divide-y divide-border">
                {enrollments.slice(0, 5).map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center gap-3 px-6 py-3">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                      {(enrollment.students as unknown as { full_name: string })?.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {(enrollment.students as unknown as { full_name: string })?.full_name}
                      </p>
                    </div>
                  </div>
                ))}
                {enrollments.length > 5 && (
                  <div className="px-6 py-3 text-center">
                    <Link href={`/courses/${id}/students`} className="text-sm text-primary hover:underline">
                      +{enrollments.length - 5} more students
                    </Link>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
