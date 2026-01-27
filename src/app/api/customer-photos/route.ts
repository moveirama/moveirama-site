import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface CustomerPhoto {
  id: string
  image_url: string
  bairro: string
  cidade: string
  display_order: number
  product: { name: string; slug: string } | { name: string; slug: string }[] | null
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const limit = parseInt(searchParams.get('limit') || '4')

    const { data: photos, error } = await supabase
      .from('customer_photos')
      .select(`
        id,
        image_url,
        bairro,
        cidade,
        display_order,
        product:products(name, slug)
      `)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('Erro ao buscar fotos de clientes:', error)
      return NextResponse.json({ photos: [] })
    }

    // Normaliza o campo product (pode vir como array do Supabase)
    const normalizedPhotos = (photos || []).map((photo: CustomerPhoto) => ({
      ...photo,
      product: Array.isArray(photo.product) ? photo.product[0] : photo.product
    }))

    return NextResponse.json({ photos: normalizedPhotos })

  } catch (error) {
    console.error('Erro na API customer-photos:', error)
    return NextResponse.json({ photos: [] })
  }
}