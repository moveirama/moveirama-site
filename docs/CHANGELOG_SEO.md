# ðŸ“ˆ CHANGELOG SEO â€” Moveirama

> **HistÃ³rico de implementaÃ§Ãµes SEO/AIO e UX do projeto**  
> **Última atualização:** 04 de Fevereiro de 2026  
> **Versão atual:** 2.20.0

---

## VisÃ£o Geral

Este documento registra todas as implementaÃ§Ãµes de SEO tÃ©cnico, otimizaÃ§Ã£o para IA (AIO) e melhorias de UX/ConversÃ£o do site Moveirama.

### Schemas Implementados (PÃ¡gina de Produto)

| Schema | Status | Arquivo |
|--------|--------|---------|
| **ProductGroup** | âœ… Ativo | `seo.ts` â†’ `generateProductGroupSchema()` |
| Product | âœ… Ativo | `seo.ts` â†’ `generateProductSchema()` |
| **Review** | âœ… Ativo | `seo.ts` â†’ `generateReviewSchema()` |
| BreadcrumbList | âœ… Ativo | `ProductPageContent.tsx` |
| FAQPage | âœ… Ativo | `seo.ts` â†’ `generateProductFAQs()` |
| VideoObject | âœ… Ativo | `seo.ts` â†’ `generateVideoSchema()` |
| HowTo | âœ… Ativo | `seo.ts` â†’ `generateHowToSchema()` |
| AggregateRating | âœ… Condicional | Dentro do Product, se `rating_count > 0` |
| FurnitureStore | âœ… Ativo | Home e pÃ¡ginas institucionais |


### Features de UX/Conversão

| Feature | Status | Versão |
|---------|--------|--------|
| **Carrossel Queridinhos de Curitiba** | ✅ Ativo | **v2.20** |
| **Seletor de Variantes de Cor** | ✅ Ativo | **v2.16** |
| Calculadora de Frete | ✅ Ativo | v2.x |
| Minha Lista (Favoritos) | ✅ Ativo | v2.6 |
| Reviews e Avaliações | ✅ Ativo | v2.8 |
| Carrinho + Checkout | ✅ Ativo | v2.9/v2.10 |

---

## v2.20 — 04/02/2026

### 🏆 Carrossel "Os Queridinhos de Curitiba" (NOVO)

**Objetivo:** Seção de prova social na Home Page destacando os produtos mais vendidos, com badges de autoridade local e navegação fluida.

**Localização:** Home Page, após seção de Categorias

**Validação:** ✅ Desktop e Mobile funcionando com navegação completa

**Implementação:**

#### Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `src/components/home/QueridinhosCuritiba.tsx` | Componente principal (Server Component) |
| `src/components/home/QueridinhoCard.tsx` | Card individual com badge, preço, favorito |
| `src/components/home/QueridinhoNav.tsx` | Navegação (Client Component) - setas e dots |
| `src/lib/supabase.ts` | Função `getBestSellers()` com lista fixa de produtos |

#### Características

| Feature | Desktop | Mobile |
|---------|---------|--------|
| Cards visíveis | 4 | 1.2 (peek) |
| Navegação | Setas < > | Swipe + Dots |
| Badges | ✅ | ✅ |
| Favoritos (coração) | ✅ | ✅ |

#### Lista Fixa de Produtos (Curadoria)

| # | Produto | Badge |
|---|---------|-------|
| 1 | Rack Duetto Cinamomo C / Off White | 🏆 TOP 1 VENDAS (dourado) |
| 2 | Rack Theo Cinamomo C / Off White | 💚 Favorito Curitibano |
| 3 | Escrivaninha Nomad Cinamomo C / Off White | 💚 Favorito Curitibano |
| 4 | Escrivaninha Match Pinho C / Preto | 💚 Favorito Curitibano |
| 5 | Buffet Charlotte Cinamomo C / Off White | 💚 Favorito Curitibano |
| 6 | Mesa Apoio Trama Cinamomo C / Off White | Sem badge |

#### Badges Implementados

| Badge | Visual | Posição |
|-------|--------|---------|
| TOP 1 VENDAS | Gradiente dourado + Troféu | Produto #1 |
| FAVORITO CURITIBANO | Verde Sálvia + Coração | Produtos #2 a #5 |

#### Estrutura do CSS (globals.css)

