'use client'

import Link from 'next/link'

export type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  // Schema.org BreadcrumbList
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.label,
      ...(item.href && { 'item': `https://moveirama.com.br${item.href}` })
    }))
  }

  return (
    <>
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      {/* Visual Breadcrumb */}
      <nav aria-label="Navegação estrutural" className="breadcrumb">
        <ol className="breadcrumb__list">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            
            return (
              <li 
                key={index} 
                className={`breadcrumb__item ${isLast ? 'breadcrumb__item--current' : ''}`}
                {...(isLast && { 'aria-current': 'page' })}
              >
                {item.href && !isLast ? (
                  <>
                    <Link href={item.href} className="breadcrumb__link">
                      {item.label}
                    </Link>
                    <span className="breadcrumb__separator" aria-hidden="true">›</span>
                  </>
                ) : (
                  item.label
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      <style jsx>{`
        .breadcrumb {
          padding: var(--space-4) 0;
        }
        
        .breadcrumb__list {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--space-1);
          list-style: none;
          margin: 0;
          padding: 0;
          font-size: 14px;
        }
        
        .breadcrumb__item {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }
        
        .breadcrumb__link {
          color: var(--color-toffee);
          text-decoration: none;
          transition: color 150ms ease-out;
        }
        
        .breadcrumb__link:hover {
          color: var(--color-sage-600);
          text-decoration: underline;
        }
        
        .breadcrumb__separator {
          color: var(--color-sand-light);
        }
        
        .breadcrumb__item--current {
          color: var(--color-graphite);
          font-weight: 500;
        }
      `}</style>
    </>
  )
}
