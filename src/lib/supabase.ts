// src/lib/supabase.ts

/**
 * Moveirama — Cliente Supabase e funções de acesso ao banco
 * 
 * v2.8.1: Corrigido getBestSellers - categorySlug agora extrai corretamente (objeto, não array)
 * 
 * Changelog:
 *   - v2.3: Simplificado para estrutura de 2 níveis
 *   - v2.4: Corrigido getSubcategories para buscar imagem representativa corretamente
 *   - v2.5: getProductsByCategory agora inclui produtos de categorias secundárias
 *   - v2.6: Adicionado getSiblingVariants para seletor de variantes de cor
 *   - v2.7: ProductColorVariant agora inclui price para ProductGroup Schema SEO
 *   - v2.8: Adicionado getBestSellers para carrossel "Queridinhos de Curitiba"
 *   - v2.8.1: Corrigido extração de categorySlug em getBestSellers (Supabase retorna objeto, não array)
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ========================================
// TYPES
// ========================================

export type Category = {
  id: string
  slug: string
  name: string
  description: string | null
  parent_id: string | null
  display_order: number
  is_active: boolean
  image_url?: string | null
}

export type CategoryWithCount = Category & {
  product_count: number
}

export type Product = {
  id: string
  slug: string
  sku: string
  name: string
  supplier_id: string
  category_id: string
  short_description: string
  long_description: string | null
  price: number
  compare_at_price: number | null
  brand: string | null
  tv_max_size: number | null
  weight_capacity: number | null
  requires_wall_mount: boolean
  width_cm: number
  height_cm: number
  depth_cm: number
  weight_kg: number
  main_material: string
  thickness_mm: number | null
  material_description: string | null
  assembly_difficulty: string
  assembly_time_minutes: number
  is_active: boolean
  is_featured: boolean
  stock_quantity: number
  meta_title: string | null
  meta_description: string | null
  // v2.6: Campos para variantes de cor
  model_group: string | null
  color_name: string | null
}

export type ProductVariant = {
  id: string
  product_id: string
  sku: string
  name: string
  color_family: string
  color_hex: string | null
  price_override: number | null
  stock_quantity: number
  is_default: boolean
  is_active: boolean
}

export type ProductImage = {
  id: string
  product_id: string
  variant_id: string | null
  cloudinary_path: string
  alt_text: string | null
  image_type: 'principal' | 'galeria' | 'ambientada' | 'dimensional'
  position: number
  is_active: boolean
}

export type ProductWithDetails = Product & {
  category: Category
  variants: ProductVariant[]
  images: ProductImage[]
}

export type ProductForListing = {
  id: string
  slug: string
  name: string
  price: number
  compare_at_price: number | null
  image_url: string | null
  avg_rating: number
  review_count: number
  tv_max_size: number | null
}

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'bestseller'

/**
 * v2.7: Variante de cor de um produto (para seletor de variantes e ProductGroup Schema)
 * Representa produtos "irmãos" do mesmo modelo em cores diferentes
 * 
 * ⭐ v2.7: Adicionado campo `price` para uso no ProductGroup Schema SEO
 */
export type ProductColorVariant = {
  id: string
  slug: string
  name: string
  model_group: string
  color_name: string
  price: number  // ⭐ v2.7: Necessário para ProductGroup Schema
  images: { cloudinary_path: string }[]
}

// ========================================
// FUNÇÕES DE CATEGORIA
// ========================================

/**
 * Busca categoria pai pelo slug (apenas categorias raiz com parent_id = null)
 */
export async function getParentCategory(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .is('parent_id', null)
    .eq('is_active', true)
    .single()
  
  if (error) return null
  return data
}

/**
 * Busca qualquer categoria pelo slug (qualquer nível da hierarquia)
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  
  if (error) return null
  return data
}

/**
 * Busca subcategorias de uma categoria pai com contagem de produtos
 * 
 * v2.5: Inclui contagem de produtos de categorias secundárias
 */
