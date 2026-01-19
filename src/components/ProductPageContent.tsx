import Link from 'next/link'
import RecursosMontagem from '@/components/RecursosMontagem'
import ProductGallery from '@/components/ProductGallery'
import Breadcrumb from '@/components/Breadcrumb'
import MedidasCompactas from '@/components/MedidasCompactas'
import ShippingCalculator from '@/components/ShippingCalculator'

// SEO V2: Imports das funções de SEO
import { 
  generateProductH1, 
  generateProductFAQs, 
  generateProductSchema,
  generateFAQSchema,
  inferCategoryType 
} from '@/lib/seo'

// Types
interface BreadcrumbItem {
  label: string
  href?: string
}

interface ProductPageContentProps {
  product: any // TODO: tipar corretamente
  breadcrumbItems: BreadcrumbItem[]
  subcategorySlug: string
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

export default function ProductPageContent({ 
  product, 
  breadcrumbItems,
  subcategorySlug 
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
    variant_name: defaultVariant?.name
  })

  // FAQs: usa do banco se existir, senão gera automaticamente
  const faqs = product.faqs?.length > 0 
    ? product.faqs 
    : generateProductFAQs(product, subcategorySlug)

  // ============================================
  // SEO V2: Schema.org Product (com shippingDetails)
  // ============================================
  const productSchema = generateProductSchema({
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
    variants: product.variants
  }, canonicalUrl)

  // ============================================
  // SEO V2: Schema.org FAQPage (dinâmico)
  // ============================================
  const faqSchema = faqs.length > 0 ? generateFAQSchema(faqs) : null

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
            
            {/* Resumo IA-friendly (SEO/AIO) */}
            <p className="text-sm text-[var(--color-toffee)] mb-3 leading-relaxed break-words">
              <strong>{product.name}</strong> - móvel de madeira {product.tv_max_size ? `para TV até ${product.tv_max_size} polegadas` : ''}, {formatPrice(product.price)} à vista ou {parcelas}x {formatPrice(valorParcela)} sem juros. {product.main_material}{product.thickness_mm && ` ${product.thickness_mm}mm`}, montagem {product.assembly_difficulty} (~{product.assembly_time_minutes}min). Entrega própria em Curitiba e região metropolitana em até 2 dias úteis.
            </p>
            
            {/* SKU */}
            <p className="text-sm text-[var(--color-toffee)] mb-4">
              SKU: {product.sku}
            </p>

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
              
              {/* Preço Pix */}
              <div className="inline-flex items-center gap-2 mt-3 px-3 py-2 bg-[var(--color-sage-500)]/10 rounded-lg">
                <span className="text-[var(--color-sage-700)] font-semibold">
                  {formatPrice(pixPrice)} no Pix
                </span>
                <span className="text-xs font-semibold text-[var(--color-sage-600)] bg-[var(--color-sage-500)]/20 px-2 py-0.5 rounded">
                  5% OFF
                </span>
              </div>

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

            {/* Variantes (cores) */}
            {product.variants && product.variants.length > 1 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-[var(--color-graphite)] mb-2">
                  Cor: <span className="font-normal">{defaultVariant?.name}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((variant: { id: string; name: string; is_default: boolean }) => (
                    <button
                      key={variant.id}
                      className={`px-3 py-2 text-sm rounded-md border-2 transition-colors ${
                        variant.is_default
                          ? 'border-[var(--color-sage-500)] bg-[var(--color-sage-500)]/10'
                          : 'border-[var(--color-sand-light)] hover:border-[var(--color-sage-500)]'
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Calculadora de Frete */}
            <div className="mb-6">
              <ShippingCalculator />
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col gap-3 mb-6">
              <button className="btn-primary w-full text-lg">
                Comprar agora
              </button>
              <a href={whatsappLink} target="_blank" rel="noopener" className="btn-whatsapp w-full text-center">
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
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--color-sage-500)] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-[var(--color-graphite)]">Quem mora em apartamento compacto e precisa otimizar cada cantinho</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--color-sage-500)] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-[var(--color-graphite)]">Quem quer montar sozinho sem dor de cabeça - nível {product.assembly_difficulty}, ~{product.assembly_time_minutes} minutos</span>
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
              <span><strong>Montagem nível {product.assembly_difficulty}</strong> - tempo estimado ~{product.assembly_time_minutes} min</span>
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

        {/* Seção: Medidas */}
        <section id="medidas-detalhadas" className="mt-8 scroll-mt-4">
          <h2 className="text-2xl font-semibold text-[var(--color-graphite)] mb-4">
            Medidas do produto
          </h2>
          <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-[var(--color-sand-light)]">
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--color-graphite)]">{product.width_cm}</p>
              <p className="text-sm text-[var(--color-toffee)]">Largura (cm)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--color-graphite)]">{product.height_cm}</p>
              <p className="text-sm text-[var(--color-toffee)]">Altura (cm)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--color-graphite)]">{product.depth_cm}</p>
              <p className="text-sm text-[var(--color-toffee)]">Profundidade (cm)</p>
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
              O <strong>{product.name}</strong> é a escolha certa para quem busca um móvel bonito, funcional e com ótimo custo-benefício em Curitiba. {product.tv_max_size && `Se você tem uma TV de até ${product.tv_max_size} polegadas e quer organizar seu espaço sem gastar muito, esse é o móvel.`} Ideal pra apartamento compacto onde cada centímetro conta.
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
                Entregamos com frota própria em Curitiba e região metropolitana - Colombo, São José dos Pinhais, Araucária, Pinhais e mais. Prazo de até 2 dias úteis após o pagamento. Sem surpresa no frete: você vê o valor antes de finalizar.
              </p>
            </div>
          </div>
        </section>

        {/* Seção: Especificações Técnicas */}
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
                    {product.material_description || (
                      <>{product.main_material}{product.thickness_mm && ` ${product.thickness_mm}mm`}</>
                    )}
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-sand-light)]">
                  <th scope="row" className="px-4 py-3 font-medium bg-[var(--color-cream)] text-left">Dimensões (L×A×P)</th>
                  <td className="px-4 py-3">{product.width_cm} × {product.height_cm} × {product.depth_cm} cm</td>
                </tr>
                <tr className="border-b border-[var(--color-sand-light)]">
                  <th scope="row" className="px-4 py-3 font-medium bg-[var(--color-cream)] text-left">Peso</th>
                  <td className="px-4 py-3">{product.weight_kg} kg</td>
                </tr>
                {/* Peso Suportado - exibe apenas se existir */}
                {product.weight_capacity && product.weight_capacity > 0 && (
                  <tr className="border-b border-[var(--color-sand-light)]">
                    <th scope="row" className="px-4 py-3 font-medium bg-[var(--color-cream)] text-left">Peso suportado</th>
                    <td className="px-4 py-3">Até {product.weight_capacity} kg</td>
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
                  <td className="px-4 py-3 capitalize">{product.assembly_difficulty}</td>
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
      </div>

      {/* Sticky Bar Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center gap-3 p-3 bg-white border-t border-[var(--color-sand-light)] shadow-lg md:hidden" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0))' }}>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-[var(--color-graphite)]">{formatPrice(product.price)}</p>
          <p className="text-xs text-[var(--color-toffee)]">ou {parcelas}x de {formatPrice(valorParcela)}</p>
        </div>
        <button className="btn-primary flex-shrink-0 px-6">
          Comprar
        </button>
      </div>
    </main>
  )
}
