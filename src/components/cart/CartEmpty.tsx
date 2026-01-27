'use client'

/**
 * Moveirama Cart System - Cart Empty Component
 * Versão: 1.0
 * Data: Janeiro 2026
 * 
 * Estado vazio do carrinho com CTAs.
 * Duas variantes: drawer (compacta) e page (completa).
 */

import React from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

// ============================================
// TIPOS
// ============================================

interface CartEmptyProps {
  variant?: 'drawer' | 'page'
  onContinueShopping?: () => void
}

// ============================================
// COMPONENTE
// ============================================

export function CartEmpty({ 
  variant = 'page',
  onContinueShopping 
}: CartEmptyProps) {
  
  if (variant === 'drawer') {
    return <CartEmptyDrawer onContinue={onContinueShopping} />
  }
  
  return <CartEmptyPage />
}

// ============================================
// VARIANTE DRAWER (compacta)
// ============================================

interface CartEmptyDrawerProps {
  onContinue?: () => void
}

function CartEmptyDrawer({ onContinue }: CartEmptyDrawerProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
      {/* Ícone */}
      <div 
        className="
          w-20 h-20 mb-6
          flex items-center justify-center
          bg-[#F0E8DF] rounded-full
        "
      >
        <ShoppingBag className="w-10 h-10 text-[#D4C9BD]" />
      </div>
      
      {/* Texto */}
      <h3 className="text-lg font-semibold text-[#2D2D2D] mb-2">
        Seu carrinho está vazio
      </h3>
      <p className="text-sm text-[#8B7355] mb-6">
        Que tal dar uma olhada nos móveis mais vendidos?
      </p>
      
      {/* CTA */}
      <button
        type="button"
        onClick={onContinue}
        className="
          w-full h-12
          flex items-center justify-center
          bg-[#6B8E7A] hover:bg-[#5A7A68]
          text-white font-semibold
          rounded-lg
          transition-colors duration-150
        "
      >
        Ver Móveis Populares
      </button>
    </div>
  )
}

// ============================================
// VARIANTE PAGE (completa)
// ============================================

function CartEmptyPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 text-center">
      {/* Ícone */}
      <div 
        className="
          w-24 h-24 mb-6
          flex items-center justify-center
          bg-[#F0E8DF] rounded-full
        "
      >
        <ShoppingBag className="w-12 h-12 text-[#D4C9BD]" />
      </div>
      
      {/* Texto */}
      <h1 className="text-xl font-semibold text-[#2D2D2D] mb-2">
        Seu carrinho está vazio
      </h1>
      <p className="text-base text-[#8B7355] mb-8 max-w-md">
        Que tal dar uma olhada nos móveis mais vendidos? 
        Temos opções com ótimo custo-benefício para deixar sua casa incrível.
      </p>
      
      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Link
          href="/"
          className="
            flex-1 h-12
            flex items-center justify-center
            bg-[#6B8E7A] hover:bg-[#5A7A68]
            text-white font-semibold
            rounded-lg
            transition-colors duration-150
          "
        >
          Ver Móveis Populares
        </Link>
        <Link
          href="/moveis-para-casa"
          className="
            flex-1 h-12
            flex items-center justify-center
            border-2 border-[#2D2D2D]
            text-[#2D2D2D] font-semibold
            rounded-lg
            hover:bg-[#F0E8DF]
            transition-colors duration-150
          "
        >
          Continuar Comprando
        </Link>
      </div>
      
      {/* Trust badges */}
      <div className="mt-12 pt-8 border-t border-[#E8DFD5] w-full max-w-md">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <span className="text-2xl mb-1 block">🚚</span>
            <span className="text-xs text-[#8B7355]">
              Entrega em<br />1-3 dias úteis
            </span>
          </div>
          <div>
            <span className="text-2xl mb-1 block">💳</span>
            <span className="text-xs text-[#8B7355]">
              Até 12x<br />sem juros
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// VERSÃO ALTERNATIVA COM SUGESTÕES
// ============================================

interface CartEmptyWithSuggestionsProps {
  products?: Array<{
    id: string
    slug: string
    name: string
    price: number
    imageUrl: string
    subcategorySlug: string
  }>
  onContinue?: () => void
}

export function CartEmptyWithSuggestions({ 
  products = [],
  onContinue 
}: CartEmptyWithSuggestionsProps) {
  return (
    <div className="flex flex-col items-center px-4 py-8">
      {/* Estado vazio */}
      <div className="text-center mb-8">
        <div 
          className="
            w-20 h-20 mx-auto mb-4
            flex items-center justify-center
            bg-[#F0E8DF] rounded-full
          "
        >
          <ShoppingBag className="w-10 h-10 text-[#D4C9BD]" />
        </div>
        <h3 className="text-lg font-semibold text-[#2D2D2D] mb-1">
          Seu carrinho está vazio
        </h3>
        <p className="text-sm text-[#8B7355]">
          Confira algumas sugestões
        </p>
      </div>
      
      {/* Sugestões de produtos */}
      {products.length > 0 && (
        <div className="w-full space-y-3 mb-6">
          {products.slice(0, 3).map(product => (
            <Link
              key={product.id}
              href={`/${product.subcategorySlug}/${product.slug}`}
              onClick={onContinue}
              className="
                flex items-center gap-3 p-3
                bg-[#F0E8DF] rounded-lg
                hover:bg-[#E8DFD5]
                transition-colors
              "
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#2D2D2D] truncate">
                  {product.name}
                </p>
                <p className="text-sm font-semibold text-[#6B8E7A]">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {/* CTA */}
      <button
        type="button"
        onClick={onContinue}
        className="
          w-full h-11
          flex items-center justify-center
          border-2 border-[#2D2D2D]
          text-[#2D2D2D] font-semibold text-sm
          rounded-lg
          hover:bg-[#F0E8DF]
          transition-colors duration-150
        "
      >
        Ver Mais Móveis
      </button>
    </div>
  )
}
