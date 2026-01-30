# 🗺️ MAPA DO PROJETO MOVEIRAMA

> **Documento de referência para o Squad Dev**  
> **Última atualização:** 29 de Janeiro de 2026  
> **Versão do projeto:** v2.10.0

---

## 📊 VISÃO GERAL

| Item | Valor |
|------|-------|
| **Site de produção** | https://moveirama-site.vercel.app |
| **GitHub** | github.com/moveirama/moveirama-site |
| **Supabase** | https://ewsmfvisypgxbeqtbmec.supabase.co |
| **Vercel** | Deploy automático via GitHub |
| **Stack** | Next.js 16.1.1 + React 19 + Supabase + Tailwind 4 |
| **Produtos no catálogo** | ~380 (211 Artely + 169 Artany) |
| **Status de indexação** | robots = index/follow (pronto para SEO) |
| **WhatsApp** | 5541984209323 |

---

## 📁 ESTRUTURA DE PASTAS

```
moveirama-site/
├── public/                    # Assets estáticos
│   └── images/
│       └── categories/        # Imagens cut-out das categorias
├── docs/                      # Documentação (handoffs)
├── sql/                       # Scripts SQL para Supabase
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── [category]/        # Rota dinâmica categoria pai
│   │   │   ├── page.tsx       # Lista subcategorias
│   │   │   ├── [...slug]/     # Catch-all (listagem/produto)
│   │   │   └── not-found.tsx
│   │   ├── admin/             # Painel administrativo
│   │   │   ├── page.tsx       # Admin principal
│   │   │   └── imagens/       # Admin de imagens
│   │   ├── api/               # API Routes
│   │   │   ├── admin/         # APIs do admin
│   │   │   ├── customer-photos/   # (v2.8) - Fotos de clientes
│   │   │   ├── shipping/          # (v2.9) - Cálculo de frete
│   │   │   ├── payment/           # (v2.9) - Pagamentos
│   │   │   ├── orders/            # (v2.9) - Pedidos
│   │   │   ├── debug/         # Diagnóstico
│   │   │   └── search/        # API de busca
│   │   ├── busca/             # Página de busca
│   │   ├── carrinho/          # (v2.9) - Página do carrinho
│   │   ├── checkout/          # ⭐ (v2.10) - Checkout COMPLETO
│   │   │   └── page.tsx       # CheckoutPage com formulários
│   │   ├── pedido/            # (v2.9) - Confirmação
│   │   │   └── confirmado/
│   │   ├── entrega-moveis-curitiba-rmc/  # Página de cobertura (v2.6)
│   │   ├── fale-com-a-gente/  # Página de contato (v2.6)
│   │   ├── ofertas-moveis-curitiba/  # Página de ofertas (v2.6)
│   │   ├── politica-privacidade/     # (v2.7)
│   │   ├── politica-trocas-devolucoes/  # (v2.7)
│   │   ├── globals.css        # ⭐ Design System + Checkout CSS (v2.10)
│   │   ├── layout.tsx         # Layout principal (+ CartProvider)
│   │   ├── page.tsx           # HOME PAGE (v2.5)
│   │   ├── robots.ts          # SEO robots
│   │   └── sitemap.ts         # Sitemap dinâmico
│   ├── components/            # Componentes React
│   │   ├── Header.tsx         # Mega menu (+ CartBadge)
│   │   ├── Footer.tsx
│   │   ├── cart/              # Sistema de Carrinho (v2.9)
│   │   │   ├── index.ts       # Barrel export
│   │   │   ├── CartProvider.tsx      # Context API + useReducer
│   │   │   ├── CartDrawer.tsx        # Drawer lateral
│   │   │   ├── CartItem.tsx          # Item individual
│   │   │   ├── CartBadge.tsx         # Badge no header
│   │   │   ├── CartEmpty.tsx         # Estado vazio
│   │   │   ├── CartLoading.tsx       # Skeletons
│   │   │   ├── QuantityControl.tsx   # Controle +/-
│   │   │   ├── Toast.tsx             # Notificações
│   │   │   ├── BuyNowButton.tsx      # Botão "Comprar Agora"
│   │   │   ├── cart-types.ts         # Interfaces TypeScript
│   │   │   ├── cart-utils.ts         # Utilitários
│   │   │   └── cart.css              # Estilos específicos
│   │   ├── checkout/          # ⭐ NOVO (v2.10) - Componentes Checkout
│   │   │   ├── index.ts       # Barrel export
│   │   │   ├── CheckoutSummaryCard.tsx   # Sidebar resumo
│   │   │   ├── CheckoutMiniSummary.tsx   # Banner mobile sticky
│   │   │   ├── CheckoutSteps.tsx         # Progress indicator
│   │   │   └── CheckoutTrustBar.tsx      # Barra de confiança
│   │   ├── home/              # Componentes HOME (v2.5)
│   │   ├── minha-lista/       # FEATURE MINHA LISTA (v2.6)
│   │   ├── ofertas/           # Componentes de ofertas (v2.6)
│   │   ├── reviews/           # Sistema de Reviews (v2.8)
│   │   ├── search/            # Componentes de busca
│   │   ├── ProductPageContent.tsx  # PDP principal (v2.9 + BuyNowButton)
│   │   ├── ProductGallery.tsx
│   │   ├── ProductFAQ.tsx
│   │   ├── ProductRating.tsx      # (v2.7) - Estrelas de avaliação
│   │   ├── VizinhosAprovaram.tsx  # (v2.8) - Fotos de clientes
│   │   ├── ShippingCalculator.tsx
│   │   └── ...
│   ├── lib/                   # Funções utilitárias
│   │   ├── supabase.ts        # Cliente server + funções DB
│   │   ├── supabase-browser.ts # Cliente browser
│   │   ├── seo.ts             # SEO
│   │   ├── shipping.ts        # Cálculo de frete
│   │   ├── smart-search.ts    # Busca inteligente
│   │   ├── minha-lista.ts     # Lógica da lista de favoritos (v2.6)
│   │   ├── cart.ts            # (v2.9) - Lógica do carrinho
│   │   └── schemas/           # SCHEMAS JSON-LD
│   ├── styles/                # (v2.9)
│   │   └── cart-animations.css    # Animações do carrinho
│   ├── types/                 # TypeScript types
│   └── middleware.ts          # Middleware Next.js
├── package.json
└── tsconfig.json
```

