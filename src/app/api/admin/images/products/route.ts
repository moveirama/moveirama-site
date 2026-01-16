// ============================================
// Moveirama — API: Listar Produtos
// GET /api/admin/images/products
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ProductFilters, PaginatedProducts } from '@/types/images';

// Cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest): Promise<NextResponse<PaginatedProducts>> {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parsear parâmetros
    const filters: ProductFilters = {
      search: searchParams.get('search') || undefined,
      hasImages: (searchParams.get('hasImages') as 'all' | 'with' | 'without') || 'all',
      categorySlug: searchParams.get('category') || undefined,
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '20', 10),
    };

    // Limitar paginação
    filters.page = Math.max(1, filters.page!);
    filters.limit = Math.min(100, Math.max(1, filters.limit!));

    const offset = (filters.page - 1) * filters.limit;

    // Query base usando a view
    let query = supabase
      .from('v_products_image_count')
      .select('*', { count: 'exact' });

    // Filtro de busca (nome ou SKU)
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
    }

    // Filtro por categoria
    if (filters.categorySlug) {
      query = query.eq('category_slug', filters.categorySlug);
    }

    // Filtro por ter imagens
    if (filters.hasImages === 'with') {
      query = query.gt('image_count', 0);
    } else if (filters.hasImages === 'without') {
      query = query.eq('image_count', 0);
    }

    // Apenas produtos ativos
    query = query.eq('is_active', true);

    // Ordenação e paginação
    query = query
      .order('name', { ascending: true })
      .range(offset, offset + filters.limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Erro ao buscar produtos:', error);
      return NextResponse.json(
        {
          products: [],
          total: 0,
          page: filters.page,
          limit: filters.limit,
          totalPages: 0,
        },
        { status: 500 }
      );
    }

    const totalPages = Math.ceil((count || 0) / filters.limit);

    return NextResponse.json({
      products: data || [],
      total: count || 0,
      page: filters.page,
      limit: filters.limit,
      totalPages,
    });

  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    return NextResponse.json(
      {
        products: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      },
      { status: 500 }
    );
  }
}
