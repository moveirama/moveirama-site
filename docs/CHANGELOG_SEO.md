# 📈 CHANGELOG SEO — Moveirama

> **Histórico de implementações SEO/AIO e UX do projeto**  
> **Última atualização:** 03 de Fevereiro de 2026  
> **Versão atual:** 2.19.0

---

## Visão Geral

Este documento registra todas as implementações de SEO técnico, otimização para IA (AIO) e melhorias de UX/Conversão do site Moveirama.

### Schemas Implementados (Página de Produto)

| Schema | Status | Arquivo |
|--------|--------|---------|
| **ProductGroup** | ✅ Ativo | `seo.ts` → `generateProductGroupSchema()` |
| Product | ✅ Ativo | `seo.ts` → `generateProductSchema()` |
| **Review** | ✅ Ativo | `seo.ts` → `generateReviewSchema()` |
| BreadcrumbList | ✅ Ativo | `ProductPageContent.tsx` |
| FAQPage | ✅ Ativo | `seo.ts` → `generateProductFAQs()` |
| VideoObject | ✅ Ativo | `seo.ts` → `generateVideoSchema()` |
| HowTo | ✅ Ativo | `seo.ts` → `generateHowToSchema()` |
| AggregateRating | ✅ Condicional | Dentro do Product, se `rating_count > 0` |
| FurnitureStore | ✅ Ativo | Home e páginas institucionais |

### Features de UX/Conversão

| Feature | Status | Versão |
|---------|--------|--------|
| **Seletor de Variantes de Cor** | ✅ Ativo | **v2.16** |
| Calculadora de Frete | ✅ Ativo | v2.x |
| Minha Lista (Favoritos) | ✅ Ativo | v2.6 |
| Reviews e Avaliações | ✅ Ativo | v2.8 |
| Carrinho + Checkout | ✅ Ativo | v2.9/v2.10 |

---

## v2.19 — 03/02/2026

### 🏢 Página Institucional "Sobre a Moveirama" (NOVO)

**Objetivo:** Página institucional com dados da empresa para E-E-A-T (Google), conformidade legal (Decreto 7.962/2013) e FurnitureStore Schema completo.

**URL:** `/sobre-a-moveirama`

**Validação:** ✅ FurnitureStore Schema com @id para referência em Product schemas

**Implementação:**

#### Arquivos criados/alterados

| Arquivo | Descrição |
|---------|-----------|
| `src/app/sobre-a-moveirama/page.tsx` | Página completa com 6 seções |
| `src/app/sobre-a-moveirama/layout.tsx` | Metadata SEO (title, description, canonical, OG) |
| `src/components/Footer.tsx` | v2.2: Link para /sobre + endereço completo |

#### 6 Seções implementadas

| # | Seção | Conteúdo |
|---|-------|----------|
| 1 | Hero | H1 "Sobre a Moveirama" + subtítulo |
| 2 | Nossa História | 2 cards timeline (2024 / Hoje) |
| 3 | Nossos Diferenciais | 4 cards (Entrega, Medidas, WhatsApp, NF) |
| 4 | Área de Atendimento | 10 cidades em pills |
| 5 | Trust Block | CNPJ, endereço, contatos, redes sociais |
| 6 | CTA Final | 2 botões (Casa / Escritório) |