Seções adicionadas:
- `.queridinhos` — Container principal
- `.queridinhos__header` — Título + setas
- `.queridinhos__track` — Lista horizontal scrollável
- `.queridinhos__item` — Card wrapper
- `.queridinhos__card` — Card visual
- `.queridinhos__badge` — TOP 1 / Favorito
- `.queridinhos__nav` — Setas desktop
- `.queridinhos__dots` — Dots mobile

#### Integração com Minha Lista

- Coração no card conecta com sistema de favoritos existente
- Usa `isInMinhaLista()` e `toggleMinhaLista()` de `@/lib/minha-lista`
- Sincroniza com localStorage

**Benefícios UX/Conversão:**

| Benefício | Impacto |
|-----------|---------|
| Prova social local | "Curitibanos escolhem" aumenta confiança |
| Curadoria manual | Controle total sobre produtos destacados |
| Badges de autoridade | TOP 1 VENDAS gera urgência |
| Navegação fluida | Desktop setas, Mobile swipe nativo |
| Integração favoritos | Usuário salva para comparar depois |
| Entrega 72h visível | Reforça diferencial local |

**Arquivos alterados:**

| Arquivo | Alteração |
|---------|-----------|
| `src/app/page.tsx` | Adicionado `<QueridinhosCuritiba />` |
| `src/app/globals.css` | +380 linhas de CSS do carrossel |
| `src/lib/supabase.ts` | Nova função `getBestSellers()` |

---

## v2.19 â€” 03/02/2026

### ðŸ¢ PÃ¡gina Institucional "Sobre a Moveirama" (NOVO)

**Objetivo:** PÃ¡gina institucional com dados da empresa para E-E-A-T (Google), conformidade legal (Decreto 7.962/2013) e FurnitureStore Schema completo.

**URL:** `/sobre-a-moveirama`

**ValidaÃ§Ã£o:** âœ… FurnitureStore Schema com @id para referÃªncia em Product schemas

**ImplementaÃ§Ã£o:**

#### Arquivos criados/alterados

| Arquivo | DescriÃ§Ã£o |
|---------|-----------|
| `src/app/sobre-a-moveirama/page.tsx` | PÃ¡gina completa com 6 seÃ§Ãµes |
| `src/app/sobre-a-moveirama/layout.tsx` | Metadata SEO (title, description, canonical, OG) |
| `src/components/Footer.tsx` | v2.2: Link para /sobre + endereÃ§o completo |

#### 6 SeÃ§Ãµes implementadas

| # | SeÃ§Ã£o | ConteÃºdo |
|---|-------|----------|
| 1 | Hero | H1 "Sobre a Moveirama" + subtÃ­tulo |
| 2 | Nossa HistÃ³ria | 2 cards timeline (2024 / Hoje) |
| 3 | Nossos Diferenciais | 4 cards (Entrega, Medidas, WhatsApp, NF) |
| 4 | Ãrea de Atendimento | 10 cidades em pills |
| 5 | Trust Block | CNPJ, endereÃ§o, contatos, redes sociais |
| 6 | CTA Final | 2 botÃµes (Casa / EscritÃ³rio) |

#### FurnitureStore Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  "@id": "https://moveirama.com.br/#organization",
  "name": "Moveirama",
  "legalName": "Moveirama Eureka MÃ³veis LTDA",
  "taxID": "61.154.643/0001-84",
  "foundingDate": "2024",
  "email": "atendimento@moveirama.com.br",
  "telephone": "+55-41-98420-9323",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua BarÃ£o de GuaraÃºna, 517",
    "addressLocality": "Curitiba",
    "addressRegion": "PR",
    "postalCode": "80030-310"
  },
  "areaServed": ["10 cidades como City objects"],
  "knowsAbout": ["MÃ³veis para casa", "MÃ³veis para escritÃ³rio", "..."],
  "hasOfferCatalog": { "..." },
  "potentialAction": { "@type": "SearchAction", "..." }
}
```

**SeguranÃ§a:**
- Email com anti-spam (Base64 + reveal button)
- Noscript fallback: "atendimento [arroba] moveirama.com.br"

**Conformidade Legal:**
- Decreto Federal 7.962/2013: CNPJ + endereÃ§o completo visÃ­veis
- Footer atualizado com endereÃ§o completo (nÃ£o apenas bairro)

**BenefÃ­cios SEO/AIO:**

| BenefÃ­cio | Impacto |
|-----------|---------|
| E-E-A-T | TransparÃªncia aumenta confianÃ§a do Google |
| @id Organization | Product schemas podem referenciar seller |
| SEO Local | 10 cidades reforÃ§am autoridade regional |
| knowsAbout | IA entende expertise da loja |
| SearchAction | Sitelinks search box no Google |

---

## v2.18 â€” 02/02/2026

### â­ Review Schema (NOVO)

**Objetivo:** Exibir avaliaÃ§Ãµes reais de clientes nos resultados do Google com rich snippets de estrelas e reviews individuais.

**ValidaÃ§Ã£o:** âœ… **7 schemas detectados, 0 erros, 0 avisos**

| Schema Detectado | Status |
|------------------|--------|
| ProductGroup | âœ… 0 erros |
| VideoObject | âœ… 0 erros |
| FurnitureStore | âœ… 0 erros |
| BreadcrumbList | âœ… 0 erros |
| **Product** (com AggregateRating + Review) | âœ… 0 erros |
| FAQPage | âœ… 0 erros |

**ImplementaÃ§Ã£o:**

#### Nova funÃ§Ã£o em `seo.ts` (v3.5)
```typescript
export interface ReviewForSchema {
  author_name: string
  author_city?: string | null
  rating: number
  title?: string | null
  content?: string | null
  is_verified_purchase?: boolean
  created_at?: string
}

