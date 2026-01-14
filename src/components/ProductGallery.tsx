'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface ProductImage {
  id: string
  cloudinary_path: string
  alt_text: string | null
  image_type: string
}

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  // Ordena para mostrar imagem principal primeiro
  const sortedImages = [...images].sort((a, b) => {
    if (a.image_type === 'principal') return -1
    if (b.image_type === 'principal') return 1
    return 0
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  // Função para abrir lightbox
  const openLightbox = useCallback(() => {
    setIsLightboxOpen(true)
  }, [])

  // Função para fechar lightbox
  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false)
  }, [])

  // Função para ir para próxima imagem
  const goNext = useCallback(() => {
    setSelectedIndex(prev => (prev < sortedImages.length - 1 ? prev + 1 : prev))
  }, [sortedImages.length])

  // Função para ir para imagem anterior
  const goPrev = useCallback(() => {
    setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev))
  }, [])

  // Função para selecionar imagem específica
  const selectImage = useCallback((index: number) => {
    setSelectedIndex(index)
  }, [])

  // Efeito para ESC key e bloquear scroll
  useEffect(() => {
    if (!isLightboxOpen) return

    // Bloqueia scroll do body
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Handler para teclas
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox()
      } else if (e.key === 'ArrowRight') {
        goNext()
      } else if (e.key === 'ArrowLeft') {
        goPrev()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isLightboxOpen, closeLightbox, goNext, goPrev])

  const selectedImage = sortedImages[selectedIndex]

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square bg-[var(--color-cream)] rounded-lg overflow-hidden flex items-center justify-center">
        <span className="text-[var(--color-toffee)]">Sem imagem</span>
      </div>
    )
  }

  return (
    <>
      {/* Imagem Principal */}
      <div 
        className="relative aspect-square bg-[var(--color-cream)] rounded-lg overflow-hidden cursor-zoom-in group"
        onClick={openLightbox}
        role="button"
        aria-label="Clique para ampliar imagem"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && openLightbox()}
      >
        <Image
          src={selectedImage.cloudinary_path}
          alt={selectedImage.alt_text || productName}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        
        {/* Ícone de zoom */}
        <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md opacity-70 group-hover:opacity-100 transition-opacity">
          <svg className="w-5 h-5 text-[var(--color-graphite)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </div>
      </div>
      
      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {sortedImages.map((img, index) => (
            <button 
              key={img.id}
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                selectImage(index)
              }}
              className={`relative w-16 h-16 flex-shrink-0 bg-[var(--color-cream)] rounded overflow-hidden border-2 transition-all duration-200 ${
                index === selectedIndex 
                  ? 'border-[var(--color-sage-500)] ring-2 ring-[var(--color-sage-500)]/30' 
                  : 'border-[var(--color-sand-light)] hover:border-[var(--color-sage-400)]'
              }`}
              aria-label={`Ver imagem ${index + 1}`}
              aria-pressed={index === selectedIndex}
            >
              <Image
                src={img.cloudinary_path}
                alt={img.alt_text || `${productName} - imagem ${index + 1}`}
                fill
                className="object-contain"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Imagem ampliada"
        >
          {/* Botão Fechar */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              closeLightbox()
            }}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            aria-label="Fechar"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navegação Anterior */}
          {sortedImages.length > 1 && selectedIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goPrev()
              }}
              className="absolute left-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
              aria-label="Imagem anterior"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Imagem Ampliada */}
          <div 
            className="relative w-full h-full max-w-5xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.cloudinary_path}
              alt={selectedImage.alt_text || productName}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Navegação Próxima */}
          {sortedImages.length > 1 && selectedIndex < sortedImages.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goNext()
              }}
              className="absolute right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
              aria-label="Próxima imagem"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Indicador de posição e thumbnails no lightbox */}
          {sortedImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 rounded-full px-4 py-2">
              {sortedImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    selectImage(index)
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                    index === selectedIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Ir para imagem ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Contador de imagens */}
          <p className="absolute top-4 left-4 text-white/80 text-sm bg-black/50 px-3 py-1 rounded-full">
            {selectedIndex + 1} / {sortedImages.length}
          </p>

          {/* Dica de fechar */}
          <p className="absolute bottom-4 right-4 text-white/50 text-xs hidden md:block">
            ESC para fechar • ← → para navegar
          </p>
        </div>
      )}
    </>
  )
}
