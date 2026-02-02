// src/lib/seo.ts

/**
 * Moveirama SEO Utilities
 * Versão: 3.2.3 - Remove peso suportado de racks/painéis (confunde cliente)
 * 
 * Changelog:
 *   - v3.2.3 (02/02/2026): PESO SUPORTADO (racks/painéis)
 *                        • Removido FAQ "Quanto peso aguenta?" para racks/painéis
 *                        • Removido menção de peso nas FAQs de comparação
 *                        • Motivo: peso se refere à prateleira, não ao tampo da TV
 *   - v3.2.2 (02/02/2026): SEMÂNTICA DE ESCALA (somente Artely)
 *                        • Móveis ≥160cm: "fluidez", "visual imponente", "ambientes integrados"
 *                        • Móveis <160cm: "otimização de espaço", "salas compactas"
 *                        • Bairros premium para móveis grandes Artely
 *   - v3.2.1 (02/02/2026): FIX: FAQ usa "painéis" ou "racks" baseado no nome
 *   - v3.2 (02/02/2026): Lógica por atributos (Tamburato 50mm)
 */

// ============================================
// TYPES
// ============================================

interface ProductForH1 {
  name: string
  tv_max_size?: number | null
  category_type?: CategoryType | null
  variant_name?: string | null
}

interface ProductForMeta {
  name: string
  price: number
  tv_max_size?: number | null
  assembly_time_minutes?: number | null
  category_type?: string | null
  weight_capacity?: number | null
  thickness_mm?: number | null
  supplier_id?: string | null
  depth?: number | null
  depth_cm?: number | null
  width?: number | null
  width_cm?: number | null
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
  video_product_url?: string | null
  assembly_video_url?: string | null
  weight_capacity?: number | null
  supplier_id?: string | null
  thickness_mm?: number | null
}

export interface FAQItem {
  question: string
  answer: string
}

type CategoryType = 
  | 'rack' | 'painel' | 'buffet' | 'aparador' | 'estante' | 'cristaleira'
  | 'mesa-centro' | 'mesa-apoio' | 'bar' | 'carrinho' | 'cantinho'
  | 'penteadeira' | 'prateleira' | 'espelho'
  | 'escrivaninha' | 'escrivaninha-l' | 'estante-home' | 'gaveteiro-home' | 'mesa-balcao-home'
  | 'mesa-reta' | 'mesa-em-l' | 'mesa-reuniao' | 'balcao-atendimento' | 'balcao-profissional'
  | 'armario-profissional' | 'estante-profissional' | 'prateleira-profissional' | 'estacao'

type EnvironmentType = 'casa' | 'escritorio-home' | 'escritorio-pro'

type SupplierProfile = {
  name: 'Artely' | 'Artany'
  id: string
  focus: string
  valueProposition: string
  metaPrefix: string
  targetAudience: string
}

// ============================================
// CONSTANTES
// ============================================

const SUPPLIER_IDS = {
  ARTELY: '5c34ee22-445a-45ac-bec7-e9ac3a1a2b04',
  ARTANY: 'f2f7a7d0-68d0-4e0a-aac7-293780d1bf4d'
} as const

const SUPPLIER_PROFILES: Record<string, SupplierProfile> = {
  [SUPPLIER_IDS.ARTELY]: {
    name: 'Artely',
    id: SUPPLIER_IDS.ARTELY,
    focus: 'residencial',
    valueProposition: 'acabamento sofisticado com Pintura UV e bordas em PVC',
    metaPrefix: 'Design elegante para sua casa',
    targetAudience: 'casas e apartamentos'
  },
  [SUPPLIER_IDS.ARTANY]: {
    name: 'Artany',
    id: SUPPLIER_IDS.ARTANY,
    focus: 'profissional',
    valueProposition: 'estrutura reforçada para uso intenso em escritórios',
    metaPrefix: 'Padrão profissional corporativo',
    targetAudience: 'escritórios e empresas'
  }
}

const BAIRROS_RESIDENCIAIS = [
  'CIC', 'Pinheirinho', 'Sítio Cercado', 'Cajuru', 'Boqueirão',
  'Xaxim', 'Fazendinha', 'Portão', 'Capão Raso', 'Tatuquara'
]

const BAIRROS_COMERCIAIS = [
  'Batel', 'Centro Cívico', 'Bigorrilho', 'Água Verde', 'Centro',
  'Rebouças', 'Alto da XV', 'Champagnat', 'CIC', 'Prado Velho'
]

// v3.2.2: Bairros premium para móveis grandes Artely
const BAIRROS_PREMIUM = [
  'Batel', 'Cabral', 'Ecoville', 'Juvevê', 'Água Verde',
  'Bigorrilho', 'Alto da Glória', 'Champagnat', 'Alto da XV', 'Mercês'
]

const FAQ_GARANTIA_RESPOSTA = `O móvel tem 3 meses de garantia de fábrica. Caso alguma peça chegue avariada ou apresente defeito, a gente resolve rápido: providenciamos a troca da peça específica para o seu móvel ficar perfeito. Basta mandar uma foto do problema no nosso WhatsApp com o número do pedido.`

// ============================================
// HELPERS
// ============================================

function getBairrosPorContexto(environment: EnvironmentType, quantidade: number = 4): string[] {
  const bairros = environment === 'casa' ? BAIRROS_RESIDENCIAIS : BAIRROS_COMERCIAIS
  const shuffled = [...bairros].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, quantidade)
}

function getBairrosAleatorios(quantidade: number = 4): string[] {
  const allBairros = [...new Set([...BAIRROS_RESIDENCIAIS, ...BAIRROS_COMERCIAIS])]
  const shuffled = allBairros.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, quantidade)
}

function getBairrosPremium(quantidade: number = 4): string[] {
  const shuffled = [...BAIRROS_PREMIUM].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, quantidade)
}

export function getSupplierProfile(supplierId: string | null | undefined): SupplierProfile | null {
  if (!supplierId) return null
  return SUPPLIER_PROFILES[supplierId] || null
}