export async function getSubcategories(parentSlug: string): Promise<CategoryWithCount[]> {
  // Busca o pai
  const parent = await getCategoryBySlug(parentSlug)
  if (!parent) return []

  // Busca subcategorias diretas
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', parent.id)
    .eq('is_active', true)
    .order('display_order')

  if (error || !categories) return []

  // Busca contagem de produtos e imagem para cada subcategoria
  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => {
      // Conta produtos desta categoria (principal)
      const { count: primaryCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', cat.id)
        .eq('is_active', true)

      // Conta produtos desta categoria (secundária)
      const { count: secondaryCount } = await supabase
        .from('product_secondary_categories')
        .select('product_id', { count: 'exact', head: true })
        .eq('category_id', cat.id)

      const totalCount = (primaryCount || 0) + (secondaryCount || 0)

      // Busca imagem de um produto da categoria (fallback quando não tem image_url)
      let representativeImage: string | null = null
      
      if (totalCount > 0 && !cat.image_url) {
        // Primeiro tenta produtos da categoria principal
        const { data: productsWithImages } = await supabase
          .from('products')
          .select('id')
          .eq('category_id', cat.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(10)

        let productIdsToCheck: string[] = []
        
        if (productsWithImages && productsWithImages.length > 0) {
          productIdsToCheck = productsWithImages.map(p => p.id)
        }
        
        // Se não tem produtos principais, busca IDs dos produtos secundários
        if (productIdsToCheck.length === 0) {
          const { data: secondaryProductLinks } = await supabase
            .from('product_secondary_categories')
            .select('product_id')
            .eq('category_id', cat.id)
            .limit(10)
          
          if (secondaryProductLinks && secondaryProductLinks.length > 0) {
            productIdsToCheck = secondaryProductLinks.map(link => link.product_id)
          }
        }

        // Para cada produto, tenta encontrar uma imagem
        for (const productId of productIdsToCheck) {
          const { data: images } = await supabase
            .from('product_images')
            .select('cloudinary_path, image_type, position')
            .eq('product_id', productId)
            .eq('is_active', true)
            .order('position', { ascending: true })
            .limit(5)

          if (images && images.length > 0) {
            // Prioridade: principal > menor position
            const principalImage = images.find(img => img.image_type === 'principal')
            representativeImage = principalImage?.cloudinary_path || images[0]?.cloudinary_path || null
            
            if (representativeImage) break // Encontrou imagem, sai do loop
          }
        }
      }

      return {
        ...cat,
        product_count: totalCount,
        image_url: cat.image_url || representativeImage
      }
    })
  )

  return categoriesWithCount
}

/**
 * Busca subcategoria pelo slug do pai e da subcategoria
 */
export async function getSubcategory(parentSlug: string, subcategorySlug: string): Promise<Category | null> {
  // Busca o pai
  const parent = await getParentCategory(parentSlug)
  if (!parent) return null

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', subcategorySlug)
    .eq('parent_id', parent.id)
    .eq('is_active', true)
    .single()
  
  if (error) return null
  return data
}

/**
 * Busca subcategoria pelo slug (sem precisar do pai)
 */
export async function getSubcategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .not('parent_id', 'is', null)
    .eq('is_active', true)
    .single()
  
  if (error) return null
  return data
}

/**
 * Busca categoria pai de uma subcategoria
 */
export async function getParentOfSubcategory(subcategorySlug: string): Promise<Category | null> {
  const subcategory = await getSubcategoryBySlug(subcategorySlug)
  if (!subcategory || !subcategory.parent_id) return null

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', subcategory.parent_id)
    .single()
  
  if (error) return null
  return data
}

// ========================================
// FUNÇÕES DE PRODUTO
// ========================================

/**
 * Busca produtos de uma categoria com paginação e ordenação
 * 
 * v2.5: Inclui produtos de categorias secundárias (product_secondary_categories)
 */
