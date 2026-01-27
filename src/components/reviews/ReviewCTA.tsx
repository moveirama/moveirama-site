'use client';

import { MessageSquarePlus } from 'lucide-react';

interface ReviewCTAProps {
  productSlug: string;
  productName: string;
}

export default function ReviewCTA({ productSlug, productName }: ReviewCTAProps) {
  // Por enquanto, abre WhatsApp para enviar avaliação
  // Futuramente: modal ou página dedicada
  const whatsappNumber = '5541984209323';
  const message = encodeURIComponent(
    `Olá! Comprei o produto "${productName}" e gostaria de deixar minha avaliação.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
  
  return (
    <div className="bg-[#E8F0EB] rounded-xl p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-[#6B8E7A] rounded-lg shrink-0">
          <MessageSquarePlus className="w-5 h-5 text-white" aria-hidden="true" />
        </div>
        <div>
          <p className="font-semibold text-[#2D2D2D]">
            Já comprou este produto?
          </p>
          <p className="text-sm text-[#4A4A4A]">
            Conte como foi sua experiência e ajude outros clientes!
          </p>
        </div>
      </div>
      
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#6B8E7A] hover:bg-[#5A7A68] text-white font-semibold rounded-lg transition-colors min-h-[48px] text-center"
      >
        Deixar minha avaliação
      </a>
    </div>
  );
}
