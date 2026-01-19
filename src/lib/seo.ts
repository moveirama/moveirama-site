// src/lib/seo.ts

/**
 * Moveirama SEO Utilities
 * Funções para gerar H1, meta description, schema.org e FAQ
 * 
 * Versão: 2.0 — Supremacia SEO & FAQ
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

// 🆕 V2: FAQ Types
export interface FAQItem {
  question: string
  answer: string
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
    const tvPart = `para TV até ${tv_max_size} polegadas`
    const colorPart = variant_name ? ` - ${variant_name}` : ''
    return `${name} ${tvPart}${colorPart}`
  }
  
  // Para outros produtos, manter nome + variante
  if (variant_name) {
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
 * V2: Inclui "Região Metropolitana" e "Sem Juros" (gatilhos de confiança local)
 * 
 * Exemplo:
 * "Rack Theo para TV até 60". R$ 269,00 à vista ou 5x R$ 53,80 sem juros. 
 * Montagem em ~45min. Entrega em Curitiba e Região Metropolitana em até 2 dias."
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
  
  // Parte 2: Preço e parcelamento (V2: "sem juros" explícito)
  parts.push(`R$ ${priceFormatted} à vista ou ${parcelas}x R$ ${valorParcela} sem juros.`)
  
  // Parte 3: Montagem (se disponível)
  if (assembly_time_minutes) {
    parts.push(`Montagem em ~${assembly_time_minutes}min.`)
  }
  
  // Parte 4: Entrega local (V2: "Região Metropolitana" para SEO local)
  parts.push(`Entrega em Curitiba e Região Metropolitana em até 2 dias.`)
  
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
    category_type: product.category_type as ProductForH1['category_type'],
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
  const schema: Record<string, unknown> = {
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
// 🆕 V2: FAQ SCHEMA
// ============================================

/**
 * Gera Schema.org FAQPage
 * 
 * Obrigatório para aparecer como rich snippet de FAQ no Google
 * O Google exibirá as perguntas diretamente nos resultados de busca
 * 
 * @param faqs Array de perguntas e respostas
 * @returns Schema FAQPage formatado para JSON-LD
 */
export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}

// ============================================
// 🆕 V2: FAQ TEMPLATES POR CATEGORIA
// ============================================

/**
 * Gera FAQs dinâmicas para racks/painéis
 * Baseado no VOC (Voice of Customer) de Curitiba
 */
export function generateRackFAQs(product: {
  name: string
  tv_max_size?: number | null
  width?: number | null
  height?: number | null
  depth?: number | null
  assembly_time_minutes?: number | null
  assembly_difficulty?: string | null
  main_material?: string | null
  weight_capacity?: number | null
  requires_wall_mount?: boolean | null
}): FAQItem[] {
  const faqs: FAQItem[] = []
  
  // 1. Compatibilidade TV (dúvida #1 do público)
  if (product.tv_max_size) {
    faqs.push({
      question: `O ${product.name} serve para TV de quantas polegadas?`,
      answer: `Serve para TV de até ${product.tv_max_size} polegadas.${product.width ? ` Largura total de ${product.width}cm.` : ''} Antes de comprar, confira se a base da sua TV cabe no tampo.`
    })
  }
  
  // 2. Medidas (dúvida #2 — "vai caber?")
  if (product.width && product.height && product.depth) {
    faqs.push({
      question: `Quais são as medidas do ${product.name}?`,
      answer: `As dimensões são: ${product.width}cm de largura × ${product.height}cm de altura × ${product.depth}cm de profundidade. Meça o espaço antes de comprar — se precisar de ajuda, chama no WhatsApp.`
    })
  }
  
  // 3. Montagem (dúvida #3 — medo de não conseguir)
  const difficultyText = product.assembly_difficulty === 'facil' ? 'Fácil' : 
                         product.assembly_difficulty === 'medio' ? 'Médio' : 
                         product.assembly_difficulty === 'dificil' ? 'Difícil' : 'Médio'
  if (product.assembly_time_minutes) {
    faqs.push({
      question: `É difícil montar o ${product.name}?`,
      answer: `Nível ${difficultyText} (~${product.assembly_time_minutes}min). Acompanha manual ilustrado e kit completo de ferragens. Se travar em algum passo, manda foto no WhatsApp que a gente ajuda.`
    })
  }
  
  // 4. Material (dúvida sobre qualidade)
  if (product.main_material) {
    faqs.push({
      question: `Qual o material do ${product.name}?`,
      answer: `${product.main_material} de alta durabilidade. Material resistente à umidade de Curitiba e fácil de limpar — só passar pano úmido.`
    })
  }
  
  // 5. Peso suportado
  if (product.weight_capacity) {
    faqs.push({
      question: `Quanto peso o ${product.name} aguenta?`,
      answer: `Suporta até ${product.weight_capacity}kg no tampo. Suficiente para a maioria das TVs LED/OLED do mercado.`
    })
  }
  
  // 6. Precisa furar parede?
  faqs.push({
    question: `Precisa furar a parede para instalar o ${product.name}?`,
    answer: product.requires_wall_mount 
      ? `Sim, recomendamos fixar na parede por segurança. Buchas e parafusos de fixação acompanham o produto.`
      : `Não precisa furar. O rack fica apoiado no chão, sem necessidade de fixação na parede.`
  })
  
  // 7. Entrega (diferencial local — SEMPRE incluir)
  faqs.push({
    question: `Qual o prazo de entrega para Curitiba?`,
    answer: `Entrega própria em Curitiba e Região Metropolitana em até 2 dias úteis. Frota própria — a gente conhece as ruas da cidade e cuida do seu móvel.`
  })
  
  // 8. Garantia e troca
  faqs.push({
    question: `E se chegar com defeito ou eu me arrepender?`,
    answer: `Garantia do fabricante + 7 dias para arrependimento (direito do consumidor). Chegou com problema? Manda foto no WhatsApp com número do pedido que a gente resolve rápido.`
  })
  
  return faqs
}

