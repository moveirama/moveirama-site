/**
 * CoberturaSection.tsx - Área de Cobertura
 * Squad Dev - Janeiro 2026
 * 
 * SPECS: moveirama-home-mockup.jsx (linhas 876-917)
 * - Fundo: Warm White (#FAF7F4)
 * - Título: "Entregamos em Curitiba e Região"
 * - Pills: Curitiba destacado (Sage), demais branco com borda
 * - Ícone Check em cada pill
 */

import { Check } from 'lucide-react';

const cities = [
  { name: 'Curitiba', highlight: true },
  { name: 'São José dos Pinhais', highlight: false },
  { name: 'Colombo', highlight: false },
  { name: 'Pinhais', highlight: false },
  { name: 'Araucária', highlight: false },
  { name: 'Fazenda Rio Grande', highlight: false },
  { name: 'Almirante Tamandaré', highlight: false },
  { name: 'Piraquara', highlight: false },
  { name: 'Quatro Barras', highlight: false },
  { name: 'Campina Grande do Sul', highlight: false },
];

export default function CoberturaSection() {
  return (
    <section className="bg-[#FAF7F4] py-12 px-4 md:py-[70px] md:px-[60px] text-center">
      {/* Título */}
      <h2 className="text-[26px] md:text-[36px] font-bold text-[#2D2D2D] mb-7">
        Entregamos em Curitiba e Região
      </h2>

      {/* Pills de cidades */}
      <div className="flex flex-wrap gap-3 justify-center max-w-[650px] mx-auto">
        {cities.map((city, index) => (
          <span
            key={index}
            className={`
              inline-flex items-center gap-[6px] px-4 py-[10px] rounded-[20px] text-sm
              ${city.highlight 
                ? 'bg-[#6B8E7A] text-white font-semibold' 
                : 'bg-white text-[#2D2D2D] font-medium border border-[#E8DFD5]'
              }
            `}
          >
            <Check size={16} />
            {city.name}
          </span>
        ))}
      </div>
    </section>
  );
}
