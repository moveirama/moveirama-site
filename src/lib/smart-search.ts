// ============================================
// Moveirama — Parser de Busca Inteligente
// Entende linguagem natural do cliente
// ============================================

export type SearchFilters = {
  // Texto livre (nome do produto)
  textQuery: string
  
  // Dimensões
  width_cm?: number
  width_min?: number
  width_max?: number
  
  // TV
  tv_min_size?: number
  
  // Estrutura (quantidade mínima)
  min_doors?: number
  min_drawers?: number
  min_shelves?: number
  min_niches?: number
  
  // Recursos especiais (boolean)
  has_wheels?: boolean
  has_mirror?: boolean
  has_lighting?: boolean
  
  // Preço
  price_max?: number
}

export function parseSearchQuery(query: string): SearchFilters {
  const filters: SearchFilters = {
    textQuery: query
  }
  
  let cleanQuery = query.toLowerCase().trim()
  
  // =========================================
  // 1. LARGURA / MEDIDAS
  // =========================================
  // "1,80m", "1.80m", "1,8m", "180cm", "1800mm"
  
  // Metros: 1,80m, 1.80m, 1,8 m, 1.8 metros
  const metersMatch = cleanQuery.match(/(\d+)[,.](\d+)\s*m(?:etro)?s?(?:\s|$|,)/i)
  if (metersMatch) {
    const meters = parseFloat(`${metersMatch[1]}.${metersMatch[2]}`)
    filters.width_cm = Math.round(meters * 100)
    cleanQuery = cleanQuery.replace(metersMatch[0], ' ')
  }
  
  // Centímetros: 180cm, 180 cm
  const cmMatch = cleanQuery.match(/(\d+)\s*cm(?:\s|$|,)/i)
  if (cmMatch && !filters.width_cm) {
    filters.width_cm = parseInt(cmMatch[1])
    cleanQuery = cleanQuery.replace(cmMatch[0], ' ')
  }
  
  // Faixa de largura: "entre 1m e 1,5m", "de 100 a 150cm"
  const rangeMatch = cleanQuery.match(/(?:entre|de)\s+(\d+)[,.]?(\d+)?\s*(?:m|cm)?\s+(?:e|a|até)\s+(\d+)[,.]?(\d+)?\s*(?:m|cm)?/i)
  if (rangeMatch) {
    let min = parseFloat(`${rangeMatch[1]}.${rangeMatch[2] || '0'}`)
    let max = parseFloat(`${rangeMatch[3]}.${rangeMatch[4] || '0'}`)
    // Se valores pequenos, assumir metros
    if (min < 10) min *= 100
    if (max < 10) max *= 100
    filters.width_min = Math.round(min)
    filters.width_max = Math.round(max)
    cleanQuery = cleanQuery.replace(rangeMatch[0], ' ')
  }
  
  // =========================================
  // 2. TV / POLEGADAS
  // =========================================
  // "TV 55", "para TV de 55", "55 polegadas", "tv55", "55pol"
  
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
      // Validar tamanho razoável de TV (32 a 85 polegadas)
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
  
  // Portas: "2 portas", "com porta", "com 2 portas"
  const doorsMatch = cleanQuery.match(/(?:com\s+)?(\d+)?\s*portas?/i)
  if (doorsMatch) {
    filters.min_doors = doorsMatch[1] ? parseInt(doorsMatch[1]) : 1
    cleanQuery = cleanQuery.replace(doorsMatch[0], ' ')
  }
  
  // Gavetas: "3 gavetas", "com gaveta", "com gavetas"
  const drawersMatch = cleanQuery.match(/(?:com\s+)?(\d+)?\s*gavetas?/i)
  if (drawersMatch) {
    filters.min_drawers = drawersMatch[1] ? parseInt(drawersMatch[1]) : 1
    cleanQuery = cleanQuery.replace(drawersMatch[0], ' ')
  }
  
  // Prateleiras: "2 prateleiras", "com prateleira"
  const shelvesMatch = cleanQuery.match(/(?:com\s+)?(\d+)?\s*prateleiras?/i)
  if (shelvesMatch) {
    filters.min_shelves = shelvesMatch[1] ? parseInt(shelvesMatch[1]) : 1
    cleanQuery = cleanQuery.replace(shelvesMatch[0], ' ')
  }
  
  // Nichos: "4 nichos", "com nicho"
  const nichesMatch = cleanQuery.match(/(?:com\s+)?(\d+)?\s*nichos?/i)
  if (nichesMatch) {
    filters.min_niches = nichesMatch[1] ? parseInt(nichesMatch[1]) : 1
    cleanQuery = cleanQuery.replace(nichesMatch[0], ' ')
  }
  
  // =========================================
  // 4. RECURSOS ESPECIAIS
  // =========================================
  
  // Rodinhas: "com rodinhas", "com rodízio", "com rodas"
  if (/com\s+(?:rodinhas?|rodízios?|rodas?)/i.test(cleanQuery)) {
    filters.has_wheels = true
    cleanQuery = cleanQuery.replace(/com\s+(?:rodinhas?|rodízios?|rodas?)/gi, ' ')
  }
  
  // Espelho: "com espelho"
  if (/com\s+espelho/i.test(cleanQuery)) {
    filters.has_mirror = true
    cleanQuery = cleanQuery.replace(/com\s+espelho/gi, ' ')
  }
  
  // LED / Iluminação: "com led", "com iluminação", "com luz"
  if (/com\s+(?:led|ilumina[çc][aã]o|luz)/i.test(cleanQuery)) {
    filters.has_lighting = true
    cleanQuery = cleanQuery.replace(/com\s+(?:led|ilumina[çc][aã]o|luz)/gi, ' ')
  }
  
  // =========================================
  // 5. PREÇO
  // =========================================
  // "até 500", "menos de 500", "até R$ 500", "max 500"
  
  const priceMatch = cleanQuery.match(/(?:até|menos\s+de|max|máximo)\s*(?:r\$\s*)?(\d+(?:[.,]\d+)?)/i)
  if (priceMatch) {
    filters.price_max = parseFloat(priceMatch[1].replace(',', '.'))
    cleanQuery = cleanQuery.replace(priceMatch[0], ' ')
  }
  
  // =========================================
  // 6. LIMPAR TEXTO RESTANTE
  // =========================================
  
  // Remover palavras comuns que não são parte do nome do produto
  const stopWords = [
    'com', 'para', 'de', 'do', 'da', 'e', 'ou', 'um', 'uma',
    'quero', 'preciso', 'busco', 'procuro', 'mostra', 'me',
    'que', 'tenha', 'seja', 'ter'
  ]
  
  let words = cleanQuery.split(/\s+/).filter(w => w.length > 0)
  words = words.filter(w => !stopWords.includes(w))
  
  // Texto limpo para busca por nome
  filters.textQuery = words.join(' ').trim()
  
  return filters
}

