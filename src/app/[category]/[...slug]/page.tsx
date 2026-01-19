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
  getCategoryBySlug,           // NOVA FUNÇÃO
  getSubcategoryOfAnyParent,   // NOVA FUNÇÃO
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
// CONFIGURAÇÃO DE LINHAS (nível intermediário)
// ============================================

// Linhas são categorias de nível 2 que têm subcategorias próprias
const LINHAS = ['home-office', 'linha-profissional']

// Categorias pai conhecidas (nível 1)
const PARENT_CATEGORIES = ['casa', 'escritorio']

const PRODUCTS_PER_PAGE = 12

// ============================================
// TIPOS
// ============================================

interface PageProps {
  params: Promise<{ category: string; slug: string[] }>
  searchParams: Promise<{ page?: string; sort?: string }>
}

type PageType = 
  | 'linha'           // /escritorio/home-office → mostra subcategorias da linha
  | 'linha-listing'   // /escritorio/home-office/escrivaninhas → lista produtos
  | 'direct-listing'  // /casa/racks → lista produtos (sem linha intermediária)
  | 'product'         // /escrivaninhas/produto-x → página do produto
  | 'not-found'

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
  // Cenário 1: category NÃO é pai conhecido → pode ser produto
  // Ex: /escrivaninhas/mesa-gamer → category="escrivaninhas", slug=["mesa-gamer"]
  if (!PARENT_CATEGORIES.includes(category)) {
    if (slug.length === 1) {
      const product = await getProductBySubcategoryAndSlug(category, slug[0])
      if (product) {
        return { type: 'product', subcategory: category, productSlug: slug[0] }
      }
    }
    return { type: 'not-found' }
  }

  // Cenário 2: category É pai conhecido (casa, escritorio)
  
  // 2a: 1 segmento - pode ser linha ou subcategoria direta
  if (slug.length === 1) {
    const firstSlug = slug[0]
    
    // Verifica se é uma linha (home-office, etc)
    if (LINHAS.includes(firstSlug)) {
      // Confirma que a linha existe no banco como subcategoria do pai
      const linhaCategory = await getSubcategory(category, firstSlug)
      if (linhaCategory) {
        return { type: 'linha', linha: firstSlug }
      }
    }
    
    // Senão, tenta como subcategoria direta (ex: /casa/racks)
    const subcategoryData = await getSubcategory(category, firstSlug)
    if (subcategoryData) {
      return { type: 'direct-listing', subcategory: firstSlug }
    }
    
    return { type: 'not-found' }
  }

  // 2b: 2 segmentos - /escritorio/home-office/escrivaninhas
  if (slug.length === 2) {
    const [linha, subcategory] = slug
    
    // Verifica se primeiro é uma linha conhecida
    if (LINHAS.includes(linha)) {
      // USA A NOVA FUNÇÃO: busca subcategoria como filha da LINHA
      const subcategoryData = await getSubcategoryOfAnyParent(linha, subcategory)
      if (subcategoryData) {
        return { type: 'linha-listing', linha, subcategory }
      }
    }
    
    return { type: 'not-found' }
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
    const linhaCategory = await getSubcategory(category, detection.linha)
    if (!linhaCategory) {
      return { title: 'Página não encontrada | Moveirama' }
    }
    return {
      title: `${linhaCategory.name} | Moveirama`,
      description: linhaCategory.description || 
        `Confira nossa linha ${linhaCategory.name} com entrega rápida em Curitiba.`,
      openGraph: {
        title: `${linhaCategory.name} | Moveirama`,
        description: linhaCategory.description || undefined,
      }
    }
  }
  
  if (detection.type === 'linha-listing' && detection.linha && detection.subcategory) {
    // USA A NOVA FUNÇÃO
    const subcategoryData = await getSubcategoryOfAnyParent(detection.linha, detection.subcategory)
    const linhaCategory = await getCategoryBySlug(detection.linha)
    if (!subcategoryData) {
      return { title: 'Categoria não encontrada | Moveirama' }
    }
    return {
      title: `${subcategoryData.name} - ${linhaCategory?.name || ''} | Moveirama`,
      description: subcategoryData.description || 
        `Confira nossa linha de ${subcategoryData.name.toLowerCase()} com preço justo e entrega rápida em Curitiba.`,
      openGraph: {
        title: `${subcategoryData.name} | Moveirama`,
        description: subcategoryData.description || undefined,
      }
    }
  }
  
  if (detection.type === 'direct-listing' && detection.subcategory) {
    const subcategoryData = await getSubcategory(category, detection.subcategory)
    if (!subcategoryData) {
      return { title: 'Categoria não encontrada | Moveirama' }
    }
    return {
      title: `${subcategoryData.name} | Moveirama`,
      description: subcategoryData.description || 
        `Confira nossa linha de ${subcategoryData.name.toLowerCase()} com preço justo e entrega rápida em Curitiba.`,
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
  
  if (detection.type === 'linha-listing' && detection.linha && detection.subcategory) {
    return <LinhaListingPage 
      category={category} 
      linha={detection.linha}
      subcategory={detection.subcategory} 
      searchParams={searchParams} 
    />
  }
  
  if (detection.type === 'direct-listing' && detection.subcategory) {
    return <DirectListingPage 
      category={category} 
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
// Mostra as subcategorias da linha
// ============================================

async function LinhaPage({ 
  category, 
  linha 
}: { 
  category: string
  linha: string 
}) {
  const parentCategory = await getParentCategory(category)
  const linhaCategory = await getSubcategory(category, linha)
  
  if (!parentCategory || !linhaCategory) {
    notFound()
  }

  // Busca subcategorias da LINHA (não do pai)
  const subcategories = await getSubcategories(linha)

  // Breadcrumb
  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: parentCategory.name, href: `/${category}` },
    { label: linhaCategory.name }
  ]

  return (
    <main className="min-h-screen bg-[var(--color-warm-white)]">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <header className="py-4 md:py-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[var(--color-graphite)] m-0 mb-2">
            {linhaCategory.name}
          </h1>
          {linhaCategory.description && (
            <p className="text-base text-[var(--color-toffee)] m-0 max-w-xl">
              {linhaCategory.description}
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
// LISTAGEM COM LINHA (ex: /escritorio/home-office/escrivaninhas)
// ============================================

async function LinhaListingPage({ 
  category, 
  linha,
  subcategory, 
  searchParams 
}: { 
  category: string
  linha: string
  subcategory: string
  searchParams: Promise<{ page?: string; sort?: string }>
}) {
  const { page: pageParam, sort: sortParam } = await searchParams
  
  const parentCategory = await getParentCategory(category)
  const linhaCategory = await getSubcategory(category, linha)
  
  // USA A NOVA FUNÇÃO: subcategoria é filha da LINHA
  const subcategoryData = await getSubcategoryOfAnyParent(linha, subcategory)
  
  if (!parentCategory || !linhaCategory || !subcategoryData) {
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

  // Breadcrumb com 4 níveis
  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: parentCategory.name, href: `/${category}` },
    { label: linhaCategory.name, href: `/${category}/${linha}` },
    { label: subcategoryData.name }
  ]

  // URL base para paginação
  const baseUrl = `/${category}/${linha}/${subcategory}`

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
                    tvMaxSize={product.tv_max_size}
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
            ctaLabel={`Ver ${linhaCategory.name}`}
            ctaHref={`/${category}/${linha}`}
          />
        )}
      </div>
    </main>
  )
}

// ============================================
// LISTAGEM DIRETA (ex: /casa/racks)
// Sem linha intermediária
// ============================================

async function DirectListingPage({ 
  category, 
  subcategory, 
  searchParams 
}: { 
  category: string
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

  // Breadcrumb
  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: parentCategory.name, href: `/${category}` },
    { label: subcategoryData.name }
  ]

  // URL base para paginação
  const baseUrl = `/${category}/${subcategory}`

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
                    tvMaxSize={product.tv_max_size}
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
            ctaHref={`/${category}`}
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

  // Detecta se subcategoria está dentro de uma linha
  // Se o pai da subcategoria também tem pai, então é 3 níveis
  let linhaCategory = null
  let topCategory = parentCategory
  
  if (parentCategory) {
    const grandParent = await getParentOfSubcategory(parentCategory.slug)
    if (grandParent) {
      // É estrutura de 3 níveis: grandParent > parentCategory (linha) > subcategory
      linhaCategory = parentCategory
      topCategory = grandParent
    }
  }

  // Breadcrumb com hierarquia completa
  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    ...(topCategory ? [{ label: topCategory.name, href: `/${topCategory.slug}` }] : []),
    ...(linhaCategory ? [{ label: linhaCategory.name, href: `/${topCategory?.slug}/${linhaCategory.slug}` }] : []),
    ...(subcategory ? [{ 
      label: subcategory.name, 
      href: linhaCategory 
        ? `/${topCategory?.slug}/${linhaCategory.slug}/${subcategory.slug}` 
        : `/${topCategory?.slug}/${subcategory.slug}` 
    }] : []),
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
