import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// ============================================
// CONFIGURAÇÃO SUPABASE
// ============================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ============================================
// TIPOS
// ============================================

type SearchFilters = {
  textQuery: string
  width_cm?: number
  width_min?: number
  width_max?: number
  tv_min_size?: number
  min_doors?: number
  min_drawers?: number
  min_shelves?: number
  min_niches?: number
  has_wheels?: boolean
  has_mirror?: boolean
  has_lighting?: boolean
  price_max?: number
  color?: string  // NOVO: cor detectada
}

// ============================================
// PARSER DE BUSCA INTELIGENTE
// ============================================

function parseSearchQuery(query: string): SearchFilters {
  const filters: SearchFilters = {
    textQuery: query
  }
  
  let cleanQuery = query.toLowerCase().trim()
  
  // =========================================
  // 1. LARGURA / MEDIDAS
  // =========================================
  
  // Metros COM unidade: 1,80m, 1.80m, 1,8 m, 1,80 metros
  const metersWithUnitMatch = cleanQuery.match(/(\d+)[,.](\d+)\s*m(?:etro)?s?(?:\s|$|,)/i)
  if (metersWithUnitMatch) {
    const meters = parseFloat(`${metersWithUnitMatch[1]}.${metersWithUnitMatch[2]}`)
    filters.width_cm = Math.round(meters * 100)
    cleanQuery = cleanQuery.replace(metersWithUnitMatch[0], ' ')
  }
  
  // Metros SEM unidade: "com 1,80", "de 1,80", "1,80" (assume metros se tem vírgula/ponto)
  if (!filters.width_cm) {
    const metersNoUnitMatch = cleanQuery.match(/(?:com|de|)?\s*(\d)[,.](\d{1,2})(?:\s|$|,)/i)
    if (metersNoUnitMatch) {
      const meters = parseFloat(`${metersNoUnitMatch[1]}.${metersNoUnitMatch[2]}`)
      // Só considera metros se valor entre 0.5 e 3 (medidas razoáveis de móveis)
      if (meters >= 0.5 && meters <= 3) {
        filters.width_cm = Math.round(meters * 100)
        cleanQuery = cleanQuery.replace(metersNoUnitMatch[0], ' ')
      }
    }
  }
  
  // Centímetros: 180cm, 180 cm
  if (!filters.width_cm) {
    const cmMatch = cleanQuery.match(/(\d+)\s*cm(?:\s|$|,)/i)
    if (cmMatch) {
      filters.width_cm = parseInt(cmMatch[1])
      cleanQuery = cleanQuery.replace(cmMatch[0], ' ')
    }
  }
  
  // Número grande sozinho (assume cm): "rack 180" → 180cm
  if (!filters.width_cm) {
    const bigNumberMatch = cleanQuery.match(/(?:com|de|)?\s*(\d{3})(?:\s|$|,)/i)
    if (bigNumberMatch) {
      const num = parseInt(bigNumberMatch[1])
      // Só considera se for medida razoável (50-300cm)
      if (num >= 50 && num <= 300) {
        filters.width_cm = num
        cleanQuery = cleanQuery.replace(bigNumberMatch[0], ' ')
      }
    }
  }
  
  // Faixa de largura: "entre 1m e 1,5m", "de 1,20 a 1,80"
  const rangeMatch = cleanQuery.match(/(?:entre|de)\s+(\d+)[,.]?(\d+)?\s*(?:m|cm)?\s+(?:e|a|até|ate)\s+(\d+)[,.]?(\d+)?\s*(?:m|cm)?/i)
  if (rangeMatch) {
    let min = parseFloat(`${rangeMatch[1]}.${rangeMatch[2] || '0'}`)
    let max = parseFloat(`${rangeMatch[3]}.${rangeMatch[4] || '0'}`)
    if (min < 10) min *= 100
    if (max < 10) max *= 100
    filters.width_min = Math.round(min)
    filters.width_max = Math.round(max)
    cleanQuery = cleanQuery.replace(rangeMatch[0], ' ')
  }
  
  // =========================================
  // 2. TV / POLEGADAS
  // =========================================
  
  const tvPatterns = [
    /tv\s*(?:de\s+)?(\d+)(?:\s*pol(?:egadas)?)?/i,
    /(?:para\s+)?(\d+)\s*pol(?:egadas)?/i,
    /(?:para\s+)?(\d+)\s*"/i,
    /(\d+)\s*polegadas/i
  ]
  
  for (const pattern of tvPatterns) {
    const match = cleanQuery.match(pattern)
    if (match) {
      const size = parseInt(match[1])
      if (size >= 32 && size <= 85) {
        filters.tv_min_size = size
        cleanQuery = cleanQuery.replace(match[0], ' ')
        break
      }
    }
  }
  
  // =========================================
  // 3. ESTRUTURA (PORTAS, GAVETAS, ETC)
  // =========================================
  
  const doorsMatch = cleanQuery.match(/(?:com\s+)?(\d+)?\s*portas?/i)
  if (doorsMatch) {
    filters.min_doors = doorsMatch[1] ? parseInt(doorsMatch[1]) : 1
    cleanQuery = cleanQuery.replace(doorsMatch[0], ' ')
  }
  
  const drawersMatch = cleanQuery.match(/(?:com\s+)?(\d+)?\s*gavetas?/i)
  if (drawersMatch) {
    filters.min_drawers = drawersMatch[1] ? parseInt(drawersMatch[1]) : 1
    cleanQuery = cleanQuery.replace(drawersMatch[0], ' ')
  }
  
  const shelvesMatch = cleanQuery.match(/(?:com\s+)?(\d+)?\s*prateleiras?/i)
  if (shelvesMatch) {
    filters.min_shelves = shelvesMatch[1] ? parseInt(shelvesMatch[1]) : 1
    cleanQuery = cleanQuery.replace(shelvesMatch[0], ' ')
  }
  
  const nichesMatch = cleanQuery.match(/(?:com\s+)?(\d+)?\s*nichos?/i)
  if (nichesMatch) {
    filters.min_niches = nichesMatch[1] ? parseInt(nichesMatch[1]) : 1
    cleanQuery = cleanQuery.replace(nichesMatch[0], ' ')
  }
  
  // =========================================
  // 4. RECURSOS ESPECIAIS
  // =========================================
  
  if (/com\s+(?:rodinhas?|rodízios?|rodas?)/i.test(cleanQuery)) {
    filters.has_wheels = true
    cleanQuery = cleanQuery.replace(/com\s+(?:rodinhas?|rodízios?|rodas?)/gi, ' ')
  }
  
  if (/com\s+espelho/i.test(cleanQuery)) {
    filters.has_mirror = true
    cleanQuery = cleanQuery.replace(/com\s+espelho/gi, ' ')
  }
  
  if (/com\s+(?:led|ilumina[çc][aã]o|luz)/i.test(cleanQuery)) {
    filters.has_lighting = true
    cleanQuery = cleanQuery.replace(/com\s+(?:led|ilumina[çc][aã]o|luz)/gi, ' ')
  }
  
  // =========================================
  // 5. PREÇO
  // =========================================
  
  const priceMatch = cleanQuery.match(/(?:até|ate|menos\s+de|max|máximo)\s*(?:r\$\s*)?(\d+(?:[.,]\d+)?)/i)
  if (priceMatch) {
    filters.price_max = parseFloat(priceMatch[1].replace(',', '.'))
    cleanQuery = cleanQuery.replace(priceMatch[0], ' ')
  }
  
  // =========================================
  // 6. COR (NOVO!)
  // =========================================
  
  const cores: { [key: string]: string } = {
    'branco': 'Branco',
    'preto': 'Preto',
    'amadeirado': 'Amadeirado',
    'carvalho': 'Carvalho',
    'canela': 'Canela',
    'cinza': 'Cinza',
    'marrom': 'Marrom',
    'nogueira': 'Nogueira',
    'off white': 'Off White',
    'off-white': 'Off White',
    'freijó': 'Freijó',
    'freijo': 'Freijó',
  }
  
  for (const [corKey, corLabel] of Object.entries(cores)) {
    if (cleanQuery.includes(corKey)) {
      filters.color = corLabel
      cleanQuery = cleanQuery.replace(new RegExp(corKey, 'gi'), ' ')
      break
    }
  }
  
  // =========================================
  // 7. LIMPAR TEXTO RESTANTE
  // =========================================
  
  const stopWords = [
    'com', 'para', 'de', 'do', 'da', 'e', 'ou', 'um', 'uma',
    'quero', 'preciso', 'busco', 'procuro', 'mostra', 'me',
    'que', 'tenha', 'seja', 'ter'
  ]
  
  let words = cleanQuery.split(/\s+/).filter(w => w.length > 1)
  words = words.filter(w => !stopWords.includes(w))
  
  filters.textQuery = words.join(' ').trim()
  
  return filters
}

