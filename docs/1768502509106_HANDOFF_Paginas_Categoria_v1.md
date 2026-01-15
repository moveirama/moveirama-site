# HANDOFF: Páginas de Categoria

> **Squad Visual → Squad Dev**  
> **Data:** 15 de Janeiro de 2026  
> **Prioridade:** Alta  
> **Prazo sugerido:** 1 semana

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Página de Subcategoria](#2-página-de-subcategoria)
3. [Página de Categoria Pai](#3-página-de-categoria-pai)
4. [Componentes](#4-componentes)
5. [Estados e Edge Cases](#5-estados-e-edge-cases)
6. [Critérios de Aceite](#6-critérios-de-aceite)
7. [Ajustes no Footer](#7-ajustes-no-footer)

---

## 1. Visão Geral

### 1.1 Decisões de Design (Justificativas)

| Decisão | Escolha | Por quê |
|---------|---------|---------|
| **Grid** | 2 colunas mobile, 3 tablet, 4 desktop | Balança densidade vs legibilidade |
| **Filtros** | Apenas ordenação simples | Lei de Hick: poucos produtos inicialmente, filtros complexos aumentam carga cognitiva |
| **Paginação** | Tradicional (não scroll infinito) | Melhor SEO, usuário sabe onde está, menos dados no mobile |
| **Card** | Compacto com preço destacado | Preço visível em 3 segundos (regra #1 conversão) |
| **Footer mobile** | Centralizado | Convenção mobile, melhor leitura em tela pequena |
| **Redes sociais** | Ícones maiores com borda | Destaque visual, touch target 44px, importante pra engajamento |

### 1.2 URLs Cobertos

```
/casa                    → Página pai (mostra subcategorias)
/casa/racks              → Subcategoria
/casa/paineis            → Subcategoria
/casa/buffets            → Subcategoria
/casa/penteadeiras       → Subcategoria

/escritorio              → Página pai (mostra subcategorias)
/escritorio/escrivaninhas → Subcategoria
/escritorio/gaveteiros   → Subcategoria
/escritorio/mesas        → Subcategoria
/escritorio/estacoes     → Subcategoria
```

---

## 2. Página de Subcategoria

**URL exemplo:** `/casa/racks`

### 2.1 Layout Visual

```
MOBILE (< 768px)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[          BREADCRUMB                  ]
[   Casa > Racks para TV               ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[          HEADER                      ]
[   Racks para TV                      ]
[   12 produtos                        ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[   Ordenar: [Relevância ▼]            ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[  CARD  ][  CARD  ]
[________][________]
[  CARD  ][  CARD  ]
[________][________]
[  CARD  ][  CARD  ]
[________][________]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[   ← 1 2 3 ... 5 →                    ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TABLET (768px - 1023px)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[  Breadcrumb                                ]
[  Casa > Racks para TV                      ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[  Racks para TV          [Ordenar ▼]        ]
[  12 produtos                               ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[  CARD  ][  CARD  ][  CARD  ]
[________][________][________]
[  CARD  ][  CARD  ][  CARD  ]
[________][________][________]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[         ← 1 2 3 ... 5 →                    ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DESKTOP (≥ 1024px)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[  Breadcrumb                                        ]
[  Casa > Racks para TV                              ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[  Racks para TV                      [Ordenar ▼]    ]
[  12 produtos                                       ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[  CARD  ][  CARD  ][  CARD  ][  CARD  ]
[________][________][________][________]
[  CARD  ][  CARD  ][  CARD  ][  CARD  ]
[________][________][________][________]
[  CARD  ][  CARD  ][  CARD  ][  CARD  ]
[________][________][________][________]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[              ← 1 2 3 ... 5 →                       ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 2.2 Hierarquia de Informação

| Ordem | Elemento | Propósito |
|-------|----------|-----------|
| 1 | Breadcrumb | Navegação, SEO, contexto |
| 2 | Título + contagem | Confirma onde está |
| 3 | Ordenação | Controle do usuário |
| 4 | Grid de produtos | Objetivo principal |
| 5 | Paginação | Navegação entre páginas |

### 2.3 Especificações do Grid

```css
/* Mobile First */
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3); /* 12px */
  padding: var(--space-4) 0; /* 16px */
}

/* Tablet */
@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4); /* 16px */
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-6); /* 24px */
  }
}
```

**Tailwind:**
```
grid grid-cols-2 gap-3 py-4
md:grid-cols-3 md:gap-4
lg:grid-cols-4 lg:gap-6
```

### 2.4 Produtos por Página

| Viewport | Colunas | Produtos/página | Justificativa |
|----------|---------|-----------------|---------------|
| Mobile | 2 | 8 | 4 rows visíveis com scroll |
| Tablet | 3 | 12 | Densidade ideal |
| Desktop | 4 | 12 | Consistente com tablet |

---

## 3. Página de Categoria Pai

**URL exemplo:** `/casa`

### 3.1 Propósito

A página pai serve como **gateway** para as subcategorias. Mostra:
1. Cards visuais das subcategorias (navegação rápida)
2. Produtos em destaque (opcional, só se houver produtos marcados)

### 3.2 Regras de Exibição

| Elemento | Regra |
|----------|-------|
| **Subcategorias com 0 produtos** | ❌ NÃO exibir (esconder do grid) |
| **Seção "Em destaque"** | Só exibir se houver produtos com `is_featured = true` na categoria |
| **Hero/Banner** | ❌ Não usar (usuário já escolheu categoria) |

### 3.3 Layout Visual

```
MOBILE (< 768px)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[          BREADCRUMB                  ]
[   Início > Escritório                ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[          HEADER                      ]
[   Móveis para Escritório             ]
[   Monte seu home office com          ]
[   conforto e praticidade             ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[   SUBCATEGORIAS (só as com produtos) ]
[   [IMG] Escrivaninhas  |  [IMG] Gav. ]
[   3 produtos →         |  1 produto →]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[   EM DESTAQUE (só se houver)         ]
[   [Card][Card][Card]... → scroll     ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DESKTOP (≥ 1024px)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[  Breadcrumb: Início > Escritório                   ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[  Móveis para Escritório                            ]
[  Monte seu home office com conforto e praticidade  ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[  SUBCATEGORIAS (grid, só as que têm produtos)      ]
[ [Escrivaninhas] [Gaveteiros] [     ] [     ]       ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[  Em destaque (só se is_featured = true)            ]
[  [Card][Card][Card][Card]                          ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**⚠️ Importante:** Subcategorias com 0 produtos NÃO aparecem no grid.

### 3.3 Dados Necessários (do Banco)

```typescript
interface CategoryPage {
  name: string;           // "Casa"
  description: string;    // "Móveis para sala, quarto..."
  slug: string;           // "casa"
  subcategories: {
    name: string;         // "Racks para TV"
    slug: string;         // "racks"
    image_url?: string;   // Imagem representativa
    product_count: number; // Quantidade de produtos
  }[];
  featured_products?: Product[]; // Opcional
}
```

---

## 4. Componentes

### 4.1 Card de Produto (Listagem)

**Diferente do card da página de produto** - mais compacto, focado em conversão rápida.

```
┌─────────────────────────┐
│ [BADGE: -15%]           │
│                         │
│      [IMAGEM 1:1]       │
│                         │
├─────────────────────────┤
│ Nome do Produto         │
│ até 2 linhas máx        │
│                         │
│ ★★★★★ (42)             │  ← Opcional, se tiver reviews
│                         │
│ R$ 299,90               │  ← PREÇO GRANDE
│ ou 6x R$ 49,98          │  ← Parcelas
└─────────────────────────┘
```

#### HTML Estrutura

```html
<article class="product-card-listing">
  <a href="/produto/rack-theo" class="product-card-listing__link">
    <!-- Badge (opcional) -->
    <span class="product-card-listing__badge">-15%</span>
    
    <!-- Imagem -->
    <div class="product-card-listing__image-wrapper">
      <img 
        src="..." 
        alt="Rack Théo 180cm Grafite" 
        class="product-card-listing__image"
        loading="lazy"
        width="300"
        height="300"
      />
    </div>
    
    <!-- Conteúdo -->
    <div class="product-card-listing__content">
      <h3 class="product-card-listing__title">
        Rack Théo 180cm Grafite
      </h3>
      
      <!-- Rating (opcional) -->
      <div class="product-card-listing__rating" aria-label="4.5 de 5 estrelas, 42 avaliações">
        <span class="product-card-listing__stars">★★★★★</span>
        <span class="product-card-listing__reviews">(42)</span>
      </div>
      
      <!-- Preço -->
      <div class="product-card-listing__price-block">
        <p class="product-card-listing__price">R$ 299,90</p>
        <p class="product-card-listing__installment">ou 6x R$ 49,98</p>
      </div>
    </div>
  </a>
</article>
```

#### CSS

```css
.product-card-listing {
  background: var(--color-white);
  border-radius: var(--radius-lg); /* 12px */
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  transition: box-shadow 200ms ease-out, transform 200ms ease-out;
  position: relative;
}

.product-card-listing:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.product-card-listing__link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.product-card-listing__badge {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 10;
  background: var(--color-terracota); /* #B85C38 */
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}

.product-card-listing__image-wrapper {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: var(--color-cream); /* #FAF7F4 */
}

.product-card-listing__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 300ms ease-out;
}

.product-card-listing:hover .product-card-listing__image {
  transform: scale(1.03);
}

.product-card-listing__content {
  padding: 12px;
}

/* Mobile: padding menor */
@media (max-width: 767px) {
  .product-card-listing__content {
    padding: 10px;
  }
}

.product-card-listing__title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-graphite); /* #2D2D2D */
  line-height: 1.3;
  margin: 0 0 6px 0;
  
  /* Limitar a 2 linhas */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  /* Altura fixa para alinhamento */
  min-height: 36px; /* 2 linhas × 18px */
}

.product-card-listing__rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.product-card-listing__stars {
  color: var(--color-toffee); /* #8B7355 */
  font-size: 12px;
  letter-spacing: -1px;
}

.product-card-listing__reviews {
  font-size: 12px;
  color: var(--color-toffee);
}

.product-card-listing__price-block {
  margin-top: auto;
}

.product-card-listing__price {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-graphite);
  margin: 0;
}

/* Mobile: preço um pouco menor */
@media (max-width: 767px) {
  .product-card-listing__price {
    font-size: 16px;
  }
}

.product-card-listing__installment {
  font-size: 12px;
  color: var(--color-toffee);
  margin: 2px 0 0 0;
}
```

#### Tailwind (Alternativo)

```
<!-- Card Container -->
bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all relative

<!-- Badge -->
absolute top-2 left-2 z-10 bg-[#B85C38] text-white text-xs font-semibold px-2 py-1 rounded

<!-- Image Wrapper -->
relative aspect-square overflow-hidden bg-[#FAF7F4]

<!-- Image -->
w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]

<!-- Content -->
p-3 md:p-3

<!-- Title -->
text-sm font-medium text-[#2D2D2D] leading-tight line-clamp-2 min-h-[36px] mb-1.5

<!-- Rating -->
flex items-center gap-1 mb-2 text-xs text-[#8B7355]

<!-- Price -->
text-base md:text-lg font-bold text-[#2D2D2D]

<!-- Installment -->
text-xs text-[#8B7355] mt-0.5
```

---

### 4.2 Card de Subcategoria

Para a página pai, mostra subcategorias como cards clicáveis.

```
┌─────────────────────────┐
│                         │
│      [IMAGEM 3:2]       │
│                         │
├─────────────────────────┤
│ Racks para TV           │
│ 12 produtos →           │
└─────────────────────────┘
```

#### CSS

```css
.subcategory-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  transition: box-shadow 200ms ease-out, transform 200ms ease-out;
}

.subcategory-card:hover {
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
  transform: translateY(-4px);
}

.subcategory-card__link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.subcategory-card__image-wrapper {
  aspect-ratio: 3 / 2;
  overflow: hidden;
  background: var(--color-cream);
}

.subcategory-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 400ms ease-out;
}

.subcategory-card:hover .subcategory-card__image {
  transform: scale(1.05);
}

.subcategory-card__content {
  padding: 16px;
}

.subcategory-card__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-graphite);
  margin: 0 0 4px 0;
}

.subcategory-card__count {
  font-size: 14px;
  color: var(--color-toffee);
  display: flex;
  align-items: center;
  gap: 4px;
}

.subcategory-card__arrow {
  transition: transform 200ms ease-out;
}

.subcategory-card:hover .subcategory-card__arrow {
  transform: translateX(4px);
}
```

---

### 4.3 Breadcrumb

```html
<nav aria-label="Navegação estrutural" class="breadcrumb">
  <ol class="breadcrumb__list">
    <li class="breadcrumb__item">
      <a href="/" class="breadcrumb__link">Início</a>
      <span class="breadcrumb__separator" aria-hidden="true">›</span>
    </li>
    <li class="breadcrumb__item">
      <a href="/casa" class="breadcrumb__link">Casa</a>
      <span class="breadcrumb__separator" aria-hidden="true">›</span>
    </li>
    <li class="breadcrumb__item breadcrumb__item--current" aria-current="page">
      Racks para TV
    </li>
  </ol>
</nav>
```

#### CSS

```css
.breadcrumb {
  padding: var(--space-4) 0;
}

.breadcrumb__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-1);
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 14px;
}

.breadcrumb__item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.breadcrumb__link {
  color: var(--color-toffee);
  text-decoration: none;
  transition: color 150ms ease-out;
}

.breadcrumb__link:hover {
  color: var(--color-sage-600);
  text-decoration: underline;
}

.breadcrumb__separator {
  color: var(--color-sand-light);
}

.breadcrumb__item--current {
  color: var(--color-graphite);
  font-weight: 500;
}
```

**Schema.org (SEO)**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Início",
      "item": "https://moveirama.com.br/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Casa",
      "item": "https://moveirama.com.br/casa"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Racks para TV",
      "item": "https://moveirama.com.br/casa/racks"
    }
  ]
}
</script>
```

---

### 4.4 Header da Categoria

```html
<header class="category-header">
  <h1 class="category-header__title">Racks para TV</h1>
  <p class="category-header__count">12 produtos</p>
</header>
```

#### CSS

```css
.category-header {
  padding: var(--space-4) 0 var(--space-2) 0;
}

.category-header__title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-graphite);
  margin: 0 0 4px 0;
}

@media (min-width: 768px) {
  .category-header__title {
    font-size: 28px;
  }
}

@media (min-width: 1024px) {
  .category-header__title {
    font-size: 32px;
  }
}

.category-header__count {
  font-size: 14px;
  color: var(--color-toffee);
  margin: 0;
}
```

---

### 4.5 Ordenação (Select)

**Apenas ordenação simples** - sem filtros complexos (Lei de Hick).

```html
<div class="sort-control">
  <label for="sort-select" class="sort-control__label">Ordenar:</label>
  <div class="sort-control__wrapper">
    <select id="sort-select" class="sort-control__select">
      <option value="relevance">Relevância</option>
      <option value="price-asc">Menor preço</option>
      <option value="price-desc">Maior preço</option>
      <option value="newest">Mais recentes</option>
      <option value="bestseller">Mais vendidos</option>
    </select>
    <svg class="sort-control__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>
```

#### CSS

```css
.sort-control {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-sand-light);
}

/* Mobile: ocupa largura total */
@media (max-width: 767px) {
  .sort-control {
    flex-direction: column;
    align-items: stretch;
  }
}

.sort-control__label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-graphite);
  white-space: nowrap;
}

