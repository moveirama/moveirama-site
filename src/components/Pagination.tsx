'use client'

import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string>
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  baseUrl,
  searchParams = {}
}: PaginationProps) {
  // Se só tem 1 página, não mostra paginação
  if (totalPages <= 1) return null

  // Gera URL com query params
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams()
    
    // Mantém outros params (como sort)
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== 'page' && value) {
        params.set(key, value)
      }
    })
    
    // Adiciona página se não for 1
    if (page > 1) {
      params.set('page', page.toString())
    }
    
    const query = params.toString()
    return `${baseUrl}${query ? `?${query}` : ''}`
  }

  // Gera array de páginas para mostrar
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    
    if (totalPages <= 5) {
      // Mostra todas se tiver até 5
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
        pages.push(i)
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis')
      }
      
      // Sempre mostra última
      pages.push(totalPages)
    }
    
    return pages
  }

  const pages = getPageNumbers()
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <nav aria-label="Paginação" className="pagination">
      {/* Anterior */}
      {hasPrev ? (
        <Link 
          href={getPageUrl(currentPage - 1)}
          className="pagination__btn"
          aria-label="Página anterior"
        >
          <span className="hidden md:inline">←</span>
          <span className="md:hidden">←</span>
          <span className="hidden md:inline ml-1">Anterior</span>
        </Link>
      ) : (
        <span className="pagination__btn pagination__btn--disabled" aria-hidden="true">
          <span className="hidden md:inline">←</span>
          <span className="md:hidden">←</span>
          <span className="hidden md:inline ml-1">Anterior</span>
        </span>
      )}

      {/* Números das páginas */}
      <div className="pagination__pages">
        {pages.map((page, index) => {
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

      {/* Próxima */}
      {hasNext ? (
        <Link 
          href={getPageUrl(currentPage + 1)}
          className="pagination__btn"
          aria-label="Próxima página"
        >
          <span className="hidden md:inline mr-1">Próxima</span>
          <span className="hidden md:inline">→</span>
          <span className="md:hidden">→</span>
        </Link>
      ) : (
        <span className="pagination__btn pagination__btn--disabled" aria-hidden="true">
          <span className="hidden md:inline mr-1">Próxima</span>
          <span className="hidden md:inline">→</span>
          <span className="md:hidden">→</span>
        </span>
      )}

      <style jsx>{`
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          padding: 32px 0;
        }
        
        .pagination__btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-graphite);
          background: var(--color-white);
          border: 1px solid var(--color-sand-light);
          border-radius: 8px;
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
        
        @media (max-width: 767px) {
          .pagination__btn {
            padding: 10px 14px;
          }
        }
        
        .pagination__pages {
          display: flex;
          align-items: center;
          gap: 4px;
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
          border-radius: 8px;
          text-decoration: none;
          transition: all 150ms ease-out;
        }
        
        .pagination__page:hover:not(.pagination__page--current) {
          background: var(--color-cream);
          border-color: var(--color-toffee);
        }
        
        .pagination__page--current {
          background: var(--color-sage-600);
          color: var(--color-white);
          border-color: var(--color-sage-600);
        }
        
        .pagination__ellipsis {
          padding: 0 8px;
          color: var(--color-toffee);
        }
      `}</style>
    </nav>
  )
}
