import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import RecursosMontagem from '@/components/RecursosMontagem'

// Função para limpar markdown da descrição
function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown
}

// Busca produto com detalhes
async function getProduct(slug: string) {
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:product_variants(*),
      images:product_images(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !product) return null
  return product
}

// Metadata dinâmica para SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  
  if (!product) return { title: 'Produto não encontrado' }
  
  const mainImage = product.images?.find((img: { image_type: string }) => img.image_type === 'principal') || product.images?.[0]
  
  return {
    title: product.meta_title || `${product.name} | Moveirama`,
    description: product.meta_description || product.short_description,
    openGraph: {
      title: `${product.name} | Moveirama`,
      description: product.short_description,
      url: `https://moveirama.com.br/produto/${slug}`,
      siteName: 'Moveirama',
      images: mainImage ? [
        {
          url: mainImage.cloudinary_path,
          width: 800,
          height: 800,
          alt: product.name,
        }
      ] : [],
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.short_description,
      images: mainImage ? [mainImage.cloudinary_path] : [],
    },
    alternates: {
      canonical: `https://moveirama.com.br/produto/${slug}`,
    },
  }
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

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const { parcelas, valorParcela } = getInstallments(product.price)
  const pixPrice = product.price * 0.95 // 5% desconto no Pix
  const mainImage = product.images?.find((img: { image_type: string }) => img.image_type === 'principal') || product.images?.[0]
  const defaultVariant = product.variants?.find((v: { is_default: boolean }) => v.is_default) || product.variants?.[0]

  // WhatsApp link
  const whatsappNumber = '5541999999999' // TODO: Configurar número real
  const whatsappMessage = encodeURIComponent(`Olá! Tenho interesse no ${product.name}. Podem me ajudar?`)
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  // Schema.org Product
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.short_description,
    "image": product.images?.map((img: { cloudinary_path: string }) => img.cloudinary_path) || [],
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Moveirama"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://moveirama.com.br/produto/${slug}`,
      "priceCurrency": "BRL",
      "price": product.price,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "Moveirama"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "BR",
          "addressRegion": "PR"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 3,
            "unitCode": "DAY"
          }
        }
      }
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Material",
        "value": product.main_material
      },
      {
        "@type": "PropertyValue",
        "name": "Largura",
        "value": `${product.width_cm} cm`
      },
      {
        "@type": "PropertyValue",
        "name": "Altura",
        "value": `${product.height_cm} cm`
      },
      {
        "@type": "PropertyValue",
        "name": "Profundidade",
        "value": `${product.depth_cm} cm`
      }
    ]
  }

  // Schema.org BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Início",
        "item": "https://moveirama.com.br"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": product.category?.name,
        "item": `https://moveirama.com.br/categoria/${product.category?.slug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `https://moveirama.com.br/produto/${slug}`
      }
    ]
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

      {/* Container */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        
        {/* Breadcrumb */}
        <nav className="text-sm mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-[var(--color-toffee)]">
            <li><Link href="/" className="hover:underline">Início</Link></li>
            <li>/</li>
            <li>
              <Link href={`/categoria/${product.category?.slug}`} className="hover:underline">
                {product.category?.name}
              </Link>
            </li>
            <li>/</li>
            <li className="text-[var(--color-graphite)]">{product.name}</li>
          </ol>
        </nav>

        {/* Grid Principal */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          
          {/* Coluna Esquerda: Galeria */}
          <div>
            <div className="relative aspect-square bg-[var(--color-cream)] rounded-lg overflow-hidden">
              {mainImage ? (
                <Image
                  src={mainImage.cloudinary_path}
                  alt={mainImage.alt_text || product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-[var(--color-toffee)]">
                  Sem imagem
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {product.images.map((img: { id: string; cloudinary_path: string; alt_text: string | null }, index: number) => (
                  <div 
                    key={img.id} 
                    className="relative w-16 h-16 flex-shrink-0 bg-[var(--color-cream)] rounded border-2 border-[var(--color-sand-light)] cursor-pointer hover:border-[var(--color-sage-500)]"
                  >
                    <Image
                      src={img.cloudinary_path}
                      alt={img.alt_text || `${product.name} ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="64px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Coluna Direita: Informações */}
          <div>
            {/* Título */}
            <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-graphite)] mb-2">
              {product.name}
            </h1>
            
            {/* SKU e Marca */}
            <p className="text-sm text-[var(--color-toffee)] mb-4">
              {product.brand && <span>{product.brand} • </span>}
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
            <div className="mb-6 p-4 bg-[var(--color-cream)] rounded-lg">
              <label className="block text-sm font-medium text-[var(--color-graphite)] mb-2">
                Calcular frete e prazo
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Digite seu CEP"
                  maxLength={9}
                  className="flex-1 px-4 py-3 text-base border border-[var(--color-sand-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/40 focus:border-[var(--color-sage-500)]"
                />
                <button className="px-4 py-3 text-sm font-semibold text-white bg-[var(--color-graphite)] rounded-lg hover:bg-[var(--color-espresso)] transition-colors">
                  Calcular
                </button>
              </div>
              <a href="https://buscacepinter.correios.com.br/" target="_blank" rel="noopener" className="text-sm text-[var(--color-sage-600)] hover:underline mt-2 inline-block">
                Não sei meu CEP
              </a>
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
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-[var(--color-sand-light)]">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--color-sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-[var(--color-toffee)]">Nota fiscal</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--color-sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm text-[var(--color-toffee)]">Garantia</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--color-sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span className="text-sm text-[var(--color-toffee)]">Troca fácil</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--color-sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-[var(--color-toffee)]">Entrega rápida</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção: Tira-Medo (Bullets) */}
        <section className="mt-10 p-6 bg-white rounded-lg border border-[var(--color-sand-light)]">
          <h2 className="text-lg font-semibold text-[var(--color-graphite)] mb-4">
            Por que escolher o {product.name}?
          </h2>
          <ul className="space-y-3">
            {product.tv_max_size && (
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[var(--color-sage-500)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Suporta TV até {product.tv_max_size}&quot;</strong> — medida confirmada pelo fabricante</span>
              </li>
            )}
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--color-sage-500)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Montagem nível {product.assembly_difficulty}</strong> — tempo estimado ~{product.assembly_time_minutes} min</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--color-sage-500)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Vem com manual + ferragens completas</strong> — sem peças faltando</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--color-sage-500)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Curitiba/RMC: entrega rápida</strong> — frota própria, sem surpresa no frete</span>
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
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-[var(--color-graphite)] mb-4">
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

        {/* Seção: Tudo pra montar tranquilo */}
        <RecursosMontagem
          manualUrl={product.manual_url}
          medidasImagemUrl={product.medidas_image_url}
          videoUrl={product.video_url}
          productName={product.name}
        />

        {/* Seção: Descrição */}
        {product.long_description && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-[var(--color-graphite)] mb-4">
              Sobre o produto
            </h2>
            <div className="prose prose-sm max-w-none text-[var(--color-graphite)]">
              <p className="whitespace-pre-line">{cleanMarkdown(product.long_description)}</p>
            </div>
          </section>
        )}

        {/* Seção: Especificações Técnicas */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-[var(--color-graphite)] mb-4">
            Especificações técnicas
          </h2>
          <div className="bg-white rounded-lg border border-[var(--color-sand-light)] overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-[var(--color-sand-light)]">
                  <td className="px-4 py-3 font-medium bg-[var(--color-cream)] w-1/3">Marca</td>
                  <td className="px-4 py-3">{product.brand || '-'}</td>
                </tr>
                <tr className="border-b border-[var(--color-sand-light)]">
                  <td className="px-4 py-3 font-medium bg-[var(--color-cream)]">Material</td>
                  <td className="px-4 py-3">{product.main_material}{product.thickness_mm && ` ${product.thickness_mm}mm`}</td>
                </tr>
                <tr className="border-b border-[var(--color-sand-light)]">
                  <td className="px-4 py-3 font-medium bg-[var(--color-cream)]">Dimensões (L×A×P)</td>
                  <td className="px-4 py-3">{product.width_cm} × {product.height_cm} × {product.depth_cm} cm</td>
                </tr>
                <tr className="border-b border-[var(--color-sand-light)]">
                  <td className="px-4 py-3 font-medium bg-[var(--color-cream)]">Peso</td>
                  <td className="px-4 py-3">{product.weight_kg} kg</td>
                </tr>
                {product.tv_max_size && (
                  <tr className="border-b border-[var(--color-sand-light)]">
                    <td className="px-4 py-3 font-medium bg-[var(--color-cream)]">TV recomendada</td>
                    <td className="px-4 py-3">Até {product.tv_max_size} polegadas</td>
                  </tr>
                )}
                <tr className="border-b border-[var(--color-sand-light)]">
                  <td className="px-4 py-3 font-medium bg-[var(--color-cream)]">Fixa na parede?</td>
                  <td className="px-4 py-3">{product.requires_wall_mount ? 'Sim' : 'Não'}</td>
                </tr>
                <tr className="border-b border-[var(--color-sand-light)]">
                  <td className="px-4 py-3 font-medium bg-[var(--color-cream)]">Dificuldade montagem</td>
                  <td className="px-4 py-3 capitalize">{product.assembly_difficulty}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium bg-[var(--color-cream)]">Tempo de montagem</td>
                  <td className="px-4 py-3">~{product.assembly_time_minutes} minutos</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Seção: Confiança */}
        <section className="mt-10 p-6 bg-[var(--color-cream)] rounded-lg">
          <h2 className="text-lg font-semibold text-[var(--color-graphite)] mb-4">
            Compre com segurança
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-[var(--color-graphite)]">Nota Fiscal</h3>
              <p className="text-sm text-[var(--color-toffee)]">Todas as compras com NF-e</p>
            </div>
            <div>
              <h3 className="font-medium text-[var(--color-graphite)]">Garantia</h3>
              <p className="text-sm text-[var(--color-toffee)]">Garantia legal + fabricante</p>
            </div>
            <div>
              <h3 className="font-medium text-[var(--color-graphite)]">Empresa real</h3>
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