/* Mobile: esconde label */
@media (max-width: 767px) {
  .sort-control__label {
    display: none;
  }
}

.sort-control__wrapper {
  position: relative;
  display: inline-flex;
}

.sort-control__select {
  appearance: none;
  background: var(--color-white);
  border: 1px solid var(--color-sand-light);
  border-radius: var(--radius-md);
  padding: 10px 36px 10px 12px;
  font-size: 14px;
  font-family: inherit;
  color: var(--color-graphite);
  cursor: pointer;
  min-height: 44px; /* Touch target */
  min-width: 160px;
  transition: border-color 150ms ease-out;
}

.sort-control__select:hover {
  border-color: var(--color-toffee);
}

.sort-control__select:focus {
  outline: none;
  border-color: var(--color-sage-600);
  box-shadow: 0 0 0 3px var(--color-sage-100);
}

.sort-control__icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--color-toffee);
  pointer-events: none;
}
```

---

### 4.6 Paginação

```html
<nav aria-label="Paginação" class="pagination">
  <a href="?page=1" class="pagination__btn pagination__btn--prev" aria-label="Página anterior">
    ← Anterior
  </a>
  
  <div class="pagination__pages">
    <a href="?page=1" class="pagination__page pagination__page--current" aria-current="page">1</a>
    <a href="?page=2" class="pagination__page">2</a>
    <a href="?page=3" class="pagination__page">3</a>
    <span class="pagination__ellipsis">...</span>
    <a href="?page=5" class="pagination__page">5</a>
  </div>
  
  <a href="?page=2" class="pagination__btn pagination__btn--next" aria-label="Próxima página">
    Próxima →
  </a>
