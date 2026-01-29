'use client'

/**
 * CheckoutSummaryCard - Sidebar do checkout com resumo completo
 * Spec: SPEC_Checkout_Trust_Elements_v1.1.md
 * 
 * v1.1 — 28/01/2026
 * Changelog:
 * - v1.1: Adicionado "3 meses de garantia" à lista de benefícios
 * 
 * Elementos:
 * - Foto do produto (120px desktop, 80px mobile)
 * - Nome, cor, quantidade
 * - Valores (subtotal, frete, total, Pix)
 * - Prazo de entrega
 * - Benefícios (NF, Manual, Frota, Garantia)
 * - WhatsApp CTA
 */

import { forwardRef } from 'react'
import Image from 'next/image'
import { Truck, Check, MessageCircle } from 'lucide-react'

// ========================================
// TIPOS - Compatíveis com cart-types.ts
// ========================================

// Aceita qualquer formato de variant (string ou objeto CartVariant)
type VariantType = {
  id?: string
  name?: string
  color?: string
  sku?: string
  [key: string]: unknown
} | string | undefined

interface SummaryProductItem {
  product: {
    id: string
    name: string
    imageUrl: string
    price: number
    pricePix?: number
    variant?: VariantType
  }
  quantity: number
}

interface SummaryShippingData {
  cep: string
  city: string
  state?: string
  neighborhood?: string
  address?: string
  fee: number
  deliveryDaysMin: number
  deliveryDaysMax: number
}

export interface CheckoutSummaryCardProps {
  items: SummaryProductItem[]
  subtotal: number
  subtotalPix: number
  shipping: SummaryShippingData
  total: number
  totalPix: number
  pixDiscount: number
}

// Helper para extrair nome da variante
function getVariantName(variant: VariantType): string | null {
  if (!variant) return null
  if (typeof variant === 'string') return variant
  return variant.name || variant.color || null
}

export const CheckoutSummaryCard = forwardRef<HTMLDivElement, CheckoutSummaryCardProps>(
  function CheckoutSummaryCard({
    items,
    subtotal,
    subtotalPix,
    shipping,
    total,
    totalPix,
    pixDiscount,
  }, ref) {
    // Primeiro item para exibição principal (se múltiplos, mostra resumo)
    const firstItem = items[0]
    const hasMultipleItems = items.length > 1
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
    
    // Formatador de moeda
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value)
    }
    
    // Nome da variante
    const variantName = firstItem?.product?.variant 
      ? getVariantName(firstItem.product.variant)
      : null
    
    return (
      <aside className="checkout-sidebar" ref={ref}>
        <div className="checkout-sidebar__inner">
          <div className="checkout-summary-card">
            <h2 className="checkout-summary-card__title">Seu Pedido</h2>
            
            {/* Produto */}
            <div className="checkout-summary-card__product">
              <div className="checkout-summary-card__image-wrapper">
                <Image
                  src={firstItem?.product?.imageUrl || '/images/placeholder.webp'}
                  alt={firstItem?.product?.name || 'Produto'}
                  width={120}
                  height={120}
                  className="checkout-summary-card__image"
                />
                {hasMultipleItems && (
                  <span className="checkout-summary-card__badge">
                    +{items.length - 1}
                  </span>
                )}
              </div>
              <div className="checkout-summary-card__info">
                <h3 className="checkout-summary-card__name">
                  {hasMultipleItems 
                    ? `${items.length} produtos` 
                    : firstItem?.product?.name || 'Produto'
                  }
                </h3>
                {!hasMultipleItems && variantName && (
                  <p className="checkout-summary-card__variant">
                    Cor: {variantName}
                  </p>
                )}
                <p className="checkout-summary-card__qty">
                  Qtd: {totalQuantity}
                </p>
              </div>
            </div>
            
            <hr className="checkout-summary-card__divider" />
            
            {/* Valores */}
            <div className="checkout-summary-card__values">
              <div className="checkout-summary-card__row">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="checkout-summary-card__row">
                <span>Frete</span>
                <span>
                  {shipping.fee === 0 
                    ? <span className="text-sage-600 font-semibold">Grátis</span>
                    : formatCurrency(shipping.fee)
                  }
                </span>
              </div>
            </div>
            
            <div className="checkout-summary-card__row checkout-summary-card__row--total">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            
            {/* Destaque Pix */}
            <div className="checkout-summary-card__pix">
              <span className="checkout-summary-card__pix-badge">💚 No Pix</span>
              <span className="checkout-summary-card__pix-value">{formatCurrency(totalPix)}</span>
              <span className="checkout-summary-card__pix-savings">
                Economia: {formatCurrency(pixDiscount)}
              </span>
            </div>
            
            <hr className="checkout-summary-card__divider" />
            
            {/* Entrega */}
            <div className="checkout-summary-card__delivery">
              <Truck className="checkout-summary-card__delivery-icon" />
              <div>
                <p className="checkout-summary-card__delivery-text">
                  Entrega: <strong>{shipping.deliveryDaysMin}-{shipping.deliveryDaysMax} dias úteis</strong>
                </p>
                <p className="checkout-summary-card__delivery-sub">
                  em {shipping.city} e região
                </p>
              </div>
            </div>
            
            <hr className="checkout-summary-card__divider" />
            
            {/* Benefícios */}
            <ul className="checkout-summary-card__benefits">
              <li>
                <Check className="w-4 h-4" />
                Nota Fiscal inclusa
              </li>
              <li>
                <Check className="w-4 h-4" />
                Manual + Vídeo de montagem
              </li>
              <li>
                <Check className="w-4 h-4" />
                Entrega com frota própria
              </li>
              <li>
                <Check className="w-4 h-4" />
                3 meses de garantia
              </li>
            </ul>
            
            <hr className="checkout-summary-card__divider" />
            
            {/* WhatsApp */}
            <a
              href={`https://wa.me/5541984209323?text=${encodeURIComponent(
                `Olá! Estou finalizando minha compra e tenho uma dúvida.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="checkout-summary-card__whatsapp"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Dúvida? Chama no WhatsApp!</span>
            </a>
          </div>
        </div>
      </aside>
    )
  }
)

export default CheckoutSummaryCard
