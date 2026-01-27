'use client'

/**
 * Moveirama Cart System - Checkout Page
 * Versão: 1.0
 * Data: Janeiro 2026
 * Rota: /checkout
 * 
 * Página de checkout com:
 * - Resumo do pedido (colapsável)
 * - Dados pessoais
 * - Endereço de entrega
 * - Forma de pagamento (Pix ou Cartão)
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp,
  Copy,
  Check,
  Loader2,
  CreditCard,
  QrCode,
  AlertCircle,
  Clock,
} from 'lucide-react'

import { useCart } from '@/components/cart/CartProvider'
import { useToast } from '@/components/cart/Toast'
import { CheckoutPageSkeleton } from '@/components/cart/CartLoading'
import { CustomerData, DeliveryAddress } from '@/components/cart/cart-types'
import {
  formatCurrency,
  formatDeliveryTime,
  maskCPF,
  maskPhone,
  unmaskCPF,
  unmaskPhone,
  isValidCPF,
  isValidEmail,
  isValidPhone,
} from '@/components/cart/cart-utils'

// ============================================
// TIPOS LOCAIS
// ============================================

interface FormErrors {
  fullName?: string
  cpf?: string
  email?: string
  whatsapp?: string
  street?: string
  number?: string
  neighborhood?: string
}

type PaymentMethod = 'pix' | 'card'

// ============================================
// COMPONENTE DA PÁGINA
// ============================================

export default function CheckoutPage() {
  const router = useRouter()
  const { 
    state,
    subtotal,
    subtotalPix,
    pixDiscount,
    total,
    totalPix,
    isEmpty,
    canCheckout,
    clearCart,
  } = useCart()
  const { showToast } = useToast()
  
  const { items, shipping } = state
  
  // Estado do formulário
  const [customerData, setCustomerData] = useState<CustomerData>({
    fullName: '',
    cpf: '',
    email: '',
    whatsapp: '',
  })
  
  const [addressData, setAddressData] = useState<DeliveryAddress>({
    cep: shipping?.cep || '',
    street: shipping?.address || '',
    number: '',
    complement: '',
    neighborhood: shipping?.neighborhood || '',
    city: shipping?.city || '',
    state: shipping?.state || '',
  })
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [installments, setInstallments] = useState(1)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  
  // Pix state
  const [pixCode, setPixCode] = useState<string | null>(null)
  const [pixQrCode, setPixQrCode] = useState<string | null>(null)
  const [pixCopied, setPixCopied] = useState(false)
  const [pixExpiry, setPixExpiry] = useState<Date | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(30 * 60) // 30 minutos em segundos
  
  // Redireciona se carrinho vazio ou sem frete
  useEffect(() => {
    if (isEmpty) {
      router.push('/carrinho')
    } else if (!shipping) {
      router.push('/carrinho')
      showToast('warning', 'Calcule o frete antes de continuar')
    }
  }, [isEmpty, shipping, router, showToast])
  
  // Preenche endereço com dados do shipping
  useEffect(() => {
    if (shipping) {
      setAddressData(prev => ({
        ...prev,
        cep: shipping.cep,
        street: shipping.address,
        neighborhood: shipping.neighborhood,
        city: shipping.city,
        state: shipping.state,
      }))
    }
  }, [shipping])
  
  // Timer do Pix
  useEffect(() => {
    if (!pixExpiry) return
    
    const interval = setInterval(() => {
      const now = new Date()
      const diff = Math.max(0, Math.floor((pixExpiry.getTime() - now.getTime()) / 1000))
      setTimeLeft(diff)
      
      if (diff === 0) {
        clearInterval(interval)
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [pixExpiry])
  
  // Formata tempo restante
  const formatTimeLeft = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  // Handlers de input
  const handleCustomerChange = useCallback((field: keyof CustomerData, value: string) => {
    let formattedValue = value
    
    if (field === 'cpf') {
      formattedValue = maskCPF(value)
    } else if (field === 'whatsapp') {
      formattedValue = maskPhone(value)
    }
    
    setCustomerData(prev => ({ ...prev, [field]: formattedValue }))
    
    // Limpa erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])
  
  const handleAddressChange = useCallback((field: keyof DeliveryAddress, value: string) => {
    setAddressData(prev => ({ ...prev, [field]: value }))
    
    // Limpa erro do campo
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])
  
  // Validação do formulário
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    
    // Dados pessoais
    if (!customerData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório'
    }
    
    if (!isValidCPF(customerData.cpf)) {
      newErrors.cpf = 'CPF inválido'
    }
    
    if (!isValidEmail(customerData.email)) {
      newErrors.email = 'E-mail inválido'
    }
    
    if (!isValidPhone(customerData.whatsapp)) {
      newErrors.whatsapp = 'WhatsApp inválido'
    }
    
    // Endereço
    if (!addressData.street.trim()) {
      newErrors.street = 'Rua é obrigatória'
    }
    
    if (!addressData.number.trim()) {
      newErrors.number = 'Número é obrigatório'
    }
    
    if (!addressData.neighborhood.trim()) {
      newErrors.neighborhood = 'Bairro é obrigatório'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [customerData, addressData])
  
  // Copia código Pix
  const handleCopyPix = useCallback(async () => {
    if (!pixCode) return
    
    try {
      await navigator.clipboard.writeText(pixCode)
      setPixCopied(true)
      showToast('success', 'Código Pix copiado!')
      setTimeout(() => setPixCopied(false), 3000)
    } catch (err) {
      showToast('error', 'Erro ao copiar código')
    }
  }, [pixCode, showToast])
  
  // Submit do formulário
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      showToast('error', 'Preencha todos os campos obrigatórios')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Cria o pedido no backend
      const orderData = {
        customer: {
          ...customerData,
          cpf: unmaskCPF(customerData.cpf),
          whatsapp: unmaskPhone(customerData.whatsapp),
        },
        address: addressData,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.price,
          unitPricePix: item.product.pricePix || item.product.price * 0.95,
        })),
        shipping: {
          fee: shipping!.fee,
          deliveryDaysMin: shipping!.deliveryDaysMin,
          deliveryDaysMax: shipping!.deliveryDaysMax,
        },
        paymentMethod,
        installments: paymentMethod === 'card' ? installments : 1,
      }
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      if (paymentMethod === 'pix') {
        // Exibe o QR Code do Pix
        setPixCode(data.pixCode)
        setPixQrCode(data.pixQrCode)
        setPixExpiry(new Date(Date.now() + 30 * 60 * 1000)) // 30 minutos
        
        // Inicia polling para verificar pagamento
        startPaymentPolling(data.orderId)
      } else {
        // Redireciona para Mercado Pago
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl
        }
      }
      
    } catch (error) {
      showToast('error', 'Erro ao processar pedido. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }, [validateForm, customerData, addressData, items, shipping, paymentMethod, installments, showToast])
  
  // Polling para verificar pagamento Pix
  const startPaymentPolling = useCallback((orderId: string) => {
    const checkPayment = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}/status`)
        const data = await response.json()
        
        if (data.status === 'confirmed' || data.status === 'paid') {
          clearCart()
          router.push(`/pedido/confirmado?id=${orderId}`)
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error)
      }
    }
    
    // Verifica a cada 5 segundos
    const interval = setInterval(checkPayment, 5000)
    
    // Para após 30 minutos
    setTimeout(() => clearInterval(interval), 30 * 60 * 1000)
  }, [clearCart, router])
  
  // Loading state
  if (isEmpty || !shipping) {
    return <CheckoutPageSkeleton />
  }
  
  // Se está aguardando Pix
  if (pixCode && pixQrCode) {
    return (
      <PixPaymentScreen
        pixCode={pixCode}
        pixQrCode={pixQrCode}
        total={totalPix}
        timeLeft={timeLeft}
        formatTimeLeft={formatTimeLeft}
        onCopy={handleCopyPix}
        copied={pixCopied}
      />
    )
  }
  
  return (
    <div className="min-h-screen bg-[#FAF7F4]">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Voltar */}
        <Link 
          href="/carrinho"
          className="inline-flex items-center gap-2 text-[#8B7355] hover:text-[#2D2D2D] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao carrinho
        </Link>
        
        {/* Título */}
        <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-8">
          Finalizar Compra
        </h1>
        
        {/* Resumo colapsável */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowSummary(!showSummary)}
            className="w-full px-6 py-4 flex items-center justify-between"
          >
            <span className="font-medium text-[#2D2D2D]">
              Resumo do pedido ({items.length} {items.length === 1 ? 'item' : 'itens'})
            </span>
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#6B8E7A]">
                {formatCurrency(totalPix)}
              </span>
              {showSummary ? (
                <ChevronUp className="w-5 h-5 text-[#8B7355]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#8B7355]" />
              )}
            </div>
          </button>
          
          {showSummary && (
            <div className="px-6 pb-4 border-t border-[#E8DFD5]">
              <div className="divide-y divide-[#E8DFD5]">
                {items.map(item => (
                  <div key={item.product.id} className="py-3 flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#F0E8DF] flex-shrink-0">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2D2D2D] line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-[#8B7355]">
                        Qtd: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#6B8E7A]">
                        {formatCurrency((item.product.pricePix || item.product.price * 0.95) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-[#E8DFD5] space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8B7355]">Subtotal</span>
                  <span>{formatCurrency(subtotalPix)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B7355]">Frete</span>
                  <span>{shipping.fee === 0 ? 'Grátis' : formatCurrency(shipping.fee)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total no Pix</span>
                  <span className="text-[#6B8E7A]">{formatCurrency(totalPix)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Dados Pessoais */}
        <fieldset className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <legend className="text-base font-semibold text-[#2D2D2D] mb-4">
            Dados Pessoais
          </legend>
          
          <div className="space-y-4">
            {/* Nome */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-[#5C4D3C] mb-1">
                Nome completo *
              </label>
              <input
                id="fullName"
                type="text"
                value={customerData.fullName}
                onChange={(e) => handleCustomerChange('fullName', e.target.value)}
                className={`
                  w-full h-12 px-4
                  text-base text-[#2D2D2D]
                  border rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-[#6B8E7A]/40
                  ${errors.fullName ? 'border-[#D94F4F]' : 'border-[#E8DFD5] focus:border-[#6B8E7A]'}
                `}
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-[#D94F4F]">{errors.fullName}</p>
              )}
            </div>
            
            {/* CPF e Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-[#5C4D3C] mb-1">
                  CPF *
                </label>
                <input
                  id="cpf"
                  type="text"
                  value={customerData.cpf}
                  onChange={(e) => handleCustomerChange('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className={`
                    w-full h-12 px-4
                    text-base text-[#2D2D2D]
                    border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-[#6B8E7A]/40
                    ${errors.cpf ? 'border-[#D94F4F]' : 'border-[#E8DFD5] focus:border-[#6B8E7A]'}
                  `}
                  aria-invalid={!!errors.cpf}
                />
                {errors.cpf && (
                  <p className="mt-1 text-sm text-[#D94F4F]">{errors.cpf}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#5C4D3C] mb-1">
                  E-mail *
                </label>
                <input
                  id="email"
                  type="email"
                  value={customerData.email}
                  onChange={(e) => handleCustomerChange('email', e.target.value)}
                  placeholder="seu@email.com"
                  className={`
                    w-full h-12 px-4
                    text-base text-[#2D2D2D]
                    border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-[#6B8E7A]/40
                    ${errors.email ? 'border-[#D94F4F]' : 'border-[#E8DFD5] focus:border-[#6B8E7A]'}
                  `}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-[#D94F4F]">{errors.email}</p>
                )}
              </div>
            </div>
            
            {/* WhatsApp */}
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-[#5C4D3C] mb-1">
                WhatsApp *
              </label>
              <input
                id="whatsapp"
                type="tel"
                value={customerData.whatsapp}
                onChange={(e) => handleCustomerChange('whatsapp', e.target.value)}
                placeholder="(41) 99999-9999"
                maxLength={15}
                className={`
                  w-full h-12 px-4
                  text-base text-[#2D2D2D]
                  border rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-[#6B8E7A]/40
                  ${errors.whatsapp ? 'border-[#D94F4F]' : 'border-[#E8DFD5] focus:border-[#6B8E7A]'}
                `}
                aria-invalid={!!errors.whatsapp}
              />
              {errors.whatsapp && (
                <p className="mt-1 text-sm text-[#D94F4F]">{errors.whatsapp}</p>
              )}
            </div>
          </div>
        </fieldset>
        
        {/* Endereço */}
        <fieldset className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <legend className="text-base font-semibold text-[#2D2D2D] mb-4">
            Endereço de Entrega
          </legend>
          
          <div className="space-y-4">
            {/* CEP (readonly) */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#5C4D3C] mb-1">
                  CEP
                </label>
                <input
                  type="text"
                  value={addressData.cep.replace(/(\d{5})(\d{3})/, '$1-$2')}
                  disabled
                  className="
                    w-full h-12 px-4
                    text-base text-[#8B7355]
                    bg-[#F0E8DF]
                    border border-[#E8DFD5] rounded-lg
                  "
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#5C4D3C] mb-1">
                  Cidade / Estado
                </label>
                <input
                  type="text"
                  value={`${addressData.city} - ${addressData.state}`}
                  disabled
                  className="
                    w-full h-12 px-4
                    text-base text-[#8B7355]
                    bg-[#F0E8DF]
                    border border-[#E8DFD5] rounded-lg
                  "
                />
              </div>
            </div>
            
            {/* Rua */}
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-[#5C4D3C] mb-1">
                Rua *
              </label>
              <input
                id="street"
                type="text"
                value={addressData.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                className={`
                  w-full h-12 px-4
                  text-base text-[#2D2D2D]
                  border rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-[#6B8E7A]/40
                  ${errors.street ? 'border-[#D94F4F]' : 'border-[#E8DFD5] focus:border-[#6B8E7A]'}
                `}
                aria-invalid={!!errors.street}
              />
              {errors.street && (
                <p className="mt-1 text-sm text-[#D94F4F]">{errors.street}</p>
              )}
            </div>
            
            {/* Número e Complemento */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="number" className="block text-sm font-medium text-[#5C4D3C] mb-1">
                  Número *
                </label>
                <input
                  id="number"
                  type="text"
                  value={addressData.number}
                  onChange={(e) => handleAddressChange('number', e.target.value)}
                  className={`
                    w-full h-12 px-4
                    text-base text-[#2D2D2D]
                    border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-[#6B8E7A]/40
                    ${errors.number ? 'border-[#D94F4F]' : 'border-[#E8DFD5] focus:border-[#6B8E7A]'}
                  `}
                  aria-invalid={!!errors.number}
                />
                {errors.number && (
                  <p className="mt-1 text-sm text-[#D94F4F]">{errors.number}</p>
                )}
              </div>
              
              <div className="col-span-2">
                <label htmlFor="complement" className="block text-sm font-medium text-[#5C4D3C] mb-1">
                  Complemento
                </label>
                <input
                  id="complement"
                  type="text"
                  value={addressData.complement}
                  onChange={(e) => handleAddressChange('complement', e.target.value)}
                  placeholder="Apto, bloco, etc."
                  className="
                    w-full h-12 px-4
                    text-base text-[#2D2D2D]
                    border border-[#E8DFD5] rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-[#6B8E7A]/40 focus:border-[#6B8E7A]
                  "
                />
              </div>
            </div>
            
            {/* Bairro */}
            <div>
              <label htmlFor="neighborhood" className="block text-sm font-medium text-[#5C4D3C] mb-1">
                Bairro *
              </label>
              <input
                id="neighborhood"
                type="text"
                value={addressData.neighborhood}
                onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
                className={`
                  w-full h-12 px-4
                  text-base text-[#2D2D2D]
                  border rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-[#6B8E7A]/40
                  ${errors.neighborhood ? 'border-[#D94F4F]' : 'border-[#E8DFD5] focus:border-[#6B8E7A]'}
                `}
                aria-invalid={!!errors.neighborhood}
              />
              {errors.neighborhood && (
                <p className="mt-1 text-sm text-[#D94F4F]">{errors.neighborhood}</p>
              )}
            </div>
          </div>
        </fieldset>
        
        {/* Forma de Pagamento */}
        <fieldset className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <legend className="text-base font-semibold text-[#2D2D2D] mb-4">
            Forma de Pagamento
          </legend>
          
          {/* Tabs */}
          <div className="flex gap-3 mb-6" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={paymentMethod === 'pix'}
              onClick={() => setPaymentMethod('pix')}
              className={`
                flex-1 h-12 flex items-center justify-center gap-2
                font-medium rounded-lg
                transition-colors
                ${paymentMethod === 'pix'
                  ? 'bg-[#6B8E7A] text-white'
                  : 'bg-[#F0E8DF] text-[#2D2D2D] hover:bg-[#E8DFD5]'
                }
              `}
            >
              <QrCode className="w-5 h-5" />
              Pix
            </button>
            
            <button
              type="button"
              role="tab"
              aria-selected={paymentMethod === 'card'}
              onClick={() => setPaymentMethod('card')}
              className={`
                flex-1 h-12 flex items-center justify-center gap-2
                font-medium rounded-lg
                transition-colors
                ${paymentMethod === 'card'
                  ? 'bg-[#6B8E7A] text-white'
                  : 'bg-[#F0E8DF] text-[#2D2D2D] hover:bg-[#E8DFD5]'
                }
              `}
            >
              <CreditCard className="w-5 h-5" />
              Cartão
            </button>
          </div>
          
          {/* Tab content */}
          {paymentMethod === 'pix' ? (
            <div role="tabpanel" className="text-center py-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8F5E9] rounded-lg mb-4">
                <span className="text-sm text-[#5C4D3C]">Total no Pix:</span>
                <span className="text-xl font-bold text-[#6B8E7A]">
                  {formatCurrency(totalPix)}
                </span>
              </div>
              
              <p className="text-sm text-[#8B7355] mb-2">
                Você economiza <strong className="text-[#6B8E7A]">{formatCurrency(pixDiscount)}</strong> pagando no Pix!
              </p>
              
              <p className="text-xs text-[#8B7355]">
                O código Pix será gerado após confirmar o pedido
              </p>
            </div>
          ) : (
            <div role="tabpanel" className="py-4">
              <label htmlFor="installments" className="block text-sm font-medium text-[#5C4D3C] mb-2">
                Parcelas
              </label>
              <select
                id="installments"
                value={installments}
                onChange={(e) => setInstallments(parseInt(e.target.value))}
                className="
                  w-full h-12 px-4
                  text-base text-[#2D2D2D]
                  border border-[#E8DFD5] rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-[#6B8E7A]/40 focus:border-[#6B8E7A]
                  cursor-pointer
                "
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num}x de {formatCurrency(total / num)} sem juros
                  </option>
                ))}
              </select>
              
              <p className="mt-4 text-sm text-[#8B7355] text-center">
                Você será redirecionado para o Mercado Pago
              </p>
            </div>
          )}
        </fieldset>
        
        {/* Botão Finalizar */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="
            w-full h-14
            flex items-center justify-center gap-2
            bg-[#6B8E7A] hover:bg-[#5A7A68]
            text-white font-semibold text-lg
            rounded-lg
            transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processando...
            </>
          ) : (
            paymentMethod === 'pix' ? 'Gerar Código Pix' : 'Pagar com Mercado Pago'
          )}
        </button>
        
        <p className="mt-4 text-xs text-center text-[#8B7355]">
          Ao finalizar, você concorda com nossos{' '}
          <Link href="/politica-privacidade" className="underline">
            termos de uso
          </Link>{' '}
          e{' '}
          <Link href="/politica-trocas-devolucoes" className="underline">
            política de trocas
          </Link>
        </p>
      </div>
    </div>
  )
}

// ============================================
// TELA DE PAGAMENTO PIX
// ============================================

interface PixPaymentScreenProps {
  pixCode: string
  pixQrCode: string
  total: number
  timeLeft: number
  formatTimeLeft: (seconds: number) => string
  onCopy: () => void
  copied: boolean
}

function PixPaymentScreen({
  pixCode,
  pixQrCode,
  total,
  timeLeft,
  formatTimeLeft,
  onCopy,
  copied,
}: PixPaymentScreenProps) {
  const isExpired = timeLeft === 0
  
  return (
    <div className="min-h-screen bg-[#FAF7F4] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-xl p-6 shadow-sm max-w-md w-full text-center">
        {/* QR Code */}
        <div className="mb-6">
          {!isExpired ? (
            <img
              src={pixQrCode}
              alt="QR Code Pix"
              className="w-48 h-48 mx-auto"
            />
          ) : (
            <div className="w-48 h-48 mx-auto bg-[#F0E8DF] rounded-lg flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-[#B85C38]" />
            </div>
          )}
        </div>
        
        {/* Valor */}
        <div className="mb-4">
          <span className="text-sm text-[#8B7355]">Valor a pagar:</span>
          <p className="text-2xl font-bold text-[#6B8E7A]">
            {formatCurrency(total)}
          </p>
        </div>
        
        {/* Timer */}
        {!isExpired ? (
          <div className="flex items-center justify-center gap-2 mb-6 text-sm text-[#8B7355]">
            <Clock className="w-4 h-4" />
            Código expira em {formatTimeLeft(timeLeft)}
          </div>
        ) : (
          <div className="mb-6 text-sm text-[#B85C38]">
            Código expirado
          </div>
        )}
        
        {/* Código Pix */}
        {!isExpired && (
          <>
            <div className="mb-4">
              <p className="text-sm text-[#5C4D3C] mb-2">Código Pix copia e cola:</p>
              <div className="relative">
                <input
                  type="text"
                  value={pixCode}
                  readOnly
                  className="
                    w-full h-12 px-4 pr-12
                    text-sm text-[#2D2D2D]
                    bg-[#F0E8DF]
                    border border-[#E8DFD5] rounded-lg
                    font-mono
                  "
                />
                <button
                  type="button"
                  onClick={onCopy}
                  className="
                    absolute right-2 top-1/2 -translate-y-1/2
                    p-2 rounded
                    text-[#8B7355] hover:text-[#6B8E7A] hover:bg-white
                    transition-colors
                  "
                  aria-label="Copiar código"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-[#6B8E7A]" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            
            <button
              type="button"
              onClick={onCopy}
              className="
                w-full h-12
                flex items-center justify-center gap-2
                bg-[#6B8E7A] hover:bg-[#5A7A68]
                text-white font-semibold
                rounded-lg
                transition-colors
              "
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Código copiado!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copiar código Pix
                </>
              )}
            </button>
          </>
        )}
        
        {/* Expirado */}
        {isExpired && (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="
              w-full h-12
              flex items-center justify-center gap-2
              bg-[#B85C38] hover:bg-[#8B4528]
              text-white font-semibold
              rounded-lg
              transition-colors
            "
          >
            Gerar novo código
          </button>
        )}
        
        {/* Info */}
        <div className="mt-6 pt-6 border-t border-[#E8DFD5]">
          <p className="text-xs text-[#8B7355]">
            Aguardando confirmação do pagamento...
          </p>
          <p className="text-xs text-[#8B7355] mt-1">
            Assim que identificarmos, você será redirecionado automaticamente.
          </p>
        </div>
      </div>
    </div>
  )
}
