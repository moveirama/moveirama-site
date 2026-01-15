'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

type PaginationProps = {
  currentPage: number
  totalPages: number
  totalItems: number
}

export default function Pagination({ currentPage, totalPages, totalItems }: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Se só tem 1 página, não mostra paginação
  if (totalPages <= 1) return null

  // Função para gerar URL com query params preservados
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', page.toString())
    }
    const queryString = params.toString()
    return `${pathname}${queryString ? `?${queryString}` : ''}`
  }

  // Gera array de páginas a exibir
  const getVisiblePages = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = []
    
    if (totalPages <= 5) {
      // Mostra todas se 5 ou menos
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Sempre mostra primeira
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push('ellipsis')
      }
      
      // Páginas ao redor da atual
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis')
      }
      
      // Sempre mostra última
      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const visiblePages = getVisiblePages()
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <nav aria-label="Paginação" className="pagination">
      {/* Botão Anterior */}
      {hasPrev ? (
        <Link 
          href={getPageUrl(currentPage - 1)} 
          className="pagination__btn pagination__btn--prev"
          aria-label="Página anterior"
        >
          <span className="pagination__btn-icon">←</span>
          <span className="pagination__btn-text">Anterior</span>
        </Link>
      ) : (
        <span className="pagination__btn pagination__btn--prev pagination__btn--disabled" aria-disabled="true">
          <span className="pagination__btn-icon">←</span>
          <span className="pagination__btn-text">Anterior</span>
        </span>
      )}
      
      {/* Números das páginas */}
      <div className="pagination__pages">
        {visiblePages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className="pagination__ellipsis">
                ...
              </span>
            )
          }
          
          const isCurrent = page === currentPage
          
          return isCurrent ? (
            <span 
              key={page}
              className="pagination__page pagination__page--current"
              aria-current="page"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={getPageUrl(page)}
              className="pagination__page"
            >
              {page}
            </Link>
          )
        })}
      </div>
      
      {/* Botão Próxima */}
      {hasNext ? (
        <Link 
          href={getPageUrl(currentPage + 1)} 
          className="pagination__btn pagination__btn--next"
          aria-label="Próxima página"
        >
          <span className="pagination__btn-text">Próxima</span>
          <span className="pagination__btn-icon">→</span>
        </Link>
      ) : (
        <span className="pagination__btn pagination__btn--next pagination__btn--disabled" aria-disabled="true">
          <span className="pagination__btn-text">Próxima</span>
          <span className="pagination__btn-icon">→</span>
        </span>
      )}

      <style jsx>{`
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-8) 0;
        }
        
        .pagination__btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-graphite);
          background: var(--color-white);
          border: 1px solid var(--color-sand-light);
          border-radius: var(--radius-md);
          text-decoration: none;
          min-height: 44px;
          transition: all 150ms ease-out;
        }
        
        .pagination__btn:hover:not(.pagination__btn--disabled) {
          background: var(--color-cream);
          border-color: var(--color-toffee);
        }
        
        .pagination__btn--disabled {
          opacity: 0.4;
          pointer-events: none;
        }
        
        /* Mobile: esconde texto, mostra só seta */
        @media (max-width: 767px) {
          .pagination__btn {
            padding: 10px 14px;
          }
          .pagination__btn-text {
            display: none;
          }
        }
        
        .pagination__pages {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }
        
        .pagination__page {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-graphite);
          background: var(--color-white);
          border: 1px solid var(--color-sand-light);
          border-radius: var(--radius-md);
          text-decoration: none;
          transition: all 150ms ease-out;
        }
        
        .pagination__page:hover {
          background: var(--color-cream);
          border-color: var(--color-toffee);
        }
        
        .pagination__page--current {
          background: var(--color-sage-600);
          color: var(--color-white);
          border-color: var(--color-sage-600);
        }
        
        .pagination__ellipsis {
          padding: 0 var(--space-2);
          color: var(--color-toffee);
        }
      `}</style>
    </nav>
  )
}