</nav>
```

#### CSS

```css
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-8) 0;
}

.pagination__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-graphite);
  background: var(--color-white);
  border: 1px solid var(--color-sand-light);
  border-radius: var(--radius-md);
  text-decoration: none;
  min-height: 44px;
  transition: all 150ms ease-out;
}

.pagination__btn:hover {
  background: var(--color-cream);
  border-color: var(--color-toffee);
}

.pagination__btn--disabled {
  opacity: 0.4;
  pointer-events: none;
}

/* Mobile: esconde texto, mostra só seta */
@media (max-width: 767px) {
  .pagination__btn {
    padding: 10px 14px;
  }
}

.pagination__pages {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.pagination__page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-graphite);
  background: var(--color-white);
  border: 1px solid var(--color-sand-light);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all 150ms ease-out;
}

.pagination__page:hover {
  background: var(--color-cream);
  border-color: var(--color-toffee);
}

.pagination__page--current {
  background: var(--color-sage-600);
  color: var(--color-white);
  border-color: var(--color-sage-600);
}

.pagination__ellipsis {
  padding: 0 var(--space-2);
  color: var(--color-toffee);
}
```

---

## 5. Estados e Edge Cases

### 5.1 Categoria Vazia

```
┌─────────────────────────────────────────┐
│                                         │
│            [ÍCONE BUSCA]                │
│                                         │
│     Nenhum produto encontrado           │
│                                         │
│  Esta categoria ainda não tem produtos  │
│  disponíveis. Volte em breve!           │
│                                         │
│         [Ver outras categorias]         │
│                                         │
└─────────────────────────────────────────┘
```

#### HTML

```html
<div class="empty-state">
  <svg class="empty-state__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
  <h2 class="empty-state__title">Nenhum produto encontrado</h2>
  <p class="empty-state__text">Esta categoria ainda não tem produtos disponíveis. Volte em breve!</p>
  <a href="/casa" class="empty-state__btn btn-secondary">Ver outras categorias</a>
