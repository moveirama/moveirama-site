// ============================================
// CATEGORIES SECTION - Categorias Principais
// ============================================
// Squad Dev - Janeiro 2026
// Cards com fotos cut-out de produtos reais
// ============================================

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

const categories = [
  {
    title: 'Móveis para Casa',
    slug: '/moveis-para-casa',
    image: '/images/categories/categoria-moveis-casa-moveirama.png',
    imageAlt: 'Rack para TV - Móveis para Casa Moveirama',
    tags: ['Racks para TV', 'Painéis', 'Mesas de Centro', 'Penteadeiras'],
  },
  {
    title: 'Móveis para Escritório',
    slug: '/moveis-para-escritorio',
    image: '/images/categories/categoria-moveis-escritorio-moveirama.png',
    imageAlt: 'Escrivaninha - Móveis para Escritório Moveirama',
    tags: ['Escrivaninhas', 'Mesas de Reunião', 'Gaveteiros', 'Armários'],
  },
];

export default function CategoriesSection() {
  return (
    <section className="bg-[#FAF7F4] py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* Título da seção */}
        <h2 className="text-[29px] md:text-[41px] font-bold text-[#2D2D2D] text-center mb-8 md:mb-12">
          O que você procura?
        </h2>

        {/* Grid de categorias */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.slug}
              className="group block"
            >
              <div 
                className="relative p-6 md:p-8 rounded-2xl border border-[#E8DFD5] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #F0E8DF 0%, rgba(232, 223, 213, 0.6) 100%)',
                }}
              >
                {/* Imagem cut-out */}
                <div className="flex justify-center mb-5">
                  <div className="w-[120px] h-[90px] md:w-[160px] md:h-[120px] relative">
                    <Image
                      src={category.image}
                      alt={category.imageAlt}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 120px, 160px"
                    />
                  </div>
                </div>

                {/* Título da categoria */}
                <h3 className="text-[22px] md:text-[26px] font-bold text-[#2D2D2D] text-center mb-4">
                  {category.title}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {category.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1.5 bg-white text-[#2D2D2D] text-[14px] font-medium rounded-full border border-[#E8DFD5]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Link "Ver todos" */}
                <div className="flex items-center justify-center text-[#B85C38] font-semibold text-[15px] group-hover:underline">
                  Ver todos
                  <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

