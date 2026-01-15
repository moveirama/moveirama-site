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

    </nav>
  )
}
