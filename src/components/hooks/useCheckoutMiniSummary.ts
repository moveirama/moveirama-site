'use client'

import { useState, useEffect, RefObject } from 'react'

/**
 * Hook para controlar visibilidade do mini-banner de resumo no checkout mobile.
 * 
 * Usa IntersectionObserver para detectar quando a seção de resumo completo
 * entra/sai da viewport. Quando visível, esconde o mini-banner.
 * 
 * @param summaryRef - Ref da seção de resumo completo
 * @returns { showMini: boolean } - Se deve mostrar o mini-banner
 */
export function useCheckoutMiniSummary(summaryRef: RefObject<HTMLElement | null>) {
  const [showMini, setShowMini] = useState(false)

  useEffect(() => {
    // Só funciona no mobile (< 768px)
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    if (!isMobile) {
      setShowMini(false)
      return
    }

    const element = summaryRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Se a seção completa está visível, esconde o mini
          // Se não está visível, mostra o mini
          setShowMini(!entry.isIntersecting)
        })
      },
      {
        // Margem negativa para começar a mostrar um pouco antes
        rootMargin: '-80px 0px 0px 0px',
        threshold: 0
      }
    )

    observer.observe(element)

    // Cleanup
    return () => {
      observer.disconnect()
    }
  }, [summaryRef])

  return { showMini }
}

export default useCheckoutMiniSummary
