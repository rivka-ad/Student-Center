import { Suspense } from 'react'
import AppLayout from '@/components/AppLayout'
import AttendanceFilters from '@/components/AttendanceFilters'
import AttendanceTable from '@/components/AttendanceTable'
import { getCourses } from '@/actions/courses'
import { getStudents } from '@/actions/students'

interface AttendancePageProps {
  searchParams: Promise<{
    course?: string
    student?: string
    status?: string
    from?: string
    to?: string
    sort?: string
    order?: string
  }>
}

export default async function AttendancePage({ searchParams }: AttendancePageProps) {
  const params = await searchParams
  const [courses, students] = await Promise.all([
    getCourses(),
    getStudents(),
  ])

  return (
    <AppLayout>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">רשומות נוכחות</h1>
        <p className="text-muted mt-1">
          צפה וסנן רשומות נוכחות בכל הקורסים והתלמידים.
        </p>
      </div>

      {/* Filters */}
      <AttendanceFilters
        courses={courses}
        students={students}
        currentFilters={params}
      />

      {/* Table */}
      <Suspense fallback={<AttendanceTableSkeleton />}>
        <AttendanceTable filters={params} />
      </Suspense>
    </AppLayout>
  )
}

function AttendanceTableSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden animate-pulse">
      <div className="h-12 bg-secondary/50" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 border-t border-border bg-card" />
      ))}
    </div>
  )
}
