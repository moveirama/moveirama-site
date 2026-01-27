'use client'

/**
 * MinhaListaDrawer — Gaveta lateral com lista de produtos salvos
 * 
 * v2.2 — 24/01/2026
 * - Footer v2: "Sua seleção está pronta" + totalizador + enviar lista
 * - WhatsApp SEM número fixo (cliente escolhe pra quem enviar)
 * - Mensagem inclui links dos produtos
 * 
 * v2.1 — 24/01/2026
 * - Fontes 30% maiores para melhor legibilidade
 * - Medidas inteligentes: <100cm mostra em cm, ≥100cm mostra em metros
 * 
 * Comportamento:
 * - Abre da direita
 * - Largura: 100% até max 400px
 * - Overlay escurece o fundo
 * - Fecha com: clique no X, clique no overlay, tecla ESC
 * - Mostra medidas (largura) de cada produto
 * - WhatsApp compartilha lista com links
 * 
 * Moveirama E-commerce
 * Janeiro 2026
 */

import { useEffect, useCallback, useRef } from 'react'
import { 
  removeItem, 
  type ListaItem 
} from '@/lib/minha-lista'
import Image from 'next/image'
import Link from 'next/link'

// ============================================
// TIPOS
// ============================================

interface MinhaListaDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: ListaItem[]
  onItemRemove?: (id: string) => void
}

// ============================================
// UTILITÁRIOS
// ============================================

/**
 * Formata largura de forma inteligente:
 * - Abaixo de 100cm: mostra em centímetros (ex: "91cm")
 * - 100cm ou mais: mostra em metros (ex: "1,80m")
 */
function formatWidth(widthCm: string | number): string {
  const cm = typeof widthCm === 'string' ? parseFloat(widthCm) : widthCm
  if (isNaN(cm)) return '-'
  
  if (cm < 100) {
    return `${Math.round(cm)}cm`
  } else {
    const meters = (cm / 100).toFixed(2).replace('.', ',')
    return `${meters}m`
  }
}

/**
 * Converte price para number (pode vir string do banco/localStorage)
 */
function toNumber(value: string | number): number {
  if (typeof value === 'number') return value
  const parsed = parseFloat(value)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Formata preço em BRL
 */
function formatPrice(value: string | number): string {
  const num = toNumber(value)
  return num.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  })
}

// ============================================
// ÍCONES
// ============================================

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#D94F4F" stroke="#D94F4F" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

function RulerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10H7"/>
      <path d="M21 6H3"/>
      <path d="M21 14H3"/>
      <path d="M21 18H7"/>
    </svg>
  )
}

function ClipboardCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  )
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 2L11 13"/>
      <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
    </svg>
  )
}

function EmptyHeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-16 h-16 text-[#D1C7BD]" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function MinhaListaDrawer({ 
  isOpen, 
  onClose, 
  items,
  onItemRemove 
}: MinhaListaDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Calcula total da seleção (converte price para number)
  const total = items.reduce((sum, item) => sum + toNumber(item.price), 0)

  // Fecha com ESC
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  // Focus trap e keyboard
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      
      // Focus no botão de fechar ao abrir
      setTimeout(() => {
        closeButtonRef.current?.focus()
      }, 100)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  const handleRemove = (id: string) => {
    removeItem(id)
    onItemRemove?.(id)
  }

  /**
   * Envia lista por WhatsApp SEM número fixo
   * Cliente escolhe pra quem enviar (ele mesmo, esposa, marido, etc)
   */
  const sendList = () => {
    let message = `Oi! Separei esses móveis da Moveirama:\n\n`
    
    items.forEach((item, i) => {
      const widthDisplay = formatWidth(item.width)
      const price = formatPrice(item.price)
      
      message += `${i + 1}. ${item.name} (${widthDisplay}) - ${price}\n`
      message += `   👉 moveirama.com.br/${item.subcategorySlug}/${item.slug}\n\n`
    })
    
    message += `━━━━━━━━━━━━━━\n`
    message += `Total: ${formatPrice(total)}\n\n`
    message += `O que você acha?`
    
    const encoded = encodeURIComponent(message)
    // SEM número fixo - cliente escolhe pra quem enviar
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
  }

  const count = items.length

  return (
    <>
      {/* Overlay */}
      <div 
        className={`
          fixed inset-0 z-[600]
          bg-black/50
          transition-opacity duration-300
          ${isOpen 
            ? 'opacity-100 visible' 
            : 'opacity-0 invisible pointer-events-none'
          }
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Móveis que mais gostei"
        className={`
          fixed top-0 right-0 bottom-0 z-[700]
          w-full max-w-[400px]
          bg-[#FAF7F4]
          shadow-[-4px_0_20px_rgba(0,0,0,0.15)]
          flex flex-col
          transition-transform duration-300 ease-out
          ${isOpen 
            ? 'translate-x-0' 
            : 'translate-x-full'
          }
        `}
      >
        {/* Header */}
        <header className="
          flex items-center justify-between
          px-5 py-4
          border-b border-[#E8DFD5]
          bg-white
        ">
          <div className="flex items-center gap-2">
            <HeartIcon />
            <h2 className="text-lg font-semibold text-[#2D2D2D]">
              Móveis que mais gostei
            </h2>
            <span className="text-sm text-[#8B7355]">
              ({count} {count === 1 ? 'item' : 'itens'})
            </span>
          </div>
          
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Fechar"
            className="
              w-10 h-10
              flex items-center justify-center
              rounded-lg
              text-[#5A4A3A]
              hover:bg-[#F2EDE8]
              transition-colors duration-150
              focus-visible:outline focus-visible:outline-2 
              focus-visible:outline-[#6B8E7A] focus-visible:outline-offset-2
            "
          >
            <CloseIcon />
          </button>
        </header>

        {/* Lista de produtos */}
        <div className="flex-1 overflow-y-auto p-4">
          {count === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-3">
              {items.map(item => (
                <DrawerItem 
                  key={item.id} 
                  item={item} 
                  onRemove={() => handleRemove(item.id)} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer v2 - Enviar Lista */}
        {count > 0 && (
          <footer className="
            p-4
            border-t border-[#E8DFD5]
            bg-[#FAFAFA]
          ">
            {/* Header do footer */}
            <div className="flex items-center gap-3 mb-2">
              <div className="
                w-10 h-10 
                rounded-full 
                bg-[#E8F0EB] 
                flex items-center justify-center 
                flex-shrink-0
              ">
                <span className="text-[#6B8E7A]">
                  <ClipboardCheckIcon />
                </span>
              </div>
              <span className="font-semibold text-[#2D2D2D]">
                Sua seleção está pronta
              </span>
            </div>
            
            {/* Descrição */}
            <p className="text-sm text-[#8B7355] mb-4">
              Envie pra você mesmo, pro marido, pra esposa - ou salve no seu WhatsApp pra decidir com calma.
            </p>
            
            {/* Totalizador */}
            <div className="
              flex justify-between items-center 
              py-3 px-4 
              bg-white 
              rounded-lg 
              border border-[#E8DFD5] 
              mb-4
            ">
              <span className="text-sm text-[#5A4A3A]">Total da seleção</span>
              <span className="text-lg font-bold text-[#2D2D2D]">
                {formatPrice(total)}
              </span>
            </div>
            
            {/* Botão Enviar Lista */}
            <button
              onClick={sendList}
              className="
                w-full h-12
                bg-[#25D366] hover:bg-[#20BD5A]
                text-white font-semibold
                rounded-lg
                flex items-center justify-center gap-2
                transition-colors duration-150
                focus-visible:outline focus-visible:outline-2 
                focus-visible:outline-[#25D366] focus-visible:outline-offset-2
                mb-2
              "
            >
              <SendIcon />
              Enviar lista por WhatsApp
            </button>
            
            {/* Continuar navegando */}
            <button
              onClick={onClose}
              className="
                w-full h-10
                text-sm text-[#8B7355] 
                hover:text-[#5A4A3A]
                transition-colors duration-150
              "
            >
              Continuar navegando
            </button>
          </footer>
        )}
      </aside>
    </>
  )
}

// ============================================
// ITEM DA LISTA (v2.1 - fontes maiores + medidas inteligentes)
// ============================================

function DrawerItem({ item, onRemove }: { item: ListaItem; onRemove: () => void }) {
  return (
    <div className="
      flex gap-3
      p-3
      bg-white
      border border-[#E8DFD5]
      rounded-lg
      group
    ">
      {/* Imagem - aumentada de 70px para 80px */}
      <div className="
        w-[80px] h-[80px] flex-shrink-0
        bg-[#F2EDE8]
        rounded-lg
        overflow-hidden
        flex items-center justify-center
      ">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-[#B8A99A] text-xs">Foto</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Nome - era text-sm (14px), agora text-base (16px) */}
        <div className="
          text-base font-semibold text-[#2D2D2D]
          line-clamp-2
          leading-tight
        ">
          {item.name}
        </div>
        
        {/* Medidas - era text-xs (12px), agora text-sm (14px) + formatação inteligente */}
        <div className="
          flex items-center gap-1.5
          mt-2
          text-sm text-[#8B7355]
        ">
          <RulerIcon />
          <span>
            <strong className="text-[#5A4A3A] font-semibold">{formatWidth(item.width)}</strong> de largura
          </span>
        </div>

        {/* Preço - era text-sm (14px), agora text-lg (18px) */}
        <div className="text-lg font-bold text-[#2D2D2D] mt-1">
          {formatPrice(item.price)}
        </div>

        {/* Link - era text-xs (12px), agora text-sm (14px) */}
        <Link
          href={`/${item.subcategorySlug}/${item.slug}`}
          className="
            inline-block
            mt-2
            text-sm font-medium text-[#6B8E7A]
            hover:underline
          "
        >
          Ver produto →
        </Link>
      </div>

      {/* Botão remover */}
      <button
        onClick={onRemove}
        aria-label={`Remover ${item.name}`}
        className="
          self-start
          w-8 h-8
          flex items-center justify-center
          rounded-md
          text-[#B8A99A]
          hover:text-[#D94F4F] hover:bg-red-50
          transition-colors duration-150
          opacity-0 group-hover:opacity-100
          focus:opacity-100
          focus-visible:outline focus-visible:outline-2 
          focus-visible:outline-[#D94F4F] focus-visible:outline-offset-2
        "
      >
        <CloseIcon />
      </button>
    </div>
  )
}

// ============================================
// ESTADO VAZIO
// ============================================

function EmptyState() {
  return (
    <div className="
      flex flex-col items-center justify-center
      py-12
      text-center
    ">
      <EmptyHeartIcon />
      <div className="text-base font-medium text-[#5A4A3A] mt-4">
        Sua lista está vazia
      </div>
      <div className="text-sm text-[#8B7355] mt-1">
        Salve os móveis que gostar para comparar depois!
      </div>
    </div>
  )
}
