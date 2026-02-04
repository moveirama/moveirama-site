import type { Metadata } from 'next'

// ============================================
// METADATA SEO: Sobre a Moveirama
// Versão: 1.0
// Data: 03/02/2026
// 
// Conforme spec: SPEC_Pagina_Sobre_Moveirama.md v1.1
// ============================================

export const metadata: Metadata = {
  title: 'Sobre a Moveirama | Móveis em Curitiba e Região',
  description: 'Conheça a Moveirama: loja de móveis em Curitiba com endereço no Juvevê. Entrega própria em até 3 dias úteis para Curitiba e região metropolitana. Retirada disponível com agendamento.',
  alternates: {
    canonical: 'https://moveirama.com.br/sobre-a-moveirama',
  },
  openGraph: {
    title: 'Sobre a Moveirama | Móveis em Curitiba e Região',
    description: 'Conheça a Moveirama: loja de móveis em Curitiba com endereço no Juvevê. Entrega própria em até 3 dias úteis para Curitiba e região metropolitana.',
    url: 'https://moveirama.com.br/sobre-a-moveirama',
    siteName: 'Moveirama',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Moveirama - Móveis em Curitiba com Entrega em 72h',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre a Moveirama | Móveis em Curitiba',
    description: 'Conheça a Moveirama: loja de móveis em Curitiba. Entrega própria em até 3 dias úteis.',
    images: ['/og-image.jpg'],
  },
}

export default function SobreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