export async function getProductsByCategory(
  categoryId: string,
  page: number = 1,
  perPage: number = 12,
  sort: SortOption = 'relevance'
): Promise<{ products: ProductForListing[], total: number }> {
  
  // Determina ordenação
  let orderColumn = 'name'
  let orderAscending = true
  
  switch (sort) {
    case 'price-asc':
      orderColumn = 'price'
      orderAscending = true
      break
    case 'price-desc':
      orderColumn = 'price'
      orderAscending = false
      break
    case 'newest':
      orderColumn = 'created_at'
      orderAscending = false
      break
    case 'bestseller':
      orderColumn = 'name'
      orderAscending = true
      break
    case 'relevance':
    default:
      orderColumn = 'name'
      orderAscending = true
  }

  // ========================================
  // BUSCA PRODUTOS PRINCIPAIS (category_id)
  // ========================================
  const { data: primaryProducts, error: primaryError } = await supabase
    .from('products')
    .select(`
      id,
      slug,
      name,
      price,
      compare_at_price,
      tv_max_size,
      created_at,
      product_images(cloudinary_path, image_type)
    `)
    .eq('category_id', categoryId)
    .eq('is_active', true)

  // ========================================
  // BUSCA PRODUTOS SECUNDÁRIOS (product_secondary_categories)
  // ========================================
  const { data: secondaryLinks } = await supabase
    .from('product_secondary_categories')
    .select('product_id')
    .eq('category_id', categoryId)

  let secondaryProducts: any[] = []
  
  if (secondaryLinks && secondaryLinks.length > 0) {
    const secondaryProductIds = secondaryLinks.map(link => link.product_id)
    
    const { data: secProducts } = await supabase
      .from('products')
      .select(`
        id,
        slug,
        name,
        price,
        compare_at_price,
        tv_max_size,
        created_at,
        product_images(cloudinary_path, image_type)
      `)
      .in('id', secondaryProductIds)
      .eq('is_active', true)
    
    secondaryProducts = secProducts || []
  }

  // ========================================
  // COMBINA E REMOVE DUPLICATAS
  // ========================================
  const allProductsMap = new Map<string, any>()
  
  // Adiciona produtos principais
  if (primaryProducts) {
    for (const p of primaryProducts) {
      allProductsMap.set(p.id, p)
    }
  }
  
  // Adiciona produtos secundários (se não existir)
  for (const p of secondaryProducts) {
    if (!allProductsMap.has(p.id)) {
      allProductsMap.set(p.id, p)
    }
  }
  
  let allProducts = Array.from(allProductsMap.values())

  // ========================================
  // ORDENAÇÃO
  // ========================================
  allProducts.sort((a, b) => {
    const aVal = a[orderColumn]
    const bVal = b[orderColumn]
    
    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1
    
    if (typeof aVal === 'string') {
      return orderAscending 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal)
    }
    
    return orderAscending ? aVal - bVal : bVal - aVal
  })

  // ========================================
  // PAGINAÇÃO
  // ========================================
  const total = allProducts.length
  const startIndex = (page - 1) * perPage
  const paginatedProducts = allProducts.slice(startIndex, startIndex + perPage)

  // ========================================
  // MAPEIA PARA FORMATO ESPERADO
  // ========================================
  const products: ProductForListing[] = paginatedProducts.map(p => {
    const images = p.product_images || []
    const principalImage = images.find((img: { image_type: string }) => img.image_type === 'principal')
    const firstImage = images[0]
    
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      compare_at_price: p.compare_at_price,
      image_url: principalImage?.cloudinary_path || firstImage?.cloudinary_path || null,
      avg_rating: 0,
      review_count: 0,
      tv_max_size: p.tv_max_size
    }
  })

  return { products, total }
}

/**
 * Busca produto por slug da subcategoria e slug do produto
 * 
 * v2.5: Também busca em categorias secundárias
 */
