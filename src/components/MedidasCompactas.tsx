'use client'

/**
 * Componente: Medidas Compactas v1.2
 * 
 * Objetivo: Responder à pergunta "vai caber?" antes do CTA, reduzindo
 * abandono por medo #4 do cliente (medida errada, TV não serve).
 * 
 * v1.2 Mudanças:
 * - Labels explícitos (Largura, Altura, Profundidade)
 * - Conversão automática: ≥100cm → metros
 * - Compatibilidade TV (só para racks/painéis)
 * 
 * Posição: Entre "Pix + Parcelamento" e "Entrega/Frete"
 * 
 * Docs: HANDOFF_Medidas_Compactas_Dev.md v1.2
 */

interface MedidasCompactasProps {
  largura: number | null        // width_cm
  altura: number | null         // height_cm
  profundidade: number | null   // depth_cm
  categoria: string             // slug da categoria (ex: "racks", "paineis")
  compatibilidadeTv?: number | null // tv_max_size (opcional)
}

/**
 * Formata medida em cm para exibição amigável
 * - Valores ≥ 100cm são convertidos para metros
 * - Valores < 100cm permanecem em centímetros
 */
function formatarMedida(valorCm: number): string {
  if (valorCm >= 100) {
    const metros = valorCm / 100
    let formatado = metros.toFixed(2).replace('.', ',')
    formatado = formatado.replace(/,?0+$/, '')
    return `${formatado}m`
  } else {
    const valorFormatado = Number.isInteger(valorCm) 
      ? valorCm.toString() 
      : valorCm.toFixed(1).replace('.', ',')
    return `${valorFormatado}cm`
  }
}

export default function MedidasCompactas({
  largura,
  altura,
  profundidade,
  categoria,
  compatibilidadeTv
}: MedidasCompactasProps) {
  // Se não tem dimensões, não renderiza
  if (!largura || !altura || !profundidade) {
    return null
  }

  // Mostrar TV apenas se:
  // 1. Categoria for "racks" ou "paineis"
  // 2. E o campo compatibilidade_tv existir
  const mostrarTV = 
    ['racks', 'paineis'].includes(categoria) && 
    compatibilidadeTv != null

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
    <div className="py-4 border-b border-[#E0E0E0]">
      {/* Grid 3 colunas com labels explícitos */}
      <div className="grid grid-cols-3 gap-4 text-left">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-[#4A4A4A]">Largura</span>
          <span className="text-lg font-semibold text-[#2D2D2D]">
            {formatarMedida(largura)}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-[#4A4A4A]">Altura</span>
          <span className="text-lg font-semibold text-[#2D2D2D]">
            {formatarMedida(altura)}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-[#4A4A4A]">Profundidade</span>
          <span className="text-lg font-semibold text-[#2D2D2D]">
            {formatarMedida(profundidade)}
          </span>
        </div>
      </div>

      {/* Compatibilidade TV - só para racks/painéis */}
      {mostrarTV && (
        <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-[#E0E0E0]">
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
            <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
            <polyline points="17 2 12 7 7 2"/>
          </svg>
          <span className="text-base font-medium text-[#2D2D2D]">
            TV até {compatibilidadeTv}&quot;
          </span>
        </div>
      )}
      
      {/* Link âncora para medidas detalhadas */}
      <a 
        href="#medidas-detalhadas" 
        onClick={handleClick}
        className="block mt-3 text-center text-sm text-[#6B8E7A] underline underline-offset-2 hover:text-[#4A6B5A] transition-colors focus-visible:outline-2 focus-visible:outline-[#6B8E7A] focus-visible:outline-offset-2"
      >
        Ver medidas detalhadas ↓
      </a>
    </div>
  )
}
