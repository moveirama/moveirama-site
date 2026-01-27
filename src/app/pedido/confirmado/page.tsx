'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Clock, 
  FileText,
  MessageCircle,
  Copy,
  Check,
  Home,
  ChevronDown,
  ChevronUp,
  MapPin,
  CreditCard,
  QrCode
} from 'lucide-react'

// =============================================================================
// TIPOS
// =============================================================================

interface OrderItem {
  id: string
  name: string
  variant?: string
  quantity: number
  price: number
  image?: string
}

interface OrderData {
  orderId: string
  orderNumber: string
  status: 'confirmed' | 'processing' | 'paid'
  paymentMethod: 'pix' | 'card'
  paymentStatus: 'pending' | 'approved' | 'in_process'
  customer: {
    name: string
    email: string
    phone: string
  }
  shipping: {
    address: string
    neighborhood: string
    city: string
    state: string
    cep: string
    fee: number
    estimatedDays: { min: number; max: number }
  }
  items: OrderItem[]
  subtotal: number
  pixDiscount: number
  total: number
  createdAt: string
}

// =============================================================================
// MOCK DATA (será substituído por API real)
// =============================================================================

const mockOrderData: OrderData = {
  orderId: 'ord_abc123xyz',
  orderNumber: 'MOV-2026-00142',
  status: 'confirmed',
  paymentMethod: 'pix',
  paymentStatus: 'approved',
  customer: {
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(41) 98765-4321'
  },
  shipping: {
    address: 'Rua das Flores, 123',
    neighborhood: 'Centro',
    city: 'Curitiba',
    state: 'PR',
    cep: '80010-000',
    fee: 29.90,
    estimatedDays: { min: 1, max: 3 }
  },
  items: [
    {
      id: '1',
      name: 'Rack Dallas para TV até 55"',
      variant: 'Cinamomo/Off White',
      quantity: 1,
      price: 349.90,
      image: '/images/products/rack-dallas.webp'
    },
    {
      id: '2',
      name: 'Painel Fenix para TV até 50"',
      variant: 'Preto',
      quantity: 1,
      price: 279.90,
      image: '/images/products/painel-fenix.webp'
    }
  ],
  subtotal: 629.80,
  pixDiscount: 31.49,
  total: 628.21,
  createdAt: new Date().toISOString()
}

// =============================================================================
// FORMATADORES
// =============================================================================

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

function getDeliveryDateRange(estimatedDays: { min: number; max: number }): string {
  const today = new Date()
  const minDate = new Date(today)
  const maxDate = new Date(today)
  
  minDate.setDate(today.getDate() + estimatedDays.min)
  maxDate.setDate(today.getDate() + estimatedDays.max)
  
  const formatOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    day: '2-digit', 
    month: '2-digit' 
  }
  
  const minStr = minDate.toLocaleDateString('pt-BR', formatOptions)
  const maxStr = maxDate.toLocaleDateString('pt-BR', formatOptions)
  
  return `${minStr} até ${maxStr}`
}

// =============================================================================
// COMPONENTES INTERNOS
// =============================================================================

