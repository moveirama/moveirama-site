'use client'

/**
 * Moveirama Cart System - Toast Component
 * Versão: 1.0
 * Data: Janeiro 2026
 * 
 * Notificações toast para feedback de ações.
 * Auto-dismiss após 3 segundos.
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { X, Check, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { ToastType, ToastData } from './cart-types'
import { generateId } from './cart-utils'

// ============================================
// CONTEXTO
// ============================================

interface ToastContextValue {
  showToast: (type: ToastType, message: string, duration?: number) => void
  hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

// ============================================
// PROVIDER
// ============================================

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([])
  
  const showToast = useCallback((type: ToastType, message: string, duration = 3000) => {
    const id = generateId()
    const toast: ToastData = { id, type, message, duration }
    
    setToasts(prev => [...prev, toast])
    
    // Auto-dismiss
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])
  
  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])
  
  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onHide={hideToast} />
    </ToastContext.Provider>
  )
}

// ============================================
// HOOK
// ============================================

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  
  if (!context) {
    throw new Error('useToast deve ser usado dentro de ToastProvider')
  }
  
  return context
}

// ============================================
// CONTAINER
// ============================================

interface ToastContainerProps {
  toasts: ToastData[]
  onHide: (id: string) => void
}

function ToastContainer({ toasts, onHide }: ToastContainerProps) {
  if (toasts.length === 0) return null
  
  return (
    <div 
      className="fixed z-[9999] pointer-events-none"
      style={{
        bottom: '100px',  // Acima da sticky bar mobile
        left: '16px',
        right: '16px',
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex flex-col gap-2 items-center md:items-end">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onHide={onHide} />
        ))}
      </div>
    </div>
  )
}

// ============================================
// TOAST ITEM
// ============================================

interface ToastProps {
  toast: ToastData
  onHide: (id: string) => void
}

function Toast({ toast, onHide }: ToastProps) {
  const { id, type, message } = toast
  
  const Icon = getIcon(type)
  const bgColor = getBgColor(type)
  
  return (
    <div
      role="alert"
      className={`
        pointer-events-auto
        flex items-center gap-3
        px-4 py-3
        rounded-lg
        shadow-lg
        max-w-[calc(100vw-32px)]
        md:max-w-md
        animate-slide-up
        ${bgColor}
      `}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        type="button"
        onClick={() => onHide(id)}
        className="p-1 rounded hover:bg-white/20 transition-colors flex-shrink-0"
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// ============================================
// HELPERS
// ============================================

function getIcon(type: ToastType) {
  switch (type) {
    case 'success':
      return Check
    case 'error':
      return AlertCircle
    case 'warning':
      return AlertTriangle
    case 'info':
    default:
      return Info
  }
}

function getBgColor(type: ToastType): string {
  switch (type) {
    case 'success':
      return 'bg-[#2D2D2D] text-white'
    case 'error':
      return 'bg-[#D94F4F] text-white'
    case 'warning':
      return 'bg-[#B85C38] text-white'
    case 'info':
    default:
      return 'bg-[#2D2D2D] text-white'
  }
}

// ============================================
// CSS ANIMATION (adicionar ao globals.css)
// ============================================

/*
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.2s ease-out;
}
*/

export { ToastContext }
