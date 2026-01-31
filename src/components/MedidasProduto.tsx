'use client'

/**
 * Componente: MedidasProduto
 * 
 * Exibe as medidas do produto (Largura × Altura × Profundidade)
 * com ícones Lucide para melhor clareza visual.
 * 
 * @version 1.0
 * @date 30/01/2026
 * @spec HANDOFF_MedidasProduto_Icones.md
 * @design Design System v2.0 (Paleta Earthy)
 */

import { MoveHorizontal, MoveVertical, Box, LucideIcon } from 'lucide-react'

interface MedidasProdutoProps {
  largura: number | null
  altura: number | null
  profundidade: number | null
}

interface MedidaItemProps {
  icon: LucideIcon
  valor: number
  label: string
}

/**
 * Formata valor de medida:
 * - ≥100cm → converte para metros (160 → "1,6 m")
 * - <100cm → mantém em cm arredondado (46.8 → "47 cm")
 */
function formatarMedida(cm: number): string {
  if (cm >= 100) {
    const metros = cm / 100
    return `${metros.toFixed(2).replace('.', ',').replace(/,?0+$/, '')} m`
  }
  return `${Math.round(cm)} cm`
}

function MedidaItem({ icon: Icon, valor, label }: MedidaItemProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Icon 
        className="w-6 h-6 text-[#8B7355]" 
        strokeWidth={2.5}
        aria-hidden="true"
      />
      <span className="text-xl font-semibold text-[#2D2D2D]">
        {formatarMedida(valor)}
      </span>
      <span className="text-sm font-medium text-[#4A4A4A]">
        {label}
      </span>
    </div>
  )
}

export default function MedidasProduto({ largura, altura, profundidade }: MedidasProdutoProps) {
  // Se não tem todas as dimensões, não renderiza
  if (!largura || !altura || !profundidade) {
    return null
  }

  return (
    <section id="medidas-detalhadas" className="mt-8 scroll-mt-4">
      <h2 className="text-2xl font-semibold text-[var(--color-graphite)] mb-4">
        Medidas do produto
      </h2>
      <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-[var(--color-sand-light)] text-center">
        <MedidaItem icon={MoveHorizontal} valor={largura} label="Largura" />
        <MedidaItem icon={MoveVertical} valor={altura} label="Altura" />
        <MedidaItem icon={Box} valor={profundidade} label="Profundidade" />
      </div>
    </section>
  )
}

// Uso:
// <MedidasProduto largura={product.width_cm} altura={product.height_cm} profundidade={product.depth_cm} />
