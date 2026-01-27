'use client'

/**
 * Moveirama Cart System - Cart Drawer Component
 * Versão: 1.0
 * Data: Janeiro 2026
 * 
 * Drawer lateral do carrinho.
 * Desktop: slide da direita (360px)
 * Mobile: bottom sheet (100% width, max 85vh)
 */

import React, { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { X, ShoppingBag } from 'lucide-react'
import { useCart } from './CartProvider'
import { useToast } from './Toast'
import { CartItem } from './CartItem'
import { CartEmpty } from './CartEmpty'
import { CartDrawerSkeleton } from './CartLoading'
import { formatCurrency } from './cart-utils'

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export function CartDrawer() {
  const router = useRouter()
  const { state, closeDrawer, updateQuantity, removeItem, subtotalPix, isEmpty } = useCart()
  const { showToast } = useToast()
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const lastFocusedElement = useRef<HTMLElement | null>(null)
  
  const { items, isOpen } = state
  
  // Guarda o elemento que tinha foco antes de abrir
  useEffect(() => {
    if (isOpen) {
      lastFocusedElement.current = document.activeElement as HTMLElement
      // Foca no botão de fechar
      setTimeout(() => closeButtonRef.current?.focus(), 100)
    } else {
      // Retorna foco ao elemento anterior
      lastFocusedElement.current?.focus()
    }
  }, [isOpen])
  
  // Fecha com ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeDrawer()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeDrawer])
  
  // Trap focus dentro do drawer
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return
    
    const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }
    
    document.addEventListener('keydown', handleTabKey)
    return () => document.removeEventListener('keydown', handleTabKey)
  }, [isOpen])
  
  // Bloqueia scroll do body quando aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])
  
  // Handler de atualização de quantidade
  const handleUpdateQuantity = useCallback((productId: string, quantity: number) => {
    updateQuantity(productId, quantity)
  }, [updateQuantity])
  
  // Handler de remoção
  const handleRemove = useCallback((productId: string, productName: string) => {
    removeItem(productId)
    showToast('success', `${productName} removido do carrinho`)
  }, [removeItem, showToast])
  
  // Navega para o carrinho completo
  const handleGoToCart = useCallback(() => {
    closeDrawer()
    router.push('/carrinho')
  }, [closeDrawer, router])
  
  // Continua comprando
  const handleContinueShopping = useCallback(() => {
    closeDrawer()
  }, [closeDrawer])
  
  if (!isOpen) return null
  
  return (
    <>
      {/* Overlay */}
      <div 
        className="
          fixed inset-0 z-[9998]
          bg-black/50
          animate-fade-in
        "
        onClick={closeDrawer}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de compras"
        className="
          fixed z-[9999]
          
          /* Mobile: bottom sheet */
          inset-x-0 bottom-0
          max-h-[85vh]
          rounded-t-2xl
          animate-slide-up-mobile
          
          /* Desktop: side drawer */
          md:inset-y-0 md:right-0 md:left-auto
          md:w-[360px] md:max-h-full
          md:rounded-none md:rounded-l-2xl
          md:animate-slide-in-right
          
          bg-white
          shadow-xl
          flex flex-col
        "
      >
        {/* Handle indicator (mobile only) */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[#E8DFD5] rounded-full" />
        </div>
        
        {/* Header */}
        <div className="
          flex items-center justify-between
          px-4 py-3
          border-b border-[#E8DFD5]
        ">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#2D2D2D]" />
            <h2 className="text-lg font-semibold text-[#2D2D2D]">
              Seu Carrinho
              {items.length > 0 && (
                <span className="ml-1 text-[#8B7355] font-normal">
                  ({items.length})
                </span>
              )}
            </h2>
          </div>
          
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeDrawer}
            className="
              w-10 h-10
              flex items-center justify-center
              rounded-lg
              text-[#2D2D2D]
              hover:bg-[#F0E8DF]
              transition-colors
            "
            aria-label="Fechar carrinho"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {isEmpty ? (
            <CartEmpty variant="drawer" onContinueShopping={handleContinueShopping} />
          ) : (
            <div className="divide-y divide-[#E8DFD5]">
              {items.map(item => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  variant="compact"
                  onUpdateQuantity={(qty) => handleUpdateQuantity(item.product.id, qty)}
                  onRemove={() => handleRemove(item.product.id, item.product.name)}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {!isEmpty && (
          <div className="
            border-t border-[#E8DFD5]
            p-4 pb-safe
            bg-white
          ">
            {/* Subtotal */}
            <div className="flex justify-between items-baseline mb-4">
              <span className="text-sm text-[#8B7355]">Subtotal</span>
              <div className="text-right">
                <span className="text-xl font-bold text-[#6B8E7A]">
                  {formatCurrency(subtotalPix)}
                </span>
                <span className="text-xs text-[#8B7355] ml-1">no Pix</span>
              </div>
            </div>
            
            {/* Botões */}
            <button
              type="button"
              onClick={handleGoToCart}
              className="
                w-full h-12 mb-2
                flex items-center justify-center
                bg-[#6B8E7A] hover:bg-[#5A7A68]
                text-white font-semibold
                rounded-lg
                transition-colors duration-150
              "
            >
              Finalizar Compra
            </button>
            
            <button
              type="button"
              onClick={handleContinueShopping}
              className="
                w-full h-11
                flex items-center justify-center
                text-[#2D2D2D] font-medium
                rounded-lg
                hover:bg-[#F0E8DF]
                transition-colors duration-150
              "
            >
              Ver mais móveis
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// ============================================
// CSS ANIMATIONS (adicionar ao globals.css)
// ============================================

/*
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up-mobile {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes slide-in-right {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

.animate-slide-up-mobile {
  animation: slide-up-mobile 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.pb-safe {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
*/
