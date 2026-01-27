import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MinhaListaProvider from "@/components/minha-lista/MinhaListaProvider";
import { CartProvider, CartDrawer, ToastProvider } from "@/components/cart";

export const metadata: Metadata = {
  metadataBase: new URL('https://moveirama.com.br'),
  title: {
    default: "Moveirama | Móveis em Curitiba e Região",
    template: "%s | Moveirama"
  },
  description: "Loja de móveis em Curitiba com entrega rápida. Racks, painéis, escrivaninhas e mais. Preço justo, montagem fácil e suporte no WhatsApp.",
  keywords: ["móveis Curitiba", "rack para TV", "painel para TV", "escrivaninha", "móveis baratos", "loja de móveis Curitiba", "móveis RMC"],
  authors: [{ name: "Moveirama" }],
  creator: "Moveirama",
  publisher: "Moveirama",
  formatDetection: {
    telephone: true,
    email: true,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://moveirama.com.br",
    siteName: "Moveirama",
    title: "Moveirama | Móveis em Curitiba e Região",
    description: "Loja de móveis em Curitiba com entrega rápida. Racks, painéis, escrivaninhas e mais. Preço justo, montagem fácil e suporte no WhatsApp.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Moveirama - Móveis em Curitiba",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moveirama | Móveis em Curitiba e Região",
    description: "Loja de móveis em Curitiba com entrega rápida. Racks, painéis, escrivaninhas e mais.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
