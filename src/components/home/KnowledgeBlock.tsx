// ============================================
// KnowledgeBlock - Bloco de Conhecimento
// ============================================
// Squad Dev - Janeiro 2026
// Ajuda o cliente a escolher o móvel certo
// ============================================

import Link from 'next/link';
import { Tv, Ruler, HelpCircle, ArrowRight } from 'lucide-react';

const guides = [
  {
    icon: Tv,
    title: 'Qual rack para minha TV?',
    description: 'Descubra o tamanho ideal baseado nas polegadas da sua TV.',
    href: '/guias/como-escolher-rack-tv',
    cta: 'Ver guia',
  },
  {
    icon: Ruler,
    title: 'Como medir o espaço?',
    description: 'Passo a passo para não errar nas medidas antes de comprar.',
    href: '/guias/como-medir-espaco',
    cta: 'Ver guia',
  },
  {
    icon: HelpCircle,
    title: 'MDP ou MDF?',
    description: 'Entenda a diferença entre os materiais e qual escolher.',
    href: '/guias/mdp-vs-mdf',
    cta: 'Ver guia',
  },
];

export default function KnowledgeBlock() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-2">
            Precisa de ajuda para escolher?
          </h2>
          <p className="text-[#8B7355]">
            Guias práticos para você acertar na compra
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide, index) => {
            const Icon = guide.icon;
            return (
              <Link
                key={index}
                href={guide.href}
                className="group bg-[#FAF7F4] rounded-xl p-6 hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-[#6B8E7A]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#6B8E7A]/20 transition-colors">
                  <Icon className="w-6 h-6 text-[#6B8E7A]" />
                </div>
                <h3 className="font-semibold text-[#2D2D2D] text-lg mb-2 group-hover:text-[#6B8E7A] transition-colors">
                  {guide.title}
                </h3>
                <p className="text-[#8B7355] text-sm mb-4">
                  {guide.description}
                </p>
                <span className="inline-flex items-center gap-1 text-[#6B8E7A] font-medium text-sm group-hover:gap-2 transition-all">
                  {guide.cta}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* CTA WhatsApp */}
        <div className="text-center mt-10 p-6 bg-[#F0E8DF] rounded-xl">
          <p className="text-[#2D2D2D] font-medium mb-3">
            Ainda com dúvida? A gente te ajuda!
          </p>
          
            href="https://wa.me/5541984209323?text=Oi!%20Preciso%20de%20ajuda%20para%20escolher%20um%20móvel"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold px-6 py-3 rounded-lg transition-colors min-h-[48px]"
          >
            <MessageCircleIcon className="w-5 h-5" />
            Chamar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

// Ícone do WhatsApp
function MessageCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
