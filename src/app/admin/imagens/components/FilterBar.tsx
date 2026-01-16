'use client';

// ============================================
// Moveirama — FilterBar Component
// Filtros para listagem de produtos
// ============================================

import { useState, useEffect } from 'react';
import { ProductFilters } from '@/types/images';

interface FilterBarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  categories?: Array<{ slug: string; name: string }>;
  stats?: {
    total: number;
    withImages: number;
    withoutImages: number;
  };
}

export function FilterBar({
  filters,
  onFiltersChange,
  categories = [],
  stats,
}: FilterBarProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounce da busca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({ ...filters, search: searchInput || undefined, page: 1 });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="space-y-4">
      {/* Estatísticas rápidas */}
      {stats && (
        <div className="flex gap-4 text-sm">
          <span className="text-[#2D2D2D]">
            <strong>{stats.total}</strong> produtos
          </span>
          <span className="text-[#6B8E7A]">
            <strong>{stats.withImages}</strong> com imagens
          </span>
          <span className="text-[#B85C38]">
            <strong>{stats.withoutImages}</strong> sem imagens
          </span>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-4">
        {/* Busca */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nome ou SKU..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E8DFD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E7A]/40 focus:border-[#6B8E7A]"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B7355] hover:text-[#2D2D2D]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filtro de imagens */}
        <div className="flex rounded-lg border border-[#E8DFD5] overflow-hidden">
          <button
            onClick={() => onFiltersChange({ ...filters, hasImages: 'all', page: 1 })}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              filters.hasImages === 'all'
                ? 'bg-[#6B8E7A] text-white'
                : 'bg-white text-[#8B7355] hover:bg-[#F0E8DF]'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => onFiltersChange({ ...filters, hasImages: 'without', page: 1 })}
            className={`px-4 py-2 text-sm font-medium transition-colors border-l border-[#E8DFD5] ${
              filters.hasImages === 'without'
                ? 'bg-[#B85C38] text-white'
                : 'bg-white text-[#8B7355] hover:bg-[#F0E8DF]'
            }`}
          >
            Sem imagens
          </button>
          <button
            onClick={() => onFiltersChange({ ...filters, hasImages: 'with', page: 1 })}
            className={`px-4 py-2 text-sm font-medium transition-colors border-l border-[#E8DFD5] ${
              filters.hasImages === 'with'
                ? 'bg-[#6B8E7A] text-white'
                : 'bg-white text-[#8B7355] hover:bg-[#F0E8DF]'
            }`}
          >
            Com imagens
          </button>
        </div>

        {/* Filtro de categoria */}
        {categories.length > 0 && (
          <select
            value={filters.categorySlug || ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                categorySlug: e.target.value || undefined,
                page: 1,
              })
            }
            className="px-4 py-2 border border-[#E8DFD5] rounded-lg bg-white text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#6B8E7A]/40 focus:border-[#6B8E7A]"
          >
            <option value="">Todas categorias</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Filtros ativos */}
      {(filters.search || filters.categorySlug || filters.hasImages !== 'all') && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F0E8DF] text-[#2D2D2D] text-sm rounded-full">
              Busca: {filters.search}
              <button
                onClick={() => {
                  setSearchInput('');
                  onFiltersChange({ ...filters, search: undefined, page: 1 });
                }}
                className="text-[#8B7355] hover:text-[#2D2D2D]"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {filters.categorySlug && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F0E8DF] text-[#2D2D2D] text-sm rounded-full">
              Categoria: {categories.find((c) => c.slug === filters.categorySlug)?.name}
              <button
                onClick={() =>
                  onFiltersChange({ ...filters, categorySlug: undefined, page: 1 })
                }
                className="text-[#8B7355] hover:text-[#2D2D2D]"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setSearchInput('');
              onFiltersChange({
                search: undefined,
                hasImages: 'all',
                categorySlug: undefined,
                page: 1,
                limit: filters.limit,
              });
            }}
            className="text-sm text-[#8B7355] hover:text-[#2D2D2D] underline"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
