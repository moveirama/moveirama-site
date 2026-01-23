/**
 * SocialSection.tsx - Redes Sociais
 * Squad Dev - Janeiro 2026
 * 
 * SPECS: moveirama-home-mockup.jsx (linhas 920-1015)
 * - Fundo: Cream (#F0E8DF)
 * - Título: "Siga a Moveirama"
 * - Subtítulo: "Novidades, ofertas e inspirações para sua casa"
 * - Cards: Instagram e Facebook
 */

import { Instagram, Facebook } from 'lucide-react';

export default function SocialSection() {
  return (
    <section className="bg-[#F0E8DF] py-12 px-5 md:py-16 md:px-[60px] text-center">
      {/* Título */}
      <h2 className="text-[26px] md:text-[34px] font-bold text-[#2D2D2D] mb-3">
        Siga a Moveirama
      </h2>
      <p className="text-base text-[#8B7355] mb-7">
        Novidades, ofertas e inspirações para sua casa
      </p>

      {/* Cards de redes sociais */}
      <div className="flex justify-center gap-5 md:gap-8">
        {/* Instagram */}
        <a
          href="https://instagram.com/moveirama"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-[10px] px-8 py-5 bg-white rounded-2xl border border-[#E8DFD5] min-w-[140px] md:min-w-[180px] hover:shadow-md hover:border-[#6B8E7A] transition-all"
        >
          <Instagram 
            size={40} 
            className="md:w-12 md:h-12 text-[#2D2D2D]" 
            strokeWidth={1.2}
          />
          <span className="text-[#2D2D2D] font-semibold text-[15px]">
            Instagram
          </span>
          <span className="text-[#8B7355] text-[13px]">
            @moveirama
          </span>
        </a>

        {/* Facebook */}
        <a
          href="https://facebook.com/moveirama"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-[10px] px-8 py-5 bg-white rounded-2xl border border-[#E8DFD5] min-w-[140px] md:min-w-[180px] hover:shadow-md hover:border-[#6B8E7A] transition-all"
        >
          <Facebook 
            size={40} 
            className="md:w-12 md:h-12 text-[#2D2D2D]" 
            strokeWidth={1.2}
          />
          <span className="text-[#2D2D2D] font-semibold text-[15px]">
            Facebook
          </span>
          <span className="text-[#8B7355] text-[13px]">
            /moveirama
          </span>
        </a>
      </div>
    </section>
  );
}
