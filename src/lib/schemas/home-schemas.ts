// ============================================
// MOVEIRAMA HOME PAGE - SCHEMAS JSON-LD
// ============================================
// Squad Dev - Janeiro 2026
// Versão: 1.0
// Estratégia: AIO-First (AI Optimization)
// 
// Localização: src/lib/schemas/home-schemas.ts
// 
// REGRA DE OURO: Toda tabela HTML deve ter 
// schema JSON-LD equivalente
// ============================================

// ============================================
// TYPES
// ============================================

export interface FAQItem {
  question: string;
  answer: string;
}

export interface TVCompatibilityRow {
  tv: string;
  larguraTV: number;
  larguraMinima: number;
  rack: string;
}

export interface CidadeAtendida {
  name: string;
  prazo: string;
  freteBase: number;
  freteGratis: number;
}

export interface TroubleshootingItem {
  problema: string;
  causa: string;
  solucao: string;
  contato: string;
}

export interface MaterialInfo {
  name: string;
  composicao: string;
  resistencia: string;
  umidade: string;
  acabamento: string;
  preco: string;
  indicacao: string;
  espessuras: string;
}

// ============================================
// DADOS BASE - MOVEIRAMA
// ============================================

const MOVEIRAMA = {
  name: 'Moveirama',
  url: 'https://moveirama.com.br',
  logo: 'https://moveirama.com.br/logo/moveirama-grafite.svg',
  telephone: '+5541984209323',
  email: 'contato@moveirama.com.br',
  whatsapp: 'https://wa.me/5541984209323',
  instagram: 'https://www.instagram.com/moveirama',
  facebook: 'https://www.facebook.com/moveirama',
} as const;

const LOCATION = {
  city: 'Curitiba',
  region: 'PR',
  country: 'BR',
  latitude: '-25.4284',
  longitude: '-49.2733',
} as const;

// ============================================
// DADOS: CIDADES ATENDIDAS (Frota Própria)
// ============================================

const CIDADES_ATENDIDAS: CidadeAtendida[] = [
  { name: 'Curitiba', prazo: '1-3 dias úteis', freteBase: 25, freteGratis: 299 },
  { name: 'Colombo', prazo: '1-3 dias úteis', freteBase: 35, freteGratis: 399 },
  { name: 'São José dos Pinhais', prazo: '1-3 dias úteis', freteBase: 35, freteGratis: 399 },
  { name: 'Pinhais', prazo: '1-3 dias úteis', freteBase: 35, freteGratis: 399 },
  { name: 'Araucária', prazo: '2-3 dias úteis', freteBase: 40, freteGratis: 499 },
  { name: 'Fazenda Rio Grande', prazo: '2-3 dias úteis', freteBase: 40, freteGratis: 499 },
  { name: 'Almirante Tamandaré', prazo: '2-3 dias úteis', freteBase: 40, freteGratis: 499 },
  { name: 'Piraquara', prazo: '2-3 dias úteis', freteBase: 40, freteGratis: 499 },
  { name: 'Quatro Barras', prazo: '2-3 dias úteis', freteBase: 40, freteGratis: 499 },
  { name: 'Campina Grande do Sul', prazo: '2-3 dias úteis', freteBase: 40, freteGratis: 499 },
];

// ============================================
// DADOS: COMPATIBILIDADE TV × MÓVEL
// ============================================

const TV_COMPATIBILITY_DATA: TVCompatibilityRow[] = [
  { tv: '32"', larguraTV: 73, larguraMinima: 85, rack: 'Rack Compacto' },
  { tv: '43"', larguraTV: 97, larguraMinima: 110, rack: 'Rack Dallas, Rack Quartzo' },
  { tv: '50"', larguraTV: 112, larguraMinima: 125, rack: 'Rack Théo, Rack Charlotte' },
  { tv: '55"', larguraTV: 123, larguraMinima: 135, rack: 'Rack Théo, Rack Duetto' },
  { tv: '60"', larguraTV: 133, larguraMinima: 145, rack: 'Rack Charlotte, Painel Lumière' },
  { tv: '65"', larguraTV: 145, larguraMinima: 160, rack: 'Painel Lumière, Painel Essencial' },
  { tv: '70"', larguraTV: 157, larguraMinima: 170, rack: 'Painel Essencial (180cm)' },
  { tv: '75"', larguraTV: 167, larguraMinima: 180, rack: 'Painel Essencial (180cm)' },
];

