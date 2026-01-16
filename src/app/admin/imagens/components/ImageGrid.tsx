'use client';

// ============================================
// Moveirama — ImageGrid Component
// Grid de imagens com drag & drop para ordenar
// ============================================

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImageGridProps, ProductImage } from '@/types/images';

// Componente de item sortable
function SortableImageItem({
  image,
  onDelete,
  isDeleting,
}: {
  image: ProductImage;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const imageUrl = image.urls?.thumb || image.url;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative aspect-square rounded-lg overflow-hidden bg-[#F0E8DF]
        ${isDragging ? 'z-50 shadow-xl ring-2 ring-[#6B8E7A]' : ''}
        group
      `}
    >
      {/* Imagem */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={image.alt_text}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Handle de drag */}
      <div
        {...attributes}
        {...listeners}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
      />

      {/* Badge de posição */}
      <div
        className={`
          absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
          ${image.is_primary ? 'bg-[#6B8E7A] text-white' : 'bg-black/50 text-white'}
        `}
      >
        {image.position}
      </div>

      {/* Badge de principal */}
      {image.is_primary && (
        <div className="absolute top-2 left-10 px-2 py-0.5 bg-[#6B8E7A] text-white text-xs rounded">
          Principal
        </div>
      )}

      {/* Botão de excluir */}
      {!showDeleteConfirm ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteConfirm(true);
          }}
          className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
          disabled={isDeleting}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      ) : (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-2 gap-2">
          <p className="text-white text-xs text-center">Excluir imagem?</p>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(false);
              }}
              className="px-2 py-1 bg-white/20 text-white text-xs rounded hover:bg-white/30"
            >
              Não
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(image.id);
              }}
              className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? '...' : 'Sim'}
            </button>
          </div>
        </div>
      )}

      {/* Info no hover */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-xs truncate">{image.filename_seo || 'imagem.webp'}</p>
        {image.width && image.height && (
          <p className="text-white/70 text-xs">{image.width}×{image.height}</p>
        )}
      </div>
    </div>
  );
}

export function ImageGrid({
  images: initialImages,
  onReorder,
  onDelete,
  isLoading = false,
}: ImageGridProps) {
  const [images, setImages] = useState(initialImages);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sensores para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Mínimo de 8px para iniciar drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handler de fim de drag
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);

      const newOrder = arrayMove(images, oldIndex, newIndex);
      setImages(newOrder);

      // Salvar nova ordem
      setIsSaving(true);
      try {
        await onReorder(newOrder.map((img) => img.id));
      } catch (error) {
        console.error('Erro ao reordenar:', error);
        // Reverter em caso de erro
        setImages(initialImages);
      }
      setIsSaving(false);
    }
  };

  // Handler de exclusão
  const handleDelete = async (imageId: string) => {
    setDeletingId(imageId);
    try {
      await onDelete(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
    setDeletingId(null);
  };

  // Atualizar quando props mudar
  if (initialImages !== images && !isSaving) {
    setImages(initialImages);
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="aspect-square rounded-lg bg-[#E8DFD5] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-[#8B7355]">
        <svg
          className="mx-auto h-12 w-12 mb-2"
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
        <p>Nenhuma imagem cadastrada</p>
        <p className="text-sm">Use o botão acima para adicionar</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Dica */}
      <p className="text-sm text-[#8B7355]">
        💡 Arraste para reordenar. A primeira imagem será a principal (usada no Google Shopping).
      </p>

      {/* Indicador de salvando */}
      {isSaving && (
        <div className="flex items-center gap-2 text-sm text-[#6B8E7A]">
          <div className="w-4 h-4 border-2 border-[#6B8E7A] border-t-transparent rounded-full animate-spin" />
          Salvando ordem...
        </div>
      )}

      {/* Grid com drag & drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image) => (
              <SortableImageItem
                key={image.id}
                image={image}
                onDelete={handleDelete}
                isDeleting={deletingId === image.id}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