/**
 * Gera FAQs dinâmicas para escrivaninhas
 */
export function generateEscrivaninhaFAQs(product: {
  name: string
  width?: number | null
  height?: number | null
  depth?: number | null
  assembly_time_minutes?: number | null
  assembly_difficulty?: string | null
  main_material?: string | null
  weight_capacity?: number | null
}): FAQItem[] {
  const faqs: FAQItem[] = []
  
  // 1. Medidas
  if (product.width && product.height && product.depth) {
    faqs.push({
      question: `Quais são as medidas da ${product.name}?`,
      answer: `${product.width}cm de largura × ${product.height}cm de altura × ${product.depth}cm de profundidade. Ideal para cantinhos de home office em apartamento.`
    })
  }
  
  // 2. Cabe notebook + monitor?
  if (product.width) {
    const cabeMonitor = product.width >= 90
    faqs.push({
      question: `Cabe notebook e monitor na ${product.name}?`,
      answer: cabeMonitor 
        ? `Sim! Com ${product.width}cm de largura, cabe notebook + monitor lado a lado tranquilamente.`
        : `Para notebook, cabe bem. Se quiser adicionar monitor externo, pode precisar de um suporte articulado.`
    })
  }
  
  // 3. Montagem
  const difficultyText = product.assembly_difficulty === 'facil' ? 'Fácil' : 
                         product.assembly_difficulty === 'medio' ? 'Médio' : 'Médio'
  if (product.assembly_time_minutes) {
    faqs.push({
      question: `É difícil montar a ${product.name}?`,
      answer: `Nível ${difficultyText} (~${product.assembly_time_minutes}min). Vem com manual e ferragens. Dúvida na montagem? WhatsApp.`
    })
  }
  
  // 4. Material
  if (product.main_material) {
    faqs.push({
      question: `Qual o material da ${product.name}?`,
      answer: `${product.main_material}. Resistente e fácil de limpar.`
    })
  }
  
  // 5. Entrega
  faqs.push({
    question: `Qual o prazo de entrega para Curitiba?`,
    answer: `Entrega própria em Curitiba e Região Metropolitana em até 2 dias úteis.`
  })
  
  // 6. Garantia
  faqs.push({
    question: `E se chegar com defeito?`,
    answer: `Garantia do fabricante + 7 dias para arrependimento. Problema? WhatsApp.`
  })
  
  return faqs
}

// ============================================
// GOOGLE MERCHANT CENTER
// ============================================

/**
 * Gera título para Google Merchant Center
 * Formato: [H1 otimizado] - Moveirama
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

/**
 * Gera FAQs automáticas baseado no tipo de produto
 */
export function generateProductFAQs(product: {
  name: string
  slug: string
  tv_max_size?: number | null
  width?: number | null
  height?: number | null
  depth?: number | null
  assembly_time_minutes?: number | null
  assembly_difficulty?: string | null
  main_material?: string | null
  weight_capacity?: number | null
  requires_wall_mount?: boolean | null
}, categorySlug?: string): FAQItem[] {
  const categoryType = inferCategoryType(product.slug, categorySlug)
  
  if (categoryType === 'rack' || categoryType === 'painel') {
    return generateRackFAQs(product)
  }
  
  if (categoryType === 'escrivaninha') {
    return generateEscrivaninhaFAQs(product)
  }
  
  // Fallback: FAQs genéricas
  return [
    {
      question: `Qual o prazo de entrega do ${product.name}?`,
      answer: `Entrega própria em Curitiba e Região Metropolitana em até 2 dias úteis.`
    },
    {
      question: `É difícil montar o ${product.name}?`,
      answer: `Vem com manual e ferragens. Dúvida? WhatsApp.`
    },
    {
      question: `E se chegar com defeito?`,
      answer: `Garantia do fabricante + 7 dias para arrependimento.`
    }
  ]
}
