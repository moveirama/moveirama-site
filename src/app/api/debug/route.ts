import { NextResponse } from 'next/server'
import { 
  getParentCategory, 
  getSubcategory, 
  getProductsByCategory 
} from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const debug: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
  }

  try {
    // 1. Testa getParentCategory
    const casa = await getParentCategory('casa')
    debug.getParentCategory = { 
      success: !!casa, 
      data: casa ? { id: casa.id, slug: casa.slug } : null 
    }

    // 2. Testa getSubcategory
    const racks = await getSubcategory('casa', 'racks')
    debug.getSubcategory = { 
      success: !!racks, 
      data: racks ? { id: racks.id, slug: racks.slug } : null 
    }

    // 3. Testa getProductsByCategory
    if (racks) {
      const { products, total } = await getProductsByCategory(racks.id, 1, 12, 'relevance')
      debug.getProductsByCategory = { 
        success: true,
        total,
        productCount: products.length,
        firstProduct: products[0] ? { 
          id: products[0].id, 
          name: products[0].name 
        } : null
      }
    } else {
      debug.getProductsByCategory = { success: false, reason: 'racks not found' }
    }

  } catch (e) {
    debug.exception = String(e)
    debug.stack = e instanceof Error ? e.stack : undefined
  }

  return NextResponse.json(debug, { status: 200 })
}
