import Link from 'next/link'
import { getStudents } from '@/actions/students'
import { getCourses } from '@/actions/courses'
import { getUpcomingLessons } from '@/actions/lessons'
import { getAttendanceStats } from '@/actions/attendance'
import AppLayout from '@/components/AppLayout'
import Button from '@/components/Button'
import Badge from '@/components/Badge'
import { Card, CardHeader, CardContent } from '@/components/Card'

export default async function DashboardPage() {
  const [students, courses, upcomingLessons, attendanceStats] = await Promise.all([
    getStudents(),
    getCourses(),
    getUpcomingLessons(5),
    getAttendanceStats(),
  ])

  const activeCourses = courses.filter(c => c.is_active)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const attendanceRate = attendanceStats.total > 0
    ? Math.round(((attendanceStats.present + attendanceStats.late) / attendanceStats.total) * 100)
    : 0

  return (
    <AppLayout>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">לוח בקרה</h1>
        <p className="text-muted mt-1">ברוך הבא! הנה סקירה של מרכז התלמידים שלך.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">סה"כ תלמידים</p>
                <p className="text-2xl font-bold text-foreground">{students.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">קורסים פעילים</p>
                <p className="text-2xl font-bold text-foreground">{activeCourses.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">שיעורים קרובים</p>
                <p className="text-2xl font-bold text-foreground">{upcomingLessons.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">אחוז נוכחות</p>
                <p className="text-2xl font-bold text-foreground">{attendanceRate}%</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  <path d="m9 14 2 2 4-4" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Upcoming lessons */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">שיעורים קרובים</h2>
            <Link href="/courses">
              <Button variant="ghost" size="sm">צפה בכל הקורסים</Button>
            </Link>
          </CardHeader>
          {upcomingLessons.length === 0 ? (
            <CardContent className="py-8 text-center">
              <p className="text-muted">אין שיעורים קרובים מתוכננים</p>
            </CardContent>
          ) : (
            <div className="divide-y divide-border">
              {upcomingLessons.map((lesson) => {
                const course = lesson.courses as unknown as { id: string; name: string; color: string }
                return (
                  <Link
                    key={lesson.id}
                    href={`/courses/${course?.id}/lessons/${lesson.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors"
                  >
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: (course?.color || '#6366f1') + '20' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={course?.color || '#6366f1'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{lesson.title}</p>
                      <p className="text-sm text-muted">{course?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-foreground">{formatDate(lesson.lesson_date)}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </Card>

        {/* Recent students */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">תלמידים אחרונים</h2>
            <Link href="/students">
              <Button variant="ghost" size="sm">צפה בהכל</Button>
            </Link>
          </CardHeader>
          {students.length === 0 ? (
            <CardContent className="py-8 text-center">
              <p className="text-muted mb-4">עדיין לא נוספו תלמידים</p>
              <Link href="/students/new">
                <Button size="sm">הוסף את התלמיד הראשון שלך</Button>
              </Link>
            </CardContent>
          ) : (
            <div className="divide-y divide-border">
              {students.slice(0, 5).map((student) => (
                <Link
                  key={student.id}
                  href={`/students/${student.id}`}
                  className="flex items-center gap-3 px-6 py-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                    {student.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{student.full_name}</p>
                    <p className="text-sm text-muted truncate">{student.email}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">פעולות מהירות</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/students/new">
            <Button variant="secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              הוסף תלמיד
            </Button>
          </Link>
          <Link href="/courses/new">
            <Button variant="secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <line x1="12" y1="6" x2="12" y2="12" />
                <line x1="9" y1="9" x2="15" y2="9" />
              </svg>
              צור קורס
            </Button>
          </Link>
          <Link href="/attendance">
            <Button variant="secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <path d="m9 14 2 2 4-4" />
              </svg>
              צפה בנוכחות
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}
