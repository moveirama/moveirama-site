'use client'

import Link from 'next/link'
import Image from 'next/image'

interface ProductCardListingProps {
  slug: string
  name: string
  price: number
  compareAtPrice?: number | null
  imageUrl?: string | null
  avgRating?: number
  reviewCount?: number
  categorySlug: string // Slug da subcategoria para URL correta
}

export default function ProductCardListing({
  slug,
  name,
  price,
  compareAtPrice,
  imageUrl,
  avgRating = 0,
  reviewCount = 0,
  categorySlug
}: ProductCardListingProps) {
  // Calcula desconto
  const hasDiscount = compareAtPrice && compareAtPrice > price
  const discountPercent = hasDiscount 
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) 
    : 0

  // Formata preço
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  // Calcula parcelas (6x sem juros)
  const installmentValue = price / 6
  const installmentFormatted = formatPrice(installmentValue)

  // Gera estrelas
  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= Math.round(rating) ? 'text-[var(--color-toffee)]' : 'text-[var(--color-sand-light)]'}>
          ★
        </span>
      )
    }
    return stars
  }

  // URL da imagem (Cloudinary ou placeholder)
  const imageSrc = imageUrl 
    ? `https://res.cloudinary.com/moveirama/image/upload/c_fill,w_400,h_400,q_auto,f_auto/${imageUrl}`
    : '/placeholder-product.png'

  return (
    <article className="relative bg-white rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 group">
      <Link href={`/${categorySlug}/${slug}`} className="block text-inherit no-underline">
        {/* Badge de desconto */}
        {hasDiscount && (
          <span className="absolute top-2 left-2 z-10 bg-[var(--color-terracota)] text-white text-xs font-semibold px-2 py-1 rounded">
            -{discountPercent}%
          </span>
        )}

        {/* Imagem */}
        <div className="relative aspect-square overflow-hidden bg-[var(--color-cream)]">
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>

        {/* Conteúdo */}
        <div className="p-2.5 md:p-3">
          {/* Título */}
          <h3 className="text-sm font-medium text-[var(--color-graphite)] leading-tight line-clamp-2 min-h-[36px] mb-1.5">
            {name}
          </h3>

          {/* Rating (se houver) */}
          {reviewCount > 0 && (
            <div 
              className="flex items-center gap-1 mb-2 text-xs"
              aria-label={`${avgRating.toFixed(1)} de 5 estrelas, ${reviewCount} avaliações`}
            >
              <span className="flex tracking-tighter">
                {renderStars(avgRating)}
              </span>
              <span className="text-[var(--color-toffee)]">({reviewCount})</span>
            </div>
          )}

          {/* Preço */}
          <div className="mt-auto">
            <p className="text-base md:text-lg font-bold text-[var(--color-graphite)] m-0">
              {formatPrice(price)}
            </p>
            <p className="text-xs text-[var(--color-toffee)] mt-0.5 m-0">
              ou 6x {installmentFormatted}
            </p>
          </div>
        </div>
      </Link>
    </article>
  )
}
