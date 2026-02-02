// src/lib/seo.ts

/**
 * Moveirama SEO Utilities
 * Funções para gerar H1, meta description, schema.org e FAQ
 * 
 * Versão: 2.15.0 - HowTo Schema para vídeos de montagem
 * 
 * Changelog:
 *   - v2.15 (02/02/2026): HOWTO SCHEMA para vídeos de montagem
 *                         • Nova função generateHowToSchema()
 *                         • Captura buscas "como montar rack", "montagem painel"
 *                         • 259 produtos com vídeo de montagem (179 Artely + 80 Artany)
 *   - v2.9.1 (01/02/2026): FIX: Aceita campos do banco (width_cm, height_cm, depth_cm)
 *                          Normaliza para width/height/depth internamente
 *   - v2.9 (01/02/2026): ESTADO DA ARTE para IAs (Google SGE, Perplexity, ChatGPT)
 *                        • VideoObject no Schema (rich snippet de vídeo)
 *                        • FAQ de comparação ("Qual a diferença do Rack X...")
 *                        • Bairros de Curitiba no FAQ de entrega (autoridade local)
 *                        • Brand = Fabricante (Artely/Artany), Seller = Moveirama (E-E-A-T)
 *                        • "Pronta Entrega" no Title Tag (gatilho de decisão)
 *                        • Campos nativos: material, color no Schema
 *                        • "Sem ferramentas elétricas" na resposta de montagem
 *                        • Meta description com peso suportado (mais específica)
 *   - v2.8 (01/02/2026): Adicionado hasMerchantReturnPolicy no schema Product
 *   - v2.7 (01/02/2026): Title Tag sem duplicação, Meta Description otimizada
 *   - v2.6 (01/02/2026): Nova função generateProductTitle()
 *   - v2.5 (30/01/2026): FAQ montagem detalhada
 *   - v2.4 (30/01/2026): Corrigida FAQ garantia/defeito
 *   - v2.3: Atualizado mapeamentos para nova estrutura de URLs
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
  weight_capacity?: number | null  // ⭐ v2.9: Adicionado para meta description
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
  // ⭐ v2.9: Campos adicionais
  video_product_url?: string | null
  assembly_video_url?: string | null
  weight_capacity?: number | null
}

// FAQ Types
export interface FAQItem {
  question: string
  answer: string
}

// ============================================
// ⭐ v2.9: BAIRROS DE CURITIBA PARA AUTORIDADE LOCAL
// Ordenados por relevância para Classe C/D
// ============================================
const BAIRROS_CURITIBA = [
  'CIC', 'Pinheirinho', 'Sítio Cercado', 'Cajuru', 'Boqueirão',
  'Xaxim', 'Fazendinha', 'Portão', 'Água Verde', 'Capão Raso'
]

// Seleciona 4 bairros aleatórios para variar o conteúdo
function getBairrosAleatorios(quantidade: number = 4): string[] {
  const shuffled = [...BAIRROS_CURITIBA].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, quantidade)
}

// ============================================
// ⭐ v2.4: RESPOSTA PADRÃO PARA FAQ DE GARANTIA
// ============================================
const FAQ_GARANTIA_RESPOSTA = `O móvel tem 3 meses de garantia de fábrica. Caso alguma peça chegue avariada ou apresente defeito, a gente resolve rápido: providenciamos a troca da peça específica para o seu móvel ficar perfeito. Basta mandar uma foto do problema no nosso WhatsApp com o número do pedido.`

// ============================================
// ⭐ v2.9: RESPOSTA PARA FAQ DE MONTAGEM (ATUALIZADA)
// Adicionado "sem ferramentas elétricas" para reduzir barreira
// ============================================
function generateMontageAnswer(difficulty: string | null | undefined, timeMinutes: number | null | undefined): string {
  const difficultyText = difficulty === 'facil' ? 'Fácil' : 
                         difficulty === 'medio' ? 'Médio' : 
                         difficulty === 'dificil' ? 'Difícil' : 'Médio'
  
  const timeText = timeMinutes ? ` (~${timeMinutes}min)` : ''
  
  // ⭐ v2.9: Adicionado "sem ferramentas elétricas"
  return `Nível ${difficultyText}${timeText}. Montagem intuitiva: acompanha manual ilustrado passo a passo e todas as ferragens já vêm separadas e identificadas. Você só precisa de chave de fenda comum — sem ferramentas elétricas. Para facilitar ainda mais, deixamos um vídeo de montagem completo logo acima nesta página.`
}

// ============================================
// H1 OTIMIZADO
// ============================================

export function generateProductH1(product: ProductForH1): string {
  const { name, tv_max_size, category_type, variant_name } = product
  
  const isRackOrPanel = category_type === 'rack' || category_type === 'painel'
  
  if (isRackOrPanel && tv_max_size) {
    const baseName = name.includes(' - ') ? name.split(' - ')[0] : name
    const tvPart = `para TV até ${tv_max_size} polegadas`
    const colorFromName = name.includes(' - ') ? name.split(' - ').slice(1).join(' - ') : null
    const colorPart = variant_name || colorFromName
    
    return colorPart ? `${baseName} ${tvPart} - ${colorPart}` : `${baseName} ${tvPart}`
  }
  
  if (variant_name && !name.includes(variant_name)) {
    return `${name} - ${variant_name}`
  }
  
  return name
}

// ============================================
// ⭐ v2.9: TITLE TAG COM "PRONTA ENTREGA"
// Gatilho de decisão para Curitiba
// ============================================

export function generateProductTitle(product: ProductForH1): string {
  const { name, tv_max_size, category_type, variant_name } = product
  
  const isRackOrPanel = category_type === 'rack' || category_type === 'painel'
  
  const nameParts = name.split(' - ')
  const baseName = nameParts[0]
  const colorFromName = nameParts.length > 1 ? nameParts[1] : null
  
  const color = variant_name || colorFromName
  const shortColor = color ? color.split(' / ')[0].split(' C ')[0].trim() : null
  
  let productPart = ''
  
  if (isRackOrPanel && tv_max_size) {
    productPart = shortColor 
      ? `${baseName} TV ${tv_max_size}" ${shortColor}`
      : `${baseName} TV ${tv_max_size}"`
  } else {
    productPart = shortColor && !baseName.includes(shortColor)
      ? `${baseName} ${shortColor}`
      : baseName
  }
  
  // ⭐ v2.9: Sufixo com "Pronta Entrega" (gatilho de decisão)
  const suffix = "Pronta Entrega Curitiba | Moveirama"
  
  const fullTitle = `${productPart} | ${suffix}`
  
  if (fullTitle.length <= 60) {
    return fullTitle
  }
  
  // Fallback para títulos longos
  if (isRackOrPanel && tv_max_size) {
    return `${baseName} ${tv_max_size}" | ${suffix}`
  }
  
  return `${baseName} | ${suffix}`
}

// ============================================
// ⭐ v2.9: META DESCRIPTION COM PESO SUPORTADO
// Mais específica para IAs
// ============================================

export function generateProductMetaDescription(product: ProductForMeta): string {
  const { name, tv_max_size, category_type, weight_capacity } = product
  
  const nameParts = name.split(' - ')
  const baseName = nameParts[0]
  const colorPart = nameParts.length > 1 ? nameParts[1] : null
  
  const shortColor = colorPart 
    ? colorPart.split(' / ').join('/').replace(' C ', ' ')
    : null
  
  const productName = shortColor ? `${baseName} ${shortColor}` : baseName
  
  // ⭐ v2.9: Benefício mais específico com peso suportado
  let benefit = ''
  
  if ((category_type === 'rack' || category_type === 'painel') && tv_max_size) {
    // Inclui peso suportado se disponível
    const weightText = weight_capacity ? `Suporta ${weight_capacity}kg, ` : ''
    benefit = `Solução para TVs de ${tv_max_size}" em salas compactas. ${weightText}entrega própria em 72h.`
  } else if (category_type === 'escrivaninha') {
    benefit = `Ideal para home office em apartamentos compactos. Entrega própria em 72h.`
  } else if (category_type === 'penteadeira') {
    benefit = `Design funcional para quartos e closets. Entrega própria em 72h.`
  } else if (category_type === 'mesa') {
    benefit = `Praticidade para sala ou escritório. Entrega própria em 72h.`
  } else {
    benefit = `Móvel com ótimo custo-benefício. Entrega própria em 72h.`
  }
  
  // ⭐ v2.9: CTA direto
  const cta = `Garanta o seu na Moveirama!`
  
  let description = `${productName}: ${benefit} ${cta}`
  
  // Limita a 155 caracteres
  if (description.length > 155) {
    if ((category_type === 'rack' || category_type === 'painel') && tv_max_size) {
      benefit = `Para TVs de ${tv_max_size}" em espaços compactos. Entrega em 72h.`
    } else {
      benefit = `Móvel prático. Entrega em 72h.`
    }
    description = `${productName}: ${benefit} ${cta}`
  }
  
  if (description.length > 155) {
    description = `${baseName}: ${benefit} ${cta}`
  }
  
  return description
}

// ============================================
// ⭐ v2.9: SCHEMA.ORG PRODUCT (ESTADO DA ARTE)
// - VideoObject para rich snippets de vídeo
// - Brand = Fabricante (Artely/Artany)
// - Seller = Moveirama (E-E-A-T)
// - Material e Color como campos nativos
// ============================================

export function generateProductSchema(product: ProductForSchema, canonicalUrl: string) {
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
    category_type: product.category_type,
    weight_capacity: product.weight_capacity
  })

  const priceValidUntil = new Date()
  priceValidUntil.setFullYear(priceValidUntil.getFullYear() + 1)

  // ⭐ v2.9: Extrai cor do nome do produto ou variante
  const colorFromName = product.name.includes(' - ') 
    ? product.name.split(' - ').slice(1).join(' / ') 
    : null
  const productColor = product.variants?.[0]?.name || colorFromName

  // Schema base
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": h1Title,
    "description": metaDescription,
    "image": product.images?.map(img => img.url) || [],
    "sku": product.sku || product.slug,
    "mpn": product.sku || product.slug,
    
    // ⭐ v2.9: Brand = Fabricante (Artely ou Artany) para E-E-A-T
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Moveirama"
    },
    
    // ⭐ v2.9: Material como campo nativo (facilita filtragem por IAs)
    ...(product.main_material && {
      "material": product.main_material
    }),
    
    // ⭐ v2.9: Cor como campo nativo
    ...(productColor && {
      "color": productColor
    }),
    
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
      
      // ⭐ v2.9: Seller = Moveirama (diferente de Brand)
      "seller": {
        "@type": "Organization",
        "name": "Moveirama",
        "url": "https://moveirama.com.br"
      },
      
      // Política de Devolução
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "BR",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 7,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      },
      
      // Detalhes de Frete
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
            "maxValue": 3,
            "unitCode": "d"
          }
        }
      }
    }
  }

  // Propriedades adicionais específicas de móveis
  const additionalProperties = []
  
  if (product.tv_max_size) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Compatibilidade TV",
      "value": `Até ${product.tv_max_size} polegadas`
    })
  }
  
  if (product.weight_capacity) {
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Peso Suportado",
      "value": `${product.weight_capacity} kg`
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
// ⭐ v2.9: SCHEMA VIDEOOBJECT
// Rich snippet de vídeo no Google
// ============================================

export function generateVideoSchema(
  videoUrl: string,
  productName: string,
  thumbnailUrl?: string
) {
  // Extrai ID do YouTube se for URL do YouTube
  const youtubeMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  const videoId = youtubeMatch ? youtubeMatch[1] : null
  
  // Thumbnail padrão do YouTube ou fornecido
  const thumbnail = thumbnailUrl || (videoId 
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : undefined)

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": `${productName} - Vídeo do Produto | Moveirama`,
    "description": `Veja o ${productName} em detalhes. Móvel para Curitiba e Região Metropolitana com entrega própria em até 72h.`,
    "thumbnailUrl": thumbnail,
    "uploadDate": new Date().toISOString().split('T')[0],
    "contentUrl": videoUrl,
    "embedUrl": videoId ? `https://www.youtube.com/embed/${videoId}` : videoUrl,
    "publisher": {
      "@type": "Organization",
      "name": "Moveirama",
      "logo": {
        "@type": "ImageObject",
        "url": "https://moveirama.com.br/logo/moveirama-grafite.svg"
      }
    }
  }
}

// ============================================
// ⭐ v2.15: SCHEMA HOWTO (Vídeo de Montagem)
// Rich snippet "Como fazer" no Google
// Captura buscas: "como montar rack", "montagem painel TV"
// ============================================

export function generateHowToSchema(
  assemblyVideoUrl: string,
  productName: string,
  assemblyTimeMinutes: number | null | undefined,
  assemblyDifficulty: string | null | undefined
) {
  // Extrai ID do YouTube
  const youtubeMatch = assemblyVideoUrl.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/
  )
  const videoId = youtubeMatch ? youtubeMatch[1] : null
  
  // Thumbnail do YouTube
  const thumbnail = videoId 
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : undefined

  // Formata tempo ISO 8601 (PT30M = 30 minutos)
  const totalTime = assemblyTimeMinutes ? `PT${assemblyTimeMinutes}M` : 'PT45M'
  
  // Texto de dificuldade para descrição
  const difficultyText = assemblyDifficulty === 'facil' ? 'fácil' : 
                         assemblyDifficulty === 'dificil' ? 'difícil' : 'médio'

  // Nome base do produto (sem cor)
  const baseName = productName.includes(' - ') 
    ? productName.split(' - ')[0] 
    : productName

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `Como montar o ${baseName}`,
    "description": `Passo a passo de montagem do ${baseName}. Nível ${difficultyText}, tempo estimado: ${assemblyTimeMinutes || 45} minutos. Não precisa de ferramentas elétricas.`,
    "totalTime": totalTime,
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "BRL",
      "value": "0"
    },
    "tool": [
      { "@type": "HowToTool", "name": "Chave Phillips" },
      { "@type": "HowToTool", "name": "Martelo de borracha (opcional)" }
    ],
    "supply": [
      { "@type": "HowToSupply", "name": "Manual de instruções (incluso)" },
      { "@type": "HowToSupply", "name": "Kit de ferragens (incluso)" }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Confira as peças",
        "text": "Abra a embalagem e confira todas as peças e ferragens usando a lista do manual. Se faltar algo, entre em contato pelo WhatsApp antes de começar.",
        "image": thumbnail
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Assista o vídeo completo",
        "text": "Antes de começar a montar, assista o vídeo de montagem completo para entender o processo. Isso evita erros e retrabalho.",
        "url": assemblyVideoUrl
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Organize o espaço",
        "text": "Escolha um local amplo e plano para a montagem. Separe as peças por tamanho e deixe as ferragens organizadas."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Siga o manual passo a passo",
        "text": "Monte seguindo a ordem do manual ilustrado. Use o vídeo como referência visual para cada etapa."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Finalize e posicione",
        "text": `Após a montagem, posicione o ${baseName} no local definitivo. Se precisar fixar na parede, siga as instruções específicas do manual.`
      }
    ],
    "video": {
      "@type": "VideoObject",
      "name": `Vídeo de Montagem - ${baseName} | Moveirama`,
      "description": `Como montar o ${baseName} passo a passo. Nível ${difficultyText}, aproximadamente ${assemblyTimeMinutes || 45} minutos. Móvel para Curitiba e Região Metropolitana.`,
      "thumbnailUrl": thumbnail,
      "contentUrl": assemblyVideoUrl,
      "embedUrl": videoId ? `https://www.youtube.com/embed/${videoId}` : assemblyVideoUrl,
      "uploadDate": new Date().toISOString().split('T')[0],
      "duration": totalTime,
      "publisher": {
        "@type": "Organization",
        "name": "Moveirama",
        "logo": {
          "@type": "ImageObject",
          "url": "https://moveirama.com.br/logo/moveirama-grafite.svg"
        }
      }
    }
  }
}

// ============================================
// FAQ SCHEMA
// ============================================

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
// ⭐ v2.9: FAQ PARA RACKS/PAINÉIS (ESTADO DA ARTE)
// - Pergunta de comparação (snippable por IAs)
// - Bairros de Curitiba na entrega
// - Resistência à umidade
// ============================================

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
  thickness_mm?: number | null  // ⭐ v2.9: Para FAQ de comparação
}): FAQItem[] {
  const faqs: FAQItem[] = []
  
  const baseName = product.name.includes(' - ') ? product.name.split(' - ')[0] : product.name
  
  // 1. Compatibilidade TV (dúvida #1)
  if (product.tv_max_size) {
    faqs.push({
      question: `O ${baseName} serve para TV de quantas polegadas?`,
      answer: `Serve para TV de até ${product.tv_max_size} polegadas.${product.width ? ` Largura total de ${product.width}cm.` : ''} Antes de comprar, confira se a base da sua TV cabe no tampo.`
    })
  }
  
  // 2. Medidas (dúvida #2 - "vai caber?")
  if (product.width && product.height && product.depth) {
    faqs.push({
      question: `Quais são as medidas do ${baseName}?`,
      answer: `As dimensões são: ${product.width}cm de largura × ${product.height}cm de altura × ${product.depth}cm de profundidade. Meça o espaço antes de comprar - se precisar de ajuda, chama no WhatsApp.`
    })
  }
  
  // ⭐ v2.9: NOVA - Pergunta de COMPARAÇÃO (snippable por IAs)
  if (product.width && product.depth && product.thickness_mm) {
    const larguraMetros = (product.width / 100).toFixed(1).replace('.', ',')
    faqs.push({
      question: `Qual a diferença do ${baseName} para outros racks de ${larguraMetros}m?`,
      answer: `O diferencial do ${baseName} é o tampo de ${product.thickness_mm}mm e a profundidade de ${product.depth}cm, ideal para não obstruir a passagem em salas pequenas de Curitiba. ${product.weight_capacity ? `Suporta até ${product.weight_capacity}kg, ` : ''}material resistente à umidade local.`
    })
  }
  
  // 3. Montagem - v2.9: "sem ferramentas elétricas"
  faqs.push({
    question: `É difícil montar o ${baseName}?`,
    answer: generateMontageAnswer(product.assembly_difficulty, product.assembly_time_minutes)
  })
  
  // 4. Material - v2.9: Resistência à umidade de Curitiba
  if (product.main_material) {
    faqs.push({
      question: `Qual o material do ${baseName}?`,
      answer: `${product.main_material}${product.thickness_mm ? ` de ${product.thickness_mm}mm` : ''}, com acabamento em pintura UV que protege da umidade característica de Curitiba. Fácil de limpar - só passar pano úmido.`
    })
  }
  
  // 5. Peso suportado
  if (product.weight_capacity) {
    faqs.push({
      question: `Quanto peso o ${baseName} aguenta?`,
      answer: `Suporta até ${product.weight_capacity}kg no tampo. Suficiente para a maioria das TVs LED/OLED do mercado, incluindo soundbar e aparelhos de streaming.`
    })
  }
  
  // 6. Precisa furar parede?
  faqs.push({
    question: `Precisa furar a parede para instalar o ${baseName}?`,
    answer: product.requires_wall_mount 
      ? `Sim, recomendamos fixar na parede por segurança. Buchas e parafusos de fixação acompanham o produto.`
      : `Não precisa furar. O rack fica apoiado no chão, sem necessidade de fixação na parede - ideal para apartamentos alugados.`
  })
  
  // ⭐ v2.9: Entrega com BAIRROS (Autoridade Local)
  const bairros = getBairrosAleatorios(4)
  faqs.push({
    question: `Qual o prazo de entrega para Curitiba?`,
    answer: `Entrega própria em até 72h para Curitiba (${bairros.join(', ')} e todos os bairros) e Região Metropolitana. Frota própria - a gente conhece as ruas da cidade e cuida do seu móvel.`
  })
  
  // 8. Garantia
  faqs.push({
    question: `E se chegar com defeito?`,
    answer: FAQ_GARANTIA_RESPOSTA
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
  
  const baseName = product.name.includes(' - ') ? product.name.split(' - ')[0] : product.name
  
  // 1. Medidas
  if (product.width && product.height && product.depth) {
    faqs.push({
      question: `Quais são as medidas da ${baseName}?`,
      answer: `${product.width}cm de largura × ${product.height}cm de altura × ${product.depth}cm de profundidade. Ideal para cantinhos de home office em apartamento.`
    })
  }
  
  // 2. Cabe notebook + monitor?
  if (product.width) {
    const cabeMonitor = product.width >= 90
    faqs.push({
      question: `Cabe notebook e monitor na ${baseName}?`,
      answer: cabeMonitor 
        ? `Sim! Com ${product.width}cm de largura, cabe notebook + monitor lado a lado tranquilamente.`
        : `Para notebook, cabe bem. Se quiser adicionar monitor externo, pode precisar de um suporte articulado.`
    })
  }
  
  // 3. Montagem - v2.9
  faqs.push({
    question: `É difícil montar a ${baseName}?`,
    answer: generateMontageAnswer(product.assembly_difficulty, product.assembly_time_minutes)
  })
  
  // 4. Material
  if (product.main_material) {
    faqs.push({
      question: `Qual o material da ${baseName}?`,
      answer: `${product.main_material}. Resistente à umidade de Curitiba e fácil de limpar.`
    })
  }
  
  // ⭐ v2.9: Entrega com bairros
  const bairros = getBairrosAleatorios(4)
  faqs.push({
    question: `Qual o prazo de entrega para Curitiba?`,
    answer: `Entrega própria em até 72h para Curitiba (${bairros.join(', ')} e região) e RMC.`
  })
  
  // 6. Garantia
  faqs.push({
    question: `E se chegar com defeito?`,
    answer: FAQ_GARANTIA_RESPOSTA
  })
  
  return faqs
}

// ============================================
// GOOGLE MERCHANT CENTER
// ============================================

export function generateGMCTitle(product: ProductForH1): string {
  const h1 = generateProductH1(product)
  return `${h1} - Moveirama`
}

// ============================================
// HELPERS
// ============================================

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

export function generateProductFAQs(product: {
  name: string
  slug: string
  tv_max_size?: number | null
  // Aceita ambos: width ou width_cm (compatibilidade)
  width?: number | null
  width_cm?: number | null
  height?: number | null
  height_cm?: number | null
  depth?: number | null
  depth_cm?: number | null
  assembly_time_minutes?: number | null
  assembly_difficulty?: string | null
  main_material?: string | null
  weight_capacity?: number | null
  requires_wall_mount?: boolean | null
  thickness_mm?: number | null
}, categorySlug?: string): FAQItem[] {
  const categoryType = inferCategoryType(product.slug, categorySlug)
  
  const baseName = product.name.includes(' - ') ? product.name.split(' - ')[0] : product.name
  
  // ⭐ v2.9.1: Normaliza campos (aceita width ou width_cm)
  const normalizedProduct = {
    ...product,
    width: product.width ?? product.width_cm,
    height: product.height ?? product.height_cm,
    depth: product.depth ?? product.depth_cm
  }
  
  if (categoryType === 'rack' || categoryType === 'painel') {
    return generateRackFAQs(normalizedProduct)
  }
  
  if (categoryType === 'escrivaninha') {
    return generateEscrivaninhaFAQs(normalizedProduct)
  }
  
  // Fallback: FAQs genéricas
  const bairros = getBairrosAleatorios(3)
  return [
    {
      question: `Qual o prazo de entrega do ${baseName}?`,
      answer: `Entrega própria em até 72h para Curitiba (${bairros.join(', ')} e região) e RMC.`
    },
    {
      question: `É difícil montar o ${baseName}?`,
      answer: generateMontageAnswer(product.assembly_difficulty, product.assembly_time_minutes)
    },
    {
      question: `E se chegar com defeito?`,
      answer: FAQ_GARANTIA_RESPOSTA
    }
  ]
}

// ============================================
// SEO PARA CATEGORIAS (LISTAGEM)
// ============================================

const CATEGORY_SEO_NAMES: Record<string, string> = {
  // MÓVEIS PARA CASA
  'racks-tv': 'Racks para TV',
  'paineis-tv': 'Painéis para TV',
  'mesas-centro': 'Mesas de Centro',
  'mesas-apoio': 'Mesas de Apoio',
  'buffets': 'Buffets',
  'estantes': 'Estantes',
  'aparadores': 'Aparadores',
  'cantinhos': 'Cantinhos',
  'bares': 'Bares',
  'carrinhos': 'Carrinhos',
  'cristaleiras': 'Cristaleiras',
  'espelhos': 'Espelhos',
  'prateleiras': 'Prateleiras',
  'penteadeiras': 'Penteadeiras',
  
  // MÓVEIS PARA ESCRITÓRIO - Home Office
  'escrivaninha-home-office': 'Escrivaninhas para Home Office',
  'escrivaninha-l-home-office': 'Escrivaninhas em L para Home Office',
  'estante-home-office': 'Estantes para Home Office',
  'gaveteiro-home-office': 'Gaveteiros para Home Office',
  'mesa-balcao-home-office': 'Mesas e Balcões para Home Office',
  
  // MÓVEIS PARA ESCRITÓRIO - Linha Profissional
  'mesa-reta': 'Mesas Retas para Escritório',
  'mesa-em-l': 'Mesas em L para Escritório',
  'mesa-reuniao': 'Mesas de Reunião',
  'balcao-profissional': 'Balcões Profissionais',
  'balcao-atendimento': 'Balcões de Atendimento',
  'armario-profissional': 'Armários para Escritório',
  'prateleira-profissional': 'Prateleiras para Escritório',
  'estante-profissional': 'Estantes Profissionais',
  
  // CATEGORIAS PAI
  'moveis-para-casa': 'Móveis para Casa',
  'moveis-para-escritorio': 'Móveis para Escritório',
}

export function generateCategoryH1(
  categoryName: string,
  categorySlug: string
): string {
  const seoName = CATEGORY_SEO_NAMES[categorySlug] || categoryName
  return `${seoName} em Curitiba e Região Metropolitana`
}

export function generateCategoryTitle(
  categoryName: string,
  categorySlug: string
): string {
  const seoName = CATEGORY_SEO_NAMES[categorySlug] || categoryName
  return `${seoName} em Curitiba e RMC | Moveirama`
}

export function generateCategoryMetaDescription(
  categoryName: string,
  categorySlug: string,
  productCount?: number
): string {
  const seoName = CATEGORY_SEO_NAMES[categorySlug] || categoryName
  const seoNameLower = seoName.toLowerCase()
  
  const isRackOrPainel = ['racks-tv', 'paineis-tv'].includes(categorySlug)
  const isEscrivaninha = categorySlug.includes('escrivaninha')
  const isHomeOffice = categorySlug.includes('home-office')
  const isProfissional = categorySlug.includes('profissional') || 
                         ['mesa-reta', 'mesa-em-l', 'mesa-reuniao', 'balcao-atendimento'].includes(categorySlug)
  
  if (isRackOrPainel) {
    return `Confira ${seoNameLower} em Curitiba e Região Metropolitana. Modelos para TV de 32" a 75", compactos e modernos. Entrega própria em até 72h. Compre móveis na caixa sem dor de cabeça.`
  }
  
  if (isEscrivaninha || isHomeOffice) {
    return `${seoName} em Curitiba e RMC com entrega rápida. Modelos compactos ideais para apartamentos pequenos. Frota própria, entrega em até 72h. Monte seu home office sem stress.`
  }
  
  if (isProfissional) {
    return `${seoName} em Curitiba e Região Metropolitana. Móveis robustos para escritórios e empresas. Entrega própria em até 72h. Qualidade profissional com preço justo.`
  }
  
  const countText = productCount ? `${productCount} opções de ` : ''
  return `${countText}${seoNameLower} em Curitiba e Região Metropolitana. Preço justo, entrega própria em até 72h. Móveis na caixa com montagem fácil e suporte no WhatsApp.`
}

export function generateCategoryFAQs(
  categoryName: string,
  categorySlug: string
): FAQItem[] {
  const seoName = CATEGORY_SEO_NAMES[categorySlug] || categoryName
  const seoNameLower = seoName.toLowerCase()
  
  // ⭐ v2.9: Bairros nas FAQs de categoria
  const bairros = getBairrosAleatorios(5)
  
  const faqs: FAQItem[] = [
    {
      question: `Quais cidades vocês entregam ${seoNameLower}?`,
      answer: `Entregamos em Curitiba (${bairros.join(', ')} e todos os bairros) e Região Metropolitana: São José dos Pinhais, Colombo, Araucária, Pinhais e Fazenda Rio Grande. Frota própria para entrega rápida e cuidadosa.`
    },
    {
      question: `Qual o prazo de entrega para ${seoNameLower} em Curitiba?`,
      answer: `Para Curitiba e região metropolitana, o prazo é de até 72h após confirmação do pagamento. Entregamos com frota própria, sem depender de transportadoras.`
    },
    {
      question: `Vocês montam os ${seoNameLower}?`,
      answer: `Sim! Oferecemos serviço de montagem em Curitiba e algumas cidades da RMC. O valor é informado no momento da compra. Se preferir montar sozinho, todos os produtos vêm com manual e ferragens completas - sem precisar de ferramentas elétricas.`
    },
    {
      question: `Os ${seoNameLower} vêm montados ou na caixa?`,
      answer: `Nossos móveis vêm na caixa, desmontados. Isso garante preço mais baixo e protege o produto durante o transporte. Cada peça vem com manual ilustrado e todas as ferragens necessárias.`
    },
    {
      question: `E se o móvel chegar com defeito?`,
      answer: FAQ_GARANTIA_RESPOSTA
    }
  ]
  
  if (['racks-tv', 'paineis-tv'].includes(categorySlug)) {
    faqs.splice(2, 0, {
      question: `Os ${seoNameLower} acompanham suporte de TV?`,
      answer: `A maioria dos modelos não inclui o suporte de TV. Cada página de produto informa se o suporte está incluso. Painéis geralmente precisam de suporte articulado (vendido separadamente).`
    })
  }
  
  if (categorySlug.includes('escrivaninha')) {
    faqs.splice(2, 0, {
      question: `As ${seoNameLower} cabem em apartamentos pequenos?`,
      answer: `Sim! Temos modelos compactos ideais para apartamentos. Cada página mostra as medidas exatas. Dica: meça seu espaço antes de comprar e, se tiver dúvida, chama no WhatsApp.`
    })
  }
  
  if (categorySlug.includes('profissional') || ['mesa-reta', 'mesa-em-l', 'mesa-reuniao', 'balcao-atendimento'].includes(categorySlug)) {
    faqs.splice(2, 0, {
      question: `Vocês vendem para empresas e escritórios?`,
      answer: `Sim! Atendemos tanto pessoas físicas quanto empresas. Para pedidos maiores ou orçamentos personalizados, entre em contato pelo WhatsApp.`
    })
  }
  
  return faqs
}

export function getCategorySeoName(categorySlug: string): string {
  return CATEGORY_SEO_NAMES[categorySlug] || categorySlug
}
