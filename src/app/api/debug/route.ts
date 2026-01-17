import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const debug: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlStart: supabaseUrl?.substring(0, 30) + '...',
    }
  }

  try {
    const supabase = createClient(supabaseUrl!, supabaseKey!)

    // 1. Buscar categoria pai "casa"
    const { data: casa, error: casaError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', 'casa')
      .is('parent_id', null)
      .eq('is_active', true)
      .single()

    debug.casa = { data: casa, error: casaError?.message }

    if (casa) {
      // 2. Buscar subcategoria "racks"
      const { data: racks, error: racksError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', 'racks')
        .eq('parent_id', casa.id)
        .eq('is_active', true)
        .single()

      debug.racks = { data: racks, error: racksError?.message }

      if (racks) {
        // 3. Contar produtos
        const { count, error: countError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', racks.id)
          .eq('is_active', true)

        debug.productCount = { count, error: countError?.message }

        // 4. Buscar 3 produtos de exemplo
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('id, slug, name, price, category_id, is_active')
          .eq('category_id', racks.id)
          .eq('is_active', true)
          .limit(3)

        debug.sampleProducts = { data: products, error: productsError?.message }
      }
    }
  } catch (e) {
    debug.exception = String(e)
  }

  return NextResponse.json(debug, { status: 200 })
}
