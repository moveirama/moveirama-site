/**
 * CTAFinal.tsx - CTA de Fechamento
 * Squad Dev - Janeiro 2026
 * 
 * SPECS: moveirama-home-mockup.jsx (linhas 1017-1077)
 * - Fundo: Sage (#6B8E7A)
 * - Título: "Pronto para renovar seu espaço?" branco
 * - Subtítulo: "Navegue pelo catálogo e receba em até 72h"
 * - Botões: Catálogo (branco) + WhatsApp (verde)
 */

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export default function CTAFinal() {
  return (
    <section className="bg-[#6B8E7A] py-14 px-5 md:py-[90px] md:px-[60px] text-center">
      {/* Título */}
      <h2 className="text-[31px] md:text-[46px] font-bold text-white mb-[14px]">
        Pronto para renovar seu espaço?
      </h2>
      <p className="text-white/90 text-[17px] md:text-[19px] mb-9">
        Navegue pelo catálogo e receba em até 72h
      </p>

      {/* Botões */}
      <div className="flex flex-col md:flex-row gap-[14px] justify-center">
        {/* Botão Catálogo */}
        <Link
          href="/moveis-para-casa"
          className="px-9 py-[18px] bg-white text-[#2D2D2D] font-semibold text-[17px] rounded-lg min-h-[52px] hover:bg-gray-100 transition-colors"
        >
          Ver Catálogo Completo
        </Link>

        {/* Botão WhatsApp */}
        <a
          href="https://wa.me/5541984209323?text=Olá! Preciso de ajuda para escolher um móvel."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-[10px] px-9 py-[18px] bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-[17px] rounded-lg min-h-[52px] transition-colors"
        >
          <MessageCircle size={22} />
          Me Ajuda a Escolher
        </a>
      </div>
    </section>
  );
}
