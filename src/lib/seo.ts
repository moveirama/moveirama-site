// src/lib/seo.ts

/**
 * Moveirama SEO Utilities
 * Funções para gerar H1, meta description e schema.org otimizados
 * 
 * Baseado na curadoria técnica da PDP
 * Versão: 1.0
 */

// ============================================
// TYPES
// ============================================

interface ProductForH1 {
  name: string
  tv_max_size?: number | null
  category_type?: 'rack' | 'painel' | 'escrivaninha' | 'penteadeira' | 'mesa' | null
  variant_name?: string | null
}

interface ProductForMeta {
  name: string
  price: number
  tv_max_size?: number | null
  assembly_time_minutes?: number | null
  category_type?: string | null
}

interface ProductForSchema {
  name: string
  price: number
  tv_max_size?: number | null
  assembly_time_minutes?: number | null
  category_type?: string | null
  sku?: string | null
  slug: string
  brand?: string | null
  main_material?: string | null
  width?: number | null
  height?: number | null
  depth?: number | null
  stock_quantity: number
  images?: Array<{ url: string }> | null
  variants?: Array<{ name: string }> | null
}

// ============================================
// H1 OTIMIZADO
// ============================================

/**
 * Gera H1 otimizado para SEO
 * 
 * Para racks/painéis: inclui compatibilidade TV no título
 * Exemplo: "Rack Theo para TV até 60 polegadas - Cinamomo/Off White"
 * 
 * Para outros produtos: nome + variante
 * Exemplo: "Escrivaninha Home - Carvalho"
 */
export function generateProductH1(product: ProductForH1): string {
  const { name, tv_max_size, category_type, variant_name } = product
  
  // Verifica se é rack ou painel
  const isRackOrPanel = category_type === 'rack' || category_type === 'painel'
  
  // Se é rack/painel E tem tv_max_size, incluir no H1
  if (isRackOrPanel && tv_max_size) {
    // Extrai nome base (sem cor) - ex: "Rack Charlotte" de "Rack Charlotte - Carvalho C / Off White"
    const baseName = name.includes(' - ') ? name.split(' - ')[0] : name
    const tvPart = `para TV até ${tv_max_size} polegadas`
    
    // Extrai cor do nome original se existir
    const colorFromName = name.includes(' - ') ? name.split(' - ').slice(1).join(' - ') : null
    const colorPart = variant_name || colorFromName
    
    return colorPart ? `${baseName} ${tvPart} - ${colorPart}` : `${baseName} ${tvPart}`
  }
  
  // Para outros produtos, manter nome + variante (se não estiver no nome)
  if (variant_name && !name.includes(variant_name)) {
    return `${name} - ${variant_name}`
  }
  
  return name
}

// ============================================
// META DESCRIPTION
// ============================================

/**
 * Gera meta description otimizada para CTR
 * 
 * Inclui:
 * - Nome + compatibilidade TV (se rack/painel)
 * - Preço à vista
 * - Parcelamento sem juros
 * - Tempo de montagem
 * - Entrega em Curitiba (diferencial local)
 * 
 * Exemplo:
 * "Rack Theo para TV até 60". R$ 269,00 à vista ou 5x R$ 53,80 sem juros. 
 * Montagem em ~45min. Entrega em Curitiba e região em até 2 dias úteis."
 */
export function generateProductMetaDescription(product: ProductForMeta): string {
  const { name, price, tv_max_size, assembly_time_minutes, category_type } = product
  
  // Calcula parcelas (mínimo R$ 50 por parcela)
  const parcelas = Math.min(10, Math.floor(price / 50)) || 1
  const valorParcela = (price / parcelas).toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })
  const priceFormatted = price.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })
  
  const parts: string[] = []
  
  // Parte 1: Nome + compatibilidade (se rack/painel)
  if (tv_max_size && (category_type === 'rack' || category_type === 'painel')) {
    parts.push(`${name} para TV até ${tv_max_size}".`)
  } else {
    parts.push(`${name}.`)
  }
  
  // Parte 2: Preço e parcelamento
  parts.push(`R$ ${priceFormatted} à vista ou ${parcelas}x R$ ${valorParcela} sem juros.`)
  
  // Parte 3: Montagem (se disponível)
  if (assembly_time_minutes) {
    parts.push(`Montagem em ~${assembly_time_minutes}min.`)
  }
  
  // Parte 4: Entrega local (sempre — é diferencial)
  parts.push(`Entrega em Curitiba e região em até 2 dias úteis.`)
  
  // Junta e limita a 160 caracteres (limite do Google)
  let description = parts.join(' ')
  if (description.length > 160) {
    description = description.slice(0, 157) + '...'
  }
  
  return description
}

