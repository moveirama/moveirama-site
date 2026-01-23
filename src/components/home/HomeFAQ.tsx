/**
 * HomeFAQ.tsx - Perguntas Frequentes (Acordeão)
 * Squad Dev - Janeiro 2026
 * 
 * SPECS: moveirama-home-mockup.jsx (linhas 768-873)
 * - Fundo: Warm White (#FAF7F4)
 * - Título: "Perguntas Frequentes" centralizado
 * - Acordeão: max-width 720px, cards brancos
 * - CTA WhatsApp ao final
 */

'use client';

import { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';

const faqs = [
  {
    q: 'Qual o prazo de entrega em Curitiba?',
    a: 'Entregamos em até 72 horas após a confirmação do pagamento. Usamos frota própria, então você não depende de transportadora.',
  },
  {
    q: 'Vocês entregam em Colombo, São José dos Pinhais e Araucária?',
    a: 'Sim! Atendemos toda a Região Metropolitana: Colombo, SJP, Araucária, Pinhais, Fazenda Rio Grande, Piraquara, Almirante Tamandaré e mais.',
  },
  {
    q: 'Os móveis vêm montados?',
    a: 'Vêm na caixa com manual completo + todas as ferragens + vídeo de montagem. A maioria é nível fácil (30-45 min). Travou? Chama no WhatsApp que ajudamos.',
  },
  {
    q: 'Quanto custa o frete?',
    a: 'O frete varia de R$ 25 a R$ 45 dependendo da região. Em Curitiba capital, a maioria dos bairros é R$ 25. Você vê o valor exato na página do produto, sem surpresa no checkout.',
  },
  {
    q: 'Como sei se o móvel cabe no meu espaço?',
    a: 'Todas as medidas (largura × altura × profundidade) estão na página do produto. Dúvida? Manda as medidas do seu espaço no WhatsApp que a gente confirma se cabe.',
  },
  {
    q: 'Como funciona a troca?',
    a: 'Você tem 7 dias para trocar ou devolver. Chegou com defeito? Manda foto + número do pedido no WhatsApp e resolvemos rapidinho.',
  },
];

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number>(-1);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="bg-[#FAF7F4] py-14 px-4 md:py-[90px] md:px-[60px]">
      {/* Título */}
      <h2 className="text-[29px] md:text-[41px] font-bold text-[#2D2D2D] text-center mb-7 md:mb-11">
        Perguntas Frequentes
      </h2>

      {/* Acordeão */}
      <div className="max-w-[720px] mx-auto flex flex-col gap-[14px]">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-[#E8DFD5] overflow-hidden"
          >
            {/* Pergunta (botão) */}
            <button
              onClick={() => toggleFaq(index)}
              className="w-full px-[22px] py-[18px] flex justify-between items-center text-left bg-transparent border-none cursor-pointer"
            >
              <span className="font-semibold text-[#2D2D2D] text-base pr-4 leading-[1.4]">
                {faq.q}
              </span>
              <ChevronDown
                size={22}
                className={`text-[#8B7355] flex-shrink-0 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>

            {/* Resposta (condicional) */}
            {openIndex === index && (
              <div className="px-[22px] pb-[18px] text-[#8B7355] text-[15px] leading-[1.7]">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA WhatsApp */}
      <div className="text-center mt-9">
        <p className="text-[#8B7355] text-[15px] mb-[14px]">
          Ainda tem dúvidas?
        </p>
        <a
          href="https://wa.me/5541984209323?text=Olá! Tenho uma dúvida sobre os móveis."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-base rounded-lg transition-colors"
        >
          <MessageCircle size={20} />
          Chamar no WhatsApp
        </a>
      </div>
    </section>
  );
}
