'use client';

import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Review } from './types';

interface PhotoLightboxProps {
  photoUrl: string;
  review: Review;
  onClose: () => void;
}

export default function PhotoLightbox({ photoUrl, review, onClose }: PhotoLightboxProps) {
  // Fecha com ESC
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);
  
  // Previne scroll do body quando modal está aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  // Fecha ao clicar no overlay (fora da imagem)
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Foto enviada por ${review.customerName}`}
    >
      {/* Botão fechar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Fechar"
      >
        <X className="w-8 h-8" />
      </button>
      
      {/* Conteúdo */}
      <div className="max-w-4xl w-full flex flex-col items-center gap-4">
        {/* Imagem */}
        <div className="relative max-h-[70vh] overflow-hidden rounded-lg">
          <img
            src={photoUrl}
            alt={`Foto enviada por ${review.customerName}`}
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>
        
        {/* Info do review */}
        <div className="text-center text-white">
          <p className="font-semibold">
            {review.customerName}
            {review.customerNeighborhood && (
              <span className="font-normal text-gray-300">
                {' '}· {review.customerNeighborhood}, {review.customerCity}
              </span>
            )}
            {!review.customerNeighborhood && (
              <span className="font-normal text-gray-300">
                {' '}· {review.customerCity}
              </span>
            )}
          </p>
          <p className="mt-2 text-gray-300 text-sm max-w-lg mx-auto line-clamp-3">
            "{review.comment}"
          </p>
        </div>
      </div>
    </div>
  );
}
