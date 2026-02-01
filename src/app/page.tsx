/**
 * Home Page - Moveirama
 * Squad Dev - Fevereiro 2026
 * 
 * ⭐ v2.1 (01/02/2026) - CORREÇÕES SEO:
 * - Title Tag otimizado: "Móveis em Curitiba com Entrega em 72h"
 * - Meta Description com "escritório" e "apartamentos compactos"
 * - Schema LocalBusiness centralizado (removido inline)
 * - OG Image atualizado para .jpg
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

// ⭐ v2.1: Import do schema centralizado
import { 
  localBusinessSchema, 
  websiteSchema 
} from '@/lib/schemas/home-schemas';

// ============================================
// ⭐ v2.1: METADATA OTIMIZADA PARA SEO
// ============================================
export const metadata: Metadata = {
  // ⭐ v2.1: Title Tag com "Móveis em Curitiba com Entrega em 72h"
  title: 'Móveis em Curitiba com Entrega em 72h | Racks e Escrivaninhas | Moveirama',
  
  // ⭐ v2.1: Description com "escritório" e "apartamentos compactos"
  description: 'Móveis para apartamentos compactos e escritório em Curitiba e Região Metropolitana. Racks para TV, painéis, escrivaninhas. Entrega própria em até 3 dias. Preço justo e suporte no WhatsApp.',
  
  keywords: [
    'móveis curitiba',
    'móveis em curitiba',
    'loja de móveis curitiba',
    'rack para tv curitiba',
    'painel para tv',
    'escrivaninha home office',
    'móveis apartamento pequeno',
    'móveis para escritório',
    'móveis colombo',
    'móveis são josé dos pinhais',
  ],
  
  openGraph: {
    title: 'Móveis em Curitiba com Entrega em 72h | Moveirama',
    description: 'Racks, painéis, escrivaninhas para apartamentos compactos e escritório. Entrega própria em Curitiba e RMC.',
    url: 'https://moveirama.com.br',
    siteName: 'Moveirama',
    locale: 'pt_BR',
    type: 'website',
    // ⭐ v2.1: OG Image corrigido (precisa criar o arquivo)
    images: [
      {
        url: 'https://moveirama.com.br/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Moveirama - Móveis em Curitiba com Entrega em 72h',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Móveis em Curitiba com Entrega em 72h | Moveirama',
    description: 'Racks, painéis, escrivaninhas. Entrega própria em Curitiba e RMC.',
    images: ['https://moveirama.com.br/og-image.jpg'],
  },
};

export default function HomePage() {
  return (
    <main>
      {/* ============================================
          ⭐ v2.1: SCHEMAS CENTRALIZADOS
          LocalBusiness agora vem do home-schemas.ts
          ============================================ */}
      
      {/* Schema.org - LocalBusiness (com endereço completo) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      {/* Schema.org - WebSite (SearchAction) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
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
