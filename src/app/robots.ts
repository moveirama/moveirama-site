// src/app/robots.ts

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Use variável de ambiente para controlar indexação
  // No Vercel: adicione ALLOW_INDEXING=true quando domínio oficial estiver configurado
  const allowIndexing = process.env.ALLOW_INDEXING === 'true'
  
  if (!allowIndexing) {
    // Bloqueia indexação (padrão para domínio temporário)
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }
  
  // Domínio oficial - permitir indexação
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://moveirama.com.br/sitemap.xml',
  }
}
