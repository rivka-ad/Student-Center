import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStudent } from '@/actions/students'
import AppLayout from '@/components/AppLayout'
import SendEmailForm from '@/components/SendEmailForm'

interface SendEmailPageProps {
  params: Promise<{ id: string }>
}

export default async function SendEmailPage({ params }: SendEmailPageProps) {
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
          <li className="text-foreground">שלח אימייל</li>
        </ol>
      </nav>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">שלח אימייל</h1>
        <p className="text-muted mt-1">שלח אימייל ל-{student.full_name}</p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6">
          <SendEmailForm student={student} />
        </div>
      </div>
    </AppLayout>
  )
}
