/**
 * Moveirama Cart System - Cart Loading Component
 * Versão: 1.0
 * Data: Janeiro 2026
 * 
 * Skeleton loading states para o carrinho.
 */

import React from 'react'

// ============================================
// SKELETON BASE
// ============================================

interface SkeletonProps {
  className?: string
}

function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`animate-skeleton bg-gradient-to-r from-[#E8DFD5] via-[#F0E8DF] to-[#E8DFD5] bg-[length:200%_100%] rounded ${className}`}
      aria-hidden="true"
    />
  )
}

// ============================================
// CART ITEM SKELETON (Drawer)
// ============================================

export function CartItemSkeletonCompact() {
  return (
    <div className="flex gap-3 p-3 border-b border-[#E8DFD5]">
      {/* Imagem */}
      <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        {/* Nome */}
        <Skeleton className="h-4 w-3/4 mb-2" />
        {/* Variante */}
        <Skeleton className="h-3 w-1/2 mb-3" />
        {/* Preço */}
        <Skeleton className="h-5 w-24 mb-2" />
        {/* Controles */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-6 w-6 rounded" />
        </div>
      </div>
    </div>
  )
}

// ============================================
// CART ITEM SKELETON (Página)
// ============================================

export function CartItemSkeletonFull() {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
      {/* Imagem */}
      <Skeleton className="w-[100px] h-[100px] rounded-lg flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        {/* Nome */}
        <Skeleton className="h-5 w-3/4 mb-2" />
        {/* Variante */}
        <Skeleton className="h-4 w-1/2 mb-2" />
        {/* Dimensões */}
        <Skeleton className="h-3 w-2/3 mb-3" />
        {/* Badges */}
        <div className="flex gap-2 mb-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        {/* Preços e controles */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-5 w-28 mb-1" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  )
}

// ============================================
// CART DRAWER SKELETON
// ============================================

export function CartDrawerSkeleton() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#E8DFD5]">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
      
      {/* Items */}
      <div className="flex-1 overflow-hidden">
        <CartItemSkeletonCompact />
        <CartItemSkeletonCompact />
        <CartItemSkeletonCompact />
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-[#E8DFD5] bg-white">
        <div className="flex justify-between mb-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg mb-2" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}

// ============================================
// CART PAGE SKELETON
// ============================================

export function CartPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF7F4]">
      <div className="container mx-auto px-4 py-8">
        {/* Título */}
        <Skeleton className="h-8 w-48 mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Lista de produtos */}
          <div className="space-y-4">
            <CartItemSkeletonFull />
            <CartItemSkeletonFull />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Frete */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Skeleton className="h-5 w-32 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 w-24" />
              </div>
            </div>
            
            {/* Resumo */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Skeleton className="h-5 w-40 mb-4" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-px w-full my-3" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-7 w-28" />
                </div>
              </div>
              <Skeleton className="h-12 w-full mt-6 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// CHECKOUT PAGE SKELETON
// ============================================

export function CheckoutPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF7F4]">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Título */}
        <Skeleton className="h-8 w-48 mb-8" />
        
        {/* Resumo colapsável */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        
        {/* Formulário */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        
        {/* Endereço */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-12 col-span-1" />
              <Skeleton className="h-12 col-span-2" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-12 col-span-1" />
              <Skeleton className="h-12 col-span-2" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        
        {/* Pagamento */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 flex-1" />
          </div>
          <Skeleton className="h-52 w-full" />
        </div>
      </div>
    </div>
  )
}

// ============================================
// CSS ANIMATION (adicionar ao globals.css)
// ============================================

/*
@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.animate-skeleton {
  animation: skeleton-loading 1.5s ease-in-out infinite;
}
*/
