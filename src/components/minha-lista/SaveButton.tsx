'use client'

/**
 * SaveButton — Botão "Salvar na minha lista"
 * 
 * Posição: Entre rating e bloco de preço na PDP
 * Visual: Cor neutra (não compete com CTAs verde/WhatsApp)
 * 
 * Moveirama E-commerce
 * Janeiro 2026
 */

import { useState, useEffect } from 'react'
import { 
  toggleItem, 
  isInLista, 
  subscribeToStorageChanges,
  type ListaItem 
} from '@/lib/minha-lista'

// ============================================
// TIPOS
// ============================================

interface SaveButtonProps {
  product: {
    id: string
    name: string
    price: number          // Preço numérico
    slug: string
    subcategorySlug: string // NOVO - para montar URL correta
    width_cm: number       // Largura em cm
    imageUrl?: string
  }
  onSave?: (added: boolean) => void
  className?: string
}

// ============================================
// ÍCONE CORAÇÃO
// ============================================

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className="w-[18px] h-[18px] transition-all duration-200"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function SaveButton({ product, onSave, className = '' }: SaveButtonProps) {
  const [saved, setSaved] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Sincroniza estado com localStorage ao montar
  useEffect(() => {
    setMounted(true)
    setSaved(isInLista(product.id))
    
    // Escuta mudanças (outras abas ou mesma aba)
    return subscribeToStorageChanges(() => {
      setSaved(isInLista(product.id))
    })
  }, [product.id])

  // Evita flash de conteúdo no SSR
  if (!mounted) {
    return (
      <button
        disabled
        className={`
          inline-flex items-center gap-2
          px-4 py-2.5 rounded-lg
          text-sm font-medium
          bg-[#F2EDE8] border-[1.5px] border-[#D1C7BD] text-[#5A4A3A]
          opacity-50 cursor-not-allowed
          ${className}
        `}
      >
        <HeartIcon filled={false} />
        <span>Salvar na minha lista</span>
      </button>
    )
  }

  const handleClick = () => {
    // Formata preço para exibição
    const priceFormatted = product.price.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })

    const item: Omit<ListaItem, 'savedAt'> = {
      id: product.id,
      name: product.name,
      price: priceFormatted,
      width: String(product.width_cm),
      slug: product.slug,
      subcategorySlug: product.subcategorySlug,  // NOVO
      imageUrl: product.imageUrl || ''
    }

    const result = toggleItem(item)
    
    // Atualiza estado local
    setSaved(result.added)
    
    // Animação heartPop
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)

    // Callback opcional
    onSave?.(result.added)
  }

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? 'Remover dos salvos' : 'Salvar produto'}
      aria-pressed={saved}
      className={`
        inline-flex items-center gap-2
        px-4 py-2.5 rounded-lg
        text-sm font-medium
        transition-all duration-200
        focus-visible:outline focus-visible:outline-2 
        focus-visible:outline-[#6B8E7A] focus-visible:outline-offset-2
        border-[1.5px]
        ${saved 
          ? 'bg-white border-[#D94F4F] text-[#D94F4F] hover:bg-red-50' 
          : 'bg-[#F2EDE8] border-[#D1C7BD] text-[#5A4A3A] hover:bg-[#EBE5DE] hover:border-[#C4B9AD]'
        }
        ${isAnimating ? 'animate-heartPop' : ''}
        ${className}
      `}
    >
      <HeartIcon filled={saved} />
      <span>{saved ? 'Salvo na minha lista' : 'Salvar na minha lista'}</span>
    </button>
  )
}