</div>
```

#### CSS

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-16) var(--space-4);
}

.empty-state__icon {
  width: 64px;
  height: 64px;
  color: var(--color-sand-light);
  margin-bottom: var(--space-6);
}

.empty-state__title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-graphite);
  margin: 0 0 var(--space-2) 0;
}

.empty-state__text {
  font-size: 16px;
  color: var(--color-toffee);
  margin: 0 0 var(--space-6) 0;
  max-width: 320px;
}

.empty-state__btn {
  min-width: 200px;
}
```

### 5.2 Loading State (Skeleton)

```html
<div class="product-grid">
  <div class="product-card-skeleton">
    <div class="skeleton skeleton--image"></div>
    <div class="product-card-skeleton__content">
      <div class="skeleton skeleton--title"></div>
      <div class="skeleton skeleton--text" style="width: 60%"></div>
      <div class="skeleton skeleton--price"></div>
      <div class="skeleton skeleton--text" style="width: 40%"></div>
    </div>
  </div>
  <!-- Repetir 8x para mobile, 12x para desktop -->
</div>
```

#### CSS

```css
.product-card-skeleton {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.product-card-skeleton__content {
  padding: 12px;
}

/* Reutilizar .skeleton do Design System */
```

### 5.3 Erro de Carregamento

```html
<div class="error-state">
  <svg class="error-state__icon"><!-- Ícone de erro --></svg>
  <h2 class="error-state__title">Ops! Algo deu errado</h2>
  <p class="error-state__text">Não conseguimos carregar os produtos. Tente novamente.</p>
  <button class="error-state__btn btn-primary" onclick="location.reload()">
    Tentar novamente
  </button>
</div>
```

