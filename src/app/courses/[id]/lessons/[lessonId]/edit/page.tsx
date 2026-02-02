import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLesson } from '@/actions/lessons'
import AppLayout from '@/components/AppLayout'
import LessonForm from '@/components/LessonForm'

interface EditLessonPageProps {
  params: Promise<{ id: string; lessonId: string }>
}

export default async function EditLessonPage({ params }: EditLessonPageProps) {
  const { id, lessonId } = await params
  const lesson = await getLesson(lessonId)

  if (!lesson) {
    notFound()
  }

  const course = lesson.courses as unknown as { name: string }

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
          <li className="text-foreground">Edit</li>
        </ol>
      </nav>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Edit Lesson</h1>
        <p className="text-muted mt-1">Update the lesson details below.</p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6">
          <LessonForm courseId={id} lesson={lesson} />
        </div>
      </div>
    </AppLayout>
  )
}
