import { Metadata } from 'next'
import OndeEntregamosContent from './OndeEntregamosContent'

// ===========================================
// METADATA (SEO)
// ===========================================

export const metadata: Metadata = {
  title: 'Entrega de Móveis em Curitiba e RMC | Receba em 72h | Moveirama',
  description: 'Frota própria em Curitiba e Região Metropolitana. Entrega em 1-3 dias úteis. Calcule o frete pelo CEP. Móvel chega inteiro, sem surpresa no preço.',
  alternates: {
    canonical: 'https://moveirama.com.br/entrega-moveis-curitiba-rmc',
  },
  openGraph: {
    title: 'Entrega de Móveis em Curitiba e RMC | Receba em 72h | Moveirama',
    description: 'Frota própria em Curitiba e Região Metropolitana. Entrega em 1-3 dias úteis. Calcule o frete pelo CEP.',
    url: 'https://moveirama.com.br/entrega-moveis-curitiba-rmc',
    siteName: 'Moveirama',
    locale: 'pt_BR',
    type: 'website',
  },
}

// ===========================================
// SCHEMAS JSON-LD
// ===========================================

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  'name': 'Moveirama',
  'description': 'Loja de móveis em Curitiba com entrega rápida para toda a Região Metropolitana.',
  'url': 'https://moveirama.com.br',
  'telephone': '+55 41 98420-9323',
  'address': {
    '@type': 'PostalAddress',
    'addressLocality': 'Curitiba',
    'addressRegion': 'PR',
    'addressCountry': 'BR',
  },
  'areaServed': [
    { '@type': 'City', 'name': 'Curitiba' },
    { '@type': 'City', 'name': 'São José dos Pinhais' },
    { '@type': 'City', 'name': 'Colombo' },
    { '@type': 'City', 'name': 'Pinhais' },
    { '@type': 'City', 'name': 'Araucária' },
    { '@type': 'City', 'name': 'Fazenda Rio Grande' },
    { '@type': 'City', 'name': 'Almirante Tamandaré' },
    { '@type': 'City', 'name': 'Piraquara' },
    { '@type': 'City', 'name': 'Quatro Barras' },
    { '@type': 'City', 'name': 'Campina Grande do Sul' },
  ],
  'priceRange': '$$',
  'hasOfferCatalog': {
    '@type': 'OfferCatalog',
    'name': 'Móveis para Casa e Escritório',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'Quanto custa o frete para Curitiba?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'O frete em Curitiba começa em R$ 25 e varia por bairro. Use a calculadora no topo da página para ver o valor exato para seu CEP. Sem surpresa no checkout.',
      },
    },
    {
      '@type': 'Question',
      'name': 'Qual o prazo de entrega?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Curitiba e cidades próximas: 1 a 2 dias úteis. Cidades mais distantes da RMC: 2 a 3 dias úteis. O prazo começa a contar após confirmação do pagamento.',
      },
    },
    {
      '@type': 'Question',
      'name': 'E se o móvel chegar com avaria?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Confira na hora da entrega. Se tiver qualquer problema, tire foto, não assine o recebimento e nos chame no WhatsApp com o número do pedido. A gente resolve — troca ou reembolso, sem burocracia.',
      },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Home',
      'item': 'https://moveirama.com.br',
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': 'Entrega',
      'item': 'https://moveirama.com.br/entrega-moveis-curitiba-rmc',
    },
  ],
}

const deliveryServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'DeliveryChargeSpecification',
  'appliesToDeliveryMethod': {
    '@type': 'DeliveryMethod',
    'name': 'Frota Própria Moveirama',
  },
  'areaServed': {
    '@type': 'GeoCircle',
    'geoMidpoint': {
      '@type': 'GeoCoordinates',
      'latitude': -25.4284,
      'longitude': -49.2733,
    },
    'geoRadius': '50000',
  },
  'eligibleRegion': {
    '@type': 'Place',
    'name': 'Curitiba e Região Metropolitana',
  },
}

// ===========================================
// PAGE COMPONENT (Server Component)
// ===========================================

export default function OndeEntregamosPage() {
  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(deliveryServiceSchema) }}
      />

      {/* Conteúdo da página (Client Component) */}
      <OndeEntregamosContent />
    </>
  )
}
