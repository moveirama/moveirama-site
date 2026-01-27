'use client'

/**
 * Toast — Feedback visual para ações da Minha Lista
 * 
 * Comportamento: 
 * - Aparece no topo da tela (abaixo do header)
 * - Duração: 2.5 segundos
 * - Slide-in de cima para baixo
 * 
 * Moveirama E-commerce
 * Janeiro 2026
 */

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react'

// ============================================
// TIPOS
// ============================================

type ToastType = 'save' | 'remove'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

// ============================================
// CONTEXT
// ============================================

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast deve ser usado dentro de ToastProvider')
  }
  return context
}

// ============================================
// PROVIDER
// ============================================

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'save') => {
    const id = Date.now()
    
    setToasts(prev => [...prev, { id, message, type }])

    // Remove após 2.5s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 2500)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  )
}

// ============================================
// ÍCONES
// ============================================

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3,6 5,6 21,6"/>
      <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
    </svg>
  )
}

// ============================================
// CONTAINER
// ============================================

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div 
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[1000] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

// ============================================
// TOAST ITEM
// ============================================

function ToastItem({ toast }: { toast: Toast }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger animação de entrada
    requestAnimationFrame(() => {
      setVisible(true)
    })

    // Animação de saída
    const timeout = setTimeout(() => {
      setVisible(false)
    }, 2200)

    return () => clearTimeout(timeout)
  }, [])

  const isRemove = toast.type === 'remove'

  return (
    <div
      className={`
        flex items-center gap-3
        px-6 py-3.5
        rounded-[10px]
        text-sm font-medium text-white
        shadow-[0_8px_24px_rgba(0,0,0,0.2)]
        transition-all duration-300 ease-out
        pointer-events-auto
        ${isRemove ? 'bg-[#D94F4F]' : 'bg-[#2D2D2D]'}
        ${visible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-5'
        }
      `}
      role="status"
    >
      {isRemove ? <TrashIcon /> : <HeartIcon />}
      <span>{toast.message}</span>
    </div>
  )
}

// ============================================
// STANDALONE TOAST (sem context)
// ============================================

interface StandaloneToastProps {
  message: string
  type?: ToastType
  visible: boolean
}

export function StandaloneToast({ message, type = 'save', visible }: StandaloneToastProps) {
  const isRemove = type === 'remove'

  return (
    <div
      className={`
        fixed top-20 left-1/2 -translate-x-1/2 z-[1000]
        flex items-center gap-3
        px-6 py-3.5
        rounded-[10px]
        text-sm font-medium text-white
        shadow-[0_8px_24px_rgba(0,0,0,0.2)]
        transition-all duration-300 ease-out
        ${isRemove ? 'bg-[#D94F4F]' : 'bg-[#2D2D2D]'}
        ${visible 
          ? 'opacity-100 translate-y-0 visible' 
          : 'opacity-0 -translate-y-5 invisible'
        }
      `}
      role="status"
      aria-live="polite"
    >
      {isRemove ? <TrashIcon /> : <HeartIcon />}
      <span>{message}</span>
    </div>
  )
}

// Export default o Provider para facilitar uso
export default ToastProvider
