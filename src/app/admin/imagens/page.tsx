'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

type ProductImage = {
  id: string
  cloudinary_path: string
  image_type: string
  position: number
}

type Product = {
  id: string
  sku: string
  name: string
  slug: string
  product_images: ProductImage[]
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
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) fetchProducts()
      setLoading(false)
    }
    getUser()
  }, [])

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
        if (selectedProduct) {
          const updated = data.products.find((p: Product) => p.id === selectedProduct.id)
          if (updated) setSelectedProduct(updated)
        }
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    }
  }

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => { fetchProducts() }, 300)
      return () => clearTimeout(timer)
    }
  }, [search, filter])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  async function uploadImage(file: File) {
    if (!selectedProduct) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('productId', selectedProduct.id)
      formData.append('productSlug', selectedProduct.slug)
      formData.append('position', String(selectedProduct.product_images?.length || 0))
      const res = await fetch('/api/admin/images/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        fetchProducts()
      } else {
        alert('Erro no upload: ' + data.error)
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload')
    } finally {
      setUploading(false)
    }
  }

  async function deleteImage(imageId: string) {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) return
    setDeleting(imageId)
    try {
      const res = await fetch(`/api/admin/images/${imageId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchProducts()
      } else {
        alert('Erro ao excluir: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
      alert('Erro ao excluir imagem')
    } finally {
      setDeleting(null)
    }
  }

  async function setPrincipal(imageId: string) {
    if (!selectedProduct) return
    try {
      const images = selectedProduct.product_images || []
      
      for (const img of images) {
        const isPrincipal = img.id === imageId
        await fetch(`/api/admin/images/${img.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            position: isPrincipal ? 0 : (images.indexOf(img) + 1),
            image_type: isPrincipal ? 'principal' : 'galeria'
          })
        })
      }
      
      fetchProducts()
    } catch (error) {
      console.error('Erro ao definir principal:', error)
      alert('Erro ao definir imagem principal')
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(f => f.type.startsWith('image/'))
    if (imageFile) uploadImage(imageFile)
  }, [selectedProduct])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadImage(file)
    e.target.value = ''
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F4] flex items-center justify-center">
        <p className="text-[#8B7355]">Carregando...</p>
      </div>
    )
  }

  const sortedImages = selectedProduct?.product_images?.sort((a, b) => a.position - b.position) || []

  return (
    <div className="min-h-screen bg-[#FAF7F4]">
      <header className="bg-white border-b border-[#E8DFD5]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[#2D2D2D]">Admin Moveirama</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#8B7355]">{user?.email}</span>
            <button onClick={handleLogout} className="text-sm text-[#5A7A68] hover:text-[#4A6B5A] font-medium">Sair</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-[#2D2D2D]">Gestão de Imagens</h2>
            <p className="text-sm text-[#8B7355] mt-1">{stats.total} produtos • {stats.withImages} com imagens • {stats.withoutImages} sem imagens</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E8DFD5] p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input type="text" placeholder="Buscar por nome ou SKU..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E7A]" />
            </div>
            <div className="flex gap-2">
              {(['all', 'without-images', 'with-images'] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === f ? 'bg-[#6B8E7A] text-white' : 'bg-[#F0E8DF] text-[#2D2D2D] hover:bg-[#E8DFD5]'}`}>
                  {f === 'all' ? 'Todos' : f === 'without-images' ? 'Sem imagens' : 'Com imagens'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-[#E8DFD5] overflow-hidden">
            <div className="p-4 border-b border-[#E8DFD5]">
              <h3 className="font-semibold text-[#2D2D2D]">Produtos ({products.length})</h3>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {products.length === 0 ? (
                <div className="p-8 text-center text-[#8B7355]">Nenhum produto encontrado</div>
              ) : (
                <ul className="divide-y divide-[#E8DFD5]">
                  {products.map((product) => (
                    <li key={product.id}>
                      <button onClick={() => setSelectedProduct(product)} className={`w-full px-4 py-3 text-left hover:bg-[#F0E8DF] ${selectedProduct?.id === product.id ? 'bg-[#F0F5F2]' : ''}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#F0E8DF] rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {product.product_images?.[0] ? (
                              <img src={product.product_images[0].cloudinary_path} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs text-[#8B7355]">Sem foto</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#2D2D2D] truncate">{product.name}</p>
                            <p className="text-sm text-[#8B7355]">SKU: {product.sku} • {product.product_images?.length || 0} imagens</p>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E8DFD5]">
            <div className="p-4 border-b border-[#E8DFD5]">
              <h3 className="font-semibold text-[#2D2D2D]">{selectedProduct ? selectedProduct.name : 'Selecione um produto'}</h3>
            </div>
            <div className="p-4">
              {selectedProduct ? (
                <div>
                  <p className="text-sm text-[#8B7355] mb-4">SKU: {selectedProduct.sku}</p>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-[#2D2D2D] mb-2">Imagens ({sortedImages.length})</h4>
                    {sortedImages.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {sortedImages.map((img, idx) => (
                          <div key={img.id} className="relative aspect-square bg-[#F0E8DF] rounded overflow-hidden group">
                            <img src={img.cloudinary_path} alt="" className="w-full h-full object-cover" />
                            {idx === 0 && <span className="absolute top-1 left-1 text-xs bg-[#6B8E7A] text-white px-2 py-0.5 rounded">Principal</span>}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              {idx !== 0 && (
                                <button onClick={() => setPrincipal(img.id)} className="p-2 bg-white rounded-full text-[#6B8E7A] hover:bg-[#F0F5F2]" title="Tornar principal">
                                  ⭐
                                </button>
                              )}
                              <button onClick={() => deleteImage(img.id)} disabled={deleting === img.id} className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50" title="Excluir">
                                {deleting === img.id ? '...' : '🗑️'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#8B7355]">Nenhuma imagem cadastrada</p>
                    )}
                  </div>
                  <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`border-2 border-dashed rounded-lg p-6 text-center ${dragOver ? 'border-[#6B8E7A] bg-[#F0F5F2]' : 'border-[#E8DFD5] hover:border-[#6B8E7A]'}`}>
                    {uploading ? (
                      <p className="text-[#8B7355]">Enviando...</p>
                    ) : (
                      <div>
                        <p className="text-[#8B7355] mb-2">Arraste uma imagem ou</p>
                        <label className="inline-block px-4 py-2 bg-[#6B8E7A] text-white rounded-lg cursor-pointer hover:bg-[#5A7A68]">
                          Selecionar arquivo
                          <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                        </label>
                        <p className="text-xs text-[#8B7355] mt-2">JPG, PNG ou WebP</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-[#8B7355]">
                  <p>Clique em um produto para gerenciar suas imagens</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
