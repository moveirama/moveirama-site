'use client'

import Link from 'next/link'

interface EmptyStateProps {
  title?: string
  text?: string
  ctaLabel?: string
  ctaHref?: string
}

export default function EmptyState({
  title = 'Nenhum produto encontrado',
  text = 'Esta categoria ainda não tem produtos disponíveis. Volte em breve!',
  ctaLabel = 'Ver outras categorias',
  ctaHref = '/'
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-4">
      {/* Ícone */}
      <svg 
        className="w-16 h-16 text-[var(--color-sand-light)] mb-6"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
        />
      </svg>

      {/* Título */}
      <h2 className="text-xl font-semibold text-[var(--color-graphite)] m-0 mb-2">
        {title}
      </h2>

      {/* Texto */}
      <p className="text-base text-[var(--color-toffee)] m-0 mb-6 max-w-xs">
        {text}
      </p>

      {/* CTA */}
      <Link 
        href={ctaHref} 
        className="inline-flex items-center justify-center min-w-[200px] min-h-[48px] px-6 py-3 text-base font-semibold text-[var(--color-graphite)] bg-transparent border-2 border-[var(--color-graphite)] rounded-lg no-underline transition-colors duration-150 hover:bg-[var(--color-cream)]"
      >
        {ctaLabel}
      </Link>
    </div>
  )
}
