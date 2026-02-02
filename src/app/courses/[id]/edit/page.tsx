import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourse } from '@/actions/courses'
import AppLayout from '@/components/AppLayout'
import CourseForm from '@/components/CourseForm'

interface EditCoursePageProps {
  params: Promise<{ id: string }>
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params
  const course = await getCourse(id)

  if (!course) {
    notFound()
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
            <Link href={`/courses/${course.id}`} className="text-muted hover:text-foreground transition-colors">
              {course.name}
            </Link>
          </li>
          <li className="text-muted">/</li>
          <li className="text-foreground">Edit</li>
        </ol>
      </nav>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Edit Course</h1>
        <p className="text-muted mt-1">Update the course details below.</p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6">
          <CourseForm course={course} />
        </div>
      </div>
    </AppLayout>
  )
}
