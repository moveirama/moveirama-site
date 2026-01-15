import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { supabase, getCategoryBySlug, getSubcategories, type CategoryWithCount } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import SubcategoryCard from '@/components/SubcategoryCard'
import EmptyState from '@/components/EmptyState'

type CategoryPageProps = {
  params: Promise<{ category: string }>
}

// Categorias pai válidas (para generateStaticParams)
const VALID_PARENT_CATEGORIES = ['casa', 'escritorio']

export async function generateStaticParams() {
  return VALID_PARENT_CATEGORIES.map(category => ({ category }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = await getCategoryBySlug(categorySlug)
  
  if (!category) {
    return { title: 'Categoria não encontrada | Moveirama' }
  }

  const title = `${category.name} | Moveirama`
  const description = category.description || `Móveis para ${category.name.toLowerCase()} em Curitiba. Encontre o móvel perfeito para seu espaço.`

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
      canonical: `https://moveirama.com.br/${categorySlug}`,
    },
  }
}

async function getPageData(categorySlug: string) {
  // Busca categoria pai
  const category = await getCategoryBySlug(categorySlug)
  
  if (!category || category.parent_id !== null) {
    // Não é uma categoria pai válida
    return null
  }

  // Busca subcategorias
  const subcategories = await getSubcategories(category.id)

  return { category, subcategories }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params
  
  // Verifica se é uma categoria pai válida
  if (!VALID_PARENT_CATEGORIES.includes(categorySlug)) {
    notFound()
  }

  const data = await getPageData(categorySlug)

  if (!data) {
    notFound()
  }

  const { category, subcategories } = data

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: category.name }
  ]

  // Descrição para a página
  const pageDescription = category.slug === 'casa'
    ? 'Encontre o móvel perfeito para sua sala e quarto'
    : 'Móveis para home office e escritório'

  // Schema.org ItemList
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': category.name,
    'description': pageDescription,
    'url': `https://moveirama.com.br/${categorySlug}`,
    'mainEntity': {
      '@type': 'ItemList',
      'numberOfItems': subcategories.length,
      'itemListElement': subcategories.map((sub, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': sub.name,
        'url': `https://moveirama.com.br/${categorySlug}/${sub.slug}`
      }))
    }
  }

  return (
    <>
      <Header />
      
      <main className="category-page">
        <div className="container">
          {/* Schema.org */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
          />

          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Header da página */}
          <header className="category-page__header">
            <h1 className="category-page__title">
              {category.slug === 'casa' ? 'Móveis para Casa' : 'Móveis para Escritório'}
            </h1>
            <p className="category-page__description">
              {pageDescription}
            </p>
          </header>

          {/* Grid de subcategorias */}
          {subcategories.length > 0 ? (
            <section className="subcategories-section">
              <div className="subcategories-grid">
                {subcategories.map(sub => (
                  <SubcategoryCard 
                    key={sub.id} 
                    category={sub} 
                    parentSlug={categorySlug} 
                  />
                ))}
              </div>
            </section>
          ) : (
            <EmptyState 
              title="Nenhuma categoria disponível"
              message="Esta seção ainda não tem categorias. Volte em breve!"
              linkHref="/"
              linkText="Voltar para início"
            />
          )}
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .category-page {
          min-height: 60vh;
          padding-bottom: 64px;
        }

        .category-page__header {
          padding: 16px 0 24px 0;
        }

        .category-page__title {
          font-size: 28px;
          font-weight: 600;
          color: var(--color-graphite);
          margin: 0 0 8px 0;
        }

        @media (min-width: 768px) {
          .category-page__title {
            font-size: 32px;
          }
        }

        @media (min-width: 1024px) {
          .category-page__title {
            font-size: 36px;
          }
        }

        .category-page__description {
          font-size: 16px;
          color: var(--color-toffee);
          margin: 0;
        }

        @media (min-width: 768px) {
          .category-page__description {
            font-size: 18px;
          }
        }

        .subcategories-section {
          padding: 16px 0;
        }

        .subcategories-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        @media (min-width: 768px) {
          .subcategories-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
        }

        @media (min-width: 1024px) {
          .subcategories-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
          }
        }
      `}</style>
    </>
  )
}
