'use client'

/**
 * CheckoutIdentity - Identidade da loja (CNPJ)
 * Spec: SPEC_Checkout_Trust_Elements_v1.1.md
 * 
 * Mostra CNPJ antes do CTA para reforçar que a loja é real.
 */

import { Building2 } from 'lucide-react'

interface CheckoutIdentityProps {
  /** Nome da empresa */
  companyName?: string
  /** CNPJ formatado */
  cnpj?: string
  /** Cidade/Estado */
  location?: string
}

export function CheckoutIdentity({
  companyName = 'Moveirama Móveis Ltda',
  cnpj = '61.154.643/0001-84',
  location = 'Curitiba, PR',
}: CheckoutIdentityProps) {
  return (
    <div className="checkout-identity">
      <Building2 className="checkout-identity__icon" />
      <div className="checkout-identity__info">
        <span className="checkout-identity__name">{companyName}</span>
        <span className="checkout-identity__cnpj">CNPJ: {cnpj}</span>
        <span className="checkout-identity__location">{location}</span>
      </div>
    </div>
  )
}

export default CheckoutIdentity
