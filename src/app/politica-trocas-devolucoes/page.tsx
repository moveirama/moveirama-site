import type { Metadata } from 'next'
import Link from 'next/link'

// ============================================
// METADATA SEO
// ============================================

export const metadata: Metadata = {
  title: 'Política de Trocas e Devoluções | Moveirama Móveis Curitiba',
  description: 'Conheça nossa política de trocas, devoluções e garantia. Direito de arrependimento em até 7 dias. Garantia legal de 90 dias. Atendimento via WhatsApp.',
  alternates: {
    canonical: 'https://moveirama.com.br/politica-trocas-devolucoes',
  },
  openGraph: {
    title: 'Política de Trocas e Devoluções | Moveirama',
    description: 'Direito de arrependimento, garantia e suporte. Transparência total para você comprar sem medo.',
    url: 'https://moveirama.com.br/politica-trocas-devolucoes',
    siteName: 'Moveirama',
    locale: 'pt_BR',
    type: 'website',
  },
}

// ============================================
// ÍCONES SVG
// ============================================

const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

// Ícone de relógio/prazo (7 dias)
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M9 16l2 2 4-4" />
  </svg>
)

// Ícone de caixa/embalagem
const PackageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M16.5 9.4l-9-5.19" />
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
)

// Ícone de caminhão/transporte
const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
)

// Ícone de escudo/garantia
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

// Ícone de cadeado/privacidade
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
)

// Ícone de alerta/atenção
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

// Ícone de check/confirmação
const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

// Ícone de X/não permitido
const XCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)

// Ícone de câmera/foto
const CameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
)

// Ícone de informação
const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

// Ícone de usuário/dados
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

