import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getParentCategory, getSubcategories } from '@/lib/supabase'
import Breadcrumb from '@/components/Breadcrumb'
import SubcategoryCard from '@/components/SubcategoryCard'

interface PageProps {
  params: Promise<{ category: string }>
}

// Mapeamento de slugs para nomes amigáveis
const CATEGORY_NAMES: Record<string, { name: string; description: string }> = {
  casa: {
    name: 'Móveis para Casa',
    description: 'Encontre o móvel perfeito pra sua sala e quarto'
  },
  escritorio: {
    name: 'Móveis para Escritório',
    description: 'Monte seu home office com conforto e praticidade'
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const categoryData = await getParentCategory(category)
  
  if (!categoryData) {
    return { title: 'Categoria não encontrada | Moveirama' }
  }

  const info = CATEGORY_NAMES[category] || { name: categoryData.name, description: '' }

  return {
    title: `${info.name} | Moveirama`,
    description: info.description || `Confira nossa linha de ${info.name.toLowerCase()} com entrega rápida em Curitiba e região.`,
    openGraph: {
      title: `${info.name} | Moveirama`,
      description: info.description,
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
  const info = CATEGORY_NAMES[category] || { name: categoryData.name, description: categoryData.description }

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
export async function generateStaticParams() {
  return [
    { category: 'casa' },
    { category: 'escritorio' }
  ]
}