// v3.2.2: Helpers de escala
function isArtely(supplierId: string | null | undefined): boolean {
  return supplierId === SUPPLIER_IDS.ARTELY
}

function isLargePiece(width: number | null | undefined): boolean {
  return width !== null && width !== undefined && width >= 160
}

function generateMontageAnswer(
  difficulty: string | null | undefined, 
  timeMinutes: number | null | undefined,
  supplierProfile: SupplierProfile | null
): string {
  const difficultyText = difficulty === 'facil' ? 'Fácil' : 
                         difficulty === 'medio' ? 'Médio' : 
                         difficulty === 'dificil' ? 'Difícil' : 'Médio'
  const timeText = timeMinutes ? ` (~${timeMinutes}min)` : ''
  
  if (supplierProfile?.name === 'Artany') {
    return `Nível ${difficultyText}${timeText}. Móvel profissional com montagem estruturada: manual técnico detalhado e ferragens de alta resistência identificadas. Você precisa apenas de chave Phillips — sem ferramentas elétricas. Para facilitar, disponibilizamos vídeo de montagem completo.`
  }
  
  return `Nível ${difficultyText}${timeText}. Montagem intuitiva: acompanha manual ilustrado passo a passo e todas as ferragens já vêm separadas e identificadas. Você só precisa de chave de fenda comum — sem ferramentas elétricas. Para facilitar ainda mais, deixamos um vídeo de montagem completo logo acima nesta página.`
}

// ============================================
// INFERÊNCIA
// ============================================

export function inferCategoryType(slug: string, categorySlug?: string): CategoryType | null {
  const slugLower = slug.toLowerCase()
  const catLower = (categorySlug || '').toLowerCase()
  
  if (slugLower.includes('rack') || catLower.includes('rack')) return 'rack'
  if (slugLower.includes('painel') || catLower.includes('painel')) return 'painel'
  if (slugLower.includes('buffet') || catLower.includes('buffet')) return 'buffet'
  if (slugLower.includes('aparador') || catLower.includes('aparador')) return 'aparador'
  if (slugLower.includes('cristaleira') || catLower.includes('cristaleira')) return 'cristaleira'
  if (slugLower.includes('bar') || catLower.includes('bar')) return 'bar'
  if (slugLower.includes('carrinho') || catLower.includes('carrinho')) return 'carrinho'
  if (slugLower.includes('cantinho') || catLower.includes('cantinho')) return 'cantinho'
  if (catLower.includes('mesa-centro') || slugLower.includes('mesa-centro')) return 'mesa-centro'
  if (catLower.includes('mesa-apoio') || slugLower.includes('mesa-apoio')) return 'mesa-apoio'
  if (slugLower.includes('penteadeira') || catLower.includes('penteadeira')) return 'penteadeira'
  if (slugLower.includes('espelho') || catLower.includes('espelho')) return 'espelho'
  if (catLower.includes('escrivaninha-l') || slugLower.includes('escrivaninha-l')) return 'escrivaninha-l'
  if (catLower.includes('escrivaninha') || slugLower.includes('escrivaninha')) return 'escrivaninha'
  if (catLower.includes('gaveteiro-home') || catLower.includes('gaveteiro')) return 'gaveteiro-home'
  if (catLower.includes('estante-home')) return 'estante-home'
  if (catLower.includes('mesa-balcao-home')) return 'mesa-balcao-home'
  if (catLower.includes('mesa-reuniao') || slugLower.includes('reuniao')) return 'mesa-reuniao'
  if (catLower.includes('mesa-em-l') || slugLower.includes('mesa-l')) return 'mesa-em-l'
  if (catLower.includes('mesa-reta') || slugLower.includes('mesa-reta')) return 'mesa-reta'
  if (catLower.includes('balcao-atendimento')) return 'balcao-atendimento'
  if (catLower.includes('balcao-profissional')) return 'balcao-profissional'
  if (catLower.includes('armario-profissional')) return 'armario-profissional'
  if (catLower.includes('estante-profissional')) return 'estante-profissional'
  if (catLower.includes('prateleira-profissional')) return 'prateleira-profissional'
  if (catLower.includes('estacoes') || slugLower.includes('estacao')) return 'estacao'
  if (slugLower.includes('estante') || catLower.includes('estante')) return 'estante'
  if (slugLower.includes('prateleira') || catLower.includes('prateleira')) return 'prateleira'
  if (slugLower.includes('mesa') || catLower.includes('mesa')) return 'mesa-reta'
  
  return null
}

export function inferEnvironmentType(categoryType: CategoryType | null, categorySlug?: string): EnvironmentType {
  const catLower = (categorySlug || '').toLowerCase()
  
  const profissionalTypes: CategoryType[] = [
    'mesa-reta', 'mesa-em-l', 'mesa-reuniao', 'balcao-atendimento', 
    'balcao-profissional', 'armario-profissional', 'estante-profissional', 
    'prateleira-profissional', 'estacao'
  ]
  const homeOfficeTypes: CategoryType[] = [
    'escrivaninha', 'escrivaninha-l', 'estante-home', 'gaveteiro-home', 'mesa-balcao-home'
  ]
  
  if (catLower.includes('profissional') || catLower.includes('linha-profissional')) return 'escritorio-pro'
  if (catLower.includes('home-office')) return 'escritorio-home'
  if (categoryType && profissionalTypes.includes(categoryType)) return 'escritorio-pro'
  if (categoryType && homeOfficeTypes.includes(categoryType)) return 'escritorio-home'
  
  return 'casa'
}

// ============================================
// H1, TITLE E META DESCRIPTION
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

