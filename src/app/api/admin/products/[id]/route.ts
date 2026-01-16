import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const updateData: Record<string, any> = {}
    
    if (body.assembly_video_url !== undefined) {
      updateData.assembly_video_url = body.assembly_video_url || null
    }
    if (body.manual_pdf_url !== undefined) {
      updateData.manual_pdf_url = body.manual_pdf_url || null
    }
    if (body.medidas_image_url !== undefined) {
      updateData.medidas_image_url = body.medidas_image_url || null
    }

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
