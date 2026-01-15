import Link from 'next/link'
import Image from 'next/image'
import type { CategoryWithCount } from '@/lib/supabase'

type SubcategoryCardProps = {
  category: CategoryWithCount
  parentSlug: string
}

export default function SubcategoryCard({ category, parentSlug }: SubcategoryCardProps) {
  // Imagem real ou null
  const imageUrl = category.image_url
    ? `https://res.cloudinary.com/dsz5rnlvy/image/upload/c_fill,w_600,h_400,q_auto,f_auto/${category.image_url}`
    : null

  // Plural de produtos
  const productText = category.product_count === 1 ? 'produto' : 'produtos'

  return (
    <article className="subcategory-card">
      <Link href={`/${parentSlug}/${category.slug}`} className="subcategory-card__link">
        {/* Imagem ou Placeholder */}
        <div className="subcategory-card__image-wrapper">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={category.name}
              className="subcategory-card__image"
              loading="lazy"
              width={600}
              height={400}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="subcategory-card__placeholder" aria-label={category.name}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
          )}
        </div>
        
        {/* Conteúdo */}
        <div className="subcategory-card__content">
          <h3 className="subcategory-card__title">{category.name}</h3>
          <p className="subcategory-card__count">
            {category.product_count} {productText}
            <span className="subcategory-card__arrow" aria-hidden="true">→</span>
          </p>
        </div>
      </Link>

      <style jsx>{`
        .subcategory-card {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          transition: box-shadow 200ms ease-out, transform 200ms ease-out;
        }
        
        .subcategory-card:hover {
          box-shadow: 0 6px 16px rgba(0,0,0,0.12);
          transform: translateY(-4px);
        }
        
        .subcategory-card__link {
          display: block;
          text-decoration: none;
          color: inherit;
        }
        
        .subcategory-card__image-wrapper {
          aspect-ratio: 3 / 2;
          overflow: hidden;
          background: var(--color-cream);
        }
        
        .subcategory-card__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 400ms ease-out;
        }
        
        .subcategory-card__placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-sand-light);
        }
        
        .subcategory-card:hover .subcategory-card__image {
          transform: scale(1.05);
        }
        
        .subcategory-card__content {
          padding: 16px;
        }
        
        .subcategory-card__title {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-graphite);
          margin: 0 0 4px 0;
        }
        
        .subcategory-card__count {
          font-size: 14px;
          color: var(--color-toffee);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .subcategory-card__arrow {
          transition: transform 200ms ease-out;
        }
        
        .subcategory-card:hover .subcategory-card__arrow {
          transform: translateX(4px);
        }
      `}</style>
    </article>
  )
}
