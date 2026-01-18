import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { 
  getParentCategory, 
  getSubcategory, 
  getProductsByCategory,
  getSubcategoryBySlug,
  getProductBySubcategoryAndSlug,
  getParentOfSubcategory,
  getSubcategories,
  SortOption 
} from '@/lib/supabase'

// Componentes de Listagem
import Breadcrumb from '@/components/Breadcrumb'
import ProductCardListing from '@/components/ProductCardListing'
import SortControl from '@/components/SortControl'
import Pagination from '@/components/Pagination'
import EmptyState from '@/components/EmptyState'
import SubcategoryCard from '@/components/SubcategoryCard'

// Componentes de Produto
import ProductPageContent from '@/components/ProductPageContent'

// FORÇA REVALIDAÇÃO A CADA REQUEST
export const dynamic = 'force-dynamic'

// ============================================
// CONFIGURAÇÃO DE LINHAS (Escritório)
// ============================================

interface LinhaConfig {
  name: string
  description: string
  parent: string
  subcategorias: string[]
}

const LINHAS: Record<string, LinhaConfig> = {
  'home-office': {
    name: 'Home Office',
    description: 'Móveis práticos e acessíveis para montar seu escritório em casa',
    parent: 'escritorio',
    subcategorias: ['escrivaninhas', 'gaveteiros', 'estantes', 'mesas-balcoes']
  },
  // FUTURO: Descomentar quando Linha Executiva entrar
  // 'linha-executiva': {
  //   name: 'Linha Executiva',
  //   description: 'Móveis sofisticados para ambientes corporativos',
  //   parent: 'escritorio',
  //   subcategorias: ['mesas-executivas', 'armarios', 'estantes-executivas', 'gaveteiros-executivos']
  // },
}

// Categorias pai conhecidas
const PARENT_CATEGORIES = ['casa', 'escritorio']

const PRODUCTS_PER_PAGE = 12

// ============================================
// TIPOS
// ============================================

interface PageProps {
  params: Promise<{ category: string; slug: string[] }>
  searchParams: Promise<{ page?: string; sort?: string }>
}

type PageType = 'linha' | 'listing' | 'listing-legacy' | 'product' | 'not-found'

interface DetectionResult {
  type: PageType
  linha?: string
  subcategory?: string
  productSlug?: string
}

// ============================================
// DETECÇÃO DE TIPO DE PÁGINA
// ============================================

async function detectPageType(category: string, slug: string[]): Promise<DetectionResult> {
  // slug pode ter 1 ou 2 elementos:
  // 1 elemento: [subcategory] ou [linha] ou [productSlug]
  // 2 elementos: [linha, subcategory]

  if (PARENT_CATEGORIES.includes(category)) {
    // Category é pai (casa, escritorio)
    
    if (slug.length === 1) {
      const firstSlug = slug[0]
      
      // Verifica se é uma linha (ex: home-office)
      if (LINHAS[firstSlug] && LINHAS[firstSlug].parent === category) {
        return { type: 'linha', linha: firstSlug }
      }
      
      // Verifica se é subcategoria direta (formato antigo: /escritorio/escrivaninhas)
      const subcategoryData = await getSubcategory(category, firstSlug)
      if (subcategoryData) {
        return { type: 'listing-legacy', subcategory: firstSlug }
      }
      
      return { type: 'not-found' }
    }
    
    if (slug.length === 2) {
      const [linha, subcategory] = slug
      
      // Verifica se linha existe e pertence a esta categoria
      if (LINHAS[linha] && LINHAS[linha].parent === category) {
        // Verifica se subcategoria pertence a esta linha
        if (LINHAS[linha].subcategorias.includes(subcategory)) {
          // Busca a subcategoria no banco (ela está vinculada à categoria pai, não à linha)
          const subcategoryData = await getSubcategory(category, subcategory)
          if (subcategoryData) {
            return { type: 'listing', linha, subcategory }
          }
        }
      }
      
      return { type: 'not-found' }
    }
    
    return { type: 'not-found' }
  }
  
  // Category NÃO é pai → pode ser produto
  // Formato: /subcategoria/produto-slug
  if (slug.length === 1) {
    const productSlug = slug[0]
    const product = await getProductBySubcategoryAndSlug(category, productSlug)
    if (product) {
      return { type: 'product', subcategory: category, productSlug }
    }
  }
  
  return { type: 'not-found' }
}

