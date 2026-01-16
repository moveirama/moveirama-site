// ============================================
// Moveirama — Image Processor (Sharp)
// Converte e redimensiona imagens
// ============================================

import sharp from 'sharp';
import { 
  ProcessedImage, 
  ImageProcessingConfig, 
  DEFAULT_IMAGE_CONFIG 
} from '@/types/images';

/**
 * Processa uma imagem: converte para WebP e gera múltiplos tamanhos
 */
export async function processImage(
  buffer: Buffer,
  config: ImageProcessingConfig = DEFAULT_IMAGE_CONFIG
): Promise<ProcessedImage> {
  // Obter metadados da imagem original
  const metadata = await sharp(buffer).metadata();
  
  if (!metadata.width || !metadata.height) {
    throw new Error('Não foi possível ler as dimensões da imagem');
  }

  // Processar cada tamanho em paralelo
  const [original, display, thumb, og] = await Promise.all([
    // Original (1200×1200) - mantém aspect ratio, fit dentro do quadrado
    sharp(buffer)
      .resize(config.sizes.original.width, config.sizes.original.height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: config.quality })
      .toBuffer(),

    // Display (800×800) - para página de produto
    sharp(buffer)
      .resize(config.sizes.display.width, config.sizes.display.height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: config.quality })
      .toBuffer(),

    // Thumbnail (400×400) - para cards
    sharp(buffer)
      .resize(config.sizes.thumb.width, config.sizes.thumb.height, {
        fit: 'cover', // Cover para garantir preenchimento
        position: 'center',
      })
      .webp({ quality: config.quality - 5 }) // Qualidade um pouco menor para thumbs
      .toBuffer(),

    // Open Graph (1200×630) - para WhatsApp/Facebook
    sharp(buffer)
      .resize(config.sizes.og.width, config.sizes.og.height, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: config.quality })
      .toBuffer(),
  ]);

  return {
    original,
    display,
    thumb,
    og,
    metadata: {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format || 'unknown',
    },
  };
}

/**
 * Valida se o arquivo é uma imagem aceita
 */
export function validateImageFile(
  file: { type: string; size: number },
  config: ImageProcessingConfig = DEFAULT_IMAGE_CONFIG
): { valid: boolean; error?: string } {
  // Verificar formato
  if (!config.acceptedFormats.includes(file.type)) {
    return {
      valid: false,
      error: `Formato não aceito. Use: ${config.acceptedFormats.map(f => f.replace('image/', '')).join(', ')}`,
    };
  }

  // Verificar tamanho
  if (file.size > config.maxFileSize) {
    const maxMB = config.maxFileSize / (1024 * 1024);
    return {
      valid: false,
      error: `Arquivo muito grande. Máximo: ${maxMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Obtém dimensões de uma imagem
 */
export async function getImageDimensions(
  buffer: Buffer
): Promise<{ width: number; height: number }> {
  const metadata = await sharp(buffer).metadata();
  
  if (!metadata.width || !metadata.height) {
    throw new Error('Não foi possível ler as dimensões da imagem');
  }

  return {
    width: metadata.width,
    height: metadata.height,
  };
}

/**
 * Remove metadados EXIF da imagem (privacidade)
 */
export async function stripExifData(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .rotate() // Aplica rotação EXIF se houver, depois remove
    .toBuffer();
}

/**
 * Verifica se a imagem atende requisitos mínimos do Google Merchant Center
 */
export async function validateForGMC(
  buffer: Buffer
): Promise<{ valid: boolean; warnings: string[] }> {
  const metadata = await sharp(buffer).metadata();
  const warnings: string[] = [];

  if (!metadata.width || !metadata.height) {
    return { valid: false, warnings: ['Não foi possível ler as dimensões'] };
  }

  // GMC recomenda 800×800 mínimo
  if (metadata.width < 800 || metadata.height < 800) {
    warnings.push(
      `Imagem pequena (${metadata.width}×${metadata.height}). Recomendado: 800×800 mínimo para Google Shopping.`
    );
  }

  // GMC aceita no mínimo 100×100
  if (metadata.width < 100 || metadata.height < 100) {
    return { 
      valid: false, 
      warnings: ['Imagem muito pequena. Mínimo: 100×100 pixels.'] 
    };
  }

  return { valid: true, warnings };
}