// =========================================
// CONSTRUIR QUERY SUPABASE
// =========================================

export function buildSupabaseFilters(filters: SearchFilters) {
  const conditions: string[] = []
  
  // Largura exata (com margem de 5cm)
  if (filters.width_cm) {
    conditions.push(`width_cm.gte.${filters.width_cm - 5}`)
    conditions.push(`width_cm.lte.${filters.width_cm + 5}`)
  }
  
  // Largura faixa
  if (filters.width_min) {
    conditions.push(`width_cm.gte.${filters.width_min}`)
  }
  if (filters.width_max) {
    conditions.push(`width_cm.lte.${filters.width_max}`)
  }
  
  // TV
  if (filters.tv_min_size) {
    conditions.push(`tv_max_size.gte.${filters.tv_min_size}`)
  }
  
  // Estrutura
  if (filters.min_doors) {
    conditions.push(`num_doors.gte.${filters.min_doors}`)
  }
  if (filters.min_drawers) {
    conditions.push(`num_drawers.gte.${filters.min_drawers}`)
  }
  if (filters.min_shelves) {
    conditions.push(`num_shelves.gte.${filters.min_shelves}`)
  }
  if (filters.min_niches) {
    conditions.push(`num_niches.gte.${filters.min_niches}`)
  }
  
  // Recursos especiais
  if (filters.has_wheels) {
    conditions.push(`has_wheels.eq.true`)
  }
  if (filters.has_mirror) {
    conditions.push(`has_mirror.eq.true`)
  }
  if (filters.has_lighting) {
    conditions.push(`has_lighting.eq.true`)
  }
  
  // Preço
  if (filters.price_max) {
    conditions.push(`price.lte.${filters.price_max}`)
  }
  
  return conditions
}

// =========================================
// HELPER: Descrever filtros aplicados
// =========================================

export function describeFilters(filters: SearchFilters): string[] {
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
  
  return descriptions
}