---

## 🛒 FEATURE: CARRINHO DE COMPRAS v1.1 (v2.9)

### Visão Geral

Sistema completo de carrinho de compras com drawer lateral, página dedicada, checkout e processamento de pagamentos. Otimizado para mobile-first e público Classe C/D.

**Status atual:**
- ✅ Carrinho: **COMPLETO** — Context API, drawer, página, persistência
- ✅ Checkout: **COMPLETO** — Formulários, validação, layout 2 colunas (v2.10)
- ⏳ Pagamento: **SIMULADO** — APIs preparadas, integração pendente

### Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         CART SYSTEM v1.1                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    CartProvider                           │  │
│  │  (Context API + useReducer + localStorage persistence)    │  │
│  │                                                           │  │
│  │  State:                    Actions:                       │  │
│  │  • items[]                 • ADD_ITEM                     │  │
│  │  • isOpen                  • REMOVE_ITEM                  │  │
│  │  • shipping                • UPDATE_QUANTITY              │  │
│  │                            • SET_SHIPPING                 │  │
│  │  Computed:                 • CLEAR_CART                   │  │
│  │  • itemCount               • OPEN/CLOSE_DRAWER            │  │
│  │  • subtotal                • LOAD_FROM_STORAGE            │  │
│  │  • total                                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│         ┌────────────────────┼────────────────────┐            │
│         ▼                    ▼                    ▼            │
│  ┌────────────┐      ┌────────────┐      ┌────────────┐       │
│  │ CartBadge  │      │ CartDrawer │      │ /carrinho  │       │
│  │ (Header)   │      │ (Slide)    │      │ (Página)   │       │
│  └────────────┘      └────────────┘      └────────────┘       │
│                              │                    │             │
│                              └────────┬───────────┘             │
│                                       ▼                         │
│                              ┌────────────────┐                │
│                              │   /checkout    │                │
│                              │  (v2.10)       │                │
│                              └────────────────┘                │
│                                       │                         │
│                    ┌──────────────────┼──────────────────┐     │
│                    ▼                  ▼                  ▼     │
│            ┌────────────┐     ┌────────────┐     ┌──────────┐ │
│            │ API/shipping│    │ API/payment│    │API/orders│  │
│            └────────────┘     └────────────┘     └──────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Constantes e Limites (cart.ts)

