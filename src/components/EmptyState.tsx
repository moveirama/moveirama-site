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

      <style jsx>{`
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 64px 16px;
        }
        
        .empty-state__icon {
          width: 64px;
          height: 64px;
          color: var(--color-sand-light);
          margin-bottom: 24px;
        }
        
        .empty-state__title {
          font-size: 20px;
          font-weight: 600;
          color: var(--color-graphite);
          margin: 0 0 8px 0;
        }
        
        .empty-state__text {
          font-size: 16px;
          color: var(--color-toffee);
          margin: 0 0 24px 0;
          max-width: 320px;
        }
        
        .empty-state__btn {
          min-width: 200px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 12px 24px;
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-graphite);
          background-color: transparent;
          border: 2px solid var(--color-graphite);
          border-radius: var(--radius-md);
          text-decoration: none;
          transition: background-color 150ms ease-out;
        }
        
        .empty-state__btn:hover {
          background-color: var(--color-cream);
        }
      `}</style>
    </div>
  )
}
