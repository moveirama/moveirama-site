/**
 * OfertasConfianca - Seção "Por que comprar na Moveirama?"
 * Squad Dev - Janeiro 2026
 * 
 * IMPORTANTE: Usa ícones SVG, NÃO emojis
 * Cor dos ícones: Toffee (#8B7355)
 */

// ===========================================
// ÍCONES SVG (Toffee)
// ===========================================

// Caminhão de Entrega
const DeliveryTruckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6"
  >
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

// Planta Baixa / Ambiente Compacto
const FloorPlanIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>
);

// Balão de Conversa / Suporte
const ChatBubbleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6"
  >
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

// ===========================================
// DADOS DOS BENEFÍCIOS
// ===========================================

const BENEFICIOS = [
  {
    icon: <DeliveryTruckIcon />,
    texto: 'Entrega própria em até 72h',
  },
  {
    icon: <FloorPlanIcon />,
    texto: 'Móveis para apê compacto',
  },
  {
    icon: <ChatBubbleIcon />,
    texto: 'Suporte via WhatsApp',
  },
];

// ===========================================
// COMPONENTE
// ===========================================

export default function OfertasConfianca() {
  return (
    <section className="mt-12 p-6 md:p-8 bg-[#F0E8DF] rounded-xl text-center">
      {/* Título */}
      <h2 className="text-lg md:text-xl font-semibold text-[#2D2D2D] mb-2">
        Por que comprar na Moveirama?
      </h2>

      {/* Subtítulo */}
      <p className="text-sm text-[#8B7355] mb-6 md:mb-8">
        Somos de Curitiba e entendemos as necessidades da região.
      </p>

      {/* Grid de Benefícios */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12 md:gap-16">
        {BENEFICIOS.map((beneficio, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-3 min-w-[140px]"
          >
            {/* Ícone em Toffee */}
            <div className="text-[#8B7355]">{beneficio.icon}</div>

            {/* Texto */}
            <span className="text-sm text-[#2D2D2D] text-center leading-snug">
              {beneficio.texto}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

