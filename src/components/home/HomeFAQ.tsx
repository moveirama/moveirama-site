/**
 * HomeFAQ.tsx - FAQ Acordeão
 */

'use client';

import { useState } from 'react';

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const faqItems = [
  {
    question: 'Qual o prazo de entrega em Curitiba?',
    answer: 'Entregamos em 1 a 3 dias úteis (72 horas) em Curitiba com frota própria. Não usamos transportadora — a gente mesmo leva seu móvel com cuidado.',
  },
  {
    question: 'Vocês entregam em Colombo, São José dos Pinhais e Araucária?',
    answer: 'Sim! Entregamos em toda a Região Metropolitana de Curitiba com frota própria: Colombo, São José dos Pinhais, Araucária, Pinhais, Fazenda Rio Grande, Almirante Tamandaré, Piraquara, Quatro Barras e Campina Grande do Sul.',
  },
  {
    question: 'Os móveis vêm montados?',
    answer: 'Os móveis vêm na caixa para você montar. Mas calma: acompanha manual ilustrado, todas as ferragens necessárias e disponibilizamos vídeo de montagem. Precisa de montador? A gente indica.',
  },
  {
    question: 'Quanto custa o frete?',
    answer: 'O frete em Curitiba começa em R$ 25. Para compras acima de R$ 299, o frete é grátis dentro de Curitiba.',
  },
  {
    question: 'Como sei se o móvel cabe no meu espaço?',
    answer: 'Todas as medidas (largura, altura, profundidade) estão na página do produto. Dúvida? Manda no WhatsApp que confirmamos.',
  },
  {
    question: 'Como funciona a troca ou devolução?',
    answer: 'Você tem 7 dias para trocar ou devolver conforme o CDC. O móvel precisa estar na embalagem original.',
  },
];

export function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  return (
    <section className="bg-[#FAF7F4] py-12 md:py-20" aria-labelledby="faq-title">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <h2 id="faq-title" className="text-[#2D2D2D] text-[29px] md:text-[41px] font-bold mb-8 md:mb-10 text-center">
          Perguntas Frequentes
        </h2>
        
        <dl className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="bg-white rounded-xl border border-[#E8DFD5] overflow-hidden">
                <dt>
                  <button
                    type="button"
                    className="w-full flex justify-between items-center gap-4 p-5 text-left cursor-pointer hover:bg-[#FAFAFA] transition-colors"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="text-[#2D2D2D] text-base font-medium">{item.question}</span>
                    <ChevronDownIcon className={`w-5 h-5 text-[#8B7355] flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                </dt>
                <dd className={isOpen ? 'block' : 'hidden'}>
                  <div className="px-5 pb-5 text-[#8B7355] text-[15px] leading-relaxed">
                    {item.answer}
                  </div>
                </dd>
              </div>
            );
          })}
        </dl>
        
        <div className="mt-8 text-center">
          <p className="text-[#8B7355] text-[15px] mb-3">Não encontrou sua dúvida?</p>
          
            href="https://wa.me/5541984209323?text=Oi!%20Tenho%20uma%20d%C3%BAvida"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#20BD5A] transition-colors"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
