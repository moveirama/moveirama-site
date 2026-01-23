import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Lazy initialization - só cria o client quando a função for chamada
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !key) {
    throw new Error('Missing Supabase credentials')
  }
  
  return createClient(url, key)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Campos permitidos para atualização
    const allowedFields = [
      'assembly_video_url',
      'video_product_url',
      'manual_pdf_url',
      'medidas_image_url',
      'tv_max_size',
      'weight_capacity',
      'price',
      // Características (NOVOS)
      'num_doors',
      'num_drawers',
      'num_shelves',
      'num_niches',
      'has_wheels',
      'has_mirror',
      'has_lighting',
      'door_type',
      'feet_type',
    ]
    
    // Filtrar apenas campos permitidos
    const updateData: Record<string, any> = {}
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }
    
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: false, error: 'Nenhum campo válido para atualizar' }, { status: 400 })
    }
    
    // Inicializa client dentro da função
    const supabase = getSupabaseAdmin()
    
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao atualizar produto:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, product: data })
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
  }
}
