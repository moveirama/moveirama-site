'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

type Product = {
  id: string
  sku: string
  name: string
  slug: string
  product_images: { id: string; cloudinary_path: string; image_type: string; position: number }[]
}

type Stats = {
  total: number
  withImages: number
  withoutImages: number
}

export default function AdminImagensPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, withImages: 0, withoutImages: 0 })
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'with-images' | 'without-images'>('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Busca usuário
  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        fetchProducts()
      }
      setLoading(false)
    }
    getUser()
  }, [])

  // Busca produtos
  async function fetchProducts() {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (filter !== 'all') params.set('filter', filter)

      const res = await fetch(`/api/admin/products?${params}`)
      const data = await res.json()

      if (data.products) {
        setProducts(data.products)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    }
  }

  // Atualiza quando filtro ou busca muda
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        fetchProducts()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [search, filter])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-warm-white)] flex items-center justify-center">
        <p className="text-[var(--color-toffee)]">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-warm-white)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--color-sand-light)]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[var(--color-graphite)]">
            Admin Moveirama
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--color-toffee)]">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-[var(--color-sage-600)] hover:text-[var(--color-sage-700)] font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-graphite)]">
              Gestão de Imagens
            </h2>
            <p className="text-sm text-[var(--color-toffee)] mt-1">
              {stats.total} produtos • {stats.withImages} com imagens • {stats.withoutImages} sem imagens
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg border border-[var(--color-sand-light)] p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por nome ou SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--color-sand-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]"
              />
            </div>
            {/* Filtro */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-[var(--color-sage-500)] text-white'
                    : 'bg-[var(--color-cream)] text-[var(--color-graphite)] hover:bg-[var(--color-sand-light)]'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter('without-images')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'without-images'
                    ? 'bg-[var(--color-sage-500)] text-white'
                    : 'bg-[var(--color-cream)] text-[var(--color-graphite)] hover:bg-[var(--color-sand-light)]'
                }`}
              >
                Sem imagens
              </button>
              <button
                onClick={() => setFilter('with-images')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'with-images'
                    ? 'bg-[var(--color-sage-500)] text-white'
                    : 'bg-[var(--color-cream)] text-[var(--color-graphite)] hover:bg-[var(--color-sand-light)]'
                }`}
              >
                Com imagens
              </button>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Lista de Produtos */}
          <div className="bg-white rounded-lg border border-[var(--color-sand-light)] overflow-hidden">
            <div className="p-4 border-b border-[var(--color-sand-light)]">
              <h3 className="font-semibold text-[var(--color-graphite)]">
                Produtos ({products.length})
              </h3>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {products.length === 0 ? (
                <div className="p-8 text-center text-[var(--color-toffee)]">
                  Nenhum produto encontrado
                </div>
              ) : (
                <ul className="divide-y divide-[var(--color-sand-light)]">
                  {products.map((product) => (
                    <li key={product.id}>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className={`w-full px-4 py-3 text-left hover:bg-[var(--color-cream)] transition-colors ${
                          selectedProduct?.id === product.id ? 'bg-[var(--color-sage-50)]' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Thumbnail ou placeholder */}
                          <div className="w-12 h-12 bg-[var(--color-cream)] rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {product.product_images?.[0] ? (
                              <img
                                src={product.product_images[0].cloudinary_path}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-[var(--color-toffee)]">Sem foto</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[var(--color-graphite)] truncate">
                              {product.name}
                            </p>
                            <p className="text-sm text-[var(--color-toffee)]">
                              SKU: {product.sku} • {product.product_images?.length || 0} imagens
                            </p>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Painel de Edição */}
          <div className="bg-white rounded-lg border border-[var(--color-sand-light)]">
            <div className="p-4 border-b border-[var(--color-sand-light)]">
              <h3 className="font-semibold text-[var(--color-graphite)]">
                {selectedProduct ? selectedProduct.name : 'Selecione um produto'}
              </h3>
            </div>
            <div className="p-4">
              {selectedProduct ? (
                <div>
                  <p className="text-sm text-[var(--color-toffee)] mb-4">
                    SKU: {selectedProduct.sku}
                  </p>
                  
                  {/* Imagens atuais */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-[var(--color-graphite)] mb-2">
                      Imagens ({selectedProduct.product_images?.length || 0})
                    </h4>
                    {selectedProduct.product_images?.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {selectedProduct.product_images.map((img) => (
                          <div key={img.id} className="aspect-square bg-[var(--color-cream)] rounded overflow-hidden">
                            <img
                              src={img.cloudinary_path}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[var(--color-toffee)]">
                        Nenhuma imagem cadastrada
                      </p>
                    )}
                  </div>

                  {/* Área de upload - próximo passo */}
                  <div className="border-2 border-dashed border-[var(--color-sand-light)] rounded-lg p-8 text-center">
                    <p className="text-[var(--color-toffee)]">
                      📷 Upload de imagens será implementado no próximo passo
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-[var(--color-toffee)]">
                  <p>👈 Clique em um produto para gerenciar suas imagens</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