#### FurnitureStore Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  "@id": "https://moveirama.com.br/#organization",
  "name": "Moveirama",
  "legalName": "Moveirama Eureka Móveis LTDA",
  "taxID": "61.154.643/0001-84",
  "foundingDate": "2024",
  "email": "atendimento@moveirama.com.br",
  "telephone": "+55-41-98420-9323",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Barão de Guaraúna, 517",
    "addressLocality": "Curitiba",
    "addressRegion": "PR",
    "postalCode": "80030-310"
  },
  "areaServed": ["10 cidades como City objects"],
  "knowsAbout": ["Móveis para casa", "Móveis para escritório", "..."],
  "hasOfferCatalog": { "..." },
  "potentialAction": { "@type": "SearchAction", "..." }
}
```

**Segurança:**
- Email com anti-spam (Base64 + reveal button)
- Noscript fallback: "atendimento [arroba] moveirama.com.br"

**Conformidade Legal:**
- Decreto Federal 7.962/2013: CNPJ + endereço completo visíveis
- Footer atualizado com endereço completo (não apenas bairro)

**Benefícios SEO/AIO:**

| Benefício | Impacto |
|-----------|---------|
| E-E-A-T | Transparência aumenta confiança do Google |
| @id Organization | Product schemas podem referenciar seller |
| SEO Local | 10 cidades reforçam autoridade regional |
| knowsAbout | IA entende expertise da loja |
| SearchAction | Sitelinks search box no Google |

---

## v2.18 — 02/02/2026

### ⭐ Review Schema (NOVO)

**Objetivo:** Exibir avaliações reais de clientes nos resultados do Google com rich snippets de estrelas e reviews individuais.

**Validação:** ✅ **7 schemas detectados, 0 erros, 0 avisos**

| Schema Detectado | Status |
|------------------|--------|
| ProductGroup | ✅ 0 erros |
| VideoObject | ✅ 0 erros |
| FurnitureStore | ✅ 0 erros |
| BreadcrumbList | ✅ 0 erros |
| **Product** (com AggregateRating + Review) | ✅ 0 erros |
| FAQPage | ✅ 0 erros |

**Implementação:**

#### Nova função em `seo.ts` (v3.5)
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
        "name": "Patrícia"
      },
      "reviewBody": "Móvel lindo e fácil de montar!",
      "datePublished": "2026-01-15"
    }
  ]
}
```

**Lógica de renderização:**
- Só aparece se produto tem reviews aprovados (`is_approved = true`)
- AggregateRating calculado a partir dos reviews reais
- Até 5 reviews individuais incluídos no schema
- Cidade do autor incluída quando disponível (SEO local)
- Badge "Compra Verificada" quando `is_verified_purchase = true`

**Mapeamento de Tipos (Frontend → Schema):**
```typescript
// Interface Review (frontend - camelCase)
customerName → author_name
customerCity → author_city  
comment → content
isVerified → is_verified_purchase
createdAt → created_at
```

**Arquivos alterados:**

| Arquivo | Versão | Alteração |
|---------|--------|-----------|
| `src/lib/seo.ts` | v3.5 | +`generateReviewSchema()`, +`ReviewForSchema` interface |
| `src/components/ProductPageContent.tsx` | v2.18 | Integração do Review Schema com mapeamento correto |
| `src/lib/reviews.ts` | v1.2 | Busca reviews da tabela `reviews` (não `product_reviews`) |

**Tabela do Banco:**
```sql
-- Tabela correta: reviews (283 registros)
-- NÃO usar: product_reviews (vazia)

SELECT * FROM reviews 
WHERE product_id = ? AND is_approved = true
ORDER BY created_at DESC
LIMIT 5;
```

**Benefícios SEO:**

| Benefício | Impacto |
|-----------|---------|
| Rich snippet com estrelas | ⭐⭐⭐⭐⭐ 4.8 (4 avaliações) nos resultados |
| Reviews individuais | Google pode exibir trechos das avaliações |
| Prova social | Aumenta confiança e CTR |
| SEO local | Cidade do cliente reforça autoridade regional |
| Compra verificada | Badge de autenticidade |

**Cobertura atual:**
| Métrica | Valor |
|---------|-------|
| Total de reviews no banco | 283 |
| Produtos com reviews | ~70 |
| Média de reviews por produto | ~4 |

**Exemplo testado:**
- Produto: Rack Charlotte Carvalho C / Menta
- Reviews: 4 avaliações aprovadas
- Média: 4.8 estrelas
- Autores: Patrícia (Curitiba-Portão), Lucas M. (Colombo), Fernanda (Curitiba-Sítio Cercado), Diego (Pinhais)

---

## v2.17 — 02/02/2026

### 🏷️ ProductGroup Schema (NOVO)

