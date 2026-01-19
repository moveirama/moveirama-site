// src/lib/supabase.ts

/**
 * Moveirama — Cliente Supabase e funções de acesso ao banco
 * 
 * v2.3: Simplificado para estrutura de 2 níveis (sem linhas intermediárias)
 * Changelog:
 *   - Removida função getSubcategoryOfAnyParent() (não usada)
 *   - Simplificada getSubcategories() (sem lógica de sub-subcategorias)
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
 * v2.3: Simplificado para estrutura de 2 níveis (sem sub-subcategorias)
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
      // Conta produtos desta categoria
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', cat.id)
        .eq('is_active', true)

      const totalCount = count || 0

      // Busca imagem de um produto da categoria (fallback quando não tem image_url)
      let categoryImage: string | null = null
      if (totalCount > 0 && !cat.image_url) {
        const { data: productWithImage } = await supabase
          .from('products')
          .select(`
            id,
            product_images(cloudinary_path, image_type)
          `)
          .eq('category_id', cat.id)
          .eq('is_active', true)
          .limit(1)
          .single()

        if (productWithImage?.product_images) {
          const images = productWithImage.product_images as { cloudinary_path: string; image_type: string }[]
          const principalImage = images.find(img => img.image_type === 'principal')
          categoryImage = principalImage?.cloudinary_path || images[0]?.cloudinary_path || null
        }
      }

      return {
        ...cat,
        product_count: totalCount,
        image_url: cat.image_url || categoryImage
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
      tv_max_size,
      product_images(cloudinary_path, image_type)
    `)
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order(orderColumn, { ascending: orderAscending })
    .range((page - 1) * perPage, page * perPage - 1)

  if (error || !data) {
    return { products: [], total: 0 }
  }

  // Mapeia para o formato esperado
  const products: ProductForListing[] = data.map(p => {
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

  return { products, total: count || 0 }
}

/**
 * Busca produto por slug da subcategoria e slug do produto
 */
export async function getProductBySubcategoryAndSlug(
  subcategorySlug: string, 
  productSlug: string
): Promise<ProductWithDetails | null> {
  const subcategory = await getSubcategoryBySlug(subcategorySlug)
  if (!subcategory) return null

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

  if (error || !product) return null
  
  // Filtra e ordena FAQs
  if (product.faqs) {
    product.faqs = product.faqs
      .filter((faq: { is_active?: boolean }) => faq.is_active !== false)
      .sort((a: { position: number }, b: { position: number }) => a.position - b.position)
  }
  
  return product
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
