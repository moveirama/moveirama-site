import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MinhaListaProvider from "@/components/minha-lista/MinhaListaProvider";
import { CartProvider, CartDrawer, ToastProvider } from "@/components/cart";

// ============================================
// LAYOUT v2.3
// Atualizado: 01/02/2026
// Changelog:
// - v2.3 (01/02/2026): OG Image alterado para .jpg (precisa criar o arquivo!)
//                      Description atualizada com "escritório"
// - v2.2 (31/01/2026): noindex dinâmico para preview Vercel
// - v2.1 (31/01/2026): Novos ícones, manifest, themeColor #A85628
// - v2.0 (Jan/2026): Versão inicial
// ============================================

// Detecta se está em produção (domínio oficial) ou preview (Vercel)
const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' 
  || process.env.VERCEL_ENV === 'production'
  || (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL?.includes('vercel.app'));

export const metadata: Metadata = {
  metadataBase: new URL('https://moveirama.com.br'),
  title: {
    // ⭐ v2.3: Title default otimizado
    default: "Móveis em Curitiba com Entrega em 72h | Moveirama",
    template: "%s | Moveirama"
  },
  // ⭐ v2.3: Description com "escritório"
  description: "Loja de móveis em Curitiba com entrega própria em 72h. Racks, painéis, escrivaninhas para apartamentos e escritório. Preço justo e suporte no WhatsApp.",
  keywords: [
    "móveis Curitiba", 
    "móveis em Curitiba",
    "rack para TV", 
    "painel para TV", 
    "escrivaninha", 
    "móveis apartamento", 
    "móveis escritório",
    "loja de móveis Curitiba", 
    "móveis RMC"
  ],
  authors: [{ name: "Moveirama" }],
  creator: "Moveirama",
  publisher: "Moveirama",
  formatDetection: {
    telephone: true,
    email: true,
  },
  
  // ============================================
  // ÍCONES v2.1 - Logo novo (True Squircle Terracota)
  // ============================================
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  manifest: '/site.webmanifest',
  
  // Cor do tema (terracota do novo logo)
  themeColor: '#A85628',
  
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://moveirama.com.br",
    siteName: "Moveirama",
    // ⭐ v2.3: Title otimizado
    title: "Móveis em Curitiba com Entrega em 72h | Moveirama",
    description: "Loja de móveis em Curitiba com entrega própria em 72h. Racks, painéis, escrivaninhas para apartamentos e escritório.",
    images: [
      {
        // ⭐ v2.3: Mudado para .jpg (precisa criar o arquivo!)
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Moveirama - Móveis em Curitiba com Entrega em 72h",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Móveis em Curitiba com Entrega em 72h | Moveirama",
    description: "Loja de móveis em Curitiba com entrega própria em 72h. Racks, painéis, escrivaninhas.",
    images: ["/og-image.jpg"],
  },
  
  // ============================================
  // ROBOTS v2.2 - noindex para preview Vercel
  // ⚠️ IMPORTANTE: Quando for para produção,
  // adicionar ALLOW_INDEXING=true no Vercel
  // ============================================
  robots: {
    index: isProduction,
    follow: isProduction,
    googleBot: {
      index: isProduction,
      follow: isProduction,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  verification: {
    // google: "seu-codigo-google-search-console",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Canonical sempre aponta para o domínio oficial */}
        <link rel="canonical" href="https://moveirama.com.br" />
      </head>
      <body className="overflow-x-hidden">
        <ToastProvider>
          <CartProvider>
            <MinhaListaProvider>
              <Header />
              <div className="overflow-x-hidden">
                {children}
              </div>
              <Footer />
              <CartDrawer />
            </MinhaListaProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
