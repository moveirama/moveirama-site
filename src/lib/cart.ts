/**
 * Moveirama - Cart Library
 * Types, interfaces e funções utilitárias do carrinho
 * Versão: 1.0
 */

// ==========================================
// TYPES E INTERFACES
// ==========================================

export interface CartProduct {
  id: string
  slug: string
  name: string
  price: number // Preço regular
  priceCompare?: number // Preço "de" (riscado)
  imageUrl: string
  variant?: {
    id: string
    name: string // Ex: "Cinamomo C / Off White"
    color?: string
  }
  // Informações adicionais para exibição
  dimensions?: {
    width: number // cm
    height: number // cm
    depth: number // cm
  }
  tvMaxSize?: number // Polegadas (para racks/painéis)
  material?: string // Ex: "MDP 18mm"
  subcategorySlug: string // Para construir URL
}

export interface CartItem {
  product: CartProduct
  quantity: number
  addedAt: number // Timestamp
}

export interface ShippingInfo {
  cep: string
  city: string
  neighborhood: string
  state: string
  street?: string
  fee: number
  deliveryDays: {
    min: number
    max: number
  }
  isLocalDelivery: boolean
  calculatedAt: number // Timestamp
}

export interface CartState {
  items: CartItem[]
  shipping: ShippingInfo | null
  updatedAt: number
}

// ==========================================
// CONSTANTES
// ==========================================

export const CART_STORAGE_KEY = 'moveirama_cart'
export const CART_EXPIRATION_DAYS = 30

export const CART_LIMITS = {
  MAX_DIFFERENT_PRODUCTS: 5,
  MAX_QUANTITY_PER_PRODUCT: 5,
  MIN_QUANTITY: 1,
} as const

export const PIX_DISCOUNT_PERCENT = 5

export const INSTALLMENT_OPTIONS = {
  maxInstallments: 12,
  minInstallmentValue: 10, // R$ 10,00 mínimo por parcela
} as const

// ==========================================
// FUNÇÕES DE FORMATAÇÃO
// ==========================================

/**
 * Formata valor em Reais
 */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formata valor sem símbolo (só número)
 */
export function formatPriceNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Calcula preço com desconto Pix (5%)
 */
export function calculatePixPrice(price: number): number {
  return price * (1 - PIX_DISCOUNT_PERCENT / 100)
}

/**
 * Calcula economia no Pix
 */
export function calculatePixSavings(price: number): number {
  return price * (PIX_DISCOUNT_PERCENT / 100)
}

/**
 * Calcula parcelas disponíveis
 */
export function calculateInstallments(totalPrice: number): Array<{
  installments: number
  value: number
  total: number
}> {
  const result = []
  
  for (let i = 1; i <= INSTALLMENT_OPTIONS.maxInstallments; i++) {
    const installmentValue = totalPrice / i
    
    // Só adiciona se valor da parcela for >= mínimo
    if (installmentValue >= INSTALLMENT_OPTIONS.minInstallmentValue) {
      result.push({
        installments: i,
        value: installmentValue,
        total: totalPrice,
      })
    }
  }
  
  return result
}

/**
 * Retorna a melhor opção de parcelamento (máx parcelas possíveis)
 */
export function getBestInstallmentOption(totalPrice: number): {
  installments: number
  value: number
} | null {
  const options = calculateInstallments(totalPrice)
  
  if (options.length === 0) return null
  
  // Retorna a opção com mais parcelas
  return options[options.length - 1]
}

// ==========================================
// FUNÇÕES DE CÁLCULO DO CARRINHO
// ==========================================

/**
 * Calcula subtotal (soma dos itens sem frete)
 */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity
  }, 0)
}

/**
 * Calcula subtotal com desconto Pix
 */
export function calculateSubtotalPix(items: CartItem[]): number {
  const subtotal = calculateSubtotal(items)
  return calculatePixPrice(subtotal)
}

/**
 * Calcula total com frete
 */
export function calculateTotal(items: CartItem[], shippingFee: number = 0): number {
  return calculateSubtotal(items) + shippingFee
}

/**
 * Calcula total com Pix e frete
 */
export function calculateTotalPix(items: CartItem[], shippingFee: number = 0): number {
  return calculateSubtotalPix(items) + shippingFee
}

/**
 * Conta quantidade total de itens no carrinho
 */
export function countTotalItems(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

/**
 * Conta número de produtos diferentes
 */
export function countDifferentProducts(items: CartItem[]): number {
  return items.length
}

// ==========================================
// FUNÇÕES DE VALIDAÇÃO
// ==========================================

/**
 * Verifica se pode adicionar mais um produto diferente
 */
export function canAddNewProduct(items: CartItem[]): boolean {
  return items.length < CART_LIMITS.MAX_DIFFERENT_PRODUCTS
}

/**
 * Verifica se pode aumentar quantidade de um item
 */
export function canIncreaseQuantity(currentQuantity: number): boolean {
  return currentQuantity < CART_LIMITS.MAX_QUANTITY_PER_PRODUCT
}

/**
 * Verifica se o carrinho está vazio
 */
export function isCartEmpty(items: CartItem[]): boolean {
  return items.length === 0
}

/**
 * Verifica se o frete foi calculado
 */
export function hasCalculatedShipping(shipping: ShippingInfo | null): boolean {
  return shipping !== null
}

/**
 * Verifica se pode prosseguir para checkout
 */
export function canProceedToCheckout(
  items: CartItem[],
  shipping: ShippingInfo | null
): { canProceed: boolean; reason?: string } {
  if (isCartEmpty(items)) {
    return { canProceed: false, reason: 'Carrinho vazio' }
  }
  
  if (!hasCalculatedShipping(shipping)) {
    return { canProceed: false, reason: 'Calcule o frete primeiro' }
  }
  
  return { canProceed: true }
}

// ==========================================
// FUNÇÕES DE PERSISTÊNCIA (localStorage)
// ==========================================

/**
 * Carrega carrinho do localStorage
 */
export function loadCartFromStorage(): CartState | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (!stored) return null
    
    const cart: CartState = JSON.parse(stored)
    
    // Verifica expiração (30 dias)
    const expirationMs = CART_EXPIRATION_DAYS * 24 * 60 * 60 * 1000
    if (Date.now() - cart.updatedAt > expirationMs) {
      localStorage.removeItem(CART_STORAGE_KEY)
      return null
    }
    
    return cart
  } catch {
    // Se houver erro, limpa o storage corrompido
    localStorage.removeItem(CART_STORAGE_KEY)
    return null
  }
}

