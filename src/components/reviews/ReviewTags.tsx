'use client';

import { ReviewTag } from './types';

interface ReviewTagsProps {
  tags: ReviewTag[];
}

export default function ReviewTags({ tags }: ReviewTagsProps) {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mb-6" role="list" aria-label="Destaques das avaliações">
      {tags.map((tag) => (
        <span
          key={tag.label}
          role="listitem"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F0EB] text-[#3A5446] text-sm font-medium rounded-full"
        >
          <svg 
            className="w-3.5 h-3.5 text-[#6B8E7A]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
          {tag.label}
          <span className="text-[#6B8E7A]">({tag.count})</span>
        </span>
      ))}
    </div>
  );
}
