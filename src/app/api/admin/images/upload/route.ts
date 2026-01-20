import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import sharp from 'sharp'

/**
 * API de Upload de Imagens — SEO Elite v2.0
 * 
 * ============================================
 * NOMENCLATURA ELITE DE IMAGENS
 * ============================================
 * 
 * ANTES (v1.0):
 *   Filename: "painel-lumire-cinamomo-c-off-white-1.webp"
 *   Alt text: "Painel Lumire - Cinamomo C / Off White"
 * 
 * DEPOIS (v2.0 Elite):
 *   Filename: "painel-lumire-tv-75-polegadas-cinamomo-off-white-1.webp"
 *   Alt text: "Painel Lumire para TV até 75 polegadas - Cinamomo C / Off White"
 * 
 * REGRAS:
 * 1. Estrutura: {nome-base}-tv-{polegadas}-polegadas-{cor-limpa}-{index}.webp
 * 2. Remove "c-" das cores (código interno do fornecedor)
 * 3. Inclui "tv-{polegadas}" quando produto é rack/painel com tv_max_size
 * 4. Alt text = padrão H1 da página (SEO otimizado)
 * 
 * EXEMPLOS REAIS:
 * - "painel-lumire-cinamomo-c-off-white" + tv=75 → "painel-lumire-tv-75-polegadas-cinamomo-off-white-1.webp"
 * - "rack-vivaldi-cinamomo-c-off-white" + tv=80 → "rack-vivaldi-tv-80-polegadas-cinamomo-off-white-1.webp"
 * - "escrivaninha-match-pinho-preto" (sem TV) → "escrivaninha-match-pinho-preto-1.webp"
 */

// ============================================
// FUNÇÕES DE SEO PARA IMAGENS
// ============================================

/**
 * Remove acentos de uma string
 */
function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/**
 * Normaliza string para uso em filename
 */
