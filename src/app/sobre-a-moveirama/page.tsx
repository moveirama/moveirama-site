'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'

// ============================================
// PÁGINA: Sobre a Moveirama
// Versão: 1.0
// Data: 03/02/2026
// 
// Baseado em: SPEC_Pagina_Sobre_Moveirama.md v1.1
// Implementa: 6 seções conforme spec do Squad Visual
// Schemas: FurnitureStore (SEO local + AIO)
// ============================================

// ============================================
// ÍCONES SVG (stroke-width: 2.5 conforme spec)
// ============================================

const TruckIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
)

const RulerIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
)

const SmartphoneIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
)

const FileTextIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

const MapPinIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const PackageIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
)

const PhoneIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const MailIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const CalendarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const FacebookIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

// Ícone de documento (para CNPJ)
const DocumentIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

// ============================================
// DADOS DA EMPRESA
// ============================================

const COMPANY_DATA = {
  legalName: 'Moveirama Eureka Móveis LTDA',
  cnpj: '61.154.643/0001-84',
  address: {
    street: 'Rua Barão de Guaraúna, 517',
    neighborhood: 'Juvevê',
    city: 'Curitiba',
    state: 'PR',
    cep: '80030-310',
  },
  phone: '(41) 98420-9323',
  phoneNumber: '5541984209323',
  email: 'atendimento@moveirama.com.br',
  foundingYear: '2024',
  instagram: 'https://instagram.com/moveirama',
  facebook: 'https://facebook.com/moveirama',
  geo: {
    latitude: -25.419,
    longitude: -49.263,
  },
}

const CIDADES_ATENDIDAS = [
  'Curitiba',
  'Pinhais',
  'São José dos Pinhais',
  'Colombo',
  'Araucária',
  'Piraquara',
  'Fazenda Rio Grande',
  'Almirante Tamandaré',
  'Quatro Barras',
  'Campina Grande do Sul',
]

const DIFERENCIAIS = [
  {
    icon: TruckIcon,
    title: 'Entrega própria',
    description: 'Curitiba e região em até 3 dias úteis. Frota própria que conhece as ruas.',
  },
  {
    icon: RulerIcon,
    title: 'Medidas claras',
    description: 'Sem surpresa: você vê se cabe antes de comprar.',
  },
  {
    icon: SmartphoneIcon,
    title: 'Suporte no WhatsApp',
    description: 'Dúvida? A gente responde rápido, sem robô.',
  },
  {
    icon: FileTextIcon,
    title: 'Nota fiscal sempre',
    description: 'Compra formal com garantia de verdade.',
  },
]

// ============================================
// COMPONENTE: EmailReveal (Anti-spam)
// ============================================

const EmailReveal = () => {
  const [revealed, setRevealed] = useState(false)
  const [email, setEmail] = useState('')
  
  const handleReveal = () => {
    // Email codificado em Base64
    const encoded = 'YXRlbmRpbWVudG9AbW92ZWlyYW1hLmNvbS5icg=='
    setEmail(atob(encoded))
    setRevealed(true)
  }
  
  if (revealed) {
    return (
      <a 
        href={`mailto:${email}`}
        className="text-base text-[#6B8E7A] underline underline-offset-2 hover:text-[#4A6B5A] transition-colors"
      >
        {email}
      </a>
    )
  }
  
  return (
    <>
      <button
        onClick={handleReveal}
        className="text-sm text-[#6B8E7A] underline underline-offset-2 hover:text-[#4A6B5A] transition-colors cursor-pointer bg-transparent border-none p-0"
      >
        Clique para ver o email
      </button>
      <noscript>
        <span className="text-base text-[#2D2D2D]">
          atendimento [arroba] moveirama.com.br
        </span>
      </noscript>
    </>
  )
}

// ============================================
// SCHEMA: FurnitureStore (JSON-LD)
// ============================================

const FurnitureStoreSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "@id": "https://moveirama.com.br/#organization",
    "name": "Moveirama",
    "legalName": COMPANY_DATA.legalName,
    "url": "https://moveirama.com.br",
    "logo": "https://moveirama.com.br/logo/moveirama-grafite.svg",
    "image": "https://moveirama.com.br/og-image.jpg",
    "email": COMPANY_DATA.email,
    "telephone": `+55-41-98420-9323`,
    "taxID": COMPANY_DATA.cnpj,
    "description": "E-commerce de móveis em Curitiba especializado em soluções para casas e escritórios.",
    "foundingDate": COMPANY_DATA.foundingYear,
    "priceRange": "$$",
    "currenciesAccepted": "BRL",
    "paymentAccepted": "Pix, Cartão de Crédito, Cartão de Débito",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": COMPANY_DATA.address.street,
      "addressLocality": COMPANY_DATA.address.city,
      "addressRegion": COMPANY_DATA.address.state,
      "postalCode": COMPANY_DATA.address.cep,
      "addressCountry": "BR",
      "addressNeighborhood": COMPANY_DATA.address.neighborhood
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": COMPANY_DATA.geo.latitude,
      "longitude": COMPANY_DATA.geo.longitude
    },
    "areaServed": CIDADES_ATENDIDAS.map(cidade => ({
      "@type": "City",
      "name": cidade
    })),
    "knowsAbout": [
      "Móveis para casa",
      "Móveis para escritório",
      "Otimização de espaços compactos",
      "Móveis para apartamentos pequenos",
      "Racks para TV",
      "Escrivaninhas home office"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Móveis Moveirama",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Móveis para Casa",
          "url": "https://moveirama.com.br/moveis-para-casa"
        },
        {
          "@type": "OfferCatalog",
          "name": "Móveis para Escritório",
          "url": "https://moveirama.com.br/moveis-para-escritorio"
        }
      ]
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://moveirama.com.br/busca?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      COMPANY_DATA.instagram,
      COMPANY_DATA.facebook
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function SobreAMoveirama() {
  return (
    <>
      {/* Schema JSON-LD */}
      <FurnitureStoreSchema />
      
      <main className="bg-[#FAF7F4]">
        
        {/* ============================================
            SEÇÃO 1: HERO
            ============================================ */}
        <section className="py-8 px-4 text-center lg:py-16 lg:px-8 bg-[#FAF7F4]">
          <div className="max-w-[1280px] mx-auto">
            <h1 className="text-[28px] lg:text-[36px] font-bold text-[#2D2D2D] mb-3">
              Sobre a Moveirama
            </h1>
            <p className="text-base lg:text-lg text-[#4A4A4A] max-w-[600px] mx-auto leading-relaxed">
              Soluções completas para mobiliar sua casa ou escritório sem gastar muito.
            </p>
          </div>
        </section>

        {/* ============================================
            SEÇÃO 2: NOSSA HISTÓRIA
            ============================================ */}
        <section className="py-12 px-4 bg-white md:py-16 md:px-6">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="text-2xl md:text-[30px] font-semibold text-[#2D2D2D] mb-6 md:mb-8 text-center">
              Nossa história
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 max-w-[800px] mx-auto">
              {/* Card 2024 */}
              <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 flex-1">
                <span className="inline-block bg-[#E8F0EB] text-[#6B8E7A] text-sm font-semibold px-3 py-1 rounded-full mb-3">
                  2024
                </span>
                <h3 className="text-lg font-semibold text-[#2D2D2D] mb-2">
                  O Começo
                </h3>
                <p className="text-base text-[#2D2D2D] leading-relaxed">
                  A Moveirama nasceu para provar que você pode ter uma casa ou escritório 
                  bonitos sem pagar uma fortuna. Vimos que comprar móveis online era difícil 
                  e caro, então decidimos simplificar tudo para você.
                </p>
              </div>
              
              {/* Card Hoje */}
              <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 flex-1">
                <span className="inline-block bg-[#E8F0EB] text-[#6B8E7A] text-sm font-semibold px-3 py-1 rounded-full mb-3">
                  Hoje
                </span>
                <h3 className="text-lg font-semibold text-[#2D2D2D] mb-2">
                  Sua Loja de Confiança
                </h3>
                <p className="text-base text-[#2D2D2D] leading-relaxed">
                  Atendemos Curitiba e região com entrega própria e rápida. 
                  Oferecemos móveis resistentes, com medidas claras e suporte direto 
                  pelo WhatsApp. Somos uma loja digital, mas com o respeito e o 
                  atendimento que você merece.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            SEÇÃO 3: NOSSOS DIFERENCIAIS
            ============================================ */}
        <section className="py-12 px-4 bg-[#FAF7F4] md:py-16 md:px-6">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="text-2xl md:text-[30px] font-semibold text-[#2D2D2D] mb-6 md:mb-8 text-center">
              Por que comprar com a gente?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-[1000px] mx-auto">
              {DIFERENCIAIS.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <div key={index} className="bg-[#F5F5F5] rounded-xl p-6 text-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 text-[#8B7355]">
                      <IconComponent className="w-full h-full" />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-[#2D2D2D] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#4A4A4A] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============================================
            SEÇÃO 4: ÁREA DE ATENDIMENTO
            ============================================ */}
        <section className="py-12 px-4 bg-white md:py-16 md:px-6">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="text-2xl md:text-[30px] font-semibold text-[#2D2D2D] mb-6 md:mb-8 text-center">
              Onde entregamos
            </h2>
            
            <div className="max-w-[800px] mx-auto">
              {/* Destaque card */}
              <div className="bg-[#F5F5F5] rounded-xl p-6 flex items-start gap-4 mb-6">
                <div className="w-8 h-8 text-[#6B8E7A] shrink-0">
                  <MapPinIcon className="w-full h-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <strong className="text-lg md:text-xl font-semibold text-[#2D2D2D]">
                    Curitiba e Região Metropolitana
                  </strong>
                  <span className="text-sm md:text-base text-[#4A4A4A]">
                    Entrega em até 3 dias úteis com frota própria
                  </span>
                </div>
              </div>
              
              {/* Pills de cidades */}
              <div className="flex flex-wrap gap-2 justify-center">
                {CIDADES_ATENDIDAS.map((cidade, index) => (
                  <span
                    key={index}
                    className="bg-[#E8F0EB] text-[#2D2D2D] text-sm font-medium px-4 py-2 rounded-full"
                  >
                    {cidade}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            SEÇÃO 5: DADOS DA EMPRESA (TRUST BLOCK)
            ============================================ */}
        <section className="py-12 px-4 bg-[#FAF7F4] md:py-16 md:px-6">
          <div className="max-w-[1280px] mx-auto">
            <div className="bg-[#F5F5F5] border border-[#E0E0E0] rounded-2xl p-8 md:p-10 md:px-12 max-w-[600px] mx-auto">
              
              {/* Nome da empresa */}
              <h2 className="text-xl md:text-2xl font-bold text-[#2D2D2D] text-center mb-6">
                {COMPANY_DATA.legalName}
              </h2>
              
              {/* Divider */}
              <div className="h-px bg-[#E0E0E0] my-6" />
              
              {/* Dados */}
              <div className="flex flex-col gap-5">
                
                {/* CNPJ */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-[#8B7355] shrink-0 mt-0.5">
                    <DocumentIcon className="w-full h-full" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">
                      CNPJ
                    </span>
                    <span className="text-base text-[#2D2D2D]">
                      {COMPANY_DATA.cnpj}
                    </span>
                  </div>
                </div>
                
                {/* Endereço */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-[#8B7355] shrink-0 mt-0.5">
                    <MapPinIcon className="w-full h-full" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">
                      Endereço
                    </span>
                    <span className="text-base text-[#2D2D2D]">
                      {COMPANY_DATA.address.street}
                    </span>
                    <span className="text-base text-[#2D2D2D]">
                      {COMPANY_DATA.address.neighborhood}, {COMPANY_DATA.address.city} - {COMPANY_DATA.address.state}
                    </span>
                    <span className="text-base text-[#2D2D2D]">
                      CEP {COMPANY_DATA.address.cep}
                    </span>
                  </div>
                </div>
                
                {/* Badge Retirada */}
                <div className="flex items-start gap-3 bg-[#E8F0EB] border border-[#6B8E7A] rounded-lg p-3 my-2">
                  <div className="w-6 h-6 text-[#6B8E7A] shrink-0">
                    <PackageIcon className="w-full h-full" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <strong className="text-sm font-semibold text-[#2D2D2D]">
                      Retirada disponível
                    </strong>
                    <span className="text-[13px] text-[#4A4A4A]">
                      Com agendamento prévio pelo WhatsApp
                    </span>
                  </div>
                </div>
                
                {/* WhatsApp */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-[#8B7355] shrink-0 mt-0.5">
                    <PhoneIcon className="w-full h-full" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">
                      WhatsApp
                    </span>
                    <a 
                      href={`https://wa.me/${COMPANY_DATA.phoneNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-[#6B8E7A] underline underline-offset-2 hover:text-[#4A6B5A] transition-colors"
                    >
                      {COMPANY_DATA.phone}
                    </a>
                  </div>
                </div>
                
                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-[#8B7355] shrink-0 mt-0.5">
                    <MailIcon className="w-full h-full" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">
                      Email
                    </span>
                    <EmailReveal />
                  </div>
                </div>
                
                {/* Desde */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-[#8B7355] shrink-0 mt-0.5">
                    <CalendarIcon className="w-full h-full" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-[#4A4A4A] uppercase tracking-wide">
                      Desde
                    </span>
                    <span className="text-base text-[#2D2D2D]">
                      {COMPANY_DATA.foundingYear}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Divider */}
              <div className="h-px bg-[#E0E0E0] my-6" />
              
              {/* Redes Sociais */}
              <div className="flex justify-center gap-4">
                <a
                  href={COMPANY_DATA.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E0E0E0] rounded-lg text-sm font-medium text-[#2D2D2D] hover:bg-[#E8F0EB] transition-colors min-h-[44px]"
                  aria-label="Instagram da Moveirama"
                >
                  <InstagramIcon className="w-5 h-5" />
                  <span>Instagram</span>
                </a>
                <a
                  href={COMPANY_DATA.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E0E0E0] rounded-lg text-sm font-medium text-[#2D2D2D] hover:bg-[#E8F0EB] transition-colors min-h-[44px]"
                  aria-label="Facebook da Moveirama"
                >
                  <FacebookIcon className="w-5 h-5" />
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            SEÇÃO 6: CTA FINAL
            ============================================ */}
        <section className="py-12 px-4 bg-[#6B8E7A] text-center md:py-16 md:px-6">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="text-2xl md:text-[30px] font-semibold text-white mb-2">
              Pronto para mobiliar?
            </h2>
            <p className="text-base md:text-lg text-white/90 mb-6 md:mb-8">
              Veja nossos móveis e escolha o seu.
            </p>
            
            <div className="flex flex-col md:flex-row gap-3 max-w-[400px] md:max-w-none mx-auto justify-center">
              <Link
                href="/moveis-para-casa"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-white text-[#6B8E7A] text-base font-semibold rounded-lg min-h-[48px] hover:bg-[#F5F5F5] transition-colors"
              >
                Ver Móveis para Casa
              </Link>
              <Link
                href="/moveis-para-escritorio"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-transparent text-white text-base font-semibold rounded-lg min-h-[48px] border-2 border-white hover:bg-white/10 transition-colors"
              >
                Ver Móveis para Escritório
              </Link>
            </div>
          </div>
        </section>
        
      </main>
    </>
  )
}
