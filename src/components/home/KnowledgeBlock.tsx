/**
 * KnowledgeBlock.tsx - Bloco de Conhecimento SEO
 */

export function KnowledgeBlock() {
  return (
    <section className="bg-[#F0E8DF] py-12 md:py-20" aria-labelledby="knowledge-title">
      <div className="max-w-[720px] mx-auto px-4 md:px-6">
        <h2 id="knowledge-title" className="text-[#2D2D2D] text-[29px] md:text-[36px] font-bold mb-6 text-center">
          Móveis para apartamentos em Curitiba
        </h2>
        
        <div className="text-[#8B7355] text-base leading-relaxed space-y-4">
          <p>
            A <strong className="text-[#2D2D2D]">Moveirama</strong> é uma loja de móveis em Curitiba especializada em 
            móveis para apartamentos compactos. Atendemos bairros como{' '}
            <strong className="text-[#2D2D2D]">CIC, Pinheirinho, Cajuru, Boqueirão, Sítio Cercado, Xaxim e Portão</strong>, 
            além de toda a Região Metropolitana.
          </p>
          
          <p>
            Nosso diferencial é a <strong className="text-[#2D2D2D]">entrega em até 72 horas com frota própria</strong>. 
            Nada de transportadora terceirizada — a gente mesmo leva seu móvel com cuidado até a porta do seu apartamento.
          </p>
          
          <p>
            Trabalhamos com as melhores marcas de móveis como{' '}
            <strong className="text-[#2D2D2D]">Artely e Artany</strong>, conhecidas pelo excelente custo-benefício 
            e qualidade dos materiais. Racks para TV, escrivaninhas para home office, painéis, mesas de centro e muito mais.
          </p>
          
          <p>
            Precisa de ajuda com a montagem? Todos os móveis vêm com manual ilustrado e ferragens completas. 
            Também <strong className="text-[#2D2D2D]">indicamos montadores de confiança</strong> se você preferir. 
            E qualquer dúvida, nosso suporte no WhatsApp responde rapidinho.
          </p>
          
          <p>
            Somos uma empresa de Curitiba com <strong className="text-[#2D2D2D]">CNPJ ativo, nota fiscal e 3 meses de garantia</strong> em 
            todos os produtos. Compre sem medo!
          </p>
        </div>
        
        <div className="mt-8 text-center">
          
            href="https://wa.me/5541984209323?text=Oi!%20Quero%20saber%20mais%20sobre%20os%20m%C3%B3veis"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold px-6 py-3 rounded-lg transition-colors min-h-[48px]"
          >
            Chamar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
