import Link from 'next/link'
import RecursosMontagem from '@/components/RecursosMontagem'
import ProductGallery from '@/components/ProductGallery'
import Breadcrumb from '@/components/Breadcrumb'
import MedidasCompactas from '@/components/MedidasCompactas'
import ShippingCalculator from '@/components/ShippingCalculator'
import VideoProduct from '@/components/VideoProduct'
import { ProductSaveWrapper } from '@/components/minha-lista'
import ProductRating from '@/components/ProductRating'
import { ReviewsSection } from '@/components/reviews'
import VizinhosAprovaram from '@/components/VizinhosAprovaram'
import { BuyNowButton } from '@/components/cart'
import type { Review, ReviewsSummaryType } from '@/components/reviews'

// ⭐ v2.15: Seletor de Variantes de Cor
import VariantSelector from '@/components/VariantSelector'
import type { ProductColorVariant } from '@/lib/supabase'

// ⭐ v2.13: Import dos ícones Lucide para seção de medidas
import { MoveHorizontal, MoveVertical, Box } from 'lucide-react'

// SEO V2: Imports das funções de SEO
import { 
  generateProductH1, 
  generateProductFAQs, 
  generateProductSchema,
  generateFAQSchema,
  generateVideoSchema,  // ⭐ v2.14: VideoObject para rich snippets
  inferCategoryType 
} from '@/lib/seo'

/**
 * ProductPageContent — Página de Produto (PDP)
 * 
 * v2.15 — 02/02/2026
 * Changelog:
 * - v2.15 (02/02/2026): Seletor de Variantes de Cor com thumbnails e URLs únicas
 *                       Integração com colorVariants do banco (model_group)
 *                       Removido seletor antigo de variantes (botões texto)
 * - v2.14 (01/02/2026): VideoObject Schema para rich snippets de vídeo no Google
 *                       Só renderiza se product.video_product_url existir
 * - v2.13 (30/01/2026): Ícones Lucide na seção "Medidas do produto"
 *                       MoveHorizontal (Largura), MoveVertical (Altura), Box (Profundidade)
 *                       Cor Toffee #8B7355, stroke 2.5, tamanho 24px
 * - v2.12 (30/01/2026): Ajuste de inclusividade: "apartamento ou casa compacta"
 *                       Padronização: travessão "—" substituído por hífen "-"
 * - v2.11 (28/01/2026): Formatação de medidas amigável para Classe C
 *                       ≥100cm converte para metros (160 → "1,6 m")
 *                       <100cm mantém em cm (77 → "77 cm")
 *                       Aplicado na seção "Medidas do produto" e especificações
 * - v2.10 (27/01/2026): Fix buyButtonProduct com dimensões (width_cm, height_cm, depth_cm)
 *                       Adicionado campos extras (tv_max_size, main_material, thickness_mm)
 * - v2.9 (27/01/2026): Integração com sistema de carrinho (BuyNowButton)
 *                      Botões "Comprar agora" e "Comprar" agora adicionam ao carrinho
 * - v2.8 (26/01/2026): Adicionado VizinhosAprovaram (prova social regional)
 * - v2.7 (26/01/2026): Adicionado ReviewsSection (bloco de comentários) após FAQ
 * - v2.6 (26/01/2026): Adicionado ProductRating (estrelinhas) abaixo do H1
 *                      Adicionado ProductSaveWrapper (Minha Lista)
 *                      Badge 5% OFF alterado para terracota (#B85C38)
 *                      Botão WhatsApp alterado para outline
 * - v2.1 (20/01/2026): Prazo de entrega alterado de 2 para 3 dias úteis
 * - v2.0 (20/01/2026): Adicionada seção VideoProduct (vídeo do produto)
 * - v1.x: SEO V2, FAQs dinâmicas, Schema.org
 */

// Types
interface BreadcrumbItem {
  label: string
  href?: string
}

interface ProductPageContentProps {
  product: any // TODO: tipar corretamente
  breadcrumbItems: BreadcrumbItem[]
  subcategorySlug: string
  // ⭐ v2.7: Props para reviews
  reviews?: Review[]
  reviewsSummary?: ReviewsSummaryType | null
  // ⭐ v2.15: Props para variantes de cor
  colorVariants?: ProductColorVariant[]
}