export function generateReviewSchema(reviews: ReviewForSchema[]): object[]
```

**Estrutura do Schema (dentro do Product):**
```json
{
  "@type": "Product",
  "name": "Rack Charlotte...",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.8,
    "reviewCount": 4,
    "bestRating": 5,
    "worstRating": 1
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": 5,
        "bestRating": 5,
        "worstRating": 1
      },
      "author": {
        "@type": "Person",
        "name": "PatrÃ­cia"
      },
      "reviewBody": "MÃ³vel lindo e fÃ¡cil de montar!",
      "datePublished": "2026-01-15"
    }
  ]
}
```

**LÃ³gica de renderizaÃ§Ã£o:**
- SÃ³ aparece se produto tem reviews aprovados (`is_approved = true`)
- AggregateRating calculado a partir dos reviews reais
- AtÃ© 5 reviews individuais incluÃ­dos no schema
- Cidade do autor incluÃ­da quando disponÃ­vel (SEO local)
- Badge "Compra Verificada" quando `is_verified_purchase = true`

**Mapeamento de Tipos (Frontend â†’ Schema):**
```typescript
// Interface Review (frontend - camelCase)
customerName â†’ author_name
customerCity â†’ author_city  
comment â†’ content
isVerified â†’ is_verified_purchase
createdAt â†’ created_at
```

**Arquivos alterados:**

| Arquivo | VersÃ£o | AlteraÃ§Ã£o |
|---------|--------|-----------|
| `src/lib/seo.ts` | v3.5 | +`generateReviewSchema()`, +`ReviewForSchema` interface |
| `src/components/ProductPageContent.tsx` | v2.18 | IntegraÃ§Ã£o do Review Schema com mapeamento correto |
| `src/lib/reviews.ts` | v1.2 | Busca reviews da tabela `reviews` (nÃ£o `product_reviews`) |

**Tabela do Banco:**
```sql
-- Tabela correta: reviews (283 registros)
-- NÃƒO usar: product_reviews (vazia)

