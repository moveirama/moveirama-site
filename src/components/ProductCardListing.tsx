'use client'

import Link from 'next/link'
import Image from 'next/image'
import { generateProductH1, inferCategoryType } from '@/lib/seo'

interface ProductCardListingProps {
  slug: string
  name: string
  price: number
  compareAtPrice?: number | null
  imageUrl?: string | null
  avgRating?: number
  reviewCount?: number
  categorySlug: string // Slug da subcategoria para URL correta
  tvMaxSize?: number | null // Para gerar título SEO otimizado
}

export default function ProductCardListing({
  slug,
  name,
  price,
  compareAtPrice,
  imageUrl,
  avgRating = 0,
  reviewCount = 0,
  categorySlug,
  tvMaxSize
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

  // URL da imagem (Cloudinary ou placeholder SVG inline)
  const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23F0E8DF' width='400' height='400'/%3E%3Ctext x='50%25' y='45%25' fill='%238B7355' font-family='sans-serif' font-size='48' text-anchor='middle'%3E📦%3C/text%3E%3Ctext x='50%25' y='60%25' fill='%238B7355' font-family='sans-serif' font-size='14' text-anchor='middle'%3EImagem em breve%3C/text%3E%3C/svg%3E`
  
  const imageSrc = imageUrl 
  ? (imageUrl.startsWith('http') ? imageUrl : `https://res.cloudinary.com/moveirama/image/upload/c_fill,w_400,h_400,q_auto,f_auto/${imageUrl}`)
  : placeholderSvg

  // SEO: Gera título otimizado com compatibilidade TV
  const categoryType = inferCategoryType(slug, categorySlug)
  const displayTitle = generateProductH1({
    name,
    tv_max_size: tvMaxSize,
    category_type: categoryType,
    variant_name: null // Cor já está no name
  })

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
            alt={displayTitle}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>

        {/* Conteúdo */}
        <div className="p-2.5 md:p-3">
          {/* Título - SEO otimizado */}
          <h3 className="text-sm font-medium text-[var(--color-graphite)] leading-tight line-clamp-2 min-h-[36px] mb-1.5">
            {displayTitle}
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