// Formata preço em BRL
function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Calcula parcelas
function getInstallments(price: number, maxParcelas = 10) {
  const minParcela = 50
  let parcelas = Math.min(maxParcelas, Math.floor(price / minParcela))
  if (parcelas < 1) parcelas = 1
  const valorParcela = price / parcelas
  return { parcelas, valorParcela }
}

// Formata dificuldade de montagem (banco armazena sem acento)
function formatDifficulty(difficulty: string): string {
  const map: Record<string, string> = {
    'facil': 'fácil',
    'medio': 'médio',
    'dificil': 'difícil'
  }
  return map[difficulty] || difficulty
}

/**
 * ⭐ v2.11: Formata medida em cm para exibição amigável
 * - Valores ≥ 100cm são convertidos para metros (ex: 160 → "1,6 m")
 * - Valores < 100cm permanecem em centímetros (ex: 77 → "77 cm")
 * - Decimais são arredondados para inteiro quando < 100cm
 */
function formatarMedidaDetalhada(valorCm: number | null | undefined): { valor: string; unidade: string } {
  if (valorCm == null) {
    return { valor: '-', unidade: '' }
  }
  
  if (valorCm >= 100) {
    // Converte para metros
    const metros = valorCm / 100
    // Formata com vírgula, remove zeros desnecessários
    let formatado = metros.toFixed(2).replace('.', ',')
    formatado = formatado.replace(/,?0+$/, '')
    return { valor: formatado, unidade: 'm' }
  } else {
    // Mantém em centímetros, arredonda para inteiro
    const valorArredondado = Math.round(valorCm)
    return { valor: valorArredondado.toString(), unidade: 'cm' }
  }
}

/**
 * ⭐ v2.11: Formata dimensões L×A×P para exibição na tabela de specs
 * Converte cada dimensão individualmente
 */
function formatarDimensoesCompletas(largura: number | null, altura: number | null, profundidade: number | null): string {
  const l = formatarMedidaDetalhada(largura)
  const a = formatarMedidaDetalhada(altura)
  const p = formatarMedidaDetalhada(profundidade)
  
  return `${l.valor} ${l.unidade} × ${a.valor} ${a.unidade} × ${p.valor} ${p.unidade}`
}

