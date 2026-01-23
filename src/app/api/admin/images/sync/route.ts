import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

    // 3. Para cada produto, verificar se existe e inserir imagens
    const results: any[] = []
    let totalInserted = 0
    let totalSkipped = 0
    let totalErrors = 0

    for (const [slug, filenames] of Object.entries(filesByProduct)) {
      // Buscar produto
      const { data: product, error: productError } = await supabaseAdmin
        .from('products')
        .select('id, name, tv_max_size')
        .eq('slug', slug)
        .single()

      if (productError || !product) {
        results.push({ slug, status: 'produto_nao_encontrado' })
        totalErrors++
        continue
      }

      // Verificar quantas imagens já tem
      const { data: existingImages } = await supabaseAdmin
        .from('product_images')
        .select('url')
        .eq('product_id', product.id)

      const existingUrls = new Set(existingImages?.map(i => i.url) || [])

      // Ordenar filenames por número
      filenames.sort((a, b) => {
        const numA = parseInt(a.match(/-(\d+)\.webp$/)?.[1] || '0')
        const numB = parseInt(b.match(/-(\d+)\.webp$/)?.[1] || '0')
        return numA - numB
      })

      let inserted = 0
      for (let i = 0; i < filenames.length; i++) {
        const filename = filenames[i]
        const url = `${STORAGE_URL}/${filename}`
        const position = i + 1

        // Pular se já existe
        if (existingUrls.has(url)) {
          totalSkipped++
          continue
        }

        // Gerar alt text
        let altText = product.name
        if (product.tv_max_size) {
          altText = `${product.name} para TV até ${product.tv_max_size} polegadas`
        }
        if (filenames.length > 1) {
          altText = `${altText} - Imagem ${position} de ${filenames.length}`
        }

        // Inserir
        const { error: insertError } = await supabaseAdmin
          .from('product_images')
          .insert({
            product_id: product.id,
            url: url,
            alt_text: altText,
            position: position,
            is_primary: position === 1
          })

        if (insertError) {
          results.push({ slug, filename, error: insertError.message })
          totalErrors++
        } else {
          inserted++
          totalInserted++
        }
      }

      if (inserted > 0) {
        results.push({ slug, status: 'ok', inserted })
      }
    }

    return NextResponse.json({
      message: 'Sincronização concluída',
      total_files: webpFiles.length,
      total_products: Object.keys(filesByProduct).length,
      total_inserted: totalInserted,
      total_skipped: totalSkipped,
      total_errors: totalErrors,
      details: results.filter(r => r.status !== 'ok' || r.inserted > 0)
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