```typescript
// Limites do carrinho
export const CART_LIMITS = {
  MAX_DIFFERENT_PRODUCTS: 5,    // Máx produtos diferentes
  MAX_QUANTITY_PER_PRODUCT: 5,  // Máx quantidade por produto
}

// Desconto Pix
export const PIX_DISCOUNT_PERCENT = 5

// Parcelamento
export const INSTALLMENT_OPTIONS = {
  maxInstallments: 12,
  minInstallmentValue: 10,  // R$ 10,00 mínimo por parcela
}

// Persistência
export const CART_STORAGE_KEY = 'moveirama_cart'
export const CART_EXPIRATION_DAYS = 30
```

### Arquivos da Feature Carrinho

| Arquivo | Descrição |
|---------|-----------|
| **Core** | |
| `src/lib/cart.ts` | Lógica, constantes, funções de cálculo |
| `src/components/cart/cart-types.ts` | Interfaces TypeScript |
| `src/components/cart/cart-utils.ts` | Utilitários (formatação, máscaras, validação) |
| `src/components/cart/cart.css` | Estilos específicos do carrinho |
| `src/styles/cart-animations.css` | Animações (fade-in, slide-up, slide-in) |
| **Componentes** | |
| `src/components/cart/CartProvider.tsx` | Context + useReducer + persistência |
| `src/components/cart/CartDrawer.tsx` | Drawer lateral (360px desktop, bottom sheet mobile) |
| `src/components/cart/CartItem.tsx` | Item individual com QuantityControl |
| `src/components/cart/CartBadge.tsx` | Badge no header (3 variantes) |
| `src/components/cart/CartEmpty.tsx` | Estado vazio com sugestões |
| `src/components/cart/CartLoading.tsx` | Skeletons (5 variantes) |
| `src/components/cart/QuantityControl.tsx` | Controle +/- com limites |
| `src/components/cart/Toast.tsx` | ToastProvider + useToast |
| `src/components/cart/BuyNowButton.tsx` | Botão CTA principal |
| `src/components/cart/index.ts` | Barrel export |
| **Páginas** | |
| `src/app/carrinho/page.tsx` | Página completa do carrinho |
| `src/app/checkout/page.tsx` | ⭐ Checkout completo (v2.10) |
| `src/app/pedido/confirmado/page.tsx` | Confirmação de pedido |
| **APIs** | |
| `src/app/api/shipping/route.ts` | Cálculo de frete por CEP |
| `src/app/api/payment/card/route.ts` | Processamento cartão |
| `src/app/api/payment/pix/route.ts` | Geração de Pix |
| `src/app/api/payment/webhook/route.ts` | Webhooks de pagamento |
| `src/app/api/orders/route.ts` | Criação/consulta de pedidos |

---

## ⭐ FEATURE: CHECKOUT v2.0 (v2.10 - Janeiro 2026)

### Visão Geral

Sistema completo de checkout com layout 2 colunas (desktop) e single-column (mobile), formulários com validação, progress steps visual, e componentes de confiança.

**Status atual:**
- ✅ Layout: **COMPLETO** — 2 colunas desktop, responsivo mobile
- ✅ Formulários: **COMPLETO** — Identificação, Endereço, Pagamento
- ✅ Validação: **COMPLETO** — CPF, email, telefone, CEP
- ✅ Componentes visuais: **COMPLETO** — Steps, Summary, Trust bar
- ⏳ Gateway: **PENDENTE** — Integração Mercado Pago/Stripe

### Arquitetura Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                      CHECKOUT PAGE (v2.10)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  DESKTOP (≥1024px):              MOBILE (<1024px):             │
│  ┌─────────────┬───────────┐     ┌─────────────────────┐       │
│  │             │           │     │   Mini Summary      │←sticky│
│  │   MAIN      │  SIDEBAR  │     │   (banner)          │       │
│  │   (forms)   │  (sticky) │     ├─────────────────────┤       │
│  │             │           │     │                     │       │
│  │  • Steps    │  Summary  │     │   MAIN (forms)      │       │
│  │  • Form 1   │  Card     │     │   • Steps           │       │
│  │  • Form 2   │           │     │   • Form 1          │       │
│  │  • Form 3   │  Trust    │     │   • Form 2          │       │
│  │             │  Seals    │     │   • Form 3          │       │
│  │             │           │     │                     │       │
│  │             │  Identity │     │   Summary Card      │       │
│  │             │  (CNPJ)   │     │   (no final)        │       │
│  └─────────────┴───────────┘     └─────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Componentes do Checkout

