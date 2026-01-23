
/**
 * OfertasHero - Hero da página de ofertas
 * Squad Dev - Janeiro 2026
 * 
 * ELEMENTOS:
 * - Gradiente Terracota
 * - Breadcrumb
 * - H1 otimizado para SEO
 * - Knowledge Block (texto para IA)
 * - Badge "Inimigo Comum"
 */

import Link from 'next/link';

// Ícone Check (SVG)
const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[18px] h-[18px]"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function OfertasHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #B85C38 0%, #8B4528 100%)',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-2 text-[13px] text-white/80">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="text-white font-medium">
              Ofertas
            </li>
          </ol>
        </nav>

        {/* H1 Otimizado para SEO */}
        <h1 className="text-2xl md:text-[32px] font-bold text-white mb-4 leading-tight">
          Ofertas de Móveis em Curitiba: Receba em até 72h
        </h1>

        {/* Knowledge Block para IA */}
        <p className="text-base md:text-[16px] text-white/95 leading-relaxed max-w-[700px] mb-6">
          A Moveirama selecionou as melhores ofertas de racks, painéis e
          escrivaninhas para apartamentos compactos em bairros como CIC, Cajuru e
          Pinheirinho. Entrega própria com o menor prazo da região.
        </p>

        {/* Badge Inimigo Comum */}
        <div className="inline-flex items-center gap-2.5 px-4 py-3 bg-white/15 rounded-lg text-sm text-white">
          <span className="text-white">
            <CheckIcon />
          </span>
          <span>Preço de verdade. Sem taxa escondida de rede grande.</span>
        </div>
      </div>

      {/* Decoração sutil (círculos) */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
        style={{ background: 'white' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-5"
        style={{ background: 'white' }}
        aria-hidden="true"
      />
    </section>
  );
}
