// =============================================================================
// CART COMPONENTS - Barrel Export
// src/components/cart/index.ts
// =============================================================================

// Context & Provider
export { CartProvider, useCart } from './CartProvider'

// Toast
export { ToastProvider, useToast } from './Toast'

// Componentes principais (todos named exports)
export { CartDrawer } from './CartDrawer'
export { CartItem } from './CartItem'
export { CartBadge, CartBadgeText, CartBadgeMini } from './CartBadge'
export { CartEmpty, CartEmptyWithSuggestions } from './CartEmpty'
export { QuantityControl, QuantityCompact } from './QuantityControl'

// Loading states (named exports)
export { 
  CartItemSkeletonCompact,
  CartItemSkeletonFull,
  CartDrawerSkeleton,
  CartPageSkeleton,
  CheckoutPageSkeleton 
} from './CartLoading'

// BuyNowButton (único default export)
export { default as BuyNowButton } from './BuyNowButton'

// Types
export * from './cart-types'

// Utils
export * from './cart-utils'