| Componente | Descrição | Classes CSS |
|------------|-----------|-------------|
| **CheckoutPage** | Página principal com formulários | `.checkout-page`, `.checkout-layout` |
| **CheckoutSummaryCard** | Sidebar com resumo do pedido | `.checkout-summary-card` |
| **CheckoutMiniSummary** | Banner mobile sticky (v2.2) | `.checkout-mini-summary` |
| **CheckoutSteps** | Progress indicator (3 etapas) | `.checkout-steps` |
| **CheckoutTrustBar** | Barra de confiança | `.checkout-trust-bar` |

### Progress Steps (v2.1)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     ①────────────②────────────③                            │
│  Identificação   Endereço    Pagamento                     │
│                                                             │
│  • Círculos: 40px (desktop), 32px (mobile)                 │
│  • Labels: font-size 13px                                   │
│  • Cores: Sage 500 (ativo), Gray 300 (inativo)             │
│  • Linhas conectoras: 2px                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Mini Summary Mobile (v2.2)

```
┌─────────────────────────────────────────────────────────────┐
│  STICKY BANNER (topo, mobile only)                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  🛒 2 itens  •  Total: R$ 598,00                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  • Aparece no scroll (após 100px)                          │
│  • Fundo: Warm White com sombra                            │
│  • Height: 48px                                             │
│  • z-index: 40 (abaixo do header)                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### CheckoutSummaryCard (Sidebar)

```
┌─────────────────────────────────────────────────────────────┐
│  RESUMO DO PEDIDO                                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [img] Rack Theo Cinamomo           R$ 299,00       │   │
│  │        Qtd: 1                                        │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  [img] Escrivaninha Dubai           R$ 299,00       │   │
│  │        Qtd: 1                                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Subtotal:                              R$ 598,00          │
│  Frete (Curitiba):                      R$ 25,00           │
│  ─────────────────────────────────────────────────         │
│  TOTAL:                                 R$ 623,00          │
│                                                             │
│  💚 Com Pix: R$ 591,85 (5% off)                           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ✓ Compra 100% segura                               │   │
│  │  ✓ Dados protegidos                                 │   │
│  │  ✓ Nota fiscal garantida                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [logos gateways]                                          │
│                                                             │
│  CNPJ: 00.000.000/0001-00                                  │
│  Moveirama Móveis LTDA                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Etapas do Checkout

| Etapa | Campos | Validação |
|-------|--------|-----------|
| **1. Identificação** | Nome, Email, Telefone, CPF | CPF válido, email formato, telefone DDD |
| **2. Endereço** | CEP, Rua, Número, Complemento, Bairro, Cidade | CEP região atendida, campos obrigatórios |
| **3. Pagamento** | Pix ou Cartão | Seleção obrigatória |

### Classes CSS do Checkout (globals.css)

```css
/* Layout principal */
.checkout-page { }
.checkout-layout { }           /* Grid 2 colunas */
.checkout-main { }             /* Coluna formulários */
.checkout-sidebar { }          /* Coluna resumo (sticky) */

/* Progress Steps */
.checkout-steps { }
.checkout-step { }
.checkout-step--active { }
.checkout-step--completed { }
.checkout-step-circle { }      /* 40px desktop, 32px mobile */
.checkout-step-label { }       /* 13px */
.checkout-step-line { }        /* Linha conectora */

/* Summary Card */
.checkout-summary-card { }
.checkout-summary-items { }
.checkout-summary-item { }
.checkout-summary-totals { }
.checkout-summary-pix { }

/* Mini Summary (mobile) */
.checkout-mini-summary { }     /* Sticky banner */
.checkout-mini-summary--visible { }

/* Trust elements */
.checkout-trust-bar { }
.checkout-seals { }
.checkout-gateway-logos { }
.checkout-identity { }         /* CNPJ */

/* Form sections */
.checkout-form-section { }
.checkout-form-title { }
.checkout-form-grid { }        /* Grid de campos */
```

