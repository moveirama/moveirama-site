'use client';

// ============================================
// Moveirama — Admin de Imagens
// Página principal
// ============================================

import { useState, useEffect, useCallback } from 'react';
import {
  ImageUploader,
  ImageGrid,
  FilterBar,
  ProductCard,
} from './components';
import {
  ProductFilters,
  ProductWithImageCount,
  ProductImage,
  PaginatedProducts,
} from '@/types/images';

export default function AdminImagensPage() {
  // Estados
  const [filters, setFilters] = useState<ProductFilters>({
    hasImages: 'all',
    page: 1,
    limit: 20,
  });
  const [products, setProducts] = useState<ProductWithImageCount[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    sku: string;
    slug: string;
    name: string;
    images: ProductImage[];
  } | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [categories, setCategories] = useState<Array<{ slug: string; name: string }>>([]);
  const [stats, setStats] = useState({ total: 0, withImages: 0, withoutImages: 0 });

  // Buscar produtos
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.hasImages && filters.hasImages !== 'all') params.set('hasImages', filters.hasImages);
      if (filters.categorySlug) params.set('category', filters.categorySlug);
      params.set('page', String(filters.page || 1));
      params.set('limit', String(filters.limit || 20));

      const response = await fetch(`/api/admin/images/products?${params}`);
      const data: PaginatedProducts = await response.json();

      setProducts(data.products);
      setTotalProducts(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
    setIsLoading(false);
  }, [filters]);

  // Buscar categorias
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/images/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  // Buscar estatísticas
  const fetchStats = async () => {
    try {
      // Buscar totais com diferentes filtros
      const [allRes, withRes, withoutRes] = await Promise.all([
        fetch('/api/admin/images/products?limit=1'),
        fetch('/api/admin/images/products?hasImages=with&limit=1'),
        fetch('/api/admin/images/products?hasImages=without&limit=1'),
      ]);

      const [allData, withData, withoutData] = await Promise.all([
        allRes.json(),
        withRes.json(),
        withoutRes.json(),
      ]);

      setStats({
        total: allData.total || 0,
        withImages: withData.total || 0,
        withoutImages: withoutData.total || 0,
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  // Buscar imagens de um produto
  const fetchProductImages = async (productId: string) => {
    setIsLoadingProduct(true);
    try {
      const response = await fetch(`/api/admin/images/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedProduct(data);
      }
    } catch (error) {
      console.error('Erro ao buscar imagens:', error);
    }
    setIsLoadingProduct(false);
  };

  // Effects
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      fetchProductImages(selectedProductId);
    } else {
      setSelectedProduct(null);
    }
  }, [selectedProductId]);

  // Handlers
  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(selectedProductId === productId ? null : productId);
  };

  const handleUploadComplete = (newImages: ProductImage[]) => {
    if (selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        images: [...selectedProduct.images, ...newImages],
      });
    }
    // Atualizar estatísticas
    fetchStats();
    // Atualizar lista de produtos
    fetchProducts();
  };

  const handleReorder = async (imageIds: string[]) => {
    if (!selectedProductId) return;

    const response = await fetch('/api/admin/images/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: selectedProductId, imageIds }),
    });

    if (!response.ok) {
      throw new Error('Erro ao reordenar');
    }

    // Recarregar imagens do produto
    await fetchProductImages(selectedProductId);
  };

  const handleDelete = async (imageId: string) => {
    const response = await fetch(`/api/admin/images/${imageId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir');
    }

    // Atualizar estado local
    if (selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        images: selectedProduct.images.filter((img) => img.id !== imageId),
      });
    }

    // Atualizar estatísticas e lista
    fetchStats();
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F4]">
      {/* Header */}
      <header className="bg-white border-b border-[#E8DFD5] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#2D2D2D]">🖼️ Admin de Imagens</h1>
              <p className="text-sm text-[#8B7355]">Gerenciar imagens dos produtos</p>
            </div>
            <a
              href="/"
              className="px-4 py-2 text-sm text-[#8B7355] hover:text-[#2D2D2D] border border-[#E8DFD5] rounded-lg hover:bg-[#F0E8DF] transition-colors"
            >
              ← Voltar ao site
            </a>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Filtros */}
        <div className="bg-white rounded-lg border border-[#E8DFD5] p-4 mb-6">
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
            stats={stats}
          />
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de produtos */}
          <div className="bg-white rounded-lg border border-[#E8DFD5] p-4">
            <h2 className="font-semibold text-[#2D2D2D] mb-4">
              Produtos ({totalProducts})
            </h2>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-[#F0E8DF] rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 text-[#8B7355]">
                <p>Nenhum produto encontrado</p>
                <p className="text-sm">Tente ajustar os filtros</p>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={handleSelectProduct}
                    isSelected={selectedProductId === product.id}
                  />
                ))}
              </div>
            )}

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E8DFD5]">
                <button
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                  disabled={filters.page === 1}
                  className="px-3 py-1 text-sm border border-[#E8DFD5] rounded hover:bg-[#F0E8DF] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Anterior
                </button>
                <span className="text-sm text-[#8B7355]">
                  Página {filters.page} de {totalPages}
                </span>
                <button
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                  disabled={filters.page === totalPages}
                  className="px-3 py-1 text-sm border border-[#E8DFD5] rounded hover:bg-[#F0E8DF] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo →
                </button>
              </div>
            )}
          </div>

          {/* Painel de imagens */}
          <div className="bg-white rounded-lg border border-[#E8DFD5] p-4">
            {selectedProduct ? (
              <div className="space-y-6">
                {/* Info do produto */}
                <div>
                  <h2 className="font-semibold text-[#2D2D2D]">{selectedProduct.name}</h2>
                  <p className="text-sm text-[#8B7355]">
                    SKU: {selectedProduct.sku} • Slug: {selectedProduct.slug}
                  </p>
                </div>

                {/* Upload */}
                <div>
                  <h3 className="font-medium text-[#2D2D2D] mb-3">Adicionar imagens</h3>
                  <ImageUploader
                    productId={selectedProduct.id}
                    productSlug={selectedProduct.slug}
                    productName={selectedProduct.name}
                    onUploadComplete={handleUploadComplete}
                  />
                </div>

                {/* Grid de imagens */}
                <div>
                  <h3 className="font-medium text-[#2D2D2D] mb-3">
                    Imagens cadastradas ({selectedProduct.images.length})
                  </h3>
                  <ImageGrid
                    images={selectedProduct.images}
                    onReorder={handleReorder}
                    onDelete={handleDelete}
                    isLoading={isLoadingProduct}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-center text-[#8B7355]">
                <div>
                  <svg
                    className="mx-auto h-12 w-12 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                    />
                  </svg>
                  <p className="font-medium">Selecione um produto</p>
                  <p className="text-sm">Clique em um produto à esquerda para gerenciar suas imagens</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
