// src/components/ProductFAQ.tsx

'use client'

import { useState } from 'react'
import { generateFAQSchema, type FAQItem } from '@/lib/seo'

interface ProductFAQProps {
  faqs: FAQItem[]
  productName: string
}

/**
 * Componente de FAQ em acordeão
 * 
 * Funcionalidades:
 * - Acordeão interativo (UX)
 * - JSON-LD FAQPage integrado (SEO)
 * - Design System Moveirama v2.0 (Earthy)
 * - Acessível (ARIA)
 */
export default function ProductFAQ({ faqs, productName }: ProductFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0) // Primeira aberta por padrão

  if (!faqs || faqs.length === 0) return null

  const faqSchema = generateFAQSchema(faqs)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section 
      className="mt-8 md:mt-12"
      aria-labelledby="faq-heading"
    >
      {/* JSON-LD FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Título da seção */}
      <h2 
        id="faq-heading"
        className="text-xl md:text-2xl font-semibold text-[#2D2D2D] mb-4 md:mb-6"
      >
        Dúvidas frequentes sobre o {productName}
      </h2>

      {/* Acordeão */}
      <div className="border border-[#E8DFD5] rounded-lg overflow-hidden">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className={`border-b border-[#E8DFD5] last:border-b-0 ${
              openIndex === index ? 'bg-[#FAF7F4]' : 'bg-white'
            }`}
          >
            {/* Pergunta (botão) */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center gap-4 p-4 text-left 
                         hover:bg-[#FAF7F4] transition-colors duration-150
                         focus:outline-none focus:ring-2 focus:ring-[#6B8E7A]/40 focus:ring-inset"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="font-medium text-[#2D2D2D] text-base md:text-lg">
                {faq.question}
              </span>
              
              {/* Ícone chevron */}
              <svg
                className={`w-5 h-5 text-[#8B7355] flex-shrink-0 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </button>

            {/* Resposta (colapsável) */}
            <div
              id={`faq-answer-${index}`}
              role="region"
              aria-labelledby={`faq-question-${index}`}
              className={`overflow-hidden transition-all duration-200 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="p-4 pt-0 text-[#8B7355] leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA WhatsApp (matador de objeções) */}
      <div className="mt-4 p-4 bg-[#F0E8DF] rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-1">
          <p className="text-[#5C4D3C] text-sm">
            <strong>Ainda tem dúvida?</strong> Chama no WhatsApp que a gente responde rápido.
          </p>
        </div>
        <a
          href={`https://wa.me/5541999999999?text=${encodeURIComponent(`Olá! Tenho uma dúvida sobre o ${productName}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20BD5A] 
                     text-white font-semibold text-sm rounded-lg transition-colors duration-150
                     min-h-[44px]"
        >
          {/* Ícone WhatsApp */}
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Tirar dúvida
        </a>
      </div>
    </section>
  )
}
