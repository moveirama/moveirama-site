'use client'

/**
 * Componente: Medidas Compactas v1.3
 * 
 * Objetivo: Responder à pergunta "vai caber?" antes do CTA, reduzindo
 * abandono por medo #4 do cliente (medida errada, TV não serve).
 * 
 * v1.3 Mudanças:
 * - Adicionados ícones SVG para cada dimensão (hierarquia visual)
 * - Largura: seta horizontal bidirecional
 * - Altura: seta vertical bidirecional
 * - Profundidade: cubo em perspectiva
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

// Ícone Largura: Seta horizontal bidirecional ↔
function IconeLargura() {
  return (
    <svg 
      className="w-6 h-6 text-[var(--color-toffee)]" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="8 9 5 12 8 15" />
      <polyline points="16 9 19 12 16 15" />
    </svg>
  )
}

// Ícone Altura: Seta vertical bidirecional ↕
function IconeAltura() {
  return (
    <svg 
      className="w-6 h-6 text-[var(--color-toffee)]" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="9 8 12 5 15 8" />
      <polyline points="9 16 12 19 15 16" />
    </svg>
  )
}

// Ícone Profundidade: Cubo em perspectiva
function IconeProfundidade() {
  return (
    <svg 
      className="w-6 h-6 text-[var(--color-toffee)]" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <line x1="12" y1="12" x2="20" y2="7.5" />
      <line x1="12" y1="12" x2="4" y2="7.5" />
    </svg>
  )
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
    <div className="py-4 border-b border-[var(--color-sand-light)]">
      {/* Grid 3 colunas com ícones e labels */}
      <div className="grid grid-cols-3 gap-4 text-center">
        {/* Largura */}
        <div className="flex flex-col items-center gap-1">
          <IconeLargura />
          <span className="text-sm text-[var(--color-toffee)]">Largura</span>
          <span className="text-lg font-semibold text-[var(--color-graphite)]">
            {formatarMedida(largura)}
          </span>
        </div>

        {/* Altura */}
        <div className="flex flex-col items-center gap-1">
          <IconeAltura />
          <span className="text-sm text-[var(--color-toffee)]">Altura</span>
          <span className="text-lg font-semibold text-[var(--color-graphite)]">
            {formatarMedida(altura)}
          </span>
        </div>

        {/* Profundidade */}
        <div className="flex flex-col items-center gap-1">
          <IconeProfundidade />
          <span className="text-sm text-[var(--color-toffee)]">Profundidade</span>
          <span className="text-lg font-semibold text-[var(--color-graphite)]">
            {formatarMedida(profundidade)}
          </span>
        </div>
      </div>

      {/* Compatibilidade TV - só para racks/painéis */}
      {mostrarTV && (
        <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-[var(--color-sand-light)]">
          <svg 
            className="w-[22px] h-[22px] text-[var(--color-graphite)] shrink-0" 
            aria-hidden="true"
            width="22" 
            height="22" 
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
          <span className="text-xl font-bold text-[var(--color-graphite)]">
            TV até {compatibilidadeTv}&quot;
          </span>
        </div>
      )}
      
      {/* Link âncora para medidas detalhadas */}
      <a 
        href="#medidas-detalhadas" 
        onClick={handleClick}
        className="block mt-3 text-center text-sm text-[var(--color-sage-600)] underline underline-offset-2 hover:text-[var(--color-sage-700)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-sage-500)] focus-visible:outline-offset-2"
      >
        Ver medidas detalhadas ↓
      </a>
    </div>
  )
}
