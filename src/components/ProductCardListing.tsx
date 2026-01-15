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

    </article>
  )
}
