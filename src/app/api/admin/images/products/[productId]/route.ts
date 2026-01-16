// ============================================
// Moveirama — API: Imagens de um Produto
// GET /api/admin/images/products/[productId]
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ProductImage } from '@/types/images';

// Função para criar cliente Supabase
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface ProductWithImages {
  id: string;
  sku: string;
  slug: string;
  name: string;
  images: ProductImage[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
): Promise<NextResponse<ProductWithImages | { error: string }>> {
  const supabase = getSupabase();
  
  try {
    const { productId } = await params;

    if (!productId) {
      return NextResponse.json(
        { error: 'ID do produto é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar produto com imagens
    const { data: product, error: productError } = await supabase
      .from('products')
      .select(`
        id,
        sku,
        slug,
        name,
        product_images (
          id,
          product_id,
          url,
          alt_text,
          position,
          is_primary,
          filename_original,
          filename_seo,
          width,
          height,
          file_size,
          format,
          urls,
          created_at,
          updated_at
        )
      `)
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Ordenar imagens por posição
    const images = (product.product_images as ProductImage[])
      .sort((a, b) => a.position - b.position);

    return NextResponse.json({
      id: product.id,
      sku: product.sku,
      slug: product.slug,
      name: product.name,
      images,
    });

  } catch (error) {
    console.error('Erro ao buscar imagens:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
