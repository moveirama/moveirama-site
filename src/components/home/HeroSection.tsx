// ============================================
// HERO SECTION - Home Page Moveirama
// ============================================
// Squad Dev - Janeiro 2026
// Specs: HANDOFF_Home_Page_Decisoes_Visuais.md
// ============================================

import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function HeroSection() {
  return (
    <section 
      className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #F0E8DF 0%, #FAF7F4 50%, rgba(232, 223, 213, 0.4) 100%)',
      }}
    >
      <div className="container mx-auto px-4 md:px-6 text-center">
        {/* Badge de localização */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6B8E7A]/10 text-[#6B8E7A] text-sm font-medium mb-6">
          <MapPin className="w-4 h-4" />
          <span>Curitiba e Região Metropolitana</span>
        </div>

        {/* H1 Principal */}
        <h1 className="text-[28px] md:text-[48px] font-bold text-[#2D2D2D] leading-tight mb-4">
          Móveis para sua casa com{' '}
          <br className="hidden md:block" />
          entrega em{' '}
          <span className="text-[#B85C38]">72h</span>
        </h1>

        {/* Subtítulo */}
        <p className="text-[17px] text-[#8B7355] max-w-xl mx-auto mb-8">
          Racks, painéis, escrivaninhas e mais. Frota própria, preço justo e suporte humano no WhatsApp.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* CTA Primário - Terracota */}
          <Link
            href="/moveis-para-casa"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-[#B85C38] hover:bg-[#9A4D30] text-white font-semibold text-[17px] rounded-lg transition-colors duration-200 min-h-[48px]"
          >
            Ver Móveis para Casa
          </Link>

          {/* CTA Secundário - Outline Graphite */}
          <Link
            href="/moveis-para-escritorio"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-[#2D2D2D] text-[#2D2D2D] hover:bg-[#2D2D2D] hover:text-white font-semibold text-[17px] rounded-lg transition-colors duration-200 min-h-[48px]"
          >
            Móveis para Escritório
          </Link>
        </div>
      </div>
    </section>
  );
}

