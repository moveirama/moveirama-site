// ============================================
// Moveirama — SEO Utils para Imagens
// Geração de nomes e alt text otimizados
// ============================================

/**
 * Remove acentos e caracteres especiais de uma string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-') // Substitui não-alfanuméricos por hífen
    .replace(/^-+|-+$/g, '') // Remove hífens no início/fim
    .replace(/-+/g, '-'); // Remove hífens duplicados
}

/**
 * Gera o nome do arquivo SEO-friendly
 * 
 * @param productSlug - Slug do produto (ex: "rack-theo-artely")
 * @param position - Posição da imagem (1, 2, 3...)
 * @param variant - Variante do tamanho (undefined para original)
 * @returns Nome do arquivo (ex: "rack-theo-artely-01.webp")
 */
export function generateImageFilename(
  productSlug: string,
  position: number,
  variant?: 'display' | 'thumb' | 'og'
): string {
  const paddedPosition = position.toString().padStart(2, '0');
  const suffix = variant ? `-${variant}` : '';
  
  return `${productSlug}-${paddedPosition}${suffix}.webp`;
}

/**
 * Gera os nomes de todos os arquivos para uma imagem
 */
export function generateAllFilenames(
  productSlug: string,
  position: number
): {
  original: string;
  display: string;
  thumb: string;
  og: string;
} {
  return {
    original: generateImageFilename(productSlug, position),
    display: generateImageFilename(productSlug, position, 'display'),
    thumb: generateImageFilename(productSlug, position, 'thumb'),
    og: generateImageFilename(productSlug, position, 'og'),
  };
}

/**
 * Gera o alt text otimizado para SEO
 * 
 * @param productName - Nome do produto (ex: "Rack Théo Artely")
 * @param position - Posição da imagem
 * @param context - Contexto adicional opcional
 * @returns Alt text (ex: "Rack Théo Artely - Imagem 1")
 */
export function generateAltText(
  productName: string,
  position: number,
  context?: string
): string {
  const base = productName.trim();
  
  if (context) {
    return `${base} - ${context}`;
  }
  
  // Para posição 1, não adiciona número (é a principal)
  if (position === 1) {
    return base;
  }
  
  return `${base} - Imagem ${position}`;
}

/**
 * Gera alt text contextualizado baseado na posição
 * Útil para SEO mais rico
 */
export function generateContextualAltText(
  productName: string,
  position: number,
  totalImages: number
): string {
  const base = productName.trim();
  
  // Contextos comuns para móveis
  const contexts: Record<number, string> = {
    1: '', // Principal, sem contexto
    2: 'Vista lateral',
    3: 'Detalhe do acabamento',
    4: 'Vista traseira',
    5: 'Dimensões',
  };
  
  const context = contexts[position];
  
  if (context) {
    return `${base} - ${context}`;
  }
  
  // Para imagens além da 5ª
  return `${base} - Imagem ${position} de ${totalImages}`;
}

/**
 * Gera o caminho completo no storage
 * 
 * @param productSlug - Slug do produto
 * @param filename - Nome do arquivo
 * @returns Caminho no bucket (ex: "products/rack-theo-artely/rack-theo-artely-01.webp")
 */
export function generateStoragePath(
  productSlug: string,
  filename: string
): string {
  return `products/${productSlug}/${filename}`;
}

/**
 * Gera todos os caminhos de storage para uma imagem
 */
export function generateAllStoragePaths(
  productSlug: string,
  position: number
): {
  original: string;
  display: string;
  thumb: string;
  og: string;
} {
  const filenames = generateAllFilenames(productSlug, position);
  
  return {
    original: generateStoragePath(productSlug, filenames.original),
    display: generateStoragePath(productSlug, filenames.display),
    thumb: generateStoragePath(productSlug, filenames.thumb),
    og: generateStoragePath(productSlug, filenames.og),
  };
}

/**
 * Extrai informações do nome de arquivo
 */
export function parseImageFilename(filename: string): {
  slug: string;
  position: number;
  variant: string | null;
} | null {
  // Padrão: {slug}-{position}[-variant].webp
  const match = filename.match(/^(.+)-(\d{2})(?:-(display|thumb|og))?\.webp$/);
  
  if (!match) {
    return null;
  }
  
  return {
    slug: match[1],
    position: parseInt(match[2], 10),
    variant: match[3] || null,
  };
}

/**
 * Valida se um slug é válido para uso em URLs
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Gera título para Open Graph baseado no produto
 */
export function generateOGTitle(productName: string): string {
  return `${productName} | Moveirama`;
}

/**
 * Gera descrição para Open Graph
 */
export function generateOGDescription(
  productName: string,
  price?: number
): string {
  if (price) {
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
    
    return `${productName} por ${formattedPrice}. Entrega rápida em Curitiba e região. Confira!`;
  }
  
  return `${productName}. Entrega rápida em Curitiba e região. Confira as condições!`;
}