export function generateProductTitle(product: ProductForH1 & { supplier_id?: string | null }): string {
  const { name, tv_max_size, category_type, variant_name } = product
  const isRackOrPanel = category_type === 'rack' || category_type === 'painel'
  
  const nameParts = name.split(' - ')
  const baseName = nameParts[0]
  const colorFromName = nameParts.length > 1 ? nameParts[1] : null
  const color = variant_name || colorFromName
  const shortColor = color ? color.split(' / ')[0].split(' C ')[0].trim() : null
  
  let productPart = ''
  if (isRackOrPanel && tv_max_size) {
    productPart = shortColor ? `${baseName} TV ${tv_max_size}" ${shortColor}` : `${baseName} TV ${tv_max_size}"`
  } else {
    productPart = shortColor && !baseName.includes(shortColor) ? `${baseName} ${shortColor}` : baseName
  }
  
  const suffix = "Pronta Entrega Curitiba | Moveirama"
  const fullTitle = `${productPart} | ${suffix}`
  
  if (fullTitle.length <= 60) return fullTitle
  if (isRackOrPanel && tv_max_size) return `${baseName} ${tv_max_size}" | ${suffix}`
  return `${baseName} | ${suffix}`
}

export function generateProductMetaDescription(product: ProductForMeta): string {
  const { name, tv_max_size, category_type, weight_capacity, thickness_mm, supplier_id, depth, depth_cm, width, width_cm } = product
  
  const nameParts = name.split(' - ')
  const baseName = nameParts[0]
  const colorPart = nameParts.length > 1 ? nameParts[1] : null
  const shortColor = colorPart ? colorPart.split(' / ').join('/').replace(' C ', ' ') : null
  const productName = shortColor ? `${baseName} ${shortColor}` : baseName
  const supplierProfile = getSupplierProfile(supplier_id)
  const productDepth = depth || depth_cm
  const productWidth = width || width_cm
  
  const hasTamburato = thickness_mm && thickness_mm >= 50
  const isArtelyProduct = isArtely(supplier_id)
  const isLarge = isLargePiece(productWidth)
  
  let benefit = ''
  
  // Racks e Painéis
  if ((category_type === 'rack' || category_type === 'painel') && tv_max_size) {
    const weightText = weight_capacity ? `Suporta ${weight_capacity}kg. ` : ''
    
    // v3.2.2: Semântica de escala para Artely
    if (isArtelyProduct && isLarge) {
      const larguraMetros = productWidth ? (productWidth / 100).toFixed(1).replace('.', ',') : ''
      if (hasTamburato) {
        benefit = `Visual imponente de ${larguraMetros}m com Tamburato de ${thickness_mm}mm. Profundidade slim para garantir circulação confortável. ${weightText}Design sofisticado com entrega própria em Curitiba.`
      } else {
        benefit = `Visual imponente de ${larguraMetros}m com profundidade slim para garantir circulação confortável na sua sala. ${weightText}Design sofisticado com entrega própria em Curitiba.`
      }
    } else if (hasTamburato) {
      benefit = `Robustez visual com Tamburato de ${thickness_mm}mm. Para TVs de ${tv_max_size}". ${weightText}Entrega própria em 72h.`
    } else {
      benefit = `Solução para TVs de ${tv_max_size}". ${weightText}Entrega própria em 72h.`
    }
  }
  // Buffets e Aparadores
  else if (category_type === 'buffet' || category_type === 'aparador') {
    if (isArtelyProduct && isLarge) {
      const depthText = productDepth ? `Profundidade de ${productDepth}cm garante fluidez de circulação. ` : ''
      benefit = `Visual elegante para salas de estar e ambientes integrados. ${depthText}Design sofisticado com entrega própria em Curitiba.`
    } else {
      const depthText = productDepth && productDepth <= 40 ? `Profundidade de apenas ${productDepth}cm — não obstrui a passagem. ` : ''
      if (hasTamburato) {
        benefit = `Tampo robusto de ${thickness_mm}mm em Tamburato. ${depthText}Design elegante para salas de jantar. Entrega própria em 72h.`
      } else {
        benefit = `${depthText}Design elegante para salas de jantar. Entrega própria em 72h.`
      }
    }
  }
  // Estantes e Cristaleiras
  else if (category_type === 'cristaleira' || category_type === 'estante') {
    const weightText = weight_capacity ? `Suporta até ${weight_capacity}kg por prateleira. ` : ''
    benefit = `${weightText}Proteção contra umidade de Curitiba. Entrega própria em 72h.`
  }
  // Mesas Profissionais
  else if (['mesa-reta', 'mesa-em-l', 'mesa-reuniao', 'estacao'].includes(category_type || '')) {
    if (hasTamburato) {
      benefit = `Tampo robusto de ${thickness_mm}mm em Tamburato. Estrutura para uso intenso em escritórios. Pronta entrega em 72h!`
    } else if (supplierProfile?.focus === 'profissional') {
      benefit = `Estrutura reforçada para ambiente profissional. Entrega própria em 72h.`
    } else {
      benefit = `Mesa funcional para home office ou escritório. Entrega própria em 72h.`
    }
  }
  // Escrivaninhas
  else if (category_type === 'escrivaninha' || category_type === 'escrivaninha-l') {
    if (hasTamburato) {
      benefit = `Tampo robusto de ${thickness_mm}mm em Tamburato. Ideal para home office. Entrega própria em 72h.`
    } else {
      benefit = `Solução prática para home office em casas e apartamentos. Entrega própria em 72h.`
    }
  }
  // Penteadeiras
  else if (category_type === 'penteadeira') {
    benefit = `Design funcional para quartos e closets. Entrega própria em 72h.`
  }
  // Mesas de centro e apoio
  else if (category_type === 'mesa-centro' || category_type === 'mesa-apoio') {
    if (hasTamburato) {
      benefit = `Tampo robusto de ${thickness_mm}mm em Tamburato. Visual sofisticado para sua sala. Entrega própria em 72h.`
    } else {
      benefit = `Complemento elegante para sua sala. Entrega própria em 72h.`
    }
  }
  // Fallback
  else {
    benefit = `Móvel com ótimo custo-benefício para sua casa. Entrega própria em 72h.`
  }
  
  const cta = `Garanta o seu na Moveirama!`
  let description = `${productName}: ${benefit} ${cta}`
  
  if (description.length > 155) {
    description = `${baseName}: ${benefit}`
    if (description.length > 155) {
      description = `${baseName}: Entrega própria em 72h em Curitiba. ${cta}`
    }
  }
  
  return description
}

// ============================================
// SCHEMA.ORG
// ============================================

