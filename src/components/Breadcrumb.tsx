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


    </>
  )
}
