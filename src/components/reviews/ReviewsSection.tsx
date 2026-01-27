'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Review, ReviewsSummary as ReviewsSummaryType } from './types';
import ReviewCard from './ReviewCard';
import ReviewsSummary from './ReviewsSummary';
import ReviewTags from './ReviewTags';
import ReviewCTA from './ReviewCTA';
import PhotoLightbox from './PhotoLightbox';

interface ReviewsSectionProps {
  productId: string;
  productSlug: string;
  productName: string;
  summary: ReviewsSummaryType | null;
  reviews: Review[];
  isLoading?: boolean;
}

// Estado vazio - quando não há avaliações
function ReviewsEmpty({ productSlug, productName }: { productSlug: string; productName: string }) {
  const whatsappNumber = '5541984209323';
  const message = encodeURIComponent(
    `Olá! Comprei o produto "${productName}" e gostaria de deixar a primeira avaliação.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
  
  return (
    <section 
      id="avaliacoes"
      className="bg-[#FAF7F4] py-8 px-4 lg:py-12 lg:px-8 scroll-mt-24"
      aria-labelledby="reviews-title"
    >
      <div className="max-w-4xl mx-auto">
        <h2 
          id="reviews-title" 
          className="text-xl lg:text-2xl font-semibold text-[#2D2D2D] mb-6 text-center"
        >
          Avaliações de clientes
        </h2>
        
        <div className="bg-[#F0E8DF] rounded-xl p-6 md:p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E8DFD5] rounded-full mb-4">
            <MessageSquare className="w-8 h-8 text-[#8B7355]" aria-hidden="true" />
          </div>
          
          <h3 className="text-lg font-semibold text-[#2D2D2D] mb-2">
            Seja o primeiro a avaliar!
          </h3>
          
          <p className="text-[#4A4A4A] mb-6 max-w-md mx-auto">
            Este produto ainda não tem avaliações. Comprou e quer contar como foi? Sua opinião ajuda outros clientes!
          </p>
          
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#6B8E7A] hover:bg-[#5A7A68] text-white font-semibold rounded-lg transition-colors min-h-[48px]"
          >
            Deixar a primeira avaliação
          </a>
        </div>
      </div>
    </section>
  );
}

// Skeleton loading
function ReviewsSkeleton() {
  return (
    <section 
      id="avaliacoes"
      className="bg-[#FAF7F4] py-8 px-4 lg:py-12 lg:px-8 scroll-mt-24"
      aria-label="Carregando avaliações..."
    >
      <div className="max-w-4xl mx-auto animate-pulse">
        {/* Header skeleton */}
        <div className="h-7 bg-[#E8DFD5] rounded w-64 mb-2" />
        <div className="h-5 bg-[#E8DFD5] rounded w-48 mb-6" />
        
        {/* Summary skeleton */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:min-w-[140px]">
            <div className="h-12 bg-[#E8DFD5] rounded w-20 mb-2" />
            <div className="h-6 bg-[#E8DFD5] rounded w-32" />
          </div>
          <div className="flex-1 max-w-md space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-[#E8DFD5] rounded" />
            ))}
          </div>
        </div>
        
        {/* Cards skeleton */}
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-[#F0E8DF] rounded-xl p-4 space-y-3">
              <div className="h-5 bg-[#E8DFD5] rounded w-32" />
              <div className="h-4 bg-[#E8DFD5] rounded w-24" />
              <div className="h-16 bg-[#E8DFD5] rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ReviewsSection({
  productId,
  productSlug,
  productName,
  summary,
  reviews,
  isLoading = false,
}: ReviewsSectionProps) {
  const [lightboxPhoto, setLightboxPhoto] = useState<{ url: string; review: Review } | null>(null);
  const [showAll, setShowAll] = useState(false);
  
  // Loading state
  if (isLoading) {
    return <ReviewsSkeleton />;
  }
  
  // Estado vazio
  if (!summary || reviews.length === 0) {
    return <ReviewsEmpty productSlug={productSlug} productName={productName} />;
  }
  
  // Ordena reviews: com foto primeiro, depois por data
  const sortedReviews = [...reviews].sort((a, b) => {
    // Com foto vem primeiro
    if (a.photoUrl && !b.photoUrl) return -1;
    if (!a.photoUrl && b.photoUrl) return 1;
    // Depois ordena por data (mais recente primeiro)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  const displayedReviews = showAll ? sortedReviews : sortedReviews.slice(0, 4);
  const hasMore = sortedReviews.length > 4;
  
  const handlePhotoClick = (url: string, review: Review) => {
    setLightboxPhoto({ url, review });
  };
  
  return (
    <>
      <section 
        id="avaliacoes"
        className="bg-[#FAF7F4] py-8 px-4 lg:py-12 lg:px-8 scroll-mt-24"
        aria-labelledby="reviews-title"
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <h2 
            id="reviews-title" 
            className="text-xl lg:text-2xl font-semibold text-[#2D2D2D] mb-1"
          >
            O que nossos clientes dizem
          </h2>
          <p className="text-sm text-[#4A4A4A] mb-6">
            {summary.total} {summary.total === 1 ? 'avaliação' : 'avaliações'} de quem já comprou
          </p>
          
          {/* Resumo estatístico */}
          <ReviewsSummary summary={summary} />
          
          {/* Tags */}
          {summary.tags && summary.tags.length > 0 && (
            <ReviewTags tags={summary.tags} />
          )}
          
          {/* Cards de reviews */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
            {displayedReviews.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                onPhotoClick={handlePhotoClick}
              />
            ))}
          </div>
          
          {/* Botão ver mais */}
          {hasMore && !showAll && (
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setShowAll(true)}
                className="px-6 py-3 border-2 border-[#2D2D2D] text-[#2D2D2D] rounded-lg font-semibold hover:bg-[#F5F5F5] transition-colors min-h-[48px]"
              >
                Ver todas as {summary.total} avaliações
              </button>
            </div>
          )}
          
          {/* CTA para deixar avaliação */}
          <ReviewCTA productSlug={productSlug} productName={productName} />
        </div>
      </section>
      
      {/* Lightbox */}
      {lightboxPhoto && (
        <PhotoLightbox
          photoUrl={lightboxPhoto.url}
          review={lightboxPhoto.review}
          onClose={() => setLightboxPhoto(null)}
        />
      )}
    </>
  );
}
