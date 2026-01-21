import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

// Cliente Supabase com service role (acesso total)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BUCKET = 'product-images'
const ORIGINAIS_FOLDER = 'originais'

// Gera nome SEO para o arquivo
function generateSeoFilename(
  productSlug: string,
  productName: string,
  tvMaxSize: number | null,
  position: number
): string {
  // Base do nome
  let baseName = productSlug

  // Adiciona TV se for rack/painel
  if (tvMaxSize && (productSlug.includes('rack-') || productSlug.includes('painel-'))) {
    baseName = `${baseName}-tv-ate-${tvMaxSize}-polegadas`
  }

  // Adiciona número
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

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação simples
    const { searchParams } = new URL(request.url)
    const password = searchParams.get('password')
    
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Parâmetros opcionais
    const body = await request.json().catch(() => ({}))
    const slugFilter = body.slug || null // Processar só um produto específico
    const dryRun = body.dryRun || false // Só simular, não processar

    const results: any[] = []
    const errors: any[] = []

    // 1. Listar pastas em originais/
    const { data: folders, error: listError } = await supabaseAdmin.storage
      .from(BUCKET)
      .list(ORIGINAIS_FOLDER, { limit: 500 })

    if (listError) {
      return NextResponse.json({ error: 'Erro ao listar pastas', details: listError }, { status: 500 })
    }

    // Filtrar só pastas (não arquivos)
    const productFolders = folders?.filter(f => !f.name.includes('.')) || []

    for (const folder of productFolders) {
      const slug = folder.name

      // Filtrar se especificado
      if (slugFilter && slug !== slugFilter) continue

      try {
        // 2. Buscar produto no banco pelo slug
        const { data: product, error: productError } = await supabaseAdmin
          .from('products')
          .select('id, name, slug, tv_max_size')
          .eq('slug', slug)
          .single()

        if (productError || !product) {
          errors.push({ slug, error: 'Produto não encontrado no banco' })
          continue
        }

        // 3. Listar imagens na pasta do produto
        const { data: images, error: imagesError } = await supabaseAdmin.storage
          .from(BUCKET)
          .list(`${ORIGINAIS_FOLDER}/${slug}`, { limit: 50 })

        if (imagesError || !images?.length) {
          errors.push({ slug, error: 'Nenhuma imagem encontrada' })
          continue
        }

        // Filtrar só arquivos de imagem e ordenar
        const imageFiles = images
          .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f.name))
          .sort((a, b) => {
            const numA = parseInt(a.name.match(/\d+/)?.[0] || '0')
            const numB = parseInt(b.name.match(/\d+/)?.[0] || '0')
            return numA - numB
          })

        if (dryRun) {
          results.push({
            slug,
            product_id: product.id,
            product_name: product.name,
            images_found: imageFiles.length,
            images: imageFiles.map(f => f.name)
          })
          continue
        }

        // 4. Verificar imagens já existentes para este produto
        const { data: existingImages } = await supabaseAdmin
          .from('product_images')
          .select('id')
          .eq('product_id', product.id)

        // Se já tem imagens, pular (evitar duplicatas)
        if (existingImages && existingImages.length > 0) {
          results.push({
            slug,
            status: 'skipped',
            reason: `Já tem ${existingImages.length} imagens`
          })
          continue
        }

        // 5. Processar cada imagem
        let processedCount = 0

        for (let i = 0; i < imageFiles.length; i++) {
          const imageFile = imageFiles[i]
          const position = i + 1

          try {
            // Baixar imagem original
            const { data: fileData, error: downloadError } = await supabaseAdmin.storage
              .from(BUCKET)
              .download(`${ORIGINAIS_FOLDER}/${slug}/${imageFile.name}`)

            if (downloadError || !fileData) {
              errors.push({ slug, image: imageFile.name, error: 'Erro ao baixar' })
              continue
            }

            // Converter para buffer
            const buffer = Buffer.from(await fileData.arrayBuffer())

            // Processar com Sharp: converter para WebP, redimensionar
            const processedBuffer = await sharp(buffer)
              .resize(1200, 1200, {
                fit: 'inside',
                withoutEnlargement: true
              })
              .webp({ quality: 82 })
              .toBuffer()

            // Gerar nome SEO
            const seoFilename = generateSeoFilename(
              product.slug,
              product.name,
              product.tv_max_size,
              position
            )

            // Upload para pasta final (raiz do bucket)
            const { error: uploadError } = await supabaseAdmin.storage
              .from(BUCKET)
              .upload(seoFilename, processedBuffer, {
                contentType: 'image/webp',
                upsert: true
              })

            if (uploadError) {
              errors.push({ slug, image: imageFile.name, error: 'Erro no upload', details: uploadError })
              continue
            }

            // Gerar URL pública
            const { data: urlData } = supabaseAdmin.storage
              .from(BUCKET)
              .getPublicUrl(seoFilename)

            // Gerar alt text
            const altText = generateAltText(
              product.name,
              product.tv_max_size,
              position,
              imageFiles.length
            )

            // Registrar no banco
            const { error: insertError } = await supabaseAdmin
              .from('product_images')
              .insert({
                product_id: product.id,
                url: urlData.publicUrl,
                alt_text: altText,
                position: position,
                is_primary: position === 1
              })

            if (insertError) {
              errors.push({ slug, image: imageFile.name, error: 'Erro ao inserir no banco', details: insertError })
              continue
            }

            processedCount++

          } catch (imageError: any) {
            errors.push({ slug, image: imageFile.name, error: imageError.message })
          }
        }

        results.push({
          slug,
          product_id: product.id,
          status: 'processed',
          images_processed: processedCount,
          images_total: imageFiles.length
        })

      } catch (folderError: any) {
        errors.push({ slug, error: folderError.message })
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        folders_found: productFolders.length,
        processed: results.filter(r => r.status === 'processed').length,
        skipped: results.filter(r => r.status === 'skipped').length,
        errors: errors.length
      },
      results,
      errors
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GET para testar / dry run
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const password = searchParams.get('password')

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  // Simular POST com dryRun
  const mockRequest = new NextRequest(request.url, {
    method: 'POST',
    body: JSON.stringify({ dryRun: true })
  })

  return POST(mockRequest)
}
