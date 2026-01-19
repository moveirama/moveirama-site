'use client'

import { useState, useCallback } from 'react'

/**
 * VideoProduct — Seção de vídeo de apresentação do produto
 * 
 * v1.0 — 20/01/2026
 * Specs: SPEC_Video_Produto_PDP.md (Squad Visual)
 * 
 * DIFERENTE de vídeo de montagem:
 * - Vídeo Produto: apresentação, detalhes, gera desejo
 * - Vídeo Montagem: passo a passo, reduz medo
 * 
 * Posição na PDP: primeiro item abaixo da dobra (após trust badges)
 */

interface VideoProductProps {
  videoUrl: string | null | undefined
  productName: string
}

/**
 * Extrai o VIDEO_ID de diferentes formatos de URL do YouTube
 * Suporta:
 * - https://www.youtube.com/watch?v=ABC123
 * - https://youtu.be/ABC123
 * - https://www.youtube.com/embed/ABC123
 */
function getYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\n?#]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

/**
 * Gera URL do thumbnail do YouTube
 * Tenta maxresdefault primeiro, fallback para hqdefault
 */
function getThumbnailUrl(videoId: string, quality: 'maxres' | 'hq' = 'maxres'): string {
  const qualityMap = {
    maxres: 'maxresdefault',
    hq: 'hqdefault'
  }
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
}

export default function VideoProduct({ videoUrl, productName }: VideoProductProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [thumbnailError, setThumbnailError] = useState(false)

  // Não renderiza se não tiver URL do vídeo
  if (!videoUrl) return null

  const videoId = getYouTubeId(videoUrl)
  
  // Não renderiza se não conseguir extrair o ID
  if (!videoId) return null

  const thumbnailUrl = getThumbnailUrl(videoId, thumbnailError ? 'hq' : 'maxres')

  const handlePlay = useCallback(() => {
    setIsLoading(true)
    setIsPlaying(true)
  }, [])

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleThumbnailError = useCallback(() => {
    // Se maxresdefault falhar, tenta hqdefault
    if (!thumbnailError) {
      setThumbnailError(true)
    }
  }, [thumbnailError])

  return (
    <section 
      className="mt-8 lg:mt-12"
      aria-labelledby="video-produto-titulo"
    >
      {/* Título */}
      <h2 
        id="video-produto-titulo"
        className="text-xl lg:text-2xl font-semibold text-[var(--color-graphite)] mb-4 lg:mb-6"
      >
        Veja de perto
      </h2>

      {/* Wrapper do vídeo */}
      <div 
        className={`
          relative w-full max-w-[720px] aspect-video rounded-xl overflow-hidden
          bg-[var(--color-cream)]
          ${isLoading ? 'video-loading' : ''}
        `}
      >
        {/* Estado: Thumbnail (antes do clique) */}
        {!isPlaying && (
          <button
            onClick={handlePlay}
            className="absolute inset-0 w-full h-full border-0 p-0 cursor-pointer bg-transparent group focus-visible:outline-2 focus-visible:outline-[var(--color-sage-500)] focus-visible:outline-offset-2"
            aria-label="Reproduzir vídeo do produto"
          >
            {/* Thumbnail */}
            <img
              src={thumbnailUrl}
              alt={`Thumbnail do vídeo - ${productName}`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={handleThumbnailError}
            />

            {/* Botão Play */}
            <span 
              className="
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[72px] h-[72px] lg:w-20 lg:h-20
                bg-[rgba(45,45,45,0.8)] 
                border-2 border-[rgba(255,255,255,0.3)]
                rounded-full
                flex items-center justify-center
                transition-all duration-200
                group-hover:bg-[rgba(45,45,45,0.95)] group-hover:scale-105
              "
              aria-hidden="true"
            >
              <svg 
                className="w-6 h-6 lg:w-7 lg:h-7 text-white ml-[3px]" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}

        {/* Estado: Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-cream)]">
            <div className="w-10 h-10 border-3 border-[var(--color-sand-light)] border-t-[var(--color-sage-500)] rounded-full animate-spin" />
          </div>
        )}

        {/* Estado: Iframe (após clique) */}
        {isPlaying && (
          <iframe
            className="absolute inset-0 w-full h-full border-0"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={`Vídeo do produto - ${productName}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleIframeLoad}
          />
        )}
      </div>
    </section>
  )
}
