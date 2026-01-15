'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

type SortControlProps = {
  currentSort: string
}

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
  { value: 'newest', label: 'Mais recentes' },
  { value: 'bestseller', label: 'Mais vendidos' },
]

export default function SortControl({ currentSort }: SortControlProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    
    if (newSort === 'relevance') {
      params.delete('sort')
    } else {
      params.set('sort', newSort)
    }
    
    // Reset para página 1 quando muda ordenação
    params.delete('page')
    
    const queryString = params.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`)
  }, [pathname, router, searchParams])

  return (
    <div className="sort-control">
      <label htmlFor="sort-select" className="sort-control__label">Ordenar:</label>
      <div className="sort-control__wrapper">
        <select 
          id="sort-select" 
          className="sort-control__select"
          value={currentSort}
          onChange={handleSortChange}
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg 
          className="sort-control__icon" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

    </div>
  )
}
