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

  const btnBaseStyles = "flex items-center justify-center px-4 py-2.5 text-sm font-medium text-[var(--color-graphite)] bg-white border border-[var(--color-sand-light)] rounded-lg no-underline min-h-[44px] transition-all duration-150 hover:bg-[var(--color-cream)] hover:border-[var(--color-toffee)]"
  const btnDisabledStyles = "opacity-40 pointer-events-none"
  const pageBaseStyles = "flex items-center justify-center w-10 h-10 text-sm font-medium text-[var(--color-graphite)] bg-white border border-[var(--color-sand-light)] rounded-lg no-underline transition-all duration-150 hover:bg-[var(--color-cream)] hover:border-[var(--color-toffee)]"
  const pageCurrentStyles = "bg-[var(--color-sage-600)] text-white border-[var(--color-sage-600)]"

  return (
    <nav aria-label="Paginação" className="flex justify-center items-center gap-2 py-8">
      {/* Anterior */}
      {hasPrev ? (
        <Link 
          href={getPageUrl(currentPage - 1)}
          className={btnBaseStyles}
          aria-label="Página anterior"
        >
          <span className="md:hidden">←</span>
          <span className="hidden md:inline">← Anterior</span>
        </Link>
      ) : (
        <span className={`${btnBaseStyles} ${btnDisabledStyles}`} aria-hidden="true">
          <span className="md:hidden">←</span>
          <span className="hidden md:inline">← Anterior</span>
        </span>
      )}

      {/* Números das páginas */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-[var(--color-toffee)]">
                ...
              </span>
            )
          }

          const isCurrent = page === currentPage
          
          return isCurrent ? (
            <span 
              key={page}
              className={`${pageBaseStyles} ${pageCurrentStyles}`}
              aria-current="page"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={getPageUrl(page)}
              className={pageBaseStyles}
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
          className={btnBaseStyles}
          aria-label="Próxima página"
        >
          <span className="hidden md:inline">Próxima →</span>
          <span className="md:hidden">→</span>
        </Link>
      ) : (
        <span className={`${btnBaseStyles} ${btnDisabledStyles}`} aria-hidden="true">
          <span className="hidden md:inline">Próxima →</span>
          <span className="md:hidden">→</span>
        </span>
      )}
    </nav>
  )
}