---

## 6. Critérios de Aceite

### 6.1 Checklist Funcional

- [ ] **Grid responsivo:** 2 colunas mobile, 3 tablet, 4 desktop
- [ ] **Card de produto:** Imagem, título, rating (opcional), preço, parcelas
- [ ] **Breadcrumb:** Navegação funcional com schema.org
- [ ] **Ordenação:** Select funcional com opções definidas
- [ ] **Paginação:** Navegação entre páginas, 12 produtos/página
- [ ] **Estado vazio:** Mensagem amigável quando sem produtos
- [ ] **Loading:** Skeleton enquanto carrega
- [ ] **Erro:** Mensagem clara com opção de retry

### 6.2 Checklist Visual

- [ ] Cores seguem Design System v2.0 (Earthy)
- [ ] Fontes: Inter, tamanhos conforme specs
- [ ] Espaçamentos: múltiplos de 4px
- [ ] Border-radius: 12px nos cards
- [ ] Sombras: conforme tokens

### 6.3 Checklist Acessibilidade

- [ ] **Touch targets:** Mínimo 44×44px
- [ ] **Fonte mínima:** 14px (12px apenas em elementos secundários)
- [ ] **Contraste:** WCAG AA
- [ ] **aria-labels:** Em todos elementos interativos
- [ ] **aria-current:** Na paginação para página atual
- [ ] **Focus visible:** Outline em elementos focáveis