// ============================================
// METADATA
// ============================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params
  const detection = await detectPageType(category, slug)
  
  if (detection.type === 'linha' && detection.linha) {
    const linha = LINHAS[detection.linha]
    return {
      title: `${linha.name} | Moveirama`,
      description: linha.description,
      openGraph: {
        title: `${linha.name} | Moveirama`,
        description: linha.description,
      }
    }
  }
  
  if ((detection.type === 'listing' || detection.type === 'listing-legacy') && detection.subcategory) {
    const subcategoryData = await getSubcategory(category, detection.subcategory)
    if (!subcategoryData) {
      return { title: 'Categoria não encontrada | Moveirama' }
    }
    return {
      title: `${subcategoryData.name} | Moveirama`,
      description: subcategoryData.description || 
        `Confira nossa linha de ${subcategoryData.name.toLowerCase()} com preço justo e entrega rápida em Curitiba e região.`,
      openGraph: {
        title: `${subcategoryData.name} | Moveirama`,
        description: subcategoryData.description || undefined,
      }
    }
  }
  
  if (detection.type === 'product' && detection.subcategory && detection.productSlug) {
    const product = await getProductBySubcategoryAndSlug(detection.subcategory, detection.productSlug)
    if (!product) {
      return { title: 'Produto não encontrado | Moveirama' }
    }
    
    const mainImage = product.images?.find((img: { image_type: string }) => img.image_type === 'principal') || product.images?.[0]
    const canonicalUrl = `https://moveirama.com.br/${detection.subcategory}/${detection.productSlug}`
    
    return {
      title: product.meta_title || `${product.name} | Moveirama`,
      description: product.meta_description || product.short_description,
      openGraph: {
        title: `${product.name} | Moveirama`,
        description: product.short_description,
        url: canonicalUrl,
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
        canonical: canonicalUrl,
      },
    }
  }
  
  return { title: 'Página não encontrada | Moveirama' }
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default async function DynamicPage({ params, searchParams }: PageProps) {
  const { category, slug } = await params
  const detection = await detectPageType(category, slug)
  
  if (detection.type === 'not-found') {
    notFound()
  }
  
  if (detection.type === 'linha' && detection.linha) {
    return <LinhaPage category={category} linha={detection.linha} />
  }
  
  if (detection.type === 'listing' && detection.linha && detection.subcategory) {
    return <ListingPage 
      category={category} 
      linha={detection.linha}
      subcategory={detection.subcategory} 
      searchParams={searchParams} 
    />
  }
  
  if (detection.type === 'listing-legacy' && detection.subcategory) {
    return <ListingPage 
      category={category} 
      linha={null}
      subcategory={detection.subcategory} 
      searchParams={searchParams} 
    />
  }
  
  if (detection.type === 'product' && detection.subcategory && detection.productSlug) {
    return <ProductPage subcategorySlug={detection.subcategory} productSlug={detection.productSlug} />
  }
  
  notFound()
}

// ============================================
// PÁGINA DE LINHA (ex: /escritorio/home-office)
// ============================================

