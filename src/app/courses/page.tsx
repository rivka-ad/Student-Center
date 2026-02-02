import Link from 'next/link'
import { getCourses } from '@/actions/courses'
import AppLayout from '@/components/AppLayout'
import Button from '@/components/Button'
import Badge from '@/components/Badge'
import EmptyState from '@/components/EmptyState'
import { Card } from '@/components/Card'

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <AppLayout>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Courses</h1>
          <p className="text-muted mt-1">
            {courses.length === 0
              ? 'No courses yet. Create your first course to get started.'
              : `${courses.length} course${courses.length === 1 ? '' : 's'} total`}
          </p>
        </div>
        <Link href="/courses/new">
          <Button>
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
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Course
          </Button>
        </Link>
      </div>

      {/* Courses grid */}
      {courses.length === 0 ? (
        <EmptyState
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          }
          title="No courses yet"
          description="Get started by creating your first course."
          actionLabel="Create Your First Course"
          actionHref="/courses/new"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <Card className="h-full hover:border-primary/50 transition-colors">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: course.color + '20' }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
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
                    <Badge variant={course.is_active ? 'success' : 'default'}>
                      {course.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{course.name}</h3>
                  {course.description && (
                    <p className="text-sm text-muted line-clamp-2 mb-4">{course.description}</p>
                  )}
                  {(course.start_date || course.end_date) && (
                    <div className="text-xs text-muted">
                      {course.start_date && (
                        <span>
                          {new Date(course.start_date).toLocaleDateString()}
                        </span>
                      )}
                      {course.start_date && course.end_date && <span> - </span>}
                      {course.end_date && (
                        <span>
                          {new Date(course.end_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