SELECT * FROM reviews 
WHERE product_id = ? AND is_approved = true
ORDER BY created_at DESC
LIMIT 5;
```

**BenefÃ­cios SEO:**

| BenefÃ­cio | Impacto |
|-----------|---------|
| Rich snippet com estrelas | â­â­â­â­â­ 4.8 (4 avaliaÃ§Ãµes) nos resultados |
| Reviews individuais | Google pode exibir trechos das avaliaÃ§Ãµes |
| Prova social | Aumenta confianÃ§a e CTR |
| SEO local | Cidade do cliente reforÃ§a autoridade regional |
| Compra verificada | Badge de autenticidade |

**Cobertura atual:**
| MÃ©trica | Valor |
|---------|-------|
| Total de reviews no banco | 283 |
| Produtos com reviews | ~70 |
| MÃ©dia de reviews por produto | ~4 |

**Exemplo testado:**
- Produto: Rack Charlotte Carvalho C / Menta
- Reviews: 4 avaliaÃ§Ãµes aprovadas
- MÃ©dia: 4.8 estrelas
- Autores: PatrÃ­cia (Curitiba-PortÃ£o), Lucas M. (Colombo), Fernanda (Curitiba-SÃ­tio Cercado), Diego (Pinhais)

---

## v2.17 â€” 02/02/2026

### ðŸ·ï¸ ProductGroup Schema (NOVO)

**Objetivo:** Informar ao Google que variantes de cor pertencem ao mesmo modelo de produto. Permite rich snippets como "DisponÃ­vel em 4 cores" e carrossel de variantes nos resultados de busca.

**ValidaÃ§Ã£o:** âœ… **7 schemas detectados, 0 erros, 0 avisos**

| Schema Detectado | Status |
|------------------|--------|
| ProductGroup | âœ… 0 erros |
| VideoObject | âœ… 0 erros |
| FurnitureStore | âœ… 0 erros |
| BreadcrumbList | âœ… 0 erros |
| Product | âœ… 0 erros |
| FAQPage | âœ… 0 erros |

**ImplementaÃ§Ã£o:**

#### Nova funÃ§Ã£o em `seo.ts` (v3.4)
```typescript
export function generateProductGroupSchema(
  product: ProductSEOInput,
  colorVariants: Array<{
    name: string
    slug: string
    color_name: string | null
    price: number
    image?: string
  }>,
  canonicalUrl: string
): object | null
```

**Estrutura do Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "ProductGroup",
  "name": "Rack Charlotte",
  "description": "DisponÃ­vel em 4 cores...",
  "url": "https://moveirama.com.br/racks-tv/rack-charlotte-cinamomo",
  "brand": { "@type": "Brand", "name": "Artely" },
  "productGroupID": "Rack Charlotte",
  "variesBy": ["https://schema.org/color"],
  "hasVariant": [
    {
      "@type": "Product",
      "name": "Rack Charlotte - Cinamomo",
      "color": "Cinamomo",
      "url": "https://moveirama.com.br/racks-tv/rack-charlotte-cinamomo",
      "image": "https://...",
      "offers": {
        "@type": "Offer",
        "price": 299.00,
        "priceCurrency": "BRL",
        "availability": "https://schema.org/InStock"
      }
    }
  ]
}
```

**LÃ³gica de renderizaÃ§Ã£o:**
- SÃ³ aparece se produto tem 2+ variantes de cor
- `productGroupID` = campo `model_group` do banco
- `variesBy` = sempre `color` (por enquanto)
- Cada variante vira um `Product` dentro de `hasVariant`

**Arquivos alterados:**

| Arquivo | VersÃ£o | AlteraÃ§Ã£o |
|---------|--------|-----------|
| `src/lib/seo.ts` | v3.4 | +`generateProductGroupSchema()` |
| `src/lib/supabase.ts` | v2.7 | +`price` em `ProductColorVariant` |
| `src/components/ProductPageContent.tsx` | v2.17 | IntegraÃ§Ã£o do ProductGroup Schema |

**BenefÃ­cios SEO:**

| BenefÃ­cio | Impacto |
|-----------|---------|
| Rich snippet "X cores disponÃ­veis" | Maior CTR nos resultados |
| Carrossel de variantes | Destaque visual no Google |
| PreÃ§os por cor | UsuÃ¡rio vÃª opÃ§Ãµes antes de clicar |
| Estrutura semÃ¢ntica | Google entende relaÃ§Ã£o entre produtos |
| Competitivo | Mesmo padrÃ£o de grandes e-commerces |

---

## v2.16 â€” 02/02/2026

### ðŸŽ¨ Seletor de Variantes de Cor (NOVO)

**Objetivo:** Permitir navegaÃ§Ã£o entre variantes de cor do mesmo modelo SEM voltar para listagem. Aumentar conversÃ£o reduzindo fricÃ§Ã£o na jornada de compra.

**Problema resolvido:**
- Cliente via "Rack Charlotte Cinamomo" mas queria ver em "Pinho/Off White"
- Tinha que voltar para listagem, encontrar o produto, clicar de novo
- Agora: clica na miniatura da cor desejada e navega direto

**ImplementaÃ§Ã£o completa em 4 passos:**

#### Passo 1: Banco de Dados
Novos campos na tabela `products`:
```sql
ALTER TABLE products ADD COLUMN model_group TEXT;
ALTER TABLE products ADD COLUMN color_name TEXT;
CREATE INDEX idx_products_model_group ON products(model_group);
```

