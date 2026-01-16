// ============================================
// Moveirama — Types: Sistema de Imagens
// ============================================

/**
 * URLs das diferentes versões de uma imagem
 */
export interface ImageUrls {
  /** 1200×1200 - Zoom e Google Merchant Center */
  original: string;
  /** 800×800 - Página de produto */
  display: string;
  /** 400×400 - Cards e listagens */
  thumb: string;
  /** 1200×630 - Open Graph (WhatsApp, Facebook) */
  og: string;
}

/**
 * Imagem de produto no banco de dados
 */
export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string;
  position: number;
  is_primary: boolean;
  filename_original: string | null;
  filename_seo: string | null;
  width: number | null;
  height: number | null;
  file_size: number | null;
  format: string;
  urls: ImageUrls | null;
  created_at: string;
  updated_at: string;
}

/**
 * Produto com contagem de imagens (da view v_products_image_count)
 */
export interface ProductWithImageCount {
  id: string;
  sku: string;
  slug: string;
  name: string;
  is_active: boolean;
  category_name: string | null;
  category_slug: string | null;
  image_count: number;
  first_image_thumb: string | null;
}

/**
 * Dados para upload de imagem
 */
export interface ImageUploadData {
  productId: string;
  file: File;
}

/**
 * Resultado do processamento de imagem
 */
export interface ProcessedImage {
  original: Buffer;
  display: Buffer;
  thumb: Buffer;
  og: Buffer;
  metadata: {
    width: number;
    height: number;
    format: string;
  };
}

/**
 * Resultado do upload de imagem
 */
export interface UploadResult {
  success: boolean;
  image?: {
    id: string;
    urls: ImageUrls;
    alt_text: string;
    position: number;
  };
  error?: string;
}

/**
 * Request para upload de imagens
 */
export interface UploadRequest {
  productId: string;
  files: File[];
}

/**
 * Response do upload de imagens
 */
export interface UploadResponse {
  success: boolean;
  images?: Array<{
    id: string;
    urls: ImageUrls;
    alt_text: string;
    position: number;
  }>;
  errors?: string[];
}

/**
 * Request para reordenar imagens
 */
export interface ReorderRequest {
  productId: string;
  imageIds: string[];
}

/**
 * Response da reordenação
 */
export interface ReorderResponse {
  success: boolean;
  error?: string;
}

/**
 * Response da exclusão
 */
export interface DeleteResponse {
  success: boolean;
  deleted?: string;
  error?: string;
}

/**
 * Filtros para listagem de produtos
 */
export interface ProductFilters {
  search?: string;
  hasImages?: 'all' | 'with' | 'without';
  categorySlug?: string;
  page?: number;
  limit?: number;
}

/**
 * Resposta paginada de produtos
 */
export interface PaginatedProducts {
  products: ProductWithImageCount[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Configurações de processamento de imagem
 */
export interface ImageProcessingConfig {
  /** Qualidade WebP (0-100) */
  quality: number;
  /** Tamanhos a gerar */
  sizes: {
    original: { width: number; height: number };
    display: { width: number; height: number };
    thumb: { width: number; height: number };
    og: { width: number; height: number };
  };
  /** Formatos de entrada aceitos */
  acceptedFormats: string[];
  /** Tamanho máximo em bytes */
  maxFileSize: number;
}

/**
 * Configuração padrão
 */
export const DEFAULT_IMAGE_CONFIG: ImageProcessingConfig = {
  quality: 85,
  sizes: {
    original: { width: 1200, height: 1200 },
    display: { width: 800, height: 800 },
    thumb: { width: 400, height: 400 },
    og: { width: 1200, height: 630 },
  },
  acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
};

/**
 * Estado do componente de upload
 */
export interface UploadState {
  isUploading: boolean;
  progress: number;
  files: Array<{
    file: File;
    preview: string;
    status: 'pending' | 'uploading' | 'success' | 'error';
    error?: string;
  }>;
}

/**
 * Props do componente ImageUploader
 */
export interface ImageUploaderProps {
  productId: string;
  productSlug: string;
  productName: string;
  onUploadComplete: (images: ProductImage[]) => void;
  maxFiles?: number;
}

/**
 * Props do componente ImageGrid
 */
export interface ImageGridProps {
  images: ProductImage[];
  onReorder: (imageIds: string[]) => Promise<void>;
  onDelete: (imageId: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Props do componente ProductCard (no admin)
 */
export interface AdminProductCardProps {
  product: ProductWithImageCount;
  onSelect: (productId: string) => void;
  isSelected?: boolean;
}
