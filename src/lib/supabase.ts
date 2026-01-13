import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types para as tabelas principais
export type Environment = {
  id: string
  slug: string
  name: string
  description: string | null
  icon: string | null
  display_order: number
  is_active: boolean
}

export type Category = {
  id: string
  environment_id: string
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
