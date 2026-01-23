import type { Metadata } from 'next'
import Link from 'next/link'

// ============================================
// METADATA SEO
// ============================================

export const metadata: Metadata = {
  title: 'Fale com a Gente | Moveirama — Atendimento WhatsApp Curitiba',
  description: 'Dúvida sobre medidas, entrega ou montagem? Fale com a Moveirama pelo WhatsApp. Atendimento de domingo a domingo. CNPJ: 61.154.643/0001-84',
  alternates: {
    canonical: 'https://moveirama.com.br/fale-com-a-gente',
  },
  openGraph: {
    title: 'Fale com a Gente | Moveirama',
    description: 'Atendimento rápido pelo WhatsApp. Curitiba e Região Metropolitana.',
    url: 'https://moveirama.com.br/fale-com-a-gente',
    siteName: 'Moveirama',
    locale: 'pt_BR',
    type: 'website',
  },
}

// ============================================
// ÍCONES SVG
// ============================================

const WhatsAppIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const ZapIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
)

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const PineTreeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 2l-4 6h2l-3 5h2l-4 7h14l-4-7h2l-3-5h2l-4-6z" />
    <path d="M12 22v-3" />
  </svg>
)

const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

// Ícones para dúvidas frequentes
const TapeMeasureIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
    <path d="M2 10h4" />
    <path d="M2 14h2" />
    <path d="M22 10h-4" />
    <path d="M22 14h-2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const TvIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
    <polyline points="17 2 12 7 7 2" />
  </svg>
)

const WrenchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
  </svg>
)

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
)

const CreditCardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
)

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
)

// ============================================
// DADOS
// ============================================

const duvidasFrequentes = [
  { icon: <TapeMeasureIcon />, text: 'Será que cabe no meu espaço?' },
  { icon: <TvIcon />, text: 'Serve pra TV de quantas polegadas?' },
  { icon: <WrenchIcon />, text: 'É difícil de montar?' },
  { icon: <TruckIcon />, text: 'Qual o prazo de entrega?' },
  { icon: <CreditCardIcon />, text: 'Como funciona o pagamento?' },
  { icon: <RefreshIcon />, text: 'E se eu precisar trocar?' },
]

