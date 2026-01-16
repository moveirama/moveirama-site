'use client';

// ============================================
// Moveirama — ImageUploader Component
// Upload com drag & drop e preview
// ============================================

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageUploaderProps, UploadState, DEFAULT_IMAGE_CONFIG } from '@/types/images';

export function ImageUploader({
  productId,
  productSlug,
  productName,
  onUploadComplete,
  maxFiles = 10,
}: ImageUploaderProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    files: [],
  });

  // Handler para quando arquivos são dropados/selecionados
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Limitar quantidade
    const filesToAdd = acceptedFiles.slice(0, maxFiles - uploadState.files.length);

    // Criar previews
    const newFiles = filesToAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending' as const,
    }));

    setUploadState((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles],
    }));
  }, [maxFiles, uploadState.files.length]);

  // Configuração do dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: DEFAULT_IMAGE_CONFIG.maxFileSize,
    maxFiles: maxFiles - uploadState.files.length,
    disabled: uploadState.isUploading,
  });

  // Remover arquivo da lista
  const removeFile = (index: number) => {
    setUploadState((prev) => {
      const newFiles = [...prev.files];
      // Revogar URL do preview
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return { ...prev, files: newFiles };
    });
  };

  // Fazer upload
  const handleUpload = async () => {
    if (uploadState.files.length === 0) return;

    setUploadState((prev) => ({ ...prev, isUploading: true, progress: 0 }));

    const formData = new FormData();
    formData.append('productId', productId);

    uploadState.files.forEach((f) => {
      formData.append('files', f.file);
    });

    try {
      const response = await fetch('/api/admin/images/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.images) {
        // Limpar previews
        uploadState.files.forEach((f) => URL.revokeObjectURL(f.preview));

        // Notificar componente pai
        onUploadComplete(result.images);

        // Limpar estado
        setUploadState({
          isUploading: false,
          progress: 100,
          files: [],
        });
      } else {
        // Marcar arquivos com erro
        setUploadState((prev) => ({
          ...prev,
          isUploading: false,
          files: prev.files.map((f, i) => ({
            ...f,
            status: 'error' as const,
            error: result.errors?.[i] || 'Erro no upload',
          })),
        }));
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      setUploadState((prev) => ({
        ...prev,
        isUploading: false,
        files: prev.files.map((f) => ({
          ...f,
          status: 'error' as const,
          error: 'Erro de conexão',
        })),
      }));
    }
  };

  // Limpar tudo
  const clearAll = () => {
    uploadState.files.forEach((f) => URL.revokeObjectURL(f.preview));
    setUploadState({
      isUploading: false,
      progress: 0,
      files: [],
    });
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive 
            ? 'border-[#6B8E7A] bg-[#6B8E7A]/5' 
            : 'border-[#E8DFD5] hover:border-[#6B8E7A]/50'
          }
          ${uploadState.isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-[#8B7355]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          
          {isDragActive ? (
            <p className="text-[#6B8E7A] font-medium">Solte as imagens aqui...</p>
          ) : (
            <>
              <p className="text-[#2D2D2D]">
                <span className="font-medium">Arraste imagens</span> ou clique para selecionar
              </p>
              <p className="text-sm text-[#8B7355]">
                JPG, PNG ou WebP • Máximo 10MB cada • Até {maxFiles} imagens
              </p>
            </>
          )}
        </div>
      </div>

      {/* Preview dos arquivos */}
      {uploadState.files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-[#2D2D2D]">
              {uploadState.files.length} {uploadState.files.length === 1 ? 'imagem' : 'imagens'} selecionadas
            </h4>
            <button
              onClick={clearAll}
              className="text-sm text-[#8B7355] hover:text-[#2D2D2D]"
              disabled={uploadState.isUploading}
            >
              Limpar tudo
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {uploadState.files.map((file, index) => (
              <div
                key={`${file.file.name}-${index}`}
                className="relative group aspect-square rounded-lg overflow-hidden bg-[#F0E8DF]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay com status */}
                {file.status === 'error' && (
                  <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center p-2">
                    <p className="text-white text-xs text-center">{file.error}</p>
                  </div>
                )}
                
                {file.status === 'uploading' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {/* Botão remover */}
                {!uploadState.isUploading && (
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {/* Número da posição */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 rounded text-white text-xs">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Barra de progresso */}
          {uploadState.isUploading && (
            <div className="w-full bg-[#E8DFD5] rounded-full h-2">
              <div
                className="bg-[#6B8E7A] h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadState.progress}%` }}
              />
            </div>
          )}

          {/* Botão de upload */}
          <div className="flex justify-end gap-3">
            <button
              onClick={clearAll}
              className="px-4 py-2 border border-[#E8DFD5] rounded-lg text-[#8B7355] hover:bg-[#F0E8DF] transition-colors"
              disabled={uploadState.isUploading}
            >
              Cancelar
            </button>
            <button
              onClick={handleUpload}
              disabled={uploadState.isUploading || uploadState.files.length === 0}
              className="px-6 py-2 bg-[#6B8E7A] text-white rounded-lg hover:bg-[#5A7A68] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadState.isUploading ? 'Enviando...' : 'Enviar imagens'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
