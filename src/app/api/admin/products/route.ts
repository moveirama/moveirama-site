import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const filter = searchParams.get('filter') || 'all'

  try {
    let query = supabase
      .from('products')
      .select(`
        id,
        sku,
        name,
        slug,
        is_active,
        assembly_video_url,
        manual_pdf_url,
        medidas_image_url,
        tv_max_size,
        weight_capacity,
        categories (
          slug
        ),
        product_images (
          id,
          cloudinary_path,
          image_type,
          position
        )
      `)
      .eq('is_active', true)
      .order('name')

    if (search) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`)
    }

    const { data: products, error } = await query

    if (error) {
      console.error('Erro ao buscar produtos:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Formatar para incluir category_slug
    const formattedProducts = (products || []).map(p => ({
      ...p,
      category_slug: (p.categories as any)?.slug || null
    }))

    let filteredProducts = formattedProducts
    
    if (filter === 'with-images') {
      filteredProducts = filteredProducts.filter(p => p.product_images && p.product_images.length > 0)
    } else if (filter === 'without-images') {
      filteredProducts = filteredProducts.filter(p => !p.product_images || p.product_images.length === 0)
    }

    const total = formattedProducts.length
    const withImages = formattedProducts.filter(p => p.product_images && p.product_images.length > 0).length
    const withoutImages = total - withImages

    return NextResponse.json({
      products: filteredProducts,
      stats: {
        total,
        withImages,
        withoutImages
      }
    })
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
