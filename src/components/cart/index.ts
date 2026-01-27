/**
 * Moveirama Cart System - Barrel Export
 * Versão: 1.0
 * Data: Janeiro 2026
 * 
 * Exporta todos os componentes e utilitários do carrinho.
 * 
 * Uso:
 * import { CartProvider, useCart, CartDrawer, CartBadge } from '@/components/cart'
 */

// ============================================
// TIPOS
// ============================================

export type {
  CartProduct,
  CartVariant,
  CartItemData,
  CartState,
  CartAction,
  CartContextValue,
  ShippingInfo,
  ToastType,
  ToastData,
  CustomerData,
  DeliveryAddress,
  CheckoutData,
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
} from './cart-types'

export { CART_CONSTANTS } from './cart-types'

// ============================================
// CONTEXT E HOOKS
// ============================================

export { CartProvider, useCart, CartContext } from './CartProvider'
export { ToastProvider, useToast, ToastContext } from './Toast'

// ============================================
// COMPONENTES
// ============================================

export { CartDrawer } from './CartDrawer'
export { CartItem } from './CartItem'
export { CartBadge, CartBadgeText, CartBadgeMini } from './CartBadge'
export { CartEmpty, CartEmptyWithSuggestions } from './CartEmpty'
export { QuantityControl, QuantityCompact } from './QuantityControl'
export { default as BuyNowButton } from './BuyNowButton'

// ============================================
// LOADING STATES
// ============================================

export {
  CartItemSkeletonCompact,
  CartItemSkeletonFull,
  CartDrawerSkeleton,
  CartPageSkeleton,
  CheckoutPageSkeleton,
} from './CartLoading'

// ============================================
// UTILITÁRIOS
// ============================================

export {
  // Formatação
  formatCurrency,
  formatPrice,
  formatWidth,
  formatDimensions,
  formatInstallments,
  formatDeliveryTime,
  
  // Cálculos
  calculatePixPrice,
  calculateInstallment,
  calculateSubtotal,
  calculateSubtotalPix,
  calculatePixDiscount,
  countTotalItems,
  
  // Máscaras
  maskCEP,
  unmaskCEP,
  maskCPF,
  unmaskCPF,
  maskPhone,
  unmaskPhone,
  
  // Validações
  isValidCEP,
  isValidCPF,
  isValidEmail,
  isValidPhone,
  
  // Storage
  saveCartToStorage,
  loadCartFromStorage,
  clearCartStorage,
  
  // URLs
  getProductUrl,
  getWhatsAppOrderLink,
  getWhatsAppShippingLink,
  
  // Helpers
  generateId,
  debounce,
} from './cart-utils'