// ============================================
// SCHEMA.ORG PRODUCT
// ============================================

/**
 * Gera Schema.org Product completo
 * 
 * Inclui campos obrigatórios para rich snippets:
 * - name, description, image, sku, brand
 * - offers (price, availability, shippingDetails)
 * - additionalProperty (compatibilidade TV, material, dimensões)
 */
export function generateProductSchema(product: ProductForSchema, canonicalUrl: string) {
  // Gera H1 e description usando as funções anteriores
  const h1Title = generateProductH1({
    name: product.name,
    tv_max_size: product.tv_max_size,
    category_type: product.category_type as any,
    variant_name: product.variants?.[0]?.name
  })

  const metaDescription = generateProductMetaDescription({
    name: product.name,
    price: product.price,
    tv_max_size: product.tv_max_size,
    assembly_time_minutes: product.assembly_time_minutes,
    category_type: product.category_type
  })

  // Data de validade do preço (1 ano)
  const priceValidUntil = new Date()
  priceValidUntil.setFullYear(priceValidUntil.getFullYear() + 1)

  // Schema base
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": h1Title,
    "description": metaDescription,
    "image": product.images?.map(img => img.url) || [],
    "sku": product.sku || product.slug,
    "mpn": product.sku || product.slug,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Moveirama"
    },
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "priceCurrency": "BRL",
      "price": product.price,
      "priceValidUntil": priceValidUntil.toISOString().split('T')[0],
      "availability": product.stock_quantity > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "Moveirama",
        "url": "https://moveirama.com.br"
      },
      
      // Shipping Details (importante para rich snippets de frete)
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "29.90",
          "currency": "BRL"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "BR",
          "addressRegion": "PR"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 1,
            "unitCode": "d"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "d"
          }
        }
      }
    }
  }

  // Adiciona propriedades específicas de móveis (additionalProperty)
  const additionalProperties = []
  
  if (product.tv_max_size) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Compatibilidade TV",
      "value": `Até ${product.tv_max_size} polegadas`
    })
  }
  
  if (product.main_material) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Material",
      "value": product.main_material
    })
  }
  
  if (product.width && product.height && product.depth) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Dimensões",
      "value": `${product.width}cm x ${product.height}cm x ${product.depth}cm`
    })
  }

  if (additionalProperties.length > 0) {
    schema.additionalProperty = additionalProperties
  }

  return schema
}

// ============================================
// GOOGLE MERCHANT CENTER
// ============================================

/**
 * Gera título para Google Merchant Center
 * Formato: [H1 otimizado] - Moveirama
 * 
 * Exemplo: "Rack Theo para TV até 60 polegadas - Cinamomo/Off White - Moveirama"
 */
export function generateGMCTitle(product: ProductForH1): string {
  const h1 = generateProductH1(product)
  return `${h1} - Moveirama`
}

// ============================================
// HELPERS
// ============================================

/**
 * Infere o tipo de categoria pelo slug ou nome do produto
 * Use isso se não tiver o campo category_type no banco
 */
export function inferCategoryType(slug: string, categorySlug?: string): ProductForH1['category_type'] {
  const slugLower = slug.toLowerCase()
  const catLower = (categorySlug || '').toLowerCase()
  
  if (slugLower.includes('rack') || catLower.includes('rack')) return 'rack'
  if (slugLower.includes('painel') || catLower.includes('painel')) return 'painel'
  if (slugLower.includes('escrivaninha') || catLower.includes('escrivaninha')) return 'escrivaninha'
  if (slugLower.includes('penteadeira') || catLower.includes('penteadeira')) return 'penteadeira'
  if (slugLower.includes('mesa') || catLower.includes('mesa')) return 'mesa'
  
  return null
}