**PopulaÃ§Ã£o automÃ¡tica:**
- `model_group`: ExtraÃ­do do nome (ex: "Rack Charlotte" de "Rack Charlotte - Cinamomo")
- `color_name`: ExtraÃ­do da parte apÃ³s " - " (ex: "Cinamomo" ou "Pinho C / Off White")

**Cobertura:**
| MÃ©trica | Valor |
|---------|-------|
| Produtos com `model_group` | ~180 |
| Produtos com variantes (2+ cores) | ~60 modelos |
| Produtos cor Ãºnica | Sem seletor (comportamento correto) |

#### Passo 2: Backend
Nova funÃ§Ã£o em `src/lib/supabase.ts`:
```typescript
export async function getSiblingVariants(
  modelGroup: string | null | undefined
): Promise<ProductColorVariant[]>
```

**Retorna:** Array de variantes do mesmo modelo com:
- `id`, `slug`, `name`
- `model_group`, `color_name`
- `price` (v2.7 - para ProductGroup Schema)
- `images[0].cloudinary_path` (primeira imagem para miniatura)

#### Passo 3: Frontend
Novo componente `src/components/VariantSelector.tsx`:

**Visual:**
- Miniaturas 64x64px com foto REAL do produto em cada cor
- Nome da cor embaixo (truncado com "...")
- Borda verde sÃ¡lvia na variante atual
- Hover com elevaÃ§Ã£o sutil

**Comportamento:**
- SÃ³ aparece se produto tem 2+ variantes
- Clique navega para URL da variante (SEO-friendly)
- Label "Cores disponÃ­veis:" acima das miniaturas

**CSS:** Adicionado ao final de `globals.css` (seÃ§Ã£o variant-selector)

#### Passo 4: SEO (seo.ts v3.3)
Atualizado para usar `color_name` do banco:

```typescript
// Prioridade: color_name > variant_name > parsing do nome
const colorPart = color_name || variant_name || colorFromName
```

**FunÃ§Ãµes atualizadas:**
- `generateProductH1()` â€” usa `color_name`
- `generateProductTitle()` â€” usa `color_name`
- `generateProductSchema()` â€” campo "color" usa `color_name`

**Nova funÃ§Ã£o helper:**
```typescript
export function extractModelName(fullName: string, colorName?: string | null): string
```

**Arquivos alterados:**
| Arquivo | AlteraÃ§Ã£o |
|---------|-----------|
| `src/lib/supabase.ts` | v2.6: +`getSiblingVariants()`, +type `ProductColorVariant` |
| `src/lib/seo.ts` | v3.3: +`color_name` em interfaces, prioridade em H1/Title/Schema |
| `src/components/VariantSelector.tsx` | **NOVO** componente completo |
| `src/components/ProductPageContent.tsx` | IntegraÃ§Ã£o do VariantSelector |
| `src/app/[category]/[...slug]/page.tsx` | Query inclui `model_group`, `color_name` |
| `src/app/globals.css` | +seÃ§Ã£o `.variant-selector` |

**BenefÃ­cios:**
| BenefÃ­cio | Impacto |
|-----------|---------|
| Reduz fricÃ§Ã£o | Cliente compara cores sem sair da PDP |
| Aumenta conversÃ£o | Menos abandonos por "quero ver outra cor" |
| UX premium | Miniaturas reais > bolinhas de cor genÃ©ricas |
| SEO mantido | Cada cor tem URL prÃ³pria (canÃ´nica) |
| Mobile-first | Touch targets 64px, scroll horizontal |

---

## v2.15 â€” 02/02/2026

### ðŸ”§ HowTo Schema (VÃ­deo de Montagem)

**Objetivo:** Capturar buscas informacionais de montagem e gerar rich snippet "Como fazer" no Google.

**Buscas capturadas:**
- "como montar rack"
- "montagem painel TV"
- "como montar escrivaninha"
- "vÃ­deo montagem mÃ³vel artely"

**ImplementaÃ§Ã£o:**
- Nova funÃ§Ã£o `generateHowToSchema()` em `src/lib/seo.ts`
- RenderizaÃ§Ã£o condicional em `ProductPageContent.tsx`
- Campo do banco: `products.assembly_video_url`

**Cobertura:**
| Fornecedor | Total | Com vÃ­deo de montagem |
|------------|-------|----------------------|
| Artely | 206 | **179** (87%) |
| Artany | 165 | **80** (48%) |
| **Total** | 371 | **259** (70%) |