// ============================================
// DADOS: MATERIAIS (MDP vs MDF)
// ============================================

const MATERIAIS_DATA: { mdp: MaterialInfo; mdf: MaterialInfo } = {
  mdp: {
    name: 'MDP (Medium Density Particleboard)',
    composicao: 'Partículas de madeira prensadas com resina',
    resistencia: 'Alta para peso vertical',
    umidade: 'Média (usar BP em Curitiba)',
    acabamento: 'Bom com revestimento melamínico',
    preco: 'Mais acessível',
    indicacao: 'Racks, painéis, estantes, armários',
    espessuras: '15mm, 18mm, 25mm',
  },
  mdf: {
    name: 'MDF (Medium Density Fiberboard)',
    composicao: 'Fibras de madeira prensadas',
    resistencia: 'Alta para peso e impacto',
    umidade: 'Média-Alta',
    acabamento: 'Excelente (aceita pintura)',
    preco: 'Mais elevado',
    indicacao: 'Portas, tampos curvos, peças decorativas',
    espessuras: '15mm, 18mm, 25mm',
  },
};

// ============================================
// DADOS: TROUBLESHOOTING MONTAGEM
// ============================================

const TROUBLESHOOTING_DATA: TroubleshootingItem[] = [
  {
    problema: 'Peça faltando',
    causa: 'Erro de embalagem na fábrica',
    solucao: 'Envie foto da lista de peças pelo WhatsApp',
    contato: 'Enviamos em até 48h',
  },
  {
    problema: 'Peça com defeito ou avaria',
    causa: 'Dano no transporte',
    solucao: 'Tire foto na hora da entrega, guarde embalagem',
    contato: 'Troca imediata',
  },
  {
    problema: 'Manual confuso',
    causa: 'Instruções genéricas do fabricante',
    solucao: 'Acesse nosso vídeo de montagem específico',
    contato: 'Link na página do produto',
  },
  {
    problema: 'Parafuso espanado',
    causa: 'Excesso de força ou ferramenta errada',
    solucao: 'Use chave manual, não parafusadeira elétrica no início',
    contato: 'Enviamos reposição grátis',
  },
  {
    problema: 'Portas desalinhadas',
    causa: 'Dobradiças mal ajustadas',
    solucao: 'Use os 3 parafusos de regulagem da dobradiça',
    contato: 'Vídeo tutorial disponível',
  },
  {
    problema: 'Móvel balançando',
    causa: 'Piso irregular ou pés mal ajustados',
    solucao: 'Ajuste os pés niveladores (se houver) ou use calço fino',
    contato: 'WhatsApp para dúvidas',
  },
];

// ============================================
// DADOS: FAQs HOME PAGE
// ============================================

const HOME_FAQS: FAQItem[] = [
  {
    question: 'Qual o prazo de entrega em Curitiba?',
    answer:
      'Entregamos em 1 a 3 dias úteis (até 72 horas) em Curitiba com frota própria. Não usamos transportadora — a gente mesmo leva seu móvel com cuidado.',
  },
  {
    question: 'Vocês entregam em Colombo, São José dos Pinhais e Araucária?',
    answer:
      'Sim! Entregamos em toda a Região Metropolitana de Curitiba com frota própria: Colombo, São José dos Pinhais, Araucária, Pinhais, Fazenda Rio Grande, Almirante Tamandaré, Piraquara, Quatro Barras e Campina Grande do Sul. Prazo de 1 a 3 dias úteis.',
  },
  {
    question: 'Os móveis vêm montados?',
    answer:
      'Os móveis vêm na caixa para você montar. Mas calma: acompanha manual ilustrado, todas as ferragens necessárias e disponibilizamos vídeo de montagem. Se travar em algum passo, é só chamar no WhatsApp que ajudamos. Precisa de montador? A gente indica.',
  },
  {
    question: 'Quanto custa o frete para Curitiba?',
    answer:
      'O frete em Curitiba começa em R$ 25. Para compras acima de R$ 299, o frete é grátis dentro de Curitiba. Nas demais cidades da Região Metropolitana, frete grátis acima de R$ 399 ou R$ 499 dependendo da região.',
  },
  {
    question: 'Como sei se o móvel cabe no meu espaço?',
    answer:
      'Todas as medidas (largura, altura, profundidade) estão na página do produto. Também disponibilizamos imagem com as medidas detalhadas. Se ainda tiver dúvida, manda as medidas do seu espaço no WhatsApp que a gente confirma se cabe.',
  },
  {
    question: 'Como funciona a troca ou devolução?',
    answer:
      'Você tem 7 dias para trocar ou devolver conforme o Código de Defesa do Consumidor. O móvel precisa estar na embalagem original. É só chamar no WhatsApp com o número do pedido que explicamos o passo a passo.',
  },
];

