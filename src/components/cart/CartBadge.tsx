'use client'

/**
 * Moveirama Cart System - Cart Badge Component
 * Versão: 1.0
 * Data: Janeiro 2026
 * 
 * Botão do carrinho no header com contador.
 * Animação de pulse ao adicionar item.
 */

import React, { useEffect, useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCart } from './CartProvider'

// ============================================
// TIPOS
// ============================================

interface CartBadgeProps {
  className?: string
}

// ============================================
// COMPONENTE
// ============================================

export function CartBadge({ className = '' }: CartBadgeProps) {
  const { itemCount, openDrawer } = useCart()
  const [isPulsing, setIsPulsing] = useState(false)
  
  // Animação de pulse quando itemCount muda
  useEffect(() => {
    if (itemCount > 0) {
      setIsPulsing(true)
      const timer = setTimeout(() => setIsPulsing(false), 300)
      return () => clearTimeout(timer)
    }
  }, [itemCount])
  
  return (
    <button
      type="button"
      onClick={openDrawer}
      className={`
        relative
        w-11 h-11
        flex items-center justify-center
        rounded-lg
        text-[#2D2D2D]
        hover:bg-[#F0E8DF]
        transition-colors duration-150
        ${className}
      `}
      aria-label={`Carrinho${itemCount > 0 ? ` com ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}` : ''}`}
    >
      {/* Ícone */}
      <ShoppingCart className="w-6 h-6" />
      
      {/* Badge contador */}
      {itemCount > 0 && (
        <span 
          className={`
            absolute -top-1 -right-1
            min-w-[18px] h-[18px]
            flex items-center justify-center
            px-1
            text-[11px] font-bold text-white
            bg-[#6B8E7A]
            rounded-full
            ${isPulsing ? 'animate-badge-pulse' : ''}
          `}
          aria-hidden="true"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  )
}

// ============================================
// VERSÃO ALTERNATIVA (texto)
// ============================================

interface CartBadgeTextProps {
  className?: string
  showText?: boolean
}

export function CartBadgeText({ 
  className = '',
  showText = true 
}: CartBadgeTextProps) {
  const { itemCount, openDrawer, subtotalPix } = useCart()
  
  const formatPrice = (value: number) => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
  
  return (
    <button
      type="button"
      onClick={openDrawer}
      className={`
        flex items-center gap-2
        px-3 py-2
        rounded-lg
        text-[#2D2D2D]
        hover:bg-[#F0E8DF]
        transition-colors duration-150
        ${className}
      `}
      aria-label={`Abrir carrinho${itemCount > 0 ? ` com ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}` : ''}`}
    >
      {/* Ícone com badge */}
      <div className="relative">
        <ShoppingCart className="w-5 h-5" />
        {itemCount > 0 && (
          <span 
            className="
              absolute -top-1 -right-1
              min-w-[16px] h-[16px]
              flex items-center justify-center
              text-[10px] font-bold text-white
              bg-[#6B8E7A]
              rounded-full
            "
            aria-hidden="true"
          >
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </div>
      
      {/* Texto (desktop) */}
      {showText && itemCount > 0 && (
        <span className="hidden md:block text-sm font-medium">
          R$ {formatPrice(subtotalPix)}
        </span>
      )}
    </button>
  )
}

// ============================================
// VERSÃO MINI (só o ícone pequeno)
// ============================================

interface CartBadgeMiniProps {
  className?: string
}

export function CartBadgeMini({ className = '' }: CartBadgeMiniProps) {
  const { itemCount, openDrawer } = useCart()
  
  return (
    <button
      type="button"
      onClick={openDrawer}
      className={`
        relative
        w-8 h-8
        flex items-center justify-center
        rounded
        text-[#2D2D2D]
        hover:bg-[#F0E8DF]
        transition-colors duration-150
        ${className}
      `}
      aria-label={`Carrinho${itemCount > 0 ? ` (${itemCount})` : ''}`}
    >
      <ShoppingCart className="w-5 h-5" />
      
      {itemCount > 0 && (
        <span 
          className="
            absolute -top-0.5 -right-0.5
            w-4 h-4
            flex items-center justify-center
            text-[9px] font-bold text-white
            bg-[#6B8E7A]
            rounded-full
          "
          aria-hidden="true"
        >
          {itemCount > 9 ? '+' : itemCount}
        </span>
      )}
    </button>
  )
}

// ============================================
// CSS ANIMATION (adicionar ao globals.css)
// ============================================

/*
@keyframes badge-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.animate-badge-pulse {
  animation: badge-pulse 0.3s ease-out;
}
*/