// ============================================
// DESCRIÇÃO DOS FILTROS (para chips)
// ============================================

function describeFilters(filters: SearchFilters): string[] {
  const descriptions: string[] = []
  
  if (filters.width_cm) {
    descriptions.push(`Largura: ~${filters.width_cm}cm`)
  }
  if (filters.width_min && filters.width_max) {
    descriptions.push(`Largura: ${filters.width_min}cm a ${filters.width_max}cm`)
  }
  if (filters.tv_min_size) {
    descriptions.push(`TV: até ${filters.tv_min_size}"`)
  }
  if (filters.min_doors) {
    descriptions.push(`${filters.min_doors}+ porta${filters.min_doors > 1 ? 's' : ''}`)
  }
  if (filters.min_drawers) {
    descriptions.push(`${filters.min_drawers}+ gaveta${filters.min_drawers > 1 ? 's' : ''}`)
  }
  if (filters.min_shelves) {
    descriptions.push(`${filters.min_shelves}+ prateleira${filters.min_shelves > 1 ? 's' : ''}`)
  }
  if (filters.min_niches) {
    descriptions.push(`${filters.min_niches}+ nicho${filters.min_niches > 1 ? 's' : ''}`)
  }
  if (filters.has_wheels) {
    descriptions.push('Com rodinhas')
  }
  if (filters.has_mirror) {
    descriptions.push('Com espelho')
  }
  if (filters.has_lighting) {
    descriptions.push('Com LED')
  }
  if (filters.price_max) {
    descriptions.push(`Até R$ ${filters.price_max}`)
  }
  if (filters.color) {
    descriptions.push(`Cor: ${filters.color}`)
  }
  
  return descriptions
}

