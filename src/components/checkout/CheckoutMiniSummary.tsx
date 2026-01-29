'use client'

/**
 * CheckoutMiniSummary - Mini resumo sticky para mobile
 * 
 * Aparece fixo no topo quando o usuário rola para baixo em mobile.
 * Usa IntersectionObserver para detectar quando o resumo principal sai de vista.
 */

import { useEffect, useState } from 'react'
import Image from 'next/image'

// Interface compatível com CartItem do carrinho
interface MiniSummaryProductItem {
  product: {
    id: string
    name: string
    imageUrl: string
    price: number
  }
  quantity: number
}

interface CheckoutMiniSummaryProps {
  items: MiniSummaryProductItem[]
  totalPix: number
  /** Ref do card de resumo para observar */
  summaryCardRef: React.RefObject<HTMLElement | null>
}

export function CheckoutMiniSummary({ 
  items = [], // Default para array vazio
  totalPix,
  summaryCardRef,
}: CheckoutMiniSummaryProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // ⚠️ CORREÇÃO: Verificação de segurança antes de acessar items[0]
  const hasItems = items && items.length > 0
  const firstItem = hasItems ? items[0] : null
  const hasMultipleItems = hasItems && items.length > 1
  
  // Formatador de moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }
  
  // Detecta se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Observer para mostrar/esconder
  useEffect(() => {
    if (!isMobile) {
      setIsVisible(false)
      return
    }
    
    const summaryCard = summaryCardRef.current
    if (!summaryCard) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          // Mostra quando o card de resumo sai da viewport
          setIsVisible(!entry.isIntersecting)
        })
      },
      { 
        threshold: 0,
        rootMargin: '-60px 0px 0px 0px' // Considera header
      }
    )
    
    observer.observe(summaryCard)
    
    return () => observer.disconnect()
  }, [summaryCardRef, isMobile])
  
  // Não renderiza em desktop ou se não tiver items
  if (!isMobile || !hasItems) {
    return null
  }
  
  return (
    <div 
      className={`checkout-mini-summary ${isVisible ? 'checkout-mini-summary--visible' : ''}`}
      aria-hidden={!isVisible}
    >
      <Image
        src={firstItem?.product?.imageUrl || '/images/placeholder.webp'}
        alt=""
        width={40}
        height={40}
        className="checkout-mini-summary__image"
      />
      <div className="checkout-mini-summary__info">
        <span className="checkout-mini-summary__name">
          {hasMultipleItems 
            ? `${items.length} produtos` 
            : firstItem?.product?.name && firstItem.product.name.length > 20 
              ? firstItem.product.name.substring(0, 20) + '...'
              : firstItem?.product?.name || 'Produto'
          }
        </span>
        <span className="checkout-mini-summary__price">
          {formatCurrency(totalPix)}
        </span>
      </div>
    </div>
  )
}

export default CheckoutMiniSummary
