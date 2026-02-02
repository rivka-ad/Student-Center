import Link from 'next/link'
import { getStudents } from '@/actions/students'
import AppLayout from '@/components/AppLayout'
import Button from '@/components/Button'
import { Card } from '@/components/Card'
import EmptyState from '@/components/EmptyState'
import StudentTableRow from '@/components/StudentTableRow'

export default async function StudentsPage() {
  const students = await getStudents()

  return (
    <AppLayout>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-muted mt-1">
            {students.length === 0
              ? 'No students yet. Add your first student to get started.'
              : `${students.length} student${students.length === 1 ? '' : 's'} total`}
          </p>
        </div>
        <Link href="/students/new">
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
            Add Student
          </Button>
        </Link>
      </div>

      {/* Students list */}
      {students.length === 0 ? (
        <EmptyState
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
          title="No students yet"
          description="Get started by adding your first student."
          actionLabel="Add Your First Student"
          actionHref="/students/new"
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted hidden md:table-cell">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((student) => (
                  <StudentTableRow key={student.id} student={student} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </AppLayout>
  )
}
