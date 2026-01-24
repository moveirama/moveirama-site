'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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
  price: number
  compare_at_price: number | null  // OFERTA: preço "de" (antigo)
  is_on_sale: boolean | null       // OFERTA: flag de oferta
  assembly_video_url: string | null
  video_product_url: string | null
  manual_pdf_url: string | null
  medidas_image_url: string | null
  tv_max_size: number | null
  weight_capacity: number | null
  category_slug: string | null
  product_images: ProductImage[]
  // Características
  num_doors: number | null
  num_drawers: number | null
  num_shelves: number | null
  num_niches: number | null
  has_wheels: boolean | null
  has_mirror: boolean | null
  has_lighting: boolean | null
  door_type: string | null
  feet_type: string | null
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
        <img src={img.cloudinary_path} alt="" className="w-full h-full object-cover pointer-events-none" />
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
  
  // Campos existentes
  const [videoUrl, setVideoUrl] = useState('')
  const [videoProductUrl, setVideoProductUrl] = useState('')
  const [manualUrl, setManualUrl] = useState('')
  const [tvMaxSize, setTvMaxSize] = useState('')
  const [weightCapacity, setWeightCapacity] = useState('')
  const [price, setPrice] = useState('')
  
  // OFERTA: Novos campos
  const [isOnSale, setIsOnSale] = useState(false)
  const [compareAtPrice, setCompareAtPrice] = useState('')
  
  // Campos de características (NOVOS)
  const [numDoors, setNumDoors] = useState('')
  const [numDrawers, setNumDrawers] = useState('')
  const [numShelves, setNumShelves] = useState('')
  const [numNiches, setNumNiches] = useState('')
  const [hasWheels, setHasWheels] = useState(false)
  const [hasMirror, setHasMirror] = useState(false)
  const [hasLighting, setHasLighting] = useState(false)
  const [doorType, setDoorType] = useState('')
  const [feetType, setFeetType] = useState('')
  
  // Controle de abas
  const [activeTab, setActiveTab] = useState<'imagens' | 'caracteristicas'>('imagens')
  
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
            updateFormFields(updated)
          }
        }
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    }
  }

  // Função para atualizar todos os campos do formulário
  function updateFormFields(product: Product) {
    setVideoUrl(product.assembly_video_url || '')
    setVideoProductUrl(product.video_product_url || '')
    setManualUrl(product.manual_pdf_url || '')
    setTvMaxSize(product.tv_max_size?.toString() || '')
    setWeightCapacity(product.weight_capacity?.toString() || '')
    setPrice(product.price?.toString() || '')
    // OFERTA: Atualizar campos de oferta
    setIsOnSale(product.is_on_sale || false)
    setCompareAtPrice(product.compare_at_price?.toString() || '')
    // Características
    setNumDoors(product.num_doors?.toString() || '')
    setNumDrawers(product.num_drawers?.toString() || '')
    setNumShelves(product.num_shelves?.toString() || '')
    setNumNiches(product.num_niches?.toString() || '')
    setHasWheels(product.has_wheels || false)
    setHasMirror(product.has_mirror || false)
    setHasLighting(product.has_lighting || false)
    setDoorType(product.door_type || '')
    setFeetType(product.feet_type || '')
  }

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => { fetchProducts() }, 300)
      return () => clearTimeout(timer)
    }
  }, [search, filter])

  useEffect(() => {
    if (selectedProduct) {
      updateFormFields(selectedProduct)
    }
  }, [selectedProduct?.id])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  async function saveProduct() {
    if (!selectedProduct) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assembly_video_url: videoUrl || null,
          video_product_url: videoProductUrl || null,
          manual_pdf_url: manualUrl || null,
          tv_max_size: tvMaxSize ? parseInt(tvMaxSize) : null,
          weight_capacity: weightCapacity ? parseInt(weightCapacity) : null,
          price: price ? parseFloat(price) : null,
          // OFERTA: Incluir campos de oferta no save
          is_on_sale: isOnSale,
          compare_at_price: compareAtPrice ? parseFloat(compareAtPrice) : null,
          // Características
          num_doors: numDoors ? parseInt(numDoors) : null,
          num_drawers: numDrawers ? parseInt(numDrawers) : null,
          num_shelves: numShelves ? parseInt(numShelves) : null,
          num_niches: numNiches ? parseInt(numNiches) : null,
          has_wheels: hasWheels,
          has_mirror: hasMirror,
          has_lighting: hasLighting,
          door_type: doorType || null,
          feet_type: feetType || null,
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

  // Função para comprimir imagem antes do upload (evita erro 413 do Vercel)
  async function compressImage(file: File, maxSize = 2000, quality = 0.85): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        // Calcula novas dimensões mantendo proporção
        let { width, height } = img
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize
            width = maxSize
          } else {
            width = (width / height) * maxSize
            height = maxSize
          }
        }

        // Cria canvas e desenha imagem redimensionada
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Erro ao criar canvas'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)

        // Converte para blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Erro ao comprimir imagem'))
              return
            }
            // Cria novo File com mesmo nome
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            console.log(`Imagem comprimida: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`)
            resolve(compressedFile)
          },
          'image/jpeg',
          quality
        )
      }
      img.onerror = () => reject(new Error('Erro ao carregar imagem'))
      img.src = URL.createObjectURL(file)
    })
  }

  async function uploadImage(file: File) {
    if (!selectedProduct) return
    setUploading(true)
    try {
      // Comprime imagem se for maior que 3MB (evita erro 413 do Vercel)
      let fileToUpload = file
      if (file.size > 3 * 1024 * 1024) {
        console.log('Comprimindo imagem grande...')
        fileToUpload = await compressImage(file)
      }

      const formData = new FormData()
      formData.append('file', fileToUpload)
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

  // OFERTA: Função auxiliar para calcular desconto
  function calcularDesconto(precoAtual: number, precoDe: number): number {
    if (!precoDe || precoDe <= precoAtual) return 0
    return Math.round(((precoDe - precoAtual) / precoDe) * 100)
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
                          <div className="w-12 h-12 bg-[#F0E8DF] rounded flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                            {product.product_images?.[0] ? (
                              <img src={product.product_images[0].cloudinary_path} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs text-[#8B7355]">Sem foto</span>
                            )}
                            {/* OFERTA: Badge de oferta na lista */}
                            {product.is_on_sale && (
                              <span className="absolute -top-1 -right-1 text-[10px] bg-[#B85C38] text-white px-1 rounded">%</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#2D2D2D] truncate">{product.name}</p>
                            <p className="text-sm text-[#8B7355]">
                              SKU: {product.sku} • {product.product_images?.length || 0} img
                              {/* OFERTA: Mostrar badge se em oferta */}
                              {product.is_on_sale && <span className="ml-2 text-[#B85C38] font-medium">• Em oferta</span>}
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

          <div className="bg-white rounded-lg border border-[#E8DFD5]">
            <div className="p-4 border-b border-[#E8DFD5]">
              <h3 className="font-semibold text-[#2D2D2D]">{selectedProduct ? selectedProduct.name : 'Selecione um produto'}</h3>
              {selectedProduct && (
                <p className="text-sm text-[#8B7355] mt-1">SKU: {selectedProduct.sku}</p>
              )}
            </div>
            
            {/* Abas */}
            {selectedProduct && (
              <div className="flex border-b border-[#E8DFD5]">
                <button
                  onClick={() => setActiveTab('imagens')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'imagens'
                      ? 'text-[#6B8E7A] border-b-2 border-[#6B8E7A] bg-[#F0F5F2]'
                      : 'text-[#8B7355] hover:text-[#2D2D2D] hover:bg-[#F0E8DF]'
                  }`}
                >
                  📷 Imagens
                </button>
                <button
                  onClick={() => setActiveTab('caracteristicas')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'caracteristicas'
                      ? 'text-[#6B8E7A] border-b-2 border-[#6B8E7A] bg-[#F0F5F2]'
                      : 'text-[#8B7355] hover:text-[#2D2D2D] hover:bg-[#F0E8DF]'
                  }`}
                >
                  📋 Características
                </button>
              </div>
            )}
            
            <div className="p-4 max-h-[650px] overflow-y-auto">
              {selectedProduct ? (
                <>
                  {/* ========== ABA IMAGENS ========== */}
                  {activeTab === 'imagens' && (
                    <div>
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

                      {/* URLs de Montagem */}
                      <div className="border-t border-[#E8DFD5] pt-6">
                        <h4 className="text-sm font-medium text-[#2D2D2D] mb-4">🔧 Montagem</h4>
                        
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
                            <label className="block text-sm text-[#8B7355] mb-1">Vídeo do Produto (YouTube)</label>
                            <input 
                              type="url" 
                              placeholder="https://www.youtube.com/watch?v=..." 
                              value={videoProductUrl} 
                              onChange={(e) => setVideoProductUrl(e.target.value)}
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
                            onClick={saveProduct}
                            disabled={saving}
                            className="w-full px-4 py-2 bg-[#6B8E7A] text-white rounded-lg hover:bg-[#5A7A68] disabled:opacity-50"
                          >
                            {saving ? 'Salvando...' : 'Salvar'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========== ABA CARACTERÍSTICAS ========== */}
                  {activeTab === 'caracteristicas' && (
                    <div className="space-y-6">
                      
                      {/* Preço */}
                      <div>
                        <h4 className="text-sm font-medium text-[#2D2D2D] mb-3">💰 Preço</h4>
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
                      </div>

                      {/* OFERTA: Nova seção de Ofertas */}
                      <div className="border-t border-[#E8DFD5] pt-6">
                        <h4 className="text-sm font-medium text-[#2D2D2D] mb-3">🏷️ Oferta</h4>
                        
                        {/* Checkbox Em Oferta */}
                        <label className="flex items-center gap-3 cursor-pointer mb-4">
                          <input 
                            type="checkbox" 
                            checked={isOnSale}
                            onChange={(e) => setIsOnSale(e.target.checked)}
                            className="w-5 h-5 rounded border-[#E8DFD5] text-[#B85C38] focus:ring-[#B85C38]"
                          />
                          <span className="text-sm text-[#2D2D2D] font-medium">Produto em Oferta</span>
                        </label>
                        
                        {/* Campo Preço "De" - só aparece se marcado como oferta */}
                        {isOnSale && (
                          <div className="ml-8 space-y-4">
                            <div>
                              <label className="block text-sm text-[#8B7355] mb-1">Vender por:</label>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-[#8B7355]">R$</span>
                                <input 
                                  type="number" 
                                  placeholder="Ex: 799.00"
                                  min="0"
                                  step="0.01"
                                  value={compareAtPrice} 
                                  onChange={(e) => setCompareAtPrice(e.target.value)}
                                  className="w-40 px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B85C38] text-sm"
                                />
                              </div>
                            </div>
                            
                            {/* Preview do desconto */}
                            {price && compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price) && (
                              <div className="p-3 bg-[#FDF0EB] border border-[#B85C38]/20 rounded-lg">
                                <p className="text-sm text-[#2D2D2D]">
                                  <span className="text-[#8B7355] line-through">De R$ {parseFloat(compareAtPrice).toFixed(2).replace('.', ',')}</span>
                                  <span className="mx-2">por</span>
                                  <span className="font-bold text-[#2D2D2D]">R$ {parseFloat(price).toFixed(2).replace('.', ',')}</span>
                                  <span className="ml-2 px-2 py-0.5 bg-[#B85C38] text-white text-xs font-bold rounded">
                                    {calcularDesconto(parseFloat(price), parseFloat(compareAtPrice))}% OFF
                                  </span>
                                </p>
                              </div>
                            )}
                          
                          </div>
                        )}
                      </div>

                      {/* Compatibilidade TV - só para racks e painéis */}
                      {selectedProduct.category_slug && ['racks', 'paineis'].includes(selectedProduct.category_slug) && (
                        <div className="border-t border-[#E8DFD5] pt-6">
                          <h4 className="text-sm font-medium text-[#2D2D2D] mb-3">📺 Compatibilidade TV</h4>
                          <div className="flex items-center gap-2">
                            <input 
                              type="number" 
                              placeholder="Ex: 55"
                              min="0"
                              max="100"
                              value={tvMaxSize} 
                              onChange={(e) => setTvMaxSize(e.target.value)}
                              className="w-24 px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E7A] text-sm"
                            />
                            <span className="text-sm text-[#8B7355]">polegadas</span>
                          </div>
                        </div>
                      )}

                      {/* Peso Suportado */}
                      <div className="border-t border-[#E8DFD5] pt-6">
                        <h4 className="text-sm font-medium text-[#2D2D2D] mb-3">⚖️ Peso Suportado</h4>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            placeholder="Ex: 35"
                            min="0"
                            max="500"
                            value={weightCapacity} 
                            onChange={(e) => setWeightCapacity(e.target.value)}
                            className="w-24 px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E7A] text-sm"
                          />
                          <span className="text-sm text-[#8B7355]">kg</span>
                        </div>
                      </div>

                      {/* Quantidades */}
                      <div className="border-t border-[#E8DFD5] pt-6">
                        <h4 className="text-sm font-medium text-[#2D2D2D] mb-3">🗄️ Estrutura do Móvel</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-[#8B7355] mb-1">Portas</label>
                            <input 
                              type="number" 
                              placeholder="0"
                              min="0"
                              value={numDoors} 
                              onChange={(e) => setNumDoors(e.target.value)}
                              className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E7A] text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-[#8B7355] mb-1">Gavetas</label>
                            <input 
                              type="number" 
                              placeholder="0"
                              min="0"
                              value={numDrawers} 
                              onChange={(e) => setNumDrawers(e.target.value)}
                              className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E7A] text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-[#8B7355] mb-1">Prateleiras</label>
                            <input 
                              type="number" 
                              placeholder="0"
                              min="0"
                              value={numShelves} 
                              onChange={(e) => setNumShelves(e.target.value)}
                              className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E7A] text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-[#8B7355] mb-1">Nichos</label>
                            <input 
                              type="number" 
                              placeholder="0"
                              min="0"
                              value={numNiches} 
                              onChange={(e) => setNumNiches(e.target.value)}
                              className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E7A] text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Tipo de Porta e Pés */}
                      <div className="border-t border-[#E8DFD5] pt-6">
                        <h4 className="text-sm font-medium text-[#2D2D2D] mb-3">🚪 Detalhes</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-[#8B7355] mb-1">Tipo de Porta</label>
                            <select 
                              value={doorType} 
                              onChange={(e) => setDoorType(e.target.value)}
                              className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E7A] text-sm bg-white"
                            >
                              <option value="">Nenhuma / N/A</option>
                              <option value="abrir">De abrir</option>
                              <option value="deslizante">Deslizante</option>
                              <option value="basculante">Basculante</option>
                              <option value="metal">Metal</option>
                              <option value="vidro">Vidro</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm text-[#8B7355] mb-1">Tipo de Pés</label>
                            <select 
                              value={feetType} 
                              onChange={(e) => setFeetType(e.target.value)}
                              className="w-full px-3 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E7A] text-sm bg-white"
                            >
                              <option value="">Nenhum / N/A</option>
                              <option value="metalico">Metálico</option>
                              <option value="madeira">Madeira</option>
                              <option value="plastico">Plástico</option>
                              <option value="rodizio">Rodízio</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Checkboxes */}
                      <div className="border-t border-[#E8DFD5] pt-6">
                        <h4 className="text-sm font-medium text-[#2D2D2D] mb-3">✨ Recursos Especiais</h4>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={hasWheels}
                              onChange={(e) => setHasWheels(e.target.checked)}
                              className="w-5 h-5 rounded border-[#E8DFD5] text-[#6B8E7A] focus:ring-[#6B8E7A]"
                            />
                            <span className="text-sm text-[#2D2D2D]">🛞 Com Rodinhas</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={hasMirror}
                              onChange={(e) => setHasMirror(e.target.checked)}
                              className="w-5 h-5 rounded border-[#E8DFD5] text-[#6B8E7A] focus:ring-[#6B8E7A]"
                            />
                            <span className="text-sm text-[#2D2D2D]">🪞 Com Espelho</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={hasLighting}
                              onChange={(e) => setHasLighting(e.target.checked)}
                              className="w-5 h-5 rounded border-[#E8DFD5] text-[#6B8E7A] focus:ring-[#6B8E7A]"
                            />
                            <span className="text-sm text-[#2D2D2D]">💡 Com LED / Iluminação</span>
                          </label>
                        </div>
                      </div>

                      {/* Botão Salvar */}
                      <div className="border-t border-[#E8DFD5] pt-6">
                        <button 
                          onClick={saveProduct}
                          disabled={saving}
                          className="w-full px-4 py-3 bg-[#6B8E7A] text-white rounded-lg hover:bg-[#5A7A68] disabled:opacity-50 font-medium"
                        >
                          {saving ? 'Salvando...' : '💾 Salvar Características'}
                        </button>
                      </div>
                    </div>
                  )}
                </>
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