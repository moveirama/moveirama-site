'use client'

import Link from 'next/link'
import Image from 'next/image'

interface SubcategoryCardProps {
  name: string
  slug: string
  parentSlug: string
  imageUrl?: string | null
  productCount: number
}

export default function SubcategoryCard({
  name,
  slug,
  parentSlug,
  imageUrl,
  productCount
}: SubcategoryCardProps) {
  // URL da imagem (Cloudinary ou placeholder)
  const imageSrc = imageUrl 
    ? `https://res.cloudinary.com/moveirama/image/upload/c_fill,w_600,h_400,q_auto,f_auto/${imageUrl}`
    : '/placeholder-category.png'

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-200 hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] hover:-translate-y-1 group">
      <Link 
        href={`/${parentSlug}/${slug}`} 
        className="block text-inherit no-underline"
      >
        {/* Imagem */}
        <div className="relative aspect-[3/2] overflow-hidden bg-[var(--color-cream)]">
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-[400ms] group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Conteúdo */}
        <div className="p-4">
          <h3 className="text-base font-semibold text-[var(--color-graphite)] m-0 mb-1">
            {name}
          </h3>
          <p className="text-sm text-[var(--color-toffee)] m-0 flex items-center gap-1">
            {productCount} {productCount === 1 ? 'produto' : 'produtos'}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </p>
        </div>
      </Link>
    </article>
  )
}
