// ============================================
// Moveirama — API: Upload Imagem das Medidas
// POST /api/admin/images/upload-medidas
// ============================================

import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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

    // Upload para Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `moveirama/medidas`,
          public_id: `${productSlug}-medidas`,
          overwrite: true,
          resource_type: 'image',
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    // Salvar URL no banco
    const { error: updateError } = await supabase
      .from('products')
      .update({ medidas_image_url: uploadResult.secure_url })
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
      url: uploadResult.secure_url
    })

  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
