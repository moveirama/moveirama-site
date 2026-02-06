/**
 * DiferenciaisSection.tsx - Por que Moveirama?
 * Squad Dev - Janeiro 2026
 * 
 * SPECS: HANDOFF_Home_Page_Decisoes_Visuais.md v2.5
 * - Fundo: Graphite (#2D2D2D)
 * - Texto: Branco
 * - 7 diferenciais em grid 3 colunas (desktop) / 1 coluna (mobile)
 * - Box ícone: Sage sólido (#6B8E7A)
 * - Copy atualizado v2.5: "Somos de Curitiba", "3 Meses de Garantia"
 */

import { 
  Truck, 
  Wrench, 
  MessageCircle, 
  Ruler, 
  DollarSign, 
  Shield, 
  Building2 
} from 'lucide-react';

const diferenciais = [
  {
    icon: Truck,
    title: 'Frota Própria',
    description: 'Nada de transportadora. A gente mesmo entrega em Curitiba e RMC, com cuidado.',
  },
  {
    icon: Wrench,
    title: 'Montagem Sem Stress',
    description: 'Manual + ferragens + vídeo. Precisa de montador? A gente indica.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp de Verdade',
    description: 'A gente responde rápido.',
  },
  {
    icon: Ruler,
    title: 'Medidas Claras',
    description: 'Todas as medidas detalhadas. Dúvida? A gente confirma.',
  },
  {
    icon: DollarSign,
    title: 'Preço Sem Surpresa',
    description: 'O preço que você vê é o que paga. Sem taxa escondida.',
  },
  {
    icon: Shield,
    title: '3 Meses de Garantia',
    description: 'Todos os produtos com garantia de fábrica.',
  },
  {
    icon: Building2,
    title: 'Somos de Curitiba',
    description: 'Empresa local com CNPJ e nota fiscal. Nada de loja fantasma.',
  },
];

export default function DiferenciaisSection() {
  return (
    <section className="py-14 md:py-[90px] bg-[#2D2D2D]">
      <div className="container mx-auto px-5 md:px-[60px]">
        {/* Header da seção */}
        <h2 className="text-[31px] md:text-[46px] font-bold text-white text-center mb-9 md:mb-[52px]">
          Por que comprar na Moveirama?
        </h2>

        {/* Grid de diferenciais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7 max-w-[1000px] mx-auto">
          {diferenciais.map((item, index) => {
            const IconComponent = item.icon;
            
            return (
              <div
                key={index}
                className="flex items-start gap-[18px]"
              >
                {/* Box do ícone */}
                <div className="flex-shrink-0 w-[52px] h-[52px] rounded-xl bg-[#6B8E7A] flex items-center justify-center">
                  <IconComponent 
                    className="w-[26px] h-[26px] text-white" 
                    strokeWidth={1.5} 
                  />
                </div>

                {/* Texto */}
                <div>
                  <h3 className="text-[17px] font-semibold text-white mb-[6px]">
                    {item.title}
                  </h3>
                  <p className="text-[15px] text-white/75 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