// ============================================
// 1. ORGANIZATION SCHEMA
// ============================================

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${MOVEIRAMA.url}/#organization`,
  name: MOVEIRAMA.name,
  url: MOVEIRAMA.url,
  logo: {
    '@type': 'ImageObject',
    url: MOVEIRAMA.logo,
    width: 200,
    height: 40,
  },
  description:
    'Loja de móveis em Curitiba com entrega própria em até 72h. Racks, painéis, escrivaninhas para apartamentos compactos. Atendemos Curitiba e Região Metropolitana.',
  telephone: MOVEIRAMA.telephone,
  email: MOVEIRAMA.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: LOCATION.city,
    addressRegion: LOCATION.region,
    addressCountry: LOCATION.country,
  },
  sameAs: [MOVEIRAMA.instagram, MOVEIRAMA.facebook, MOVEIRAMA.whatsapp],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: MOVEIRAMA.telephone,
    contactType: 'customer service',
    availableLanguage: 'Portuguese',
    areaServed: 'BR',
  },
};

// ============================================
// 2. LOCAL BUSINESS SCHEMA (FurnitureStore)
// ============================================

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'FurnitureStore',
  '@id': `${MOVEIRAMA.url}/#localbusiness`,
  name: `${MOVEIRAMA.name} - Móveis em Curitiba`,
  url: MOVEIRAMA.url,
  telephone: MOVEIRAMA.telephone,
  email: MOVEIRAMA.email,
  priceRange: 'R$149 - R$1999',
  image: `${MOVEIRAMA.url}/og-image.png`,
  description:
    'Móveis para casa e escritório em Curitiba. Racks para TV, painéis, escrivaninhas, mesas e penteadeiras. Entrega própria em até 72 horas na Região Metropolitana.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: LOCATION.city,
    addressRegion: LOCATION.region,
    postalCode: '80000-000',
    addressCountry: LOCATION.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: LOCATION.latitude,
    longitude: LOCATION.longitude,
  },
  areaServed: CIDADES_ATENDIDAS.map((cidade) => ({
    '@type': 'City',
    name: cidade.name,
    containedInPlace: {
      '@type': 'State',
      name: 'Paraná',
    },
  })),
  deliveryLeadTime: {
    '@type': 'QuantitativeValue',
    minValue: 1,
    maxValue: 3,
    unitCode: 'd',
    unitText: 'dias úteis',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Catálogo de Móveis Moveirama',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Móveis para Casa',
        description: 'Racks para TV, painéis, mesas de centro, buffets e penteadeiras',
        url: `${MOVEIRAMA.url}/moveis-para-casa`,
      },
      {
        '@type': 'OfferCatalog',
        name: 'Móveis para Escritório',
        description: 'Escrivaninhas, mesas de reunião, gaveteiros, armários e estações de trabalho',
        url: `${MOVEIRAMA.url}/moveis-para-escritorio`,
      },
    ],
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '08:00',
      closes: '12:00',
    },
  ],
  parentOrganization: {
    '@id': `${MOVEIRAMA.url}/#organization`,
  },
  paymentAccepted: 'Pix, Cartão de Crédito, Cartão de Débito, Boleto',
  currenciesAccepted: 'BRL',
};

// ============================================
// 3. WEBSITE SCHEMA (com SearchAction)
// ============================================

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${MOVEIRAMA.url}/#website`,
  name: MOVEIRAMA.name,
  url: MOVEIRAMA.url,
  description:
    'Loja online de móveis em Curitiba. Racks, painéis para TV, escrivaninhas e mais. Entrega própria em até 72h.',
  publisher: {
    '@id': `${MOVEIRAMA.url}/#organization`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${MOVEIRAMA.url}/busca?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'pt-BR',
};

// ============================================
// 4. FAQ SCHEMA (FAQPage)
// ============================================

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${MOVEIRAMA.url}/#faqpage`,
  mainEntity: HOME_FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

// ============================================
// 5. TV COMPATIBILITY TABLE SCHEMA
// ============================================

