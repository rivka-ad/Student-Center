import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStudent } from '@/actions/students'
import { getEmailLogs } from '@/actions/email'
import { getEnrollmentsByStudent } from '@/actions/enrollments'
import { getAttendanceStats } from '@/actions/attendance'
import AppLayout from '@/components/AppLayout'
import Button from '@/components/Button'
import Badge from '@/components/Badge'
import { Card, CardHeader, CardContent } from '@/components/Card'
import DeleteStudentButton from '@/components/DeleteStudentButton'
import SendEmailButton from '@/components/SendEmailButton'

interface StudentPageProps {
  params: Promise<{ id: string }>
}

export default async function StudentPage({ params }: StudentPageProps) {
  const { id } = await params
  const student = await getStudent(id)

  if (!student) {
    notFound()
  }

  const [emailLogs, enrollments, attendanceStats] = await Promise.all([
    getEmailLogs(id),
    getEnrollmentsByStudent(id),
    getAttendanceStats(undefined, id),
  ])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
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
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link href="/students" className="text-muted hover:text-foreground transition-colors">
              תלמידים
            </Link>
          </li>
          <li className="text-muted">/</li>
          <li className="text-foreground">{student.full_name}</li>
        </ol>
      </nav>

      {/* Student details card */}
      <Card className="mb-8">
        <div className="px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white text-xl font-semibold">
              {student.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{student.full_name}</h1>
              <p className="text-muted">{student.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SendEmailButton student={student} />
            <Link href={`/students/${student.id}/edit`}>
              <Button variant="secondary">
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
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                ערוך
              </Button>
            </Link>
            <DeleteStudentButton studentId={student.id} studentName={student.full_name} />
          </div>
        </div>

        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-medium text-muted mb-1">אימייל</dt>
              <dd className="text-foreground">
                <a href={`mailto:${student.email}`} className="hover:text-primary transition-colors">
                  {student.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted mb-1">טלפון</dt>
              <dd className="text-foreground">
                {student.phone ? (
                  <a href={`tel:${student.phone}`} className="hover:text-primary transition-colors">
                    {student.phone}
                  </a>
                ) : (
                  <span className="text-muted">לא סופק</span>
                )}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-muted mb-1">הערות</dt>
              <dd className="text-foreground whitespace-pre-wrap">
                {student.notes || <span className="text-muted">אין הערות</span>}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted mb-1">נוסף</dt>
              <dd className="text-foreground">{formatDate(student.created_at)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted mb-1">קורסים רשומים</p>
            <p className="text-2xl font-bold text-foreground">{enrollments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted mb-1">אחוז נוכחות</p>
            <p className="text-2xl font-bold text-foreground">{attendanceRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted mb-1">נוכח</p>
            <p className="text-2xl font-bold text-success">{attendanceStats.present}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted mb-1">נעדר</p>
            <p className="text-2xl font-bold text-error">{attendanceStats.absent}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Enrolled courses */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">קורסים רשומים</h2>
          </CardHeader>
          {enrollments.length === 0 ? (
            <CardContent className="py-8 text-center">
              <p className="text-muted">לא רשום לאף קורס</p>
            </CardContent>
          ) : (
            <div className="divide-y divide-border">
              {enrollments.map((enrollment) => {
                const course = enrollment.courses as unknown as { id: string; name: string; color: string }
                return (
                  <Link
                    key={enrollment.id}
                    href={`/courses/${course?.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors"
                  >
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: (course?.color || '#6366f1') + '20' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={course?.color || '#6366f1'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{course?.name}</p>
                      <p className="text-sm text-muted">
                        נרשם {new Date(enrollment.enrolled_at).toLocaleDateString('he-IL')}
                      </p>
                    </div>
                    <Badge variant={enrollment.status === 'active' ? 'success' : 'default'}>
                      {enrollment.status}
                    </Badge>
                  </Link>
                )
              })}
            </div>
          )}
        </Card>

        {/* Email history */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">היסטוריית אימיילים</h2>
          </CardHeader>
          
          {emailLogs.length === 0 ? (
            <CardContent className="py-8 text-center">
              <p className="text-muted">עדיין לא נשלחו אימיילים</p>
            </CardContent>
          ) : (
            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {emailLogs.map((log) => (
                <div key={log.id} className="px-6 py-4 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground truncate">
                          {log.subject}
                        </span>
                        <Badge variant={log.status === 'sent' ? 'success' : 'error'}>
                          {log.status === 'sent' ? 'נשלח' : 'נכשל'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted line-clamp-2">{log.body}</p>
                    </div>
                    <span className="text-sm text-muted whitespace-nowrap">
                      {new Date(log.sent_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
