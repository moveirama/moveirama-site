import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // Busca a imagem para pegar o path
    const { data: image, error: fetchError } = await supabase
      .from('product_images')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !image) {
      return NextResponse.json({ error: 'Imagem não encontrada' }, { status: 404 })
    }

    // Extrai o path do storage da URL
    const url = image.cloudinary_path
    const storagePath = url.split('/product-images/')[1]

    // Deleta do Storage
    if (storagePath) {
      await supabase.storage.from('product-images').remove([storagePath])
    }

    // Deleta do banco
    const { error: deleteError } = await supabase
      .from('product_images')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