### Fluxo Completo de Compra (v2.10)

```
1. PDP: Cliente clica "Comprar Agora"
   ├── BuyNowButton adiciona ao carrinho
   ├── CartDrawer abre automaticamente
   └── Toast confirma adição

2. CartDrawer: Cliente revisa itens
   ├── Pode ajustar quantidade
   ├── Pode remover itens
   └── Clica "Finalizar Compra"

3. /carrinho (opcional): Visão completa
   ├── Calcula frete por CEP
   ├── Vê total com desconto Pix
   └── Clica "Finalizar Compra"

4. /checkout: Cadastro + Pagamento (v2.10)
   ├── Mini Summary aparece no mobile (sticky)
   ├── Etapa 1: Dados pessoais (CPF validado)
   ├── Etapa 2: Endereço (CEP auto-preenche)
   ├── Etapa 3: Forma de pagamento
   └── Sidebar com resumo sempre visível (desktop)

5. /pedido/confirmado: Confirmação
   ├── Número do pedido
   ├── Resumo dos itens
   ├── QR Code Pix (se aplicável)
   └── Prazo de entrega
```

---

## ⭐ FEATURE: REVIEWS E VIZINHOS QUE APROVARAM (v2.8)

### Visão Geral

Sistema completo de prova social na PDP com duas seções:
1. **Reviews** — Avaliações em texto com nota (1-5 estrelas)
2. **Vizinhos que Aprovaram** — Galeria de fotos reais de clientes

**Status atual:**
- ✅ Reviews: **DINÂMICO** — dados vêm da tabela `reviews`
- ✅ Vizinhos: **DINÂMICO** — fotos vêm da tabela `customer_photos` + Storage
- ❌ Coleta de reviews: **NÃO IMPLEMENTADO** — cliente não pode deixar review pelo site

### Tabelas no Banco de Dados

#### Tabela `reviews`

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  bairro TEXT,
  cidade TEXT DEFAULT 'Curitiba',
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tabela `customer_photos`

```sql
CREATE TABLE customer_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  bairro TEXT NOT NULL,
  cidade TEXT NOT NULL DEFAULT 'Curitiba',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## ⭐ FEATURE: PRODUCT RATING (v2.7)

### Visão Geral

Sistema de avaliação de produtos com estrelas visuais e Schema.org AggregateRating para Rich Snippets no Google.

### Campos no Banco de Dados

```sql
-- Campos adicionados na tabela products
rating_average DECIMAL(2,1) DEFAULT 0   -- Ex: 4.8
rating_count INTEGER DEFAULT 0           -- Ex: 127
```

---

## ❤️ FEATURE: MINHA LISTA (v2.6)

Feature de lista de favoritos que permite ao cliente salvar produtos para comparar depois. Dados salvos em localStorage (sem necessidade de login).

**Nome na UI:** "Móveis que mais gostei"

---

## 🏠 HOME PAGE (v2.5)

### Estrutura de Seções

| # | Seção | Componente | Descrição |
|---|-------|------------|-----------|
| 1 | Hero | `HeroSection.tsx` | H1 SEO + 2 CTAs (Casa/Escritório) |
| 2 | Confiança | `TrustBar.tsx` | 4 ícones (72h, NF, Garantia, WhatsApp) |
| 3 | Categorias | `CategoriesSection.tsx` | 2 cards cut-out (Casa/Escritório) |
| 4 | Produtos | `FeaturedProducts.tsx` | 4 produtos em destaque (Supabase) |
| 5 | Diferenciais | `DiferenciaisSection.tsx` | 7 diferenciais com ícones |
| 6 | Conhecimento | `KnowledgeBlock.tsx` | Guias + links internos (SEO) |
| 7 | FAQ | `HomeFAQ.tsx` | 6 perguntas em acordeão |
| 8 | Cobertura | `CoberturaSection.tsx` | 10 cidades em pills |
| 9 | Social | `SocialSection.tsx` | Links Instagram/Facebook |
| 10 | CTA Final | `CTAFinal.tsx` | Fundo Sage + 2 botões |
| + | Flutuante | `WhatsAppFloat.tsx` | Botão fixo canto inferior |

---

## 🛣️ ESTRUTURA DE ROTAS (URLs)

### Taxonomia v2.3 (2 níveis)

```
/ → Home Page (11 seções)

