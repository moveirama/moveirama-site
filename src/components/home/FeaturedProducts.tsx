/**
 * FeaturedProducts.tsx - Produtos em Destaque
 * Squad Dev - Janeiro 2026
 * 
 * SPECS: HANDOFF_Home_Page_Decisoes_Visuais.md v2.5
 * - Título: "Novidades no catálogo"
 * - Link "Ver todos": cor Terracota (#B85C38)
 * - Fundo: branco (#fff)
 * - Grid: 4 colunas desktop, 2 mobile
 */

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Tipo que reflete o retorno real do Supabase (category como array)
interface ProductFromDB {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  category: { slug: string }[];
  product_images: { cloudinary_path: string; alt_text: string | null }[];
}

// Tipo normalizado para uso no componente
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  categorySlug: string | null;
  mainImage: { cloudinary_path: string; alt_text: string | null } | null;
}

function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatInstallment(price: number): string {
  const installment = price / 5;
  return `5x ${installment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      compare_at_price,
      category:categories(slug),
      product_images(cloudinary_path, alt_text)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Erro ao buscar produtos em destaque:', error);
    return [];
  }

  if (!data) return [];

  // Normaliza os dados do Supabase
  return (data as ProductFromDB[]).map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    price: item.price,
    compare_at_price: item.compare_at_price,
    categorySlug: item.category?.[0]?.slug || null,
    mainImage: item.product_images?.[0] || null,
  }));
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  // Se não houver produtos em destaque, não renderiza a seção
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-[70px] bg-white">
      <div className="container mx-auto px-4 md:px-[60px] max-w-[1160px]">
        {/* Header da seção */}
        <div className="flex justify-between items-center mb-7 md:mb-9">
          <h2 className="text-[26px] md:text-[36px] font-bold text-[#2D2D2D]">
            Novidades no catálogo
          </h2>
          <Link
            href="/moveis-para-casa"
            className="hidden md:flex items-center gap-1 text-[15px] font-semibold text-[#B85C38] hover:text-[#9A4D30] transition-colors"
          >
            Ver todos
            <ChevronRight className="w-[18px] h-[18px]" />
          </Link>
        </div>

        {/* Grid de produtos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px] md:gap-[22px]">
          {products.map((product) => {
            const productUrl = `/${product.categorySlug || 'produtos'}/${product.slug}`;

            return (
              <Link
                key={product.id}
                href={productUrl}
                className="group bg-[#FAF7F4] rounded-xl overflow-hidden border border-[#E8DFD5] hover:shadow-md transition-all"
              >
                {/* Imagem */}
                <div className="relative aspect-square bg-[#F0E8DF] flex items-center justify-center">
                  {product.mainImage ? (
                    <Image
                      src={product.mainImage.cloudinary_path}
                      alt={product.mainImage.alt_text || product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <span className="text-5xl opacity-30">📷</span>
                  )}
                </div>

                {/* Info do produto */}
                <div className="p-[14px] md:p-[18px]">
                  <p className="text-[15px] md:text-base font-medium text-[#2D2D2D] mb-[10px] leading-[1.4] line-clamp-2">
                    {product.name}
                  </p>
                  <p className="text-xl md:text-[22px] font-bold text-[#2D2D2D] mb-[6px]">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-sm text-[#8B7355]">
                    ou {formatInstallment(product.price)} sem juros
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Ver mais (mobile only) */}
        <Link
          href="/moveis-para-casa"
          className="md:hidden flex items-center justify-center w-full mt-7 py-4 text-[#B85C38] font-semibold text-base border-2 border-[#B85C38] rounded-lg hover:bg-[#B85C38] hover:text-white transition-colors"
        >
          Ver mais produtos
        </Link>
      </div>
    </section>
  );
}