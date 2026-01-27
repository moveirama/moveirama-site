// src/lib/reviews.ts
/**
 * Funções para buscar e processar reviews de produtos
 * 
 * v1.2 - Janeiro 2026
 * - Mapeamento correto da tabela reviews real
 * 
 * Campos da tabela:
 *   author_name, author_city, rating, title, content,
 *   is_verified_purchase, is_approved, created_at
 */

import { supabase } from '@/lib/supabase'
import {
  Review,
  ReviewsSummary,
} from '@/components/reviews/types'

// Tipo da row real do banco (diferente do ProductReviewRow do types.ts)
interface ReviewRow {
  id: string
  product_id: string
  author_name: string
  author_city: string | null
  rating: number
  title: string | null
  content: string | null
  is_verified_purchase: boolean
  is_approved: boolean
  created_at: string
}

/**
 * Converte row do banco → Review (formato do frontend)
 */
function mapReviewFromDB(row: ReviewRow): Review {
  return {
    id: row.id,
    customerName: row.author_name,
    customerCity: row.author_city || 'Curitiba',
    customerNeighborhood: null,
    rating: row.rating,
    comment: row.content || '',
    photoUrl: null,
    isVerified: row.is_verified_purchase,
    createdAt: row.created_at,
  }
}

/**
 * Busca reviews de um produto e calcula estatísticas
 */
export async function getProductReviews(productId: string): Promise<{
  reviews: Review[]
  summary: ReviewsSummary | null
}> {
  // Busca reviews aprovados do produto
  const { data: reviewsData, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (error || !reviewsData || reviewsData.length === 0) {
    return { reviews: [], summary: null }
  }

  // Mapeia para o tipo Review
  const reviews: Review[] = reviewsData.map((row) => 
    mapReviewFromDB(row as ReviewRow)
  )

  // Calcula estatísticas
  const totalReviews = reviews.length
  const sumRatings = reviews.reduce((sum, r) => sum + r.rating, 0)
  const averageRating = Math.round((sumRatings / totalReviews) * 10) / 10

  // Distribuição por estrelas
  const distribution = {
    five: 0,
    four: 0,
    three: 0,
    two: 0,
    one: 0,
  }

  reviewsData.forEach((r: ReviewRow) => {
    switch (r.rating) {
      case 5: distribution.five++; break
      case 4: distribution.four++; break
      case 3: distribution.three++; break
      case 2: distribution.two++; break
      case 1: distribution.one++; break
    }
  })

  const summary: ReviewsSummary = {
    average: averageRating,
    total: totalReviews,
    distribution,
    // Não temos campos de tags no banco atual
    tags: undefined,
  }

  return { reviews, summary }
}