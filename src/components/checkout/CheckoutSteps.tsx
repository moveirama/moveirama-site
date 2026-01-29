'use client'

/**
 * CheckoutSteps - Indicador de progresso do checkout
 * Versão: 2.1 - Labels centralizados abaixo dos círculos
 * 
 * 3 etapas: Dados → Endereço → Pagamento
 */

import { Check } from 'lucide-react'

interface CheckoutStepsProps {
  currentStep: 1 | 2 | 3
}

const steps = [
  { id: 1, name: 'Dados' },
  { id: 2, name: 'Endereço' },
  { id: 3, name: 'Pagamento' },
]

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="checkout-steps" role="navigation" aria-label="Progresso do checkout">
      <ol className="checkout-steps__list">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep
          
          return (
            <li key={step.id} className="checkout-steps__item">
              {/* Linha conectora (exceto no primeiro) */}
              {index > 0 && (
                <div 
                  className={`checkout-steps__line ${
                    isCompleted ? 'checkout-steps__line--completed' : ''
                  }`}
                  aria-hidden="true"
                />
              )}
              
              {/* Coluna: Círculo + Nome */}
              <div className="checkout-steps__step">
                {/* Círculo do step */}
                <div 
                  className={`checkout-steps__circle ${
                    isCompleted 
                      ? 'checkout-steps__circle--completed' 
                      : isCurrent 
                        ? 'checkout-steps__circle--current' 
                        : ''
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                
                {/* Nome do step */}
                <span 
                  className={`checkout-steps__name ${
                    isCurrent ? 'checkout-steps__name--current' : ''
                  }`}
                >
                  {step.name}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default CheckoutSteps