**Estrutura do Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Como montar o {Nome do Produto}",
  "description": "Passo a passo de montagem. NÃ­vel {fÃ¡cil/mÃ©dio/difÃ­cil}, tempo estimado: {X} minutos.",
  "totalTime": "PT45M",
  "tool": [
    { "@type": "HowToTool", "name": "Chave Phillips" },
    { "@type": "HowToTool", "name": "Martelo de borracha (opcional)" }
  ],
  "supply": [
    { "@type": "HowToSupply", "name": "Manual de instruÃ§Ãµes (incluso)" },
    { "@type": "HowToSupply", "name": "Kit de ferragens (incluso)" }
  ],
  "step": [
    { "@type": "HowToStep", "name": "Confira as peÃ§as", "text": "..." },
    { "@type": "HowToStep", "name": "Assista o vÃ­deo completo", "text": "..." },
    { "@type": "HowToStep", "name": "Organize o espaÃ§o", "text": "..." },
    { "@type": "HowToStep", "name": "Siga o manual passo a passo", "text": "..." },
    { "@type": "HowToStep", "name": "Finalize e posicione", "text": "..." }
  ],
  "video": {
    "@type": "VideoObject",
    "name": "VÃ­deo de Montagem - {Produto} | Moveirama",
    "thumbnailUrl": "https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg",
    "contentUrl": "{URL_YOUTUBE}",
    "embedUrl": "https://www.youtube.com/embed/{VIDEO_ID}"
  }
}
```

**BenefÃ­cios:**
- Rich snippet "Como fazer" nos resultados do Google
- Captura intent informacional (topo do funil)
- Reduz medo de montagem (dor #1 do cliente Classe C/D)
- Diferencial vs concorrentes sem vÃ­deo de montagem
- Thumbnail de vÃ­deo aumenta CTR

**Arquivos alterados:**
- `src/lib/seo.ts` â€” Nova funÃ§Ã£o `generateHowToSchema()`
- `src/components/ProductPageContent.tsx` â€” RenderizaÃ§Ã£o condicional

---

## v2.14 â€” 02/02/2026

### ðŸŽ¬ VideoObject Schema

**Objetivo:** Rich snippets de vÃ­deo no Google para produtos com vÃ­deo do fabricante.

**ImplementaÃ§Ã£o:**
- Nova funÃ§Ã£o `generateVideoSchema()` em `src/lib/seo.ts`
- RenderizaÃ§Ã£o condicional em `ProductPageContent.tsx`
- Campo do banco: `products.video_product_url`

**Estrutura do Schema:**
```json
{
  "@type": "VideoObject",
  "name": "{Nome do Produto} - VÃ­deo do Produto | Moveirama",
  "description": "Veja o {Nome} em detalhes. MÃ³vel para Curitiba e RegiÃ£o Metropolitana com entrega prÃ³pria em atÃ© 72h.",
  "thumbnailUrl": "https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg",
  "uploadDate": "{DATA_ATUAL}",
  "contentUrl": "{URL_YOUTUBE}",
  "embedUrl": "https://www.youtube.com/embed/{VIDEO_ID}",
  "publisher": {
    "@type": "Organization",
    "name": "Moveirama"
  }
}
```

**BenefÃ­cios:**
- Thumbnail de vÃ­deo nos resultados do Google
- Maior CTR em buscas
- Diferencial vs concorrentes sem vÃ­deo

---

## v2.9 â€” 01/02/2026

### ðŸŽ¯ EstratÃ©gia SEO AvanÃ§ada â€” 5 Melhorias

#### 1. FAQ de ComparaÃ§Ã£o
**Objetivo:** Capturar buscas comparativas ("rack X vs rack Y", "diferenÃ§a entre racks")

**ImplementaÃ§Ã£o:**
- Nova pergunta dinÃ¢mica baseada na largura do produto
- Exemplo: "Qual a diferenÃ§a do Rack Theo para outros racks de 1,6m?"

**LÃ³gica:**
```typescript
// Agrupa por faixa de largura
< 120cm â†’ "compactos (atÃ© 1,2m)"
120-150cm â†’ "mÃ©dios (1,2m a 1,5m)"  
> 150cm â†’ "grandes (acima de 1,5m)"
```

#### 2. Bairros de Curitiba nas FAQs
**Objetivo:** Prova social regional + SEO local

**ImplementaÃ§Ã£o:**
- Pool de 15 bairros reais de Curitiba
- RotaÃ§Ã£o determinÃ­stica por produto (baseada no slug)
- Aparece na FAQ de entrega

**Bairros incluÃ­dos:**
Cajuru, BoqueirÃ£o, Xaxim, Pinheirinho, CIC, SÃ­tio Cercado, PortÃ£o, Ãgua Verde, Batel, Centro, Santa Felicidade, Boa Vista, Bacacheri, CapÃ£o Raso, Fazendinha

**Exemplo de output:**
> "Entregamos em toda Curitiba (Cajuru, BoqueirÃ£o, Xaxim...) e RegiÃ£o Metropolitana."

#### 3. Brand = Fabricante (Artely/Artany)
**Objetivo:** Aparecer em buscas por marca do fabricante

**ImplementaÃ§Ã£o:**
- Campo `brand` no Product Schema usa `product.supplier?.name`
- Moveirama aparece como `seller`, nÃ£o como `brand`

**Estrutura:**
```json
{
  "brand": { "@type": "Brand", "name": "Artely" },
  "offers": {
    "seller": { "@type": "Organization", "name": "Moveirama" }
  }
}
```

#### 4. MerchantReturnPolicy
**Objetivo:** Badge de "DevoluÃ§Ã£o GrÃ¡tis" no Google Shopping

**ImplementaÃ§Ã£o:**
- PolÃ­tica de 7 dias (direito do consumidor)
- Tipo: `MerchantReturnFiniteReturnWindow`
- Custo de devoluÃ§Ã£o: grÃ¡tis

**Estrutura:**
```json
{
  "hasMerchantReturnPolicy": {
    "@type": "MerchantReturnPolicy",
    "merchantReturnDays": 7,
    "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
    "returnMethod": "https://schema.org/ReturnByMail",
    "returnFees": "https://schema.org/FreeReturn"
  }
}
```

#### 5. Prazo de Entrega: 72h
**Objetivo:** Maior especificidade + urgÃªncia

**MudanÃ§a:**
- Antes: "atÃ© 3 dias Ãºteis"
- Depois: "em atÃ© 72h" / "entrega prÃ³pria em atÃ© 72h"

**Onde aparece:**
- Meta description
- FAQs
- VideoObject description
- Textos de confianÃ§a

---

## v2.x â€” ImplementaÃ§Ãµes Anteriores

### Product Schema BÃ¡sico
- Nome, descriÃ§Ã£o, preÃ§o, imagens
- SKU, disponibilidade, condiÃ§Ã£o
- Offers com preÃ§o e parcelamento

### BreadcrumbList
- NavegaÃ§Ã£o estruturada: InÃ­cio â†’ Categoria â†’ Subcategoria â†’ Produto
- Implementado diretamente no `ProductPageContent.tsx`

### FAQPage Schema
- GeraÃ§Ã£o dinÃ¢mica baseada nos dados do produto
- Perguntas sobre: TV, medidas, material, montagem, entrega, garantia
- FunÃ§Ã£o `generateProductFAQs()` em `seo.ts`

### AggregateRating (Condicional)
- SÃ³ renderiza se `rating_count > 0`
- Evita penalizaÃ§Ã£o do Google por rating falso
- Campos: `rating_average`, `rating_count`

### Meta Tags Otimizadas
- Title: `{H1} | Moveirama`
- Description: PreÃ§o + parcelamento + prazo + regiÃ£o
- Canonical URL
- Open Graph tags

### FurnitureStore Schema
- InformaÃ§Ãµes da empresa
- Ãrea de atuaÃ§Ã£o: Curitiba + RMC
- HorÃ¡rio de funcionamento
- Contato WhatsApp

---

## ðŸ“ Arquivos Principais

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/lib/seo.ts` | FunÃ§Ãµes de geraÃ§Ã£o de Schema (v3.5) |
| `src/lib/supabase.ts` | Queries + `getSiblingVariants()` (v2.7) |
| `src/lib/reviews.ts` | Busca reviews da tabela `reviews` (v1.2) |
| `src/components/ProductPageContent.tsx` | RenderizaÃ§Ã£o dos JSON-LD + VariantSelector (v2.18) |
| `src/components/VariantSelector.tsx` | Seletor de variantes de cor |
| `src/components/ProductFAQ.tsx` | Componente visual do FAQ |
| `src/app/[category]/[...slug]/page.tsx` | generateMetadata() + query de produto |
| `src/app/globals.css` | CSS do Design System + variant-selector |

