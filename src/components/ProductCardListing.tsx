import Link from 'next/link'
import Image from 'next/image'
import type { ProductForListing } from '@/lib/supabase'

type ProductCardListingProps = {
  product: ProductForListing
}

export default function ProductCardListing({ product }: ProductCardListingProps) {
  // Calcula desconto se houver preço comparativo
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
  const discountPercent = hasDiscount 
    ? Math.round((1 - product.price / product.compare_at_price!) * 100)
    : 0

  // Formata preço
  const formatPrice = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  // Calcula parcelas (6x sem juros)
  const installmentValue = product.price / 6
  const installmentFormatted = formatPrice(installmentValue)

  // URL da imagem via Cloudinary (ou placeholder)
  const imageUrl = product.image_url
    ? `https://res.cloudinary.com/dsz5rnlvy/image/upload/c_fill,w_400,h_400,q_auto,f_auto/${product.image_url}`
    : null

  return (
    <article className="product-card-listing">
      <Link href={`/produto/${product.slug}`} className="product-card-listing__link">
        {/* Badge de desconto */}
        {hasDiscount && discountPercent >= 5 && (
          <span className="product-card-listing__badge">-{discountPercent}%</span>
        )}
        
        {/* Imagem */}
        <div className="product-card-listing__image-wrapper">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              className="product-card-listing__image"
              loading="lazy"
              width={300}
              height={300}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="product-card-listing__placeholder" aria-label="Imagem não disponível">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          )}
        </div>
        
        {/* Conteúdo */}
        <div className="product-card-listing__content">
          <h3 className="product-card-listing__title">
            {product.name}
          </h3>
          
          {/* Rating (se houver) */}
          {product.avg_rating && product.review_count ? (
            <div 
              className="product-card-listing__rating" 
              aria-label={`${product.avg_rating} de 5 estrelas, ${product.review_count} avaliações`}
            >
              <span className="product-card-listing__stars">
                {'★'.repeat(Math.round(product.avg_rating))}
                {'☆'.repeat(5 - Math.round(product.avg_rating))}
              </span>
              <span className="product-card-listing__reviews">({product.review_count})</span>
            </div>
          ) : null}
          
          {/* Preço */}
          <div className="product-card-listing__price-block">
            <p className="product-card-listing__price">{formatPrice(product.price)}</p>
            <p className="product-card-listing__installment">ou 6x {installmentFormatted}</p>
          </div>
        </div>
      </Link>

      <style jsx>{`
        .product-card-listing {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          transition: box-shadow 200ms ease-out, transform 200ms ease-out;
          position: relative;
        }
        
        .product-card-listing:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }
        
        .product-card-listing__link {
          display: block;
          text-decoration: none;
          color: inherit;
        }
        
        .product-card-listing__badge {
          position: absolute;
          top: 8px;
          left: 8px;
          z-index: 10;
          background: var(--color-terracota-500);
          color: white;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 4px;
        }
        
        .product-card-listing__image-wrapper {
          position: relative;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: var(--color-cream);
        }
        
        .product-card-listing__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 300ms ease-out;
        }
        
        .product-card-listing__placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-sand-light);
        }
        
        .product-card-listing:hover .product-card-listing__image {
          transform: scale(1.03);
        }
        
        .product-card-listing__content {
          padding: 12px;
        }
        
        @media (max-width: 767px) {
          .product-card-listing__content {
            padding: 10px;
          }
        }
        
        .product-card-listing__title {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-graphite);
          line-height: 1.3;
          margin: 0 0 6px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 36px;
        }
        
        .product-card-listing__rating {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 8px;
        }
        
        .product-card-listing__stars {
          color: var(--color-toffee);
          font-size: 12px;
          letter-spacing: -1px;
        }
        
        .product-card-listing__reviews {
          font-size: 12px;
          color: var(--color-toffee);
        }
        
        .product-card-listing__price-block {
          margin-top: auto;
        }
        
        .product-card-listing__price {
          font-size: 18px;
          font-weight: 700;
          color: var(--color-graphite);
          margin: 0;
        }
        
        @media (max-width: 767px) {
          .product-card-listing__price {
            font-size: 16px;
          }
        }
        
        .product-card-listing__installment {
          font-size: 12px;
          color: var(--color-toffee);
          margin: 2px 0 0 0;
        }
      `}</style>
    </article>
  )
}