function normalizeForFilename(str: string): string {
  return removeAccents(str)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Detecta se é rack ou painel pelo slug/nome
 */
function isRackOrPainel(slug: string, name: string): boolean {
  const text = `${slug} ${name}`.toLowerCase()
  return text.includes('rack') || text.includes('painel')
}

/**
 * Gera alt_text otimizado (padrão H1)
 * 
 * Para racks/painéis: "Rack Theo para TV até 60 polegadas - Cinamomo C / Off White"
 * Para outros: "Escrivaninha Match - Pinho Preto"
 */
function generateImageAltText(
  productName: string,
  tvMaxSize: number | null,
  productSlug: string,
  imageIndex: number
): string {
  // Extrai nome base (antes do " - ") e cor (depois do " - ")
  const parts = productName.split(' - ')
  const baseName = parts[0]
  const colorPart = parts.slice(1).join(' - ')
  
  // Se é rack/painel E tem tv_max_size, inclui no alt
  if (isRackOrPainel(productSlug, productName) && tvMaxSize && tvMaxSize > 0) {
    const tvPart = `para TV até ${tvMaxSize} polegadas`
    
    if (colorPart) {
      return `${baseName} ${tvPart} - ${colorPart}`
    }
    return `${baseName} ${tvPart}`
  }
  
  // Para outros produtos, usa nome completo
  return productName
}

/**
 * Extrai o nome base do produto (tipo + modelo) separado das cores
 * 
 * Exemplo: "painel-lumire-cinamomo-c-off-white" 
 *   → base: "painel-lumire", cor: "cinamomo-off-white"
 * 
 * Lógica: cores conhecidas são identificadas e separadas do nome base
 */
function extractBaseAndColor(slug: string): { base: string; color: string } {
  // Lista de cores/acabamentos conhecidos (em ordem de prioridade)
  const colorPatterns = [
    // Madeiras
    'cinamomo', 'carvalho', 'cedro', 'pinho', 'pinho-ripado', 'nogueira',
    'amendoa', 'freijo', 'freijo-carvalho', 'nogal', 'canela', 'rustico',
    // Cores
    'off-white', 'branco', 'preto', 'grafite', 'cinza', 'bege',
    // Combinações comuns
    'nature', 'mel', 'demolição', 'demolição-chamagne', 'champanhe'
  ]
  
  // Remove acentos para comparação
  const normalizedSlug = removeAccents(slug).toLowerCase()
  
  // Encontra a primeira cor no slug
  let firstColorIndex = normalizedSlug.length
  let foundColor = ''
  
  for (const color of colorPatterns) {
    const colorIndex = normalizedSlug.indexOf(color)
    if (colorIndex > 0 && colorIndex < firstColorIndex) {
      // Verifica se é uma palavra completa (precedida por hífen)
      const charBefore = normalizedSlug[colorIndex - 1]
      if (charBefore === '-') {
        firstColorIndex = colorIndex
        foundColor = color
      }
    }
  }
  
  if (firstColorIndex < normalizedSlug.length) {
    // Separa base e cor
    const base = slug.substring(0, firstColorIndex - 1) // -1 para remover o hífen
    const colorPart = slug.substring(firstColorIndex)
    
    // Limpa a cor: remove "-c-" (código interno) e normaliza
    const cleanColor = colorPart
      .replace(/-c-/g, '-')  // "cinamomo-c-off-white" → "cinamomo-off-white"
      .replace(/-c$/g, '')   // Remove "-c" no final se houver
    
    return { base, color: cleanColor }
  }
  
  // Se não encontrou cor, retorna slug inteiro como base
  return { base: slug, color: '' }
}

/**
 * Gera filename otimizado para SEO (Padrão Elite)
 * 
 * Para racks/painéis: "painel-lumire-tv-75-polegadas-cinamomo-off-white-1.webp"
 * Para outros: "escrivaninha-match-pinho-preto-1.webp"
 * 
 * Estrutura Elite: {nome-base}-tv-{polegadas}-polegadas-{cor-limpa}-{index}.webp
 */
function generateImageFilename(
  productSlug: string,
  tvMaxSize: number | null,
  imageIndex: number
): string {
  // Normaliza o slug
  const normalizedSlug = normalizeForFilename(productSlug)
  
  // Extrai nome base e cor
  const { base, color } = extractBaseAndColor(normalizedSlug)
  
  // Monta o filename
  let filename = base
  
  // Se é rack/painel e tem tv_max_size, adiciona após o nome base
  if (isRackOrPainel(productSlug, '') && tvMaxSize && tvMaxSize > 0) {
    filename = `${base}-tv-${tvMaxSize}-polegadas`
  }
  
  // Adiciona cor (se houver)
  if (color) {
    filename = `${filename}-${color}`
  }
  
  // Adiciona índice e extensão
  return `${filename}-${imageIndex}.webp`
}

// ============================================
// API HANDLER
// ============================================

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

    // ============================================
    // NOVO: Busca dados do produto para SEO
    // ============================================
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('name, tv_max_size')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      console.error('Erro ao buscar produto:', productError)
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Busca quantas imagens o produto já tem para gerar número sequencial
    const { count } = await supabase
      .from('product_images')
      .select('*', { count: 'exact', head: true })
      .eq('product_id', productId)

    const nextNumber = (count || 0) + 1

    // Converte arquivo para buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Converte para WebP com sharp (qualidade 82)
    const webpBuffer = await sharp(buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()

    // ============================================
    // SEO ELITE: Filename e Alt Text otimizados
    // ============================================
    const fileName = generateImageFilename(
      productSlug,
      product.tv_max_size,
      nextNumber
    )
    
    const altText = generateImageAltText(
      product.name,
      product.tv_max_size,
      productSlug,
      nextNumber
    )

    const filePath = `${productId}/${fileName}`

    // Upload para Supabase Storage
    // upsert: true → sobrescreve se já existir (evita erro "resource already exists")
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, webpBuffer, {
        contentType: 'image/webp',
        upsert: true
      })

    if (uploadError) {
      console.error('Erro no upload:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Pega URL pública
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    // Salva no banco de dados com alt_text SEO Elite
    const { data: imageData, error: dbError } = await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        cloudinary_path: urlData.publicUrl,
        alt_text: altText,
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
