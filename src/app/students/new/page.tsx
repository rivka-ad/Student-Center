import Link from 'next/link'
import AppLayout from '@/components/AppLayout'
import StudentForm from '@/components/StudentForm'

export default function NewStudentPage() {
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
          <li className="text-foreground">תלמיד חדש</li>
        </ol>
      </nav>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">הוסף תלמיד חדש</h1>
        <p className="text-muted mt-1">מלא את הפרטים למטה כדי להוסיף תלמיד חדש.</p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6">
          <StudentForm />
        </div>
      </div>
    </AppLayout>
  )
}
