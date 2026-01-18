'use client'

import { useEffect, useCallback } from 'react'

/**
 * Hook para registrar atalho Ctrl+K / Cmd+K para abrir busca
 * 
 * @param onOpen - Callback para abrir o modal de busca
 * @param isOpen - Se o modal já está aberto (para evitar abrir múltiplas vezes)
 * 
 * @example
 * ```tsx
 * const [isSearchOpen, setIsSearchOpen] = useState(false)
 * useSearchShortcut(() => setIsSearchOpen(true), isSearchOpen)
 * ```
 */
export function useSearchShortcut(onOpen: () => void, isOpen: boolean = false) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ctrl+K (Windows/Linux) ou Cmd+K (Mac)
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      
      if (!isOpen) {
        onOpen()
      }
    }
  }, [onOpen, isOpen])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

export default useSearchShortcut
