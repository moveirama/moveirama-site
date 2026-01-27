'use client'

/**
 * BuyNowButton — Botão "Comprar Agora" conectado ao carrinho
 * 
 * v1.3 — 27/01/2026
 * - Fix: Redireciona para /carrinho em vez de /checkout
 *        Fluxo menos agressivo para público Classe C/D
 * 
 * v1.2 — 27/01/2026
 * - Fix: Corrigida assinatura de addItem(product, quantity)
 *        Antes estava addItem({ product, quantity }) - errado!
 * 
 * v1.1 — 27/01/2026
 * - Fix: Adicionado campos obrigatórios (width, height, depth, pricePix)
 * 
 * v1.0 — 27/01/2026
 * - Adiciona produto ao carrinho
 * - Redireciona para /checkout
 * 
 * Uso:
 * <BuyNowButton product={productData} />
 * <BuyNowButton product={productData} variant="sticky" /> // Para sticky bar mobile
 */

import { useRouter } from 'next/navigation'
import { useCart } from './CartProvider'

interface BuyNowButtonProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    imageUrl?: string
    subcategorySlug: string
    sku?: string
    variantId?: string
    variantName?: string
    // Dimensões (opcionais mas recomendadas)
    width_cm?: number
    height_cm?: number
    depth_cm?: number
    // Extras
    tv_max_size?: number
    main_material?: string
    thickness_mm?: number
  }
  variant?: 'default' | 'sticky'
  className?: string
}

export default function BuyNowButton({ 
  product, 
  variant = 'default',
  className = ''
}: BuyNowButtonProps) {
  const router = useRouter()
  const { addItem } = useCart()

  const handleBuyNow = () => {
    // Garante que price é número (pode vir como string do banco)
    const priceNumber = typeof product.price === 'string' 
      ? parseFloat(product.price) 
      : product.price
    
    // Calcula preço Pix (5% de desconto)
    const pricePix = priceNumber * 0.95

    // Monta objeto CartProduct
    const cartProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: priceNumber,
      pricePix: pricePix,
      imageUrl: product.imageUrl || '',
      subcategorySlug: product.subcategorySlug,
      width: product.width_cm || 0,
      height: product.height_cm || 0,
      depth: product.depth_cm || 0,
      tvMaxSize: product.tv_max_size,
      material: product.main_material,
      materialThickness: product.thickness_mm,
      ...(product.variantId && product.variantName && {
        variant: {
          id: product.variantId,
          name: product.variantName,
          sku: product.sku || ''
        }
      })
    }

    // Adiciona ao carrinho (assinatura: addItem(product, quantity))
    addItem(cartProduct, 1)

    // Redireciona para CARRINHO (não checkout - fluxo menos agressivo)
    router.push('/carrinho')
  }

  // Estilos baseados na variante
  if (variant === 'sticky') {
    return (
      <button 
        onClick={handleBuyNow}
        className={`btn-primary flex-shrink-0 px-6 ${className}`}
      >
        Comprar
      </button>
    )
  }

  return (
    <button 
      onClick={handleBuyNow}
      className={`btn-primary w-full text-lg ${className}`}
    >
      Comprar agora
    </button>
  )
}
