/**
 * Home Page - Moveirama
 * Squad Dev - Janeiro 2026
 * 
 * ESTRUTURA COMPLETA:
 * - Bloco 1: Hero, TrustBar, Categories
 * - Bloco 2: FeaturedProducts, Diferenciais, Knowledge
 * - Bloco 3: FAQ, Cobertura, Social, CTAFinal
 */

import type { Metadata } from 'next';
import {
  HeroSection,
  TrustBar,
  CategoriesSection,
  FeaturedProducts,
  DiferenciaisSection,
  KnowledgeBlock,
  HomeFAQ,
  CoberturaSection,
  SocialSection,
  CTAFinal,
  WhatsAppFloat,
} from '@/components/home';

export const metadata: Metadata = {
  title: 'Moveirama | Móveis para Apartamentos em Curitiba e Região',
  description:
    'Racks, painéis, escrivaninhas e móveis para apartamentos compactos. Entrega própria em Curitiba e Região Metropolitana em até 3 dias. Preço justo e suporte real no WhatsApp.',
  keywords: [
    'móveis curitiba',
    'rack para tv curitiba',
    'painel para tv',
    'escrivaninha home office',
    'móveis apartamento pequeno',
    'loja de móveis curitiba',
  ],
  openGraph: {
    title: 'Moveirama | Móveis para Apartamentos em Curitiba',
    description:
      'Entrega própria em até 3 dias. Racks, painéis e escrivaninhas com preço justo.',
    url: 'https://moveirama.com.br',
    siteName: 'Moveirama',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <main>
      {/* Schema.org - LocalBusiness */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FurnitureStore',
            name: 'Moveirama',
            description:
              'Loja de móveis para apartamentos em Curitiba e Região Metropolitana',
            url: 'https://moveirama.com.br',
            telephone: '+55-41-98420-9323',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Curitiba',
              addressRegion: 'PR',
              addressCountry: 'BR',
            },
            areaServed: [
              { '@type': 'City', name: 'Curitiba' },
              { '@type': 'City', name: 'São José dos Pinhais' },
              { '@type': 'City', name: 'Colombo' },
              { '@type': 'City', name: 'Pinhais' },
              { '@type': 'City', name: 'Araucária' },
            ],
            priceRange: '$$',
          }),
        }}
      />

      {/* Schema.org - WebSite (SearchAction) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Moveirama',
            url: 'https://moveirama.com.br',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://moveirama.com.br/busca?q={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />

      {/* Bloco 1 */}
      <HeroSection />
      <TrustBar />
      <CategoriesSection />

      {/* Bloco 2 */}
      <FeaturedProducts />
      <DiferenciaisSection />
      <KnowledgeBlock />

      {/* Bloco 3 */}
      <HomeFAQ />
      <CoberturaSection />
      <SocialSection />
      <CTAFinal />

      {/* Flutuante */}
      <WhatsAppFloat />
    </main>
  );
}
