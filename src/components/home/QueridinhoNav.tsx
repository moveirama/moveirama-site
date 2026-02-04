'use client'

/**
 * QueridinhoNav.tsx - Navegação do Carrossel (Client Component)
 * Gerencia setas de navegação e dots
 * 
 * @since v2.8
 */

import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface QueridinhoNavProps {
  totalProducts: number
}

export function QueridinhoNav({ totalProducts }: QueridinhoNavProps) {
  const hasInitialized = useRef(false)

  useEffect(() => {
    // Evita dupla inicialização
    if (hasInitialized.current) return
    hasInitialized.current = true

    const track = document.getElementById('queridinhos-track')
    if (!track) {
      console.log('[QueridinhoNav] Track não encontrado')
      return
    }

    console.log('[QueridinhoNav] Inicializando navegação...')

    // ========================================
    // SETAS DE NAVEGAÇÃO
    // ========================================
    const prevBtn = document.querySelector('.queridinhos__arrow--prev') as HTMLButtonElement
    const nextBtn = document.querySelector('.queridinhos__arrow--next') as HTMLButtonElement

    const scrollCarousel = (direction: 'prev' | 'next') => {
      const item = track.querySelector('.queridinhos__item') as HTMLElement
      if (!item) return
      
      const cardWidth = item.offsetWidth
      const gap = 24 // gap do CSS
      const scrollAmount = cardWidth + gap
      
      console.log(`[QueridinhoNav] Scroll ${direction}: ${scrollAmount}px`)
      
      track.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      })
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => scrollCarousel('prev'))
      console.log('[QueridinhoNav] Prev button conectado')
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => scrollCarousel('next'))
      console.log('[QueridinhoNav] Next button conectado')
    }

    // ========================================
    // DOTS (Mobile)
    // ========================================
    const dots = document.querySelectorAll('.queridinhos__dot')
    
    // Atualiza dots no scroll
    const updateDots = () => {
      const item = track.querySelector('.queridinhos__item') as HTMLElement
      if (!item || dots.length === 0) return
      
      const cardWidth = item.offsetWidth
      const gap = 16
      const activeIndex = Math.round(track.scrollLeft / (cardWidth + gap))
      
      dots.forEach((dot, i) => {
        dot.classList.toggle('queridinhos__dot--active', i === activeIndex)
      })
    }

    track.addEventListener('scroll', updateDots)

    // Clique nos dots
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const item = track.querySelector('.queridinhos__item') as HTMLElement
        if (!item) return
        
        const cardWidth = item.offsetWidth
        const gap = 16
        
        track.scrollTo({
          left: i * (cardWidth + gap),
          behavior: 'smooth'
        })
      })
    })

    console.log(`[QueridinhoNav] ${dots.length} dots conectados`)

    // Cleanup
    return () => {
      track.removeEventListener('scroll', updateDots)
    }
  }, [])

  return (
    <div className="queridinhos__nav" aria-label="Navegação do carrossel">
      <button 
        className="queridinhos__arrow queridinhos__arrow--prev"
        aria-label="Produtos anteriores"
        type="button"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button 
        className="queridinhos__arrow queridinhos__arrow--next"
        aria-label="Próximos produtos"
        type="button"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
