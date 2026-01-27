'use client'

/**
 * Moveirama Cart System - Quantity Control Component
 * Versão: 1.0
 * Data: Janeiro 2026
 * 
 * Controle de quantidade com botões + e -.
 * Usado no drawer e na página do carrinho.
 */

import React, { useCallback } from 'react'
import { Minus, Plus } from 'lucide-react'
import { CART_CONSTANTS } from './cart-types'

// ============================================
// TIPOS
// ============================================

interface QuantityControlProps {
  value: number
  min?: number
  max?: number
  onChange: (newValue: number) => void
  onRemove?: () => void              // Chamado quando tenta diminuir abaixo do min
  disabled?: boolean
  size?: 'sm' | 'md'
  className?: string
}

// ============================================
// COMPONENTE
// ============================================

export function QuantityControl({
  value,
  min = CART_CONSTANTS.MIN_QUANTITY,
  max = CART_CONSTANTS.MAX_QUANTITY,
  onChange,
  onRemove,
  disabled = false,
  size = 'md',
  className = '',
}: QuantityControlProps) {
  
  // Tamanhos baseados na spec
  const buttonSize = size === 'sm' ? 'w-9 h-9' : 'w-10 h-10'
  const valueSize = size === 'sm' ? 'w-10' : 'w-11'
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  const fontSize = size === 'sm' ? 'text-sm' : 'text-base'
  
  const canDecrement = value > min
  const canIncrement = value < max
  
  const handleDecrement = useCallback(() => {
    if (disabled) return
    
    if (value === min && onRemove) {
      // Se já está no mínimo e tem callback de remoção
      onRemove()
    } else if (canDecrement) {
      onChange(value - 1)
    }
  }, [value, min, canDecrement, disabled, onChange, onRemove])
  
  const handleIncrement = useCallback(() => {
    if (disabled || !canIncrement) return
    onChange(value + 1)
  }, [value, canIncrement, disabled, onChange])
  
  return (
    <div 
      className={`
        inline-flex items-center
        border border-[#E8DFD5] rounded-lg
        bg-white
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `}
      role="group"
      aria-label="Controle de quantidade"
    >
      {/* Botão Diminuir */}
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled}
        className={`
          ${buttonSize}
          flex items-center justify-center
          rounded-l-lg
          transition-all duration-150
          ${!canDecrement && !onRemove
            ? 'text-[#D4C9BD] cursor-not-allowed'
            : 'text-[#2D2D2D] hover:bg-[#F0E8DF] active:scale-95'
          }
        `}
        aria-label="Diminuir quantidade"
      >
        <Minus className={iconSize} />
      </button>
      
      {/* Valor */}
      <span 
        className={`
          ${valueSize}
          ${fontSize}
          font-semibold text-[#2D2D2D]
          text-center
          select-none
        `}
        aria-live="polite"
        aria-atomic="true"
      >
        {value}
      </span>
      
      {/* Botão Aumentar */}
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || !canIncrement}
        className={`
          ${buttonSize}
          flex items-center justify-center
          rounded-r-lg
          transition-all duration-150
          ${!canIncrement
            ? 'text-[#D4C9BD] cursor-not-allowed'
            : 'text-[#2D2D2D] hover:bg-[#F0E8DF] active:scale-95'
          }
        `}
        aria-label="Aumentar quantidade"
      >
        <Plus className={iconSize} />
      </button>
    </div>
  )
}

// ============================================
// VERSÃO COMPACTA (só números)
// ============================================

interface QuantityCompactProps {
  value: number
  max?: number
  onChange: (newValue: number) => void
  disabled?: boolean
  className?: string
}

export function QuantityCompact({
  value,
  max = CART_CONSTANTS.MAX_QUANTITY,
  onChange,
  disabled = false,
  className = '',
}: QuantityCompactProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      disabled={disabled}
      className={`
        h-10 px-3
        text-sm font-medium text-[#2D2D2D]
        bg-white
        border border-[#E8DFD5] rounded-lg
        cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-[#6B8E7A]/40 focus:border-[#6B8E7A]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      aria-label="Selecionar quantidade"
    >
      {Array.from({ length: max }, (_, i) => i + 1).map(num => (
        <option key={num} value={num}>
          {num}
        </option>
      ))}
    </select>
  )
}
