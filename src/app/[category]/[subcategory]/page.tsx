import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { 
  getParentCategory, 
  getSubcategory, 
  getProductsByCategory,
  SortOption 
} from '@/lib/supabase'
import Breadcrumb from '@/components/Breadcrumb'
import ProductCardListing from '@/components/ProductCardListing'
import SortControl from '@/components/SortControl'
import Pagination from '@/components/Pagination'
import EmptyState from '@/components/EmptyState'

interface PageProps {
  params: Promise<{ category: string; subcategory: string }>
  searchParams: Promise<{ page?: string; sort?: string }>
}

const PRODUCTS_PER_PAGE = 12

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, subcategory } = await params
  
  const parentCategory = await getParentCategory(category)
  const subcategoryData = await getSubcategory(category, subcategory)
  
  if (!parentCategory || !subcategoryData) {
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

export default async function SubcategoryPage({ params, searchParams }: PageProps) {
  const { category, subcategory } = await params
  const { page: pageParam, sort: sortParam } = await searchParams
  
  // Busca dados
  const parentCategory = await getParentCategory(category)
  const subcategoryData = await getSubcategory(category, subcategory)
  
  if (!parentCategory || !subcategoryData) {
    notFound()
  }

  // Paginação e ordenação
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10))
  const currentSort = (sortParam as SortOption) || 'relevance'

  // Busca produtos
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
        url: `https://moveirama.com.br/produto/${product.slug}`,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'BRL',
          availability: 'https://schema.org/InStock'
        }
      }
    }))
  }

  // URL base para paginação
  const baseUrl = `/${category}/${subcategory}`
  const searchParamsObj: Record<string, string> = {}
  if (currentSort !== 'relevance') {
    searchParamsObj.sort = currentSort
  }

  return (
    <main className="min-h-screen bg-[var(--color-warm-white)]">
      {/* Schema.org ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
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

        {/* Ordenação */}
        {total > 0 && (
          <SortControl currentSort={currentSort} />
        )}

        {/* Grid de Produtos ou Estado Vazio */}
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
                  />
                ))}
              </div>
            </section>

            {/* Paginação */}
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