export async function getProductBySubcategoryAndSlug(
  subcategorySlug: string, 
  productSlug: string
): Promise<ProductWithDetails | null> {
  const subcategory = await getSubcategoryBySlug(subcategorySlug)
  if (!subcategory) return null

  // Tenta buscar pela categoria principal
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:product_variants(*),
      images:product_images(*),
      faqs:product_faqs(*)
    `)
    .eq('slug', productSlug)
    .eq('category_id', subcategory.id)
    .eq('is_active', true)
    .single()

  if (!error && product) {
    // Filtra e ordena FAQs
    if (product.faqs) {
      product.faqs = product.faqs
        .filter((faq: { is_active?: boolean }) => faq.is_active !== false)
        .sort((a: { position: number }, b: { position: number }) => a.position - b.position)
    }
    return product
  }

  // Se não encontrou pela categoria principal, busca pela secundária
  // Primeiro busca o produto pelo slug
  const { data: productBySlug } = await supabase
    .from('products')
    .select('id')
    .eq('slug', productSlug)
    .eq('is_active', true)
    .single()

  if (!productBySlug) return null

  // Verifica se esse produto está vinculado à categoria secundária
  const { data: secondaryLink } = await supabase
    .from('product_secondary_categories')
    .select('product_id')
    .eq('category_id', subcategory.id)
    .eq('product_id', productBySlug.id)
    .single()

  if (!secondaryLink) return null

  // Busca o produto completo
  const { data: secProduct, error: secError } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      variants:product_variants(*),
      images:product_images(*),
      faqs:product_faqs(*)
    `)
    .eq('id', secondaryLink.product_id)
    .eq('is_active', true)
    .single()

  if (secError || !secProduct) return null
  
  // Filtra e ordena FAQs
  if (secProduct.faqs) {
    secProduct.faqs = secProduct.faqs
      .filter((faq: { is_active?: boolean }) => faq.is_active !== false)
      .sort((a: { position: number }, b: { position: number }) => a.position - b.position)
  }
  
  return secProduct
}

// ========================================
// FUNÇÕES DE VARIANTES DE COR (v2.6 / v2.7)
// ========================================

/**
 * Busca todas as variantes de cor de um mesmo modelo
 * 
 * Usado pelo VariantSelector para exibir opções de cores disponíveis.
 * Retorna produtos que compartilham o mesmo model_group.
 * 
 * ⭐ v2.7: Agora inclui `price` no retorno para uso no ProductGroup Schema
 * 
 * @param modelGroup - Identificador do grupo (ex: "rack-charlotte")
 * @returns Array de variantes ordenadas por nome de cor
 * 
 * @example
 * const variants = await getSiblingVariants('rack-charlotte')
 * // Retorna: Carvalho/Menta, Carvalho/Off White, Cinamomo/Off White, Pinho/Off White
 */