**Objetivo:** Informar ao Google que variantes de cor pertencem ao mesmo modelo de produto. Permite rich snippets como "Disponível em 4 cores" e carrossel de variantes nos resultados de busca.

**Validação:** ✅ **7 schemas detectados, 0 erros, 0 avisos**

| Schema Detectado | Status |
|------------------|--------|
| ProductGroup | ✅ 0 erros |
| VideoObject | ✅ 0 erros |
| FurnitureStore | ✅ 0 erros |
| BreadcrumbList | ✅ 0 erros |
| Product | ✅ 0 erros |
| FAQPage | ✅ 0 erros |

**Implementação:**

#### Nova função em `seo.ts` (v3.4)
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
  "description": "Disponível em 4 cores...",
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

**Lógica de renderização:**
- Só aparece se produto tem 2+ variantes de cor
- `productGroupID` = campo `model_group` do banco
- `variesBy` = sempre `color` (por enquanto)
- Cada variante vira um `Product` dentro de `hasVariant`

**Arquivos alterados:**

| Arquivo | Versão | Alteração |
|---------|--------|-----------|
| `src/lib/seo.ts` | v3.4 | +`generateProductGroupSchema()` |
| `src/lib/supabase.ts` | v2.7 | +`price` em `ProductColorVariant` |
| `src/components/ProductPageContent.tsx` | v2.17 | Integração do ProductGroup Schema |

**Benefícios SEO:**

| Benefício | Impacto |
|-----------|---------|
| Rich snippet "X cores disponíveis" | Maior CTR nos resultados |
| Carrossel de variantes | Destaque visual no Google |
| Preços por cor | Usuário vê opções antes de clicar |
| Estrutura semântica | Google entende relação entre produtos |
| Competitivo | Mesmo padrão de grandes e-commerces |

---

## v2.16 — 02/02/2026

### 🎨 Seletor de Variantes de Cor (NOVO)

**Objetivo:** Permitir navegação entre variantes de cor do mesmo modelo SEM voltar para listagem. Aumentar conversão reduzindo fricção na jornada de compra.

**Problema resolvido:**
- Cliente via "Rack Charlotte Cinamomo" mas queria ver em "Pinho/Off White"
- Tinha que voltar para listagem, encontrar o produto, clicar de novo
- Agora: clica na miniatura da cor desejada e navega direto

**Implementação completa em 4 passos:**

#### Passo 1: Banco de Dados
Novos campos na tabela `products`:
```sql
ALTER TABLE products ADD COLUMN model_group TEXT;
ALTER TABLE products ADD COLUMN color_name TEXT;
CREATE INDEX idx_products_model_group ON products(model_group);
```

**População automática:**
- `model_group`: Extraído do nome (ex: "Rack Charlotte" de "Rack Charlotte - Cinamomo")
- `color_name`: Extraído da parte após " - " (ex: "Cinamomo" ou "Pinho C / Off White")

**Cobertura:**
| Métrica | Valor |
|---------|-------|
| Produtos com `model_group` | ~180 |
| Produtos com variantes (2+ cores) | ~60 modelos |
| Produtos cor única | Sem seletor (comportamento correto) |

#### Passo 2: Backend
Nova função em `src/lib/supabase.ts`:
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
- Borda verde sálvia na variante atual
- Hover com elevação sutil

**Comportamento:**
- Só aparece se produto tem 2+ variantes
- Clique navega para URL da variante (SEO-friendly)
- Label "Cores disponíveis:" acima das miniaturas

**CSS:** Adicionado ao final de `globals.css` (seção variant-selector)

#### Passo 4: SEO (seo.ts v3.3)
Atualizado para usar `color_name` do banco:

```typescript
// Prioridade: color_name > variant_name > parsing do nome
const colorPart = color_name || variant_name || colorFromName
```

**Funções atualizadas:**
- `generateProductH1()` — usa `color_name`
- `generateProductTitle()` — usa `color_name`
- `generateProductSchema()` — campo "color" usa `color_name`

**Nova função helper:**
```typescript
export function extractModelName(fullName: string, colorName?: string | null): string
```