---

## ðŸ§ª Como Testar

### Rich Results Test (Google)
1. Acesse: https://search.google.com/test/rich-results
2. Cole a URL do produto
3. Verifique se detecta: ProductGroup, Product, FAQ, Video, HowTo

### Schema Validator
1. Acesse: https://validator.schema.org/
2. Cole o JSON-LD da pÃ¡gina
3. Verifique se nÃ£o hÃ¡ erros

### View Source
1. Abra a pÃ¡gina do produto
2. Ctrl+U (View Source)
3. Ctrl+F â†’ procure por `"@type":`
4. Confirme que ProductGroup, Product, FAQPage, VideoObject, HowTo aparecem

### Seletor de Variantes
1. Acesse produto com mÃºltiplas cores (ex: Rack Charlotte)
2. Verifique se miniaturas aparecem com fotos reais
3. Clique em outra cor â†’ deve navegar para URL da variante
4. Borda verde deve estar na cor atual

### ProductGroup Schema
1. Acesse produto com 2+ variantes de cor
2. View Source â†’ buscar "ProductGroup"
3. Verificar que `hasVariant` contÃ©m todas as cores
4. Cada variante deve ter `price` e `color`

### Review Schema
1. Acesse produto com reviews (ex: Rack Charlotte)
2. View Source â†’ buscar "aggregateRating"
3. Verificar que `ratingValue` e `reviewCount` aparecem
4. Verificar que array `review` contÃ©m avaliaÃ§Ãµes individuais