export function generateProductSchema(product: ProductForSchema, canonicalUrl: string) {
  const h1Title = generateProductH1({
    name: product.name,
    tv_max_size: product.tv_max_size,
    category_type: product.category_type as CategoryType,
    variant_name: product.variants?.[0]?.name
  })

  const metaDescription = generateProductMetaDescription({
    name: product.name,
    price: product.price,
    tv_max_size: product.tv_max_size,
    assembly_time_minutes: product.assembly_time_minutes,
    category_type: product.category_type,
    weight_capacity: product.weight_capacity,
    thickness_mm: product.thickness_mm,
    supplier_id: product.supplier_id,
    depth: product.depth,
    width: product.width
  })

  const priceValidUntil = new Date()
  priceValidUntil.setFullYear(priceValidUntil.getFullYear() + 1)

  const colorFromName = product.name.includes(' - ') ? product.name.split(' - ').slice(1).join(' / ') : null
  const productColor = product.variants?.[0]?.name || colorFromName

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": h1Title,
    "description": metaDescription,
    "image": product.images?.map(img => img.url) || [],
    "sku": product.sku || product.slug,
    "mpn": product.sku || product.slug,
    "brand": { "@type": "Brand", "name": product.brand || "Moveirama" },
    ...(product.main_material && { "material": product.main_material }),
    ...(productColor && { "color": productColor }),
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "priceCurrency": "BRL",
      "price": product.price,
      "priceValidUntil": priceValidUntil.toISOString().split('T')[0],
      "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": { "@type": "Organization", "name": "Moveirama", "url": "https://moveirama.com.br" },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "BR",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 7,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": { "@type": "MonetaryAmount", "value": "29.90", "currency": "BRL" },
        "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "BR", "addressRegion": "PR" },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "d" },
          "transitTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 3, "unitCode": "d" }
        }
      }
    }
  }

  const additionalProperties = []
  if (product.tv_max_size) {
    additionalProperties.push({ "@type": "PropertyValue", "name": "Compatibilidade TV", "value": `Até ${product.tv_max_size} polegadas` })
  }
  if (product.weight_capacity) {
    additionalProperties.push({ "@type": "PropertyValue", "name": "Peso Suportado", "value": `${product.weight_capacity} kg` })
  }
  if (product.thickness_mm) {
    additionalProperties.push({ "@type": "PropertyValue", "name": "Espessura do Tampo", "value": `${product.thickness_mm}mm` })
  }
  if (product.width && product.height && product.depth) {
    additionalProperties.push({ "@type": "PropertyValue", "name": "Dimensões", "value": `${product.width}cm x ${product.height}cm x ${product.depth}cm` })
  }
  if (additionalProperties.length > 0) {
    schema.additionalProperty = additionalProperties
  }

  return schema
}

export function generateVideoSchema(videoUrl: string, productName: string, thumbnailUrl?: string) {
  const youtubeMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  const videoId = youtubeMatch ? youtubeMatch[1] : null
  const thumbnail = thumbnailUrl || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : undefined)

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
      "logo": { "@type": "ImageObject", "url": "https://moveirama.com.br/logo/moveirama-grafite.svg" }
    }
  }
}

export function generateHowToSchema(
  assemblyVideoUrl: string,
  productName: string,
  assemblyTimeMinutes: number | null | undefined,
  assemblyDifficulty: string | null | undefined
) {
  const youtubeMatch = assemblyVideoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/)
  const videoId = youtubeMatch ? youtubeMatch[1] : null
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : undefined
  const totalTime = assemblyTimeMinutes ? `PT${assemblyTimeMinutes}M` : 'PT45M'
  const difficultyText = assemblyDifficulty === 'facil' ? 'fácil' : assemblyDifficulty === 'dificil' ? 'difícil' : 'médio'
  const baseName = productName.includes(' - ') ? productName.split(' - ')[0] : productName

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `Como montar o ${baseName}`,
    "description": `Passo a passo de montagem do ${baseName}. Nível ${difficultyText}, tempo estimado: ${assemblyTimeMinutes || 45} minutos. Não precisa de ferramentas elétricas.`,
    "totalTime": totalTime,
    "estimatedCost": { "@type": "MonetaryAmount", "currency": "BRL", "value": "0" },
    "tool": [
      { "@type": "HowToTool", "name": "Chave Phillips" },
      { "@type": "HowToTool", "name": "Martelo de borracha (opcional)" }
    ],
    "supply": [
      { "@type": "HowToSupply", "name": "Manual de instruções (incluso)" },
      { "@type": "HowToSupply", "name": "Kit de ferragens (incluso)" }
    ],
    "step": [
      { "@type": "HowToStep", "position": 1, "name": "Confira as peças", "text": "Abra a embalagem e confira todas as peças e ferragens usando a lista do manual. Se faltar algo, entre em contato pelo WhatsApp antes de começar.", "image": thumbnail },
      { "@type": "HowToStep", "position": 2, "name": "Assista o vídeo completo", "text": "Antes de começar a montar, assista o vídeo de montagem completo para entender o processo. Isso evita erros e retrabalho.", "url": assemblyVideoUrl },
      { "@type": "HowToStep", "position": 3, "name": "Organize o espaço", "text": "Escolha um local amplo e plano para a montagem. Separe as peças por tamanho e deixe as ferragens organizadas." },
      { "@type": "HowToStep", "position": 4, "name": "Siga o manual passo a passo", "text": "Monte seguindo a ordem do manual ilustrado. Use o vídeo como referência visual para cada etapa." },
      { "@type": "HowToStep", "position": 5, "name": "Finalize e posicione", "text": `Após a montagem, posicione o ${baseName} no local definitivo. Se precisar fixar na parede, siga as instruções específicas do manual.` }
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
      "publisher": { "@type": "Organization", "name": "Moveirama", "logo": { "@type": "ImageObject", "url": "https://moveirama.com.br/logo/moveirama-grafite.svg" } }
    }
  }
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  }
}