export const tvCompatibilitySchema = {
  '@context': 'https://schema.org',
  '@type': 'Table',
  '@id': `${MOVEIRAMA.url}/#tv-compatibility-table`,
  about: 'Guia de compatibilidade: tamanho de TV (polegadas) × largura mínima de rack ou painel',
  name: 'Tabela de Compatibilidade TV × Móvel',
  description:
    'Para escolher o rack ideal, a largura do móvel deve ser pelo menos 10cm maior que a largura da TV. Esta tabela mostra a largura mínima recomendada para cada tamanho de TV.',
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: TV_COMPATIBILITY_DATA.length,
    itemListElement: TV_COMPATIBILITY_DATA.map((row, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'StructuredValue',
        name: `TV ${row.tv}`,
        description: `Largura da TV: ${row.larguraTV}cm. Largura mínima do móvel: ${row.larguraMinima}cm. Recomendado: ${row.rack}`,
      },
    })),
  },
};

// ============================================
// 6. MATERIALS COMPARISON TABLE SCHEMA
// ============================================

export const materialsComparisonSchema = {
  '@context': 'https://schema.org',
  '@type': 'Table',
  '@id': `${MOVEIRAMA.url}/#materials-comparison-table`,
  about: 'Comparativo de materiais para móveis: MDP vs MDF',
  name: 'Tabela Comparativa: MDP vs MDF',
  description:
    'MDP e MDF são os materiais mais comuns em móveis. O MDP é mais acessível e ideal para estruturas. O MDF tem acabamento superior e é indicado para portas e detalhes. Em Curitiba, recomendamos MDP BP (Baixa Pressão) devido à umidade da região.',
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: 2,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'StructuredValue',
          name: MATERIAIS_DATA.mdp.name,
          description: `Composição: ${MATERIAIS_DATA.mdp.composicao}. Resistência: ${MATERIAIS_DATA.mdp.resistencia}. Preço: ${MATERIAIS_DATA.mdp.preco}. Indicado para: ${MATERIAIS_DATA.mdp.indicacao}.`,
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'StructuredValue',
          name: MATERIAIS_DATA.mdf.name,
          description: `Composição: ${MATERIAIS_DATA.mdf.composicao}. Resistência: ${MATERIAIS_DATA.mdf.resistencia}. Preço: ${MATERIAIS_DATA.mdf.preco}. Indicado para: ${MATERIAIS_DATA.mdf.indicacao}.`,
        },
      },
    ],
  },
};

// ============================================
// 7. DELIVERY TABLE SCHEMA
// ============================================

export const deliveryTableSchema = {
  '@context': 'https://schema.org',
  '@type': 'Table',
  '@id': `${MOVEIRAMA.url}/#delivery-table`,
  about: 'Tabela de entrega: prazos e valores de frete para Curitiba e Região Metropolitana',
  name: 'Entrega em Curitiba e Região Metropolitana',
  description:
    'A Moveirama entrega com frota própria em Curitiba e 9 cidades da Região Metropolitana. Prazo de 1 a 3 dias úteis. Frete grátis disponível.',
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: CIDADES_ATENDIDAS.length,
    itemListElement: CIDADES_ATENDIDAS.map((cidade, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'StructuredValue',
        name: cidade.name,
        description: `Prazo: ${cidade.prazo}. Frete a partir de R$ ${cidade.freteBase}. Frete grátis acima de R$ ${cidade.freteGratis}.`,
      },
    })),
  },
};

// ============================================
// 8. TROUBLESHOOTING TABLE SCHEMA
// ============================================

export const troubleshootingSchema = {
  '@context': 'https://schema.org',
  '@type': 'Table',
  '@id': `${MOVEIRAMA.url}/#troubleshooting-table`,
  about: 'Solução de problemas comuns na montagem de móveis',
  name: 'Tabela de Troubleshooting: Montagem de Móveis',
  description:
    'Guia de solução para os problemas mais comuns na montagem de móveis. Se precisar de ajuda, chame no WhatsApp.',
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: TROUBLESHOOTING_DATA.length,
    itemListElement: TROUBLESHOOTING_DATA.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'HowToTip',
        name: item.problema,
        text: `Causa: ${item.causa}. Solução: ${item.solucao}. ${item.contato}.`,
      },
    })),
  },
};

// ============================================
// 9. BREADCRUMB SCHEMA (Home)
// ============================================

export const homeBreadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Início',
      item: MOVEIRAMA.url,
    },
  ],
};

// ============================================
// EXPORT: DADOS PARA COMPONENTES
// ============================================

