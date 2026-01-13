import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moveirama | Móveis em Curitiba e Região",
  description: "Móveis na caixa com entrega rápida em Curitiba e região metropolitana. Racks, painéis, escrivaninhas e mais. Preço justo e montagem fácil.",
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
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
