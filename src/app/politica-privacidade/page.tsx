import type { Metadata } from 'next'
import Link from 'next/link'

// ============================================
// METADATA SEO
// ============================================

export const metadata: Metadata = {
  title: 'Política de Privacidade | Moveirama Móveis Curitiba',
  description: 'Conheça nossa política de privacidade. Saiba como coletamos, usamos e protegemos seus dados pessoais. Transparência e segurança conforme LGPD.',
  alternates: {
    canonical: 'https://moveirama.com.br/politica-privacidade',
  },
  openGraph: {
    title: 'Política de Privacidade | Moveirama',
    description: 'Privacidade e transparência são fundamentais. Saiba como protegemos seus dados.',
    url: 'https://moveirama.com.br/politica-privacidade',
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

// Ícone de usuário/dados pessoais
const UserDataIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
    <path d="M16 3l2 2-2 2" />
  </svg>
)

// Ícone de configurações/uso
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
)

// Ícone de compartilhamento
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
)

// Ícone de cadeado/segurança
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
)

// Ícone de documento/LGPD
const FileTextIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

// Ícone de mensagem/contato
const MessageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
)

// Ícone de check
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

// Ícone de caminhão
const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
)

// Ícone de cartão/pagamento
const CreditCardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
)

// Ícone de prédio/governo
const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M3 21h18" />
    <path d="M5 21V7l8-4v18" />
    <path d="M19 21V11l-6-4" />
    <path d="M9 9v.01" />
    <path d="M9 12v.01" />
    <path d="M9 15v.01" />
    <path d="M9 18v.01" />
  </svg>
)

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function PoliticaPrivacidadePage() {
  return (
    <main className="bg-[#FAF7F4] min-h-screen">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* ================================================ */}
        {/* HEADER DA PÁGINA */}
        {/* ================================================ */}
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-[#2D2D2D] text-2xl sm:text-[32px] font-bold mb-3">
            Política de Privacidade
          </h1>
          <p className="text-[#8B7355] text-base sm:text-lg max-w-[650px] mx-auto leading-relaxed">
            Na Moveirama, privacidade e transparência são fundamentais. Esta política detalha como tratamos seus dados pessoais e como garantimos a sua segurança ao comprar conosco.
          </p>
        </div>

        {/* ================================================ */}
        {/* SEÇÃO 1: Quais dados coletamos? */}
        {/* ================================================ */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DFD5] mb-6">
          
          {/* Header da seção */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#E8DFD5]">
            <div className="w-12 h-12 bg-[#E8F0EB] rounded-xl flex items-center justify-center text-[#6B8E7A]">
              <UserDataIcon />
            </div>
            <div>
              <h2 className="text-[#2D2D2D] text-lg sm:text-xl font-semibold">
                1. Quais dados coletamos?
              </h2>
              <p className="text-[#8B7355] text-sm">
                Para que você receba seus móveis com segurança
              </p>
            </div>
          </div>

          {/* Conteúdo */}
          <p className="text-[#4A4A4A] text-sm leading-relaxed mb-4">
            Coletamos apenas o essencial:
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-[#FAF7F4] rounded-xl p-4">
              <span className="w-6 h-6 bg-[#6B8E7A] rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                <CheckIcon />
              </span>
              <div>
                <p className="text-[#2D2D2D] text-sm font-semibold">Dados de Identificação</p>
                <p className="text-[#4A4A4A] text-sm">Nome completo e CPF (exigidos por lei para emissão de Nota Fiscal).</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#FAF7F4] rounded-xl p-4">
              <span className="w-6 h-6 bg-[#6B8E7A] rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                <CheckIcon />
              </span>
              <div>
                <p className="text-[#2D2D2D] text-sm font-semibold">Dados de Contato</p>
                <p className="text-[#4A4A4A] text-sm">E-mail e telefone (para atualizações sobre o seu pedido).</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#FAF7F4] rounded-xl p-4">
              <span className="w-6 h-6 bg-[#6B8E7A] rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                <CheckIcon />
              </span>
              <div>
                <p className="text-[#2D2D2D] text-sm font-semibold">Dados de Entrega</p>
                <p className="text-[#4A4A4A] text-sm">Endereço completo para logística.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================ */}
        {/* SEÇÃO 2: Como usamos seus dados? */}
        {/* ================================================ */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DFD5] mb-6">
          
          {/* Header da seção */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#E8DFD5]">
            <div className="w-12 h-12 bg-[#F0E8DF] rounded-xl flex items-center justify-center text-[#8B7355]">
              <SettingsIcon />
            </div>
            <div>
              <h2 className="text-[#2D2D2D] text-lg sm:text-xl font-semibold">
                2. Como usamos seus dados?
              </h2>
              <p className="text-[#8B7355] text-sm">
                Finalidades específicas e legítimas
              </p>
            </div>
          </div>

          {/* Conteúdo */}
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-[#6B8E7A] mt-1 flex-shrink-0">•</span>
              <p className="text-[#4A4A4A] text-sm">Processar seu pagamento e emitir documentos fiscais.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6B8E7A] mt-1 flex-shrink-0">•</span>
              <p className="text-[#4A4A4A] text-sm">Coordenar a logística de entrega do seu móvel.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6B8E7A] mt-1 flex-shrink-0">•</span>
              <p className="text-[#4A4A4A] text-sm">Enviar atualizações de status do pedido.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#8B7355] mt-1 flex-shrink-0">•</span>
              <p className="text-[#4A4A4A] text-sm">No futuro, poderemos utilizar sistemas de automação e triagem tecnológica para tornar nosso suporte ainda mais ágil e eficiente.</p>
            </li>
          </ul>
        </section>

        {/* ================================================ */}
        {/* SEÇÃO 3: Compartilhamento com Terceiros */}
        {/* ================================================ */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DFD5] mb-6">
          
          {/* Header da seção */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#E8DFD5]">
            <div className="w-12 h-12 bg-[#F0E8DF] rounded-xl flex items-center justify-center text-[#8B7355]">
              <ShareIcon />
            </div>
            <div>
              <h2 className="text-[#2D2D2D] text-lg sm:text-xl font-semibold">
                3. Compartilhamento com Terceiros
              </h2>
              <p className="text-[#8B7355] text-sm">
                Não vendemos nem alugamos seus dados
              </p>
            </div>
          </div>

          {/* Conteúdo */}
          <p className="text-[#4A4A4A] text-sm leading-relaxed mb-4">
            Seus dados são compartilhados <strong className="text-[#2D2D2D]">apenas com parceiros indispensáveis</strong> para a operação:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#FAF7F4] rounded-xl p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-white rounded-lg flex items-center justify-center text-[#8B7355]">
                <TruckIcon />
              </div>
              <p className="text-[#2D2D2D] text-sm font-semibold mb-1">Logística</p>
              <p className="text-[#4A4A4A] text-xs">Para garantir que o móvel chegue até você</p>
            </div>

            <div className="bg-[#FAF7F4] rounded-xl p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-white rounded-lg flex items-center justify-center text-[#8B7355]">
                <CreditCardIcon />
              </div>
              <p className="text-[#2D2D2D] text-sm font-semibold mb-1">Pagamento</p>
              <p className="text-[#4A4A4A] text-xs">Processamento seguro e criptografado</p>
            </div>

            <div className="bg-[#FAF7F4] rounded-xl p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-white rounded-lg flex items-center justify-center text-[#8B7355]">
                <BuildingIcon />
              </div>
              <p className="text-[#2D2D2D] text-sm font-semibold mb-1">Órgãos Fiscais</p>
              <p className="text-[#4A4A4A] text-xs">Cumprimento de obrigações legais</p>
            </div>
          </div>
        </section>

        {/* ================================================ */}
        {/* SEÇÃO 4: Segurança das Informações */}
        {/* ================================================ */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DFD5] mb-6">
          
          {/* Header da seção */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#E8DFD5]">
            <div className="w-12 h-12 bg-[#E8F0EB] rounded-xl flex items-center justify-center text-[#6B8E7A]">
              <LockIcon />
            </div>
            <div>
              <h2 className="text-[#2D2D2D] text-lg sm:text-xl font-semibold">
                4. Segurança das Informações
              </h2>
              <p className="text-[#8B7355] text-sm">
                Transações em ambiente seguro
              </p>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="bg-[#E8F0EB] rounded-xl p-4 border-l-4 border-[#6B8E7A]">
            <p className="text-[#4A4A4A] text-sm leading-relaxed">
              Toda transação financeira na Moveirama é realizada em ambiente seguro. <strong className="text-[#2D2D2D]">Não armazenamos os dados do seu cartão de crédito</strong> em nossos servidores; as informações são processadas por parceiros especializados em segurança de pagamentos.
            </p>
          </div>
        </section>

        {/* ================================================ */}
        {/* SEÇÃO 5: Seus Direitos (LGPD) */}
        {/* ================================================ */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DFD5] mb-6">
          
          {/* Header da seção */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#E8DFD5]">
            <div className="w-12 h-12 bg-[#E8F0EB] rounded-xl flex items-center justify-center text-[#6B8E7A]">
              <FileTextIcon />
            </div>
            <div>
              <h2 className="text-[#2D2D2D] text-lg sm:text-xl font-semibold">
                5. Seus Direitos (LGPD)
              </h2>
              <p className="text-[#8B7355] text-sm">
                Você é o dono dos seus dados
              </p>
            </div>
          </div>

          {/* Conteúdo */}
          <p className="text-[#4A4A4A] text-sm leading-relaxed">
            De acordo com a <strong className="text-[#2D2D2D]">Lei Geral de Proteção de Dados (LGPD)</strong>, você pode solicitar a qualquer momento:
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F0EB] rounded-full text-sm text-[#5A7A68] font-medium">
              <CheckIcon /> Confirmação
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F0EB] rounded-full text-sm text-[#5A7A68] font-medium">
              <CheckIcon /> Correção
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F0EB] rounded-full text-sm text-[#5A7A68] font-medium">
              <CheckIcon /> Atualização
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F0EB] rounded-full text-sm text-[#5A7A68] font-medium">
              <CheckIcon /> Exclusão definitiva
            </span>
          </div>

          <p className="text-[#8B7355] text-xs mt-4 italic">
            * Salvo nos casos em que a lei exige a guarda de documentos fiscais por prazos específicos.
          </p>
        </section>

        {/* ================================================ */}
        {/* SEÇÃO 6: Contato e Encarregado de Dados */}
        {/* ================================================ */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DFD5] mb-8">
          
          {/* Header da seção */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#E8DFD5]">
            <div className="w-12 h-12 bg-[#F0E8DF] rounded-xl flex items-center justify-center text-[#8B7355]">
              <MessageIcon />
            </div>
            <div>
              <h2 className="text-[#2D2D2D] text-lg sm:text-xl font-semibold">
                6. Contato e Encarregado de Dados
              </h2>
              <p className="text-[#8B7355] text-sm">
                Exercer seus direitos ou tirar dúvidas
              </p>
            </div>
          </div>

          {/* Conteúdo */}
          <p className="text-[#4A4A4A] text-sm leading-relaxed mb-4">
            Entre em contato com nossa equipe através dos canais oficiais:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* WhatsApp */}
            <a
              href="https://wa.me/5541984209323?text=Olá!%20Tenho%20uma%20dúvida%20sobre%20meus%20dados%20pessoais."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-[#E8F0EB] hover:bg-[#DCE8E0] rounded-xl p-4 transition-colors group"
            >
              <div className="w-10 h-10 bg-[#25D366] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                <WhatsAppIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[#2D2D2D] text-sm font-semibold group-hover:text-[#25D366] transition-colors">Atendimento Imediato</p>
                <p className="text-[#4A4A4A] text-xs">Falar no WhatsApp</p>
              </div>
            </a>

            {/* Formulário */}
            <Link
              href="/fale-com-a-gente"
              className="flex items-center gap-4 bg-[#FAF7F4] hover:bg-[#F0E8DF] rounded-xl p-4 transition-colors group"
            >
              <div className="w-10 h-10 bg-[#8B7355] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                <FileTextIcon />
              </div>
              <div>
                <p className="text-[#2D2D2D] text-sm font-semibold group-hover:text-[#8B7355] transition-colors">Solicitações por Escrito</p>
                <p className="text-[#4A4A4A] text-xs">Formulário de Contato</p>
              </div>
            </Link>
          </div>
        </section>

        {/* ================================================ */}
        {/* FOOTER - CTA Final */}
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
