// ============================================
// CTAFinal - Call to Action Final
// ============================================
// Squad Dev - Janeiro 2026
// CTA de fechamento da Home
// ============================================

import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';

export default function CTAFinal() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-[#6B8E7A] to-[#5A7A68]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Pronto para mobiliar sua casa?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Móveis com preço justo, entrega rápida em Curitiba e suporte humano de verdade.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/moveis-para-casa"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF7F4] text-[#6B8E7A] font-semibold px-8 py-4 rounded-lg transition-colors min-h-[48px]"
            >
              Ver Produtos
              <ArrowRight className="w-5 h-5" />
            </Link>
            
              href="https://wa.me/5541984209323?text=Oi!%20Vim%20pelo%20site%20e%20quero%20saber%20mais"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-lg border-2 border-white transition-colors min-h-[48px]"
            >
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </a>
          </div>

          {/* Trust elements */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-white/70">
            <span>✓ Entrega em até 72h</span>
            <span>✓ Nota fiscal</span>
            <span>✓ Garantia de fábrica</span>
          </div>
        </div>
      </div>
    </section>
  );
}
