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

      <style jsx>{`
        .sort-control {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) 0;
          border-bottom: 1px solid var(--color-sand-light);
        }
        
        /* Mobile: ocupa largura total */
        @media (max-width: 767px) {
          .sort-control {
            flex-direction: column;
            align-items: stretch;
          }
        }
        
        .sort-control__label {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-graphite);
          white-space: nowrap;
        }
        
        /* Mobile: esconde label */
        @media (max-width: 767px) {
          .sort-control__label {
            display: none;
          }
        }
        
        .sort-control__wrapper {
          position: relative;
          display: inline-flex;
        }
        
        @media (max-width: 767px) {
          .sort-control__wrapper {
            display: flex;
          }
        }
        
        .sort-control__select {
          appearance: none;
          background: var(--color-white);
          border: 1px solid var(--color-sand-light);
          border-radius: var(--radius-md);
          padding: 10px 36px 10px 12px;
          font-size: 14px;
          font-family: inherit;
          color: var(--color-graphite);
          cursor: pointer;
          min-height: 44px;
          min-width: 160px;
          transition: border-color 150ms ease-out;
        }
        
        @media (max-width: 767px) {
          .sort-control__select {
            width: 100%;
          }
        }
        
        .sort-control__select:hover {
          border-color: var(--color-toffee);
        }
        
        .sort-control__select:focus {
          outline: none;
          border-color: var(--color-sage-600);
          box-shadow: 0 0 0 3px rgba(107, 142, 122, 0.2);
        }
        
        .sort-control__icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: var(--color-toffee);
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
