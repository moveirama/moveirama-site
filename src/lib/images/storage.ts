// ============================================
// Moveirama — Storage Utils (Supabase)
// Upload e gerenciamento de arquivos
// ============================================

import { createClient } from '@supabase/supabase-js';
import { ImageUrls, ProcessedImage } from '@/types/images';
import { generateAllStoragePaths, generateAllFilenames } from './seo';

// Cliente Supabase com service role (para operações de escrita)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET_NAME = 'product-images';

/**
 * Faz upload de todas as versões de uma imagem processada
 */
export async function uploadProcessedImage(
  processedImage: ProcessedImage,
  productSlug: string,
  position: number
): Promise<ImageUrls> {
  const paths = generateAllStoragePaths(productSlug, position);
  const filenames = generateAllFilenames(productSlug, position);

  // Upload de todas as versões em paralelo
  const uploads = await Promise.all([
    uploadFile(paths.original, processedImage.original, 'image/webp'),
    uploadFile(paths.display, processedImage.display, 'image/webp'),
    uploadFile(paths.thumb, processedImage.thumb, 'image/webp'),
    uploadFile(paths.og, processedImage.og, 'image/webp'),
  ]);

  // Verificar se todos os uploads foram bem-sucedidos
  const failedUploads = uploads.filter(u => !u.success);
  if (failedUploads.length > 0) {
    // Limpar uploads parciais
    await cleanupPartialUpload(productSlug, position);
    throw new Error(`Falha no upload: ${failedUploads.map(u => u.error).join(', ')}`);
  }

  // Gerar URLs públicas
  return {
    original: getPublicUrl(paths.original),
    display: getPublicUrl(paths.display),
    thumb: getPublicUrl(paths.thumb),
    og: getPublicUrl(paths.og),
  };
}

/**
 * Upload de um único arquivo
 */
async function uploadFile(
  path: string,
  data: Buffer,
  contentType: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(path, data, {
      contentType,
      upsert: true, // Sobrescreve se existir
      cacheControl: '31536000', // 1 ano de cache (imagens não mudam)
    });

  if (error) {
    console.error(`Erro ao fazer upload de ${path}:`, error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Obtém URL pública de um arquivo
 */
export function getPublicUrl(path: string): string {
  const { data } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Remove todas as versões de uma imagem
 */
export async function deleteImage(
  productSlug: string,
  position: number
): Promise<{ success: boolean; error?: string }> {
  const paths = generateAllStoragePaths(productSlug, position);
  
  const filesToDelete = [
    paths.original,
    paths.display,
    paths.thumb,
    paths.og,
  ];

  const { error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .remove(filesToDelete);

  if (error) {
    console.error('Erro ao deletar imagens:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Remove upload parcial em caso de erro
 */
async function cleanupPartialUpload(
  productSlug: string,
  position: number
): Promise<void> {
  try {
    await deleteImage(productSlug, position);
  } catch (error) {
    console.error('Erro ao limpar upload parcial:', error);
  }
}

/**
 * Lista todas as imagens de um produto no storage
 */
export async function listProductImages(
  productSlug: string
): Promise<string[]> {
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .list(`products/${productSlug}`, {
      limit: 100,
      sortBy: { column: 'name', order: 'asc' },
    });

  if (error) {
    console.error('Erro ao listar imagens:', error);
    return [];
  }

  return data
    .filter(file => file.name.endsWith('.webp') && !file.name.includes('-'))
    .map(file => file.name);
}

/**
 * Verifica se o bucket existe e está acessível
 */
export async function checkBucketExists(): Promise<boolean> {
  const { data, error } = await supabaseAdmin.storage.getBucket(BUCKET_NAME);

  if (error) {
    console.error('Bucket não encontrado:', error);
    return false;
  }

  return !!data;
}

/**
 * Cria o bucket se não existir
 */
export async function ensureBucketExists(): Promise<boolean> {
  const exists = await checkBucketExists();
  
  if (exists) {
    return true;
  }

  const { error } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  });

  if (error) {
    console.error('Erro ao criar bucket:', error);
    return false;
  }

  return true;
}

/**
 * Move imagens quando um produto é renomeado (muda o slug)
 * Nota: Isso é uma operação cara, evitar se possível
 */
export async function moveProductImages(
  oldSlug: string,
  newSlug: string
): Promise<{ success: boolean; moved: number; error?: string }> {
  // Listar imagens do produto antigo
  const { data: files, error: listError } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .list(`products/${oldSlug}`);

  if (listError) {
    return { success: false, moved: 0, error: listError.message };
  }

  if (!files || files.length === 0) {
    return { success: true, moved: 0 };
  }

  let moved = 0;

  for (const file of files) {
    const oldPath = `products/${oldSlug}/${file.name}`;
    const newPath = `products/${newSlug}/${file.name.replace(oldSlug, newSlug)}`;

    const { error: moveError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .move(oldPath, newPath);

    if (moveError) {
      console.error(`Erro ao mover ${oldPath}:`, moveError);
    } else {
      moved++;
    }
  }

  return { success: true, moved };
}

/**
 * Obtém estatísticas de uso do storage
 */
export async function getStorageStats(): Promise<{
  totalFiles: number;
  totalSize: number;
}> {
  // Nota: Supabase não tem uma API direta para isso
  // Esta é uma implementação aproximada
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .list('products', {
      limit: 1000,
    });

  if (error || !data) {
    return { totalFiles: 0, totalSize: 0 };
  }

  // Para cada pasta de produto, listar arquivos
  let totalFiles = 0;
  let totalSize = 0;

  for (const folder of data) {
    if (folder.id) continue; // Pular arquivos soltos

    const { data: files } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .list(`products/${folder.name}`);

    if (files) {
      totalFiles += files.length;
      totalSize += files.reduce((acc, f) => acc + (f.metadata?.size || 0), 0);
    }
  }

  return { totalFiles, totalSize };
}