// ============================================
// FAQs POR CATEGORIA (v3.2.2)
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
  thickness_mm?: number | null
  supplier_id?: string | null
}): FAQItem[] {
  const faqs: FAQItem[] = []
  const baseName = product.name.includes(' - ') ? product.name.split(' - ')[0] : product.name
  const supplierProfile = getSupplierProfile(product.supplier_id)
  
  const isArtelyProduct = isArtely(product.supplier_id)
  const isLarge = isLargePiece(product.width)
  
  // v3.2.2: Bairros premium para móveis grandes Artely
  const bairros = (isArtelyProduct && isLarge) 
    ? getBairrosPremium(4) 
    : getBairrosPorContexto('casa', 4)
  
  if (product.tv_max_size) {
    faqs.push({
      question: `O ${baseName} serve para TV de quantas polegadas?`,
      answer: `Serve para TV de até ${product.tv_max_size} polegadas.${product.width ? ` Largura total de ${product.width}cm.` : ''} Antes de comprar, confira se a base da sua TV cabe no tampo.`
    })
  }
  
  if (product.width && product.height && product.depth) {
    faqs.push({
      question: `Quais são as medidas do ${baseName}?`,
      answer: `As dimensões são: ${product.width}cm de largura × ${product.height}cm de altura × ${product.depth}cm de profundidade. Meça o espaço antes de comprar - se precisar de ajuda, chama no WhatsApp.`
    })
  }
  
  // v3.2.2: FAQ de comparação com semântica de escala (somente Artely)
  if (product.width && product.depth && product.thickness_mm) {
    const larguraMetros = (product.width / 100).toFixed(1).replace('.', ',')
    const tipoMovel = product.name.toLowerCase().includes('painel') ? 'painéis' : 'racks'
    
    let answerText: string
    if (isArtelyProduct && isLarge) {
      // v3.2.2: Móvel grande Artely — fluidez, visual imponente
      // v3.2.3: Removido menção de peso (confunde cliente - é da prateleira, não do tampo)
      answerText = `O diferencial do ${baseName} é a sua profundidade otimizada de ${product.depth}cm, que permite um visual imponente sem comprometer o fluxo de circulação em salas de estar ou ambientes integrados de Curitiba. Acabamento sofisticado com proteção contra umidade.`
    } else {
      // Móvel compacto ou Artany — otimização de espaço
      // v3.2.3: Removido menção de peso (confunde cliente - é da prateleira, não do tampo)
      answerText = `O diferencial do ${baseName} é o tampo de ${product.thickness_mm}mm e a profundidade de ${product.depth}cm, ideal para otimizar o espaço em salas compactas de Curitiba. Material resistente à umidade local.`
    }
    
    faqs.push({
      question: `Qual a diferença do ${baseName} para outros ${tipoMovel} de ${larguraMetros}m?`,
      answer: answerText
    })
  }
  
  faqs.push({
    question: `É difícil montar o ${baseName}?`,
    answer: generateMontageAnswer(product.assembly_difficulty, product.assembly_time_minutes, supplierProfile)
  })
  
  if (product.main_material) {
    faqs.push({
      question: `Qual o material do ${baseName}?`,
      answer: `${product.main_material}${product.thickness_mm ? ` de ${product.thickness_mm}mm` : ''}, com acabamento em pintura UV que protege da umidade característica de Curitiba. Fácil de limpar - só passar pano úmido.`
    })
  }
  
  // v3.2.3: Removido FAQ de peso suportado para racks/painéis
  // O peso informado se refere à prateleira, não ao tampo - pode confundir o cliente
  // Orientação: consultar manual de montagem
  
  faqs.push({
    question: `Precisa furar a parede para instalar o ${baseName}?`,
    answer: product.requires_wall_mount 
      ? `Sim, recomendamos fixar na parede por segurança. Buchas e parafusos de fixação acompanham o produto.`
      : `Não precisa furar. O rack fica apoiado no chão, sem necessidade de fixação na parede - ideal para apartamentos alugados.`
  })
  
  faqs.push({
    question: `Qual o prazo de entrega para Curitiba?`,
    answer: `Entrega própria em até 72h para Curitiba (${bairros.join(', ')} e todos os bairros) e Região Metropolitana. Frota própria - a gente conhece as ruas da cidade e cuida do seu móvel.`
  })
  
  faqs.push({
    question: `E se chegar com defeito?`,
    answer: FAQ_GARANTIA_RESPOSTA
  })
  
  return faqs
}

export function generateBuffetAparadorFAQs(product: {
  name: string
  width?: number | null
  height?: number | null
  depth?: number | null
  assembly_time_minutes?: number | null
  assembly_difficulty?: string | null
  main_material?: string | null
  weight_capacity?: number | null
  supplier_id?: string | null
}): FAQItem[] {
  const faqs: FAQItem[] = []
  const baseName = product.name.includes(' - ') ? product.name.split(' - ')[0] : product.name
  const supplierProfile = getSupplierProfile(product.supplier_id)
  
  const isArtelyProduct = isArtely(product.supplier_id)
  const isLarge = isLargePiece(product.width)
  const bairros = (isArtelyProduct && isLarge) 
    ? getBairrosPremium(4) 
    : getBairrosPorContexto('casa', 4)
  
  if (product.depth) {
    // v3.2.2: Semântica de escala
    if (isArtelyProduct && isLarge) {
      faqs.push({
        question: `O ${baseName} compromete a circulação na sala?`,
        answer: `Não! O ${baseName} tem ${product.depth}cm de profundidade, projetado para oferecer visual imponente sem comprometer o fluxo de circulação em salas de estar e ambientes integrados de Curitiba.`
      })
    } else {
      const isCompact = product.depth <= 40
      faqs.push({
        question: `O ${baseName} obstrui a passagem na sala de jantar?`,
        answer: isCompact
          ? `Não! Com apenas ${product.depth}cm de profundidade, o ${baseName} foi projetado para salas de jantar compactas típicas de Curitiba. Você consegue circular tranquilamente mesmo em ambientes pequenos.`
          : `O ${baseName} tem ${product.depth}cm de profundidade. Recomendamos medir o espaço disponível na sua sala antes de comprar. Dúvida? Chama no WhatsApp.`
      })
    }
  }
  
  if (product.width && product.height && product.depth) {
    faqs.push({
      question: `Quais são as medidas do ${baseName}?`,
      answer: `${product.width}cm de largura × ${product.height}cm de altura × ${product.depth}cm de profundidade. Ideal para organizar louças e objetos de decoração.`
    })
  }
  
  faqs.push({
    question: `O ${baseName} é resistente à umidade de Curitiba?`,
    answer: `Sim! ${product.main_material ? `Feito em ${product.main_material} com ` : 'Com '}acabamento em pintura UV que protege contra a umidade característica de Curitiba. Suas louças e objetos ficam protegidos. Limpe apenas com pano levemente úmido.`
  })
  
  if (product.weight_capacity) {
    faqs.push({
      question: `Quanto peso as prateleiras do ${baseName} suportam?`,
      answer: `Suporta até ${product.weight_capacity}kg distribuídos. Suficiente para louças, vasos e objetos de decoração. Evite concentrar peso excessivo em um único ponto.`
    })
  }
  
  faqs.push({
    question: `É difícil montar o ${baseName}?`,
    answer: generateMontageAnswer(product.assembly_difficulty, product.assembly_time_minutes, supplierProfile)
  })
  
  faqs.push({
    question: `Qual o prazo de entrega para Curitiba?`,
    answer: `Entrega própria em até 72h para Curitiba (${bairros.join(', ')} e todos os bairros) e Região Metropolitana. Embalagem reforçada para proteger o móvel durante o transporte.`
  })
  
  faqs.push({
    question: `E se chegar com defeito?`,
    answer: FAQ_GARANTIA_RESPOSTA
  })
  
  return faqs
}

