// ============================================
// Moveirama — API: Excluir Imagem
// DELETE /api/admin/images/[id]
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { deleteImage as deleteFromStorage } from '@/lib/images';
import { DeleteResponse } from '@/types/images';

// Cliente Supabase com service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<DeleteResponse>> {
  try {
    const { id: imageId } = await params;

    if (!imageId) {
      return NextResponse.json(
        { success: false, error: 'ID da imagem é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar imagem com dados do produto
    const { data: image, error: fetchError } = await supabase
      .from('product_images')
      .select(`
        id,
        position,
        product_id,
        products!inner (
          slug
        )
      `)
      .eq('id', imageId)
      .single();

    if (fetchError || !image) {
      return NextResponse.json(
        { success: false, error: 'Imagem não encontrada' },
        { status: 404 }
      );
    }

    const productSlug = (image.products as any).slug;

    // Excluir arquivos do storage
    const storageResult = await deleteFromStorage(productSlug, image.position);
    
    if (!storageResult.success) {
      console.error('Erro ao excluir do storage:', storageResult.error);
      // Continuar mesmo assim - pode ser que os arquivos não existam
    }

    // Excluir registro do banco
    const { error: deleteError } = await supabase
      .from('product_images')
      .delete()
      .eq('id', imageId);

    if (deleteError) {
      console.error('Erro ao excluir do banco:', deleteError);
      return NextResponse.json(
        { success: false, error: 'Erro ao excluir imagem' },
        { status: 500 }
      );
    }

    // Reordenar imagens restantes para fechar gaps
    const { data: remainingImages } = await supabase
      .from('product_images')
      .select('id')
      .eq('product_id', image.product_id)
      .order('position', { ascending: true });

    if (remainingImages && remainingImages.length > 0) {
      const imageIds = remainingImages.map(img => img.id);
      
      await supabase.rpc('reorder_product_images', {
        p_product_id: image.product_id,
        p_image_ids: imageIds,
      });
    }

    return NextResponse.json({
      success: true,
      deleted: imageId,
    });

  } catch (error) {
    console.error('Erro na exclusão:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
