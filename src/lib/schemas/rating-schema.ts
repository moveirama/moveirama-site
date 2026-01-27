/**
 * Schema.org AggregateRating — Integração para Rich Snippets
 * 
 * Este arquivo contém a função para gerar o schema de avaliação
 * que deve ser adicionado ao JSON-LD existente da PDP.
 * 
 * Referência: https://schema.org/AggregateRating
 * Google: https://developers.google.com/search/docs/appearance/structured-data/review-snippet
 */

interface AggregateRatingSchema {
  '@type': 'AggregateRating'
  ratingValue: string
  reviewCount: string
  bestRating: string
  worstRating: string
}

interface ProductSchemaWithRating {
  '@context': string
  '@type': 'Product'
  name: string
  description?: string
  image?: string | string[]
  sku?: string
  gtin13?: string  // Código de barras EAN-13 (para Merchant Center)
  brand?: {
    '@type': 'Brand'
    name: string
  }
  offers?: {
    '@type': 'Offer'
    url: string
    priceCurrency: string
    price: string
    availability: string
    seller?: {
      '@type': 'Organization'
      name: string
    }
    shippingDetails?: object
  }
  aggregateRating?: AggregateRatingSchema
}

/**
 * Gera o objeto AggregateRating para Schema.org
 * 
 * @param rating Nota média (0-5)
 * @param reviewCount Quantidade de avaliações
 * @returns Objeto AggregateRating ou null se não houver avaliações
 */
export function generateAggregateRatingSchema(
  rating: number,
  reviewCount: number
): AggregateRatingSchema | null {
  // Não inclui schema se não houver avaliações
  if (reviewCount === 0 || !rating) {
    return null
  }
  
  return {
    '@type': 'AggregateRating',
    ratingValue: rating.toFixed(1),
    reviewCount: reviewCount.toString(),
    bestRating: '5',
    worstRating: '1'
  }
}

/**
 * Adiciona AggregateRating ao schema Product existente
 * 
 * @param productSchema Schema Product existente
 * @param rating Nota média
 * @param reviewCount Quantidade de avaliações
 * @returns Schema atualizado com aggregateRating
 */
export function addRatingToProductSchema(
  productSchema: ProductSchemaWithRating,
  rating: number,
  reviewCount: number
): ProductSchemaWithRating {
  const aggregateRating = generateAggregateRatingSchema(rating, reviewCount)
  
  if (!aggregateRating) {
    return productSchema
  }
  
  return {
    ...productSchema,
    aggregateRating
  }
}

/**
 * Exemplo de uso na PDP:
 * 
 * ```tsx
 * // Em ProductPageContent.tsx
 * import { addRatingToProductSchema } from '@/lib/schemas/rating-schema'
 * 
 * // Dentro do componente
 * const productSchema = generateProductSchema(product, canonicalUrl)
 * const schemaWithRating = addRatingToProductSchema(
 *   productSchema,
 *   product.rating_average ?? 0,
 *   product.rating_count ?? 0
 * )
 * 
 * // No JSX
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWithRating) }}
 * />
 * ```
 */

// Exporta tipos para uso em outros arquivos
export type { AggregateRatingSchema, ProductSchemaWithRating }
