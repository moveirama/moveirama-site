// ============================================
// CoberturaSection - Área de Cobertura
// ============================================
// Squad Dev - Janeiro 2026
// Mostra as cidades atendidas
// ============================================

import { MapPin, Truck } from 'lucide-react';

const cidades = [
  { nome: 'Curitiba', destaque: true },
  { nome: 'Colombo', destaque: false },
  { nome: 'São José dos Pinhais', destaque: false },
  { nome: 'Araucária', destaque: false },
  { nome: 'Pinhais', destaque: false },
  { nome: 'Fazenda Rio Grande', destaque: false },
  { nome: 'Almirante Tamandaré', destaque: false },
  { nome: 'Piraquara', destaque: false },
  { nome: 'Campo Largo', destaque: false },
  { nome: 'Quatro Barras', destaque: false },
];

export default function CoberturaSection() {
  return (
    <section className="py-12 md:py-16 bg-[#2D2D2D]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#6B8E7A]/20 rounded-full mb-4">
              <Truck className="w-7 h-7 text-[#6B8E7A]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Entregamos em Curitiba e Região
            </h2>
            <p className="text-[#B8A99A]">
              Frota própria para garantir rapidez e cuidado na entrega
            </p>
          </div>

          {/* Grid de Cidades */}
          <div className="flex flex-wrap justify-center gap-3">
            {cidades.map((cidade, index) => (
              <div
                key={index}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  cidade.destaque
                    ? 'bg-[#6B8E7A] text-white'
                    : 'bg-[#3D3D3D] text-[#E8DFD5]'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">{cidade.nome}</span>
              </div>
            ))}
          </div>

          {/* Info adicional */}
          <div className="text-center mt-8">
            <p className="text-[#B8A99A] text-sm">
              Prazo de entrega: <span className="text-white font-medium">1 a 3 dias úteis</span> após confirmação do pagamento
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