/**
 * Salva carrinho no localStorage
 */
export function saveCartToStorage(state: CartState): void {
  if (typeof window === 'undefined') return
  
  try {
    const dataToStore: CartState = {
      ...state,
      updatedAt: Date.now(),
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(dataToStore))
  } catch (error) {
    console.error('Erro ao salvar carrinho:', error)
  }
}

/**
 * Limpa carrinho do localStorage
 */
export function clearCartStorage(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CART_STORAGE_KEY)
}

// ==========================================
// FUNÇÕES DE MANIPULAÇÃO DE ITENS
// ==========================================

/**
 * Encontra item no carrinho pelo ID do produto
 */
export function findItemByProductId(
  items: CartItem[],
  productId: string
): CartItem | undefined {
  return items.find((item) => item.product.id === productId)
}

/**
 * Encontra índice do item no carrinho
 */
export function findItemIndex(items: CartItem[], productId: string): number {
  return items.findIndex((item) => item.product.id === productId)
}

/**
 * Adiciona produto ao carrinho (ou incrementa se já existe)
 */
export function addItemToCart(
  items: CartItem[],
  product: CartProduct,
  quantity: number = 1
): { items: CartItem[]; added: boolean; reason?: string } {
  const existingIndex = findItemIndex(items, product.id)
  
  // Produto já existe no carrinho
  if (existingIndex !== -1) {
    const existingItem = items[existingIndex]
    const newQuantity = existingItem.quantity + quantity
    
    // Verifica limite de quantidade
    if (newQuantity > CART_LIMITS.MAX_QUANTITY_PER_PRODUCT) {
      return {
        items,
        added: false,
        reason: `Máximo de ${CART_LIMITS.MAX_QUANTITY_PER_PRODUCT} unidades por produto`,
      }
    }
    
    // Atualiza quantidade
    const newItems = [...items]
    newItems[existingIndex] = {
      ...existingItem,
      quantity: newQuantity,
    }
    
    return { items: newItems, added: true }
  }
  
  // Produto novo - verifica limite de produtos diferentes
  if (!canAddNewProduct(items)) {
    return {
      items,
      added: false,
      reason: `Máximo de ${CART_LIMITS.MAX_DIFFERENT_PRODUCTS} produtos diferentes`,
    }
  }
  
  // Adiciona novo item
  const newItem: CartItem = {
    product,
    quantity: Math.min(quantity, CART_LIMITS.MAX_QUANTITY_PER_PRODUCT),
    addedAt: Date.now(),
  }
  
  return { items: [...items, newItem], added: true }
}

/**
 * Remove item do carrinho
 */
export function removeItemFromCart(
  items: CartItem[],
  productId: string
): CartItem[] {
  return items.filter((item) => item.product.id !== productId)
}

/**
 * Atualiza quantidade de um item
 */
export function updateItemQuantity(
  items: CartItem[],
  productId: string,
  newQuantity: number
): { items: CartItem[]; updated: boolean; reason?: string } {
  // Validação de quantidade
  if (newQuantity < CART_LIMITS.MIN_QUANTITY) {
    return { items, updated: false, reason: 'Quantidade mínima é 1' }
  }
  
  if (newQuantity > CART_LIMITS.MAX_QUANTITY_PER_PRODUCT) {
    return {
      items,
      updated: false,
      reason: `Máximo de ${CART_LIMITS.MAX_QUANTITY_PER_PRODUCT} unidades`,
    }
  }
  
  const index = findItemIndex(items, productId)
  if (index === -1) {
    return { items, updated: false, reason: 'Produto não encontrado' }
  }
  
  const newItems = [...items]
  newItems[index] = {
    ...newItems[index],
    quantity: newQuantity,
  }
  
  return { items: newItems, updated: true }
}

// ==========================================
// FUNÇÕES DE URL
// ==========================================

/**
 * Gera URL do produto
 */
export function getProductUrl(item: CartItem): string {
  return `/${item.product.subcategorySlug}/${item.product.slug}`
}

/**
 * Formata dimensões para exibição
 */
export function formatDimensions(dimensions: CartProduct['dimensions']): string {
  if (!dimensions) return ''
  return `${dimensions.width} × ${dimensions.height} × ${dimensions.depth} cm`
}

// ==========================================
// TIPOS DE AÇÕES DO REDUCER (para CartProvider)
// ==========================================

export type CartAction =
  | { type: 'ADD_ITEM'; product: CartProduct; quantity?: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'SET_SHIPPING'; shipping: ShippingInfo }
  | { type: 'CLEAR_SHIPPING' }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_FROM_STORAGE'; state: CartState }
