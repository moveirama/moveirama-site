/**
 * KnowledgeBlock.tsx - Bloco de Conteúdo SEO
 * Squad Dev - Janeiro 2026
 * 
 * SPECS: HANDOFF_Home_Page_Decisoes_Visuais.md v2.5
 * - Fundo: Cream (#F0E8DF)
 * - Layout: 1 coluna centralizada, max-width 720px
 * - Texto: Toffee (#8B7355) com destaques em Graphite
 * - Conteúdo: SEO semântico para Curitiba/RMC
 */

export default function KnowledgeBlock() {
  return (
    <section className="py-14 md:py-[90px] bg-[#F0E8DF]">
      <div className="container mx-auto px-5 md:px-[60px]">
        <div className="max-w-[720px] mx-auto">
          {/* H2 SEO */}
          <h2 className="text-[29px] md:text-[36px] font-bold text-[#2D2D2D] mb-7 leading-tight">
            Móveis para Apartamentos Compactos em Curitiba
          </h2>

          {/* Conteúdo SEO */}
          <div className="text-[17px] text-[#8B7355] leading-[1.8] space-y-[18px]">
            <p>
              A Moveirama entende a realidade de quem mora em{' '}
              <strong className="text-[#2D2D2D] font-semibold">apartamento pequeno</strong>{' '}
              em Curitiba e Região Metropolitana. Por isso, trabalhamos com móveis que{' '}
              <strong className="text-[#2D2D2D] font-semibold">otimizam espaço</strong>{' '}
              sem abrir mão do design.
            </p>

            <p>
              Nossos racks comportam TVs de{' '}
              <strong className="text-[#2D2D2D] font-semibold">43 a 65 polegadas</strong>.{' '}
              As escrivaninhas cabem em qualquer cantinho do home office. E o melhor:{' '}
              entregamos com{' '}
              <strong className="text-[#2D2D2D] font-semibold">frota própria em até 72 horas</strong>.
            </p>

            <p>
              Atendemos todos os bairros de Curitiba - CIC, Pinheirinho, Cajuru, Boqueirão,{' '}
              Sítio Cercado - e também Colombo, São José dos Pinhais, Araucária, Pinhais{' '}
              e Fazenda Rio Grande.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
