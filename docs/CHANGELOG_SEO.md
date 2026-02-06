## v2.21 — 05/02/2026

### 🔧 Auditoria SEO — Correções de Schema (seo.ts v3.6.0)

**Objetivo:** Corrigir erros e avisos detectados no validator.schema.org após auditoria completa dos schemas.

**Validação:** ✅ **0 erros, 0 avisos** no Schema Validator

#### Correções Implementadas

| Problema | Arquivo | Correção |
|----------|---------|----------|
| Product/ProductGroup sem @id | `seo.ts` | Adicionado @id explícito em todos os schemas |
| addressNeighborhood inválido | `Footer.tsx` | Bairro movido para streetAddress |
| addressNeighborhood inválido | `page.tsx` (sobre) | Bairro movido para streetAddress |

#### Detalhes Técnicos

**1. @id nos Schemas (seo.ts v3.5 → v3.6.0)**

Sem @id explícito, o Google cria identificadores automáticos que podem conflitar no grafo de conhecimento.

```typescript
// Product Schema
"@id": `${canonicalUrl}#product`

// Offer Schema  
"@id": `${canonicalUrl}#offer`

// ProductGroup Schema
"@id": `${url}#product-group`

// Variantes dentro do ProductGroup
"@id": `${variantUrl}#variant`

// Seller referencia Organization
"seller": { "@id": "https://moveirama.com.br/#organization" }
```

**2. Remoção de addressNeighborhood**

A propriedade `addressNeighborhood` **não existe** no vocabulário Schema.org para PostalAddress.

```diff
"address": {
  "@type": "PostalAddress",
- "streetAddress": "Rua Barão de Guaraúna, 517",
+ "streetAddress": "Rua Barão de Guaraúna, 517 - Juvevê",
  "addressLocality": "Curitiba",
  "addressRegion": "PR",
  "postalCode": "80030-310"
- "addressNeighborhood": "Juvevê"
}
```

#### Arquivos Alterados

| Arquivo | Versão | Mudança |
|---------|--------|---------|
| `src/lib/seo.ts` | v3.5 → v3.6.0 | @id em Product, ProductGroup, Offer, variantes |
| `src/components/Footer.tsx` | v2.2 → v2.3 | Remove addressNeighborhood |
| `src/app/sobre-a-moveirama/page.tsx` | v1.0 → v1.1 | Remove addressNeighborhood |

#### Resultado da Validação

| Schema | Antes | Depois |
|--------|-------|--------|
| ProductGroup | ⚠️ Sem @id | ✅ 0 erros |
| Product | ⚠️ Sem @id | ✅ 0 erros |
| FurnitureStore | ❌ addressNeighborhood | ✅ 0 erros |
| VideoObject | ✅ OK | ✅ OK |
| FAQPage | ✅ OK | ✅ OK |
| BreadcrumbList | ✅ OK | ✅ OK |
| HowTo | ✅ OK | ✅ OK |

**Benefícios:**

| Benefício | Impacto |
|-----------|---------|
| Grafo consistente | Google não cria @id conflitantes |
| Schema válido | 0 erros = elegível para rich snippets |
| Referências corretas | Seller aponta para Organization central |

---
