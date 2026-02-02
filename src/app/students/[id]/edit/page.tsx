import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStudent } from '@/actions/students'
import AppLayout from '@/components/AppLayout'
import StudentForm from '@/components/StudentForm'

interface EditStudentPageProps {
  params: Promise<{ id: string }>
}

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  const { id } = await params
  const student = await getStudent(id)

  if (!student) {
    notFound()
  }

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
          <li>
            <Link
              href={`/students/${student.id}`}
              className="text-muted hover:text-foreground transition-colors"
            >
              {student.full_name}
            </Link>
          </li>
          <li className="text-muted">/</li>
          <li className="text-foreground">עריכה</li>
        </ol>
      </nav>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">ערוך תלמיד</h1>
        <p className="text-muted mt-1">עדכן את פרטי התלמיד למטה.</p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6">
          <StudentForm student={student} />
        </div>
      </div>
    </AppLayout>
  )
}
