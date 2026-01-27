'use client'

/**
 * ShippingCalculator — Calculadora de Frete
 * 
 * v1.1 — 25/01/2026
 * Changelog:
 * - v1.1 (25/01/2026): Botão "Calcular" alterado para outline (hierarquia visual)
 * - v1.0: Versão inicial com cálculo de frete por CEP
 */

import { useState, useCallback } from 'react'
import { 
  calculateShipping, 
  normalizeCep, 
  isValidCep,
  type ShippingResult 
} from '@/lib/shipping'

const WHATSAPP_NUMBER = '5541984209323'

export default function ShippingCalculator() {
  const [cep, setCep] = useState('')
  const [result, setResult] = useState<ShippingResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCepChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    
    // Remove tudo que não é número
    value = value.replace(/\D/g, '')
    
    // Limita a 8 dígitos
    if (value.length > 8) {
      value = value.slice(0, 8)
    }
    
    // Formata com hífen
    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`
    }
    
    setCep(value)
    
    // Limpa resultado anterior ao digitar
    if (result || error) {
      setResult(null)
      setError(null)
    }
  }, [result, error])

  const handleCalculate = useCallback(async () => {
    const normalized = normalizeCep(cep)
    
    if (!isValidCep(normalized)) {
      setError('Digite um CEP válido com 8 números')
      setResult(null)
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const shippingResult = await calculateShipping(normalized)
      
      if (!shippingResult) {
        setError('CEP não encontrado. Verifique o número digitado.')
        setResult(null)
      } else {
        setResult(shippingResult)
        setError(null)
      }
    } catch (err) {
      setError('Erro ao consultar CEP. Tente novamente.')
      setResult(null)
    } finally {
      setIsLoading(false)
    }
  }, [cep])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleCalculate()
    }
  }, [handleCalculate])

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Olá! Gostaria de confirmar se vocês entregam no meu CEP: ${cep}`
  )}`

  return (
    <div className="p-4 bg-[var(--color-cream)] rounded-lg">
      <label className="block text-sm font-medium text-[var(--color-graphite)] mb-2">
        Calcular frete e prazo
      </label>
      
      <div className="flex gap-2 w-full">
        <input
          type="text"
          value={cep}
          onChange={handleCepChange}
          onKeyDown={handleKeyDown}
          placeholder="00000-000"
          maxLength={9}
          inputMode="numeric"
          className="flex-1 min-w-0 px-4 py-3 text-base border border-[var(--color-sand-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/40 focus:border-[var(--color-sage-500)] bg-white"
        />
        <button 
          onClick={handleCalculate}
          disabled={isLoading}
          className="flex-shrink-0 px-4 py-3 text-sm font-semibold bg-transparent border-2 border-[var(--color-graphite)] text-[var(--color-graphite)] rounded-lg hover:bg-[#F5F5F5] transition-colors whitespace-nowrap disabled:opacity-50"
        >
          {isLoading ? 'Calculando...' : 'Calcular'}
        </button>
      </div>
      
      <a 
        href="https://buscacepinter.correios.com.br/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-sm text-[var(--color-sage-600)] hover:underline mt-2 inline-block"
      >
        Não sei meu CEP
      </a>

      {/* Resultado: Entrega disponível */}
      {result && !result.notDeliverable && !result.needsConfirmation && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-[var(--color-sand-light)]">
          {/* Local identificado */}
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[var(--color-sand-light)]">
            <svg className="w-5 h-5 text-[var(--color-sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm text-[var(--color-toffee)]">
              {result.neighborhood && (
                <><strong className="text-[var(--color-graphite)]">{result.neighborhood}</strong> — </>
              )}
              {result.city}
            </span>
          </div>

          {/* Opção de entrega */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-[var(--color-sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <div>
                <p className="font-medium text-[var(--color-graphite)]">Entrega Moveirama</p>
                <p className="text-sm text-[var(--color-toffee)]">
                  Receba em <strong>{result.deliveryDaysMin} a {result.deliveryDaysMax} dias úteis</strong>
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-[var(--color-graphite)]">
                R$ {result.fee.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* Info adicional */}
          <div className="mt-3 pt-3 border-t border-[var(--color-sand-light)]">
            <div className="flex items-center gap-2 text-[var(--color-sage-600)]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">Nossa equipe entrega e confere com você</span>
            </div>
          </div>
        </div>
      )}

      {/* Resultado: Precisa confirmação (bairro rural/desconhecido) */}
      {result && result.needsConfirmation && (
        <div className="mt-4 p-4 bg-[var(--color-terracota-50)] rounded-lg border border-[var(--color-terracota-500)]/20">
          {/* Local identificado */}
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-[var(--color-terracota-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm text-[var(--color-toffee)]">
              {result.neighborhood && (
                <><strong className="text-[var(--color-graphite)]">{result.neighborhood}</strong> — </>
              )}
              {result.city}
            </span>
          </div>

          <p className="text-sm text-[var(--color-terracota-700)] mb-3">
            {result.message || 'Por favor, confirme a disponibilidade de entrega no WhatsApp.'}
          </p>

          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#25D366] rounded-lg hover:bg-[#20BD5A] transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Confirmar no WhatsApp
          </a>
        </div>
      )}

      {/* Resultado: Não entregamos */}
      {result && result.notDeliverable && (
        <div className="mt-4 p-4 bg-[var(--color-terracota-50)] rounded-lg border border-[var(--color-terracota-500)]/20">
          <div className="flex items-start gap-2 mb-3">
            <svg className="w-5 h-5 text-[var(--color-terracota-500)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-[var(--color-terracota-700)]">
                {result.message || 'Poxa, ainda não chegamos aí'}
              </p>
              {result.neighborhood && (
                <p className="text-sm text-[var(--color-toffee)] mt-1">
                  {result.neighborhood} — {result.city}
                </p>
              )}
            </div>
          </div>

          <p className="text-sm text-[var(--color-toffee)] mb-3">
            Por enquanto atendemos: Curitiba, Pinhais, São José dos Pinhais, Piraquara, Quatro Barras, Campina Grande do Sul, Almirante Tamandaré, Colombo e Fazenda Rio Grande.
          </p>
        </div>
      )}

      {/* Erro genérico */}
      {error && (
        <div className="mt-4 p-4 bg-[var(--color-terracota-50)] rounded-lg border border-[var(--color-terracota-500)]/20">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-[var(--color-terracota-500)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-[var(--color-terracota-700)]">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