export function generateMesaProfissionalFAQs(product: {
  name: string
  width?: number | null
  height?: number | null
  depth?: number | null
  assembly_time_minutes?: number | null
  assembly_difficulty?: string | null
  main_material?: string | null
  weight_capacity?: number | null
  thickness_mm?: number | null
  supplier_id?: string | null
}): FAQItem[] {
  const faqs: FAQItem[] = []
  const baseName = product.name.includes(' - ') ? product.name.split(' - ')[0] : product.name
  const supplierProfile = getSupplierProfile(product.supplier_id)
  const bairros = getBairrosPorContexto('escritorio-pro', 4)
  
  if (product.thickness_mm) {
    faqs.push({
      question: `A ${baseName} suporta múltiplos monitores sem balançar?`,
      answer: `Sim! Com tampo de ${product.thickness_mm}mm em ${product.main_material || 'material de alta densidade'}, a ${baseName} foi projetada para setups profissionais com 2 ou mais monitores. Estrutura estável mesmo com uso intenso durante o expediente.`
    })
  }
  
  if (product.width && product.height && product.depth) {
    faqs.push({
      question: `Quais são as medidas da ${baseName}?`,
      answer: `${product.width}cm de largura × ${product.height}cm de altura × ${product.depth}cm de profundidade. Espaço amplo para monitores, documentos e acessórios de escritório.`
    })
  }
  
  faqs.push({
    question: `A ${baseName} tem solução para organizar fios?`,
    answer: `Sim! A mesa conta com furação para passagem de cabos, permitindo organizar fios de monitores, carregadores e periféricos. Seu setup fica limpo e profissional.`
  })
  
  if (product.weight_capacity) {
    faqs.push({
      question: `Quanto peso a ${baseName} suporta?`,
      answer: `Suporta até ${product.weight_capacity}kg no tampo. Projetada para equipamentos de escritório: monitores, impressoras, CPU e acessórios sem problema.`
    })
  }
  
  if (product.main_material) {
    faqs.push({
      question: `Qual o material da ${baseName}?`,
      answer: `${product.main_material}${product.thickness_mm ? ` com ${product.thickness_mm}mm de espessura` : ''} — padrão corporativo de durabilidade. Acabamento resistente a riscos e fácil de limpar.`
    })
  }
  
  faqs.push({
    question: `É difícil montar a ${baseName}?`,
    answer: generateMontageAnswer(product.assembly_difficulty, product.assembly_time_minutes, supplierProfile)
  })
  
  faqs.push({
    question: `Vocês entregam em escritórios em Curitiba?`,
    answer: `Sim! Entrega própria em até 72h para escritórios em Curitiba (${bairros.join(', ')} e toda a cidade) e Região Metropolitana. Embalagem reforçada para garantir que chegue perfeita.`
  })
  
  faqs.push({
    question: `E se chegar com defeito?`,
    answer: FAQ_GARANTIA_RESPOSTA
  })
  
  return faqs
}

export function generateEstanteFAQs(product: {
  name: string
  width?: number | null
  height?: number | null
  depth?: number | null
  assembly_time_minutes?: number | null
  assembly_difficulty?: string | null
  main_material?: string | null
  weight_capacity?: number | null
  supplier_id?: string | null
}): FAQItem[] {
  const faqs: FAQItem[] = []
  const baseName = product.name.includes(' - ') ? product.name.split(' - ')[0] : product.name
  const supplierProfile = getSupplierProfile(product.supplier_id)
  const bairros = getBairrosPorContexto('casa', 4)
  
  if (product.width && product.height && product.depth) {
    faqs.push({
      question: `Quais são as medidas da ${baseName}?`,
      answer: `${product.width}cm de largura × ${product.height}cm de altura × ${product.depth}cm de profundidade. Confira se o pé-direito do seu ambiente comporta a altura.`
    })
  }
  
  if (product.weight_capacity) {
    faqs.push({
      question: `Quanto peso cada prateleira da ${baseName} aguenta?`,
      answer: `Suporta até ${product.weight_capacity}kg por prateleira (peso distribuído). Ideal para livros, objetos decorativos e itens de uso diário.`
    })
  }
  
  faqs.push({
    question: `A ${baseName} é resistente à umidade?`,
    answer: `Sim! ${product.main_material ? `Feita em ${product.main_material} com ` : 'Com '}acabamento protetor contra a umidade de Curitiba. Seus livros e objetos ficam protegidos.`
  })
  
  faqs.push({
    question: `Precisa fixar a ${baseName} na parede?`,
    answer: `Recomendamos fixar na parede por segurança, especialmente se tiver crianças ou pets em casa. Buchas e parafusos de fixação acompanham o produto.`
  })
  
  faqs.push({
    question: `É difícil montar a ${baseName}?`,
    answer: generateMontageAnswer(product.assembly_difficulty, product.assembly_time_minutes, supplierProfile)
  })
  
  faqs.push({
    question: `Qual o prazo de entrega para Curitiba?`,
    answer: `Entrega própria em até 72h para Curitiba (${bairros.join(', ')} e região) e RMC. Embalagem reforçada para proteger durante o transporte.`
  })
  
  faqs.push({
    question: `E se chegar com defeito?`,
    answer: FAQ_GARANTIA_RESPOSTA
  })
  
  return faqs
}