/** FAQs para uso no componente HomeFAQ */
export const homeFAQs = HOME_FAQS;

/** Dados de compatibilidade TV para tabela HTML */
export const tvCompatibilityData = TV_COMPATIBILITY_DATA;

/** Dados de materiais para tabela HTML */
export const materialsData = MATERIAIS_DATA;

/** Dados de cidades atendidas */
export const cidadesAtendidas = CIDADES_ATENDIDAS;

/** Dados de troubleshooting */
export const troubleshootingData = TROUBLESHOOTING_DATA;

/** Constantes da Moveirama */
export const moveirama = MOVEIRAMA;

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Retorna TODOS os schemas para a Home Page
 * Usar para injetar no <head> via JSON-LD
 */
export function getAllHomeSchemas() {
  return [
    organizationSchema,
    localBusinessSchema,
    websiteSchema,
    faqSchema,
    tvCompatibilitySchema,
    materialsComparisonSchema,
    deliveryTableSchema,
    troubleshootingSchema,
    homeBreadcrumbSchema,
  ];
}

/**
 * Retorna schemas ESSENCIAIS (carregamento prioritário)
 * Organization, LocalBusiness, WebSite, FAQ
 */
export function getEssentialSchemas() {
  return [organizationSchema, localBusinessSchema, websiteSchema, faqSchema];
}

/**
 * Retorna schemas de TABELAS (seções específicas AIO)
 */
export function getTableSchemas() {
  return [
    tvCompatibilitySchema,
    materialsComparisonSchema,
    deliveryTableSchema,
    troubleshootingSchema,
  ];
}

/**
 * Converte schema para string JSON-LD
 */
export function schemaToJsonLd(schema: object): string {
  return JSON.stringify(schema, null, 0);
}

// ============================================
// COMPONENTE: JSON-LD Script Renderer
// ============================================

/**
 * Componente React para renderizar scripts JSON-LD
 * Uso: <HomeSchemas /> no layout ou page.tsx
 */
export function HomeSchemaScripts(): JSX.Element {
  const schemas = getAllHomeSchemas();
  
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

// ============================================
// METADATA PARA NEXT.JS
// ============================================

export const homeMetadata = {
  title: 'Moveirama | Móveis para Casa e Escritório em Curitiba | Entrega em 72h',
  description:
    'Loja de móveis em Curitiba com entrega própria em até 72h. Racks para TV, painéis, escrivaninhas, mesas e penteadeiras. Atendemos Curitiba e Região Metropolitana. Preço justo e montagem fácil.',
  keywords: [
    'móveis curitiba',
    'rack para tv curitiba',
    'painel tv curitiba',
    'escrivaninha curitiba',
    'loja de móveis curitiba',
    'móveis região metropolitana',
    'entrega móveis curitiba',
    'rack tv 55 polegadas',
    'móveis apartamento pequeno',
    'móveis para escritório curitiba',
  ],
  openGraph: {
    title: 'Moveirama | Móveis com Entrega em 72h em Curitiba',
    description:
      'Racks, painéis, escrivaninhas e mais. Entrega própria em Curitiba e Região Metropolitana. Preço justo e suporte no WhatsApp.',
    url: MOVEIRAMA.url,
    siteName: MOVEIRAMA.name,
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: `${MOVEIRAMA.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Moveirama - Móveis para Casa e Escritório em Curitiba',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'Moveirama | Móveis com Entrega em 72h em Curitiba',
    description:
      'Racks, painéis, escrivaninhas e mais. Entrega própria em Curitiba e Região Metropolitana.',
    images: [`${MOVEIRAMA.url}/og-image.png`],
  },
  alternates: {
    canonical: MOVEIRAMA.url,
  },
};

// ============================================
// EXEMPLO DE USO
// ============================================
/*
// Em src/app/page.tsx (Home Page):

import { 
  homeMetadata,
  HomeSchemaScripts,
  homeFAQs,
  tvCompatibilityData,
  cidadesAtendidas
} from '@/lib/schemas/home-schemas';

// Metadata
export const metadata = homeMetadata;

// Componente
export default function HomePage() {
  return (
    <>
      <HomeSchemaScripts />
      
      <main>
        {/* Usar homeFAQs no componente HomeFAQ *}
        {/* Usar tvCompatibilityData na tabela HTML *}
        {/* Usar cidadesAtendidas na seção de cobertura *}
      </main>
    </>
  );
}
*/