export async function getSiblingVariants(
  modelGroup: string | null | undefined
): Promise<ProductColorVariant[]> {
  // Se não tem model_group, retorna array vazio
  if (!modelGroup) return []
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      slug,
      name,
      model_group,
      color_name,
      price,
      images:product_images(
        cloudinary_path,
        image_type,
        position
      )
    `)
    .eq('model_group', modelGroup)
    .eq('is_active', true)
    .order('color_name', { ascending: true })
    
  if (error) {
    console.error('Erro ao buscar variantes de cor:', error)
    return []
  }
  
  if (!data) return []
  
  // Mapeia para o formato esperado, pegando apenas a imagem principal de cada produto
  return data.map(product => {
    const images = product.images || []
    
    // Prioridade: imagem tipo 'principal' > menor position > primeira disponível
    const sortedImages = [...images].sort((a, b) => {
      // Primeiro: tipo principal tem prioridade
      if (a.image_type === 'principal' && b.image_type !== 'principal') return -1
      if (b.image_type === 'principal' && a.image_type !== 'principal') return 1
      // Depois: menor position
      return (a.position || 0) - (b.position || 0)
    })
    
    const primaryImage = sortedImages[0]
    
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      model_group: product.model_group,
      color_name: product.color_name || '',
      price: product.price,  // ⭐ v2.7: Incluído para ProductGroup Schema
      images: primaryImage ? [{ cloudinary_path: primaryImage.cloudinary_path }] : []
    }
  })
}

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

/**
 * Verifica se uma rota é uma categoria válida
 */
export async function isValidCategoryRoute(
  category: string, 
  subcategory?: string
): Promise<boolean> {
  if (subcategory) {
    const sub = await getSubcategory(category, subcategory)
    return sub !== null
  }
  const parent = await getParentCategory(category)
  return parent !== null
}

// ========================================
// QUERIDINHOS DE CURITIBA (v2.8 / v2.8.1)
// ========================================

/**
 * Produto para o carrossel "Queridinhos de Curitiba"
 * 
 * @since v2.8
 */
export type BestSellerProduct = {
  id: string
  name: string
  slug: string
  price: number
  categorySlug: string | null
  imageUrl: string | null
  badgeType: 'top-sales' | 'favorite' | null
}

/**
 * Busca os produtos "Queridinhos de Curitiba" para o carrossel da Home
 * 
 * Lista FIXA de produtos curados manualmente:
 * 1. rack-duetto-cinamomo-c-off-white - Top 1 Vendas (badge amarelo)
 * 2. rack-theo-cinamomo-c-off-white - Favorito Curitibano
 * 3. escrivaninha-nomad-cinamomo-c-off-white - Favorito Curitibano
 * 4. escrivaninha-match-pinho-c-preto - Favorito Curitibano
 * 5. buffet-charlotte-cinamomo-c-off-white - Favorito Curitibano
 * 6. mesa-apoio-trama-cinamomo-c-off-white - Sem badge
 * 
 * Badge logic:
 * - Posição 1: 'top-sales' (🏆 Top 1 Vendas)
 * - Posições 2-5: 'favorite' (💚 Favorito Curitibano)
 * - Posição 6: null (sem badge)
 * 
 * @param limit Número de produtos (default: 6)
 * @returns Array de BestSellerProduct com badges atribuídos
 * 
 * @since v2.8
 * @updated v2.8.1 - Corrigido extração de categorySlug (Supabase retorna objeto, não array)
 */
export async function getBestSellers(limit: number = 6): Promise<BestSellerProduct[]> {
  // Lista fixa de slugs na ordem desejada
  const QUERIDINHOS_SLUGS = [
    'rack-duetto-cinamomo-c-off-white',           // #1 - Top 1 Vendas
    'rack-theo-cinamomo-c-off-white',             // #2 - Favorito Curitibano
    'escrivaninha-nomad-cinamomo-c-off-white',    // #3 - Favorito Curitibano
    'escrivaninha-match-pinho-c-preto',           // #4 - Favorito Curitibano
    'buffet-charlotte-cinamomo-c-off-white',      // #5 - Favorito Curitibano
    'mesa-apoio-trama-cinamomo-c-off-white',      // #6 - Sem badge
  ]

  const slugsToFetch = QUERIDINHOS_SLUGS.slice(0, limit)

  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      category:categories(slug),
      product_images(cloudinary_path, image_type)
    `)
    .in('slug', slugsToFetch)
    .eq('is_active', true)

  if (error) {
    console.error('Erro ao buscar best sellers:', error)
    return []
  }

  if (!data) return []

  // Ordena os resultados na mesma ordem do array QUERIDINHOS_SLUGS
  const sortedData = slugsToFetch
    .map(slug => data.find(item => item.slug === slug))
    .filter((item): item is NonNullable<typeof item> => item !== undefined)

  // Mapeia para o formato esperado e atribui badges
  return sortedData.map((item, index) => {
    // ========================================
    // v2.8.1: CORREÇÃO da extração de categorySlug
    // ========================================
    // Supabase com select de relação 1:1 retorna OBJETO, não array
    // category:categories(slug) → { slug: 'racks-tv' }
    // ========================================
    const categoryData = item.category as { slug: string } | null
    const categorySlug = categoryData?.slug || null

    // Extrai imagem principal
    const images = item.product_images || []
    const principalImage = images.find((img: { image_type: string }) => img.image_type === 'principal')
    const imageUrl = principalImage?.cloudinary_path || images[0]?.cloudinary_path || null

    // Atribui badge baseado na posição
    let badgeType: 'top-sales' | 'favorite' | null = null
    if (index === 0) {
      badgeType = 'top-sales'
    } else if (index < 5) {
      badgeType = 'favorite'
    }

    return {
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      categorySlug,
      imageUrl,
      badgeType
    }
  })
}
