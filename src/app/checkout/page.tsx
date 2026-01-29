'use client'

/**
 * Moveirama Checkout Page - REFATORADO
 * Spec: SPEC_Checkout_Trust_Elements_v1.1.md
 * Versão: 2.0 (com elementos de confiança)
 * Data: Janeiro 2026
 * 
 * NOVIDADES:
 * - Layout 2 colunas desktop (form + sidebar sticky)
 * - Trust Bar (Site Seguro, NF, Entrega)
 * - Steps de progresso (①Dados → ②Endereço → ③Pagamento)
 * - Sidebar com foto grande, benefícios, WhatsApp
 * - Microcopy emocional ("Pode ficar tranquilo", "Usamos só pra NF")
 * - CNPJ visível + selos de segurança
 * - Mini-resumo sticky mobile
 */

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Copy,
  Check,
  Loader2,
  CreditCard,
  QrCode,
  AlertCircle,
  Clock,
  Lock,
  MapPin,
  PartyPopper,
} from 'lucide-react'

import { useCart } from '@/components/cart/CartProvider'
import { useToast } from '@/components/cart/Toast'
import { CheckoutPageSkeleton } from '@/components/cart/CartLoading'
import { CustomerData, DeliveryAddress } from '@/components/cart/cart-types'
import {
  formatCurrency,
  maskCPF,
  maskPhone,
  unmaskCPF,
  unmaskPhone,
  isValidCPF,
  isValidEmail,
  isValidPhone,
} from '@/components/cart/cart-utils'

