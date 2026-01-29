'use client'

/**
 * CheckoutTrustBar - Barra de confiança no checkout
 * Spec: SPEC_Checkout_Trust_Elements_v1.1.md
 * 
 * Elementos: Site Seguro (SSL), Nota Fiscal, Entrega Curitiba
 */

import { Lock, FileText, Truck } from 'lucide-react'

export function CheckoutTrustBar() {
  return (
    <div className="checkout-trust-bar">
      <div className="checkout-trust-item">
        <Lock className="checkout-trust-icon" />
        <div className="checkout-trust-text">
          <span className="checkout-trust-text__main">Site Seguro</span>
          <span className="checkout-trust-text__sub">SSL</span>
        </div>
      </div>
      
      <div className="checkout-trust-item">
        <FileText className="checkout-trust-icon" />
        <div className="checkout-trust-text">
          <span className="checkout-trust-text__main">Nota Fiscal</span>
          <span className="checkout-trust-text__sub">Sempre</span>
        </div>
      </div>
      
      <div className="checkout-trust-item">
        <Truck className="checkout-trust-icon" />
        <div className="checkout-trust-text">
          <span className="checkout-trust-text__main">Entrega em Curitiba</span>
          <span className="checkout-trust-text__sub">Frota Própria</span>
        </div>
      </div>
    </div>
  )
}

export default CheckoutTrustBar