// URLs das redes sociais (PREENCHER)
const INSTAGRAM_URL = '#' // TODO: Preencher URL real
const FACEBOOK_URL = '#' // TODO: Preencher URL real

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function FaleComAGentePage() {
  return (
    <main className="bg-[#FAF7F4] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Título da Página */}
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-[#2D2D2D] text-2xl sm:text-[32px] font-bold mb-3">
            Fale com a gente
          </h1>
          <p className="text-[#8B7355] text-base sm:text-lg max-w-[500px] mx-auto">
            Dúvida sobre medidas, entrega ou montagem? A gente resolve.
          </p>
        </div>

        {/* Grid Principal - Cards WhatsApp e Curitiba */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12">
          
          {/* Card WhatsApp - Principal */}
          <div className="bg-[#F0E8DF] rounded-2xl p-6 sm:p-8 border border-[#E8DFD5] relative overflow-hidden">
            
            {/* Badge - "Resposta rápida" */}
            <div className="absolute top-4 right-4 bg-[#6B8E7A] text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <ZapIcon />
              Resposta rápida
            </div>

            {/* Ícone e título */}
            <div className="flex items-center gap-4 mb-5 mt-6">
              <div className="w-14 h-14 bg-[#E8F0EB] rounded-xl flex items-center justify-center text-[#6B8E7A]">
                <WhatsAppIcon />
              </div>
              <h2 className="text-[#2D2D2D] text-xl sm:text-[22px] font-semibold">
                WhatsApp
              </h2>
            </div>

            {/* Número */}
            <div className="bg-[#FAF7F4] rounded-xl p-4 mb-5 border border-[#E8DFD5]">
              <p className="text-[#2D2D2D] text-xl sm:text-2xl font-bold tracking-wide">
                (41) 98420-9323
              </p>
            </div>

            {/* Horário - Tom descontraído */}
            <div className="flex items-center gap-2.5 mb-6 px-4 py-3 bg-[#E8F0EB] rounded-lg">
              <span className="text-[#5A7A68]">
                <SunIcon />
              </span>
              <span className="text-sm text-[#2D2D2D] font-medium">
                De domingo a domingo, com muita alegria ☀️
              </span>
            </div>

            {/* Botão CTA */}
            <a
              href="https://wa.me/5541984209323"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-[#25D366] text-white rounded-lg text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_12px_rgba(37,211,102,0.3)] hover:shadow-[0_6px_16px_rgba(37,211,102,0.4)]"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Chamar no WhatsApp
            </a>
          </div>

          {/* Card "Somos de Curitiba" */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DFD5]">
            
            <h2 className="text-[#2D2D2D] text-lg sm:text-xl font-semibold mb-6 flex items-center gap-2.5">
              <span className="text-[#6B8E7A]">
                <PineTreeIcon />
              </span>
              Somos de Curitiba
            </h2>

            {/* CNPJ */}
            <div className="p-4 bg-[#FAF7F4] rounded-xl mb-4 border-l-4 border-[#6B8E7A]">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-[#6B8E7A]">
                  <BuildingIcon />
                </div>
                <span className="text-[#8B7355] text-[13px] font-medium uppercase tracking-wide">
                  CNPJ
                </span>
              </div>
              <p className="text-[#2D2D2D] text-base font-semibold ml-8">
                61.154.643/0001-84
              </p>
              <p className="text-[#8B7355] text-sm ml-8 mt-1">
                Moveirama Eureka Móveis Ltda
              </p>
            </div>

            {/* Endereço */}
            <div className="p-4 bg-[#FAF7F4] rounded-xl border-l-4 border-[#8B7355]">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-[#8B7355]">
                  <MapPinIcon />
                </div>
                <span className="text-[#8B7355] text-[13px] font-medium uppercase tracking-wide">
                  Endereço Fiscal
                </span>
              </div>
              <p className="text-[#2D2D2D] text-[15px] ml-8 leading-relaxed">
                Rua Exemplo, 123 — Bairro<br/>
                Curitiba — PR • CEP 80000-000
              </p>
            </div>

            {/* Nota importante */}
            <div className="mt-5 px-4 py-3 bg-[#E8F0EB] rounded-lg flex items-start gap-2.5">
              <span className="text-[#5A7A68] mt-0.5 flex-shrink-0">
                <InfoIcon />
              </span>
              <p className="text-[#4A4A4A] text-[13px] leading-relaxed">
                Atendemos exclusivamente online. Não temos loja física para visitação.
              </p>
            </div>
          </div>
        </div>

        {/* Seção: Dúvidas frequentes */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DFD5] mb-10 sm:mb-12">
          <h2 className="text-[#2D2D2D] text-lg sm:text-xl font-semibold mb-6">
            Dúvidas que a gente resolve rápido
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {duvidasFrequentes.map((item, index) => (
              <a
                key={index}
                href="https://wa.me/5541984209323"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 px-4 py-4 bg-[#FAF7F4] rounded-xl border border-[#E8DFD5] transition-all duration-200 hover:border-[#6B8E7A] hover:bg-[#E8F0EB] group"
              >
                <div className="text-[#8B7355] flex-shrink-0 w-6 h-6 flex items-center justify-center group-hover:text-[#6B8E7A] transition-colors">
                  {item.icon}
                </div>
                <span className="text-[#2D2D2D] text-sm font-medium">
                  {item.text}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Seção: Redes Sociais */}
        <div className="bg-[#F0E8DF] rounded-2xl p-6 sm:p-8 border border-[#E8DFD5] text-center mb-10 sm:mb-12">
          <h2 className="text-[#2D2D2D] text-lg font-semibold mb-2">
            Acompanhe a Moveirama
          </h2>
          <p className="text-[#8B7355] text-sm mb-6">
            Novidades, dicas de decoração e ofertas exclusivas
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-white text-[#2D2D2D] rounded-lg text-sm font-medium border border-[#E8DFD5] transition-all duration-200 hover:border-[#E1306C] hover:bg-[#fdf2f5]"
            >
              <span className="text-[#E1306C]"><InstagramIcon /></span>
              Instagram
            </a>

            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-white text-[#2D2D2D] rounded-lg text-sm font-medium border border-[#E8DFD5] transition-all duration-200 hover:border-[#1877F2] hover:bg-[#f0f5ff]"
            >
              <span className="text-[#1877F2]"><FacebookIcon /></span>
              Facebook
            </a>
          </div>
        </div>

        {/* Mensagem final */}
        <div className="text-center px-6 py-6 bg-[#E8F0EB] rounded-xl flex items-center justify-center gap-3">
          <span className="text-[#5A7A68]">
            <HomeIcon />
          </span>
          <p className="text-[#5A7A68] text-base font-medium">
            A gente tá aqui pra ajudar você a montar sua casa do jeito certo.
          </p>
        </div>

      </div>
    </main>
  )
}
