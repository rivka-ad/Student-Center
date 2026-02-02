import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourse } from '@/actions/courses'
import AppLayout from '@/components/AppLayout'
import LessonForm from '@/components/LessonForm'

interface NewLessonPageProps {
  params: Promise<{ id: string }>
}

export default async function NewLessonPage({ params }: NewLessonPageProps) {
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
            <Link href={`/courses/${id}`} className="text-muted hover:text-foreground transition-colors">
              {course.name}
            </Link>
          </li>
          <li className="text-muted">/</li>
          <li className="text-foreground">New Lesson</li>
        </ol>
      </nav>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Add New Lesson</h1>
        <p className="text-muted mt-1">Schedule a new lesson for {course.name}.</p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6">
          <LessonForm courseId={id} />
        </div>
      </div>
    </AppLayout>
  )
}
