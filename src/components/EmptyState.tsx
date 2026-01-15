import Link from 'next/link'

type EmptyStateProps = {
  title?: string
  message?: string
  linkHref?: string
  linkText?: string
}

export default function EmptyState({ 
  title = 'Nenhum produto encontrado',
  message = 'Esta categoria ainda não tem produtos disponíveis. Volte em breve!',
  linkHref = '/',
  linkText = 'Ver outras categorias'
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <svg 
        className="empty-state__icon" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
        />
      </svg>
      <h2 className="empty-state__title">{title}</h2>
      <p className="empty-state__text">{message}</p>
      <Link href={linkHref} className="empty-state__btn btn-secondary">
        {linkText}
      </Link>

    </div>
  )
}
