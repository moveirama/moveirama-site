'use client'

/**
 * Moveirama Cart System - Cart Page
 * Versão: 1.2
 * Data: Janeiro 2026
 * Rota: /carrinho
 * 
 * v1.2 — 27/01/2026
 * - Add: Link "Continuar comprando" abaixo do botão FINALIZAR (UX)
 * 
 * v1.1 — 27/01/2026
 * - Fix: Corrigida chamada da API de frete (POST /api/shipping com body)
 * - Fix: Mapeamento correto da resposta (estimatedDays.min/max)
 * 
 * Página completa do carrinho com:
 * - Lista de produtos
 * - Calculadora de frete
 * - Resumo do pedido
 * - Trust badges
 */

import React, { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Truck, 
  Shield, 
  FileText, 
  Wrench,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

import { useCart } from '@/components/cart/CartProvider'
import { useToast } from '@/components/cart/Toast'
import { CartItem } from '@/components/cart/CartItem'
import { CartEmpty } from '@/components/cart/CartEmpty'
import { CartPageSkeleton } from '@/components/cart/CartLoading'
import { ShippingInfo } from '@/components/cart/cart-types'
import {
  formatCurrency,
  formatDeliveryTime,
  maskCEP,
  unmaskCEP,
  isValidCEP,
  getWhatsAppShippingLink,
} from '@/components/cart/cart-utils'

// ============================================
// COMPONENTE DA PÁGINA
// ============================================

export default function CartPage() {
  const router = useRouter()
  const { 
    state,
    updateQuantity,
    removeItem,
    setShipping,
    subtotal,
    subtotalPix,
    pixDiscount,
    total,
    totalPix,
    isEmpty,
    canCheckout,
  } = useCart()
  const { showToast } = useToast()
  
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false)
  const [cep, setCep] = useState(state.shipping?.cep || '')
  const [shippingError, setShippingError] = useState<string | null>(null)
  const shippingRef = useRef<HTMLDivElement>(null)
  
  const { items, shipping } = state
  
  // Handler de atualização de quantidade
  const handleUpdateQuantity = useCallback((productId: string, quantity: number) => {
    updateQuantity(productId, quantity)
  }, [updateQuantity])
  
  // Handler de remoção
  const handleRemove = useCallback((productId: string, productName: string) => {
    removeItem(productId)
    showToast('success', `${productName} removido do carrinho`)
  }, [removeItem, showToast])
  
  // Handler de cálculo de frete
  const handleCalculateShipping = useCallback(async () => {
    const cleanCep = unmaskCEP(cep)
    
    if (!isValidCEP(cleanCep)) {
      setShippingError('CEP inválido')
      return
    }
    
    setIsCalculatingShipping(true)
    setShippingError(null)
    
    try {
      // Chama a API de cálculo de frete (POST com body)
      const response = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep: cleanCep })
      })
      const result = await response.json()
      
      // API retorna { success: boolean, data?: {...}, error?: string }
      if (!result.success) {
        setShippingError(result.error || 'Região não atendida')
        return
      }
      
      const data = result.data
      
      // Seta o frete no estado global
      const shippingInfo: ShippingInfo = {
        cep: data.cep,
        address: data.address || '',
        neighborhood: data.neighborhood || '',
        city: data.city,
        state: data.state,
        fee: data.fee,
        deliveryDaysMin: data.estimatedDays.min,
        deliveryDaysMax: data.estimatedDays.max,
        isLocalDelivery: data.isLocalDelivery,
        calculatedAt: Date.now(),
      }
      
      setShipping(shippingInfo)
      showToast('success', 'Frete calculado com sucesso!')
      
    } catch (error) {
      console.error('Erro ao calcular frete:', error)
      setShippingError('Erro ao calcular frete. Tente novamente.')
    } finally {
      setIsCalculatingShipping(false)
    }
  }, [cep, setShipping, showToast])
  
  // Handler de checkout
  const handleCheckout = useCallback(() => {
    if (!canCheckout) {
      // Scroll para a calculadora de frete
      shippingRef.current?.scrollIntoView({ behavior: 'smooth' })
      showToast('warning', 'Calcule o frete antes de finalizar')
      return
    }
    
    router.push('/checkout')
  }, [canCheckout, router, showToast])
  
  // Se carrinho vazio
  if (isEmpty) {
    return (
      <div className="min-h-screen bg-[#FAF7F4]">
        <div className="container mx-auto px-4 py-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[#8B7355] hover:text-[#2D2D2D] mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a loja
          </Link>
          
          <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-8">
            Meu Carrinho
          </h1>
          
          <CartEmpty variant="page" />
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-[#FAF7F4]">
      <div className="container mx-auto px-4 py-8">
        {/* Voltar */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-[#8B7355] hover:text-[#2D2D2D] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Continuar comprando
        </Link>
        
        {/* Título */}
        <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-8">
          Meu Carrinho
          <span className="text-[#8B7355] font-normal ml-2">
            ({items.length} {items.length === 1 ? 'item' : 'itens'})
          </span>
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Coluna esquerda - Produtos */}
          <div className="space-y-4">
            {items.map((item, index) => (
              <CartItem
                key={`${item.product.id}-${item.product.variant?.id || 'default'}-${index}`}
                item={item}
                variant="full"
                onUpdateQuantity={(qty) => handleUpdateQuantity(item.product.id, qty)}
                onRemove={() => handleRemove(item.product.id, item.product.name)}
              />
            ))}
            
            {/* Trust badges (mobile only) */}
            <div className="lg:hidden">
              <TrustBadges />
            </div>
          </div>
          
          {/* Coluna direita - Sidebar */}
          <div className="space-y-6">
            {/* Calculadora de frete */}
            <div 
              ref={shippingRef}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-base font-semibold text-[#2D2D2D] mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Calcular frete e prazo
              </h2>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(maskCEP(e.target.value))}
                  placeholder="00000-000"
                  maxLength={9}
                  className="
                    flex-1 h-12 px-4
                    text-base text-[#2D2D2D]
                    bg-white
                    border border-[#E8DFD5] rounded-lg
                    placeholder:text-[#B8A99A]
                    focus:outline-none focus:ring-2 focus:ring-[#6B8E7A]/40 focus:border-[#6B8E7A]
                  "
                />
                <button
                  type="button"
                  onClick={handleCalculateShipping}
                  disabled={isCalculatingShipping}
                  className="
                    h-12 px-6
                    font-semibold text-white
                    bg-[#2D2D2D] hover:bg-[#1A1A1A]
                    rounded-lg
                    transition-colors
                    disabled:opacity-50
                    flex items-center gap-2
                  "
                >
                  {isCalculatingShipping ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Calculando...</span>
                    </>
                  ) : (
                    'Calcular'
                  )}
                </button>
              </div>
              
              {/* Link buscar CEP */}
              <a
                href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm text-[#2563EB] hover:underline"
              >
                Não sei meu CEP
              </a>
              
              {/* Resultado do frete */}
              {shipping && !shippingError && (
                <div className="mt-4 p-4 bg-[#E8F5E9] rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#6B8E7A] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-[#2D2D2D]">
                        {shipping.neighborhood}, {shipping.city} - {shipping.state}
                      </p>
                      <p className="text-sm text-[#5C4D3C] mt-1">
                        {formatDeliveryTime(shipping.deliveryDaysMin, shipping.deliveryDaysMax)}
                      </p>
                      {shipping.isLocalDelivery && (
                        <p className="text-xs text-[#6B8E7A] mt-1 flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          Frota própria Moveirama
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {shipping.fee === 0 ? (
                        <span className="font-bold text-[#6B8E7A]">Grátis</span>
                      ) : (
                        <span className="font-bold text-[#2D2D2D]">
                          {formatCurrency(shipping.fee)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Erro de frete */}
              {shippingError && shippingError !== 'FORA_AREA' && (
                <div className="mt-4 p-4 bg-[#FEF2F2] rounded-lg">
                  <div className="flex items-center gap-2 text-[#D94F4F]">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{shippingError}</span>
                  </div>
                </div>
              )}
              
              {/* Fora da área */}
              {shippingError === 'FORA_AREA' && (
                <div className="mt-4 p-4 bg-[#FDF0EB] rounded-lg">
                  <p className="text-sm text-[#B85C38] mb-3">
                    Ainda não entregamos nessa região via frota própria.
                  </p>
                  <a
                    href={getWhatsAppShippingLink(cep)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex items-center gap-2
                      px-4 py-2
                      bg-[#25D366] hover:bg-[#20BD5A]
                      text-white text-sm font-medium
                      rounded-lg
                      transition-colors
                    "
                  >
                    <MessageCircle className="w-4 h-4" />
                    Consultar pelo WhatsApp
                  </a>
                </div>
              )}
            </div>
            
            {/* Resumo do pedido */}
            <div className="bg-white rounded-xl p-6 shadow-sm lg:sticky lg:top-6">
              <h2 className="text-base font-semibold text-[#2D2D2D] mb-4">
                Resumo do pedido
              </h2>
              
              <div className="space-y-3 mb-6">
                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B7355]">Subtotal</span>
                  <span className="text-[#2D2D2D]">{formatCurrency(subtotal)}</span>
                </div>
                
                {/* Economia Pix */}
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B8E7A]">Economia no Pix</span>
                  <span className="text-[#6B8E7A]">- {formatCurrency(pixDiscount)}</span>
                </div>
                
                {/* Frete */}
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B7355]">Frete</span>
                  {shipping ? (
                    <span className="text-[#2D2D2D]">
                      {shipping.fee === 0 ? 'Grátis' : formatCurrency(shipping.fee)}
                    </span>
                  ) : (
                    <span className="text-[#B8A99A]">Calcule acima</span>
                  )}
                </div>
                
                {/* Divider */}
                <div className="h-px bg-[#E8DFD5] my-3" />
                
                {/* Total Pix */}
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-base font-semibold text-[#2D2D2D]">Total</span>
                    <span className="text-xs text-[#8B7355] ml-1">no Pix</span>
                  </div>
                  <span className="text-2xl font-bold text-[#6B8E7A]">
                    {formatCurrency(totalPix)}
                  </span>
                </div>
                
                {/* Economia badge */}
                <div className="flex justify-end">
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-[#E8F5E9] text-[#6B8E7A] rounded">
                    Você economiza {formatCurrency(pixDiscount)}
                  </span>
                </div>
                
                {/* Parcelamento */}
                <p className="text-sm text-[#8B7355] text-right">
                  ou parcele em até <br />
                  <span className="font-medium text-[#2D2D2D]">
                    12x de {formatCurrency(total / 12)} no cartão
                  </span>
                </p>
              </div>
              
              {/* Botão finalizar */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={!canCheckout}
                className={`
                  w-full h-14
                  flex items-center justify-center
                  font-semibold text-white
                  rounded-lg
                  transition-all duration-150
                  ${canCheckout
                    ? 'bg-[#6B8E7A] hover:bg-[#5A7A68]'
                    : 'bg-[#D4C9BD] cursor-not-allowed'
                  }
                `}
              >
                {canCheckout ? 'FINALIZAR COMPRA' : 'Calcule o frete para continuar'}
              </button>
              
              {!canCheckout && (
                <p className="text-xs text-center text-[#8B7355] mt-2">
                  ↑ Informe o CEP para liberar
                </p>
              )}
              
              {/* Link "Continuar comprando" - discreto, não compete com CTA */}
              <Link
                href="/"
                className="
                  block w-full mt-4 py-2
                  text-center text-sm text-[#8B7355]
                  hover:text-[#6B5D4D] hover:underline
                  transition-colors
                "
              >
                ← Continuar comprando
              </Link>
            </div>
            
            {/* Trust badges (desktop only) */}
            <div className="hidden lg:block">
              <TrustBadges />
            </div>
          </div>
        </div>
      </div>
      
      {/* Sticky bar mobile */}
      <div className="
        lg:hidden
        fixed bottom-0 left-0 right-0
        bg-white border-t border-[#E8DFD5]
        px-4 py-3
        pb-safe
        shadow-[0_-4px_12px_rgba(0,0,0,0.08)]
        z-50
      ">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-[#6B8E7A]">
              {formatCurrency(totalPix)}
              <span className="text-xs font-normal text-[#8B7355] ml-1">no Pix</span>
            </p>
            <p className="text-xs text-[#8B7355]">
              ou 12x de {formatCurrency(total / 12)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={!canCheckout}
            className={`
              h-12 px-8
              font-semibold text-white
              rounded-lg
              transition-colors
              ${canCheckout
                ? 'bg-[#6B8E7A] hover:bg-[#5A7A68]'
                : 'bg-[#D4C9BD]'
              }
            `}
          >
            FINALIZAR
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// TRUST BADGES
// ============================================

function TrustBadges() {
  const badges = [
    { icon: FileText, title: 'Nota Fiscal', subtitle: 'em todos os pedidos' },
    { icon: Shield, title: '7 dias', subtitle: 'para trocar grátis' },
    { icon: Wrench, title: 'Garantia', subtitle: 'de fábrica' },
    { icon: Truck, title: 'Entrega própria', subtitle: 'em Curitiba e região' },
  ]
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        {badges.map((badge, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-[#F0E8DF] rounded-lg">
              <badge.icon className="w-5 h-5 text-[#8B7355]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#2D2D2D]">{badge.title}</p>
              <p className="text-xs text-[#8B7355]">{badge.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