**Arquivos alterados:**
| Arquivo | Alteração |
|---------|-----------|
| `src/lib/supabase.ts` | v2.6: +`getSiblingVariants()`, +type `ProductColorVariant` |
| `src/lib/seo.ts` | v3.3: +`color_name` em interfaces, prioridade em H1/Title/Schema |
| `src/components/VariantSelector.tsx` | **NOVO** componente completo |
| `src/components/ProductPageContent.tsx` | Integração do VariantSelector |
| `src/app/[category]/[...slug]/page.tsx` | Query inclui `model_group`, `color_name` |
| `src/app/globals.css` | +seção `.variant-selector` |

**Benefícios:**
| Benefício | Impacto |
|-----------|---------|
| Reduz fricção | Cliente compara cores sem sair da PDP |
| Aumenta conversão | Menos abandonos por "quero ver outra cor" |
| UX premium | Miniaturas reais > bolinhas de cor genéricas |
| SEO mantido | Cada cor tem URL própria (canônica) |
| Mobile-first | Touch targets 64px, scroll horizontal |

---

## v2.15 — 02/02/2026

### 🔧 HowTo Schema (Vídeo de Montagem)

**Objetivo:** Capturar buscas informacionais de montagem e gerar rich snippet "Como fazer" no Google.

**Buscas capturadas:**
- "como montar rack"
- "montagem painel TV"
- "como montar escrivaninha"
- "vídeo montagem móvel artely"

**Implementação:**
- Nova função `generateHowToSchema()` em `src/lib/seo.ts`
- Renderização condicional em `ProductPageContent.tsx`
- Campo do banco: `products.assembly_video_url`

