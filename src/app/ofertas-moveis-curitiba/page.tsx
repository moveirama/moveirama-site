/**
 * Página de Ofertas - Moveirama
 * Squad Dev - Janeiro 2026
 * 
 * ESTRUTURA:
 * - Hero com Knowledge Block (SEO/AIO)
 * - Tabela Semântica (para LLMs extraírem dados)
 * - Filtros por "dor" do cliente
 * - Grid de produtos em oferta
 * - Seção de confiança
 * 
 * ROTA: /ofertas-moveis-curitiba
 */

import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase';
import {
  OfertasHero,
  TabelaSemantica,
  OfertasFiltros,
  OfertaProductCard,
  OfertasConfianca,
} from '@/components/ofertas';
import { WhatsAppFloat } from '@/components/home';
import Pagination from '@/components/Pagination';

// ===========================================
// METADATA (SEO)
// ===========================================
export const metadata: Metadata = {
  title: 'Móveis em Oferta em Curitiba | Entrega em 72h | Moveirama',
  description:
    'Móveis em oferta com entrega rápida em Curitiba e Região Metropolitana. Racks, painéis e escrivaninhas com desconto real. Sem pegadinha.',
  keywords: [
    'móveis em oferta curitiba',
    'rack em promoção',
    'painel tv oferta',
    'escrivaninha desconto',
    'móveis baratos curitiba',
    'promoção móveis',
  ],
  openGraph: {
    title: 'Móveis em Oferta em Curitiba | Moveirama',
    description:
      'Racks, painéis e escrivaninhas com desconto real. Entrega em até 72h em Curitiba e Região.',
    url: 'https://moveirama.com.br/ofertas-moveis-curitiba',
    siteName: 'Moveirama',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://moveirama.com.br/ofertas-moveis-curitiba',
  },
};

// ===========================================
// TIPOS
// ===========================================
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  short_description: string;
  tv_max_size: number | null;
  width_cm: number | null;
  height_cm: number | null;
  depth_cm: number | null;
  for_small_spaces: boolean;
  category: { slug: string } | { slug: string }[] | null;
  product_images: { url: string; alt_text: string | null }[];
}

interface OfertasPageProps {
  searchParams: Promise<{
    filtro?: string;
    ordenar?: string;
    pagina?: string;
  }>;
}

// ===========================================
// FUNÇÕES DE DADOS
// ===========================================
async function getOfertasProducts(
  filtro: string,
  ordenar: string,
  pagina: number
): Promise<{ products: Product[]; total: number }> {
  const supabase = createClient();
  const ITEMS_PER_PAGE = 12;
  const offset = (pagina - 1) * ITEMS_PER_PAGE;

  // Query base
  let query = supabase
    .from('products')
    .select(
      `
      id,
      name,
      slug,
      price,
      compare_at_price,
      short_description,
      tv_max_size,
      width_cm,
      height_cm,
      depth_cm,
      for_small_spaces,
      category:categories(slug),
      product_images(url, alt_text)
    `,
      { count: 'exact' }
    )
    .eq('is_on_sale', true)
    .eq('is_active', true)
    .gt('compare_at_price', 0);

  // Filtros por "dor"
  if (filtro === 'sala-pequena') {
    query = query.eq('for_small_spaces', true);
  } else if (filtro === 'ate-300') {
    query = query.lte('price', 300);
  }

  // Ordenação
  if (ordenar === 'menor-preco') {
    query = query.order('price', { ascending: true });
  } else {
    // Default: maior desconto (calculado como compare_at_price - price)
    // Como não podemos ordenar por campo calculado diretamente,
    // ordenamos por compare_at_price DESC como proxy
    query = query.order('compare_at_price', { ascending: false });
  }

  // Paginação
  query = query.range(offset, offset + ITEMS_PER_PAGE - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error('Erro ao buscar ofertas:', error);
    return { products: [], total: 0 };
  }

  return {
    products: (data as Product[]) || [],
    total: count || 0,
  };
}

// Calcula o percentual de desconto
function calcularDesconto(price: number, compareAtPrice: number | null): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

// Gera schema de produto individual
function generateProductSchema(product: Product) {
  const desconto = calcularDesconto(product.price, product.compare_at_price);
  const categorySlug =
    Array.isArray(product.category)
      ? product.category[0]?.slug
      : product.category?.slug;

  return {
    '@type': 'Product',
    name: product.name,
    description: product.short_description,
    url: `https://moveirama.com.br/${categorySlug}/${product.slug}`,
    image: product.product_images[0]?.url,
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      areaServed: {
        '@type': 'City',
        name: 'Curitiba',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          businessDays: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
          },
        },
      },
    },
  };
}

// ===========================================
// COMPONENTE DA PÁGINA
// ===========================================
export default async function OfertasPage({ searchParams }: OfertasPageProps) {
  const params = await searchParams;
  const filtro = params.filtro || 'todos';
  const ordenar = params.ordenar || 'maior-desconto';
  const pagina = parseInt(params.pagina || '1', 10);

  const { products, total } = await getOfertasProducts(filtro, ordenar, pagina);
  const totalPages = Math.ceil(total / 12);

  // Calcular preços para AggregateOffer
  const precos = products.map((p) => p.price);
  const menorPreco = precos.length > 0 ? Math.min(...precos) : 0;
  const maiorPreco = precos.length > 0 ? Math.max(...precos) : 0;

  // Schema.org - ItemList com produtos
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Ofertas de Móveis em Curitiba - Moveirama',
    description:
      'Racks, painéis e escrivaninhas com preço de fábrica e entrega rápida em Curitiba e RMC.',
    numberOfItems: total,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: generateProductSchema(product),
    })),
  };

  // Schema.org - AggregateOffer
  const aggregateOfferSchema = {
    '@context': 'https://schema.org',
    '@type': 'AggregateOffer',
    lowPrice: menorPreco.toFixed(2),
    highPrice: maiorPreco.toFixed(2),
    priceCurrency: 'BRL',
    offerCount: total.toString(),
  };

  return (
    <main className="bg-[#FAF7F4] min-h-screen">
      {/* Schema.org - ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Schema.org - AggregateOffer */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateOfferSchema) }}
      />

      {/* Hero com Knowledge Block */}
      <OfertasHero />

      {/* Conteúdo Principal */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Tabela Semântica para IA */}
        <TabelaSemantica products={products} />

        {/* Filtros e Ordenação */}
        <OfertasFiltros
          filtroAtivo={filtro}
          ordenacaoAtiva={ordenar}
          totalResultados={total}
        />

        {/* Grid de Produtos */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-8">
            {products.map((product) => (
              <OfertaProductCard
                key={product.id}
                product={product}
                desconto={calcularDesconto(product.price, product.compare_at_price)}
              />
            ))}
          </div>
        ) : (
          /* Estado Vazio */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏷️</div>
            <h2 className="text-xl font-semibold text-[#2D2D2D] mb-2">
              Nenhuma oferta no momento
            </h2>
            <p className="text-[#8B7355] mb-6">
              Novas ofertas chegam toda semana. Fique de olho!
            </p>
            <a
              href="/moveis-para-casa"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#6B8E7A] text-white font-semibold rounded-lg hover:bg-[#5A7A68] transition-colors"
            >
              Ver todos os móveis
            </a>
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <Pagination
            currentPage={pagina}
            totalPages={totalPages}
            baseUrl="/ofertas-moveis-curitiba"
            searchParams={{ filtro, ordenar }}
          />
        )}

        {/* Seção Confiança */}
        <OfertasConfianca />
      </div>

      {/* WhatsApp Flutuante */}
      <WhatsAppFloat />
    </main>
  );
}

