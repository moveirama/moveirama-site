// ============================================
// Moveirama — API: Upload Imagem das Medidas
// POST /api/admin/images/upload-medidas
// ============================================

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const productId = formData.get('productId') as string
    const productSlug = formData.get('productSlug') as string

    if (!file || !productId || !productSlug) {
      return NextResponse.json(
        { success: false, error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    // Converter arquivo para buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Definir nome do arquivo
    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `medidas/${productSlug}-medidas.${fileExt}`

    // Upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true  // Substitui se já existir
      })

    if (uploadError) {
      console.error('Erro no upload:', uploadError)
      return NextResponse.json(
        { success: false, error: 'Erro no upload: ' + uploadError.message },
        { status: 500 }
      )
    }

    // Gerar URL pública
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    const imageUrl = urlData.publicUrl

    // Salvar URL no banco
    const { error: updateError } = await supabase
      .from('products')
      .update({ medidas_image_url: imageUrl })
      .eq('id', productId)

    if (updateError) {
      console.error('Erro ao salvar URL:', updateError)
      return NextResponse.json(
        { success: false, error: 'Erro ao salvar no banco' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: imageUrl
    })

  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
