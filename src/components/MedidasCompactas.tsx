'use client'

/**
 * Componente: Medidas Compactas
 * 
 * Objetivo: Responder à pergunta "vai caber?" antes do CTA, reduzindo
 * abandono por medo #4 do cliente (medida errada, TV não serve).
 * 
 * Posição: Entre "Pix + Parcelamento" e "Calcular Frete"
 * 
 * Docs: HANDOFF_Medidas_Compactas_Dev.md
 */

interface MedidasCompactasProps {
  largura: number | null      // width_cm
  altura: number | null       // height_cm
  profundidade: number | null // depth_cm
  compatibilidadeTv?: number | null // tv_max_size (opcional)
}

export default function MedidasCompactas({
  largura,
  altura,
  profundidade,
  compatibilidadeTv
}: MedidasCompactasProps) {
  // Se não tem dimensões, não renderiza
  if (!largura || !altura || !profundidade) {
    return null
  }

  // Scroll suave até seção de medidas detalhadas
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const element = document.getElementById('medidas-detalhadas')
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <div className="bg-[#F5F5F5] p-3 px-4 rounded-lg my-4">
      <div className="flex items-center flex-wrap gap-2 text-base text-[#2D2D2D]">
        {/* Ícone régua */}
        <svg 
          className="w-[18px] h-[18px] text-[#4A4A4A] shrink-0" 
          aria-hidden="true" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/>
          <path d="m14.5 12.5 2-2"/>
          <path d="m11.5 9.5 2-2"/>
          <path d="m8.5 6.5 2-2"/>
          <path d="m17.5 15.5 2-2"/>
        </svg>
        
        {/* Dimensões L × A × P */}
        <span>
          <strong className="font-semibold">{largura}</strong> × {' '}
          <strong className="font-semibold">{altura}</strong> × {' '}
          <strong className="font-semibold">{profundidade}</strong> cm
        </span>
        
        {/* Compatibilidade TV (só se existir) */}
        {compatibilidadeTv && (
          <>
            <span className="text-[#E0E0E0]">•</span>
            <span className="font-medium text-[#2D2D2D]">
              TV até {compatibilidadeTv}&quot;
            </span>
          </>
        )}
      </div>
      
      {/* Link âncora para medidas detalhadas */}
      <a 
        href="#medidas-detalhadas" 
        onClick={handleClick}
        className="inline-block mt-1 text-sm text-[#6B8E7A] underline underline-offset-2 hover:text-[#4A6B5A] transition-colors focus-visible:outline-2 focus-visible:outline-[#6B8E7A] focus-visible:outline-offset-2"
      >
        Ver medidas detalhadas ↓
      </a>
    </div>
  )
}
