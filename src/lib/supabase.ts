import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types para categorias (estrutura 2 níveis)
export type Category = {
  id: string
  slug: string
  name: string
  description: string | null
  parent_id: string | null
  position: number
  is_active: boolean
  image_url?: string | null
}

export type CategoryWithCount = Category & {
  product_count: number
}

// Types legados (mantidos para compatibilidade)
export type Environment = {
  id: string
  slug: string
  name: string
  description: string | null
  icon: string | null
  display_order: number
  is_active: boolean
}

export type Supplier = {
  id: string
  slug: string
  name: string
  website: string | null
  is_active: boolean
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
  assembly_difficulty: string
  assembly_time_minutes: number
  is_active: boolean
  is_featured: boolean
  stock_quantity: number
  meta_title: string | null
  meta_description: string | null
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

// Types para listagem de produtos
export type ProductForListing = {
  id: string
  slug: string
  name: string
  price: number
  compare_at_price: number | null
  image_url: string | null
  avg_rating: number
  review_count: number
}

// Tipos de ordenação
export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'bestseller'

// ========================================
// FUNÇÕES HELPER PARA CATEGORIAS
// ========================================

/**
 * Busca categoria pai pelo slug
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
 * Busca subcategorias de uma categoria pai
 */
export async function getSubcategories(parentSlug: string): Promise<CategoryWithCount[]> {
  // Primeiro busca o ID do pai
  const parent = await getParentCategory(parentSlug)
  if (!parent) return []

  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      products:products(count)
    `)
    .eq('parent_id', parent.id)
    .eq('is_active', true)
    .order('position')

  if (error || !data) return []

  // Mapeia para adicionar product_count
  return data.map(cat => ({
    ...cat,
    product_count: cat.products?.[0]?.count || 0
  }))
}

/**
 * Busca subcategoria pelo slug do pai e da subcategoria
 */
export async function getSubcategory(parentSlug: string, subcategorySlug: string): Promise<Category | null> {
  // Primeiro busca o ID do pai
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
 * Busca produtos de uma subcategoria com paginação e ordenação
 */
export async function getProductsByCategory(
  categoryId: string,
  page: number = 1,
  perPage: number = 12,
  sort: SortOption = 'relevance'
): Promise<{ products: ProductForListing[], total: number }> {
  
  // Determina ordenação
  let orderColumn = 'position'
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
      orderColumn = 'position' // Por enquanto usa position
      orderAscending = true
      break
    default:
      orderColumn = 'position'
      orderAscending = true
  }

  // Conta total
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', categoryId)
    .eq('is_active', true)

  // Busca produtos com paginação
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      slug,
      name,
      price,
      compare_at_price,
      product_images!inner(cloudinary_path)
    `)
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .eq('product_images.image_type', 'principal')
    .order(orderColumn, { ascending: orderAscending })
    .range((page - 1) * perPage, page * perPage - 1)

  if (error || !data) {
    return { products: [], total: 0 }
  }

  // Mapeia para o formato esperado
  const products: ProductForListing[] = data.map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    compare_at_price: p.compare_at_price,
    image_url: p.product_images?.[0]?.cloudinary_path || null,
    avg_rating: 0, // TODO: implementar quando tiver reviews
    review_count: 0
  }))

  return { products, total: count || 0 }
}

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
