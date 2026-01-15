'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { SortOption } from '@/lib/supabase'

interface SortControlProps {
  currentSort: SortOption
  className?: string
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
  { value: 'newest', label: 'Mais recentes' },
  { value: 'bestseller', label: 'Mais vendidos' }
]

export default function SortControl({ currentSort, className = '' }: SortControlProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value as SortOption
    const params = new URLSearchParams(searchParams.toString())
    
    if (newSort === 'relevance') {
      params.delete('sort')
    } else {
      params.set('sort', newSort)
    }
    
    // Reseta para página 1 ao mudar ordenação
    params.delete('page')
    
    const query = params.toString()
    router.push(`${pathname}${query ? `?${query}` : ''}`)
  }

  return (
    <div className={`flex flex-col md:flex-row md:items-center gap-2 py-3 border-b border-[var(--color-sand-light)] ${className}`}>
      <label 
        htmlFor="sort-select" 
        className="hidden md:block text-sm font-medium text-[var(--color-graphite)] whitespace-nowrap"
      >
        Ordenar:
      </label>
      
      <div className="relative inline-flex w-full md:w-auto">
        <select
          id="sort-select"
          value={currentSort}
          onChange={handleSortChange}
          className="appearance-none w-full md:w-auto bg-white border border-[var(--color-sand-light)] rounded-lg py-2.5 pl-3 pr-9 text-sm text-[var(--color-graphite)] cursor-pointer min-h-[44px] min-w-[160px] transition-colors duration-150 hover:border-[var(--color-toffee)] focus:outline-none focus:border-[var(--color-sage-600)] focus:ring-[3px] focus:ring-[var(--color-sage-100)]"
          aria-label="Ordenar produtos"
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Ícone chevron */}
        <svg 
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-toffee)] pointer-events-none"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}
