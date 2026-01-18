'use client'

import { useState } from 'react'
import SearchModal from './SearchModal'
import { useSearchShortcut } from './useSearchShortcut'

/**
 * Botão de Busca + Modal
 * 
 * Inclui:
 * - Botão com ícone de lupa
 * - Atalho ⌘K visível no desktop
 * - Modal de busca inteligente
 * - Atalho Ctrl+K / Cmd+K global
 * 
 * @example
 * ```tsx
 * // No Header.tsx
 * import SearchButton from '@/components/search/SearchButton'
 * 
 * <header>
 *   <SearchButton />
 * </header>
 * ```
 */
export default function SearchButton() {
  const [isOpen, setIsOpen] = useState(false)

  // Registra atalho Ctrl+K / Cmd+K
  useSearchShortcut(() => setIsOpen(true), isOpen)

  return (
    <>
      {/* Botão de Busca */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-[#F0E8DF] hover:bg-[#E8DFD5] rounded-lg text-[#8B7355] transition-colors min-h-[44px] cursor-pointer border-none"
        aria-label="Buscar produtos (Ctrl+K)"
      >
        {/* Ícone Lupa */}
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>

        {/* Texto (tablet+) */}
        <span className="hidden sm:inline text-sm">Buscar</span>

        {/* Atalho (desktop) */}
        <kbd className="hidden md:inline-flex items-center px-2 py-0.5 bg-[#E8DFD5] rounded text-xs text-[#8B7355]">
          ⌘K
        </kbd>
      </button>

      {/* Modal de Busca */}
      <SearchModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  )
}
