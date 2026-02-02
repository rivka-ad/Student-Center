'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface SortableHeaderProps {
  field: string
  currentSort?: string
  currentOrder?: string
  children: React.ReactNode
}

export default function SortableHeader({
  field,
  currentSort,
  currentOrder,
  children,
}: SortableHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const isActive = currentSort === field
  const nextOrder = isActive && currentOrder === 'asc' ? 'desc' : 'asc'

  const handleSort = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', field)
    params.set('order', isActive ? nextOrder : 'asc')
    router.push(`/attendance?${params.toString()}`)
  }, [field, isActive, nextOrder, router, searchParams])

  return (
    <th className="px-6 py-4 text-left">
      <button
        onClick={handleSort}
        className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted hover:text-foreground transition-colors"
      >
        {children}
        <span className="flex flex-col">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`-mb-1 ${isActive && currentOrder === 'asc' ? 'text-primary' : 'text-border'}`}
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${isActive && currentOrder === 'desc' ? 'text-primary' : 'text-border'}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
    </th>
  )
}
