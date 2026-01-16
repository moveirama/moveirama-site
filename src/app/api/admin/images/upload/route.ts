// ============================================
// Moveirama — API: Upload de Imagens
// POST /api/admin/images/upload
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  processImage,
  validateImageFile,
  uploadProcessedImage,
  generateAltText,
  ensureBucketExists,
} from '@/lib/images';
import { DEFAULT_IMAGE_CONFIG, UploadResponse } from '@/types/images';

// Cliente Supabase com service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    // Verificar se bucket existe
    const bucketReady = await ensureBucketExists();
    if (!bucketReady) {
      return NextResponse.json(
        { success: false, errors: ['Storage não disponível'] },
        { status: 500 }
      );
    }

    // Parsear FormData
    const formData = await request.formData();
    const productId = formData.get('productId') as string;
    const files = formData.getAll('files') as File[];

    // Validações básicas
    if (!productId) {
      return NextResponse.json(
        { success: false, errors: ['productId é obrigatório'] },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, errors: ['Nenhum arquivo enviado'] },
        { status: 400 }
      );
    }

    if (files.length > 10) {
      return NextResponse.json(
        { success: false, errors: ['Máximo 10 arquivos por vez'] },
        { status: 400 }
      );
    }

    // Buscar produto para obter slug e nome
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, slug, name')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { success: false, errors: ['Produto não encontrado'] },
        { status: 404 }
      );
    }

    // Obter próxima posição disponível
    const { data: nextPositionData } = await supabase
      .rpc('get_next_image_position', { p_product_id: productId });
    
    let nextPosition = nextPositionData || 1;

    // Processar cada arquivo
    const results = [];
    const errors: string[] = [];

    for (const file of files) {
      try {
        // Validar arquivo
        const validation = validateImageFile(
          { type: file.type, size: file.size },
          DEFAULT_IMAGE_CONFIG
        );

        if (!validation.valid) {
          errors.push(`${file.name}: ${validation.error}`);
          continue;
        }

        // Converter File para Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Processar imagem (converter, redimensionar)
        const processed = await processImage(buffer, DEFAULT_IMAGE_CONFIG);

        // Upload para Supabase Storage
        const urls = await uploadProcessedImage(
          processed,
          product.slug,
          nextPosition
        );

        // Gerar alt text
        const altText = generateAltText(product.name, nextPosition);

        // Salvar no banco
        const { data: imageRecord, error: insertError } = await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            url: urls.original, // URL principal para compatibilidade
            alt_text: altText,
            position: nextPosition,
            is_primary: nextPosition === 1,
            filename_original: file.name,
            filename_seo: `${product.slug}-${nextPosition.toString().padStart(2, '0')}.webp`,
            width: processed.metadata.width,
            height: processed.metadata.height,
            file_size: processed.original.length,
            format: 'webp',
            urls: urls,
          })
          .select()
          .single();

        if (insertError) {
          errors.push(`${file.name}: Erro ao salvar no banco`);
          console.error('Erro ao inserir imagem:', insertError);
          continue;
        }

        results.push({
          id: imageRecord.id,
          urls: urls,
          alt_text: altText,
          position: nextPosition,
        });

        nextPosition++;
      } catch (fileError) {
        console.error(`Erro ao processar ${file.name}:`, fileError);
        errors.push(`${file.name}: Erro no processamento`);
      }
    }

    // Retornar resultado
    if (results.length === 0 && errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      images: results,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { success: false, errors: ['Erro interno do servidor'] },
      { status: 500 }
    );
  }
}

// Configuração para arquivos grandes
export const config = {
  api: {
    bodyParser: false,
  },
};
