import Link from 'next/link'
import { Student } from '@/types/database'

interface StudentTableRowProps {
  student: Student
}

export default function StudentTableRow({ student }: StudentTableRowProps) {
  return (
    <tr className="hover:bg-secondary/30 transition-colors">
      <td className="px-6 py-4">
        <Link
          href={`/students/${student.id}`}
          className="font-medium text-foreground hover:text-primary transition-colors"
        >
          {student.full_name}
        </Link>
      </td>
      <td className="px-6 py-4 text-muted">
        {student.email}
      </td>
      <td className="px-6 py-4 text-muted hidden md:table-cell">
        {student.phone || '—'}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/students/${student.id}`}
            className="inline-flex items-center justify-center rounded-lg p-2 text-muted hover:bg-secondary hover:text-foreground transition-colors"
            title="View student"
          >
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
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </Link>
          <Link
            href={`/students/${student.id}/edit`}
            className="inline-flex items-center justify-center rounded-lg p-2 text-muted hover:bg-secondary hover:text-foreground transition-colors"
            title="Edit student"
          >
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
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </Link>
        </div>
      </td>
    </tr>
  )
}
