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
  display_order: number
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
 * Busca subcategorias de uma categoria pai com contagem de produtos
 */
export async function getSubcategories(parentSlug: string): Promise<CategoryWithCount[]> {
  // Primeiro busca o ID do pai
  const parent = await getParentCategory(parentSlug)
  if (!parent) return []

  // Busca subcategorias
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', parent.id)
    .eq('is_active', true)
    .order('display_order')

  if (error || !categories) return []

  // Busca contagem de produtos para cada subcategoria
  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', cat.id)
        .eq('is_active', true)

      return {
        ...cat,
        product_count: count || 0
      }
    })
  )

  return categoriesWithCount
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
  // NOTA: 'relevance' usa ordem alfabética para exibir todos os produtos de forma previsível
  // Isso evita o problema de produtos "sumirem" nas últimas páginas por terem sido
  // cadastrados antes de outros.
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
      orderColumn = 'name' // TODO: implementar contagem de vendas
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

  // Busca produtos com paginação (LEFT JOIN para incluir produtos sem imagem)
  // CORREÇÃO: usar cloudinary_path em vez de image_url
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      slug,
      name,
      price,
      compare_at_price,
      product_images(cloudinary_path, image_type)
    `)
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order(orderColumn, { ascending: orderAscending })
    .range((page - 1) * perPage, page * perPage - 1)

  if (error || !data) {
    return { products: [], total: 0 }
  }

  // Mapeia para o formato esperado (busca imagem principal ou primeira disponível)
  // CORREÇÃO: usar cloudinary_path em vez de image_url
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
      avg_rating: 0, // TODO: implementar quando tiver reviews
      review_count: 0
    }
  })

  return { products, total: count || 0 }
}

/**
 * Busca subcategoria pelo slug (sem precisar do pai)
 */
export async function getSubcategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .not('parent_id', 'is', null) // Só subcategorias (que têm parent_id)
    .eq('is_active', true)
    .single()
  
  if (error) return null
  return data
}

/**
 * Busca produto por slug da subcategoria e slug do produto
 */
export async function getProductBySubcategoryAndSlug(
  subcategorySlug: string, 
  productSlug: string
): Promise<ProductWithDetails | null> {
  // Primeiro verifica se a subcategoria existe
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
  
  // Ordenar FAQs por position
  if (product.faqs) {
    product.faqs = product.faqs
      .filter((faq: { is_active?: boolean }) => faq.is_active !== false)
      .sort((a: { position: number }, b: { position: number }) => a.position - b.position)
  }
  
  return product
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
