import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import sharp from 'sharp'

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
    const position = parseInt(formData.get('position') as string) || 0

    if (!file || !productId || !productSlug) {
      return NextResponse.json(
        { error: 'Arquivo, productId e productSlug são obrigatórios' },
        { status: 400 }
      )
    }

    // Converte arquivo para buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Converte para WebP com sharp
    const webpBuffer = await sharp(buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer()

    // Gera nome do arquivo: produto-slug-timestamp.webp
    const timestamp = Date.now()
    const fileName = `${productSlug}-${timestamp}.webp`
    const filePath = `${productId}/${fileName}`

    // Upload para Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, webpBuffer, {
        contentType: 'image/webp',
        upsert: false
      })

    if (uploadError) {
      console.error('Erro no upload:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Pega URL pública
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    // Salva no banco de dados
    const { data: imageData, error: dbError } = await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        cloudinary_path: urlData.publicUrl,
        image_type: position === 0 ? 'principal' : 'galeria',
        position: position,
        is_active: true
      })
      .select()
      .single()

    if (dbError) {
      console.error('Erro ao salvar no banco:', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      image: imageData
    })

  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
