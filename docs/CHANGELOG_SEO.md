# 📈 CHANGELOG SEO — Moveirama

> **Histórico de implementações SEO/AIO do projeto**  
> **Última atualização:** 02 de Fevereiro de 2026  
> **Versão atual:** 2.15.0

---

## Visão Geral

Este documento registra todas as implementações de SEO técnico e otimização para IA (AIO) do site Moveirama.

### Schemas Implementados (Página de Produto)

| Schema | Status | Arquivo |
|--------|--------|---------|
| Product | ✅ Ativo | `seo.ts` → `generateProductSchema()` |
| BreadcrumbList | ✅ Ativo | `ProductPageContent.tsx` |
| FAQPage | ✅ Ativo | `seo.ts` → `generateProductFAQs()` |
| VideoObject | ✅ Ativo | `seo.ts` → `generateVideoSchema()` |
| **HowTo** | ✅ **NOVO v2.15** | `seo.ts` → `generateHowToSchema()` |
| AggregateRating | ✅ Condicional | Só aparece se `rating_count > 0` |
| LocalBusiness | ✅ Ativo | Home e páginas institucionais |

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

### LocalBusiness Schema
- Informações da empresa
- Área de atuação: Curitiba + RMC
- Horário de funcionamento
- Contato WhatsApp

---

## 📍 Arquivos Principais

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/lib/seo.ts` | Funções de geração de Schema |
| `src/components/ProductPageContent.tsx` | Renderização dos JSON-LD |
| `src/components/ProductFAQ.tsx` | Componente visual do FAQ |
| `src/app/[category]/[...slug]/page.tsx` | generateMetadata() |

---

## 🧪 Como Testar

### Rich Results Test (Google)
1. Acesse: https://search.google.com/test/rich-results
2. Cole a URL do produto
3. Verifique se detecta: Product, FAQ, Video, **HowTo**

### Schema Validator
1. Acesse: https://validator.schema.org/
2. Cole o JSON-LD da página
3. Verifique se não há erros

### View Source
1. Abra a página do produto
2. Ctrl+U (View Source)
3. Ctrl+F → procure por `"@type":`
4. Confirme que Product, FAQPage, VideoObject, HowTo aparecem

---

## 📊 Métricas para Acompanhar

| Métrica | Ferramenta | O que observar |
|---------|------------|----------------|
| Rich Results | Search Console | Impressões de rich snippets |
| CTR orgânico | Search Console | Aumento após rich snippets |
| Posição média | Search Console | Buscas por marca (Artely, Artany) |
| Indexação | Search Console | Páginas com erros de Schema |
| **HowTo impressions** | Search Console | Buscas "como montar" |

---

## 🔮 Próximas Implementações (Backlog)

| Prioridade | Item | Descrição |
|------------|------|-----------|
| ~~Alta~~ | ~~HowTo Schema~~ | ✅ **Implementado v2.15** |
| Média | Review Schema | Quando tiver sistema de reviews |
| Média | Organization Schema | Página "Sobre" |
| Baixa | ItemList Schema | Páginas de categoria |

---

*Documento mantido pelo Squad Dev — Moveirama*