export default function ProductPageContent({ 
  product, 
  breadcrumbItems,
  subcategorySlug,
  reviews = [],
  reviewsSummary = null,
  colorVariants = []  // ⭐ v2.15: Variantes de cor
}: ProductPageContentProps) {
  const { parcelas, valorParcela } = getInstallments(product.price)
  const pixPrice = product.price * 0.95 // 5% desconto no Pix
  const defaultVariant = product.variants?.find((v: { is_default: boolean }) => v.is_default) || product.variants?.[0]

  // WhatsApp link
  const whatsappNumber = '5541984209323'
  const whatsappMessage = encodeURIComponent(`Olá! Tenho interesse no ${product.name}. Podem me ajudar?`)
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  // URL canônica (nova estrutura)
  const canonicalUrl = `https://moveirama.com.br/${subcategorySlug}/${product.slug}`

  // ============================================
  // SEO V2: H1 otimizado e FAQs dinâmicas
  // ============================================
  const categoryType = inferCategoryType(product.slug, subcategorySlug)

  const h1Title = generateProductH1({
    name: product.name,
    tv_max_size: product.tv_max_size,
    category_type: categoryType,
    variant_name: defaultVariant?.name,
    color_name: product.color_name  // ⭐ v2.15: Usa color_name do banco
  })

  // FAQs: usa do banco se existir, senão gera automaticamente
  const faqs = product.faqs?.length > 0 
    ? product.faqs 
    : generateProductFAQs(product, subcategorySlug)

  // ============================================
  // SEO V2: Schema.org Product (com shippingDetails + aggregateRating)
  // ============================================
  const baseProductSchema = generateProductSchema({
    name: product.name,
    price: product.price,
    tv_max_size: product.tv_max_size,
    assembly_time_minutes: product.assembly_time_minutes,
    category_type: categoryType,
    sku: product.sku,
    slug: product.slug,
    brand: product.brand,
    main_material: product.main_material,
    width: product.width_cm,
    height: product.height_cm,
    depth: product.depth_cm,
    stock_quantity: product.stock_quantity || 10,
    images: product.images?.map((img: { image_url: string }) => ({ url: img.image_url })),
    variants: product.variants,
    color_name: product.color_name,      // ⭐ v2.15
    model_group: product.model_group     // ⭐ v2.15
  }, canonicalUrl)

  // ⭐ v2.6: Adiciona AggregateRating se houver avaliações
  const productSchema = {
    ...baseProductSchema,
    ...(product.rating_count > 0 && product.rating_average > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        "ratingValue": product.rating_average.toFixed(1),
        "reviewCount": product.rating_count.toString(),
        "bestRating": "5",
        "worstRating": "1"
      }
    })
  }

  // ============================================
  // SEO V2: Schema.org FAQPage (dinâmico)
  // ============================================
  const faqSchema = faqs.length > 0 ? generateFAQSchema(faqs) : null

  // ============================================
  // ⭐ v2.14: Schema.org VideoObject (rich snippet de vídeo)
  // Só gera se product.video_product_url existir
  // ============================================
  const videoSchema = product.video_product_url 
    ? generateVideoSchema(product.video_product_url, product.name)
    : null

  // Schema.org BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `https://moveirama.com.br${item.href}` : canonicalUrl
    }))
  }

  // ============================================
  // ⭐ v2.9: Dados para o botão de compra
  // ⭐ v2.10: Adicionado dimensões e campos extras
  // ============================================
  const buyButtonProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    imageUrl: product.images?.[0]?.cloudinary_path || '',
    subcategorySlug: subcategorySlug,
    sku: product.sku,
    variantId: defaultVariant?.id,
    variantName: defaultVariant?.name,
    // Dimensões (para exibição no carrinho)
    width_cm: product.width_cm,
    height_cm: product.height_cm,
    depth_cm: product.depth_cm,
    // Extras
    tv_max_size: product.tv_max_size,
    main_material: product.main_material,
    thickness_mm: product.thickness_mm
  }

  // ⭐ v2.11: Pré-formata medidas para uso no template
  const larguraFormatada = formatarMedidaDetalhada(product.width_cm)
  const alturaFormatada = formatarMedidaDetalhada(product.height_cm)
  const profundidadeFormatada = formatarMedidaDetalhada(product.depth_cm)
  const dimensoesCompletas = formatarDimensoesCompletas(product.width_cm, product.height_cm, product.depth_cm)

  return (
    <main className="min-h-screen pb-24 md:pb-8">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {/* ⭐ v2.14: VideoObject Schema para rich snippets de vídeo */}
      {videoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
      )}

      {/* Container */}
      <div className="product-container">
        
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Grid Principal */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          
          {/* Coluna Esquerda: Galeria */}
          <div className="min-w-0">
            <ProductGallery 
              images={product.images || []} 
              productName={product.name} 
            />
          </div>

          {/* Coluna Direita: Informações */}
          <div className="min-w-0">
            {/* Título - SEO V2: H1 otimizado */}
            <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-graphite)] mb-2">
              {h1Title}
            </h1>
            
            {/* ⭐ v2.6: Rating/Avaliações */}
            <ProductRating 
              rating={product.rating_average ?? 0}
              totalReviews={product.rating_count ?? 0}
              productId={product.id}
            />
            
            {/* Resumo IA-friendly (SEO/AIO) */}
            <p className="text-sm text-[var(--color-toffee)] mb-3 leading-relaxed break-words">
              <strong>{product.name}</strong>{product.tv_max_size ? ` para TV até ${product.tv_max_size} polegadas` : ''}. {formatPrice(product.price)} à vista ou {parcelas}x {formatPrice(valorParcela)} sem juros. Montagem {formatDifficulty(product.assembly_difficulty)} (~{product.assembly_time_minutes}min). Entrega própria em Curitiba e região metropolitana em até 3 dias úteis.
            </p>
            
            {/* SKU */}
            <p className="text-sm text-[var(--color-toffee)] mb-4">
              SKU: {product.sku}
            </p>

            {/* ⭐ v2.6: Minha Lista - Salvar produto */}
            <div className="mb-4">
              <ProductSaveWrapper
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  slug: product.slug,
                  subcategorySlug: subcategorySlug,
                  width_cm: product.width_cm || 0,
                  imageUrl: product.images?.[0]?.cloudinary_path || ''
                }}
              />
            </div>

            {/* Bloco de Preço */}
            <div className="mb-6">
              {product.compare_at_price && (
                <p className="text-sm text-[var(--color-toffee)] line-through">
                  {formatPrice(product.compare_at_price)}
                </p>
              )}
              <p className="text-3xl md:text-4xl font-bold text-[var(--color-graphite)]">
                {formatPrice(product.price)}
              </p>
              <p className="text-base text-[var(--color-toffee)] mt-1">
                em até <strong>{parcelas}x</strong> de <strong>{formatPrice(valorParcela)}</strong> sem juros
              </p>
              
              {/* Preço Pix - v2.6: Badge terracota */}
              <div className="inline-flex items-center gap-2 mt-3 px-3 py-2 bg-[var(--color-sage-500)]/10 rounded-lg">
                <span className="text-[var(--color-sage-700)] font-semibold">
                  {formatPrice(pixPrice)} no Pix
                </span>
                <span className="text-xs font-semibold text-[#B85C38] bg-[#B85C38]/15 px-2 py-0.5 rounded">
                  5% OFF
                </span>
              </div>

              {/* ⭐ v2.15: Seletor de Variantes de Cor */}
              <VariantSelector
                variants={colorVariants}
                currentSlug={product.slug}
                categorySlug={subcategorySlug}
              />

              {/* Medidas Compactas v1.2 - responde "vai caber?" antes do CTA */}
              <MedidasCompactas
                largura={product.width_cm}
                altura={product.height_cm}
                profundidade={product.depth_cm}
                categoria={subcategorySlug}
                compatibilidadeTv={product.tv_max_size}
              />
              
              {/* Badge Entrega Local */}
              <div className="flex items-start gap-2 mt-4 p-3 bg-[var(--color-cream)] border border-[var(--color-sand-light)] rounded-lg">
                <svg className="w-5 h-5 text-[var(--color-sage-600)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div className="text-sm">
                  <p className="font-semibold text-[var(--color-sage-700)]">Entrega em 1-3 dias úteis</p>
                  <p className="text-[var(--color-toffee)]">Curitiba e Região Metropolitana</p>
                </div>
              </div>
            </div>

            {/* Calculadora de Frete */}
            <div className="mb-6">
              <ShippingCalculator />
            </div>

            {/* ⭐ v2.9: Botões de Ação com BuyNowButton */}
            <div className="flex flex-col gap-3 mb-6">
              <BuyNowButton product={buyButtonProduct} />
              <a 
                href={whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full text-center bg-transparent border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 font-semibold py-3 px-6 rounded-lg min-h-[48px] inline-flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Tirar dúvida no WhatsApp
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 py-4 border-t border-b border-[var(--color-sand-light)]">
              <div className="flex items-center gap-2 min-w-0">
                <svg className="w-5 h-5 flex-shrink-0 text-[var(--color-sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="text-sm text-[var(--color-toffee)]">Produto novo</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <svg className="w-5 h-5 flex-shrink-0 text-[var(--color-sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm text-[var(--color-toffee)]">3 meses garantia</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <svg className="w-5 h-5 flex-shrink-0 text-[var(--color-sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span className="text-sm text-[var(--color-toffee)]">Peças completas</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <svg className="w-5 h-5 flex-shrink-0 text-[var(--color-sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-[var(--color-toffee)]">Entrega rápida</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
            SEÇÃO: VÍDEO DO PRODUTO (v2.0)
            Posição: primeiro item abaixo da dobra
            Só renderiza se video_product_url existir
            ============================================ */}
        <VideoProduct 
          videoUrl={product.video_product_url} 
          productName={product.name} 
        />

        {/* Seção: Para quem é */}
        <section className="mt-10 p-6 bg-[var(--color-sage-500)]/5 rounded-lg border border-[var(--color-sage-500)]/20">
          <h2 className="text-2xl font-semibold text-[var(--color-graphite)] mb-4">
            Para quem é o {product.name}?
          </h2>
          <ul className="space-y-3">
            {product.tv_max_size && (
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[var(--color-sage-500)] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-[var(--color-graphite)]">Quem tem TV de até {product.tv_max_size}&quot; e quer um móvel bonito sem gastar muito</span>
              </li>
            )}
            {/* ⭐ v2.12: Corrigido para incluir casas */}
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--color-sage-500)] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-[var(--color-graphite)]">Quem mora em apartamento ou casa compacta e precisa otimizar cada cantinho</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--color-sage-500)] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-[var(--color-graphite)]">Quem quer montar sozinho sem dor de cabeça - nível {formatDifficulty(product.assembly_difficulty)}, ~{product.assembly_time_minutes} minutos</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--color-sage-500)] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-[var(--color-graphite)]">Quem está em Curitiba ou região e não quer esperar semanas pela entrega</span>
            </li>
          </ul>
        </section>

        {/* Seção: Tira-Medo */}
        <section className="mt-10 p-6 bg-white rounded-lg border border-[var(--color-sand-light)]">
          <h2 className="text-2xl font-semibold text-[var(--color-graphite)] mb-4">
            Por que escolher o {product.name}?
          </h2>
          <ul className="space-y-3">
            {product.tv_max_size && (
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[var(--color-sage-500)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Suporta TV até {product.tv_max_size}&quot;</strong> - medida confirmada pelo fabricante</span>
              </li>
            )}
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--color-sage-500)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Montagem nível {formatDifficulty(product.assembly_difficulty)}</strong> - tempo estimado ~{product.assembly_time_minutes} min</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--color-sage-500)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Vem com manual + ferragens completas</strong> - sem peças faltando</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--color-sage-500)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Curitiba/RMC: entrega rápida</strong> - frota própria, sem surpresa no frete</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--color-sage-500)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Travou na montagem?</strong> Chama no WhatsApp que ajudamos</span>
            </li>
          </ul>
        </section>

        {/* ⭐ v2.13: Seção: Medidas - com ícones Lucide */}
        <section id="medidas-detalhadas" className="mt-8 scroll-mt-4">
          <h2 className="text-2xl font-semibold text-[var(--color-graphite)] mb-4">
            Medidas do produto
          </h2>
          <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-[var(--color-sand-light)]">
            {/* Largura */}
            <div className="flex flex-col items-center gap-2 text-center">
              <MoveHorizontal 
                className="w-6 h-6 text-[#8B7355]" 
                strokeWidth={2.5}
                aria-hidden="true"
              />
              <p className="text-2xl font-bold text-[var(--color-graphite)]">
                {larguraFormatada.valor} <span className="text-lg font-semibold">{larguraFormatada.unidade}</span>
              </p>
              <p className="text-sm text-[var(--color-toffee)]">Largura</p>
            </div>
            {/* Altura */}
            <div className="flex flex-col items-center gap-2 text-center">
              <MoveVertical 
                className="w-6 h-6 text-[#8B7355]" 
                strokeWidth={2.5}
                aria-hidden="true"
              />
              <p className="text-2xl font-bold text-[var(--color-graphite)]">
                {alturaFormatada.valor} <span className="text-lg font-semibold">{alturaFormatada.unidade}</span>
              </p>
              <p className="text-sm text-[var(--color-toffee)]">Altura</p>
            </div>
            {/* Profundidade */}
            <div className="flex flex-col items-center gap-2 text-center">
              <Box 
                className="w-6 h-6 text-[#8B7355]" 
                strokeWidth={2.5}
                aria-hidden="true"
              />
              <p className="text-2xl font-bold text-[var(--color-graphite)]">
                {profundidadeFormatada.valor} <span className="text-lg font-semibold">{profundidadeFormatada.unidade}</span>
              </p>
              <p className="text-sm text-[var(--color-toffee)]">Profundidade</p>
            </div>
          </div>
        </section>

        {/* Seção: Recursos de Montagem */}
        <RecursosMontagem
          manualUrl={product.manual_pdf_url}
          medidasImagemUrl={product.medidas_image_url}
          videoUrl={product.assembly_video_url}
          datasheetUrl={product.datasheet_url}
          productName={product.name}
        />

        {/* Seção: Descrição */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-[var(--color-graphite)] mb-4">
            Sobre o {product.name}
          </h2>
          <div className="prose prose-sm max-w-none text-[var(--color-graphite)] space-y-4">
            <p>
              O <strong>{product.name}</strong> é a escolha certa para quem busca um móvel bonito, funcional e com ótimo custo-benefício em Curitiba. {product.tv_max_size && `Se você tem uma TV de até ${product.tv_max_size} polegadas e quer organizar seu espaço sem gastar muito, esse é o móvel.`} Ideal pra apartamento ou casa compacta onde cada centímetro conta.
            </p>
            <div>
              <h3 className="text-base font-semibold text-[var(--color-graphite)] mb-2">Feito para durar</h3>
              <p>
                Estrutura em {product.main_material}{product.thickness_mm && ` ${product.thickness_mm}mm`}. Não é móvel descartável de loja grande - é móvel de verdade que aguenta o tranco do dia a dia, fácil de limpar e resistente à umidade de Curitiba.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[var(--color-graphite)] mb-2">Entrega rápida em Curitiba</h3>
              <p>
                Entregamos com frota própria em Curitiba e região metropolitana - Colombo, São José dos Pinhais, Araucária, Pinhais e mais. Prazo de até 3 dias úteis após o pagamento. Sem surpresa no frete: você vê o valor antes de finalizar.
              </p>
            </div>
          </div>
        </section>

        {/* ⭐ v2.11: Especificações Técnicas - com dimensões formatadas */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-[var(--color-graphite)] mb-4">
            Especificações técnicas
          </h2>
          <div className="bg-white rounded-lg border border-[var(--color-sand-light)] overflow-hidden">
            <table className="w-full text-sm">
              <caption className="sr-only">Especificações técnicas do {product.name}</caption>
              <tbody>
                <tr className="border-b border-[var(--color-sand-light)]">
                  <th scope="row" className="px-4 py-3 font-medium bg-[var(--color-cream)] w-1/3 text-left">Marca</th>
                  <td className="px-4 py-3">{product.brand || '-'}</td>
                </tr>
                <tr className="border-b border-[var(--color-sand-light)]">
                  <th scope="row" className="px-4 py-3 font-medium bg-[var(--color-cream)] text-left">Material</th>
                  <td className="px-4 py-3">
                    {/* v3.2.3: Usar apenas main_material (material_description tem dados comerciais antigos) */}
                    {product.main_material}{product.thickness_mm && ` ${product.thickness_mm}mm`}
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-sand-light)]">
                  <th scope="row" className="px-4 py-3 font-medium bg-[var(--color-cream)] text-left">Dimensões (L×A×P)</th>
                  <td className="px-4 py-3">{dimensoesCompletas}</td>
                </tr>
                <tr className="border-b border-[var(--color-sand-light)]">
                  <th scope="row" className="px-4 py-3 font-medium bg-[var(--color-cream)] text-left">Peso</th>
                  <td className="px-4 py-3">{product.weight_kg} kg</td>
                </tr>
                {/* Peso Suportado - v3.2.3: Para racks/painéis mostra orientação de consultar manual */}
                {product.weight_capacity && product.weight_capacity > 0 && (
                  <tr className="border-b border-[var(--color-sand-light)]">
                    <th scope="row" className="px-4 py-3 font-medium bg-[var(--color-cream)] text-left">Peso suportado</th>
                    <td className="px-4 py-3">
                      {(categoryType === 'rack' || categoryType === 'painel') 
                        ? 'Consulte manual de montagem acima'
                        : `Até ${product.weight_capacity} kg`
                      }
                    </td>
                  </tr>
                )}
                {product.tv_max_size && (
                  <tr className="border-b border-[var(--color-sand-light)]">
                    <th scope="row" className="px-4 py-3 font-medium bg-[var(--color-cream)] text-left">TV recomendada</th>
                    <td className="px-4 py-3">Até {product.tv_max_size} polegadas</td>
                  </tr>
                )}
                <tr className="border-b border-[var(--color-sand-light)]">
                  <th scope="row" className="px-4 py-3 font-medium bg-[var(--color-cream)] text-left">Fixa na parede?</th>
                  <td className="px-4 py-3">{product.requires_wall_mount ? 'Sim' : 'Não'}</td>
                </tr>
                <tr className="border-b border-[var(--color-sand-light)]">
                  <th scope="row" className="px-4 py-3 font-medium bg-[var(--color-cream)] text-left">Dificuldade montagem</th>
                  <td className="px-4 py-3 capitalize">{formatDifficulty(product.assembly_difficulty)}</td>
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-3 font-medium bg-[var(--color-cream)] text-left">Tempo de montagem</th>
                  <td className="px-4 py-3">~{product.assembly_time_minutes} minutos</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Seção: FAQ - SEO V2: Usa FAQs dinâmicas */}
        {faqs && faqs.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-[var(--color-graphite)] mb-4">
              Perguntas frequentes sobre o {product.name}
            </h2>
            <div className="bg-white rounded-lg border border-[var(--color-sand-light)] divide-y divide-[var(--color-sand-light)]">
              {faqs.map((faq: { id?: string; question: string; answer: string }, index: number) => (
                <details key={faq.id || index} className="group">
                  <summary className="flex justify-between items-center cursor-pointer p-4 hover:bg-[var(--color-cream)]/50 transition-colors">
                    <span className="font-medium text-[var(--color-graphite)]">{faq.question}</span>
                    <svg className="w-5 h-5 text-[var(--color-toffee)] group-open:rotate-180 transition-transform flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="px-4 pb-4 text-[var(--color-toffee)]">
                    {faq.answer.includes('WhatsApp') ? (
                      <span dangerouslySetInnerHTML={{ 
                        __html: faq.answer.replace(
                          /WhatsApp/g, 
                          `<a href="${whatsappLink}" class="text-[var(--color-sage-600)] hover:underline">WhatsApp</a>`
                        )
                      }} />
                    ) : (
                      faq.answer
                    )}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ============================================
            ⭐ NOVO v2.7: SEÇÃO DE AVALIAÇÕES/REVIEWS
            Posição: após FAQ, antes de Confiança
            ============================================ */}
        <ReviewsSection
          productId={product.id}
          productSlug={product.slug}
          productName={product.name}
          summary={reviewsSummary}
          reviews={reviews}
        />

        {/* Seção: Confiança */}
        <section className="mt-10 p-6 bg-[var(--color-cream)] rounded-lg">
          <h2 className="text-2xl font-semibold text-[var(--color-graphite)] mb-4">
            Compre com segurança
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-[var(--color-graphite)]">Nota Fiscal</h3>
              <p className="text-sm text-[var(--color-toffee)]">Todas as compras com NF-e</p>
            </div>
            <div>
              <h3 className="font-medium text-[var(--color-graphite)]">Garantia</h3>
              <p className="text-sm text-[var(--color-toffee)]">3 meses de garantia de fábrica</p>
            </div>
            <div>
              <h3 className="font-medium text-[var(--color-graphite)]">A Moveirama é Curitibana</h3>
              <p className="text-sm text-[var(--color-toffee)]">CNPJ e endereço no rodapé</p>
            </div>
          </div>
        </section>

        {/* ============================================
            ⭐ NOVO v2.8: VIZINHOS QUE APROVARAM
            Prova social regional com fotos de clientes
            ============================================ */}
        <VizinhosAprovaram 
          productId={product.id}
          productName={product.name}
        />

      </div>

      {/* ⭐ v2.9: Sticky Bar Mobile com BuyNowButton */}
      <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center gap-3 p-3 bg-white border-t border-[var(--color-sand-light)] shadow-lg md:hidden" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0))' }}>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-[var(--color-graphite)]">{formatPrice(product.price)}</p>
          <p className="text-xs text-[var(--color-toffee)]">ou {parcelas}x de {formatPrice(valorParcela)}</p>
        </div>
        <BuyNowButton product={buyButtonProduct} variant="sticky" />
      </div>
    </main>
  )
}
