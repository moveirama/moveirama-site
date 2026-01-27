'use client'

/**
 * MinhaListaProvider — Componente wrapper que integra toda a feature
 * 
 * Usar no layout principal para ter FAB e Drawer disponíveis globalmente.
 * 
 * CORREÇÃO v1.1: Exporta MinhaListaContext para uso em componentes que
 * precisam verificar se o contexto existe (ex: ProductSaveWrapper)
 * 
 * Moveirama E-commerce
 * Janeiro 2026
 */

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react'
import { 
  getMinhaLista, 
  subscribeToStorageChanges,
  type ListaItem 
} from '@/lib/minha-lista'
import MinhaListaFAB from './MinhaListaFAB'
import MinhaListaDrawer from './MinhaListaDrawer'
import { StandaloneToast } from './Toast'

// ============================================
// CONTEXT
// ============================================

interface MinhaListaContextType {
  items: ListaItem[]
  count: number
  openDrawer: () => void
  closeDrawer: () => void
  showToast: (message: string, type?: 'save' | 'remove') => void
}

// CORREÇÃO: Exportar o contexto para uso em componentes defensivos
export const MinhaListaContext = createContext<MinhaListaContextType | null>(null)

export function useMinhaLista() {
  const context = useContext(MinhaListaContext)
  if (!context) {
    throw new Error('useMinhaLista deve ser usado dentro de MinhaListaProvider')
  }
  return context
}

// ============================================
// PROVIDER
// ============================================

interface MinhaListaProviderProps {
  children: ReactNode
}

export default function MinhaListaProvider({ children }: MinhaListaProviderProps) {
  const [items, setItems] = useState<ListaItem[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Toast state
  const [toast, setToast] = useState<{
    message: string
    type: 'save' | 'remove'
    visible: boolean
  }>({ message: '', type: 'save', visible: false })

  // Badge de recuperação
  const [showRecoveryBadge, setShowRecoveryBadge] = useState(false)

  // Carrega lista ao montar
  useEffect(() => {
    setMounted(true)
    const loadedItems = getMinhaLista()
    setItems(loadedItems)

    // Mostra badge de recuperação se tinha itens salvos
    if (loadedItems.length > 0) {
      setTimeout(() => {
        setShowRecoveryBadge(true)
        setTimeout(() => setShowRecoveryBadge(false), 3000)
      }, 500)
    }

    // Escuta mudanças
    return subscribeToStorageChanges(() => {
      setItems(getMinhaLista())
    })
  }, [])

  const openDrawer = useCallback(() => setIsDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])

  const showToast = useCallback((message: string, type: 'save' | 'remove' = 'save') => {
    setToast({ message, type, visible: true })
    
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }))
    }, 2500)
  }, [])

  // Callback quando item é removido do drawer
  const handleItemRemove = useCallback((id: string) => {
    showToast('Removido da sua lista', 'remove')
  }, [showToast])

  const contextValue: MinhaListaContextType = {
    items,
    count: items.length,
    openDrawer,
    closeDrawer,
    showToast
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <MinhaListaContext.Provider value={contextValue}>
      {children}

      {/* FAB flutuante */}
      <MinhaListaFAB onClick={openDrawer} />

      {/* Gaveta lateral */}
      <MinhaListaDrawer 
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        items={items}
        onItemRemove={handleItemRemove}
      />

      {/* Toast de feedback */}
      <StandaloneToast 
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />

      {/* Badge de recuperação */}
      <div
        className={`
          fixed top-20 left-1/2 -translate-x-1/2 z-[1000]
          flex items-center gap-2
          px-4 py-2.5
          bg-[#E8F0EB] text-[#4A6B5A]
          text-sm font-medium
          rounded-lg
          shadow-md
          transition-all duration-300 ease-out
          ${showRecoveryBadge 
            ? 'opacity-100 translate-y-0 visible' 
            : 'opacity-0 -translate-y-4 invisible'
          }
        `}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Lista recuperada do navegador
      </div>
    </MinhaListaContext.Provider>
  )
}