/moveis-para-casa → Categoria pai Casa
/moveis-para-casa/racks-tv → Listagem de racks
/racks-tv/rack-theo-cinamomo → Página de produto ⭐

/moveis-para-escritorio → Categoria pai Escritório
/moveis-para-escritorio/escrivaninha-home-office → Listagem
/escrivaninha-home-office/escrivaninha-match → Página de produto ⭐

/busca?q=rack → Página de busca
/admin → Painel administrativo (login com senha)
/admin/imagens → Admin de imagens (interface separada)

⭐ ROTAS DO CARRINHO (v2.9/v2.10):
/carrinho → Página completa do carrinho
/checkout → Fluxo de checkout (v2.10 - completo)
/pedido/confirmado → Confirmação de pedido

⭐ ROTAS INSTITUCIONAIS:
/entrega-moveis-curitiba-rmc → Página de cobertura de entrega
/fale-com-a-gente → Página de contato
/ofertas-moveis-curitiba → Página de ofertas
/politica-privacidade → Política de privacidade
/politica-trocas-devolucoes → Política de trocas
```

---

## 🗄️ BANCO DE DADOS (Supabase)

### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `environments` | Ambientes (Casa, Escritório) |
| `categories` | Categorias com parent_id para hierarquia |
| `products` | Produtos com todos os campos |
| `product_variants` | Variantes (cores) |
| `product_images` | Imagens com SEO alt_text |
| `product_faqs` | FAQs personalizadas por produto |
| `suppliers` | Fornecedores (Artely, Artany) |
| `shipping_zones` | Zonas de frete |
| `reviews` | (v2.8) — Avaliações de produtos |
| `customer_photos` | (v2.8) — Fotos de clientes |
| `orders` | (v2.9) — Pedidos |
| `order_items` | (v2.9) — Itens dos pedidos |

### IDs Importantes

| Entidade | UUID |
|----------|------|
| Supplier Artely | `5c34ee22-445a-45ac-bec7-e9ac3a1a2b04` |
| Supplier Artany | `f2f7a7d0-68d0-4e0a-aac7-293780d1bf4d` |

### Campo de Imagem Correto

⚠️ **IMPORTANTE:** Para obter URL de imagem de produto, usar:

```typescript
// CORRETO
product.images?.[0]?.cloudinary_path

