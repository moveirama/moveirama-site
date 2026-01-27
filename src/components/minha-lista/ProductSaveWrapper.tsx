'use client'

/**
 * ProductSaveWrapper — Wrapper para SaveButton com feedback via Toast
 * 
 * CORREÇÃO: Usa useContext diretamente para verificar se o Provider existe
 * antes de tentar usar o contexto (evita erro durante SSR).
 * 
 * Moveirama E-commerce
 * Janeiro 2026
 */

import { useContext } from 'react'
import { SaveButton } from '@/components/minha-lista'
import { MinhaListaContext } from '@/components/minha-lista/MinhaListaProvider'

interface Props {
  product: {
    id: string
    name: string
    price: number
    slug: string
    subcategorySlug: string
    width_cm: number
    imageUrl: string
  }
}

export default function ProductSaveWrapper({ product }: Props) {
  // Usar useContext diretamente para poder verificar null
  // (o hook useMinhaLista() faz throw se não tem contexto)
  const context = useContext(MinhaListaContext)
  
  // Se não tem contexto (SSR ou fora do Provider), renderiza o botão sem toast
  if (!context) {
    return (
      <SaveButton
        product={product}
        onSave={() => {
          // Sem feedback visual, mas o botão ainda funciona
          // (salva no localStorage)
        }}
      />
    )
  }
  
  const { showToast } = context
  
  return (
    <SaveButton
      product={product}
      onSave={(added) => {
        showToast(
          added ? 'Guardamos este pra você não esquecer!' : 'Removido da sua lista',
          added ? 'save' : 'remove'
        )
      }}
    />
  )
}
