/**
 * home-schemas.ts - Schema.org JSON-LD para Home Page
 * 
 * 9 Schemas implementados:
 * 1. Organization
 * 2. LocalBusiness (FurnitureStore)
 * 3. WebSite
 * 4. FAQPage
 * 5. BreadcrumbList
 * 6. WebPage
 * 7. DeliveryService (OfferShippingDetails)
 * 8. OfferCatalog
 * 9. AggregateRating
 * 
 * Specs: HANDOFF_HomePage_Squad_Dev_v3.md seção 4
 */

// 1. ORGANIZATION SCHEMA
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://moveirama.com.br/#organization",
  "name": "Moveirama",
  "url": "https://moveirama.com.br",
  "logo": "https://moveirama.com.br/logo/moveirama-grafite.svg",
  "description": "Loja de móveis em Curitiba com entrega própria em 72h.",
  "telephone": "+5541984209323",
  "email": "contato@moveirama.com.br",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Curitiba",
    "addressRegion": "PR",
    "addressCountry": "BR"
  },
  "sameAs": [
    "https://www.instagram.com/moveirama",
    "https://www.facebook.com/moveirama",
    "https://wa.me/5541984209323"
  ]
};

// 2. LOCAL BUSINESS SCHEMA
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  "@id": "https://moveirama.com.br/#localbusiness",
  "name": "Moveirama - Móveis em Curitiba",
  "url": "https://moveirama.com.br",
  "telephone": "+5541984209323",
  "priceRange": "R$199 - R$1999",
  "image": "https://moveirama.com.br/og-image.png",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Curitiba",
    "addressRegion": "PR",
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-25.4284",
    "longitude": "-49.2733"
  },
  "areaServed": [
    { "@type": "City", "name": "Curitiba" },
    { "@type": "City", "name": "Colombo" },
    { "@type": "City", "name": "São José dos Pinhais" },
    { "@type": "City", "name": "Pinhais" },
    { "@type": "City", "name": "Araucária" },
    { "@type": "City", "name": "Fazenda Rio Grande" },
    { "@type": "City", "name": "Almirante Tamandaré" },
    { "@type": "City", "name": "Piraquara" },
    { "@type": "City", "name": "Quatro Barras" },
    { "@type": "City", "name": "Campina Grande do Sul" }
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "08:00",
    "closes": "18:00"
  },
  "paymentAccepted": "Pix, Cartão de Crédito, Cartão de Débito",
  "parentOrganization": { "@id": "https://moveirama.com.br/#organization" }
};

// 3. WEBSITE SCHEMA
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://moveirama.com.br/#website",
  "name": "Moveirama",
  "url": "https://moveirama.com.br",
  "publisher": { "@id": "https://moveirama.com.br/#organization" },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://moveirama.com.br/busca?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "inLanguage": "pt-BR"
};

// 4. FAQ SCHEMA
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://moveirama.com.br/#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Qual o prazo de entrega em Curitiba?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Entregamos em 1 a 3 dias úteis (72h) em Curitiba com frota própria."
      }
    },
    {
      "@type": "Question",
      "name": "Vocês entregam em Colombo, São José dos Pinhais e Araucária?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Entregamos em toda a RMC com frota própria: Colombo, SJP, Araucária, Pinhais, Fazenda Rio Grande, Almirante Tamandaré, Piraquara, Quatro Barras e Campina Grande do Sul."
      }
    },
    {
      "@type": "Question",
      "name": "Os móveis vêm montados?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Os móveis vêm na caixa com manual, ferragens e vídeo de montagem. Indicamos montador se precisar."
      }
    },
    {
      "@type": "Question",
      "name": "Quanto custa o frete para Curitiba?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Frete em Curitiba começa em R$ 25. Grátis acima de R$ 299 em Curitiba."
      }
    },
    {
      "@type": "Question",
      "name": "Como sei se o móvel cabe no meu espaço?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Todas as medidas estão na página do produto. Dúvida? Manda no WhatsApp que confirmamos."
      }
    },
    {
      "@type": "Question",
      "name": "Como funciona a troca ou devolução?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "7 dias para trocar conforme CDC. Móvel na embalagem original. WhatsApp para iniciar."
      }
    }
  ]
};

// 5. BREADCRUMB SCHEMA
export const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Início",
      "item": "https://moveirama.com.br"
    }
  ]
};

// 6. WEBPAGE SCHEMA
export const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://moveirama.com.br/#webpage",
  "url": "https://moveirama.com.br",
  "name": "Moveirama | Móveis em Curitiba com Entrega em 72h",
  "description": "Loja de móveis em Curitiba com entrega própria em 72h. Racks, escrivaninhas, painéis para apartamentos.",
  "isPartOf": { "@id": "https://moveirama.com.br/#website" },
  "about": { "@id": "https://moveirama.com.br/#organization" },
  "primaryImageOfPage": {
    "@type": "ImageObject",
    "url": "https://moveirama.com.br/og-image.png"
  },
  "inLanguage": "pt-BR"
};

// 7. DELIVERY SERVICE SCHEMA
export const deliveryServiceSchema = {
  "@context": "https://schema.org",
  "@type": "DeliveryChargeSpecification",
  "appliesToDeliveryMethod": {
    "@type": "DeliveryMethod",
    "name": "Frota Própria Moveirama"
  },
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": "-25.4284",
      "longitude": "-49.2733"
    },
    "geoRadius": "50000"
  },
  "deliveryTime": {
    "@type": "ShippingDeliveryTime",
    "transitTime": {
      "@type": "QuantitativeValue",
      "minValue": 1,
      "maxValue": 3,
      "unitCode": "d"
    }
  },
  "price": "25.00",
  "priceCurrency": "BRL"
};

// 8. OFFER CATALOG SCHEMA
export const offerCatalogSchema = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  "name": "Catálogo de Móveis Moveirama",
  "itemListElement": [
    {
      "@type": "OfferCatalog",
      "name": "Móveis para Casa",
      "description": "Racks, painéis, mesas de centro, estantes",
      "url": "https://moveirama.com.br/moveis-para-casa"
    },
    {
      "@type": "OfferCatalog",
      "name": "Móveis para Escritório",
      "description": "Escrivaninhas, cadeiras, gaveteiros",
      "url": "https://moveirama.com.br/moveis-para-escritorio"
    }
  ]
};

// 9. AGGREGATE RATING SCHEMA (placeholder)
export const reviewAggregateSchema = {
  "@context": "https://schema.org",
  "@type": "AggregateRating",
  "itemReviewed": { "@id": "https://moveirama.com.br/#localbusiness" },
  "ratingValue": "4.8",
  "reviewCount": "127",
  "bestRating": "5",
  "worstRating": "1"
};
