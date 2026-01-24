'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  MapPin, 
  MessageCircle, 
  ChevronDown,
  ChevronRight,
  Check,
  ExternalLink
} from 'lucide-react'

// ===========================================
// ÍCONES SVG CUSTOMIZADOS (Toffee v2.0)
// ===========================================

const TruckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    {/* Baú do caminhão */}
    <rect x="2" y="8" width="13" height="10" rx="2" stroke="#8B7355" strokeWidth="2.5" fill="#F0E8DF"/>
    {/* Cabine */}
    <path d="M15 10H21C22.1046 10 23 10.8954 23 12V16C23 17.1046 22.1046 18 21 18H15V10Z" stroke="#8B7355" strokeWidth="2.5" fill="#F0E8DF"/>
    {/* Janela cabine */}
    <rect x="17" y="11.5" width="4" height="3" rx="0.5" stroke="#8B7355" strokeWidth="1.5" fill="none"/>
    {/* Rodas */}
    <circle cx="7" cy="20" r="2.5" stroke="#8B7355" strokeWidth="2.5" fill="#F0E8DF"/>
    <circle cx="20" cy="20" r="2.5" stroke="#8B7355" strokeWidth="2.5" fill="#F0E8DF"/>
    {/* Linhas de carga no baú */}
    <line x1="5" y1="11" x2="5" y2="15" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="8.5" y1="11" x2="8.5" y2="15" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="12" y1="11" x2="12" y2="15" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const PhoneNotificationIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    {/* Corpo do celular */}
    <rect x="6" y="3" width="12" height="22" rx="2.5" stroke="#8B7355" strokeWidth="2.5" fill="#F0E8DF"/>
    {/* Tela */}
    <rect x="8" y="6" width="8" height="13" rx="1" stroke="#8B7355" strokeWidth="1.5" fill="none"/>
    {/* Botão home */}
    <circle cx="12" cy="22" r="1.5" fill="#8B7355"/>
    {/* Badge de notificação */}
    <circle cx="21" cy="7" r="5" fill="#8B7355"/>
    {/* Checkmark */}
    <path d="M18.5 7L20 8.5L23.5 5" stroke="#F0E8DF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const BuildingElevatorIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    {/* Prédio principal */}
    <rect x="3" y="4" width="12" height="21" rx="2" stroke="#8B7355" strokeWidth="2.5" fill="#F0E8DF"/>
    {/* Janelas */}
    <rect x="5.5" y="7" width="2.5" height="2.5" rx="0.5" fill="#8B7355"/>
    <rect x="10" y="7" width="2.5" height="2.5" rx="0.5" fill="#8B7355"/>
    <rect x="5.5" y="12" width="2.5" height="2.5" rx="0.5" fill="#8B7355"/>
    <rect x="10" y="12" width="2.5" height="2.5" rx="0.5" fill="#8B7355"/>
    <rect x="5.5" y="17" width="2.5" height="2.5" rx="0.5" fill="#8B7355"/>
    <rect x="10" y="17" width="2.5" height="2.5" rx="0.5" fill="#8B7355"/>
    {/* Elevador */}
    <rect x="17" y="10" width="7" height="15" rx="1.5" stroke="#8B7355" strokeWidth="2.5" fill="#F0E8DF"/>
    {/* Porta do elevador */}
    <line x1="20.5" y1="12" x2="20.5" y2="23" stroke="#8B7355" strokeWidth="1.5"/>
    {/* Setas */}
    <path d="M19 14L20.5 12L22 14" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 21L20.5 23L22 21" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ShieldWoodIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    {/* Escudo */}
    <path d="M14 2L4 6V12C4 18.6274 8.37258 24 14 25C19.6274 24 24 18.6274 24 12V6L14 2Z" stroke="#8B7355" strokeWidth="2.5" fill="#F0E8DF"/>
    {/* Textura de madeira */}
    <path d="M8 9C10 8.5 12 9.5 14 9C16 8.5 18 9.5 20 9" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7 13C9 12.5 11 13.5 14 13C17 13.5 19 12.5 21 13" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 17C10 16.5 12 17.5 14 17C16 17.5 18 16.5 20 17" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Gota sendo bloqueada */}
    <circle cx="14" cy="6" r="2" fill="#8B7355"/>
  </svg>
)

// ===========================================
// DADOS
// ===========================================

