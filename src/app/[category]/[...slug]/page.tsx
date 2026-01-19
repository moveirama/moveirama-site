// src/app/[category]/[...slug]/page.tsx

/**
 * Página dinâmica para subcategorias e produtos
 * 
 * v2.3: Simplificado para estrutura de 2 níveis (sem linhas intermediárias)
 * 
 * Rotas suportadas:
 * - /moveis-para-casa/racks-tv → listagem de produtos
 * - /racks-tv/rack-theo → página de produto
 */

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

// Funções SEO
import {
  generateCategoryH1,
  generateCategoryTitle,
  generateCategoryMetaDescription
} from '@/lib/seo'

// Componentes de Listagem
import Breadcrumb from '@/components/Breadcrumb'
import ProductCardListing from '@/components/ProductCardListing'
import SortControl from '@/components/SortControl'
import Pagination from '@/components/Pagination'
import EmptyState from '@/components/EmptyState'

// Componentes de Produto
import ProductPageContent from '@/components/ProductPageContent'

// FORÇA REVALIDAÇÃO A CADA REQUEST
export const dynamic = 'force-dynamic'

// ============================================
// CONFIGURAÇÃO — v2.3 (estrutura simplificada)
// ============================================

// Categorias pai conhecidas (nível 1)
// v2.3: Atualizado para nova taxonomia
const PARENT_CATEGORIES = ['moveis-para-casa', 'moveis-para-escritorio']

const PRODUCTS_PER_PAGE = 12

// ============================================
// TIPOS
// ============================================

interface PageProps {
  params: Promise<{ category: string; slug: string[] }>
  searchParams: Promise<{ page?: string; sort?: string }>
}

type PageType = 
  | 'listing'    // /moveis-para-casa/racks-tv → lista produtos
  | 'product'    // /racks-tv/produto-x → página do produto
  | 'not-found'

interface DetectionResult {
  type: PageType
  subcategory?: string
  productSlug?: string
}

// ============================================
// DETECÇÃO DE TIPO DE PÁGINA (v2.3 simplificada)
// ============================================

async function detectPageType(category: string, slug: string[]): Promise<DetectionResult> {
  // ============================================
  // CENÁRIO 1: category NÃO é pai conhecido → PRODUTO
  // Ex: /racks-tv/rack-theo → category="racks-tv", slug=["rack-theo"]
  // ============================================
  if (!PARENT_CATEGORIES.includes(category)) {
    if (slug.length === 1) {
      const product = await getProductBySubcategoryAndSlug(category, slug[0])
      if (product) {
        return { type: 'product', subcategory: category, productSlug: slug[0] }
      }
    }
    return { type: 'not-found' }
  }

  // ============================================
  // CENÁRIO 2: category É pai conhecido → LISTAGEM
  // Ex: /moveis-para-casa/racks-tv → category="moveis-para-casa", slug=["racks-tv"]
  // ============================================
  if (slug.length === 1) {
    const subcategorySlug = slug[0]
    const subcategoryData = await getSubcategory(category, subcategorySlug)
    
    if (subcategoryData) {
      return { type: 'listing', subcategory: subcategorySlug }
    }
    
    return { type: 'not-found' }
  }

  // Mais de 1 segmento em slug com categoria pai → não suportado
  return { type: 'not-found' }
}

// ============================================
// METADATA
// ============================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params
  const detection = await detectPageType(category, slug)
  
  // ============================================
  // LISTAGEM (ex: /moveis-para-casa/racks-tv)
  // ============================================
  if (detection.type === 'listing' && detection.subcategory) {
    const subcategoryData = await getSubcategory(category, detection.subcategory)
    if (!subcategoryData) {
      return { title: 'Categoria não encontrada | Moveirama' }
    }
    
    const title = generateCategoryTitle(subcategoryData.name, detection.subcategory)
    const description = generateCategoryMetaDescription(subcategoryData.name, detection.subcategory)
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        siteName: 'Moveirama',
        locale: 'pt_BR',
        type: 'website',
      }
    }
  }
  
  // ============================================
  // PRODUTO (ex: /racks-tv/rack-theo)
  // ============================================
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
  
  if (detection.type === 'listing' && detection.subcategory) {
    return <ListingPage 
      category={category} 
      subcategory={detection.subcategory} 
      searchParams={searchParams} 
    />
  }
  
  if (detection.type === 'product' && detection.subcategory && detection.productSlug) {
    return <ProductPage 
      subcategorySlug={detection.subcategory} 
      productSlug={detection.productSlug} 
    />
  }
  
  notFound()
}

// ============================================
// PÁGINA DE LISTAGEM (ex: /moveis-para-casa/racks-tv)
// ============================================

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

  // Breadcrumb (2 níveis)
  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: parentCategory.name, href: `/${category}` },
    { label: subcategoryData.name }
  ]

  // URL base para paginação
  const baseUrl = `/${category}/${subcategory}`

  // H1 otimizado para SEO local
  const h1Title = generateCategoryH1(subcategoryData.name, subcategory)

  // Schema.org ItemList
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: h1Title,
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
                {h1Title}
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
// PÁGINA DE PRODUTO (ex: /racks-tv/rack-theo)
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

  // Breadcrumb (2 níveis + produto)
  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    ...(parentCategory ? [{ label: parentCategory.name, href: `/${parentCategory.slug}` }] : []),
    ...(subcategory ? [{ 
      label: subcategory.name, 
      href: `/${parentCategory?.slug}/${subcategory.slug}` 
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
