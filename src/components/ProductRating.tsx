'use client'

import { Star } from 'lucide-react'

/**
 * ProductRating — Componente de avaliação (estrelinhas) para Hero da PDP
 * 
 * Specs: SPEC_ProductRating_Hero_PDP.md
 * Squad Visual → Squad Dev — Janeiro 2026
 * 
 * Posição: Abaixo do H1, acima do preço
 * 
 * Estados:
 * - Default: estrelas + nota + quantidade (clicável)
 * - Sem avaliações: estrelas vazias + "Seja o primeiro a avaliar"
 * - Loading: skeleton shimmer
 */

interface ProductRatingProps {
  /** Nota média (0-5, ex: 4.7) */
  rating: number
  /** Quantidade de avaliações */
  totalReviews: number
  /** ID do produto para analytics */
  productId?: string
  /** Estado de carregamento */
  isLoading?: boolean
}

export function ProductRating({ 
  rating, 
  totalReviews, 
  productId,
  isLoading = false 
}: ProductRatingProps) {
  
  // Estado: Loading
  if (isLoading) {
    return (
      <div className="inline-flex items-center py-1 mt-2 mb-3 min-h-[44px]">
        <div 
          className="w-[180px] h-5 rounded animate-pulse"
          style={{
            background: 'linear-gradient(90deg, #E0E0E0 25%, #EBEBEB 50%, #E0E0E0 75%)',
            backgroundSize: '200% 100%',
            animation: 'skeleton-shimmer 1.5s infinite'
          }}
          aria-label="Carregando avaliações..."
        />
      </div>
    )
  }

  // Estado: Sem avaliações
  if (totalReviews === 0 || !rating) {
    return (
      <a 
        href="#avaliacoes" 
        className="group inline-flex items-center gap-2 py-1 mt-2 mb-3 min-h-[44px] 
                   transition-opacity hover:opacity-80
                   focus-visible:outline-2 focus-visible:outline-[#6B8E7A] 
                   focus-visible:outline-offset-2 focus-visible:rounded"
        aria-label="Este produto ainda não tem avaliações. Clique para ser o primeiro a avaliar."
      >
        {/* Estrelas vazias */}
        <div className="flex items-center gap-0.5" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star 
              key={i} 
              className="w-4 h-4 text-[#E0E0E0]" 
              strokeWidth={2}
              fill="none"
            />
          ))}
        </div>
        
        {/* CTA */}
        <span className="text-sm text-[#6B8E7A] underline underline-offset-2 group-hover:text-[#5A7A68]">
          Seja o primeiro a avaliar
        </span>
      </a>
    )
  }

  // Calcula estrelas preenchidas
  const fullStars = Math.floor(rating)
  const hasPartialStar = rating % 1 >= 0.3 // Mostra parcial se >= 0.3
  const partialFill = Math.round((rating % 1) * 100)
  
  // Formata nota com 1 casa decimal (4.7, não 4.70)
  const formattedRating = rating.toFixed(1).replace(/\.0$/, '')
  
  // Plural/singular
  const reviewLabel = totalReviews === 1 ? 'avaliação' : 'avaliações'

  return (
    <a 
      href="#avaliacoes" 
      className="inline-flex items-center gap-2 py-1 mt-2 mb-3 min-h-[44px] 
                 transition-opacity hover:opacity-80
                 focus-visible:outline-2 focus-visible:outline-[#6B8E7A] 
                 focus-visible:outline-offset-2 focus-visible:rounded"
      aria-label={`Avaliação ${formattedRating} de 5 estrelas, baseado em ${totalReviews} ${reviewLabel}. Clique para ver detalhes.`}
      data-product-id={productId}
    >
      {/* Estrelas */}
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => {
          const isFilled = i <= fullStars
          const isPartial = i === fullStars + 1 && hasPartialStar
          
          if (isFilled) {
            return (
              <Star 
                key={i} 
                className="w-4 h-4 text-[#F5A623]" 
                fill="#F5A623"
                strokeWidth={0}
              />
            )
          }
          
          if (isPartial) {
            return (
              <div key={i} className="relative w-4 h-4">
                {/* Base vazia */}
                <Star 
                  className="absolute inset-0 w-4 h-4 text-[#E0E0E0]" 
                  strokeWidth={2}
                  fill="none"
                />
                {/* Preenchimento parcial */}
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${partialFill}%` }}
                >
                  <Star 
                    className="w-4 h-4 text-[#F5A623]" 
                    fill="#F5A623"
                    strokeWidth={0}
                  />
                </div>
              </div>
            )
          }
          
          return (
            <Star 
              key={i} 
              className="w-4 h-4 text-[#E0E0E0]" 
              strokeWidth={2}
              fill="none"
            />
          )
        })}
      </div>
      
      {/* Nota numérica */}
      <span className="text-sm font-semibold text-[#2D2D2D]">
        {formattedRating}
      </span>
      
      {/* Quantidade */}
      <span className="text-sm text-[#4A4A4A]">
        ({totalReviews} {reviewLabel})
      </span>
    </a>
  )
}

export default ProductRating