function SuccessHeader({ orderNumber }: { orderNumber: string }) {
  return (
    <div className="text-center mb-8">
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="absolute inset-0 bg-[#6B8E7A]/20 rounded-full animate-ping" />
        <div className="relative flex items-center justify-center w-24 h-24 bg-[#6B8E7A] rounded-full">
          <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
        </div>
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-2">
        Pedido Confirmado!
      </h1>
      <p className="text-[#8B7355] text-lg">
        Obrigado pela sua compra na Moveirama
      </p>
      
      <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#F0E8DF] rounded-lg">
        <span className="text-[#8B7355] text-sm">Pedido:</span>
        <span className="font-mono font-bold text-[#2D2D2D]">{orderNumber}</span>
        <CopyButton text={orderNumber} />
      </div>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
  
  return (
    <button
      onClick={handleCopy}
      className="p-1 hover:bg-[#E8DFD5] rounded transition-colors"
      aria-label="Copiar número do pedido"
    >
      {copied ? (
        <Check className="w-4 h-4 text-[#6B8E7A]" />
      ) : (
        <Copy className="w-4 h-4 text-[#8B7355]" />
      )}
    </button>
  )
}

function StatusTimeline({ status, paymentStatus }: { status: string; paymentStatus: string }) {
  const steps = [
    { id: 'confirmed', label: 'Pedido Recebido', icon: FileText, completed: true },
    { id: 'paid', label: 'Pagamento Aprovado', icon: CreditCard, completed: paymentStatus === 'approved' },
    { id: 'preparing', label: 'Preparando Envio', icon: Package, completed: false },
    { id: 'shipping', label: 'Em Transporte', icon: Truck, completed: false }
  ]
  
  const completedCount = steps.filter(s => s.completed).length
  const progressWidth = completedCount > 1 ? ((completedCount - 1) / (steps.length - 1)) * 100 : 0
  
  return (
    <div className="bg-white rounded-xl border border-[#E8DFD5] p-6 mb-6">
      <h2 className="font-semibold text-[#2D2D2D] mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-[#6B8E7A]" />
        Status do Pedido
      </h2>
      
      <div className="flex items-center justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#E8DFD5]" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-[#6B8E7A] transition-all duration-500"
          style={{ width: `${progressWidth}%` }}
        />
        
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <div key={step.id} className="relative flex flex-col items-center z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${step.completed ? 'bg-[#6B8E7A] text-white' : 'bg-white border-2 border-[#E8DFD5] text-[#8B7355]'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`mt-2 text-xs text-center max-w-[80px] ${step.completed ? 'text-[#2D2D2D] font-medium' : 'text-[#8B7355]'}`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DeliveryInfo({ shipping }: { shipping: OrderData['shipping'] }) {
  const deliveryRange = getDeliveryDateRange(shipping.estimatedDays)
  
  return (
    <div className="bg-white rounded-xl border border-[#E8DFD5] p-6 mb-6">
      <h2 className="font-semibold text-[#2D2D2D] mb-4 flex items-center gap-2">
        <Truck className="w-5 h-5 text-[#6B8E7A]" />
        Entrega
      </h2>
      
      <div className="flex items-start gap-3 mb-4">
        <MapPin className="w-5 h-5 text-[#8B7355] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[#2D2D2D]">{shipping.address}</p>
          <p className="text-[#8B7355] text-sm">{shipping.neighborhood} - {shipping.city}/{shipping.state}</p>
          <p className="text-[#8B7355] text-sm">CEP: {shipping.cep}</p>
        </div>
      </div>
      
      <div className="bg-[#E8F0EB] rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#8B7355]">Previsão de entrega</p>
            <p className="font-semibold text-[#2D2D2D]">{deliveryRange}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#8B7355]">Frete</p>
            <p className="font-semibold text-[#2D2D2D]">{formatCurrency(shipping.fee)}</p>
          </div>
        </div>
        
        <div className="mt-3 flex items-center gap-2 text-sm text-[#6B8E7A]">
          <Truck className="w-4 h-4" />
          <span>Entrega pela frota própria Moveirama</span>
        </div>
      </div>
    </div>
  )
}

function OrderSummary({ order }: { order: OrderData }) {
  const [expanded, setExpanded] = useState(false)
  
  return (
    <div className="bg-white rounded-xl border border-[#E8DFD5] p-6 mb-6">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between">
        <h2 className="font-semibold text-[#2D2D2D] flex items-center gap-2">
          <Package className="w-5 h-5 text-[#6B8E7A]" />
          Resumo do Pedido
          <span className="text-sm font-normal text-[#8B7355]">
            ({order.items.length} {order.items.length === 1 ? 'item' : 'itens'})
          </span>
        </h2>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-[#8B7355]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#8B7355]" />
        )}
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[500px] mt-4' : 'max-h-0'}`}>
        <div className="space-y-3 border-b border-[#E8DFD5] pb-4 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-16 h-16 bg-[#F0E8DF] rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-[#8B7355]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#2D2D2D] line-clamp-1">{item.name}</p>
                {item.variant && <p className="text-xs text-[#8B7355]">{item.variant}</p>}
                <p className="text-xs text-[#8B7355]">Qtd: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-[#2D2D2D]">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-[#8B7355]">
          <span>Subtotal</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        
        {order.pixDiscount > 0 && (
          <div className="flex justify-between text-[#6B8E7A]">
            <span>Desconto Pix (5%)</span>
            <span>-{formatCurrency(order.pixDiscount)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-[#8B7355]">
          <span>Frete</span>
          <span>{formatCurrency(order.shipping.fee)}</span>
        </div>
        
        <div className="flex justify-between font-bold text-lg text-[#2D2D2D] pt-2 border-t border-[#E8DFD5]">
          <span>Total</span>
          <span>{formatCurrency(order.total + order.shipping.fee)}</span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-sm text-[#8B7355]">
        {order.paymentMethod === 'pix' ? (
          <>
            <QrCode className="w-4 h-4" />
            <span>Pago via Pix</span>
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            <span>Pago via Cartão de Crédito</span>
          </>
        )}
      </div>
    </div>
  )
}

function NextStepsCard() {
  return (
    <div className="bg-[#F0E8DF] rounded-xl p-6 mb-6">
      <h2 className="font-semibold text-[#2D2D2D] mb-4">📦 Próximos Passos</h2>
      
      <ol className="space-y-3 text-sm">
        <li className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 bg-[#6B8E7A] text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
          <p className="text-[#2D2D2D]"><strong>Confirmação por e-mail:</strong> Você receberá os detalhes do pedido no seu e-mail.</p>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 bg-[#6B8E7A] text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
          <p className="text-[#2D2D2D]"><strong>Preparação:</strong> Nossa equipe vai separar e embalar seus móveis com cuidado.</p>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 bg-[#6B8E7A] text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
          <p className="text-[#2D2D2D]"><strong>Entrega:</strong> Entraremos em contato para agendar a entrega no melhor horário pra você.</p>
        </li>
      </ol>
      
      <p className="mt-4 text-xs text-[#8B7355]">💡 Dica: Confira as medidas do ambiente antes da chegada dos móveis!</p>
    </div>
  )
}

function SupportCard() {
  const whatsappNumber = '5541984209323'
  const whatsappMessage = encodeURIComponent('Olá! Acabei de fazer um pedido e gostaria de tirar uma dúvida.')
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
  
  return (
    <div className="bg-white rounded-xl border border-[#E8DFD5] p-6">
      <h2 className="font-semibold text-[#2D2D2D] mb-2">Precisa de ajuda?</h2>
      <p className="text-sm text-[#8B7355] mb-4">Nossa equipe está pronta para tirar suas dúvidas sobre entrega, montagem ou qualquer outra coisa.</p>
      
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full h-12 px-6 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold rounded-lg transition-colors duration-200"
      >
        <MessageCircle className="w-5 h-5" />
        Chamar no WhatsApp
      </a>
    </div>
  )
}

function ActionButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-8">
      <Link
        href="/"
        className="flex-1 flex items-center justify-center gap-2 h-12 px-6 bg-[#6B8E7A] hover:bg-[#5A7A68] text-white font-semibold rounded-lg transition-colors duration-200"
      >
        <Home className="w-5 h-5" />
        Voltar para a Loja
      </Link>
      
      <Link
        href="/meus-pedidos"
        className="flex-1 flex items-center justify-center gap-2 h-12 px-6 border-2 border-[#2D2D2D] text-[#2D2D2D] font-semibold rounded-lg hover:bg-[#F0E8DF] transition-colors duration-200"
      >
        <Package className="w-5 h-5" />
        Meus Pedidos
      </Link>
    </div>
  )
}

// =============================================================================
// LOADING FALLBACK
// =============================================================================

function LoadingFallback() {
  return (
    <main className="min-h-screen bg-[#FAF7F4] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#6B8E7A] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#8B7355]">Carregando seu pedido...</p>
        </div>
      </div>
    </main>
  )
}

// =============================================================================
// CONTEÚDO DA PÁGINA (usa useSearchParams)
// =============================================================================

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function loadOrder() {
      const orderId = searchParams.get('id')
      
      if (!orderId) {
        setOrder(mockOrderData)
        setLoading(false)
        return
      }
      
      try {
        setOrder({ ...mockOrderData, orderId, orderNumber: `MOV-${orderId.slice(-6).toUpperCase()}` })
      } catch (err) {
        setError('Erro ao carregar dados do pedido')
      } finally {
        setLoading(false)
      }
    }
    
    loadOrder()
  }, [searchParams])
  
  if (loading) {
    return <LoadingFallback />
  }
  
  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#FAF7F4] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-[#2D2D2D] mb-2">{error || 'Pedido não encontrado'}</h1>
            <p className="text-[#8B7355] mb-6">Não foi possível carregar os dados do pedido.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#6B8E7A] text-white rounded-lg hover:bg-[#5A7A68] transition-colors"
            >
              <Home className="w-5 h-5" />
              Voltar para a Loja
            </Link>
          </div>
        </div>
      </main>
    )
  }
  
  return (
    <main className="min-h-screen bg-[#FAF7F4] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <SuccessHeader orderNumber={order.orderNumber} />
        <StatusTimeline status={order.status} paymentStatus={order.paymentStatus} />
        <DeliveryInfo shipping={order.shipping} />
        <OrderSummary order={order} />
        <NextStepsCard />
        <SupportCard />
        <ActionButtons />
        
        <div className="mt-8 text-center text-xs text-[#8B7355]">
          <p>Pedido realizado em {formatDate(order.createdAt)}</p>
          <p className="mt-1">Moveirama • CNPJ: XX.XXX.XXX/0001-XX</p>
        </div>
      </div>
    </main>
  )
}

// =============================================================================
// PÁGINA PRINCIPAL (com Suspense boundary)
// =============================================================================

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderConfirmationContent />
    </Suspense>
  )
}