export function generateEscrivaninhaFAQs(product: {
  name: string
  width?: number | null
  height?: number | null
  depth?: number | null
  assembly_time_minutes?: number | null
  assembly_difficulty?: string | null
  main_material?: string | null
  weight_capacity?: number | null
  supplier_id?: string | null
}): FAQItem[] {
  const faqs: FAQItem[] = []
  const baseName = product.name.includes(' - ') ? product.name.split(' - ')[0] : product.name
  const supplierProfile = getSupplierProfile(product.supplier_id)
  const bairros = getBairrosPorContexto('escritorio-home', 4)
  
  if (product.width && product.height && product.depth) {
    faqs.push({
      question: `Quais são as medidas da ${baseName}?`,
      answer: `${product.width}cm de largura × ${product.height}cm de altura × ${product.depth}cm de profundidade. Confira se cabe no espaço disponível antes de comprar.`
    })
  }
  
  if (product.width) {
    const cabeMonitor = product.width >= 90
    faqs.push({
      question: `Cabe notebook e monitor na ${baseName}?`,
      answer: cabeMonitor 
        ? `Sim! Com ${product.width}cm de largura, cabe notebook + monitor lado a lado tranquilamente.`
        : `Para notebook, cabe bem. Se quiser adicionar monitor externo, pode precisar de um suporte articulado.`
    })
  }
  
  faqs.push({
    question: `É difícil montar a ${baseName}?`,
    answer: generateMontageAnswer(product.assembly_difficulty, product.assembly_time_minutes, supplierProfile)
  })
  
  if (product.main_material) {
    faqs.push({
      question: `Qual o material da ${baseName}?`,
      answer: `${product.main_material}. Resistente à umidade de Curitiba e fácil de limpar.`
    })
  }
  
  faqs.push({
    question: `Qual o prazo de entrega para Curitiba?`,
    answer: `Entrega própria em até 72h para Curitiba (${bairros.join(', ')} e região) e RMC.`
  })
  
  faqs.push({
    question: `E se chegar com defeito?`,
    answer: FAQ_GARANTIA_RESPOSTA
  })
  
  return faqs
}

// ============================================
// GERADOR PRINCIPAL DE FAQs
// ============================================

export function generateProductFAQs(product: {
  name: string
  slug: string
  tv_max_size?: number | null
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
  supplier_id?: string | null
}, categorySlug?: string): FAQItem[] {
  const categoryType = inferCategoryType(product.slug, categorySlug)
  
  const normalizedProduct = {
    ...product,
    width: product.width ?? product.width_cm,
    height: product.height ?? product.height_cm,
    depth: product.depth ?? product.depth_cm
  }
  
  if (categoryType === 'rack' || categoryType === 'painel') {
    return generateRackFAQs(normalizedProduct)
  }
  if (categoryType === 'buffet' || categoryType === 'aparador') {
    return generateBuffetAparadorFAQs(normalizedProduct)
  }
  if (categoryType === 'estante' || categoryType === 'cristaleira' || 
      categoryType === 'estante-home' || categoryType === 'estante-profissional') {
    return generateEstanteFAQs(normalizedProduct)
  }
  if (categoryType === 'escrivaninha' || categoryType === 'escrivaninha-l') {
    return generateEscrivaninhaFAQs(normalizedProduct)
  }
  if (categoryType === 'mesa-reta' || categoryType === 'mesa-em-l' || 
      categoryType === 'mesa-reuniao' || categoryType === 'estacao') {
    return generateMesaProfissionalFAQs(normalizedProduct)
  }
  
  const baseName = product.name.includes(' - ') ? product.name.split(' - ')[0] : product.name
  const supplierProfile = getSupplierProfile(product.supplier_id)
  const bairros = getBairrosAleatorios(3)
  
  return [
    { question: `Qual o prazo de entrega do ${baseName}?`, answer: `Entrega própria em até 72h para Curitiba (${bairros.join(', ')} e região) e RMC.` },
    { question: `É difícil montar o ${baseName}?`, answer: generateMontageAnswer(product.assembly_difficulty, product.assembly_time_minutes, supplierProfile) },
    { question: `E se chegar com defeito?`, answer: FAQ_GARANTIA_RESPOSTA }
  ]
}

// ============================================
// SEO PARA CATEGORIAS
// ============================================

const CATEGORY_SEO_NAMES: Record<string, string> = {
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
  'escrivaninha-home-office': 'Escrivaninhas para Home Office',
  'escrivaninha-l-home-office': 'Escrivaninhas em L para Home Office',
  'estante-home-office': 'Estantes para Home Office',
  'gaveteiro-home-office': 'Gaveteiros para Home Office',
  'mesa-balcao-home-office': 'Mesas e Balcões para Home Office',
  'mesa-reta': 'Mesas Retas para Escritório',
  'mesa-em-l': 'Mesas em L para Escritório',
  'mesa-reuniao': 'Mesas de Reunião',
  'balcao-profissional': 'Balcões Profissionais',
  'balcao-atendimento': 'Balcões de Atendimento',
  'armario-profissional': 'Armários para Escritório',
  'prateleira-profissional': 'Prateleiras para Escritório',
  'estante-profissional': 'Estantes Profissionais',
  'estacoes': 'Estações de Trabalho',
  'moveis-para-casa': 'Móveis para Casa',
  'moveis-para-escritorio': 'Móveis para Escritório',
  'home-office': 'Home Office',
  'linha-profissional': 'Linha Profissional',
}