// INCORRETO (não existe)
product.images?.[0]?.image_url
product.images?.[0]?.url
```

---

## 🚚 FRETE (lib/shipping.ts)

### Cidades Atendidas

| Cidade | Valor Base |
|--------|------------|
| Curitiba | R$ 25 |
| Pinhais | R$ 35 |
| São José dos Pinhais | R$ 35 |
| Colombo | R$ 35 |
| Piraquara | R$ 40 |
| Quatro Barras | R$ 40 |
| Campina Grande do Sul | R$ 40 |
| Almirante Tamandaré | R$ 40 |
| Fazenda Rio Grande | R$ 40 |
| Araucária | R$ 40 |

### Prazo
- 1 a 3 dias úteis

---

## ⚠️ PONTOS DE ATENÇÃO

### Sempre Lembrar
1. **Categorias pai conhecidas:** `moveis-para-casa`, `moveis-para-escritorio`
2. **URL de produto:** `/subcategoria/produto-slug` (não inclui categoria pai)
3. **Imagens:** Supabase Storage, bucket `product-images`
4. **Campo de imagem:** `cloudinary_path` (não `url` nem `image_url`)
5. **WhatsApp:** 5541984209323
6. **Prazo entrega:** 1-3 dias úteis
7. **Supabase joins:** Retornam arrays, não objetos
8. **Minha Lista:** Dados em localStorage, key `minha-lista`
9. **Carrinho:** Dados em localStorage, key `moveirama_cart`
10. **Limite carrinho:** 5 produtos diferentes, 5 unidades cada
11. **Rating:** Schema AggregateRating SÓ se tiver avaliações reais
12. **⭐ Checkout CSS:** Classes em globals.css (seção checkout)

### Não Fazer
- Não usar branco puro (#FFFFFF) como fundo
- Não usar cinzas frios (#737373, #E5E5E5)
- Não criar componentes visuais sem specs do Squad Visual
- Não alterar estrutura de URLs sem validar SEO
- Não assumir que Supabase join retorna objeto único
- Não usar `image_url` ou `url` para imagens (usar `cloudinary_path`)
- **Não injetar AggregateRating sem avaliações reais**

---

## 🗒️ DECISÕES TÉCNICAS DOCUMENTADAS

### Por que Context API e não Redux para o Carrinho? (v2.9)
- Complexidade adequada para o escopo (~5 itens máx)
- Menos dependências externas
- Performance suficiente
- Integração nativa com React 19

### Por que localStorage para o Carrinho? (v2.9)
- Não requer login (friction-free para Classe C)
- Funciona offline
- Reduz chamadas ao servidor
- Expiração de 30 dias é suficiente

### Por que Mini Summary sticky no checkout mobile? (v2.10)
- Mantém total visível sem scroll
- Reduz ansiedade do cliente
- Padrão de grandes e-commerces
- Ocupa apenas 48px de altura

### Por que normalizar category do Supabase?
Supabase com `.select('category:categories(slug)')` retorna array, não objeto. Por isso fazemos: `product.category?.[0]?.slug`

### Por que AggregateRating é condicional? (v2.7)
- Google penaliza Schema AggregateRating sem avaliações reais
- Evita "0 estrelas" no Rich Snippet
- Quando tiver dados reais, automaticamente aparece

---

## 📜 PRÓXIMOS PASSOS SUGERIDOS

1. ~~**Testar Home no mobile**~~ ✅ Feito
2. ~~**Lighthouse**~~ ✅ Feito
3. ~~**Implementar Minha Lista**~~ ✅ Feito (v2.6)
4. ~~**Implementar ProductRating visual**~~ ✅ Feito (v2.7)
5. ~~**Implementar Schema AggregateRating**~~ ✅ Feito (v2.7)
6. ~~**Implementar Reviews (texto)**~~ ✅ Feito (v2.8)
7. ~~**Implementar Vizinhos que Aprovaram (fotos)**~~ ✅ Feito (v2.8)
8. ~~**Implementar carrinho de compras**~~ ✅ Feito (v2.9)
9. ~~**Implementar checkout básico**~~ ✅ Feito (v2.9)
10. ~~**Checkout completo com formulários**~~ ✅ Feito (v2.10)
11. **⏳ Integrar gateway de pagamento real** (Mercado Pago/Stripe)
12. **⏳ Sistema de coleta de reviews** (formulário no site)
13. **⏳ Moderação de reviews no admin**
14. **⏳ Notificações por email** (confirmação de pedido)

---

## 📝 CHANGELOG RECENTE

| Data | Versão | Mudança |
|------|--------|---------|
| **29/01/2026** | **v2.10.0** | **Checkout v2.0 Completo:** Layout 2 colunas, formulários com validação, CheckoutSummaryCard, Mini Summary mobile sticky v2.2, Progress Steps v2.1 (40px circles) |
| **29/01/2026** | **v2.10.0** | **globals.css expandido:** +150 linhas de CSS para checkout (layout, steps, summary, trust, seals, identity) |
| **29/01/2026** | **v2.10.0** | **Componentes checkout:** CheckoutSummaryCard, CheckoutMiniSummary, CheckoutSteps, CheckoutTrustBar |
| 27/01/2026 | v2.9.0 | **Sistema de Carrinho v1.1:** CartProvider com Context API, CartDrawer, BuyNowButton v1.3, página /carrinho |
| 27/01/2026 | v2.9.0 | **APIs de Compra:** /api/shipping, /api/payment/pix, /api/payment/card, /api/orders |
| 26/01/2026 | v2.8.0 | **Reviews:** Componentes ReviewsSection, ReviewsSummary, ReviewCard |
| 26/01/2026 | v2.8.0 | **Vizinhos que Aprovaram:** Componente VizinhosAprovaram, API `/api/customer-photos` |
| 26/01/2026 | v2.7.0 | **ProductRating:** Estrelas com preenchimento parcial, Schema AggregateRating condicional |
| 24/01/2026 | v2.6 | Feature "Minha Lista" (favoritos) |
| 23/01/2026 | v2.5 | Home Page completa: 11 componentes, 9 schemas JSON-LD |

---

*Documento atualizado pelo Squad Dev — 29 de Janeiro de 2026*
