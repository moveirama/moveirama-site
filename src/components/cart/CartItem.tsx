'use client'

/**
 * Moveirama Cart System - Cart Item Component
 * Versão: 1.0
 * Data: Janeiro 2026
 * 
 * Item do carrinho com duas variantes:
 * - compact: Para uso no drawer (80px imagem)
 * - full: Para uso na página do carrinho (100px imagem)
 */

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, X } from 'lucide-react'
import { CartItemData as CartItemType } from './cart-types'
import { QuantityControl } from './QuantityControl'
import { 
  formatCurrency, 
  formatDimensions, 
  getProductUrl 
} from './cart-utils'

// ============================================
// TIPOS
// ============================================

interface CartItemProps {
  item: CartItemType
  variant?: 'compact' | 'full'
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
  isRemoving?: boolean
}

// ============================================
// COMPONENTE
// ============================================

export function CartItem({
  item,
  variant = 'compact',
  onUpdateQuantity,
  onRemove,
  isRemoving = false,
}: CartItemProps) {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  
  const { product, quantity } = item
  const productUrl = getProductUrl(product.subcategorySlug, product.slug)
  
  // Handler para quando tentar diminuir abaixo do mínimo
  const handleRemoveIntent = useCallback(() => {
    setShowRemoveConfirm(true)
  }, [])
  
  // Confirma remoção
  const handleConfirmRemove = useCallback(() => {
    setShowRemoveConfirm(false)
    onRemove()
  }, [onRemove])
  
  // Cancela remoção
  const handleCancelRemove = useCallback(() => {
    setShowRemoveConfirm(false)
  }, [])
  
  if (variant === 'compact') {
    return (
      <CartItemCompact
        item={item}
        productUrl={productUrl}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
        onRemoveIntent={handleRemoveIntent}
        showRemoveConfirm={showRemoveConfirm}
        onConfirmRemove={handleConfirmRemove}
        onCancelRemove={handleCancelRemove}
        isRemoving={isRemoving}
      />
    )
  }
  
  return (
    <CartItemFull
      item={item}
      productUrl={productUrl}
      onUpdateQuantity={onUpdateQuantity}
      onRemove={onRemove}
      onRemoveIntent={handleRemoveIntent}
      showRemoveConfirm={showRemoveConfirm}
      onConfirmRemove={handleConfirmRemove}
      onCancelRemove={handleCancelRemove}
      isRemoving={isRemoving}
    />
  )
}

// ============================================
// VARIANTE COMPACTA (Drawer)
// ============================================

interface CartItemCompactProps {
  item: CartItemType
  productUrl: string
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
  onRemoveIntent: () => void
  showRemoveConfirm: boolean
  onConfirmRemove: () => void
  onCancelRemove: () => void
  isRemoving: boolean
}