export function generateCategoryH1(categoryName: string, categorySlug: string): string {
  const seoName = CATEGORY_SEO_NAMES[categorySlug] || categoryName
  return `${seoName} em Curitiba e Região Metropolitana`
}

export function generateCategoryTitle(categoryName: string, categorySlug: string): string {
  const seoName = CATEGORY_SEO_NAMES[categorySlug] || categoryName
  return `${seoName} em Curitiba e RMC | Moveirama`
}

export function generateCategoryMetaDescription(categoryName: string, categorySlug: string, productCount?: number): string {
  const seoName = CATEGORY_SEO_NAMES[categorySlug] || categoryName
  const seoNameLower = seoName.toLowerCase()
  
  if (['racks-tv', 'paineis-tv'].includes(categorySlug)) {
    return `Confira ${seoNameLower} em Curitiba e Região Metropolitana. Modelos para TV de 32" a 75", com design elegante e acabamento resistente à umidade. Entrega própria em até 72h. Compre móveis na caixa sem dor de cabeça.`
  }
  if (['buffets', 'aparadores'].includes(categorySlug)) {
    return `${seoName} em Curitiba com profundidade reduzida — ideais para salas de jantar. Proteção contra umidade. Entrega própria em até 72h.`
  }
  if (categorySlug.includes('escrivaninha') || categorySlug.includes('home-office')) {
    return `${seoName} em Curitiba e RMC com entrega rápida. Modelos práticos para home office em casas e apartamentos. Frota própria, entrega em até 72h. Monte seu home office sem stress.`
  }
  if (categorySlug.includes('profissional') || ['mesa-reta', 'mesa-em-l', 'mesa-reuniao', 'balcao-atendimento', 'estacoes'].includes(categorySlug)) {
    return `${seoName} em Curitiba e Região Metropolitana. Móveis robustos para escritórios e empresas. Entrega própria em até 72h. Qualidade profissional com preço justo.`
  }
  
  const countText = productCount ? `${productCount} opções de ` : ''
  return `${countText}${seoNameLower} em Curitiba e Região Metropolitana. Preço justo, entrega própria em até 72h. Móveis na caixa com montagem fácil e suporte no WhatsApp.`
}

export function generateCategoryFAQs(categoryName: string, categorySlug: string): FAQItem[] {
  const seoName = CATEGORY_SEO_NAMES[categorySlug] || categoryName
  const seoNameLower = seoName.toLowerCase()
  
  const isProfissional = categorySlug.includes('profissional') || ['mesa-reta', 'mesa-em-l', 'mesa-reuniao', 'balcao-atendimento', 'estacoes'].includes(categorySlug)
  const bairros = isProfissional ? getBairrosPorContexto('escritorio-pro', 5) : getBairrosPorContexto('casa', 5)
  
  const faqs: FAQItem[] = [
    { question: `Quais cidades vocês entregam ${seoNameLower}?`, answer: `Entregamos em Curitiba (${bairros.join(', ')} e todos os bairros) e Região Metropolitana: São José dos Pinhais, Colombo, Araucária, Pinhais e Fazenda Rio Grande. Frota própria para entrega rápida e cuidadosa.` },
    { question: `Qual o prazo de entrega para ${seoNameLower} em Curitiba?`, answer: `Para Curitiba e região metropolitana, o prazo é de até 72h após confirmação do pagamento. Entregamos com frota própria, sem depender de transportadoras.` },
    { question: `Vocês montam os ${seoNameLower}?`, answer: `Sim! Oferecemos serviço de montagem em Curitiba e algumas cidades da RMC. O valor é informado no momento da compra. Se preferir montar sozinho, todos os produtos vêm com manual e ferragens completas - sem precisar de ferramentas elétricas.` },
    { question: `Os ${seoNameLower} vêm montados ou na caixa?`, answer: `Nossos móveis vêm na caixa, desmontados. Isso garante preço mais baixo e protege o produto durante o transporte. Cada peça vem com manual ilustrado e todas as ferragens necessárias.` },
    { question: `E se o móvel chegar com defeito?`, answer: FAQ_GARANTIA_RESPOSTA }
  ]
  
  if (['racks-tv', 'paineis-tv'].includes(categorySlug)) {
    faqs.splice(2, 0, { question: `Os ${seoNameLower} acompanham suporte de TV?`, answer: `A maioria dos modelos não inclui o suporte de TV. Cada página de produto informa se o suporte está incluso. Painéis geralmente precisam de suporte articulado (vendido separadamente).` })
  }
  if (['buffets', 'aparadores'].includes(categorySlug)) {
    faqs.splice(2, 0, { question: `Os ${seoNameLower} cabem em salas de jantar pequenas?`, answer: `Sim! Temos modelos com profundidade reduzida (a partir de 37cm) ideais para salas compactas de Curitiba. Cada página mostra as medidas exatas.` })
  }
  if (categorySlug.includes('escrivaninha')) {
    faqs.splice(2, 0, { question: `As ${seoNameLower} cabem em espaços menores?`, answer: `Sim! Temos modelos de diversos tamanhos, incluindo opções para espaços reduzidos. Cada página mostra as medidas exatas. Dica: meça seu espaço antes de comprar e, se tiver dúvida, chama no WhatsApp.` })
  }
  if (isProfissional) {
    faqs.splice(2, 0, { question: `Vocês vendem para empresas e escritórios?`, answer: `Sim! Atendemos tanto pessoas físicas quanto empresas. Para pedidos maiores ou orçamentos personalizados, entre em contato pelo WhatsApp.` })
  }
  
  return faqs
}

export function getCategorySeoName(categorySlug: string): string {
  return CATEGORY_SEO_NAMES[categorySlug] || categorySlug
}

export function generateGMCTitle(product: ProductForH1): string {
  const h1 = generateProductH1(product)
  return `${h1} - Moveirama`
}
