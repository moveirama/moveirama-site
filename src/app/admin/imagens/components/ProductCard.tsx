'use client';

// ============================================
// Moveirama — ProductCard Component (Admin)
// Card de produto na listagem do admin
// ============================================

import { AdminProductCardProps } from '@/types/images';

export function ProductCard({
  product,
  onSelect,
  isSelected = false,
}: AdminProductCardProps) {
  return (
    <button
      onClick={() => onSelect(product.id)}
      className={`
        w-full p-4 rounded-lg border-2 text-left transition-all
        ${isSelected
          ? 'border-[#6B8E7A] bg-[#6B8E7A]/5 shadow-md'
          : 'border-[#E8DFD5] bg-white hover:border-[#6B8E7A]/50 hover:shadow-sm'
        }
      `}
    >
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[#F0E8DF]">
          {product.first_image_thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.first_image_thumb}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#8B7355]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Nome */}
          <h3 className="font-medium text-[#2D2D2D] truncate">{product.name}</h3>

          {/* SKU e Categoria */}
          <div className="flex gap-2 mt-1 text-sm text-[#8B7355]">
            <span className="font-mono">{product.sku}</span>
            {product.category_name && (
              <>
                <span>•</span>
                <span>{product.category_name}</span>
              </>
            )}
          </div>

          {/* Badge de imagens */}
          <div className="mt-2">
            {product.image_count === 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#B85C38]/10 text-[#B85C38] text-xs font-medium rounded">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Sem imagens
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#6B8E7A]/10 text-[#6B8E7A] text-xs font-medium rounded">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {product.image_count} {product.image_count === 1 ? 'imagem' : 'imagens'}
              </span>
            )}
          </div>
        </div>

        {/* Seta */}
        <div className="flex items-center text-[#8B7355]">
          <svg
            className={`w-5 h-5 transition-transform ${isSelected ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}
