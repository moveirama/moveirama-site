'use client'

import { Package, ChevronDown } from 'lucide-react'

interface CheckoutMiniSummaryProps {
  itemCount: number
  total: number
  isVisible: boolean
  onScrollToSummary: () => void
}

/**
 * Mini-banner sticky que aparece no mobile quando a seção de resumo
 * do pedido sai da viewport.
 * 
 * Specs do Squad Visual:
 * - Aparece só no mobile (< 768px)
 * - Fica sticky abaixo do header (top: 56px)
 * - Mostra: 📦 1 item · R$ 452,00 [Ver ↓]
 * - Botão "Ver ↓" faz scroll suave até a seção completa
 */
export function CheckoutMiniSummary({
  itemCount,
  total,
  isVisible,
  onScrollToSummary
}: CheckoutMiniSummaryProps) {
  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  // Plural correto
  const itemLabel = itemCount === 1 ? 'item' : 'itens'

  if (!isVisible) return null

  return (
    <div className="checkout-mini-summary">
      <div className="checkout-mini-summary__content">
        {/* Info do pedido */}
        <div className="checkout-mini-summary__info">
          <Package className="checkout-mini-summary__icon" size={18} />
          <span className="checkout-mini-summary__text">
            {itemCount} {itemLabel} · {formatCurrency(total)}
          </span>
        </div>

        {/* Botão para scroll */}
        <button
          type="button"
          onClick={onScrollToSummary}
          className="checkout-mini-summary__button"
          aria-label="Ver resumo do pedido"
        >
          Ver
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  )
}

export default CheckoutMiniSummary
