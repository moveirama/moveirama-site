'use client'

/**
 * QueridinhoCard.tsx - Card individual do carrossel
 * Squad Dev - Fevereiro 2026
 * 
 * Client Component para interatividade com "Minha Lista"
 * 
 * @since v2.8
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trophy, Heart, Truck } from 'lucide-react'
import { type BestSellerProduct } from '@/lib/supabase'
import { 
  isInLista, 
  toggleItem, 
  subscribeToStorageChanges,
  type ListaItem 
} from '@/lib/minha-lista'

// ============================================
// HELPERS
// ============================================

function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatInstallment(price: number): { count: number; value: string } {
  // Calcula melhor parcelamento (máximo 10x, mínimo R$30 por parcela)
  let count = 10
  while (count > 1 && price / count < 30) {
    count--
  }
  
  const value = (price / count).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  
  return { count, value }
}

// ============================================
// COMPONENTE
// ============================================

interface QueridinhoCardProps {
  product: BestSellerProduct
  index: number
}

export function QueridinhoCard({ product, index }: QueridinhoCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Verifica se está na lista ao montar e sincroniza
  useEffect(() => {
    setIsHydrated(true)
    setIsSaved(isInLista(product.id))

    // Escuta mudanças na lista (outras abas ou mesmo componente)
    const unsubscribe = subscribeToStorageChanges(() => {
      setIsSaved(isInLista(product.id))
    })

    return unsubscribe
  }, [product.id])

  // Toggle favorito
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const item: Omit<ListaItem, 'savedAt'> = {
      id: product.id,
      name: product.name,
      price: product.price.toFixed(2).replace('.', ','),
      width: '0', // Não temos largura aqui, mas é obrigatório
      slug: product.slug,
      subcategorySlug: product.categorySlug || '',
      imageUrl: product.imageUrl || '',
    }

    const result = toggleItem(item)
    setIsSaved(result.added)
  }

  // URL do produto
  const productUrl = `/${product.categorySlug || 'produtos'}/${product.slug}`
  
  // Parcelamento
  const installment = formatInstallment(product.price)

  return (
    <article className="queridinhos__card">
      {/* Área da Imagem */}
      <Link href={productUrl} className="queridinhos__image-link">
        <div className="queridinhos__image-container">
          
          {/* Badge Superior Esquerdo */}
          {product.badgeType === 'top-sales' && (
            <span className="queridinhos__badge queridinhos__badge--top-sales">
              <Trophy className="queridinhos__badge-icon" />
              Top 1 Vendas
            </span>
          )}
          
          {product.badgeType === 'favorite' && (
            <span className="queridinhos__badge queridinhos__badge--favorite">
              <Heart className="queridinhos__badge-icon" />
              Favorito Curitibano
            </span>
          )}
          
          {/* Botão Wishlist (coração) */}
          {isHydrated && (
            <button
              className={`queridinhos__wishlist ${isSaved ? 'queridinhos__wishlist--active' : ''}`}
              aria-label={`${isSaved ? 'Remover' : 'Adicionar'} ${product.name} da Minha Lista`}
              onClick={handleWishlistClick}
            >
              <Heart 
                className="w-[18px] h-[18px]" 
                fill={isSaved ? '#E53E3E' : 'none'}
              />
            </button>
          )}
          
          {/* Imagem do Produto */}
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="queridinhos__image"
              sizes="(max-width: 768px) 80vw, (max-width: 1024px) 40vw, 25vw"
              loading={index < 2 ? 'eager' : 'lazy'}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-5xl opacity-30">📷</span>
            </div>
          )}
        </div>
      </Link>
      
      {/* Conteúdo do Card */}
      <div className="queridinhos__content">
        
        {/* Título */}
        <h3 className="queridinhos__product-title">
          <Link href={productUrl}>
            {product.name}
          </Link>
        </h3>
        
        {/* Preço */}
        <div className="queridinhos__pricing">
          <p className="queridinhos__installment">
            <strong>{installment.count}x</strong> de <strong>R$ {installment.value}</strong>
          </p>
          <p className="queridinhos__price-full">
            ou {formatPrice(product.price)} à vista
          </p>
        </div>
        
        {/* Frete */}
        <div className="queridinhos__shipping">
          <Truck className="queridinhos__shipping-icon" />
          <span>Curitiba: <strong>72h</strong></span>
        </div>
        
      </div>
    </article>
  )
}
