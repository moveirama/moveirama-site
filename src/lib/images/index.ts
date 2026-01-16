// ============================================
// Moveirama — Image Library Index
// ============================================

// Processamento
export {
  processImage,
  validateImageFile,
  getImageDimensions,
  stripExifData,
  validateForGMC,
} from './processor';

// SEO
export {
  slugify,
  generateImageFilename,
  generateAllFilenames,
  generateAltText,
  generateContextualAltText,
  generateStoragePath,
  generateAllStoragePaths,
  parseImageFilename,
  isValidSlug,
  generateOGTitle,
  generateOGDescription,
} from './seo';

// Storage
export {
  uploadProcessedImage,
  getPublicUrl,
  deleteImage,
  listProductImages,
  checkBucketExists,
  ensureBucketExists,
  moveProductImages,
  getStorageStats,
} from './storage';
