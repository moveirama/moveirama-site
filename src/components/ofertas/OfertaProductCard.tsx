/**
 * OfertaProductCard - Card de produto em oferta
 * Squad Dev - 25/01/2026
 * 
 * ELEMENTOS:
 * - Badge de desconto (Terracota)
 * - Badge "Apê compacto" (Sage, se aplicável)
 * - Estrelas de avaliação
 * - Preço "de" riscado + preço "por"
 * - Parcelas em Terracota
 * - Prova social regional
 * - Prazo de entrega
 * - Botão Comprar
 * 
 * CHANGELOG:
 * - 25/01/2026: Corrigido campo de imagem (cloudinary_path em vez de url)
 */

import Link from 'next/link';
import Image from 'next/image';

// ===========================================
// ÍCONES SVG
// ===========================================

const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? '#B85C38' : 'none'}
    stroke="#B85C38"
    strokeWidth="2"
    className="w-4 h-4"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const MapPinIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const TruckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

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
  for_small_spaces: boolean;
  category: { slug: string } | { slug: string }[] | null;
  product_images: { cloudinary_path: string; alt_text: string | null }[];
}

interface OfertaProductCardProps {
  product: Product;
  desconto: number;
}

// ===========================================
// HELPERS
// ===========================================

// Formata preço para BRL
function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

// Calcula parcelas (10x sem juros)
function calcularParcelas(price: number): { parcelas: number; valor: number } {
  const maxParcelas = 10;
  const valor = price / maxParcelas;
  return { parcelas: maxParcelas, valor };
}

// Gera prova social aleatória mas consistente
function gerarProvaSocial(productId: string): {
  quantidade: number;
  bairro: string;
} {
  const bairros = [
    'CIC',
    'Cajuru',
    'Pinheirinho',
    'São José dos Pinhais',
    'Colombo',
    'Fazenda Rio Grande',
    'Araucária',
    'Boqueirão',
  ];

  // Usa o ID do produto para gerar valores consistentes
  const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const quantidade = (hash % 5) + 1; // 1-5
  const bairro = bairros[hash % bairros.length];

  return { quantidade, bairro };
}

// ===========================================
// COMPONENTE
// ===========================================

export default function OfertaProductCard({
  product,
  desconto,
}: OfertaProductCardProps) {
  const { parcelas, valor: valorParcela } = calcularParcelas(product.price);
  const provaSocial = gerarProvaSocial(product.id);

  // Pega o slug da categoria (normaliza array vs objeto)
  const categorySlug = Array.isArray(product.category)
    ? product.category[0]?.slug
    : product.category?.slug;

  // URL do produto
  const productUrl = categorySlug
    ? `/${categorySlug}/${product.slug}`
    : `/produto/${product.slug}`;

  // Imagem principal
  const imagemPrincipal = product.product_images[0];
  const imagemUrl = imagemPrincipal?.cloudinary_path || '/images/placeholder-product.jpg';
  const imagemAlt =
    imagemPrincipal?.alt_text || `${product.name} em oferta na Moveirama`;

  // Estrelas (mock - 4.5 média)
  const nota = 4.5;
  const avaliacoes = Math.floor(Math.random() * 40) + 10;

  return (
    <article
      className="
        bg-white rounded-xl overflow-hidden
        border border-[#E8DFD5]
        transition-all duration-200
        hover:shadow-lg hover:-translate-y-1
        group
      "
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* Imagem com Badges */}
      <Link href={productUrl} className="block relative aspect-square bg-[#F0E8DF]">
        <Image
          src={imagemUrl}
          alt={imagemAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badge Desconto */}
        {desconto > 0 && (
          <span className="absolute top-3 right-3 px-2.5 py-1.5 bg-[#B85C38] text-white text-sm font-bold rounded">
            -{desconto}%
          </span>
        )}

        {/* Badge Apê Compacto */}
        {product.for_small_spaces && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-[#6B8E7A] text-white text-[11px] font-semibold rounded">
            Apê compacto
          </span>
        )}
      </Link>

      {/* Conteúdo */}
      <div className="p-4">
        {/* Estrelas */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} filled={star <= Math.floor(nota)} />
            ))}
          </div>
          <span className="text-xs text-[#8B7355]">({avaliacoes})</span>
        </div>

        {/* Nome do Produto */}
        <Link href={productUrl}>
          <h3
            className="text-[15px] font-semibold text-[#2D2D2D] mb-3 line-clamp-2 hover:text-[#6B8E7A] transition-colors"
            itemProp="name"
          >
            {product.name}
          </h3>
        </Link>

        {/* Preços */}
        <div className="mb-2" itemProp="offers" itemScope itemType="https://schema.org/Offer">
          {/* Preço "de" (riscado) */}
          {product.compare_at_price && product.compare_at_price > product.price && (
            <p className="text-sm text-[#4A4A4A] line-through">
              {formatPrice(product.compare_at_price)}
            </p>
          )}

          {/* Preço "por" */}
          <p className="text-[22px] font-bold text-[#2D2D2D]" itemProp="price">
            {formatPrice(product.price)}
          </p>
          <meta itemProp="priceCurrency" content="BRL" />
          <link itemProp="availability" href="https://schema.org/InStock" />
        </div>

        {/* Parcelas */}
        <p className="text-sm font-semibold text-[#B85C38] mb-3">
          ou {parcelas}x de {formatPrice(valorParcela)}
        </p>

        {/* Prova Social Regional */}
        <div className="flex items-center gap-1.5 px-2.5 py-2 bg-[#E8F0EB] rounded-lg mb-3">
          <span className="text-[#5A7A68]">
            <MapPinIcon />
          </span>
          <span className="text-xs text-[#5A7A68]">
            {provaSocial.quantidade} entregue{provaSocial.quantidade > 1 ? 's' : ''}{' '}
            hoje em {provaSocial.bairro}
          </span>
        </div>

        {/* Prazo de Entrega */}
        <div className="flex items-center gap-1.5 text-[#8B7355] mb-4">
          <TruckIcon />
          <span className="text-[13px]">Receba em até 72h</span>
        </div>

        {/* Botão Comprar */}
        <Link
          href={productUrl}
          className="
            block w-full py-3 text-center
            bg-[#6B8E7A] text-white text-[15px] font-semibold
            rounded-lg
            hover:bg-[#5A7A68] transition-colors
            min-h-[44px]
          "
        >
          Comprar
        </Link>
      </div>
    </article>
  );
}