**Cobertura:**
| Fornecedor | Total | Com vídeo de montagem |
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
  "description": "Passo a passo de montagem. Nível {fácil/médio/difícil}, tempo estimado: {X} minutos.",
  "totalTime": "PT45M",
  "tool": [
    { "@type": "HowToTool", "name": "Chave Phillips" },
    { "@type": "HowToTool", "name": "Martelo de borracha (opcional)" }
  ],
  "supply": [
    { "@type": "HowToSupply", "name": "Manual de instruções (incluso)" },
    { "@type": "HowToSupply", "name": "Kit de ferragens (incluso)" }
  ],
  "step": [
    { "@type": "HowToStep", "name": "Confira as peças", "text": "..." },
    { "@type": "HowToStep", "name": "Assista o vídeo completo", "text": "..." },
    { "@type": "HowToStep", "name": "Organize o espaço", "text": "..." },
    { "@type": "HowToStep", "name": "Siga o manual passo a passo", "text": "..." },
    { "@type": "HowToStep", "name": "Finalize e posicione", "text": "..." }
  ],
  "video": {
    "@type": "VideoObject",
    "name": "Vídeo de Montagem - {Produto} | Moveirama",
    "thumbnailUrl": "https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg",
    "contentUrl": "{URL_YOUTUBE}",
    "embedUrl": "https://www.youtube.com/embed/{VIDEO_ID}"
  }
}
```

**Benefícios:**
- Rich snippet "Como fazer" nos resultados do Google
- Captura intent informacional (topo do funil)
- Reduz medo de montagem (dor #1 do cliente Classe C/D)
- Diferencial vs concorrentes sem vídeo de montagem
- Thumbnail de vídeo aumenta CTR

**Arquivos alterados:**
- `src/lib/seo.ts` — Nova função `generateHowToSchema()`
- `src/components/ProductPageContent.tsx` — Renderização condicional

---

## v2.14 — 02/02/2026

### 🎬 VideoObject Schema

**Objetivo:** Rich snippets de vídeo no Google para produtos com vídeo do fabricante.

**Implementação:**
- Nova função `generateVideoSchema()` em `src/lib/seo.ts`
- Renderização condicional em `ProductPageContent.tsx`
- Campo do banco: `products.video_product_url`

**Estrutura do Schema:**
```json
{
  "@type": "VideoObject",
  "name": "{Nome do Produto} - Vídeo do Produto | Moveirama",
  "description": "Veja o {Nome} em detalhes. Móvel para Curitiba e Região Metropolitana com entrega própria em até 72h.",
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

**Benefícios:**
- Thumbnail de vídeo nos resultados do Google
- Maior CTR em buscas
- Diferencial vs concorrentes sem vídeo

---

## v2.9 — 01/02/2026

### 🎯 Estratégia SEO Avançada — 5 Melhorias

#### 1. FAQ de Comparação
**Objetivo:** Capturar buscas comparativas ("rack X vs rack Y", "diferença entre racks")

**Implementação:**
- Nova pergunta dinâmica baseada na largura do produto
- Exemplo: "Qual a diferença do Rack Theo para outros racks de 1,6m?"

**Lógica:**
```typescript
// Agrupa por faixa de largura
< 120cm → "compactos (até 1,2m)"
120-150cm → "médios (1,2m a 1,5m)"  
> 150cm → "grandes (acima de 1,5m)"
```

#### 2. Bairros de Curitiba nas FAQs
**Objetivo:** Prova social regional + SEO local

**Implementação:**
- Pool de 15 bairros reais de Curitiba
- Rotação determinística por produto (baseada no slug)
- Aparece na FAQ de entrega

**Bairros incluídos:**
Cajuru, Boqueirão, Xaxim, Pinheirinho, CIC, Sítio Cercado, Portão, Água Verde, Batel, Centro, Santa Felicidade, Boa Vista, Bacacheri, Capão Raso, Fazendinha

**Exemplo de output:**
> "Entregamos em toda Curitiba (Cajuru, Boqueirão, Xaxim...) e Região Metropolitana."

#### 3. Brand = Fabricante (Artely/Artany)
**Objetivo:** Aparecer em buscas por marca do fabricante

**Implementação:**
- Campo `brand` no Product Schema usa `product.supplier?.name`
- Moveirama aparece como `seller`, não como `brand`

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
**Objetivo:** Badge de "Devolução Grátis" no Google Shopping

**Implementação:**
- Política de 7 dias (direito do consumidor)
- Tipo: `MerchantReturnFiniteReturnWindow`
- Custo de devolução: grátis

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
**Objetivo:** Maior especificidade + urgência

**Mudança:**
- Antes: "até 3 dias úteis"
- Depois: "em até 72h" / "entrega própria em até 72h"

**Onde aparece:**
- Meta description
- FAQs
- VideoObject description
- Textos de confiança

---

## v2.x — Implementações Anteriores

### Product Schema Básico
- Nome, descrição, preço, imagens
- SKU, disponibilidade, condição
- Offers com preço e parcelamento

### BreadcrumbList
- Navegação estruturada: Início → Categoria → Subcategoria → Produto
- Implementado diretamente no `ProductPageContent.tsx`

### FAQPage Schema
- Geração dinâmica baseada nos dados do produto
- Perguntas sobre: TV, medidas, material, montagem, entrega, garantia
- Função `generateProductFAQs()` em `seo.ts`

### AggregateRating (Condicional)
- Só renderiza se `rating_count > 0`
- Evita penalização do Google por rating falso
- Campos: `rating_average`, `rating_count`

### Meta Tags Otimizadas
- Title: `{H1} | Moveirama`
- Description: Preço + parcelamento + prazo + região
- Canonical URL
- Open Graph tags

### FurnitureStore Schema
- Informações da empresa
- Área de atuação: Curitiba + RMC
- Horário de funcionamento
- Contato WhatsApp

---

## 📁 Arquivos Principais

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/lib/seo.ts` | Funções de geração de Schema (v3.5) |
| `src/lib/supabase.ts` | Queries + `getSiblingVariants()` (v2.7) |
| `src/lib/reviews.ts` | Busca reviews da tabela `reviews` (v1.2) |
| `src/components/ProductPageContent.tsx` | Renderização dos JSON-LD + VariantSelector (v2.18) |
| `src/components/VariantSelector.tsx` | Seletor de variantes de cor |
| `src/components/ProductFAQ.tsx` | Componente visual do FAQ |
| `src/app/[category]/[...slug]/page.tsx` | generateMetadata() + query de produto |
| `src/app/globals.css` | CSS do Design System + variant-selector |

---

## 🧪 Como Testar

### Rich Results Test (Google)
1. Acesse: https://search.google.com/test/rich-results
2. Cole a URL do produto
3. Verifique se detecta: ProductGroup, Product, FAQ, Video, HowTo

### Schema Validator
1. Acesse: https://validator.schema.org/
2. Cole o JSON-LD da página
3. Verifique se não há erros

### View Source
1. Abra a página do produto
2. Ctrl+U (View Source)
3. Ctrl+F → procure por `"@type":`
4. Confirme que ProductGroup, Product, FAQPage, VideoObject, HowTo aparecem

### Seletor de Variantes
1. Acesse produto com múltiplas cores (ex: Rack Charlotte)
2. Verifique se miniaturas aparecem com fotos reais
3. Clique em outra cor → deve navegar para URL da variante
4. Borda verde deve estar na cor atual

### ProductGroup Schema
1. Acesse produto com 2+ variantes de cor
2. View Source → buscar "ProductGroup"
3. Verificar que `hasVariant` contém todas as cores
4. Cada variante deve ter `price` e `color`

### Review Schema
1. Acesse produto com reviews (ex: Rack Charlotte)
2. View Source → buscar "aggregateRating"
3. Verificar que `ratingValue` e `reviewCount` aparecem
4. Verificar que array `review` contém avaliações individuais

---

## 📊 Métricas para Acompanhar

| Métrica | Ferramenta | O que observar |
|---------|------------|----------------|
| Rich Results | Search Console | Impressões de rich snippets |
| CTR orgânico | Search Console | Aumento após rich snippets |
| Posição média | Search Console | Buscas por marca (Artely, Artany) |
| Indexação | Search Console | Páginas com erros de Schema |
| HowTo impressions | Search Console | Buscas "como montar" |
| **Review snippets** | Search Console | Rich snippet ⭐⭐⭐⭐⭐ |
| **ProductGroup** | Search Console | Rich snippet "X cores" |
| **Conversão PDP** | Analytics | Taxa de "Add to Cart" |
| **Navegação variantes** | Analytics | Cliques no VariantSelector |

---

## 🔮 Próximas Implementações (Backlog)

| Prioridade | Item | Descrição |
|------------|------|-----------|
| ~~Alta~~ | ~~Review Schema~~ | ✅ **Implementado v2.18** |
| ~~Alta~~ | ~~ProductGroup Schema~~ | ✅ **Implementado v2.17** |
| ~~Alta~~ | ~~Seletor de Variantes~~ | ✅ **Implementado v2.16** |
| ~~Alta~~ | ~~HowTo Schema~~ | ✅ **Implementado v2.15** |
| ~~Média~~ | ~~Organization Schema~~ | ✅ **Implementado v2.19** (FurnitureStore) |
| ~~Baixa~~ | ~~ItemList Schema~~ | ✅ **Já implementado** (páginas de categoria) |

---

## 📅 Timeline de Implementações

| Data | Versão | Feature Principal |
|------|--------|-------------------|
| **03/02/2026** | **v2.19** | **Página Sobre + FurnitureStore Schema** ⭐ |
| 02/02/2026 | v2.18 | Review Schema |
| 02/02/2026 | v2.17 | ProductGroup Schema |
| 02/02/2026 | v2.16 | Seletor de Variantes de Cor |
| 02/02/2026 | v2.15 | HowTo Schema (vídeo montagem) |
| 02/02/2026 | v2.14 | VideoObject Schema |
| 01/02/2026 | v2.9 | SEO Avançado (5 melhorias) |
| Janeiro 2026 | v2.8 | Reviews e Vizinhos que Aprovaram |
| Janeiro 2026 | v2.6 | Minha Lista (Favoritos) |
| Janeiro 2026 | v2.5 | Home Page completa |

---

*Documento mantido pelo Squad Dev — Moveirama*
*Última atualização: 03 de Fevereiro de 2026*
