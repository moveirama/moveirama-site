'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Review } from './types';

interface ReviewCardProps {
  review: Review;
  onPhotoClick?: (photoUrl: string, review: Review) => void;
}

// Componente de estrelas
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div 
      className="flex gap-0.5" 
      role="img" 
      aria-label={`${rating} de 5 estrelas`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill={star <= rating ? '#F5A623' : '#E8DFD5'}
          aria-hidden="true"
        >
          <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
        </svg>
      ))}
    </div>
  );
}

// Formata data relativa (há X dias, há X semanas, etc)
function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const reviewDate = new Date(date);
  const diffMs = now.getTime() - reviewDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'hoje';
  if (diffDays === 1) return 'há 1 dia';
  if (diffDays < 7) return `há ${diffDays} dias`;
  if (diffDays < 14) return 'há 1 semana';
  if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semanas`;
  if (diffDays < 60) return 'há 1 mês';
  if (diffDays < 365) return `há ${Math.floor(diffDays / 30)} meses`;
  return `há ${Math.floor(diffDays / 365)} ano(s)`;
}

// Formata localização (bairro + cidade)
function formatLocation(city: string, neighborhood?: string | null): string {
  // Siglas conhecidas
  const siglas: Record<string, string> = {
    'Curitiba': 'Curitiba',
    'São José dos Pinhais': 'SJP',
    'Colombo': 'Colombo',
    'Araucária': 'Araucária',
    'Pinhais': 'Pinhais',
    'Fazenda Rio Grande': 'FRG',
    'Almirante Tamandaré': 'Almirante Tamandaré',
    'Piraquara': 'Piraquara',
    'Campina Grande do Sul': 'Campina Grande do Sul',
    'Quatro Barras': 'Quatro Barras',
  };
  
  const cityDisplay = siglas[city] || city;
  
  if (neighborhood) {
    return `${neighborhood}, ${cityDisplay}`;
  }
  return cityDisplay;
}

export default function ReviewCard({ review, onPhotoClick }: ReviewCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const hasPhoto = review.photoUrl && !imageError;
  
  return (
    <article className="bg-[#F0E8DF] rounded-xl p-4 flex flex-col gap-3">
      {/* Foto do cliente (se houver) - Mobile: topo, Desktop: lado */}
      {hasPhoto && (
        <div className="w-full md:float-left md:w-[120px] md:h-[120px] md:mr-4 md:mb-2">
          <div className="relative w-full max-h-[200px] md:max-h-none md:h-full rounded-lg overflow-hidden bg-[#E8DFD5]">
            <img
              src={review.photoUrl!}
              alt={`Foto enviada por ${review.customerName}`}
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              loading="lazy"
              onClick={() => onPhotoClick?.(review.photoUrl!, review)}
              onError={() => setImageError(true)}
            />
          </div>
        </div>
      )}
      
      {/* Header: Nome, localização, estrelas, data */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1">
        <div>
          <span className="font-semibold text-[#2D2D2D]">
            {review.customerName}
          </span>
          <span className="block text-sm text-[#8B7355]">
            {formatLocation(review.customerCity, review.customerNeighborhood)}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1 md:mt-0">
          <Stars rating={review.rating} size={14} />
          <span className="text-xs text-[#4A4A4A]">
            {formatRelativeTime(review.createdAt)}
          </span>
        </div>
      </div>
      
      {/* Badge verificado */}
      {review.isVerified && (
        <div className="inline-flex items-center gap-1 text-xs font-medium text-[#4A4A4A]">
          <Check className="w-3.5 h-3.5 text-[#6B8E7A]" aria-hidden="true" />
          Compra verificada
        </div>
      )}
      
      {/* Comentário */}
      <p className="text-base text-[#2D2D2D] leading-relaxed">
        "{review.comment}"
      </p>
      
      {/* Botão ver foto (mobile, quando tem foto) */}
      {hasPhoto && (
        <button
          onClick={() => onPhotoClick?.(review.photoUrl!, review)}
          className="md:hidden text-sm font-medium text-[#6B8E7A] hover:text-[#5A7A68] self-start min-h-[44px] flex items-center"
        >
          Ver foto ampliada
        </button>
      )}
    </article>
  );
}
