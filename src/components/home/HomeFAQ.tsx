// ============================================
// HomeFAQ - Perguntas Frequentes da Home
// ============================================
// Squad Dev - Janeiro 2026
// FAQ com Schema.org para SEO
// ============================================

'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Qual o prazo de entrega para Curitiba?',
    answer: 'Entregamos em até 72 horas (3 dias úteis) para Curitiba e região metropolitana. Usamos frota própria, sem depender de transportadoras.',
  },
  {
    question: 'Vocês entregam em quais cidades?',
    answer: 'Atendemos Curitiba e toda a região metropolitana: Colombo, São José dos Pinhais, Araucária, Pinhais, Fazenda Rio Grande, Almirante Tamandaré, Piraquara e Campo Largo.',
  },
  {
    question: 'Os móveis vêm montados?',
    answer: 'Os móveis vêm desmontados na caixa, com manual de instruções e todas as ferragens. A montagem é simples e temos vídeos passo a passo. Se preferir, oferecemos serviço de montagem por um valor adicional.',
  },
  {
    question: 'Como funciona a garantia?',
    answer: 'Todos os produtos têm garantia de fábrica (geralmente 90 dias a 1 ano, dependendo do fabricante). Além disso, você tem 7 dias para troca ou devolução conforme o Código de Defesa do Consumidor.',
  },
  {
    question: 'Quais formas de pagamento vocês aceitam?',
    answer: 'Aceitamos Pix (com 5% de desconto), cartão de crédito em até 5x sem juros, e cartão de débito. O pagamento é processado de forma segura.',
  },
  {
    question: 'E se o móvel chegar com defeito?',
    answer: 'Não se preocupe! Tire fotos, entre em contato pelo WhatsApp com o número do pedido e resolvemos rapidamente. Trocamos o produto ou devolvemos seu dinheiro.',
  },
];

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 md:py-16 bg-[#FAF7F4]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-2">
            Dúvidas Frequentes
          </h2>
          <p className="text-[#8B7355]">
            Respostas rápidas para suas principais perguntas
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-[#FAF7F4] transition-colors min-h-[48px]"
                  aria-expanded={openIndex === index}
                >
                  <span className="font-medium text-[#2D2D2D] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#8B7355] flex-shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-5">
                    <p className="text-[#8B7355] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <p className="text-[#8B7355] mb-3">
            Não encontrou sua dúvida?
          </p>
          
            href="https://wa.me/5541984209323?text=Oi!%20Tenho%20uma%20dúvida"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#6B8E7A] hover:text-[#5A7A68] font-medium transition-colors"
          >
            Fale com a gente no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
