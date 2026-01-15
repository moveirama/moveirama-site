import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types para as tabelas principais

// Categoria com estrutura hierárquica (2 níveis)
export type Category = {
  id: string
  slug: string
  name: string
  description: string | null
  parent_id: string | null
  is_active: boolean
}

// Categoria com contagem de produtos (para listagem)
export type CategoryWithCount = Category & {
  product_count: number
  image_url?: string
}

// Categoria com parent (para breadcrumb)
export type CategoryWithParent = Category & {
  parent?: Category | null
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
  category: CategoryWithParent
  variants: ProductVariant[]
  images: ProductImage[]
}

// Produto para listagem (mais leve, sem detalhes completos)
export type ProductForListing = {
  id: string
  slug: string
  name: string
  price: number
  compare_at_price: number | null
  image_url?: string
  avg_rating?: number
  review_count?: number
}

// Helpers para queries
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

export async function getParentCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .eq('is_active', true)
    .order('name')
  
  if (error) return []
  return data || []
}

export async function getSubcategories(parentId: string): Promise<CategoryWithCount[]> {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      products:products(count)
    `)
    .eq('parent_id', parentId)
    .eq('is_active', true)
    .order('name')
  
  if (error) return []
  
  // Transform para incluir product_count
  return (data || []).map(cat => ({
    ...cat,
    product_count: cat.products?.[0]?.count || 0
  }))
}

export async function getProductsByCategory(
  categoryId: string,
  page: number = 1,
  perPage: number = 12,
  sortBy: string = 'relevance'
): Promise<{ products: ProductForListing[], total: number }> {
  // Determinar ordenação
  let orderColumn = 'name'
  let orderAsc = true
  
  switch (sortBy) {
    case 'price-asc':
      orderColumn = 'price'
      orderAsc = true
      break
    case 'price-desc':
      orderColumn = 'price'
      orderAsc = false
      break
    case 'newest':
      orderColumn = 'created_at'
      orderAsc = false
      break
    case 'bestseller':
      orderColumn = 'stock_quantity' // placeholder - futuramente será sales_count
      orderAsc = false
      break
    default:
      orderColumn = 'name'
      orderAsc = true
  }
  
  const from = (page - 1) * perPage
  const to = from + perPage - 1
  
  // Query produtos (sem inner join para não excluir produtos sem imagem)
  const { data, error, count } = await supabase
    .from('products')
    .select(`
      id,
      slug,
      name,
      price,
      compare_at_price,
      product_images(cloudinary_path, image_type)
    `, { count: 'exact' })
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order(orderColumn, { ascending: orderAsc })
    .range(from, to)
  
  if (error) {
    console.error('Error fetching products:', error)
    return { products: [], total: 0 }
  }
  
  // Transform para ProductForListing (busca imagem principal ou primeira disponível)
  const products: ProductForListing[] = (data || []).map(p => {
    // Tenta encontrar imagem principal, senão usa a primeira
    const images = p.product_images || []
    const principalImage = images.find((img: { image_type: string }) => img.image_type === 'principal')
    const imageUrl = principalImage?.cloudinary_path || images[0]?.cloudinary_path
    
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      compare_at_price: p.compare_at_price,
      image_url: imageUrl
    }
  })
  
  return { products, total: count || 0 }
}