### 6.4 Checklist SEO

- [ ] Schema.org BreadcrumbList
- [ ] Schema.org ItemList para produtos
- [ ] meta title: `{Categoria} | Moveirama`
- [ ] meta description: Descrição da categoria
- [ ] canonical: URL limpa sem query params desnecessários
- [ ] h1 único por página

### 6.5 Checklist Performance

- [ ] Imagens com `loading="lazy"`
- [ ] Imagens com `width` e `height` definidos
- [ ] Skeleton loading
- [ ] Paginação server-side (não carregar todos produtos)

---

## 7. Ajustes no Footer

### 7.1 Problema Atual

| Issue | Descrição |
|-------|-----------|
| **Mobile não centralizado** | Conteúdo fica alinhado à esquerda no mobile |
| **Redes sociais pouco destacadas** | Ícones com cor café (#8B7355) se perdem no fundo escuro |

### 7.2 Specs de Ajuste - Mobile Centralizado

**Arquivo:** `src/components/Footer.tsx`

```tsx
// ANTES (linha 82)
<div className="grid md:grid-cols-4 gap-8">

// DEPOIS
<div className="grid md:grid-cols-4 gap-8 text-center md:text-left">
```

```tsx
// ANTES (linha 84) - Seção "Sobre"
<div>

// DEPOIS
<div className="flex flex-col items-center md:items-start">
```

```tsx
// ANTES (linha 91) - Redes sociais
<div className="flex gap-3 mt-4">

// DEPOIS
<div className="flex justify-center md:justify-start gap-3 mt-4">
```

```tsx
// ANTES (linha 118) - Seção "Categorias"
<div>

// DEPOIS
<div className="flex flex-col items-center md:items-start">
```

```tsx
// ANTES (linha 120) - Lista de categorias
<ul className="space-y-2 text-sm text-[#D9CFC4]">

// DEPOIS
<ul className="space-y-2 text-sm text-[#D9CFC4] text-center md:text-left">
```

**Repetir o mesmo padrão para as seções "Atendimento" e "Entrega".**

### 7.3 Specs de Ajuste - Redes Sociais Destacadas

**Problema:** Cor atual `#8B7355` (toffee) tem pouco contraste com fundo `#2D2D2D` (grafite).

**Solução:** Usar branco com borda, aumentar tamanho, adicionar label.

```tsx
// ANTES (linhas 91-114)
<div className="flex gap-3 mt-4">
  <a 
    href="https://www.facebook.com/moveirama" 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center justify-center w-8 h-8 rounded-full bg-[#8B7355] hover:bg-[#6B8E7A] transition-colors"
    aria-label="Facebook da Moveirama"
  >
    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
      <!-- ... -->
    </svg>
  </a>
  <!-- Instagram similar -->
</div>

// DEPOIS
<div className="flex justify-center md:justify-start gap-4 mt-6">
  <a 
    href="https://www.facebook.com/moveirama" 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 border border-white/30 hover:bg-[#6B8E7A] hover:border-[#6B8E7A] transition-all"
    aria-label="Facebook da Moveirama"
  >
    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" aria-hidden="true">
      <!-- ... -->
    </svg>
  </a>
  <a 
    href="https://www.instagram.com/moveirama" 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 border border-white/30 hover:bg-[#6B8E7A] hover:border-[#6B8E7A] transition-all"
    aria-label="Instagram da Moveirama"
  >
    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" aria-hidden="true">
      <!-- ... -->
    </svg>
  </a>
</div>
```

### 7.4 Comparativo Visual

```
ANTES                              DEPOIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MOBILE:
┌─────────────────────┐            ┌─────────────────────┐
│ moveirama           │            │      moveirama      │
│ Texto alinhado      │            │   Texto alinhado    │
│ à esquerda...       │     →      │     ao centro...    │
│ [●][●] ← pequeno    │            │     [◯][◯]          │
│        café         │            │    ↑ maiores        │
└─────────────────────┘            │    ↑ com borda      │
                                   └─────────────────────┘

ÍCONES REDES SOCIAIS:
┌──────┐                           ┌──────┐
│ ●    │ 32px, bg café             │  ◯   │ 44px, bg transparente
│      │ pouco visível      →      │      │ borda branca
└──────┘                           └──────┘ hover verde sálvia
```

### 7.5 CSS Alternativo (se preferir separar)

```css
/* Footer Mobile Centralizado */
@media (max-width: 767px) {
  .footer-section {
    text-align: center;
  }
  
  .footer-section ul,
  .footer-section p {
    text-align: center;
  }
  
  .footer-social {
    justify-content: center;
  }
}

/* Redes Sociais Destacadas */
.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 200ms ease-out;
}

.social-icon:hover {
  background: var(--color-sage-600); /* #6B8E7A */
  border-color: var(--color-sage-600);
}

.social-icon svg {
  width: 20px;
  height: 20px;
  fill: white;
}
```

### 7.6 Checklist de Aceite - Footer

- [ ] Mobile: Todo conteúdo centralizado
- [ ] Mobile: Redes sociais centralizadas
- [ ] Desktop: Conteúdo alinhado à esquerda (como está)
- [ ] Ícones redes sociais: 44×44px (touch target)
- [ ] Ícones redes sociais: Fundo transparente com borda branca
- [ ] Ícones redes sociais: Hover verde sálvia
- [ ] Contraste visível entre ícones e fundo

---

## Anexo: Dados Necessários

### Migração de Banco (se necessário)

```sql
-- Adicionar campo is_featured se não existir
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Adicionar imagem às categorias (para cards de subcategoria)
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS image_url TEXT;
```

### Query para Página de Subcategoria

```sql
-- Produtos de uma subcategoria com paginação
SELECT 
  p.id,
  p.slug,
  p.name,
  p.price,
  p.compare_at_price,
  pi.cloudinary_path as image_url,
  COALESCE(AVG(pr.rating), 0) as avg_rating,
  COUNT(pr.id) as review_count
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.image_type = 'principal'
LEFT JOIN product_reviews pr ON p.id = pr.product_id
WHERE p.category_id = (SELECT id FROM categories WHERE slug = 'racks')
  AND p.is_active = true
GROUP BY p.id, pi.cloudinary_path
ORDER BY p.position ASC
LIMIT 12 OFFSET 0;
```

### Query para Página Pai

```sql
-- Subcategorias de uma categoria pai (APENAS com produtos)
SELECT 
  c.slug,
  c.name,
  c.image_url,
  COUNT(p.id) as product_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'casa')
GROUP BY c.id
HAVING COUNT(p.id) > 0  -- ⚠️ IMPORTANTE: só mostra se tiver produtos
ORDER BY c.position ASC;
```

### Query para Produtos em Destaque (opcional)

```sql
-- Produtos destacados da categoria pai (para seção "Em destaque")
SELECT 
  p.id,
  p.slug,
  p.name,
  p.price,
  p.compare_at_price,
  pi.cloudinary_path as image_url
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.image_type = 'principal'
JOIN categories c ON p.category_id = c.id
WHERE c.parent_id = (SELECT id FROM categories WHERE slug = 'escritorio')
  AND p.is_active = true
  AND p.is_featured = true  -- ⚠️ Só produtos marcados como destaque
ORDER BY p.position ASC
LIMIT 6;
```

---

## Dúvidas?

Chama no canal do Squad Visual ou marca uma call rápida.

---

**Aprovado por:** Squad Visual  
**Data:** 15/01/2026  
**Versão:** 1.0
