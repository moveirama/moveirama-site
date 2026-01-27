/**
 * minha-lista — Barrel Export
 * 
 * Feature de lista de favoritos ("Móveis que mais gostei")
 * 
 * CORREÇÃO v1.1: Adiciona export do MinhaListaContext para
 * componentes que precisam verificar se o contexto existe.
 * 
 * Moveirama E-commerce
 * Janeiro 2026
 */

// Provider e Context
export { default as MinhaListaProvider } from './MinhaListaProvider'
export { MinhaListaContext, useMinhaLista } from './MinhaListaProvider'

// Componentes
export { default as MinhaListaDrawer } from './MinhaListaDrawer'
export { default as MinhaListaFAB } from './MinhaListaFAB'
export { default as SaveButton } from './SaveButton'
export { default as ProductSaveWrapper } from './ProductSaveWrapper'

// Toast
export { Toast, StandaloneToast } from './Toast'