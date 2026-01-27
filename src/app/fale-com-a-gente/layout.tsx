import type { Metadata } from 'next'

// ============================================
// METADATA SEO
// ============================================

export const metadata: Metadata = {
  title: 'Fale com a Gente | Moveirama - Atendimento WhatsApp Curitiba',
  description: 'Dúvida sobre medidas, entrega ou montagem? Fale com a Moveirama pelo WhatsApp. Atendimento de domingo a domingo. Curitiba e Região Metropolitana.',
  alternates: {
    canonical: 'https://moveirama.com.br/fale-com-a-gente',
  },
  openGraph: {
    title: 'Fale com a Gente | Moveirama',
    description: 'Atendimento rápido pelo WhatsApp. Curitiba e Região Metropolitana.',
    url: 'https://moveirama.com.br/fale-com-a-gente',
    siteName: 'Moveirama',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function FaleComAGenteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
