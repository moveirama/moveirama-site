import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// ============================================
// LAZY INITIALIZATION - Cliente admin (service role)
// ============================================
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !key) {
    throw new Error('Missing Supabase credentials')
  }
  
  return createClient(url, key)
}

// ============================================
// Verificar autenticação via Supabase Auth
// ============================================
async function checkAuth(request: NextRequest): Promise<boolean> {
  // Opção 1: Verificar senha na query string (mantém compatibilidade)
  const { searchParams } = new URL(request.url)
  const password = searchParams.get('password')
  
  if (password && password === process.env.ADMIN_PASSWORD) {
    return true
  }
  
  // Opção 2: Verificar sessão do Supabase Auth via cookies
  try {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options as Record<string, unknown>)
            })
          },
        },
      }
    )
    
    const { data: { user } } = await supabase.auth.getUser()
    return !!user
  } catch (error) {
    console.error('Erro ao verificar auth:', error)
    return false
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthorized = await checkAuth(request)
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id } = await params
  const supabaseAdmin = getSupabaseAdmin()

  try {
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        product_images(id, url, alt_text, position, is_primary),
        product_variants(id, name, sku, price_override)
      `)
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    return NextResponse.json(product)

  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthorized = await checkAuth(request)
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id } = await params
  const supabaseAdmin = getSupabaseAdmin()

  try {
    const body = await request.json()
    
    // Campos permitidos para atualização
    const allowedFields = [
      'name',
      'slug',
      'short_description',
      'long_description',
      'price',
      'compare_at_price',
      'tv_max_size',
      'weight_capacity',
      'requires_wall_mount',
      'assembly_difficulty',
      'assembly_time_minutes',
      'assembly_video_url',
      'video_product_url',
      'manual_pdf_url',
      'medidas_image_url',
      'width_cm',
      'height_cm',
      'depth_cm',
      'weight_kg',
      'main_material',
      'thickness_mm',
      'num_doors',
      'num_drawers',
      'num_shelves',
      'num_niches',
      'has_wheels',
      'has_mirror',
      'has_lighting',
      'door_type',
      'feet_type',
      'is_active',
      'is_featured',
      'is_on_sale',
      'for_small_spaces'
    ]

    // Filtrar apenas campos permitidos
    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para atualizar' }, { status: 400 })
    }

    // Adicionar timestamp de atualização
    updateData.updated_at = new Date().toISOString()

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar produto:', error)
      return NextResponse.json({ error: 'Erro ao atualizar', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      product,
      updated_fields: Object.keys(updateData)
    })

  } catch (error) {
    console.error('Erro ao processar atualização:', error)
    return NextResponse.json({ 
      error: 'Erro interno', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthorized = await checkAuth(request)
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id } = await params
  const supabaseAdmin = getSupabaseAdmin()

  try {
    // Soft delete - apenas desativa o produto
    const { error } = await supabaseAdmin
      .from('products')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: 'Erro ao desativar produto' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Produto desativado' })

  } catch (error) {
    console.error('Erro ao desativar produto:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}