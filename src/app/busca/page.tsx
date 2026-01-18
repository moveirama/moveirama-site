// src/app/busca/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// ============================================
// TIPOS
// ============================================

type Product = {
  id: string
  name: string
  slug: string
  price: number
  category_slug: string | null
  first_image: string | null
  tv_max_size: number | null
  rating: number
  review_count: number
}

type SearchResult = {
  products: Product[]
  filters: string[]
  total: number
}

// ============================================
// COMPONENTE DE LOADING
// ============================================

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-square bg-[#E8DFD5]" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-[#E8DFD5] rounded w-3/4" />
        <div className="h-4 bg-[#E8DFD5] rounded w-1/2" />
        <div className="h-6 bg-[#E8DFD5] rounded w-1/3" />
      </div>
    </div>
  )
}

// ============================================
// CARD DE PRODUTO
// ============================================

function ProductCard({ product }: { product: Product }) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const installment = (product.price / 12).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

  // Construir URL do produto
  const productUrl = product.category_slug 
    ? `/${product.category_slug}/${product.slug}`
    : `/produto/${product.slug}`

  return (
    <Link 
      href={productUrl}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Imagem */}
      <div className="aspect-square bg-[#F0E8DF] relative overflow-hidden">
        {product.first_image ? (
          <Image
            src={product.first_image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#8B7355]">
            <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-[#2D2D2D] font-medium text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-[#6B8E7A] transition-colors">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg 
              key={i} 
              className={`w-3 h-3 ${i < product.rating ? 'text-[#B85C38]' : 'text-[#E8DFD5]'}`}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Preço */}
        <p className="text-[#2D2D2D] font-bold text-lg">
          {formatPrice(product.price)}
        </p>
        <p className="text-[#8B7355] text-xs">
          12x {installment}
        </p>
      </div>
    </Link>
  )
}

// ============================================
// CONTEÚDO DA BUSCA (separado para Suspense)
// ============================================

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query) {
      setResults({ products: [], filters: [], total: 0 })
      setLoading(false)
      return
    }

    const fetchResults = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=100`)
        if (!response.ok) throw new Error('Erro ao buscar produtos')
        
        const data = await response.json()
        setResults(data)
      } catch (err) {
        setError('Não foi possível carregar os resultados. Tente novamente.')
        console.error('Erro na busca:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  // Estado vazio (sem query)
  if (!query) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold text-[#2D2D2D] mb-2">
          O que você está procurando?
        </h2>
        <p className="text-[#8B7355] mb-6">
          Use a busca para encontrar o móvel perfeito
        </p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-[#6B8E7A] hover:text-[#5A7A68] font-medium"
        >
          ← Voltar para a página inicial
        </Link>
      </div>
    )
  }

  // Loading
  if (loading) {
    return (
      <>
        <div className="mb-6">
          <div className="h-8 bg-[#E8DFD5] rounded w-64 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </>
    )
  }

  // Erro
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-semibold text-[#2D2D2D] mb-2">
          Ops! Algo deu errado
        </h2>
        <p className="text-[#8B7355] mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 bg-[#6B8E7A] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#5A7A68] transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  // Sem resultados
  if (!results || results.products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-semibold text-[#2D2D2D] mb-2">
          Não encontramos "{query}"
        </h2>
        <p className="text-[#8B7355] mb-6">
          Mas a gente pode te ajudar!
        </p>
        
        {/* WhatsApp */}
        <a 
          href={`https://wa.me/5541984209323?text=${encodeURIComponent(`Oi! Estou procurando: ${query}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#20BD5A] transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Chamar no WhatsApp
        </a>

        {/* Sugestões */}
        <div>
          <p className="text-[#8B7355] text-sm mb-3">Ou tente buscar por:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Racks', 'Painéis', 'Escrivaninha', 'Penteadeira'].map((suggestion) => (
              <Link
                key={suggestion}
                href={`/busca?q=${encodeURIComponent(suggestion.toLowerCase())}`}
                className="px-4 py-2 bg-white border border-[#E8DFD5] rounded-full text-sm text-[#2D2D2D] hover:border-[#6B8E7A] hover:text-[#6B8E7A] transition-colors"
              >
                {suggestion}
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Resultados encontrados
  return (
    <>
      {/* Header dos resultados */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#2D2D2D] mb-2">
          Resultados para "{query}"
        </h1>
        <p className="text-[#8B7355]">
          {results.total} {results.total === 1 ? 'produto encontrado' : 'produtos encontrados'}
        </p>

        {/* Chips de filtros detectados */}
        {results.filters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-[#8B7355]">Filtros aplicados:</span>
            {results.filters.map((filter, index) => (
              <span 
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-[#F0E8DF] text-[#2D2D2D] text-sm rounded-full"
              >
                {filter}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Grid de produtos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  )
}

// ============================================
// PÁGINA PRINCIPAL
// ============================================

export default function BuscaPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F4]">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        }>
          <SearchContent />
        </Suspense>
      </div>
    </div>
  )
}
