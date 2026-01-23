import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
    // 1. Listar todos os arquivos .webp na raiz do bucket
    const { data: files, error: listError } = await supabaseAdmin.storage
      .from(BUCKET)
      .list('', { limit: 1000 })

    if (listError) {
      return NextResponse.json({ error: 'Erro ao listar storage', details: listError }, { status: 500 })
    }

    const webpFiles = files?.filter(f => f.name.endsWith('.webp')) || []
    
    if (webpFiles.length === 0) {
      return NextResponse.json({ message: 'Nenhum arquivo .webp encontrado na raiz' })
    }

    // 2. Agrupar arquivos por slug do produto
    const filesByProduct: Record<string, string[]> = {}
    
    for (const file of webpFiles) {
      // Padrão: rack-theo-cinamomo-c-off-white-tv-ate-60-polegadas-1.webp
      // Ou: rack-theo-cinamomo-c-off-white-1.webp
      const match = file.name.match(/^(.+)-(\d+)\.webp$/)
      if (match) {
        let baseSlug = match[1]
        // Remover sufixo "-tv-ate-XX-polegadas" se existir
        baseSlug = baseSlug.replace(/-tv-ate-\d+-polegadas$/, '')
        
        if (!filesByProduct[baseSlug]) {
          filesByProduct[baseSlug] = []
        }
        filesByProduct[baseSlug].push(file.name)
      }
    }

    // 3. Para cada grupo, encontrar o produto e registrar imagens
    const results = {
      processed: 0,
      skipped: 0,
      errors: [] as string[],
      details: [] as { slug: string; images: number }[]
    }

    for (const [slug, imageFiles] of Object.entries(filesByProduct)) {
      // Buscar produto pelo slug
      const { data: product, error: productError } = await supabaseAdmin
        .from('products')
        .select('id, name')
        .eq('slug', slug)
        .single()

      if (productError || !product) {
        // Tentar buscar por slug parcial
        const { data: products } = await supabaseAdmin
          .from('products')
          .select('id, name, slug')
          .ilike('slug', `%${slug}%`)
          .limit(1)

        if (!products || products.length === 0) {
          results.errors.push(`Produto não encontrado: ${slug}`)
          results.skipped++
          continue
        }
      }

      const productId = product?.id
      if (!productId) continue

      // Verificar imagens existentes
      const { data: existingImages } = await supabaseAdmin
        .from('product_images')
        .select('url')
        .eq('product_id', productId)

      const existingUrls = new Set(existingImages?.map(img => img.url) || [])

      // Inserir novas imagens
      let addedCount = 0
      for (let i = 0; i < imageFiles.length; i++) {
        const fileName = imageFiles[i]
        const imageUrl = `${STORAGE_URL}/${fileName}`

        if (existingUrls.has(imageUrl)) {
          continue // Já existe
        }

        const { error: insertError } = await supabaseAdmin
          .from('product_images')
          .insert({
            product_id: productId,
            url: imageUrl,
            alt_text: `${product?.name || slug} - Imagem ${i + 1}`,
            position: i,
            is_primary: i === 0
          })

        if (!insertError) {
          addedCount++
        }
      }

      if (addedCount > 0) {
        results.processed++
        results.details.push({ slug, images: addedCount })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sincronização concluída`,
      ...results
    })

  } catch (error) {
    console.error('Erro na sincronização:', error)
    return NextResponse.json({ 
      error: 'Erro interno', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}