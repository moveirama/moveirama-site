// ============================================
// DiferenciaisSection - Diferenciais da Loja
// ============================================
// Squad Dev - Janeiro 2026
// Exibe os diferenciais da Moveirama
// ============================================

import { Truck, Clock, Wrench, MessageCircle, Shield, MapPin } from 'lucide-react';

const diferenciais = [
  {
    icon: Truck,
    title: 'Entrega Própria',
    description: 'Frota própria em Curitiba e região metropolitana. Sem terceiros, sem surpresas.',
  },
  {
    icon: Clock,
    title: 'Receba em até 72h',
    description: 'Pediu hoje? Recebe rápido. Prazo real, sem enrolação.',
  },
  {
    icon: Wrench,
    title: 'Montagem Fácil',
    description: 'Manual claro, vídeo passo a passo e suporte se travar.',
  },
  {
    icon: MessageCircle,
    title: 'Suporte no WhatsApp',
    description: 'Atendimento humano de verdade. Sem robô, sem espera.',
  },
  {
    icon: Shield,
    title: 'Compra Segura',
    description: 'Nota fiscal, garantia de fábrica e política de troca clara.',
  },
  {
    icon: MapPin,
    title: 'Somos de Curitiba',
    description: 'Conhecemos a cidade e a região. Entregamos onde outros não vão.',
  },
];

export default function DiferenciaisSection() {
  return (
    <section className="py-12 md:py-16 bg-[#FAF7F4]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-2">
            Por que comprar na Moveirama?
          </h2>
          <p className="text-[#8B7355]">
            Mais do que móveis: tranquilidade do pedido à montagem
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diferenciais.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#6B8E7A]/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#6B8E7A]" />
                </div>
                <h3 className="font-semibold text-[#2D2D2D] text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-[#8B7355] text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
