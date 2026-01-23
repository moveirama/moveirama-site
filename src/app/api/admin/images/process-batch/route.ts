import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

// Lazy initialization - só cria o client quando a função for chamada
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !key) {
    throw new Error('Missing Supabase credentials')
  }
  
  return createClient(url, key)
}

const BUCKET = 'product-images'
const ORIGINAIS_FOLDER = 'originais'

// Gera nome SEO para o arquivo
function generateSeoFilename(
  productSlug: string,
  tvMaxSize: number | null,
  position: number
): string {
  let baseName = productSlug

  // Adiciona TV para racks e painéis
  if (tvMaxSize && (productSlug.includes('rack-') || productSlug.includes('painel-'))) {
    baseName = `${baseName}-tv-ate-${tvMaxSize}-polegadas`
  }

  return `${baseName}-${position}.webp`
}

// Gera alt text SEO
function generateAltText(
  productName: string,
  tvMaxSize: number | null,
  position: number,
  total: number
): string {
  let alt = productName

  if (tvMaxSize) {
    alt = `${productName} para TV até ${tvMaxSize} polegadas`
  }

  if (total > 1) {
    alt = `${alt} - Imagem ${position} de ${total}`
  }

  return alt
}

// GET: Lista pastas pendentes
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const password = searchParams.get('password')

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  // Inicializa client dentro da função
  const supabaseAdmin = getSupabaseAdmin()
  
  try {
    // Listar pastas em originais/
    const { data: folders, error: listError } = await supabaseAdmin.storage
      .from(BUCKET)
      .list(ORIGINAIS_FOLDER, { limit: 500 })

    if (listError) {
      return NextResponse.json({ error: 'Erro ao listar pastas', details: listError }, { status: 500 })
    }

    const productFolders = folders?.filter(f => !f.name.includes('.')) || []

    // Verificar quais já têm imagens no banco
    const pending: string[] = []
    const done: string[] = []

    for (const folder of productFolders) {
      const slug = folder.name

      // Buscar produto
      const { data: product } = await supabaseAdmin
        .from('products')
        .select('id')
        .eq('slug', slug)
        .single()

      if (!product) {
        pending.push(`${slug} (produto não encontrado)`)
        continue
      }

      // Verificar se já tem imagens
      const { data: images } = await supabaseAdmin
        .from('product_images')
        .select('id')
        .eq('product_id', product.id)
        .limit(1)

      if (images && images.length > 0) {
        done.push(slug)
      } else {
        pending.push(slug)
      }
    }

    return NextResponse.json({
      total_folders: productFolders.length,
      pending_count: pending.length,
      done_count: done.length,
      pending,
      done
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST: Processa UM produto
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
    const body = await request.json().catch(() => ({}))
    const slug = body.slug

    if (!slug) {
      return NextResponse.json({ error: 'Informe o slug do produto' }, { status: 400 })
    }

    // 1. Buscar produto no banco
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('id, name, slug, tv_max_size')
      .eq('slug', slug)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: 'Produto não encontrado', slug }, { status: 404 })
    }

    // 2. Verificar se já tem imagens
    const { data: existingImages } = await supabaseAdmin
      .from('product_images')
      .select('id')
      .eq('product_id', product.id)

    if (existingImages && existingImages.length > 0) {
      return NextResponse.json({
        status: 'skipped',
        slug,
        reason: `Já tem ${existingImages.length} imagens`
      })
    }

    // 3. Listar imagens na pasta originais/{slug}/
    const { data: images, error: imagesError } = await supabaseAdmin.storage
      .from(BUCKET)
      .list(`${ORIGINAIS_FOLDER}/${slug}`, { limit: 50 })

    if (imagesError || !images?.length) {
      return NextResponse.json({ error: 'Nenhuma imagem encontrada na pasta', slug }, { status: 404 })
    }

    // Filtrar e ordenar
    const imageFiles = images
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f.name))
      .sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/)?.[0] || '0')
        const numB = parseInt(b.name.match(/\d+/)?.[0] || '0')
        return numA - numB
      })

    if (imageFiles.length === 0) {
      return NextResponse.json({ error: 'Nenhuma imagem válida na pasta', slug }, { status: 404 })
    }

    // 4. Processar cada imagem
    const processed: string[] = []
    const errors: any[] = []

    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i]
      const position = i + 1

      try {
        // Baixar original
        const { data: fileData, error: downloadError } = await supabaseAdmin.storage
          .from(BUCKET)
          .download(`${ORIGINAIS_FOLDER}/${slug}/${imageFile.name}`)

        if (downloadError || !fileData) {
          errors.push({ image: imageFile.name, error: 'Erro ao baixar' })
          continue
        }

        // Converter para WebP
        const buffer = Buffer.from(await fileData.arrayBuffer())
        const processedBuffer = await sharp(buffer)
          .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer()

        // Nome SEO
        const seoFilename = generateSeoFilename(product.slug, product.tv_max_size, position)

        // Upload para raiz do bucket
        const { error: uploadError } = await supabaseAdmin.storage
          .from(BUCKET)
          .upload(seoFilename, processedBuffer, {
            contentType: 'image/webp',
            upsert: true
          })

        if (uploadError) {
          errors.push({ image: imageFile.name, error: 'Erro no upload', details: uploadError })
          continue
        }

        // URL pública
        const publicUrl = `${STORAGE_URL}/${seoFilename}`

        // Alt text
        const altText = generateAltText(product.name, product.tv_max_size, position, imageFiles.length)

        // Salvar no banco com ESTRUTURA CORRETA
        const { error: insertError } = await supabaseAdmin
          .from('product_images')
          .insert({
            product_id: product.id,
            cloudinary_path: publicUrl,  // NÃO é "url"
            alt_text: altText,
            image_type: position === 1 ? 'principal' : 'galeria',  // NÃO é "is_primary"
            position: position - 1,  // Começa em 0
            is_active: true,
            format: 'webp'
          })

        if (insertError) {
          errors.push({ image: imageFile.name, error: 'Erro ao inserir no banco', details: insertError.message })
          continue
        }

        processed.push(seoFilename)

      } catch (err: any) {
        errors.push({ image: imageFile.name, error: err.message })
      }
    }

    return NextResponse.json({
      status: 'processed',
      slug,
      product_name: product.name,
      images_processed: processed.length,
      images_total: imageFiles.length,
      processed,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
