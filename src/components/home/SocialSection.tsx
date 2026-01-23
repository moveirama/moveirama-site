// ============================================
// SocialSection - Prova Social
// ============================================
// Squad Dev - Janeiro 2026
// Depoimentos e avaliações de clientes
// ============================================

import { Star, Quote } from 'lucide-react';

const depoimentos = [
  {
    nome: 'Mariana S.',
    cidade: 'Curitiba - Boqueirão',
    texto: 'Rack chegou em 2 dias, muito bem embalado. Montei sozinha seguindo o vídeo. Ficou lindo na sala!',
    rating: 5,
    produto: 'Rack Cronos',
  },
  {
    nome: 'Carlos R.',
    cidade: 'São José dos Pinhais',
    texto: 'Atendimento pelo WhatsApp muito rápido. Me ajudaram a escolher o painel certo pro tamanho da minha TV.',
    rating: 5,
    produto: 'Painel Âmbar',
  },
  {
    nome: 'Fernanda L.',
    cidade: 'Colombo',
    texto: 'Escrivaninha perfeita pro meu home office. Coube certinho no cantinho do quarto. Recomendo!',
    rating: 5,
    produto: 'Escrivaninha Office Plus',
  },
];

export default function SocialSection() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-2">
            O que nossos clientes dizem
          </h2>
          <p className="text-[#8B7355]">
            Avaliações reais de quem já comprou
          </p>
        </div>

        {/* Rating geral */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-6 h-6 fill-[#D4A574] text-[#D4A574]"
              />
            ))}
          </div>
          <span className="text-2xl font-bold text-[#2D2D2D]">4.8</span>
          <span className="text-[#8B7355]">• 127 avaliações</span>
        </div>

        {/* Depoimentos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {depoimentos.map((depoimento, index) => (
            <div
              key={index}
              className="bg-[#FAF7F4] rounded-xl p-6 relative"
            >
              {/* Aspas decorativas */}
              <Quote className="w-8 h-8 text-[#6B8E7A]/20 absolute top-4 right-4" />

              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= depoimento.rating
                        ? 'fill-[#D4A574] text-[#D4A574]'
                        : 'text-[#E8DFD5]'
                    }`}
                  />
                ))}
              </div>

              {/* Texto */}
              <p className="text-[#5C4D3C] mb-4 leading-relaxed">
                "{depoimento.texto}"
              </p>

              {/* Autor */}
              <div className="border-t border-[#E8DFD5] pt-4">
                <p className="font-medium text-[#2D2D2D]">
                  {depoimento.nome}
                </p>
                <p className="text-sm text-[#8B7355]">
                  {depoimento.cidade}
                </p>
                <p className="text-xs text-[#6B8E7A] mt-1">
                  Comprou: {depoimento.produto}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
