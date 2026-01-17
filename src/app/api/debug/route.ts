import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const debug: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
  }

  const racksId = '4e3e59e8-acf1-4158-abc2-62be13c2d0ca'

  try {
    // 1. Query DIRETA com cliente criado aqui
    const freshClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { count: freshCount } = await freshClient
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', racksId)
      .eq('is_active', true)

    debug.freshClientCount = freshCount

    // 2. Query com cliente do lib/supabase (MESMO usado nas funções)
    const { count: libCount, error: libCountError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', racksId)
      .eq('is_active', true)

    debug.libClientCount = { count: libCount, error: libCountError?.message }

    // 3. Query completa COM JOIN (igual getProductsByCategory)
    const { data: productsWithJoin, error: joinError } = await supabase
      .from('products')
      .select(`
        id,
        slug,
        name,
        price,
        compare_at_price,
        product_images(image_url, image_type)
      `)
      .eq('category_id', racksId)
      .eq('is_active', true)
      .order('name', { ascending: true })
      .range(0, 11)

    debug.queryWithJoin = { 
      count: productsWithJoin?.length || 0, 
      error: joinError?.message,
      errorDetails: joinError ? JSON.stringify(joinError) : null
    }

    // 4. Query SEM JOIN (simplificada)
    const { data: productsNoJoin, error: noJoinError } = await supabase
      .from('products')
      .select('id, slug, name, price')
      .eq('category_id', racksId)
      .eq('is_active', true)
      .order('name', { ascending: true })
      .range(0, 11)

    debug.queryNoJoin = { 
      count: productsNoJoin?.length || 0, 
      error: noJoinError?.message,
      firstProduct: productsNoJoin?.[0] || null
    }

  } catch (e) {
    debug.exception = String(e)
  }

  return NextResponse.json(debug, { status: 200 })
}
