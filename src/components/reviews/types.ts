// ============================================
// Types para o sistema de Reviews
// ============================================

export interface Review {
  id: string;
  customerName: string;
  customerCity: string;
  customerNeighborhood?: string | null;
  rating: number;
  comment: string;
  photoUrl?: string | null;
  isVerified: boolean;
  createdAt: Date | string;
}

export interface ReviewsSummary {
  average: number;
  total: number;
  distribution: {
    five: number;
    four: number;
    three: number;
    two: number;
    one: number;
  };
  tags?: ReviewTag[];
}

export interface ReviewTag {
  label: string;
  count: number;
}

export interface ReviewsSectionProps {
  productId: string;
  productSlug: string;
  productName: string;
  summary: ReviewsSummary | null;
  reviews: Review[];
  isLoading?: boolean;
}

// Database row type (snake_case do Supabase)
export interface ProductReviewRow {
  id: string;
  product_id: string;
  customer_name: string;
  customer_city: string;
  customer_neighborhood: string | null;
  rating: number;
  comment: string;
  photo_url: string | null;
  tag_easy_assembly: boolean;
  tag_good_quality: boolean;
  tag_fast_delivery: boolean;
  tag_fits_well: boolean;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
}

// View summary row
export interface ProductReviewSummaryRow {
  product_id: string;
  rating_average: number;
  rating_count: number;
  five_stars: number;
  four_stars: number;
  three_stars: number;
  two_stars: number;
  one_star: number;
  tag_easy_count: number;
  tag_quality_count: number;
  tag_delivery_count: number;
  tag_fits_count: number;
  with_photo_count: number;
}

// Helper para converter DB row → Review
export function mapReviewFromDB(row: ProductReviewRow): Review {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerCity: row.customer_city,
    customerNeighborhood: row.customer_neighborhood,
    rating: row.rating,
    comment: row.comment,
    photoUrl: row.photo_url,
    isVerified: row.is_verified,
    createdAt: row.created_at,
  };
}

// Helper para converter summary row → ReviewsSummary
export function mapSummaryFromDB(row: ProductReviewSummaryRow): ReviewsSummary {
  const tags: ReviewTag[] = [];
  
  // Só adiciona tags que têm pelo menos 2 menções
  if (row.tag_easy_count >= 2) {
    tags.push({ label: 'Fácil de montar', count: row.tag_easy_count });
  }
  if (row.tag_quality_count >= 2) {
    tags.push({ label: 'Boa qualidade', count: row.tag_quality_count });
  }
  if (row.tag_delivery_count >= 2) {
    tags.push({ label: 'Entrega rápida', count: row.tag_delivery_count });
  }
  if (row.tag_fits_count >= 2) {
    tags.push({ label: 'Coube certinho', count: row.tag_fits_count });
  }
  
  return {
    average: row.rating_average,
    total: row.rating_count,
    distribution: {
      five: row.five_stars,
      four: row.four_stars,
      three: row.three_stars,
      two: row.two_stars,
      one: row.one_star,
    },
    tags: tags.length > 0 ? tags : undefined,
  };
}