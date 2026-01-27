// Barrel export para componentes de reviews
// Usar: import { ReviewsSection } from '@/components/reviews'

export { default as ReviewsSection } from './ReviewsSection';
export { default as ReviewCard } from './ReviewCard';
export { default as ReviewsSummary } from './ReviewsSummary';
export { default as ReviewTags } from './ReviewTags';
export { default as ReviewCTA } from './ReviewCTA';
export { default as PhotoLightbox } from './PhotoLightbox';

// Types
export type {
  Review,
  ReviewsSummary as ReviewsSummaryType,
  ReviewTag,
  ReviewsSectionProps,
  ProductReviewRow,
  ProductReviewSummaryRow,
} from './types';

// Helpers
export { mapReviewFromDB, mapSummaryFromDB } from './types';