function CartItemCompact({
  item,
  productUrl,
  onUpdateQuantity,
  onRemove,
  onRemoveIntent,
  showRemoveConfirm,
  onConfirmRemove,
  onCancelRemove,
  isRemoving,
}: CartItemCompactProps) {
  const { product, quantity } = item
  
  return (
    <div 
      className={`
        relative
        flex gap-3 p-3
        border-b border-[#E8DFD5]
        bg-white
        transition-all duration-200
        ${isRemoving ? 'opacity-50 translate-x-full' : ''}
      `}
    >
      {/* Imagem */}
      <Link 
        href={productUrl}
        className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-[#F0E8DF]"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={80}
          height={80}
          className="w-full h-full object-cover"
        />
      </Link>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Nome */}
        <Link 
          href={productUrl}
          className="block text-sm font-medium text-[#2D2D2D] hover:text-[#6B8E7A] line-clamp-2 mb-0.5"
        >
          {product.name}
        </Link>
        
        {/* Variante */}
        {product.variant && (
          <p className="text-xs text-[#8B7355] mb-2">
            {product.variant.name}
          </p>
        )}
        
        {/* Preços */}
        <div className="mb-2">
          <p className="text-sm font-semibold text-[#6B8E7A]">
            {formatCurrency(product.pricePix || product.price * 0.95)} <span className="font-normal text-xs">no Pix</span>
          </p>
          <p className="text-xs text-[#8B7355]">
            ou {formatCurrency(product.price)}
          </p>
        </div>
        
        {/* Controles */}
        <div className="flex items-center gap-2">
          <QuantityControl
            value={quantity}
            onChange={onUpdateQuantity}
            onRemove={onRemoveIntent}
            size="sm"
          />
          
          {/* Botão remover */}
          <button
            type="button"
            onClick={onRemoveIntent}
            className="
              p-1.5 rounded
              text-[#8B7355] hover:text-[#D94F4F] hover:bg-[#FEF2F2]
              transition-colors
            "
            aria-label="Remover item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Overlay de confirmação de remoção */}
      {showRemoveConfirm && (
        <RemoveConfirmOverlay
          onConfirm={onConfirmRemove}
          onCancel={onCancelRemove}
          compact
        />
      )}
    </div>
  )
}

// ============================================
// VARIANTE COMPLETA (Página)
// ============================================

interface CartItemFullProps {
  item: CartItemType
  productUrl: string
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
  onRemoveIntent: () => void
  showRemoveConfirm: boolean
  onConfirmRemove: () => void
  onCancelRemove: () => void
  isRemoving: boolean
}

function CartItemFull({
  item,
  productUrl,
  onUpdateQuantity,
  onRemove,
  onRemoveIntent,
  showRemoveConfirm,
  onConfirmRemove,
  onCancelRemove,
  isRemoving,
}: CartItemFullProps) {
  const { product, quantity } = item
  
  return (
    <div 
      className={`
        relative
        flex gap-4 p-4
        bg-white rounded-xl shadow-sm
        transition-all duration-200
        ${isRemoving ? 'opacity-50 translate-x-full' : ''}
      `}
    >
      {/* Imagem */}
      <Link 
        href={productUrl}
        className="flex-shrink-0 w-[100px] h-[100px] rounded-lg overflow-hidden bg-[#F0E8DF]"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={100}
          height={100}
          className="w-full h-full object-cover"
        />
      </Link>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Nome */}
        <Link 
          href={productUrl}
          className="block text-base font-medium text-[#2D2D2D] hover:text-[#6B8E7A] line-clamp-2 mb-1"
        >
          {product.name}
        </Link>
        
        {/* Variante */}
        {product.variant && (
          <p className="text-sm text-[#8B7355] mb-1">
            {product.variant.name}
          </p>
        )}
        
        {/* Dimensões - só mostra se tiver todas as medidas */}
        {product.width && product.height && product.depth && (
          <p className="text-xs text-[#8B7355] mb-2">
            {formatDimensions(product.width, product.height, product.depth)}
          </p>
        )}
        
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {product.tvMaxSize && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-[#F0E8DF] text-[#8B7355] rounded-full">
              TV até {product.tvMaxSize}"
            </span>
          )}
          {product.material && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-[#F0E8DF] text-[#8B7355] rounded-full">
              {product.material}{product.materialThickness ? ` ${product.materialThickness}mm` : ''}
            </span>
          )}
        </div>
        
        {/* Preços e controles */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Preços */}
          <div>
            <p className="text-base font-semibold text-[#6B8E7A]">
              {formatCurrency((product.pricePix || product.price * 0.95) * quantity)} <span className="font-normal text-sm">no Pix</span>
            </p>
            <p className="text-sm text-[#8B7355]">
              ou {formatCurrency(product.price * quantity)}
            </p>
          </div>
          
          {/* Controles */}
          <div className="flex items-center gap-3">
            <QuantityControl
              value={quantity}
              onChange={onUpdateQuantity}
              onRemove={onRemoveIntent}
              size="md"
            />
            
            {/* Botão remover */}
            <button
              type="button"
              onClick={onRemoveIntent}
              className="
                p-2 rounded-lg
                text-[#8B7355] hover:text-[#D94F4F] hover:bg-[#FEF2F2]
                transition-colors
              "
              aria-label="Remover item"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Overlay de confirmação de remoção */}
      {showRemoveConfirm && (
        <RemoveConfirmOverlay
          onConfirm={onConfirmRemove}
          onCancel={onCancelRemove}
        />
      )}
    </div>
  )
}

// ============================================
// OVERLAY DE CONFIRMAÇÃO DE REMOÇÃO
// ============================================

interface RemoveConfirmOverlayProps {
  onConfirm: () => void
  onCancel: () => void
  compact?: boolean
}

function RemoveConfirmOverlay({
  onConfirm,
  onCancel,
  compact = false,
}: RemoveConfirmOverlayProps) {
  return (
    <div 
      className="
        absolute inset-0 z-10
        flex items-center justify-center
        bg-white/95 backdrop-blur-sm
        rounded-xl
      "
    >
      <div className={`text-center ${compact ? 'px-4' : 'px-6'}`}>
        <p className={`${compact ? 'text-sm' : 'text-base'} font-medium text-[#2D2D2D] mb-3`}>
          Remover este item?
        </p>
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={onCancel}
            className={`
              ${compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}
              font-medium
              border border-[#E8DFD5]
              text-[#2D2D2D]
              rounded-lg
              hover:bg-[#F0E8DF]
              transition-colors
            `}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`
              ${compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}
              font-medium
              bg-[#D94F4F] hover:bg-[#C43D3D]
              text-white
              rounded-lg
              transition-colors
            `}
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  )
}
