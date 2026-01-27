/**
 * Moveirama Cart System - TypeScript Types
 * Versão: 1.0
 * Data: Janeiro 2026
 */

// ============================================
// TIPOS DO PRODUTO NO CARRINHO
// ============================================

export interface CartProduct {
  id: string                      // UUID do produto
  slug: string                    // Para construir URL
  name: string                    // Nome do produto
  price: number                   // Preço regular (sem desconto Pix)
  pricePix: number                // Preço com desconto Pix (5%)
  imageUrl: string                // cloudinary_path da primeira imagem
  width: number                   // Largura em cm
  height: number                  // Altura em cm
  depth: number                   // Profundidade em cm
  subcategorySlug: string         // Para construir URL completa
  variant?: CartVariant           // Variante selecionada (cor)
  tvMaxSize?: number              // Para racks/painéis
  material?: string               // MDP/MDF
  materialThickness?: number      // Espessura em mm
}

export interface CartVariant {
  id: string
  name: string                    // Ex: "Cinamomo C / Off White"
  sku: string
}

// ============================================
// TIPOS DO ITEM NO CARRINHO
// ============================================

export interface CartItemData {
  product: CartProduct
  quantity: number                // 1-5
  addedAt: number                 // Timestamp
}

// ============================================
// TIPOS DE FRETE
// ============================================

export interface ShippingInfo {
  cep: string
  address: string                 // Rua/Logradouro
  neighborhood: string            // Bairro
  city: string                    // Cidade
  state: string                   // UF
  fee: number                     // Valor do frete
  deliveryDaysMin: number         // Prazo mínimo
  deliveryDaysMax: number         // Prazo máximo
  isLocalDelivery: boolean        // Frota própria?
  calculatedAt: number            // Timestamp do cálculo
}

// ============================================
// TIPOS DO ESTADO DO CARRINHO
// ============================================

export interface CartState {
  items: CartItemData[]
  shipping: ShippingInfo | null
  isOpen: boolean                 // Drawer aberto?
  lastUpdated: number             // Timestamp última atualização
}

// ============================================
// TIPOS DAS AÇÕES DO CARRINHO
// ============================================

export type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: CartProduct; quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'SET_SHIPPING'; payload: ShippingInfo }
  | { type: 'CLEAR_SHIPPING' }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'LOAD_FROM_STORAGE'; payload: CartState }

// ============================================
// TIPOS DO CONTEXTO
// ============================================

export interface CartContextValue {
  // Estado
  state: CartState
  
  // Ações
  addItem: (product: CartProduct, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  setShipping: (shipping: ShippingInfo) => void
  clearShipping: () => void
  clearCart: () => void
  openDrawer: () => void
  closeDrawer: () => void
  
  // Computed
  itemCount: number
  subtotal: number
  subtotalPix: number
  pixDiscount: number
  total: number
  totalPix: number
  isEmpty: boolean
  canCheckout: boolean
}

// ============================================
// TIPOS DO TOAST
// ============================================

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastData {
  id: string
  type: ToastType
  message: string
  duration?: number               // ms, default 3000
}

// ============================================
// TIPOS DO CHECKOUT
// ============================================

export interface CustomerData {
  fullName: string
  cpf: string
  email: string
  whatsapp: string
}

export interface DeliveryAddress {
  cep: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}

export interface CheckoutData {
  customer: CustomerData
  address: DeliveryAddress
  paymentMethod: 'pix' | 'card'
  installments?: number           // Para cartão: 1-12
}

// ============================================
// TIPOS DO PEDIDO
// ============================================

export interface OrderItem {
  productId: string
  productName: string
  variantName?: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Order {
  id: string
  orderNumber: string             // Ex: "MVR-2026-00001"
  status: OrderStatus
  items: OrderItem[]
  customer: CustomerData
  address: DeliveryAddress
  shipping: {
    fee: number
    deliveryDaysMin: number
    deliveryDaysMax: number
  }
  payment: {
    method: 'pix' | 'card'
    status: PaymentStatus
    paidAt?: string
    pixCode?: string
    pixQrCode?: string
    installments?: number
  }
  subtotal: number
  shippingFee: number
  discount: number
  total: number
  createdAt: string
  updatedAt: string
}

export type OrderStatus = 
  | 'pending'           // Aguardando pagamento
  | 'confirmed'         // Pagamento confirmado
  | 'processing'        // Preparando
  | 'shipped'           // Em transporte
  | 'delivered'         // Entregue
  | 'cancelled'         // Cancelado

export type PaymentStatus =
  | 'pending'           // Aguardando
  | 'approved'          // Aprovado
  | 'rejected'          // Rejeitado
  | 'expired'           // Expirado
  | 'refunded'          // Estornado

// ============================================
// CONSTANTES
// ============================================

export const CART_CONSTANTS = {
  MAX_ITEMS: 5,                   // Máximo de produtos diferentes
  MAX_QUANTITY: 5,                // Máximo por produto
  MIN_QUANTITY: 1,                // Mínimo por produto
  PIX_DISCOUNT: 0.05,             // 5% de desconto
  STORAGE_KEY: 'moveirama_cart',
  STORAGE_EXPIRY_DAYS: 30,
  PIX_EXPIRY_MINUTES: 30,
  MAX_INSTALLMENTS: 12,
} as const
