'use client'

/**
 * Moveirama Cart System - Cart Provider
 * Versão: 1.0
 * Data: Janeiro 2026
 * 
 * Context API para gerenciamento global do carrinho.
 * Persiste no localStorage com expiração de 30 dias.
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from 'react'

import {
  CartState,
  CartAction,
  CartContextValue,
  CartProduct,
  CartItemData,
  ShippingInfo,
  CART_CONSTANTS,
} from './cart-types'

import {
  saveCartToStorage,
  loadCartFromStorage,
  calculateSubtotal,
  calculateSubtotalPix,
  calculatePixDiscount,
  countTotalItems,
} from './cart-utils'

// ============================================
// ESTADO INICIAL
// ============================================

const initialState: CartState = {
  items: [],
  shipping: null,
  isOpen: false,
  lastUpdated: Date.now(),
}

// ============================================
// REDUCER
// ============================================

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action.payload
      const existingIndex = state.items.findIndex(
        item => item.product.id === product.id
      )
      
      let newItems: CartItemData[]
      
      if (existingIndex >= 0) {
        // Atualiza quantidade do item existente
        newItems = state.items.map((item, index) => {
          if (index === existingIndex) {
            const newQuantity = Math.min(
              item.quantity + quantity,
              CART_CONSTANTS.MAX_QUANTITY
            )
            return { ...item, quantity: newQuantity }
          }
          return item
        })
      } else {
        // Verifica limite de produtos diferentes
        if (state.items.length >= CART_CONSTANTS.MAX_ITEMS) {
          console.warn('Limite de produtos no carrinho atingido')
          return state
        }
        
        // Adiciona novo item
        const newItem: CartItemData = {
          product,
          quantity: Math.min(quantity, CART_CONSTANTS.MAX_QUANTITY),
          addedAt: Date.now(),
        }
        newItems = [...state.items, newItem]
      }
      
      return {
        ...state,
        items: newItems,
        lastUpdated: Date.now(),
      }
    }
    
    case 'REMOVE_ITEM': {
      const { productId } = action.payload
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== productId),
        lastUpdated: Date.now(),
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload
      
      // Validação de quantidade
      if (quantity < CART_CONSTANTS.MIN_QUANTITY) {
        // Se quantidade for menor que mínimo, remove o item
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { productId } })
      }
      
      const clampedQuantity = Math.min(quantity, CART_CONSTANTS.MAX_QUANTITY)
      
      return {
        ...state,
        items: state.items.map(item => {
          if (item.product.id === productId) {
            return { ...item, quantity: clampedQuantity }
          }
          return item
        }),
        lastUpdated: Date.now(),
      }
    }
    
    case 'SET_SHIPPING': {
      return {
        ...state,
        shipping: action.payload,
        lastUpdated: Date.now(),
      }
    }
    
    case 'CLEAR_SHIPPING': {
      return {
        ...state,
        shipping: null,
        lastUpdated: Date.now(),
      }
    }
    
    case 'CLEAR_CART': {
      return {
        ...initialState,
        lastUpdated: Date.now(),
      }
    }
    
    case 'OPEN_DRAWER': {
      return {
        ...state,
        isOpen: true,
      }
    }
    
    case 'CLOSE_DRAWER': {
      return {
        ...state,
        isOpen: false,
      }
    }
    
    case 'LOAD_FROM_STORAGE': {
      return {
        ...action.payload,
        isOpen: false, // Sempre inicia fechado
      }
    }
    
    default:
      return state
  }
}

// ============================================
// CONTEXTO
// ============================================

const CartContext = createContext<CartContextValue | null>(null)

// ============================================
// PROVIDER
// ============================================

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  
  // Carrega do localStorage na montagem
  useEffect(() => {
    const saved = loadCartFromStorage()
    if (saved) {
      dispatch({ type: 'LOAD_FROM_STORAGE', payload: saved })
    }
  }, [])
  
  // Salva no localStorage a cada mudança
  useEffect(() => {
    saveCartToStorage(state)
  }, [state])
  
  // ============================================
  // AÇÕES
  // ============================================
  
  const addItem = useCallback((product: CartProduct, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } })
  }, [])
  
  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } })
  }, [])
  
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  }, [])
  
  const setShipping = useCallback((shipping: ShippingInfo) => {
    dispatch({ type: 'SET_SHIPPING', payload: shipping })
  }, [])
  
  const clearShipping = useCallback(() => {
    dispatch({ type: 'CLEAR_SHIPPING' })
  }, [])
  
  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])
  
  const openDrawer = useCallback(() => {
    dispatch({ type: 'OPEN_DRAWER' })
  }, [])
  
  const closeDrawer = useCallback(() => {
    dispatch({ type: 'CLOSE_DRAWER' })
  }, [])
  
  // ============================================
  // VALORES COMPUTADOS
  // ============================================
  
  const itemCount = useMemo(
    () => countTotalItems(state.items),
    [state.items]
  )
  
  const subtotal = useMemo(
    () => calculateSubtotal(state.items),
    [state.items]
  )
  
  const subtotalPix = useMemo(
    () => calculateSubtotalPix(state.items),
    [state.items]
  )
  
  const pixDiscount = useMemo(
    () => calculatePixDiscount(subtotal, subtotalPix),
    [subtotal, subtotalPix]
  )
  
  const shippingFee = state.shipping?.fee ?? 0
  
  const total = useMemo(
    () => subtotal + shippingFee,
    [subtotal, shippingFee]
  )
  
  const totalPix = useMemo(
    () => subtotalPix + shippingFee,
    [subtotalPix, shippingFee]
  )
  
  const isEmpty = state.items.length === 0
  
  const canCheckout = !isEmpty && state.shipping !== null
  
  // ============================================
  // VALOR DO CONTEXTO
  // ============================================
  
  const value: CartContextValue = useMemo(
    () => ({
      state,
      addItem,
      removeItem,
      updateQuantity,
      setShipping,
      clearShipping,
      clearCart,
      openDrawer,
      closeDrawer,
      itemCount,
      subtotal,
      subtotalPix,
      pixDiscount,
      total,
      totalPix,
      isEmpty,
      canCheckout,
    }),
    [
      state,
      addItem,
      removeItem,
      updateQuantity,
      setShipping,
      clearShipping,
      clearCart,
      openDrawer,
      closeDrawer,
      itemCount,
      subtotal,
      subtotalPix,
      pixDiscount,
      total,
      totalPix,
      isEmpty,
      canCheckout,
    ]
  )
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// ============================================
// HOOK
// ============================================

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider')
  }
  
  return context
}

// Export do contexto para casos especiais
export { CartContext }
