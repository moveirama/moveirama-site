// src/components/VariantSelector.tsx
// Seletor de Variantes de Cor v1.0
// Data: 02/02/2026

'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ProductColorVariant } from '@/lib/supabase'

interface VariantSelectorProps {
  variants: ProductColorVariant[]
  currentSlug: string
  categorySlug: string
}

/**
 * Encurta nomes de cor longos para caber no layout
 * Ex: "Carvalho C / Off White" → "Carvalho/Off White"
 */
function shortenColorName(colorName: string, maxLength: number = 20): string {
  // Remove " C " (separador comum Artely)
  let shortened = colorName.replace(/ C /g, '/')
  
  // Se ainda for longo, trunca
  if (shortened.length > maxLength) {
    shortened = shortened.slice(0, maxLength - 1) + '…'
  }
  
  return shortened
}

/**
 * Gera alt text otimizado para SEO
 */
function generateAltText(productName: string, colorName: string): string {
  // Extrai nome base (sem cor)
  const baseName = productName.includes(' - ') 
    ? productName.split(' - ')[0] 
    : productName
  
  return `${baseName} na cor ${colorName}`
}

/**
 * Extrai URL da imagem do array de imagens
 */
function getImageUrl(images: { cloudinary_path: string }[] | null | undefined): string {
  if (!images || images.length === 0) {
    return '/images/placeholder-product.webp'
  }
  return images[0].cloudinary_path
}

export default function VariantSelector({ 
  variants, 
  currentSlug, 
  categorySlug 
}: VariantSelectorProps) {
  // Não renderiza se só tem 1 variante (ou nenhuma)
  if (!variants || variants.length <= 1) {
    return null
  }

  return (
    <div className="variant-selector">
      <span className="variant-selector__label">
        Cores disponíveis:
      </span>
      
      <div className="variant-selector__options">
        {variants.map((variant) => {
          const isActive = variant.slug === currentSlug
          const imageUrl = getImageUrl(variant.images)
          const shortName = shortenColorName(variant.color_name)
          const altText = generateAltText(variant.name, variant.color_name)
          
          // URL da variante (mesma subcategoria)
          const variantUrl = `/${categorySlug}/${variant.slug}`
          
          if (isActive) {
            // Variante atual: não é clicável
            return (
              <div
                key={variant.id}
                className="variant-selector__option variant-selector__option--active"
                title={variant.color_name}
                aria-current="true"
              >
                <div className="variant-selector__image-wrapper">
                  <Image
                    src={imageUrl}
                    alt={altText}
                    width={56}
                    height={56}
                    className="variant-selector__image"
                    priority // Imagem ativa tem prioridade (LCP)
                  />
                </div>
                <span className="variant-selector__name">
                  {shortName}
                </span>
              </div>
            )
          }
          
          // Outras variantes: links clicáveis
          return (
            <Link
              key={variant.id}
              href={variantUrl}
              className="variant-selector__option"
              title={`Ver ${variant.color_name}`}
            >
              <div className="variant-selector__image-wrapper">
                <Image
                  src={imageUrl}
                  alt={altText}
                  width={56}
                  height={56}
                  className="variant-selector__image"
                  loading="lazy" // Outras variantes carregam lazy
                />
              </div>
              <span className="variant-selector__name">
                {shortName}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
