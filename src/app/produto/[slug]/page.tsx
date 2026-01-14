import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import RecursosMontagem from '@/components/RecursosMontagem'
import ProductGallery from '@/components/ProductGallery'

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

  // Schema.org FAQPage (SEO + AIO optimization)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Qual tamanho de TV cabe no Rack Théo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O Rack Théo acomoda TVs de até 55 polegadas. Com 136cm de largura, ele suporta TVs de até 125cm — sobra espaço nas laterais pra ficar bonito. Se sua TV é de 43\" ou 50\", também serve tranquilo."
        }
      },
      {
        "@type": "Question",
        "name": "É difícil de montar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nada! Montagem nível fácil, tempo estimado de 40 minutos. Vem com manual ilustrado e todas as ferragens — nada de peça faltando. Travou em algum passo? Chama no WhatsApp que ajudamos na hora."
        }
      },
      {
        "@type": "Question",
        "name": "Vem com manual e parafusos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! O Rack Théo vem com manual completo, parafusos, buchas e todo o kit de ferragens. Só precisa de chave Phillips pra montar. Tudo na caixa, sem precisar comprar nada separado."
        }
      },
      {
        "@type": "Question",
        "name": "Qual o material? É resistente?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Estrutura em MDF 15mm e pés reforçados em MDF 25mm. MDF é mais resistente que MDP — aguenta melhor o peso e não lasca fácil. Não é móvel descartável: é móvel de verdade que dura."
        }
      },
      {
        "@type": "Question",
        "name": "Precisa furar a parede?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Não precisa! O Rack Théo fica apoiado no chão, sem necessidade de fixação na parede. É só montar, colocar no lugar e pronto. Perfeito pra quem mora de aluguel ou não quer complicação."
        }
      },
      {
        "@type": "Question",
        "name": "Aguenta o peso da minha TV?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O tampo superior suporta tranquilamente TVs de até 55 polegadas — incluindo soundbar, videogame e controles em cima. A estrutura de MDF 15mm e os pés de MDF 25mm garantem estabilidade."
        }
      },
      {
        "@type": "Question",
        "name": "Vocês entregam em Curitiba? Qual o prazo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! Entrega própria em Curitiba e região metropolitana (Colombo, São José dos Pinhais, Araucária, Pinhais e mais). Prazo de até 2 dias úteis após o pagamento. Frota nossa, sem surpresa."
        }
      },
      {
        "@type": "Question",
        "name": "E se faltar alguma peça na caixa?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Difícil acontecer, mas se faltar: tira foto, manda no WhatsApp com o número do pedido e a gente resolve rapidinho. Não deixamos cliente na mão."
        }
      },
      {
        "@type": "Question",
        "name": "Posso devolver se não gostar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Claro! Você tem 7 dias pra se arrepender, conforme o Código de Defesa do Consumidor. Chegou e não era o que esperava? Chama no WhatsApp que orientamos a troca ou devolução sem enrolação."
        }
      },
      {
        "@type": "Question",
        "name": "Vocês são de Curitiba mesmo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! Somos de Curitiba, com CNPJ e endereço no rodapé do site. Entrega com frota própria — a gente conhece as ruas da cidade. Qualquer dúvida, o WhatsApp é de verdade e responde rápido."
        }
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
            <ProductGallery 
              images={product.images || []} 
              productName={product.name} 
            />
          </div>

          {/* Coluna Direita: Informações */}
          <div>
            {/* Título */}
            <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-graphite)] mb-2">
              {product.name}
            </h1>
            
            {/* Resumo IA-friendly (SEO/AIO) */}
            <p className="text-sm text-[var(--color-toffee)] mb-3 leading-relaxed">
              <strong>{product.name}</strong> — rack de madeira para TV até {product.tv_max_size || 55} polegadas, {formatPrice(product.price)} à vista ou {parcelas}x {formatPrice(valorParcela)} sem juros. {product.main_material}{product.thickness_mm && ` ${product.thickness_mm}mm`}, montagem fácil (~{product.assembly_time_minutes}min). Entrega própria em Curitiba e região metropolitana em até 2 dias úteis.
            </p>
            
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="text-sm text-[var(--color-toffee)]">Produto novo</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--color-sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm text-[var(--color-toffee)]">3 meses de garantia</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--color-sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span className="text-sm text-[var(--color-toffee)]">Peças completas</span>
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

        {/* Seção: Para quem é (identificação emocional) */}
        <section className="mt-10 p-6 bg-[var(--color-sage-500)]/5 rounded-lg border border-[var(--color-sage-500)]/20">
          <h2 className="text-lg font-semibold text-[var(--color-graphite)] mb-4">
            Para quem é o {product.name}?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--color-sage-500)] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-[var(--color-graphite)]">Quem tem TV de 43&quot; a 55&quot; e quer um rack bonito sem gastar muito</span>
            </li>
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
              <span className="text-[var(--color-graphite)]">Quem quer montar sozinho sem dor de cabeça — nível fácil, ~40 minutos</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--color-sage-500)] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-[var(--color-graphite)]">Quem está em Curitiba ou região e não quer esperar semanas pela entrega</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--color-sage-500)] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-[var(--color-graphite)]">Quem já teve problema com móvel frágil e quer algo que aguenta o tranco</span>
            </li>
          </ul>
        </section>

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

        {/* Seção: Descrição Expandida (SEO/AIO optimized) */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-[var(--color-graphite)] mb-4">
            Sobre o {product.name}
          </h2>
          <div className="prose prose-sm max-w-none text-[var(--color-graphite)] space-y-4">
            {/* Bloco 1: Abertura */}
            <p>
              O {product.name} é a escolha certa para quem busca um rack para TV bonito, funcional e com ótimo custo-benefício em Curitiba. Se você tem uma TV de até {product.tv_max_size || 55} polegadas e quer organizar a sala sem gastar muito, esse é o móvel. Ideal pra apartamento compacto onde cada centímetro conta.
            </p>
            
            {/* Bloco 2: Design */}
            <div>
              <h3 className="text-base font-semibold text-[var(--color-graphite)] mb-2">Design que faz diferença</h3>
              <p>
                Com design retrô e cantos arredondados, o {product.name} traz um charme especial para sua sala. Diferente dos racks quadrados e sem graça, ele tem visual leve e moderno. As laterais e fundo vazados deixam o ambiente mais arejado — perfeito pra salas pequenas que precisam parecer maiores.
              </p>
            </div>
            
            {/* Bloco 3: Qualidade */}
            <div>
              <h3 className="text-base font-semibold text-[var(--color-graphite)] mb-2">Feito para durar</h3>
              <p>
                Estrutura em {product.main_material}{product.thickness_mm && ` ${product.thickness_mm}mm`} e pés reforçados em MDF 25mm. MDF é mais resistente que MDP: aguenta melhor o peso, não lasca fácil e dura mais. Não é móvel descartável de loja grande — é móvel de verdade que aguenta o tranco do dia a dia, fácil de limpar e resistente à umidade de Curitiba.
              </p>
            </div>
            
            {/* Bloco 4: Compatibilidade */}
            <div>
              <h3 className="text-base font-semibold text-[var(--color-graphite)] mb-2">Compatibilidade com sua TV</h3>
              <p>
                O {product.name} tem {product.width_cm}cm de largura e acomoda TVs de até {product.tv_max_size || 55} polegadas (largura máxima da TV: {Math.round((product.width_cm || 136) * 0.92)}cm). Funciona bem com Samsung, LG, TCL, Philco e outras marcas. Cabe também soundbar, videogame e controles em cima. Quer confirmar se a sua TV cabe? <a href={whatsappLink} className="text-[var(--color-sage-600)] hover:underline">Manda as medidas no WhatsApp</a> que a gente confere.
              </p>
            </div>
            
            {/* Bloco 5: Entrega */}
            <div>
              <h3 className="text-base font-semibold text-[var(--color-graphite)] mb-2">Entrega rápida em Curitiba</h3>
              <p>
                Entregamos com frota própria em Curitiba e região metropolitana — Colombo, São José dos Pinhais, Araucária, Pinhais e mais. Prazo de até 2 dias úteis após o pagamento. Sem surpresa no frete: você vê o valor antes de finalizar. Dúvida? <a href={whatsappLink} className="text-[var(--color-sage-600)] hover:underline">WhatsApp de verdade</a>, resposta rápida.
              </p>
            </div>
          </div>
        </section>

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

        {/* Seção: FAQ - Perguntas Frequentes */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-[var(--color-graphite)] mb-4">
            Perguntas frequentes sobre o {product.name}
          </h2>
          <div className="bg-white rounded-lg border border-[var(--color-sand-light)] divide-y divide-[var(--color-sand-light)]">
            
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer p-4 hover:bg-[var(--color-cream)]/50 transition-colors">
                <span className="font-medium text-[var(--color-graphite)]">Qual tamanho de TV cabe no Rack Théo?</span>
                <svg className="w-5 h-5 text-[var(--color-toffee)] group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-4 pb-4 text-[var(--color-toffee)]">O Rack Théo acomoda TVs de até 55 polegadas. Com 136cm de largura, ele suporta TVs de até 125cm — sobra espaço nas laterais pra ficar bonito. Se sua TV é de 43&quot; ou 50&quot;, também serve tranquilo.</p>
            </details>
            
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer p-4 hover:bg-[var(--color-cream)]/50 transition-colors">
                <span className="font-medium text-[var(--color-graphite)]">É difícil de montar?</span>
                <svg className="w-5 h-5 text-[var(--color-toffee)] group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-4 pb-4 text-[var(--color-toffee)]">Nada! Montagem nível fácil, tempo estimado de 40 minutos. Vem com manual ilustrado e todas as ferragens — nada de peça faltando. Travou em algum passo? <a href={whatsappLink} className="text-[var(--color-sage-600)] hover:underline">Chama no WhatsApp</a> que ajudamos na hora.</p>
            </details>
            
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer p-4 hover:bg-[var(--color-cream)]/50 transition-colors">
                <span className="font-medium text-[var(--color-graphite)]">Vem com manual e parafusos?</span>
                <svg className="w-5 h-5 text-[var(--color-toffee)] group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-4 pb-4 text-[var(--color-toffee)]">Sim! O Rack Théo vem com manual completo, parafusos, buchas e todo o kit de ferragens. Só precisa de chave Phillips pra montar. Tudo na caixa, sem precisar comprar nada separado.</p>
            </details>
            
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer p-4 hover:bg-[var(--color-cream)]/50 transition-colors">
                <span className="font-medium text-[var(--color-graphite)]">Qual o material? É resistente?</span>
                <svg className="w-5 h-5 text-[var(--color-toffee)] group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-4 pb-4 text-[var(--color-toffee)]">Estrutura em MDF 15mm e pés reforçados em MDF 25mm. MDF é mais resistente que MDP — aguenta melhor o peso e não lasca fácil. Não é móvel descartável: é móvel de verdade que dura.</p>
            </details>
            
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer p-4 hover:bg-[var(--color-cream)]/50 transition-colors">
                <span className="font-medium text-[var(--color-graphite)]">Precisa furar a parede?</span>
                <svg className="w-5 h-5 text-[var(--color-toffee)] group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-4 pb-4 text-[var(--color-toffee)]">Não precisa! O Rack Théo fica apoiado no chão, sem necessidade de fixação na parede. É só montar, colocar no lugar e pronto. Perfeito pra quem mora de aluguel ou não quer complicação.</p>
            </details>
            
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer p-4 hover:bg-[var(--color-cream)]/50 transition-colors">
                <span className="font-medium text-[var(--color-graphite)]">Aguenta o peso da minha TV?</span>
                <svg className="w-5 h-5 text-[var(--color-toffee)] group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-4 pb-4 text-[var(--color-toffee)]">O tampo superior suporta tranquilamente TVs de até 55 polegadas — incluindo soundbar, videogame e controles em cima. A estrutura de MDF 15mm e os pés de MDF 25mm garantem estabilidade.</p>
            </details>
            
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer p-4 hover:bg-[var(--color-cream)]/50 transition-colors">
                <span className="font-medium text-[var(--color-graphite)]">Vocês entregam em Curitiba? Qual o prazo?</span>
                <svg className="w-5 h-5 text-[var(--color-toffee)] group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-4 pb-4 text-[var(--color-toffee)]">Sim! Entrega própria em Curitiba e região metropolitana (Colombo, São José dos Pinhais, Araucária, Pinhais e mais). Prazo de até 2 dias úteis após o pagamento. Frota nossa, sem surpresa.</p>
            </details>
            
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer p-4 hover:bg-[var(--color-cream)]/50 transition-colors">
                <span className="font-medium text-[var(--color-graphite)]">E se faltar alguma peça na caixa?</span>
                <svg className="w-5 h-5 text-[var(--color-toffee)] group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-4 pb-4 text-[var(--color-toffee)]">Difícil acontecer, mas se faltar: tira foto, manda no <a href={whatsappLink} className="text-[var(--color-sage-600)] hover:underline">WhatsApp</a> com o número do pedido e a gente resolve rapidinho. Não deixamos cliente na mão.</p>
            </details>
            
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer p-4 hover:bg-[var(--color-cream)]/50 transition-colors">
                <span className="font-medium text-[var(--color-graphite)]">Posso devolver se não gostar?</span>
                <svg className="w-5 h-5 text-[var(--color-toffee)] group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-4 pb-4 text-[var(--color-toffee)]">Claro! Você tem 7 dias pra se arrepender, conforme o Código de Defesa do Consumidor. Chegou e não era o que esperava? <a href={whatsappLink} className="text-[var(--color-sage-600)] hover:underline">Chama no WhatsApp</a> que orientamos a troca ou devolução sem enrolação.</p>
            </details>
            
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer p-4 hover:bg-[var(--color-cream)]/50 transition-colors">
                <span className="font-medium text-[var(--color-graphite)]">Vocês são de Curitiba mesmo?</span>
                <svg className="w-5 h-5 text-[var(--color-toffee)] group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-4 pb-4 text-[var(--color-toffee)]">Sim! Somos de Curitiba, com CNPJ e endereço no rodapé do site. Entrega com frota própria — a gente conhece as ruas da cidade. Qualquer dúvida, o <a href={whatsappLink} className="text-[var(--color-sage-600)] hover:underline">WhatsApp</a> é de verdade e responde rápido.</p>
            </details>
            
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
