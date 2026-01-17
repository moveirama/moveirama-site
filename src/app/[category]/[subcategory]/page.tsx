import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { 
  getParentCategory, 
  getSubcategory, 
  getProductsByCategory,
  getSubcategoryBySlug,
  getProductBySubcategoryAndSlug,
  getParentOfSubcategory,
  SortOption 
} from '@/lib/supabase'

// Componentes de Listagem
import Breadcrumb from '@/components/Breadcrumb'
import ProductCardListing from '@/components/ProductCardListing'
import SortControl from '@/components/SortControl'
import Pagination from '@/components/Pagination'
import EmptyState from '@/components/EmptyState'

// Componentes de Produto
import ProductPageContent from '@/components/ProductPageContent'

interface PageProps {
  params: Promise<{ category: string; subcategory: string }>
  searchParams: Promise<{ page?: string; sort?: string }>
}

// Categorias pai conhecidas
const PARENT_CATEGORIES = ['casa', 'escritorio']

const PRODUCTS_PER_PAGE = 12

// Detecta se é listagem ou produto
async function detectPageType(category: string, subcategory: string): Promise<'listing' | 'product' | 'not-found'> {
  // Se category é uma categoria pai conhecida → listagem
  if (PARENT_CATEGORIES.includes(category)) {
    const parentCategory = await getParentCategory(category)
    const subcategoryData = await getSubcategory(category, subcategory)
    if (parentCategory && subcategoryData) {
      return 'listing'
    }
    return 'not-found'
  }
  
  // Senão, tenta buscar como produto
  // category = subcategoria (ex: "racks")
  // subcategory = produto slug (ex: "rack-theo")
  const product = await getProductBySubcategoryAndSlug(category, subcategory)
  if (product) {
    return 'product'
  }
  
  return 'not-found'
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, subcategory } = await params
  const pageType = await detectPageType(category, subcategory)
  
  if (pageType === 'listing') {
    const subcategoryData = await getSubcategory(category, subcategory)
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
  
  if (pageType === 'product') {
    const product = await getProductBySubcategoryAndSlug(category, subcategory)
    if (!product) {
      return { title: 'Produto não encontrado | Moveirama' }
    }
    
    const mainImage = product.images?.find((img: { image_type: string }) => img.image_type === 'principal') || product.images?.[0]
    const canonicalUrl = `https://moveirama.com.br/${category}/${subcategory}`
    
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
            url: mainImage.image_url,
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
        images: mainImage ? [mainImage.image_url] : [],
      },
      alternates: {
        canonical: canonicalUrl,
      },
    }
  }
  
  return { title: 'Página não encontrada | Moveirama' }
}

export default async function DynamicPage({ params, searchParams }: PageProps) {
  const { category, subcategory } = await params
  const pageType = await detectPageType(category, subcategory)
  
  if (pageType === 'not-found') {
    notFound()
  }
  
  if (pageType === 'listing') {
    return <ListingPage category={category} subcategory={subcategory} searchParams={searchParams} />
  }
  
  // pageType === 'product'
  return <ProductPage subcategorySlug={category} productSlug={subcategory} />
}

// ========================================
// COMPONENTE DE LISTAGEM
// ========================================
async function ListingPage({ 
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

  // Schema.org ItemList - URL correta para produtos
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

  const baseUrl = `/${category}/${subcategory}`
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
            ctaHref={`/${category}`}
          />
        )}
      </div>
    </main>
  )
}

// ========================================
// COMPONENTE DE PRODUTO
// ========================================
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
