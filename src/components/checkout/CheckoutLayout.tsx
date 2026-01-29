'use client'

/**
 * CheckoutLayout - Container principal do checkout
 * Spec: SPEC_Checkout_Trust_Elements_v1.1.md
 * 
 * Desktop (≥1024px): 2 colunas (form left, sidebar sticky right)
 * Mobile: coluna única, sidebar colapsável
 */

import { ReactNode } from 'react'

interface CheckoutLayoutProps {
  /** Conteúdo principal (formulário) */
  children: ReactNode
  /** Sidebar (resumo do pedido) */
  sidebar: ReactNode
  /** Trust Bar no topo */
  trustBar?: ReactNode
  /** Steps de progresso */
  steps?: ReactNode
}

export function CheckoutLayout({ 
  children, 
  sidebar, 
  trustBar, 
  steps 
}: CheckoutLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-warm-white,#FAF7F4)]">
      <div className="checkout-container">
        {/* Trust Bar */}
        {trustBar && (
          <div className="pt-6">
            {trustBar}
          </div>
        )}
        
        {/* Steps */}
        {steps && (
          <div className="pt-8 pb-4">
            {steps}
          </div>
        )}
        
        {/* Layout principal */}
        <div className="checkout-layout py-6">
          {/* Coluna principal (formulário) */}
          <main className="checkout-main">
            {children}
          </main>
          
          {/* Sidebar (resumo) */}
          {sidebar}
        </div>
      </div>
    </div>
  )
}

export default CheckoutLayout
