// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

const BASE_URL = 'https://moveirama.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ============================================
  // 1. PÁGINAS ESTÁTICAS
  // ============================================
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/ofertas`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  // ============================================
  // 2. CATEGORIAS (do banco)
  // ============================================
  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug, parent_id, updated_at')
    .eq('is_active', true)

  const categoryPages: MetadataRoute.Sitemap = []

  if (categories) {
    // Categorias pai (moveis-para-casa, moveis-para-escritorio)
    const parentCategories = categories.filter(c => !c.parent_id)
    
    for (const parent of parentCategories) {
      // Página da categoria pai
      categoryPages.push({
        url: `${BASE_URL}/${parent.slug}`,
        lastModified: parent.updated_at ? new Date(parent.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      })

      // Subcategorias deste pai
      const subcategories = categories.filter(c => c.parent_id === parent.id)
      
      for (const sub of subcategories) {
        categoryPages.push({
          url: `${BASE_URL}/${parent.slug}/${sub.slug}`,
          lastModified: sub.updated_at ? new Date(sub.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      }
    }
  }

  // ============================================
  // 3. PRODUTOS (do banco)
  // ============================================
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at, category_id')
    .eq('is_active', true)

  const productPages: MetadataRoute.Sitemap = []

  if (products && categories) {
    for (const product of products) {
      // Encontrar subcategoria do produto
      const subcategory = categories.find(c => c.id === product.category_id)
      if (!subcategory) continue

      // Encontrar categoria pai
      const parentCategory = categories.find(c => c.id === subcategory.parent_id)
      if (!parentCategory) continue

      // URL: /categoria-pai/subcategoria/produto
      productPages.push({
        url: `${BASE_URL}/${parentCategory.slug}/${subcategory.slug}/${product.slug}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }

  // ============================================
  // COMBINAR TUDO
  // ============================================
  return [...staticPages, ...categoryPages, ...productPages]
}
