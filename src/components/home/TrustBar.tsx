
// ============================================
// TRUST BAR - Barra de Confiança
// ============================================
// Squad Dev - Janeiro 2026
// 4 pilares: Entrega, Montagem, Segurança, Suporte
// ============================================

import { Truck, Wrench, Shield, MessageCircle } from 'lucide-react';

const trustItems = [
  {
    icon: Truck,
    title: 'Entrega em até 72h',
    subtitle: 'Frota própria em Curitiba',
  },
  {
    icon: Wrench,
    title: 'Montagem Fácil',
    subtitle: 'Manual + Vídeo • Indicamos montador',
  },
  {
    icon: Shield,
    title: 'Compra Segura',
    subtitle: 'Nota Fiscal + Garantia',
  },
  {
    icon: MessageCircle,
    title: 'Suporte Humano',
    subtitle: 'WhatsApp de verdade',
  },
];

export default function TrustBar() {
  return (
    <section className="bg-white border-b border-[#E8DFD5]">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {trustItems.map((item, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center gap-3"
            >
              {/* Ícone com fundo */}
              <div className="w-12 h-12 rounded-xl bg-[#6B8E7A]/10 flex items-center justify-center">
                <item.icon className="w-6 h-6 text-[#8B7355]" strokeWidth={1.5} />
              </div>
              
              {/* Texto */}
              <div>
                <h3 className="text-[14px] md:text-[15px] font-semibold text-[#2D2D2D] leading-tight">
                  {item.title}
                </h3>
                <p className="text-[12px] md:text-[13px] text-[#8B7355] mt-1 leading-snug">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