const CITIES_DATA = [
  { name: 'Curitiba', prazo: '1-2 dias úteis', tipo: 'Frota própria' },
  { name: 'São José dos Pinhais', prazo: '1-2 dias úteis', tipo: 'Frota própria' },
  { name: 'Colombo', prazo: '1-2 dias úteis', tipo: 'Frota própria' },
  { name: 'Pinhais', prazo: '1-2 dias úteis', tipo: 'Frota própria' },
  { name: 'Araucária', prazo: '2-3 dias úteis', tipo: 'Frota própria' },
  { name: 'Fazenda Rio Grande', prazo: '2-3 dias úteis', tipo: 'Frota própria' },
  { name: 'Almirante Tamandaré', prazo: '2-3 dias úteis', tipo: 'Frota própria' },
  { name: 'Piraquara', prazo: '2-3 dias úteis', tipo: 'Frota própria' },
  { name: 'Quatro Barras', prazo: '2-3 dias úteis', tipo: 'Frota própria' },
  { name: 'Campina Grande do Sul', prazo: '2-3 dias úteis', tipo: 'Frota própria' },
]

const NEIGHBORHOODS = [
  'CIC',
  'Pinheirinho',
  'Sítio Cercado',
  'Cajuru',
  'Boqueirão',
  'Portão',
  'Santa Cândida',
]

const BENEFITS = [
  {
    Icon: TruckIcon,
    title: 'Frota Própria',
    text: 'Nossos entregadores conhecem cada rua de Curitiba e região.',
    highlight: 'Sem terceirizar, sem surpresa.',
  },
  {
    Icon: PhoneNotificationIcon,
    title: 'Aviso via WhatsApp',
    text: 'Acompanhe seu pedido e receba aviso no dia da entrega.',
    highlight: 'Sem ficar esperando o dia todo.',
  },
  {
    Icon: BuildingElevatorIcon,
    title: 'Segurança em Apartamentos',
    text: 'Experiência com portarias, elevadores e escadas.',
    highlight: 'Seu móvel sobe sem arranhões.',
  },
  {
    Icon: ShieldWoodIcon,
    title: 'Resistente ao Clima',
    text: 'Curitiba muda de tempo 5 vezes no dia? A gente sabe.',
    highlight: 'Usamos materiais testados contra a umidade típica da nossa região.',
  },
]

const FAQS = [
  {
    question: 'Quanto custa o frete para Curitiba?',
    answer: 'O frete em Curitiba começa em R$ 25 e varia por bairro. Use a calculadora no topo da página para ver o valor exato para seu CEP. Sem surpresa no checkout.',
  },
  {
    question: 'Qual o prazo de entrega?',
    answer: 'Curitiba e cidades próximas: 1 a 2 dias úteis. Cidades mais distantes da RMC: 2 a 3 dias úteis. O prazo começa a contar após confirmação do pagamento.',
  },
  {
    question: 'E se o móvel chegar com avaria?',
    answer: 'Confira na hora da entrega. Se tiver qualquer problema, tire foto, não assine o recebimento e nos chame no WhatsApp com o número do pedido. A gente resolve — troca ou reembolso, sem burocracia.',
  },
]

// ===========================================
// CEP CHECKER COMPONENT
// ===========================================