---

## ðŸ“Š MÃ©tricas para Acompanhar

| MÃ©trica | Ferramenta | O que observar |
|---------|------------|----------------|
| Rich Results | Search Console | ImpressÃµes de rich snippets |
| CTR orgÃ¢nico | Search Console | Aumento apÃ³s rich snippets |
| PosiÃ§Ã£o mÃ©dia | Search Console | Buscas por marca (Artely, Artany) |
| IndexaÃ§Ã£o | Search Console | PÃ¡ginas com erros de Schema |
| HowTo impressions | Search Console | Buscas "como montar" |
| **Review snippets** | Search Console | Rich snippet â­â­â­â­â­ |
| **ProductGroup** | Search Console | Rich snippet "X cores" |
| **ConversÃ£o PDP** | Analytics | Taxa de "Add to Cart" |
| **NavegaÃ§Ã£o variantes** | Analytics | Cliques no VariantSelector |

---

## ðŸ”® PrÃ³ximas ImplementaÃ§Ãµes (Backlog)

| Prioridade | Item | DescriÃ§Ã£o |
|------------|------|-----------|
| ~~Alta~~ | ~~Review Schema~~ | âœ… **Implementado v2.18** |
| ~~Alta~~ | ~~ProductGroup Schema~~ | âœ… **Implementado v2.17** |
| ~~Alta~~ | ~~Seletor de Variantes~~ | âœ… **Implementado v2.16** |
| ~~Alta~~ | ~~HowTo Schema~~ | âœ… **Implementado v2.15** |
| ~~MÃ©dia~~ | ~~Organization Schema~~ | âœ… **Implementado v2.19** (FurnitureStore) |
| ~~Baixa~~ | ~~ItemList Schema~~ | âœ… **JÃ¡ implementado** (pÃ¡ginas de categoria) |

---


## 📅 Timeline de Implementações

| Data | Versão | Feature Principal |
|------|--------|-------------------|
| **04/02/2026** | **v2.20** | **Carrossel Queridinhos de Curitiba** ⭐ |
| 03/02/2026 | v2.19 | Página Sobre + FurnitureStore Schema |
| 02/02/2026 | v2.18 | Review Schema |
| 02/02/2026 | v2.17 | ProductGroup Schema |
| 02/02/2026 | v2.16 | Seletor de Variantes de Cor |
| 02/02/2026 | v2.15 | HowTo Schema (vídeo montagem) |
| 02/02/2026 | v2.14 | VideoObject Schema |
| 01/02/2026 | v2.9 | SEO Avançado (5 melhorias) |
| Janeiro 2026 | v2.8 | Reviews e Vizinhos que Aprovaram |
| Janeiro 2026 | v2.6 | Minha Lista (Favoritos) |
| Janeiro 2026 | v2.5 | Home Page completa

---

*Documento mantido pelo Squad Dev — Moveirama*
*Última atualização: 04 de Fevereiro de 2026*
