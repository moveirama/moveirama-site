'use client'

/**
 * MinhaListaFAB — Widget flutuante para acesso à lista
 * 
 * Comportamento:
 * - Oculto quando lista vazia
 * - Aparece após primeiro item salvo
 * - Posição: canto inferior direito (24px das bordas)
 * - Hover mostra tooltip "Ver minha lista"
 * - Clique abre o Drawer
 * 
 * Moveirama E-commerce
 * Janeiro 2026
 */

import { useState, useEffect } from 'react'
import { countItems, subscribeToStorageChanges } from '@/lib/minha-lista'

// ============================================
// TIPOS
// ============================================

interface MinhaListaFABProps {
  onClick: () => void
}

// ============================================
// ÍCONE CORAÇÃO
// ============================================

function HeartIcon({ hasItems }: { hasItems: boolean }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={`w-6 h-6 transition-all duration-200 ${
        hasItems ? 'fill-[#D94F4F] text-[#D94F4F]' : 'fill-none text-white'
      }`}
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

export default function MinhaListaFAB({ onClick }: MinhaListaFABProps) {
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // Sincroniza estado com localStorage ao montar
  useEffect(() => {
    setMounted(true)
    setCount(countItems())
    
    // Escuta mudanças (outras abas ou mesma aba)
    return subscribeToStorageChanges(() => {
      setCount(countItems())
    })
  }, [])

  // Não renderiza no SSR ou quando lista vazia
  if (!mounted || count === 0) {
    return null
  }

  return (
    <div 
      className={`
        fixed bottom-24 right-6 z-[500]
        transition-all duration-300 ease-out
        ${count > 0 
          ? 'opacity-100 visible scale-100' 
          : 'opacity-0 invisible scale-[0.8]'
        }
      `}
    >
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={`Ver móveis que mais gostei (${count} ${count === 1 ? 'item' : 'itens'})`}
        className={`
          relative
          w-14 h-14
          flex items-center justify-center
          bg-[#2D2D2D] rounded-full
          shadow-[0_4px_16px_rgba(0,0,0,0.2)]
          transition-all duration-200
          hover:scale-105 hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)]
          focus-visible:outline focus-visible:outline-2 
          focus-visible:outline-[#6B8E7A] focus-visible:outline-offset-2
        `}
      >
        <HeartIcon hasItems={count > 0} />
        
        {/* Badge com contador */}
        <span 
          className="
            absolute -top-1 -right-1
            min-w-[22px] h-[22px] px-1.5
            flex items-center justify-center
            bg-[#D94F4F] text-white
            text-xs font-bold
            rounded-full
            border-2 border-[#FAF7F4]
          "
        >
          {count > 9 ? '9+' : count}
        </span>

        {/* Tooltip */}
        <span 
          className={`
            absolute right-[68px] top-1/2 -translate-y-1/2
            px-3 py-2
            bg-[#2D2D2D] text-white
            text-[13px] font-medium
            rounded-md whitespace-nowrap
            transition-all duration-200
            ${showTooltip 
              ? 'opacity-100 visible' 
              : 'opacity-0 invisible'
            }
          `}
        >
          Móveis que gostei
        </span>
      </button>
    </div>
  )
}