// Componentes de confiança
import { CheckoutLayout } from '@/components/checkout/CheckoutLayout'
import { CheckoutTrustBar } from '@/components/checkout/CheckoutTrustBar'
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps'
import { CheckoutSummaryCard } from '@/components/checkout/CheckoutSummaryCard'
import { CheckoutMiniSummary } from '@/components/checkout/CheckoutMiniSummary'
import { CheckoutSeals } from '@/components/checkout/CheckoutSeals'
import { CheckoutIdentity } from '@/components/checkout/CheckoutIdentity'

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
type CheckoutStep = 1 | 2 | 3

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
    clearCart,
  } = useCart()
  const { showToast } = useToast()
  
  const { items, shipping } = state
  
  // Ref para o summary card (usado pelo mini-summary)
  const summaryCardRef = useRef<HTMLDivElement>(null)
  
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
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1)
  
  // Pix state
  const [pixCode, setPixCode] = useState<string | null>(null)
  const [pixQrCode, setPixQrCode] = useState<string | null>(null)
  const [pixCopied, setPixCopied] = useState(false)
  const [pixExpiry, setPixExpiry] = useState<Date | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(30 * 60)
  
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
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])
  
  const handleAddressChange = useCallback((field: keyof DeliveryAddress, value: string) => {
    setAddressData(prev => ({ ...prev, [field]: value }))
    
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])
  
  // Atualiza step baseado no preenchimento
  useEffect(() => {
    const hasCustomerData = customerData.fullName && customerData.cpf && customerData.email && customerData.whatsapp
    const hasAddressData = addressData.street && addressData.number && addressData.neighborhood
    
    if (hasCustomerData && hasAddressData) {
      setCurrentStep(3)
    } else if (hasCustomerData) {
      setCurrentStep(2)
    } else {
      setCurrentStep(1)
    }
  }, [customerData, addressData])
  
  // Validação do formulário
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    
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
    } catch {
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
        setPixCode(data.pixCode)
        setPixQrCode(data.pixQrCode)
        setPixExpiry(new Date(Date.now() + 30 * 60 * 1000))
        startPaymentPolling(data.orderId)
      } else {
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl
        }
      }
      
    } catch {
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
    
    const interval = setInterval(checkPayment, 5000)
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
  
  // Prepara dados para o sidebar (type assertion para compatibilidade com CartVariant)
  const sidebarData = {
    items: items.map(item => ({
      product: {
        id: item.product.id,
        name: item.product.name,
        imageUrl: item.product.imageUrl,
        price: item.product.price,
        pricePix: item.product.pricePix,
        variant: item.product.variant as { name?: string; color?: string } | undefined,
      },
      quantity: item.quantity,
    })),
    subtotal,
    subtotalPix,
    shipping: {
      cep: shipping.cep,
      city: shipping.city,
      state: shipping.state,
      neighborhood: shipping.neighborhood,
      address: shipping.address,
      fee: shipping.fee,
      deliveryDaysMin: shipping.deliveryDaysMin,
      deliveryDaysMax: shipping.deliveryDaysMax,
    },
    total,
    totalPix,
    pixDiscount,
  }
  
  return (
    <>
      {/* Mini-summary mobile sticky */}
      <CheckoutMiniSummary
        items={sidebarData.items}
        totalPix={totalPix}
        summaryCardRef={summaryCardRef}
      />
      
      <CheckoutLayout
        trustBar={<CheckoutTrustBar />}
        steps={<CheckoutSteps currentStep={currentStep} />}
        sidebar={
          <CheckoutSummaryCard
            ref={summaryCardRef}
            {...sidebarData}
          />
        }
      >
        {/* Voltar */}
        <Link 
          href="/carrinho"
          className="inline-flex items-center gap-2 text-[#8B7355] hover:text-[#2D2D2D] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao carrinho
        </Link>
        
        {/* Título */}
        <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-6">
          Finalizar Compra
        </h1>
        
        {/* ===== SEÇÃO: DADOS PESSOAIS ===== */}
        <fieldset className="checkout-section">
          <legend className="checkout-section__title">
            Dados Pessoais
          </legend>
          
          {/* Microcopy de confiança */}
          <div className="checkout-section__helper checkout-section__helper--trust">
            <Lock className="checkout-helper-icon" />
            <span>Pode ficar tranquilo: seus dados estão protegidos</span>
          </div>
          
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
                {/* Helper CPF */}
                <span className="form-field__helper">Usamos só pra nota fiscal</span>
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
        
        {/* ===== SEÇÃO: ENDEREÇO ===== */}
        <fieldset className="checkout-section">
          <legend className="checkout-section__title">
            Endereço de Entrega
          </legend>
          
          {/* Microcopy local */}
          <div className="checkout-section__helper checkout-section__helper--local">
            <MapPin className="checkout-helper-icon" />
            <span>Entregamos em Curitiba e região com frota própria</span>
          </div>
          
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
                {/* Helper CEP */}
                <span className="form-field__helper">Digite e preenchemos o resto</span>
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
        
        {/* ===== SEÇÃO: PAGAMENTO ===== */}
        <fieldset className="checkout-section">
          <legend className="checkout-section__title">
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
              
              {/* Mensagem friendly */}
              <div className="checkout-payment-message">
                <PartyPopper className="w-6 h-6 mx-auto text-[#6B8E7A]" />
                <p className="checkout-payment-message__friendly">
                  A equipe Moveirama já vai preparar seu pedido! 🎉
                </p>
              </div>
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
        
        {/* CNPJ da loja */}
        <CheckoutIdentity />
        
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
            min-h-[48px]
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
        
        {/* Selos de segurança */}
        <CheckoutSeals />
        
        {/* Footer */}
        <div className="checkout-footer">
          <p className="checkout-footer__terms">
            Ao finalizar, você concorda com nossos{' '}
            <Link href="/politica-privacidade">termos de uso</Link>{' '}
            e{' '}
            <Link href="/politica-trocas-devolucoes">política de trocas</Link>
          </p>
          <p className="checkout-footer__friendly">
            Qualquer dúvida é só chamar no WhatsApp!
          </p>
        </div>
      </CheckoutLayout>
    </>
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
            <Image
              src={pixQrCode}
              alt="QR Code Pix"
              width={192}
              height={192}
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
