// ============================================
// FeaturedProducts - Produtos em Destaque
// ============================================
// Squad Dev - Janeiro 2026
// Exibe os produtos mais vendidos na Home
// ============================================

import Link from 'next/link';
import { Star } from 'lucide-react';

// TODO: Substituir por dados reais do Supabase
const products = [
  {
    id: '1',
    name: 'Rack Cronos para TV até 50"',
    slug: 'rack-cronos-off-white',
    category: 'racks-tv',
    price: 259.90,
    oldPrice: 319.90,
    rating: 4.8,
    reviews: 42,
    image: null,
  },
  {
    id: '2',
    name: 'Escrivaninha Office Plus',
    slug: 'escrivaninha-office-plus-branco',
    category: 'escrivaninha-home-office',
    price: 189.90,
    oldPrice: null,
    rating: 4.9,
    reviews: 38,
    image: null,
  },
  {
    id: '3',
    name: 'Painel Âmbar para TV até 65"',
    slug: 'painel-ambar-cinamomo',
    category: 'paineis-tv',
    price: 349.90,
    oldPrice: 429.90,
    rating: 4.7,
    reviews: 29,
    image: null,
  },
  {
    id: '4',
    name: 'Mesa de Centro Elegance',
    slug: 'mesa-centro-elegance-off-white',
    category: 'mesas-centro',
    price: 139.90,
    oldPrice: null,
    rating: 4.6,
    reviews: 17,
    image: null,
  },
];

function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export default function FeaturedProducts() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-2">
            Mais Vendidos em Curitiba
          </h2>
          <p className="text-[#8B7355]">
            Os móveis preferidos dos nossos clientes
          </p>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/${product.category}/${product.slug}`}
              className="group bg-[#FAF7F4] rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Imagem */}
              <div className="aspect-square bg-[#F0E8DF] relative">
                {/* Placeholder - substituir por Image quando tiver fotos */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-[#E8DFD5] rounded-lg" />
                </div>

                {/* Badge de desconto */}
                {product.oldPrice && (
                  <span className="absolute top-2 left-2 bg-[#B85C38] text-white text-xs font-bold px-2 py-1 rounded">
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-[#D4A574] text-[#D4A574]" />
                  <span className="text-sm font-medium text-[#2D2D2D]">
                    {product.rating}
                  </span>
                  <span className="text-xs text-[#8B7355]">
                    ({product.reviews})
                  </span>
                </div>

                {/* Nome */}
                <h3 className="font-medium text-[#2D2D2D] text-sm md:text-base mb-2 line-clamp-2 group-hover:text-[#6B8E7A] transition-colors">
                  {product.name}
                </h3>

                {/* Preço */}
                <div>
                  {product.oldPrice && (
                    <span className="text-sm text-[#B8A99A] line-through block">
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                  <span className="text-lg font-bold text-[#2D2D2D]">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs text-[#8B7355] block">
                    ou 5x de {formatPrice(product.price / 5)} sem juros
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Ver todos */}
        <div className="text-center mt-10">
          <Link
            href="/moveis-para-casa"
            className="inline-flex items-center justify-center bg-[#6B8E7A] hover:bg-[#5A7A68] text-white font-semibold px-8 py-3 rounded-lg transition-colors min-h-[48px]"
          >
            Ver Todos os Produtos
          </Link>
        </div>
      </div>
    </section>
  );
}
