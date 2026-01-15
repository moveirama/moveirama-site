import Link from 'next/link'

export type BreadcrumbItem = {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  // Gera Schema.org BreadcrumbList
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `https://moveirama.com.br${item.href}` })
    }))
  }

  return (
    <>
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Visual */}
      <nav 
        aria-label="Navegação estrutural" 
        className={`py-4 ${className}`}
      >
        <ol className="flex flex-wrap items-center gap-1 text-sm list-none m-0 p-0">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            
            return (
              <li key={index} className="flex items-center gap-1">
                {item.href && !isLast ? (
                  <>
                    <Link 
                      href={item.href}
                      className="text-[var(--color-toffee)] hover:text-[var(--color-sage-600)] hover:underline transition-colors duration-150"
                    >
                      {item.label}
                    </Link>
                    <span 
                      className="text-[var(--color-sand-light)]" 
                      aria-hidden="true"
                    >
                      ›
                    </span>
                  </>
                ) : (
                  <span 
                    className="text-[var(--color-graphite)] font-medium"
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
