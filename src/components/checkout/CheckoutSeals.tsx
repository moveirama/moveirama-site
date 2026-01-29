'use client'

/**
 * CheckoutSeals - Selos de segurança e logo do gateway
 * Spec: SPEC_Checkout_Trust_Elements_v1.1.md
 * Versão: 2.0 - Adicionado selo de Garantia de Fábrica
 * 
 * Elementos:
 * - Dados protegidos
 * - Nota Fiscal
 * - Manual + Vídeo montagem
 * - Garantia de Fábrica (NOVO)
 * - Logo do gateway (Mercado Pago)
 */

import { Lock, FileText, Shield } from 'lucide-react'

// Ícone de livro aberto (manual)
function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg" 
      width="28" 
      height="28" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  )
}

export function CheckoutSeals() {
  return (
    <div className="checkout-seals-container">
      {/* Selos */}
      <div className="checkout-seals">
        <div className="checkout-seal">
          <Lock className="checkout-seal__icon" />
          <span className="checkout-seal__text">
            Dados<br />protegidos
          </span>
        </div>
        
        <div className="checkout-seal">
          <FileText className="checkout-seal__icon" />
          <span className="checkout-seal__text">
            Nota<br />Fiscal
          </span>
        </div>
        
        <div className="checkout-seal">
          <BookOpenIcon className="checkout-seal__icon" />
          <span className="checkout-seal__text">
            <strong>Manual + Vídeo</strong><br />montagem fácil
          </span>
        </div>
        
        <div className="checkout-seal">
          <Shield className="checkout-seal__icon" />
          <span className="checkout-seal__text">
            <strong>Garantia de Fábrica</strong><br />3 meses
          </span>
        </div>
      </div>
      
      {/* Gateway */}
      <div className="checkout-gateway">
        <span className="checkout-gateway__text">Pagamento processado por</span>
        {/* Placeholder para logo do Mercado Pago */}
        <div className="checkout-gateway__logo">
          <svg 
            viewBox="0 0 120 30" 
            fill="currentColor"
            className="w-[100px] h-[24px] text-[#00B1EA]"
            aria-label="Mercado Pago"
          >
            <text x="0" y="22" fontSize="14" fontWeight="600">mercado pago</text>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default CheckoutSeals
