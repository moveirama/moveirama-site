import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { supabase, getCategoryBySlug, getProductsByCategory, type Category, type ProductForListing } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import ProductCardListing from '@/components/ProductCardListing'
import SortControl from '@/components/SortControl'
import Pagination from '@/components/Pagination'
import EmptyState from '@/components/EmptyState'

type SubcategoryPageProps = {
  params: Promise<{ category: string; subcategory: string }>
  searchParams: Promise<{ page?: string; sort?: string }>
}

const PRODUCTS_PER_PAGE = 12

// Mapeamento de categorias válidas
const VALID_ROUTES: Record<string, string[]> = {
  'casa': ['racks', 'paineis', 'buffets', 'penteadeiras'],
  'escritorio': ['escrivaninhas', 'gaveteiros', 'mesas', 'estacoes']
}

export async function generateStaticParams() {
  const params: { category: string; subcategory: string }[] = []
  
  for (const [category, subcategories] of Object.entries(VALID_ROUTES)) {
    for (const subcategory of subcategories) {
      params.push({ category, subcategory })
    }
  }
  
  return params
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const { category: categorySlug, subcategory: subcategorySlug } = await params
  
  const subcategory = await getCategoryBySlug(subcategorySlug)
  
  if (!subcategory) {
    return { title: 'Categoria não encontrada | Moveirama' }
  }

  const title = `${subcategory.name} | Moveirama - Móveis em Curitiba`
  const description = subcategory.description || `${subcategory.name} com entrega rápida em Curitiba e região. Móveis de qualidade com preço justo.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'pt_BR',
      siteName: 'Moveirama',
    },
    alternates: {
      canonical: `https://moveirama.com.br/${categorySlug}/${subcategorySlug}`,
    },
  }
}

async function getPageData(categorySlug: string, subcategorySlug: string, page: number, sortBy: string) {
  // Busca categoria pai
  const parentCategory = await getCategoryBySlug(categorySlug)
  if (!parentCategory || parentCategory.parent_id !== null) {
    return null
  }

  // Busca subcategoria
  const subcategory = await getCategoryBySlug(subcategorySlug)
  if (!subcategory || subcategory.parent_id !== parentCategory.id) {
    return null
  }

  // Busca produtos
  const { products, total } = await getProductsByCategory(subcategory.id, page, PRODUCTS_PER_PAGE, sortBy)

  return {
    parentCategory,
    subcategory,
    products,
    total,
    totalPages: Math.ceil(total / PRODUCTS_PER_PAGE)
  }
}

// Componente de Skeleton para loading
function ProductGridSkeleton() {
  return (
    <div className="product-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="product-card-skeleton">
          <div className="skeleton skeleton--image"></div>
          <div className="product-card-skeleton__content">
            <div className="skeleton skeleton--title"></div>
            <div className="skeleton skeleton--text" style={{ width: '60%' }}></div>
            <div className="skeleton skeleton--price"></div>
            <div className="skeleton skeleton--text" style={{ width: '40%' }}></div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Componente principal da grid de produtos
async function ProductGrid({ 
  categorySlug, 
  subcategorySlug, 
  page, 
  sortBy 
}: { 
  categorySlug: string
  subcategorySlug: string
  page: number
  sortBy: string 
}) {
  const data = await getPageData(categorySlug, subcategorySlug, page, sortBy)
  
  if (!data) {
    notFound()
  }

  const { parentCategory, subcategory, products, total, totalPages } = data

  // Schema.org ItemList
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': subcategory.name,
    'numberOfItems': total,
    'itemListElement': products.map((product, index) => ({
      '@type': 'ListItem',
      'position': (page - 1) * PRODUCTS_PER_PAGE + index + 1,
      'url': `https://moveirama.com.br/produto/${product.slug}`
    }))
  }

  return (
    <>
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Header + Ordenação */}
      <div className="category-header-row">
        <header className="category-header">
          <h1 className="category-header__title">{subcategory.name}</h1>
          <p className="category-header__count">
            {total} {total === 1 ? 'produto' : 'produtos'}
          </p>
        </header>
        <div className="category-header__sort">
          <SortControl currentSort={sortBy} />
        </div>
      </div>

      {/* Grid de produtos ou estado vazio */}
      {products.length > 0 ? (
        <>
          <div className="product-grid">
            {products.map(product => (
              <ProductCardListing key={product.id} product={product} />
            ))}
          </div>
          
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            totalItems={total} 
          />
        </>
      ) : (
        <EmptyState 
          linkHref={`/${categorySlug}`}
          linkText={`Ver ${parentCategory.name}`}
        />
      )}

    </>
  )
}

export default async function SubcategoryPage({ params, searchParams }: SubcategoryPageProps) {
  const { category: categorySlug, subcategory: subcategorySlug } = await params
  const { page: pageStr, sort } = await searchParams
  
  // Validação de rota
  if (!VALID_ROUTES[categorySlug]?.includes(subcategorySlug)) {
    notFound()
  }

  const page = Math.max(1, parseInt(pageStr || '1', 10) || 1)
  const sortBy = sort || 'relevance'

  // Busca dados para breadcrumb (fora do Suspense)
  const parentCategory = await getCategoryBySlug(categorySlug)
  const subcategory = await getCategoryBySlug(subcategorySlug)
  
  if (!parentCategory || !subcategory) {
    notFound()
  }

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: parentCategory.name, href: `/${categorySlug}` },
    { label: subcategory.name }
  ]

  return (
    <>
      <Header />
      
      <main className="subcategory-page">
        <div className="container">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Conteúdo com Suspense para streaming */}
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid 
              categorySlug={categorySlug}
              subcategorySlug={subcategorySlug}
              page={page}
              sortBy={sortBy}
            />
          </Suspense>
        </div>
      </main>

      <Footer />

    </>
  )
}
