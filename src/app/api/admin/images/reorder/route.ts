// ============================================
// Moveirama — API: Reordenar Imagens
// PUT /api/admin/images/reorder
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ReorderRequest, ReorderResponse } from '@/types/images';

// Cliente Supabase com service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(request: NextRequest): Promise<NextResponse<ReorderResponse>> {
  try {
    const body: ReorderRequest = await request.json();
    const { productId, imageIds } = body;

    // Validações
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'productId é obrigatório' },
        { status: 400 }
      );
    }

    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'imageIds deve ser um array não vazio' },
        { status: 400 }
      );
    }

    // Verificar se todas as imagens pertencem ao produto
    const { data: existingImages, error: fetchError } = await supabase
      .from('product_images')
      .select('id')
      .eq('product_id', productId)
      .in('id', imageIds);

    if (fetchError) {
      console.error('Erro ao verificar imagens:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Erro ao verificar imagens' },
        { status: 500 }
      );
    }

    if (!existingImages || existingImages.length !== imageIds.length) {
      return NextResponse.json(
        { success: false, error: 'Algumas imagens não pertencem a este produto' },
        { status: 400 }
      );
    }

    // Usar a função do banco para reordenar
    const { error: reorderError } = await supabase.rpc('reorder_product_images', {
      p_product_id: productId,
      p_image_ids: imageIds,
    });

    if (reorderError) {
      console.error('Erro ao reordenar:', reorderError);
      return NextResponse.json(
        { success: false, error: 'Erro ao reordenar imagens' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erro na reordenação:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