async function LinhaPage({ 
  category, 
  linha 
}: { 
  category: string
  linha: string 
}) {
  const linhaConfig = LINHAS[linha]
  const parentCategory = await getParentCategory(category)
  
  if (!parentCategory || !linhaConfig) {
    notFound()
  }

  // Busca todas as subcategorias da categoria pai
  const allSubcategories = await getSubcategories(category)
  
  // Filtra apenas as subcategorias que pertencem a esta linha
  const subcategories = allSubcategories.filter(sub => 
    linhaConfig.subcategorias.includes(sub.slug)
  )

  // Breadcrumb
  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: parentCategory.name, href: `/${category}` },
    { label: linhaConfig.name }
  ]

  return (
    <main className="min-h-screen bg-[var(--color-warm-white)]">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <header className="py-4 md:py-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[var(--color-graphite)] m-0 mb-2">
            {linhaConfig.name}
          </h1>
          {linhaConfig.description && (
            <p className="text-base text-[var(--color-toffee)] m-0 max-w-xl">
              {linhaConfig.description}
            </p>
          )}
        </header>

        {/* Grid de Subcategorias */}
        <section className="pb-12">
          {subcategories.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-6">
              {subcategories.map(subcategory => (
                <SubcategoryCard
                  key={subcategory.id}
                  name={subcategory.name}
                  slug={subcategory.slug}
                  parentSlug={`${category}/${linha}`}
                  imageUrl={subcategory.image_url}
                  productCount={subcategory.product_count}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[var(--color-toffee)]">
                Nenhuma subcategoria disponível no momento.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

// ============================================
// PÁGINA DE LISTAGEM
// ============================================

async function ListingPage({ 
  category, 
  linha,
  subcategory, 
  searchParams 
}: { 
  category: string
  linha: string | null
  subcategory: string
  searchParams: Promise<{ page?: string; sort?: string }>
}) {
  const { page: pageParam, sort: sortParam } = await searchParams
  
  const parentCategory = await getParentCategory(category)
  const subcategoryData = await getSubcategory(category, subcategory)
  
  if (!parentCategory || !subcategoryData) {
    notFound()
  }

  const currentPage = Math.max(1, parseInt(pageParam || '1', 10))
  const currentSort = (sortParam as SortOption) || 'relevance'

  const { products, total } = await getProductsByCategory(
    subcategoryData.id,
    currentPage,
    PRODUCTS_PER_PAGE,
    currentSort
  )

  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE)

  // Breadcrumb - com ou sem linha
  const breadcrumbItems = linha 
    ? [
        { label: 'Início', href: '/' },
        { label: parentCategory.name, href: `/${category}` },
        { label: LINHAS[linha].name, href: `/${category}/${linha}` },
        { label: subcategoryData.name }
      ]
    : [
        { label: 'Início', href: '/' },
        { label: parentCategory.name, href: `/${category}` },
        { label: subcategoryData.name }
      ]

  // URL base para paginação
  const baseUrl = linha 
    ? `/${category}/${linha}/${subcategory}`
    : `/${category}/${subcategory}`

  // Schema.org ItemList
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: subcategoryData.name,
    numberOfItems: total,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: (currentPage - 1) * PRODUCTS_PER_PAGE + index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        url: `https://moveirama.com.br/${subcategoryData.slug}/${product.slug}`,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'BRL',
          availability: 'https://schema.org/InStock'
        }
      }
    }))
  }

  const searchParamsObj: Record<string, string> = {}
  if (currentSort !== 'relevance') {
    searchParamsObj.sort = currentSort
  }

  return (
    <main className="min-h-screen bg-[var(--color-warm-white)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <header className="pt-4 pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1 className="text-2xl md:text-[28px] lg:text-[32px] font-semibold text-[var(--color-graphite)] m-0 mb-1">
                {subcategoryData.name}
              </h1>
              <p className="text-sm text-[var(--color-toffee)] m-0">
                {total} {total === 1 ? 'produto' : 'produtos'}
              </p>
            </div>
          </div>
        </header>

        {total > 0 && (
          <SortControl currentSort={currentSort} />
        )}

        {products.length > 0 ? (
          <>
            <section className="py-4">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-6">
                {products.map(product => (
                  <ProductCardListing
                    key={product.id}
                    slug={product.slug}
                    name={product.name}
                    price={product.price}
                    compareAtPrice={product.compare_at_price}
                    imageUrl={product.image_url}
                    avgRating={product.avg_rating}
                    reviewCount={product.review_count}
                    categorySlug={subcategoryData.slug}
                  />
                ))}
              </div>
            </section>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl={baseUrl}
              searchParams={searchParamsObj}
            />
          </>
        ) : (
          <EmptyState
            ctaLabel="Ver outras categorias"
            ctaHref={linha ? `/${category}/${linha}` : `/${category}`}
          />
        )}
      </div>
    </main>
  )
}

// ============================================
// PÁGINA DE PRODUTO
// ============================================

async function ProductPage({ 
  subcategorySlug, 
  productSlug 
}: { 
  subcategorySlug: string
  productSlug: string 
}) {
  const product = await getProductBySubcategoryAndSlug(subcategorySlug, productSlug)
  
  if (!product) {
    notFound()
  }

  const subcategory = await getSubcategoryBySlug(subcategorySlug)
  const parentCategory = await getParentOfSubcategory(subcategorySlug)

  // Breadcrumb com hierarquia completa
  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    ...(parentCategory ? [{ label: parentCategory.name, href: `/${parentCategory.slug}` }] : []),
    ...(subcategory ? [{ label: subcategory.name, href: `/${parentCategory?.slug}/${subcategory.slug}` }] : []),
    { label: product.name }
  ]

  return (
    <ProductPageContent 
      product={product} 
      breadcrumbItems={breadcrumbItems}
      subcategorySlug={subcategorySlug}
    />
  )
}
