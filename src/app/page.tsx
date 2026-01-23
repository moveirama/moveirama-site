/**
 * Home Page - Moveirama
 * V1 - Apenas componentes implementados
 */
import type { Metadata } from 'next';
import {
  HeroSection,
  TrustBar,
  CategoriesSection,
  WhatsAppFloat,
} from '@/components/home';
import {
  organizationSchema,
  localBusinessSchema,
  websiteSchema,
  faqSchema,
  breadcrumbSchema,
  webPageSchema,
  deliveryServiceSchema,
  offerCatalogSchema,
  reviewAggregateSchema,
} from '@/lib/schemas/home-schemas';

export const metadata: Metadata = {
  title: 'Moveirama | Móveis em Curitiba com Entrega em 72h | Racks, Escrivaninhas, Painéis',
  description: 'Loja de móveis em Curitiba com entrega própria em 72h. Racks para TV, escrivaninhas, painéis e mais. Preço justo, montagem fácil e suporte no WhatsApp.',
  keywords: [
    'móveis Curitiba',
    'rack para TV Curitiba',
    'escrivaninha home office',
    'painel TV Curitiba',
    'móveis Colombo',
    'móveis São José dos Pinhais',
  ],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://moveirama.com.br',
    siteName: 'Moveirama',
    title: 'Moveirama | Móveis em Curitiba com Entrega em 72h',
    description: 'Loja de móveis em Curitiba com entrega própria em 72h.',
    images: [
      {
        url: 'https://moveirama.com.br/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Moveirama - Móveis para sua casa em Curitiba',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://moveirama.com.br',
  },
};

export default function HomePage() {
  const schemas = [
    organizationSchema,
    localBusinessSchema,
    websiteSchema,
    faqSchema,
    breadcrumbSchema,
    webPageSchema,
    deliveryServiceSchema,
    offerCatalogSchema,
    reviewAggregateSchema,
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemas),
        }}
      />

      <main>
        <HeroSection />
        <TrustBar />
        <CategoriesSection />
        {/* TODO: Adicionar após criar componentes
        <FeaturedProducts />
        <DiferenciaisSection />
        <KnowledgeBlock />
        <HomeFAQ />
        <CoberturaSection />
        <SocialSection />
        <CTAFinal />
        */}
      </main>

      <WhatsAppFloat />
    </>
  );
}
