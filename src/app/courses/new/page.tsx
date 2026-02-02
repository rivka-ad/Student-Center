import Link from 'next/link'
import AppLayout from '@/components/AppLayout'
import CourseForm from '@/components/CourseForm'

export default function NewCoursePage() {
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
          <li className="text-foreground">New Course</li>
        </ol>
      </nav>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Create New Course</h1>
        <p className="text-muted mt-1">Fill in the details below to create a new course.</p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6">
          <CourseForm />
        </div>
      </div>
    </AppLayout>
  )
}
