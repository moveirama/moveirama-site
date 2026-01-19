// src/app/[category]/page.tsx

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getParentCategory, getSubcategories } from '@/lib/supabase'
import Breadcrumb from '@/components/Breadcrumb'
import SubcategoryCard from '@/components/SubcategoryCard'
import { 
  generateCategoryTitle, 
  generateCategoryMetaDescription,
  getCategorySeoName 
} from '@/lib/seo'

interface PageProps {
  params: Promise<{ category: string }>
}

// Mapeamento de slugs para nomes amigáveis
// v2.3: Atualizado para nova taxonomia (moveis-para-casa, moveis-para-escritorio)
const CATEGORY_NAMES: Record<string, { name: string; description: string }> = {
  'moveis-para-casa': {
    name: 'Móveis para Casa',
    description: 'Encontre o móvel perfeito pra sua sala e quarto. Racks, painéis, mesas e muito mais com entrega rápida em Curitiba.'
  },
  'moveis-para-escritorio': {
    name: 'Móveis para Escritório',
    description: 'Monte seu home office ou escritório profissional com conforto e praticidade. Escrivaninhas, mesas e gaveteiros.'
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const categoryData = await getParentCategory(category)
  
  if (!categoryData) {
    return { title: 'Categoria não encontrada | Moveirama' }
  }

  const info = CATEGORY_NAMES[category] || { 
    name: categoryData.name, 
    description: '' 
  }
  
  // Usa funções de SEO para consistência
  const title = generateCategoryTitle(info.name, category)
  const description = generateCategoryMetaDescription(info.name, category)

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

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params
  
  // Busca categoria e subcategorias
  const categoryData = await getParentCategory(category)
  
  if (!categoryData) {
    notFound()
  }

  const subcategories = await getSubcategories(category)
  const info = CATEGORY_NAMES[category] || { 
    name: categoryData.name, 
    description: categoryData.description 
  }

  // Breadcrumb
  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: info.name }
  ]

  return (
    <main className="min-h-screen bg-[var(--color-warm-white)]">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <header className="py-4 md:py-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[var(--color-graphite)] m-0 mb-2">
            {info.name}
          </h1>
          {info.description && (
            <p className="text-base text-[var(--color-toffee)] m-0 max-w-xl">
              {info.description}
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
                  parentSlug={category}
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

// Gera páginas estáticas para categorias conhecidas
// v2.3: Atualizado para nova taxonomia
export async function generateStaticParams() {
  return [
    { category: 'moveis-para-casa' },
    { category: 'moveis-para-escritorio' }
  ]
}