// ============================================
// API HANDLER
// ============================================

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100) // Max 100
  
  if (!query.trim()) {
    return NextResponse.json({ products: [], filters: [], total: 0 })
  }
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  // Parse da busca
  const filters = parseSearchQuery(query)
  const filterDescriptions = describeFilters(filters)
  
  try {
    // Construir query base
    let dbQuery = supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        tv_max_size,
        width_cm,
        num_doors,
        num_drawers,
        num_shelves,
        num_niches,
        has_wheels,
        has_mirror,
        has_lighting,
        categories (
          slug
        ),
        product_images (
          cloudinary_path,
          position
        )
      `)
      .eq('is_active', true)
      .order('name')
      .limit(limit)
    
    // =========================================
    // APLICAR FILTROS
    // =========================================
    
    // Texto (nome do produto)
    if (filters.textQuery) {
      const searchTerm = filters.textQuery.trim()
      
      // Para termos curtos (< 4 chars), buscar apenas no INÍCIO do nome
      // Para evitar "rac" encontrar "Terracota"
      // Para termos maiores, buscar em qualquer posição
      if (searchTerm.length < 4) {
        // Busca no início do nome apenas
        dbQuery = dbQuery.ilike('name', `${searchTerm}%`)
      } else {
        // Busca em qualquer lugar
        dbQuery = dbQuery.ilike('name', `%${searchTerm}%`)
      }
    }
    
    // Cor (busca no nome do produto) - V1 via texto
    if (filters.color && !filters.textQuery?.toLowerCase().includes(filters.color.toLowerCase())) {
      dbQuery = dbQuery.ilike('name', `%${filters.color}%`)
    }
    
    // Largura (com margem de 10cm)
    if (filters.width_cm) {
      dbQuery = dbQuery.gte('width_cm', filters.width_cm - 10)
      dbQuery = dbQuery.lte('width_cm', filters.width_cm + 10)
    }
    
    // Largura faixa
    if (filters.width_min) {
      dbQuery = dbQuery.gte('width_cm', filters.width_min)
    }
    if (filters.width_max) {
      dbQuery = dbQuery.lte('width_cm', filters.width_max)
    }
    
    // TV
    if (filters.tv_min_size) {
      dbQuery = dbQuery.gte('tv_max_size', filters.tv_min_size)
    }
    
    // Estrutura
    if (filters.min_doors) {
      dbQuery = dbQuery.gte('num_doors', filters.min_doors)
    }
    if (filters.min_drawers) {
      dbQuery = dbQuery.gte('num_drawers', filters.min_drawers)
    }
    if (filters.min_shelves) {
      dbQuery = dbQuery.gte('num_shelves', filters.min_shelves)
    }
    if (filters.min_niches) {
      dbQuery = dbQuery.gte('num_niches', filters.min_niches)
    }
    
    // Recursos especiais
    if (filters.has_wheels) {
      dbQuery = dbQuery.eq('has_wheels', true)
    }
    if (filters.has_mirror) {
      dbQuery = dbQuery.eq('has_mirror', true)
    }
    if (filters.has_lighting) {
      dbQuery = dbQuery.eq('has_lighting', true)
    }
    
    // Preço
    if (filters.price_max) {
      dbQuery = dbQuery.lte('price', filters.price_max)
    }
    
    // Executar query
    const { data: products, error } = await dbQuery
    
    if (error) {
      console.error('Erro na busca:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // =========================================
    // FORMATAR RESULTADOS
    // =========================================
    
    const formattedProducts = (products || []).map(p => {
      // Ordenar imagens por position e pegar a primeira
      const sortedImages = (p.product_images || []).sort((a: any, b: any) => a.position - b.position)
      const firstImage = sortedImages[0]?.cloudinary_path || null
      
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        category_slug: (p.categories as any)?.slug || null,
        first_image: firstImage,
        tv_max_size: p.tv_max_size,
        // TODO: Adicionar rating e review_count quando tivermos a tabela de reviews
        rating: 5,
        review_count: 0,
      }
    })
    
    return NextResponse.json({
      products: formattedProducts,
      filters: filterDescriptions,
      total: formattedProducts.length
    })
    
  } catch (error) {
    console.error('Erro na API de busca:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
