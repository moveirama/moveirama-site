'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type ProductImage = {
  id: string
  image_url: string
  image_type: string
  position: number
}

type Product = {
  id: string
  sku: string
  name: string
  slug: string
  price: number
  assembly_video_url: string | null
  manual_pdf_url: string | null
  medidas_image_url: string | null
  tv_max_size: number | null
  weight_capacity: number | null
  category_slug: string | null
  product_images: ProductImage[]
}

type Stats = {
  total: number
  withImages: number
  withoutImages: number
}

function SortableImage({ img, idx, onDelete, deleting }: { 
  img: ProductImage
  idx: number
  onDelete: (id: string) => void
  deleting: string | null 
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: img.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} className="relative aspect-square bg-[#F0E8DF] rounded overflow-hidden group">
      <div {...attributes} {...listeners} className="absolute inset-0 cursor-grab active:cursor-grabbing">
        <img src={img.image_url} alt="" className="w-full h-full object-cover pointer-events-none" />
      </div>
      {idx === 0 && <span className="absolute top-1 left-1 text-xs bg-[#6B8E7A] text-white px-2 py-0.5 rounded z-10">Principal</span>}
      <div className="absolute bottom-1 right-1 z-10">
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(img.id); }} 
          disabled={deleting === img.id} 
          className="p-1.5 bg-white/90 rounded text-red-500 hover:bg-red-50 text-sm"
          title="Excluir"
        >
          {deleting === img.id ? '...' : '🗑️'}
        </button>
      </div>
    </div>
  )
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
  const [uploadingMedidas, setUploadingMedidas] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [dragOverMedidas, setDragOverMedidas] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [manualUrl, setManualUrl] = useState('')
  const [tvMaxSize, setTvMaxSize] = useState('')
  const [weightCapacity, setWeightCapacity] = useState('')
  const [price, setPrice] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

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
          if (updated) {
            setSelectedProduct(updated)
            setVideoUrl(updated.assembly_video_url || '')
            setManualUrl(updated.manual_pdf_url || '')
            setTvMaxSize(updated.tv_max_size?.toString() || '')
            setWeightCapacity(updated.weight_capacity?.toString() || '')
            setPrice(updated.price?.toString() || '')
          }
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

  useEffect(() => {
    if (selectedProduct) {
      setVideoUrl(selectedProduct.assembly_video_url || '')
      setManualUrl(selectedProduct.manual_pdf_url || '')
      setTvMaxSize(selectedProduct.tv_max_size?.toString() || '')
      setWeightCapacity(selectedProduct.weight_capacity?.toString() || '')
      setPrice(selectedProduct.price?.toString() || '')
    }
  }, [selectedProduct?.id])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  async function saveUrls() {
    if (!selectedProduct) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assembly_video_url: videoUrl || null,
          manual_pdf_url: manualUrl || null,
          tv_max_size: tvMaxSize ? parseInt(tvMaxSize) : null,
          weight_capacity: weightCapacity ? parseInt(weightCapacity) : null,
          price: price ? parseFloat(price) : null
        })
      })
      const data = await res.json()
      if (data.success) {
        fetchProducts()
        alert('Salvo com sucesso!')
      } else {
        alert('Erro ao salvar: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar')
    } finally {
      setSaving(false)
    }
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

  async function uploadMedidasImage(file: File) {
    if (!selectedProduct) return
    setUploadingMedidas(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('productId', selectedProduct.id)
      formData.append('productSlug', selectedProduct.slug)
      formData.append('imageType', 'medidas')
      
      const res = await fetch('/api/admin/images/upload-medidas', { method: 'POST', body: formData })
      const data = await res.json()
      
      if (data.success) {
        fetchProducts()
        alert('Imagem das medidas salva!')
      } else {
        alert('Erro no upload: ' + data.error)
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload')
    } finally {
      setUploadingMedidas(false)
    }
  }

  async function removeMedidasImage() {
    if (!selectedProduct) return
    if (!confirm('Tem certeza que deseja remover a imagem das medidas?')) return
    
    setUploadingMedidas(true)
    try {
      const res = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medidas_image_url: null })
      })
      const data = await res.json()
      if (data.success) {
        fetchProducts()
      } else {
        alert('Erro ao remover: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao remover:', error)
      alert('Erro ao remover imagem')
    } finally {
      setUploadingMedidas(false)
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

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id || !selectedProduct) return

    const images = [...(selectedProduct.product_images || [])].sort((a, b) => a.position - b.position)
    const oldIndex = images.findIndex(img => img.id === active.id)
    const newIndex = images.findIndex(img => img.id === over.id)
    
    const reordered = arrayMove(images, oldIndex, newIndex)
    
    setSelectedProduct({
      ...selectedProduct,
      product_images: reordered.map((img, idx) => ({ ...img, position: idx }))
    })

    try {
      for (let i = 0; i < reordered.length; i++) {
        await fetch(`/api/admin/images/${reordered[i].id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            position: i,
            image_type: i === 0 ? 'principal' : 'galeria'
          })
        })
      }
      fetchProducts()
    } catch (error) {
      console.error('Erro ao reordenar:', error)
      alert('Erro ao reordenar imagens')
      fetchProducts()
    }
  }

  const handleDragOverUpload = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeaveUpload = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDropUpload = useCallback((e: React.DragEvent) => {
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

  const handleDragOverMedidas = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOverMedidas(true)
  }, [])

  const handleDragLeaveMedidas = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOverMedidas(false)
  }, [])

  const handleDropMedidas = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOverMedidas(false)
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(f => f.type.startsWith('image/'))
    if (imageFile) uploadMedidasImage(imageFile)
  }, [selectedProduct])

  const handleMedidasFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadMedidasImage(file)
    e.target.value = ''
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F4] flex items-center justify-center">
        <p className="text-[#8B7355]">Carregando...</p>
      </div>
    )
  }

  const sortedImages = [...(selectedProduct?.product_images || [])].sort((a, b) => a.position - b.position)

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
            <h2 className="text-2xl font-semibold text-[#2D2D2D]">Gestão de Produtos</h2>
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
            <div className="max-h-[700px] overflow-y-auto">
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
                              <img src={product.product_images[0].image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs text-[#8B7355]">Sem foto</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#2D2D2D] truncate">{product.name}</p>
                            <p className="text-sm text-[#8B7355]">SKU: {product.sku} • {product.product_images?.length || 0} img</p>
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
            <div className="p-4 max-h-[700px] overflow-y-auto">
              {selectedProduct ? (
                <div>
                  <p className="text-sm text-[#8B7355] mb-4">SKU: {selectedProduct.sku}</p>
                  
                  {/* Imagens do Produto */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-[#2D2D2D] mb-2">Imagens do Produto ({sortedImages.length}) <span className="font-normal text-[#8B7355]">— arraste para reordenar</span></h4>
                    {sortedImages.length > 0 ? (
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={sortedImages.map(img => img.id)} strategy={rectSortingStrategy}>
                          <div className="grid grid-cols-2 gap-3">
                            {sortedImages.map((img, idx) => (
                              <SortableImage key={img.id} img={img} idx={idx} onDelete={deleteImage} deleting={deleting} />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    ) : (
                      <p className="text-sm text-[#8B7355]">Nenhuma imagem cadastrada</p>
                    )}
                  </div>
                  
                  {/* Upload de Imagens do Produto */}
                  <div onDragOver={handleDragOverUpload} onDragLeave={handleDragLeaveUpload} onDrop={handleDropUpload} className={`border-2 border-dashed rounded-lg p-6 text-center mb-6 ${dragOver ? 'border-[#6B8E7A] bg-[#F0F5F2]' : 'border-[#E8DFD5] hover:border-[#6B8E7A]'}`}>
                    {uploading ? (
                      <p className="text-[#8B7355]">Enviando...</p>
                    ) : (
                      <div>
                        <p className="text-[#8B7355] mb-2">Arraste uma imagem ou</p>
                        <label className="inline-block px-4 py-2 bg-[#6B8E7A] text-white rounded-lg cursor-pointer hover:bg-[#5A7A68]">
                          Selecionar arquivo
                          <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Imagem das Medidas */}
                  <div className="border-t border-[#E8DFD5] pt-6 mb-6">
                    <h4 className="text-sm font-medium text-[#2D2D2D] mb-2">
                      📐 Imagem das Medidas
                      <span className="font-normal text-[#8B7355] ml-2">— dimensões do produto (L x A x P)</span>
                    </h4>
                    
                    {selectedProduct.medidas_image_url ? (
                      <div className="relative">
                        <div className="bg-[#F0E8DF] rounded-lg p-4">
                          <img 
                            src={selectedProduct.medidas_image_url} 
                            alt="Medidas do produto" 
                            className="max-h-48 mx-auto rounded"
                          />
                        </div>
                        <div className="flex gap-2 mt-3">
                          <label className="flex-1 px-4 py-2 bg-[#F0E8DF] text-[#2D2D2D] rounded-lg cursor-pointer hover:bg-[#E8DFD5] text-center text-sm font-medium">
                            Trocar imagem
                            <input type="file" accept="image/*" onChange={handleMedidasFileSelect} className="hidden" disabled={uploadingMedidas} />
                          </label>
                          <button 
                            onClick={removeMedidasImage}
                            disabled={uploadingMedidas}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium disabled:opacity-50"
                          >
                            {uploadingMedidas ? '...' : 'Remover'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onDragOver={handleDragOverMedidas} 
                        onDragLeave={handleDragLeaveMedidas} 
                        onDrop={handleDropMedidas} 
                        className={`border-2 border-dashed rounded-lg p-6 text-center ${dragOverMedidas ? 'border-[#6B8E7A] bg-[#F0F5F2]' : 'border-[#E8DFD5] hover:border-[#6B8E7A]'}`}
                      >
                        {uploadingMedidas ? (
                          <p className="text-[#8B7355]">Enviando...</p>
                        ) : (
                          <div>
                            <p className="text-[#8B7355] mb-2">Arraste a imagem das medidas ou</p>
                            <label className="inline-block px-4 py-2 bg-[#F0E8DF] text-[#2D2D2D] rounded-lg cursor-pointer hover:bg-[#E8DFD5] font-medium">
                              Selecionar arquivo
                              <input type="file" accept="image/*" onChange={handleMedidasFileSelect} className="hidden" />
                            </label>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Preço do Produto */}
                  <div className="border-t border-[#E8DFD5] pt-6 mb-6">
                    <h4 className="text-sm font-medium text-[#2D2D2D] mb-2">
                      💰 Preço
                      <span className="font-normal text-[#8B7355] ml-2">— valor de venda do produto</span>
                    </h4>
                    
                    <div>
                      <label className="block text-sm text-[#8B7355] mb-1">Preço (R$)</label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#8B7355]">R$</span>
                        <input 
                          type="number" 
                          placeholder="Ex: 299.90"
                          min="0"
                          step="0.01"
                          value={price} 
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-40 px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E7A] text-sm"
                        />
                      </div>
                      <p className="text-xs text-[#8B7355] mt-1">Preço atual: <strong>R$ {selectedProduct.price?.toFixed(2) || '0.00'}</strong></p>
                    </div>
                  </div>

                  {/* Suporta TV até - só para racks e painéis */}
                  {selectedProduct.category_slug && ['racks', 'paineis'].includes(selectedProduct.category_slug) && (
                    <div className="border-t border-[#E8DFD5] pt-6 mb-6">
                      <h4 className="text-sm font-medium text-[#2D2D2D] mb-2">
                        📺 Compatibilidade TV
                        <span className="font-normal text-[#8B7355] ml-2">— importante para racks e painéis</span>
                      </h4>
                      
                      <div>
                        <label className="block text-sm text-[#8B7355] mb-1">Suporta TV até (polegadas)</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            placeholder="Ex: 55"
                            min="0"
                            max="100"
                            value={tvMaxSize} 
                            onChange={(e) => setTvMaxSize(e.target.value)}
                            className="w-32 px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E7A] text-sm"
                          />
                          <span className="text-sm text-[#8B7355]">polegadas</span>
                        </div>
                        <p className="text-xs text-[#8B7355] mt-1">Deixe vazio se não souber. Aparece na página do produto.</p>
                      </div>
                    </div>
                  )}

                  {/* Peso Suportado */}
                  <div className="border-t border-[#E8DFD5] pt-6 mb-6">
                    <h4 className="text-sm font-medium text-[#2D2D2D] mb-2">
                      ⚖️ Peso Suportado
                      <span className="font-normal text-[#8B7355] ml-2">— quanto o móvel aguenta (total)</span>
                    </h4>
                    
                    <div>
                      <label className="block text-sm text-[#8B7355] mb-1">Peso máximo suportado (kg)</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          placeholder="Ex: 35"
                          min="0"
                          max="500"
                          value={weightCapacity} 
                          onChange={(e) => setWeightCapacity(e.target.value)}
                          className="w-32 px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E7A] text-sm"
                        />
                        <span className="text-sm text-[#8B7355]">kg</span>
                      </div>
                      <p className="text-xs text-[#8B7355] mt-1">Informação da ficha técnica. Aparece na página do produto como "Peso suportado: Até X kg".</p>
                    </div>
                  </div>

                  {/* URLs de Montagem */}
                  <div className="border-t border-[#E8DFD5] pt-6">
                    <h4 className="text-sm font-medium text-[#2D2D2D] mb-4">Montagem</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-[#8B7355] mb-1">Vídeo de Montagem (YouTube)</label>
                        <input 
                          type="url" 
                          placeholder="https://www.youtube.com/watch?v=..." 
                          value={videoUrl} 
                          onChange={(e) => setVideoUrl(e.target.value)}
                          className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E7A] text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-[#8B7355] mb-1">Manual PDF (URL)</label>
                        <input 
                          type="url" 
                          placeholder="https://..." 
                          value={manualUrl} 
                          onChange={(e) => setManualUrl(e.target.value)}
                          className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E7A] text-sm"
                        />
                      </div>
                      
                      <button 
                        onClick={saveUrls}
                        disabled={saving}
                        className="w-full px-4 py-2 bg-[#6B8E7A] text-white rounded-lg hover:bg-[#5A7A68] disabled:opacity-50"
                      >
                        {saving ? 'Salvando...' : 'Salvar'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-[#8B7355]">
                  <p>Clique em um produto para gerenciar</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
