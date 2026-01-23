import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

// ============================================
// LAZY INITIALIZATION - Corrigido para evitar erro no build
// O client só é criado quando a função é chamada, não no escopo global
// ============================================
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !key) {
    throw new Error('Missing Supabase credentials')
  }
  
  return createClient(url, key)
}

const BUCKET = 'product-images'

// Função para gerar nome SEO Elite
function generateSEOFilename(
  productSlug: string,
  tvMaxSize: number | null,
  variantName: string | null,
  position: number
): string {
  let filename = productSlug

  // Adicionar TV se aplicável
  if (tvMaxSize) {
    filename += `-tv-ate-${tvMaxSize}-polegadas`
  }

  // Adicionar cor/variante se existir
  if (variantName) {
    const colorSlug = variantName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    filename += `-${colorSlug}`
  }

  // Adicionar número
  filename += `-${position}.webp`

  return filename
}

// Função para gerar alt text SEO
function generateAltText(
  productName: string,
  tvMaxSize: number | null,
  variantName: string | null
): string {
  let alt = productName

  if (tvMaxSize) {
    alt += ` para TV até ${tvMaxSize} polegadas`
  }

  if (variantName) {
    alt += ` - ${variantName}`
  }

  return alt
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const password = searchParams.get('password')

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  // Inicializa client dentro da função
  const supabaseAdmin = getSupabaseAdmin()
  const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}`

  try {
    const body = await request.json()
    const { slug } = body

    if (!slug) {
      return NextResponse.json({ error: 'Slug é obrigatório' }, { status: 400 })
    }

    // 1. Buscar produto
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select(`
        id, 
        name, 
        slug,
        tv_max_size,
        product_variants(name)
      `)
      .eq('slug', slug)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: 'Produto não encontrado', slug }, { status: 404 })
    }

    const variantName = product.product_variants?.[0]?.name || null

    // 2. Listar imagens na pasta originais/{slug}/
    const folderPath = `originais/${slug}`
    const { data: files, error: listError } = await supabaseAdmin.storage
      .from(BUCKET)
      .list(folderPath, { limit: 100 })

    if (listError) {
      return NextResponse.json({ error: 'Erro ao listar pasta', details: listError }, { status: 500 })
    }

    const imageFiles = files?.filter(f => 
      f.name.match(/\.(jpg|jpeg|png|webp)$/i)
    ) || []

    if (imageFiles.length === 0) {
      return NextResponse.json({ error: 'Nenhuma imagem encontrada', folder: folderPath }, { status: 404 })
    }

    // Ordenar por nome (1.jpg, 2.jpg, etc)
    imageFiles.sort((a, b) => {
      const numA = parseInt(a.name.match(/^(\d+)/)?.[1] || '0')
      const numB = parseInt(b.name.match(/^(\d+)/)?.[1] || '0')
      return numA - numB
    })

    // 3. Processar cada imagem
    const results = {
      processed: [] as string[],
      errors: [] as string[]
    }

    // Buscar próximo número disponível
    const { data: existingImages } = await supabaseAdmin
      .from('product_images')
      .select('position')
      .eq('product_id', product.id)
      .order('position', { ascending: false })
      .limit(1)

    let nextPosition = (existingImages?.[0]?.position ?? -1) + 1

    for (const file of imageFiles) {
      try {
        // Baixar imagem original
        const { data: fileData, error: downloadError } = await supabaseAdmin.storage
          .from(BUCKET)
          .download(`${folderPath}/${file.name}`)

        if (downloadError || !fileData) {
          results.errors.push(`Erro ao baixar ${file.name}`)
          continue
        }

        // Converter para buffer
        const buffer = Buffer.from(await fileData.arrayBuffer())

        // Processar com sharp: converter para WebP, redimensionar se necessário
        const processedBuffer = await sharp(buffer)
          .resize(1200, 1200, { 
            fit: 'inside', 
            withoutEnlargement: true 
          })
          .webp({ quality: 82 })
          .toBuffer()

        // Gerar nome SEO
        const seoFilename = generateSEOFilename(
          product.slug,
          product.tv_max_size,
          variantName,
          nextPosition + 1
        )

        // Upload para raiz do bucket
        const { error: uploadError } = await supabaseAdmin.storage
          .from(BUCKET)
          .upload(seoFilename, processedBuffer, {
            contentType: 'image/webp',
            upsert: true
          })

        if (uploadError) {
          results.errors.push(`Erro ao fazer upload ${seoFilename}: ${uploadError.message}`)
          continue
        }

        // Gerar alt text
        const altText = generateAltText(product.name, product.tv_max_size, variantName)

        // Registrar no banco
        const imageUrl = `${STORAGE_URL}/${seoFilename}`
        const { error: insertError } = await supabaseAdmin
          .from('product_images')
          .insert({
            product_id: product.id,
            urls: imageUrl,
            alt_text: altText,
            position: nextPosition,
            is_active: true,
            filename_seo: seoFilename,
            format: 'webp',
            cloudinary_path: seoFilename,
            image_type: 'product'
          })

        if (insertError) {
          results.errors.push(`Erro ao registrar ${seoFilename}: ${insertError.message}`)
          continue
        }

        results.processed.push(seoFilename)
        nextPosition++

      } catch (err) {
        results.errors.push(`Erro processando ${file.name}: ${err instanceof Error ? err.message : 'Unknown'}`)
      }
    }

    return NextResponse.json({
      success: true,
      product: product.name,
      images_processed: results.processed.length,
      images: results.processed,
      errors: results.errors
    })

  } catch (error) {
    console.error('Erro no processamento em lote:', error)
    return NextResponse.json({ 
      error: 'Erro interno', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}