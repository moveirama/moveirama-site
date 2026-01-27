'use client';

import { ReviewsSummary as ReviewsSummaryType } from './types';

interface ReviewsSummaryProps {
  summary: ReviewsSummaryType;
}

// Componente de estrelas grandes
function StarsLarge({ rating }: { rating: number }) {
  // Calcula preenchimento parcial para a última estrela
  const fullStars = Math.floor(rating);
  const partialFill = (rating - fullStars) * 100;
  
  return (
    <div 
      className="flex gap-1" 
      role="img" 
      aria-label={`${rating} de 5 estrelas`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        let fill = '#E8DFD5'; // Vazia
        
        if (star <= fullStars) {
          fill = '#F5A623'; // Cheia
        }
        
        // Estrela parcialmente preenchida
        if (star === fullStars + 1 && partialFill > 0) {
          return (
            <svg
              key={star}
              width={24}
              height={24}
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id={`star-gradient-${star}`}>
                  <stop offset={`${partialFill}%`} stopColor="#F5A623" />
                  <stop offset={`${partialFill}%`} stopColor="#E8DFD5" />
                </linearGradient>
              </defs>
              <path 
                d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" 
                fill={`url(#star-gradient-${star})`}
              />
            </svg>
          );
        }
        
        return (
          <svg
            key={star}
            width={24}
            height={24}
            viewBox="0 0 20 20"
            fill={fill}
            aria-hidden="true"
          >
            <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
          </svg>
        );
      })}
    </div>
  );
}

// Barra de distribuição individual
function DistributionBar({ 
  stars, 
  count, 
  total 
}: { 
  stars: number; 
  count: number; 
  total: number;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-6 text-[#4A4A4A] font-medium">{stars}★</span>
      <div className="flex-1 h-2 bg-[#E8DFD5] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#F5A623] rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>
      <span className="w-8 text-right text-[#8B7355]">{count}</span>
    </div>
  );
}

export default function ReviewsSummary({ summary }: ReviewsSummaryProps) {
  const { average, total, distribution } = summary;
  
  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-6">
      {/* Nota grande */}
      <div className="flex flex-col items-center lg:items-start lg:min-w-[140px]">
        <span className="text-5xl font-bold text-[#2D2D2D]">
          {average.toFixed(1)}
        </span>
        <div className="mt-1">
          <StarsLarge rating={average} />
        </div>
        <span className="mt-2 text-sm text-[#8B7355]">
          {total} {total === 1 ? 'avaliação' : 'avaliações'}
        </span>
      </div>
      
      {/* Barras de distribuição */}
      <div className="flex-1 flex flex-col gap-2 max-w-md">
        <DistributionBar stars={5} count={distribution.five} total={total} />
        <DistributionBar stars={4} count={distribution.four} total={total} />
        <DistributionBar stars={3} count={distribution.three} total={total} />
        <DistributionBar stars={2} count={distribution.two} total={total} />
        <DistributionBar stars={1} count={distribution.one} total={total} />
      </div>
    </div>
  );
}