function CEPChecker() {
  const [cep, setCep] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    city?: string
    fee?: number
    days?: string
    message?: string
  } | null>(null)

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 5) return numbers
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCep(formatCEP(e.target.value))
  }

  const calculateShipping = async () => {
    const cleanCep = cep.replace(/\D/g, '')
    if (cleanCep.length !== 8) {
      setResult({ success: false, message: 'Digite um CEP válido com 8 dígitos.' })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      // Consulta ViaCEP
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const data = await response.json()

      if (data.erro) {
        setResult({ success: false, message: 'CEP não encontrado.' })
        return
      }

      // Lógica de frete simplificada (baseada em shipping.ts do MAPA)
      const city = data.localidade?.toLowerCase()
      const shippingRates: Record<string, { fee: number; days: string }> = {
        'curitiba': { fee: 25, days: '1-2 dias úteis' },
        'pinhais': { fee: 35, days: '1-2 dias úteis' },
        'são josé dos pinhais': { fee: 35, days: '1-2 dias úteis' },
        'colombo': { fee: 35, days: '1-2 dias úteis' },
        'piraquara': { fee: 40, days: '2-3 dias úteis' },
        'quatro barras': { fee: 40, days: '2-3 dias úteis' },
        'campina grande do sul': { fee: 40, days: '2-3 dias úteis' },
        'almirante tamandaré': { fee: 40, days: '2-3 dias úteis' },
        'fazenda rio grande': { fee: 40, days: '2-3 dias úteis' },
        'araucária': { fee: 40, days: '2-3 dias úteis' },
      }

      const shipping = shippingRates[city]
      
      if (shipping) {
        setResult({
          success: true,
          city: data.localidade,
          fee: shipping.fee,
          days: shipping.days,
        })
      } else {
        setResult({
          success: false,
          message: `No momento não entregamos em ${data.localidade}. Entre em contato pelo WhatsApp para consultar disponibilidade.`,
        })
      }
    } catch (error) {
      setResult({ success: false, message: 'Erro ao consultar CEP. Tente novamente.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#F0E8DF] border border-[#E8DFD5] rounded-xl p-6">
      {/* Título */}
      <h2 className="text-lg font-semibold text-[#2D2D2D] flex items-center gap-2 mb-4">
        <MapPin className="w-6 h-6 text-[#6B8E7A]" />
        Calcule seu frete
      </h2>

      {/* Form */}
      <div>
        <label htmlFor="cep-input" className="block text-sm font-medium text-[#2D2D2D] mb-2">
          Digite seu CEP
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="cep-input"
            value={cep}
            onChange={handleCEPChange}
            placeholder="00000-000"
            maxLength={9}
            className="flex-1 p-3 px-4 text-base border border-[#E8DFD5] rounded-lg bg-white
              focus:outline-none focus:border-[#6B8E7A] focus:ring-[3px] focus:ring-[#6B8E7A]/20
              placeholder:text-[#B8A99A] transition-all"
          />
          <button
            onClick={calculateShipping}
            disabled={loading}
            className="bg-[#6B8E7A] hover:bg-[#5A7A68] disabled:opacity-60 disabled:cursor-not-allowed
              text-white font-semibold px-5 py-3 rounded-lg min-h-[48px] min-w-[44px]
              transition-colors whitespace-nowrap"
          >
            {loading ? 'Calculando...' : 'Calcular'}
          </button>
        </div>
        <a
          href="https://buscacepinter.correios.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-sm text-[#6B8E7A] underline underline-offset-2 hover:text-[#5A7A68]"
        >
          Não sabe o CEP?
        </a>
      </div>

      {/* Resultado */}
      {result && (
        <div
          aria-live="polite"
          className={`mt-4 p-4 bg-white rounded-lg border-l-4 ${
            result.success ? 'border-[#6B8E7A]' : 'border-[#DC2626]'
          }`}
        >
          {result.success ? (
            <>
              <p className="font-semibold text-[#2D2D2D] mb-1">
                Entregamos em {result.city}!
              </p>
              <p className="text-xl font-bold text-[#2D2D2D]">
                Frete a partir de R$ {result.fee?.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-sm text-[#8B7355] mt-1">
                Prazo: {result.days} após confirmação do pagamento
              </p>
            </>
          ) : (
            <p className="text-[#DC2626]">{result.message}</p>
          )}
        </div>
      )}
    </div>
  )
}

// ===========================================
// FAQ ACCORDION COMPONENT
// ===========================================

function FAQAccordion({ faqs }: { faqs: typeof FAQS }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="border border-[#E8DFD5] rounded-lg overflow-hidden">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`border-b border-[#E8DFD5] last:border-b-0`}
        >
          <button
            onClick={() => toggle(index)}
            aria-expanded={openIndex === index}
            className="w-full flex justify-between items-center gap-4 p-4 text-left
              bg-white hover:bg-[#FAF7F4] transition-colors"
          >
            <span className="font-medium text-[#2D2D2D]">{faq.question}</span>
            <ChevronDown
              className={`w-5 h-5 text-[#8B7355] flex-shrink-0 transition-transform duration-200 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openIndex === index && (
            <div className="px-4 pb-4 text-[#8B7355] leading-relaxed">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ===========================================
// MAIN PAGE COMPONENT
// ===========================================

export default function OndeEntregamosContent() {
  return (
    <>
      {/* ================================
          HERO SECTION
          ================================ */}
      <section className="bg-[#FAF7F4] py-8 lg:py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          
          {/* Breadcrumb */}
          <nav aria-label="Navegação" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-[#8B7355]">
              <li>
                <Link href="/" className="hover:text-[#6B8E7A] transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="w-4 h-4" />
              <li className="text-[#2D2D2D] font-medium">Entrega</li>
            </ol>
          </nav>

          {/* Grid: Texto + CEP Checker */}
          <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
            
            {/* Coluna Texto */}
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2D2D2D] leading-tight mb-4">
                Onde a Moveirama Entrega: Sua Casa Renovada em até 72h
              </h1>
              <p className="text-base md:text-lg text-[#8B7355] leading-relaxed max-w-xl">
                Frota própria em Curitiba e Região Metropolitana. 
                Sem surpresa no frete, sem atraso, sem dor de cabeça.
                A gente conhece cada rua — e seu móvel chega inteiro.
              </p>
            </div>

            {/* Coluna CEP Checker */}
            <div>
              <CEPChecker />
            </div>

          </div>
        </div>
      </section>

      {/* ================================
          CIDADES ATENDIDAS
          ================================ */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          
          <h2 className="text-xl md:text-2xl font-semibold text-[#2D2D2D] mb-6">
            Cidades Atendidas na Região Metropolitana
          </h2>

          {/* Mobile: Cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {CITIES_DATA.map((city, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 bg-[#F0E8DF] border border-[#E8DFD5] rounded-lg"
              >
                <span className="font-semibold text-[#2D2D2D]">{city.name}</span>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm text-[#8B7355]">{city.prazo}</span>
                  <span className="text-xs font-medium text-[#5A7A68] bg-[#E8F0EB] px-2 py-0.5 rounded-full">
                    {city.tipo}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Tabela */}
          <table className="hidden md:table w-full border-collapse">
            <thead>
              <tr className="bg-[#F0E8DF]">
                <th className="p-4 text-left text-sm font-semibold text-[#8B7355] uppercase tracking-wide border-b border-[#E8DFD5]">
                  Cidade
                </th>
                <th className="p-4 text-left text-sm font-semibold text-[#8B7355] uppercase tracking-wide border-b border-[#E8DFD5]">
                  Prazo
                </th>
                <th className="p-4 text-left text-sm font-semibold text-[#8B7355] uppercase tracking-wide border-b border-[#E8DFD5]">
                  Tipo de Entrega
                </th>
              </tr>
            </thead>
            <tbody>
              {CITIES_DATA.map((city, index) => (
                <tr
                  key={index}
                  className={`border-b border-[#E8DFD5] hover:bg-[#F0E8DF] transition-colors ${
                    index % 2 === 1 ? 'bg-[#FAF7F4]' : ''
                  }`}
                >
                  <td className="p-4 text-[#2D2D2D]">{city.name}</td>
                  <td className="p-4 text-[#2D2D2D]">{city.prazo}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-[#5A7A68] bg-[#E8F0EB] rounded-full">
                      {city.tipo}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </section>

      {/* ================================
          BAIRROS PRIORITÁRIOS
          ================================ */}
      <section className="bg-[#FAF7F4] py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          
          <h2 className="text-xl md:text-2xl font-semibold text-[#2D2D2D] mb-6">
            Bairros com Entrega Prioritária em Curitiba
          </h2>

          <div className="flex flex-wrap gap-2">
            {NEIGHBORHOODS.map((neighborhood, index) => (
              <span
                key={index}
                className="inline-flex items-center px-4 py-2 text-sm font-medium 
                  text-[#2D2D2D] bg-white border border-[#E8DFD5] rounded-full
                  hover:bg-[#E8F0EB] hover:border-[#6B8E7A] hover:text-[#5A7A68] 
                  transition-all cursor-default"
              >
                {neighborhood}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* ================================
          BENEFÍCIOS DA ENTREGA
          ================================ */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          
          <h2 className="text-xl md:text-2xl font-semibold text-[#2D2D2D] mb-6">
            Como funciona nossa entrega "Sem Dor de Cabeça"
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {BENEFITS.map((benefit, index) => {
              const Icon = benefit.Icon
              return (
                <div
                  key={index}
                  className="p-6 bg-[#F0E8DF] border border-[#E8DFD5] rounded-xl text-center
                    transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Container do ícone - v2.0: 56px, Cream, borda */}
                  <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-[#F0E8DF] border border-[#E8DFD5] rounded-xl">
                    <Icon />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-[#2D2D2D] mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-[#8B7355] leading-relaxed">
                    {benefit.text}{' '}
                    <strong className="font-semibold text-[#2D2D2D]">
                      {benefit.highlight}
                    </strong>
                  </p>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ================================
          FAQ
          ================================ */}
      <section className="bg-[#FAF7F4] py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          
          <h2 className="text-xl md:text-2xl font-semibold text-[#2D2D2D] mb-6">
            Perguntas Frequentes sobre Entrega
          </h2>

          <div className="max-w-3xl">
            <FAQAccordion faqs={FAQS} />
          </div>

        </div>
      </section>

      {/* ================================
          CTA FINAL
          ================================ */}
      <section className="bg-[#6B8E7A] py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Pronto para renovar sua casa?
            </h2>
            <p className="text-base md:text-lg text-white/90 mb-6">
              Escolha seu móvel, calcule o frete e receba em até 72h.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/moveis-para-casa"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#5A7A68] 
                  font-semibold px-6 py-3 rounded-lg min-h-[48px]
                  hover:bg-[#F0E8DF] transition-colors"
              >
                Ver Ofertas para Curitiba
              </Link>
              <a
                href="https://wa.me/5541984209323?text=Olá! Gostaria de saber mais sobre a entrega na minha região."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white 
                  font-semibold px-6 py-3 rounded-lg min-h-[48px]
                  hover:bg-[#20BD5A] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Chamar no WhatsApp
              </a>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
