/**
 * Moveirama Cart System - Utility Functions
 * Versão: 1.0
 * Data: Janeiro 2026
 */

import { CartState, CartItemData, CART_CONSTANTS } from './cart-types'

// ============================================
// FORMATAÇÃO DE VALORES
// ============================================

/**
 * Formata valor em Reais
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formata valor curto (sem "R$" para contextos compactos)
 */
export function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Calcula preço com desconto Pix (5%)
 */
export function calculatePixPrice(price: number): number {
  return price * (1 - CART_CONSTANTS.PIX_DISCOUNT)
}

/**
 * Calcula valor das parcelas
 */
export function calculateInstallment(total: number, installments: number): number {
  return total / installments
}

/**
 * Formata parcelas
 */
export function formatInstallments(total: number, installments: number = 12): string {
  const value = calculateInstallment(total, installments)
  return `${installments}x de ${formatCurrency(value)}`
}

// ============================================
// FORMATAÇÃO DE MEDIDAS
// ============================================

/**
 * Formata largura em metros ou cm
 */
export function formatWidth(widthCm: number): string {
  if (widthCm < 100) {
    return `${Math.round(widthCm)}cm`
  }
  return `${(widthCm / 100).toFixed(2).replace('.', ',')}m`
}

/**
 * Formata dimensões completas (L × A × P)
 * Retorna string vazia se alguma dimensão for undefined/null
 */
export function formatDimensions(width?: number | null, height?: number | null, depth?: number | null): string {
  // Se alguma dimensão não existir, retorna vazio
  if (width == null || height == null || depth == null) {
    return ''
  }
  return `${width.toFixed(1).replace('.', ',')} × ${height.toFixed(1).replace('.', ',')} × ${depth.toFixed(1).replace('.', ',')} cm`
}

// ============================================
// MÁSCARAS DE INPUT
// ============================================

/**
 * Máscara de CEP (00000-000)
 */
export function maskCEP(value: string): string {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 5) return numbers
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
}

/**
 * Remove máscara de CEP
 */
export function unmaskCEP(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Máscara de CPF (000.000.000-00)
 */
export function maskCPF(value: string): string {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 3) return numbers
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
}

/**
 * Remove máscara de CPF
 */
export function unmaskCPF(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Máscara de telefone ((00) 00000-0000)
 */
export function maskPhone(value: string): string {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 2) return numbers.length ? `(${numbers}` : ''
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
}

/**
 * Remove máscara de telefone
 */
export function unmaskPhone(value: string): string {
  return value.replace(/\D/g, '')
}

// ============================================
// VALIDAÇÕES
// ============================================

/**
 * Valida CEP
 */
export function isValidCEP(cep: string): boolean {
  const numbers = unmaskCEP(cep)
  return numbers.length === 8
}

/**
 * Valida CPF (com dígito verificador)
 */
export function isValidCPF(cpf: string): boolean {
  const numbers = unmaskCPF(cpf)
  
  if (numbers.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false
  
  // Valida dígitos verificadores
  let sum = 0
  let remainder: number
  
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(numbers.substring(i - 1, i)) * (11 - i)
  }
  
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(numbers.substring(9, 10))) return false
  
  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(numbers.substring(i - 1, i)) * (12 - i)
  }
  
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(numbers.substring(10, 11))) return false
  
  return true
}

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Valida telefone
 */
export function isValidPhone(phone: string): boolean {
  const numbers = unmaskPhone(phone)
  return numbers.length >= 10 && numbers.length <= 11
}

// ============================================
// LOCALSTORAGE
// ============================================

/**
 * Salva carrinho no localStorage
 */
export function saveCartToStorage(state: CartState): void {
  if (typeof window === 'undefined') return
  
  try {
    const data = {
      ...state,
      lastUpdated: Date.now(),
    }
    localStorage.setItem(CART_CONSTANTS.STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Erro ao salvar carrinho:', error)
  }
}

/**
 * Carrega carrinho do localStorage
 */
export function loadCartFromStorage(): CartState | null {
  if (typeof window === 'undefined') return null
  
  try {
    const data = localStorage.getItem(CART_CONSTANTS.STORAGE_KEY)
    if (!data) return null
    
    const parsed: CartState = JSON.parse(data)
    
    // Verifica expiração (30 dias)
    const expiryMs = CART_CONSTANTS.STORAGE_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    if (Date.now() - parsed.lastUpdated > expiryMs) {
      localStorage.removeItem(CART_CONSTANTS.STORAGE_KEY)
      return null
    }
    
    return parsed
  } catch (error) {
    console.error('Erro ao carregar carrinho:', error)
    return null
  }
}

/**
 * Limpa carrinho do localStorage
 */
export function clearCartStorage(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(CART_CONSTANTS.STORAGE_KEY)
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error)
  }
}

// ============================================
// CÁLCULOS DO CARRINHO
// ============================================

/**
 * Calcula subtotal (preço regular)
 */
export function calculateSubtotal(items: CartItemData[]): number {
  return items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity
  }, 0)
}

/**
 * Calcula subtotal com desconto Pix
 * Faz fallback para price * 0.95 se pricePix não existir
 */
export function calculateSubtotalPix(items: CartItemData[]): number {
  return items.reduce((sum, item) => {
    const pricePix = item.product.pricePix || item.product.price * 0.95
    return sum + pricePix * item.quantity
  }, 0)
}

/**
 * Calcula economia do Pix
 */
export function calculatePixDiscount(subtotal: number, subtotalPix: number): number {
  return subtotal - subtotalPix
}

/**
 * Conta total de itens (somando quantidades)
 */
export function countTotalItems(items: CartItemData[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

// ============================================
// URLS
// ============================================

/**
 * Gera URL do produto
 */
export function getProductUrl(subcategorySlug: string, productSlug: string): string {
  return `/${subcategorySlug}/${productSlug}`
}

/**
 * Gera link WhatsApp com mensagem do pedido
 */
export function getWhatsAppOrderLink(orderNumber: string): string {
  const phone = '5541984209323'
  const message = encodeURIComponent(
    `Olá! Gostaria de acompanhar meu pedido #${orderNumber}`
  )
  return `https://wa.me/${phone}?text=${message}`
}

/**
 * Gera link WhatsApp para dúvidas sobre frete
 */
export function getWhatsAppShippingLink(cep: string): string {
  const phone = '5541984209323'
  const message = encodeURIComponent(
    `Olá! Gostaria de saber sobre entrega para o CEP ${cep}`
  )
  return `https://wa.me/${phone}?text=${message}`
}

// ============================================
// HELPERS
// ============================================

/**
 * Gera ID único
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Formata prazo de entrega
 */
export function formatDeliveryTime(min: number, max: number): string {
  if (min === max) {
    return `${min} dia${min > 1 ? 's' : ''} útil${min > 1 ? 'eis' : ''}`
  }
  return `${min}-${max} dias úteis`
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}