// Ícone de documento/LGPD
const FileTextIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function PoliticaTrocasPage() {
  return (
    <main className="bg-[#FAF7F4] min-h-screen">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Título da Página */}
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-[#2D2D2D] text-2xl sm:text-[32px] font-bold mb-3">
            Política de Trocas e Devoluções
          </h1>
          <p className="text-[#8B7355] text-base sm:text-lg max-w-[600px] mx-auto">
            Nosso objetivo é que sua experiência seja tão sólida quanto nossos móveis.
          </p>
        </div>

        {/* ================================================ */}
        {/* SEÇÃO 1: Direito de Arrependimento */}
        {/* ================================================ */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DFD5] mb-6">
          
          {/* Header da seção */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#E8DFD5]">
            <div className="w-12 h-12 bg-[#E8F0EB] rounded-xl flex items-center justify-center text-[#6B8E7A]">
              <CalendarIcon />
            </div>
            <div>
              <h2 className="text-[#2D2D2D] text-lg sm:text-xl font-semibold">
                Direito de Arrependimento
              </h2>
              <p className="text-[#8B7355] text-sm">
                Até 7 dias corridos após o recebimento
              </p>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="space-y-4">
            
            {/* Alerta importante - Condição crucial */}
            <div className="bg-[#FEF3E7] border-l-4 border-[#B85C38] rounded-r-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-[#B85C38] mt-0.5 flex-shrink-0">
                  <AlertIcon />
                </span>
                <div>
                  <p className="text-[#2D2D2D] text-sm font-semibold mb-1">Condição Crucial</p>
                  <p className="text-[#4A4A4A] text-sm leading-relaxed">
                    O móvel deve estar em sua <strong>embalagem original</strong> e, sob hipótese alguma, pode ter sido montado. Móveis montados perdem o direito de devolução por arrependimento, pois deixam de ser considerados produtos novos para revenda.
                  </p>
                </div>
              </div>
            </div>

            {/* Restituição */}
            <div className="bg-[#FAF7F4] rounded-xl p-4 flex items-start gap-3">
              <span className="text-[#6B8E7A] mt-0.5 flex-shrink-0">
                <CheckCircleIcon />
              </span>
              <div>
                <p className="text-[#2D2D2D] text-sm font-semibold mb-1">Restituição</p>
                <p className="text-[#4A4A4A] text-sm leading-relaxed">
                  O valor será devolvido integralmente (produto + frete) pelo mesmo método de pagamento utilizado na compra.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ================================================ */}
        {/* SEÇÃO 2: Avaria no Transporte */}
        {/* ================================================ */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DFD5] mb-6">
          
          {/* Header da seção */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#E8DFD5]">
            <div className="w-12 h-12 bg-[#F0E8DF] rounded-xl flex items-center justify-center text-[#8B7355]">
              <TruckIcon />
            </div>
            <div>
              <h2 className="text-[#2D2D2D] text-lg sm:text-xl font-semibold">
                Avaria no Transporte
              </h2>
              <p className="text-[#8B7355] text-sm">
                Inspecione o produto no momento da entrega
              </p>
            </div>
          </div>

          {/* Conteúdo - Passos */}
          <div className="space-y-4">
            
            {/* Passo 1 */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#6B8E7A] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1 pt-1">
                <p className="text-[#2D2D2D] text-sm leading-relaxed">
                  Se houver danos visíveis na embalagem ou no móvel, <strong>recuse o recebimento</strong> e descreva o motivo no verso da Nota Fiscal.
                </p>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#6B8E7A] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1 pt-1">
                <p className="text-[#2D2D2D] text-sm leading-relaxed">
                  Caso perceba o problema após a saída do transportador, envie <strong>fotos da avaria e da embalagem</strong> para o nosso WhatsApp em até <strong>48 horas</strong>.
                </p>
              </div>
            </div>

            {/* CTA para enviar fotos */}
            <div className="bg-[#FAF7F4] rounded-xl p-4 flex items-center justify-between gap-4 mt-4">
              <div className="flex items-center gap-3">
                <span className="text-[#8B7355]">
                  <CameraIcon />
                </span>
                <span className="text-[#4A4A4A] text-sm">Envie fotos + número do pedido</span>
              </div>
              <a
                href="https://wa.me/5541984209323?text=Olá!%20Preciso%20reportar%20uma%20avaria%20no%20transporte.%20Pedido:%20"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg text-sm font-medium transition-colors hover:bg-[#20bd5a]"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Reportar
              </a>
            </div>

          </div>
        </section>

        {/* ================================================ */}
        {/* SEÇÃO 3: Garantia por Defeito de Fabricação */}
        {/* ================================================ */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DFD5] mb-6">
          
          {/* Header da seção */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#E8DFD5]">
            <div className="w-12 h-12 bg-[#E8F0EB] rounded-xl flex items-center justify-center text-[#6B8E7A]">
              <ShieldIcon />
            </div>
            <div>
              <h2 className="text-[#2D2D2D] text-lg sm:text-xl font-semibold">
                Garantia por Defeito de Fabricação
              </h2>
              <p className="text-[#8B7355] text-sm">
                90 dias de garantia legal (Art. 26 do CDC)
              </p>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* O que está coberto */}
            <div className="bg-[#E8F0EB] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#6B8E7A]">
                  <CheckCircleIcon />
                </span>
                <p className="text-[#2D2D2D] text-sm font-semibold">O que está coberto</p>
              </div>
              <ul className="space-y-2 text-sm text-[#4A4A4A]">
                <li className="flex items-start gap-2">
                  <span className="text-[#6B8E7A] mt-1">•</span>
                  Defeitos de fabricação
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6B8E7A] mt-1">•</span>
                  Vícios de qualidade
                </li>
              </ul>
            </div>

            {/* O que NÃO está coberto */}
            <div className="bg-[#FAF7F4] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#B85C38]">
                  <XCircleIcon />
                </span>
                <p className="text-[#2D2D2D] text-sm font-semibold">O que NÃO está coberto</p>
              </div>
              <ul className="space-y-2 text-sm text-[#4A4A4A]">
                <li className="flex items-start gap-2">
                  <span className="text-[#B85C38] mt-1">•</span>
                  Erro de montagem pelo cliente
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B85C38] mt-1">•</span>
                  Mau uso ou excesso de peso
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B85C38] mt-1">•</span>
                  Limpeza com produtos abrasivos
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* ================================================ */}
        {/* SEÇÃO 4: Política de Privacidade */}
        {/* ================================================ */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DFD5] mb-8">
          
          {/* Header da seção */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#E8DFD5]">
            <div className="w-12 h-12 bg-[#F0E8DF] rounded-xl flex items-center justify-center text-[#8B7355]">
              <LockIcon />
            </div>
            <div>
              <h2 className="text-[#2D2D2D] text-lg sm:text-xl font-semibold">
                Privacidade e Segurança
              </h2>
              <p className="text-[#8B7355] text-sm">
                Sua segurança e privacidade são pilares da Moveirama
              </p>
            </div>
          </div>

          {/* Conteúdo - Grid de cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Uso de Dados */}
            <div className="bg-[#FAF7F4] rounded-xl p-4 border-l-4 border-[#6B8E7A]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#6B8E7A]">
                  <UserIcon />
                </span>
                <p className="text-[#2D2D2D] text-sm font-semibold">Uso de Dados</p>
              </div>
              <p className="text-[#4A4A4A] text-sm leading-relaxed">
                Coletamos apenas informações essenciais (Nome, CPF, Endereço e E-mail) para fins de faturamento e logística.
              </p>
            </div>

            {/* Segurança */}
            <div className="bg-[#FAF7F4] rounded-xl p-4 border-l-4 border-[#6B8E7A]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#6B8E7A]">
                  <ShieldIcon />
                </span>
                <p className="text-[#2D2D2D] text-sm font-semibold">Segurança</p>
              </div>
              <p className="text-[#4A4A4A] text-sm leading-relaxed">
                Utilizamos protocolos de segurança para que suas informações de pagamento sejam processadas de forma criptografada.
              </p>
            </div>

            {/* Atendimento */}
            <div className="bg-[#FAF7F4] rounded-xl p-4 border-l-4 border-[#8B7355]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#8B7355]">
                  <WhatsAppIcon />
                </span>
                <p className="text-[#2D2D2D] text-sm font-semibold">Atendimento via WhatsApp</p>
              </div>
              <p className="text-[#4A4A4A] text-sm leading-relaxed">
                Ao entrar em contato pelo (41) 98420-9323, você fala diretamente com nossa equipe, sempre respeitando sua privacidade.
              </p>
            </div>

            {/* LGPD */}
            <div className="bg-[#FAF7F4] rounded-xl p-4 border-l-4 border-[#8B7355]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#8B7355]">
                  <FileTextIcon />
                </span>
                <p className="text-[#2D2D2D] text-sm font-semibold">LGPD</p>
              </div>
              <p className="text-[#4A4A4A] text-sm leading-relaxed">
                Você tem o direito de solicitar a alteração ou exclusão de seus dados a qualquer momento, enviando uma mensagem para nosso canal de suporte.
              </p>
            </div>

          </div>
        </section>

        {/* ================================================ */}
        {/* FOOTER - Mensagem de suporte */}
        {/* ================================================ */}
        <div className="bg-[#E8F0EB] rounded-xl p-6 text-center">
          <p className="text-[#5A7A68] text-base font-medium mb-4">
            Ficou com alguma dúvida? A gente resolve.
          </p>
          <a
            href="https://wa.me/5541984209323"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-lg text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_12px_rgba(37,211,102,0.3)] hover:shadow-[0_6px_16px_rgba(37,211,102,0.4)]"
          >
            <WhatsAppIcon className="w-5 h-5" />
            Falar com a Moveirama
          </a>
        </div>

      </div>
    </main>
  )
}
