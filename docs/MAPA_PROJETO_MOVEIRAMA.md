# 🗺️ MAPA DO PROJETO MOVEIRAMA

> **Documento de referência para o Squad Dev**  
> **Última atualização:** 27 de Janeiro de 2026  
> **Versão do projeto:** v2.9.0

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
│   ├── CHANGELOG_24_Janeiro_2026.md
│   ├── GUIA_Upload_Imagens.md
│   ├── HANDOFF_Paginas_Categoria_v1.md
│   ├── MAPA_PROJETO_MOVEIRAMA.md
│   ├── REF_Tecnicas_Avancadas_Design.md
│   └── SETUP_LOCAL.md
├── sql/                       # Scripts SQL para Supabase
│   ├── categories_2_niveis_v3.sql
│   ├── insert_artany_products.sql
│   └── ...
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── [category]/        # Rota dinâmica categoria pai
│   │   │   ├── page.tsx       # Lista subcategorias
│   │   │   ├── [...slug]/     # Catch-all (listagem/produto)
│   │   │   │   └── page.tsx
│   │   │   └── not-found.tsx
│   │   ├── admin/             # Painel administrativo
│   │   │   ├── page.tsx       # Admin principal
│   │   │   └── imagens/       # Admin de imagens (separado)
│   │   │       ├── page.tsx
│   │   │       └── components/
│   │   │           ├── FilterBar.tsx
│   │   │           ├── ImageGrid.tsx
│   │   │           ├── ImageUploader.tsx
│   │   │           ├── ProductCard.tsx
│   │   │           └── index.ts
│   │   ├── api/               # API Routes
│   │   │   ├── admin/         # APIs do admin
│   │   │   │   ├── images/    # Upload e gestão de imagens
│   │   │   │   │   ├── upload/
│   │   │   │   │   ├── upload-medidas/
│   │   │   │   │   ├── process-batch/
│   │   │   │   │   ├── sync/
│   │   │   │   │   └── [id]/
│   │   │   │   └── products/  # CRUD de produtos
│   │   │   │       └── [id]/
│   │   │   ├── customer-photos/   # (v2.8) - Fotos de clientes
│   │   │   │   └── route.ts
│   │   │   ├── shipping/          # ⭐ NOVO (v2.9) - Cálculo de frete
│   │   │   │   └── route.ts
│   │   │   ├── payment/           # ⭐ NOVO (v2.9) - Pagamentos
│   │   │   │   ├── card/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── pix/
│   │   │   │   │   └── route.ts
│   │   │   │   └── webhook/
│   │   │   │       └── route.ts
│   │   │   ├── orders/            # ⭐ NOVO (v2.9) - Pedidos
│   │   │   │   └── route.ts
│   │   │   ├── debug/         # Diagnóstico
│   │   │   └── search/        # API de busca
│   │   ├── busca/             # Página de busca
│   │   ├── carrinho/          # ⭐ NOVO (v2.9) - Página do carrinho
│   │   │   └── page.tsx
│   │   ├── checkout/          # ⭐ NOVO (v2.9) - Checkout
│   │   │   └── page.tsx
│   │   ├── pedido/            # ⭐ NOVO (v2.9) - Confirmação
│   │   │   └── confirmado/
│   │   │       └── page.tsx
│   │   ├── produto/[slug]/    # Rota alternativa (redirect)
│   │   ├── entrega-moveis-curitiba-rmc/  # Página de cobertura (v2.6)
│   │   │   ├── page.tsx
│   │   │   └── OndeEntregamosContent.tsx
│   │   ├── fale-com-a-gente/  # Página de contato (v2.6)
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── ofertas-moveis-curitiba/  # Página de ofertas (v2.6)
│   │   │   └── page.tsx
│   │   ├── politica-privacidade/     # (v2.7)
│   │   │   └── page.tsx
│   │   ├── politica-trocas-devolucoes/  # (v2.7)
│   │   │   └── page.tsx
│   │   ├── globals.css        # Design System CSS + vizinhos.css
│   │   ├── layout.tsx         # Layout principal (+ CartProvider)
│   │   ├── page.tsx           # HOME PAGE (v2.5)
│   │   ├── robots.ts          # SEO robots
│   │   └── sitemap.ts         # Sitemap dinâmico
│   ├── components/            # Componentes React
│   │   ├── Header.tsx         # Mega menu (+ CartBadge)
│   │   ├── Footer.tsx
│   │   ├── cart/              # ⭐ NOVO (v2.9) - Sistema de Carrinho
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
│   │   ├── home/              # Componentes HOME (v2.5)
│   │   │   ├── index.ts       # Barrel export
│   │   │   ├── HeroSection.tsx
│   │   │   ├── TrustBar.tsx
│   │   │   ├── CategoriesSection.tsx
│   │   │   ├── FeaturedProducts.tsx
│   │   │   ├── DiferenciaisSection.tsx
│   │   │   ├── KnowledgeBlock.tsx
│   │   │   ├── HomeFAQ.tsx
│   │   │   ├── CoberturaSection.tsx
│   │   │   ├── SocialSection.tsx
│   │   │   ├── CTAFinal.tsx
│   │   │   └── WhatsAppFloat.tsx
│   │   ├── minha-lista/       # FEATURE MINHA LISTA (v2.6)
│   │   │   ├── index.ts       # Barrel export
│   │   │   ├── MinhaListaProvider.tsx  # Context API
│   │   │   ├── MinhaListaDrawer.tsx    # Drawer lateral (v2.2)
│   │   │   ├── MinhaListaFAB.tsx       # Botão flutuante
│   │   │   ├── SaveButton.tsx          # Botão coração
│   │   │   ├── ProductSaveWrapper.tsx  # Wrapper para PDP
│   │   │   └── Toast.tsx               # Notificações
│   │   ├── ofertas/           # Componentes de ofertas (v2.6)
│   │   │   ├── index.ts
│   │   │   ├── OfertaProductCard.tsx
│   │   │   ├── OfertasConfianca.tsx
│   │   │   ├── OfertasFiltros.tsx
│   │   │   ├── OfertasHero.tsx
│   │   │   └── TabelaSemantica.tsx
│   │   ├── reviews/           # Sistema de Reviews (v2.8)
│   │   │   ├── index.ts       # Barrel export
│   │   │   ├── ReviewsSection.tsx      # Container principal
│   │   │   ├── ReviewsSummary.tsx      # Resumo (média + barras)
│   │   │   └── ReviewCard.tsx          # Card individual de review
│   │   ├── search/            # Componentes de busca
│   │   │   ├── SearchModal.tsx
│   │   │   ├── SearchButton.tsx
│   │   │   ├── useSearchShortcut.ts
│   │   │   └── index.ts
│   │   ├── ProductPageContent.tsx  # PDP principal (v2.9 + BuyNowButton)
│   │   ├── ProductGallery.tsx
│   │   ├── ProductFAQ.tsx
│   │   ├── ProductRating.tsx      # (v2.7) - Estrelas de avaliação
│   │   ├── VizinhosAprovaram.tsx  # (v2.8) - Fotos de clientes
│   │   ├── ShippingCalculator.tsx
│   │   ├── MedidasCompactas.tsx
│   │   ├── VideoProduct.tsx
│   │   ├── RecursosMontagem.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── Pagination.tsx
│   │   ├── ProductCardListing.tsx
│   │   ├── SortControl.tsx
│   │   ├── SubcategoryCard.tsx
│   │   └── EmptyState.tsx
│   ├── lib/                   # Funções utilitárias
│   │   ├── supabase.ts        # Cliente server + funções DB
│   │   ├── supabase-browser.ts # Cliente browser
│   │   ├── seo.ts             # SEO
│   │   ├── shipping.ts        # Cálculo de frete
│   │   ├── smart-search.ts    # Busca inteligente
│   │   ├── minha-lista.ts     # Lógica da lista de favoritos (v2.6)
│   │   ├── cart.ts            # ⭐ NOVO (v2.9) - Lógica do carrinho
│   │   └── schemas/           # SCHEMAS JSON-LD
│   │       ├── home-schemas.ts
│   │       └── rating-schema.ts   # (v2.7) - Schema AggregateRating
│   ├── styles/                # ⭐ NOVO (v2.9)
│   │   └── cart-animations.css    # Animações do carrinho
│   ├── types/                 # TypeScript types
│   │   └── images.ts
│   └── middleware.ts          # Middleware Next.js (Supabase Auth)
├── package.json
└── tsconfig.json
```

---

## 🛒 FEATURE: CARRINHO DE COMPRAS v1.1 (v2.9 - Janeiro 2026)

### Visão Geral

Sistema completo de carrinho de compras com drawer lateral, página dedicada, checkout e processamento de pagamentos. Otimizado para mobile-first e público Classe C/D.

**Status atual:**
- ✅ Carrinho: **COMPLETO** — Context API, drawer, página, persistência
- ✅ Checkout: **ESTRUTURA** — Fluxo cadastro → pagamento
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
│                              │  (3 etapas)    │                │
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

### Interfaces TypeScript (cart-types.ts)

```typescript
// Produto no carrinho
interface CartProduct {
  id: string
  slug: string
  name: string
  price: number
  imageUrl: string
  subcategorySlug: string
  // Dimensões para cálculo de frete
  width?: number
  height?: number
  depth?: number
  weight?: number
}

// Item do carrinho (produto + quantidade)
interface CartItem {
  product: CartProduct
  quantity: number
  addedAt: number  // timestamp
}

// Informações de frete
interface ShippingInfo {
  cep: string
  city: string
  neighborhood: string
  fee: number
  deliveryDays: {
    min: number
    max: number
  }
  needsConfirmation: boolean
}

// Estado completo do carrinho
interface CartState {
  items: CartItem[]
  isOpen: boolean
  shipping: ShippingInfo | null
}

// Ações do reducer
type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: CartProduct; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }  // product id
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'SET_SHIPPING'; payload: ShippingInfo }
  | { type: 'CLEAR_SHIPPING' }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'LOAD_FROM_STORAGE'; payload: CartState }
```

### Arquivos da Feature

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
| `src/app/checkout/page.tsx` | Fluxo de checkout (3 etapas) |
| `src/app/pedido/confirmado/page.tsx` | Confirmação de pedido |
| **APIs** | |
| `src/app/api/shipping/route.ts` | Cálculo de frete por CEP |
| `src/app/api/payment/card/route.ts` | Processamento cartão |
| `src/app/api/payment/pix/route.ts` | Geração de Pix |
| `src/app/api/payment/webhook/route.ts` | Webhooks de pagamento |
| `src/app/api/orders/route.ts` | Criação/consulta de pedidos |

### Componente CartProvider

**Responsabilidades:**
- Gerenciar estado global do carrinho via Context API
- Persistir automaticamente em localStorage
- Expor valores computados (subtotal, total, itemCount)
- Controlar abertura/fechamento do drawer

**Hook useCart():**
```typescript
const {
  // Estado
  items,
  isOpen,
  shipping,
  
  // Valores computados
  itemCount,
  subtotal,
  subtotalPix,
  pixDiscount,
  total,
  totalPix,
  isEmpty,
  canCheckout,
  
  // Ações
  addItem,
  removeItem,
  updateQuantity,
  setShipping,
  clearShipping,
  clearCart,
  openDrawer,
  closeDrawer,
} = useCart()
```

### Componente CartDrawer

**Características:**
- Largura: 360px desktop, max 85vh mobile (bottom sheet)
- Animações: slide-in-right desktop, slide-up mobile
- Focus trap: navegação por teclado fica dentro do drawer
- Body scroll lock: previne scroll da página quando aberto
- ESC para fechar
- Click fora para fechar

**Estrutura:**
```
┌─────────────────────────────┐
│ [X]  Seu Carrinho (n)       │  ← Header
├─────────────────────────────┤
│                             │
│  ┌─────────────────────┐   │
│  │ CartItem            │   │  ← Lista de itens
│  │ [img] Nome          │   │
│  │       R$ 299,00     │   │
│  │       [-] 1 [+]     │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ CartItem            │   │
│  └─────────────────────┘   │
│                             │
├─────────────────────────────┤
│ Subtotal:       R$ 598,00   │  ← Footer
│ Com Pix (-5%):  R$ 568,10   │
│                             │
│ [    Ver Carrinho    ]      │  ← CTA secundário
│ [   Finalizar Compra ]      │  ← CTA principal
└─────────────────────────────┘
```

### Componente BuyNowButton v1.3

**Props:**
```typescript
interface BuyNowButtonProps {
  product: {
    id: string
    slug: string
    name: string
    price: number
    width_cm?: number
    height_cm?: number
    depth_cm?: number
    weight_kg?: number
    images?: Array<{ cloudinary_path?: string }>
  }
  subcategorySlug: string
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}
```

**Comportamento:**
1. Valida se produto já está no carrinho (limite de 5)
2. Extrai imagem de `product.images[0].cloudinary_path`
3. Converte dimensões para números (evita NaN)
4. Adiciona ao carrinho via Context
5. Abre drawer automaticamente
6. Exibe toast de confirmação

### Componente CartBadge

**Variantes:**
```typescript
type BadgeVariant = 'full' | 'text' | 'mini'
```

| Variante | Aparência | Uso |
|----------|-----------|-----|
| `full` | Ícone + "Carrinho" + badge | Header desktop |
| `text` | "Carrinho (n)" | Menu mobile |
| `mini` | Só ícone + badge | Header compacto |

### Componente CartLoading

**Variantes:**
```typescript
type LoadingVariant = 'compact' | 'full' | 'drawer' | 'page' | 'checkout'
```

| Variante | Uso |
|----------|-----|
| `compact` | Skeleton de item único |
| `full` | Skeleton de item expandido |
| `drawer` | 3 itens compact para drawer |
| `page` | Layout completo da página |
| `checkout` | Layout do checkout |

### Página /carrinho

**Seções:**
1. Breadcrumb (Home > Carrinho)
2. Título + contador
3. Lista de itens (CartItem)
4. Calculadora de frete
5. Resumo (subtotal, frete, total)
6. CTAs (Continuar Comprando, Finalizar)

**Estados:**
- **Vazio:** Mostra CartEmpty com sugestões
- **Com itens:** Mostra lista + resumo
- **Carregando:** Mostra CartLoading variant="page"

### Página /checkout

**Etapas:**
1. **Identificação:** Nome, email, telefone, CPF
2. **Endereço:** CEP (auto-preenche), complemento
3. **Pagamento:** Pix ou Cartão

**Validações:**
- CPF válido (algoritmo de verificação)
- Email válido
- Telefone com DDD
- CEP da região atendida

### APIs do Carrinho

#### GET/POST /api/shipping

**Request:**
```typescript
POST /api/shipping
{
  "cep": "80250-104",
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "weight": 25.5,
      "dimensions": { width: 136, height: 45, depth: 38 }
    }
  ]
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "cep": "80250-104",
    "city": "Curitiba",
    "neighborhood": "Centro",
    "fee": 25.00,
    "deliveryDays": { "min": 1, "max": 3 },
    "needsConfirmation": false
  }
}
```

#### POST /api/payment/pix

**Request:**
```typescript
{
  "orderId": "uuid",
  "amount": 568.10,
  "customer": {
    "name": "João Silva",
    "email": "joao@email.com",
    "cpf": "12345678900"
  }
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "qrCode": "00020126...",
    "qrCodeBase64": "data:image/png;base64,...",
    "expiresAt": "2026-01-27T18:00:00Z",
    "pixKey": "pix@moveirama.com.br"
  }
}
```

### Funções Utilitárias (cart-utils.ts)

```typescript
// Formatação
formatCurrency(value: number): string  // "R$ 299,00"
formatDimensions(w, h, d): string      // "136 × 45 × 38 cm"

// Máscaras
maskCEP(value: string): string         // "80250-104"
maskCPF(value: string): string         // "123.456.789-00"
maskPhone(value: string): string       // "(41) 98420-9323"

// Validação
isValidCEP(cep: string): boolean
isValidCPF(cpf: string): boolean
isValidEmail(email: string): boolean

// Storage
saveCartToStorage(state: CartState): void
loadCartFromStorage(): CartState | null
clearCartStorage(): void
```

### Animações (cart-animations.css)

```css
/* Fade in */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up (mobile bottom sheet) */
@keyframes slide-up-mobile {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

/* Slide in (desktop drawer) */
@keyframes slide-in-right {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
```

### Integração no Layout

**Arquivo:** `src/app/layout.tsx`

```tsx
import { CartProvider, ToastProvider } from '@/components/cart'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CartProvider>
          <ToastProvider>
            <Header />  {/* CartBadge integrado */}
            {children}
            <CartDrawer />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  )
}
```

### Integração na PDP

**Arquivo:** `src/components/ProductPageContent.tsx`

```tsx
import { BuyNowButton } from '@/components/cart'

// Na seção de CTAs:
<BuyNowButton
  product={product}
  subcategorySlug={subcategorySlug}
  variant="primary"
  size="lg"
/>
```

### Fluxo Completo de Compra

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

4. /checkout: Cadastro + Pagamento
   ├── Etapa 1: Dados pessoais
   ├── Etapa 2: Endereço de entrega
   └── Etapa 3: Forma de pagamento

5. /pedido/confirmado: Confirmação
   ├── Número do pedido
   ├── Resumo dos itens
   ├── QR Code Pix (se aplicável)
   └── Prazo de entrega
```

### Decisões Técnicas do Carrinho

#### Por que Context API e não Redux/Zustand?
- Complexidade adequada para o escopo
- Menos dependências externas
- Performance suficiente para ~5 itens
- Integração nativa com React 19

#### Por que localStorage e não banco de dados?
- Não requer login (friction-free para Classe C)
- Funciona offline
- Reduz chamadas ao servidor
- Expiração de 30 dias é suficiente

#### Por que limite de 5 produtos diferentes?
- Móveis são compras planejadas, não impulsivas
- Simplifica logística de entrega
- Evita carrinhos abandonados muito grandes
- Classe C/D compra 1-3 móveis por vez

#### Por que bottom sheet no mobile?
- Padrão familiar (apps de e-commerce)
- Área de toque maior que drawer lateral
- Não bloqueia visualização do header
- Gesture-friendly para fechar (swipe down)

---

## ⭐ FEATURE: REVIEWS E VIZINHOS QUE APROVARAM (v2.8 - Janeiro 2026)

### Visão Geral

Sistema completo de prova social na PDP com duas seções:
1. **Reviews** — Avaliações em texto com nota (1-5 estrelas)
2. **Vizinhos que Aprovaram** — Galeria de fotos reais de clientes

**Status atual:**
- ✅ Reviews: **DINÂMICO** — dados vêm da tabela `reviews`
- ✅ Vizinhos: **DINÂMICO** — fotos vêm da tabela `customer_photos` + Storage
- ❌ Coleta de reviews: **NÃO IMPLEMENTADO** — cliente não pode deixar review pelo site

### Arquivos da Feature

| Arquivo | Descrição |
|---------|-----------|
| `src/components/reviews/index.ts` | Barrel export |
| `src/components/reviews/ReviewsSection.tsx` | Container principal |
| `src/components/reviews/ReviewsSummary.tsx` | Resumo: média, total, barras de distribuição |
| `src/components/reviews/ReviewCard.tsx` | Card individual de review |
| `src/components/VizinhosAprovaram.tsx` | Galeria de fotos de clientes |
| `src/app/api/customer-photos/route.ts` | API para buscar fotos |
| `src/app/globals.css` | CSS do vizinhos (adicionado no final) |

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

### API: GET /api/customer-photos

**Query params:**
- `productId` (opcional): Prioriza fotos deste produto
- `limit` (opcional): Máximo de fotos, default 4

**Retorno:**
```json
{
  "photos": [
    {
      "id": "uuid",
      "image_url": "https://...",
      "bairro": "Boqueirão",
      "cidade": "Curitiba",
      "product": { "name": "Rack Duetto", "slug": "rack-duetto" }
    }
  ]
}
```

### Ordem das Seções na PDP (v2.9)

```
[Breadcrumb]
[Galeria + Info]
[ProductRating] (estrelas)
[Medidas]
[Calculadora Frete]
[CTAs: BuyNowButton + WhatsApp]  ← Atualizado v2.9
[SaveButton]
[Trust Badges]
[VideoProduct]
[RecursosMontagem]
[Especificações]
[ProductFAQ]
[ReviewsSection]
[Compre com segurança]
[VizinhosAprovaram]
[Sticky Bar Mobile]
```

---

## ⭐ FEATURE: PRODUCT RATING (v2.7 - Janeiro 2026)

### Visão Geral

Sistema de avaliação de produtos com estrelas visuais e Schema.org AggregateRating para Rich Snippets no Google e Google Merchant Center.

**Status atual:** Implementação visual completa. Aguardando:
1. Bloco de comentários de clientes (design do Squad Visual)
2. Sistema de validação/coleta de avaliações

### Arquivos da Feature

| Arquivo | Descrição |
|---------|-----------|
| `src/components/ProductRating.tsx` | Componente visual de estrelas (5 estrelas com fill parcial) |
| `src/lib/schemas/rating-schema.ts` | Gerador de Schema.org AggregateRating |

### Campos no Banco de Dados

```sql
-- Campos adicionados na tabela products
rating_average DECIMAL(2,1) DEFAULT 0   -- Ex: 4.8
rating_count INTEGER DEFAULT 0           -- Ex: 127
```

### Componente ProductRating.tsx

```tsx
interface ProductRatingProps {
  rating: number      // 0-5 (aceita decimais como 4.8)
  reviewCount: number // quantidade de avaliações
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean // exibir "(127 avaliações)"
}
```

---

## ❤️ FEATURE: MINHA LISTA (v2.6 - Janeiro 2026)

### Visão Geral

Feature de lista de favoritos que permite ao cliente salvar produtos para comparar depois. Dados salvos em localStorage (sem necessidade de login).

**Nome na UI:** "Móveis que mais gostei" (literal e afetivo para público Classe C)

### Arquivos da Feature

| Arquivo | Descrição |
|---------|-----------|
| `src/lib/minha-lista.ts` | Interface `ListaItem` + funções de localStorage |
| `src/components/minha-lista/MinhaListaProvider.tsx` | Context API global (estado + ações) |
| `src/components/minha-lista/MinhaListaDrawer.tsx` | Drawer lateral com lista de produtos **(v2.2)** |
| `src/components/minha-lista/MinhaListaFAB.tsx` | Botão flutuante "Móveis que gostei" |
| `src/components/minha-lista/SaveButton.tsx` | Botão coração (salvar/remover) |
| `src/components/minha-lista/ProductSaveWrapper.tsx` | Wrapper que adiciona SaveButton à PDP |
| `src/components/minha-lista/Toast.tsx` | Notificações de feedback |
| `src/components/minha-lista/index.ts` | Barrel export |

---

## 🏠 HOME PAGE (v2.5 - Implementada)

### Estrutura de Seções (ordem no layout)

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

### Schemas JSON-LD (home-schemas.ts)

9 schemas implementados para SEO máximo:

| # | Schema | Função |
|---|--------|--------|
| 1 | Organization | Dados da empresa |
| 2 | LocalBusiness | Loja física/local |
| 3 | WebSite | SearchAction para busca |
| 4 | FAQPage | Perguntas da home |
| 5 | BreadcrumbList | Navegação |
| 6 | WebPage | Página principal |
| 7 | DeliveryService | Informações de entrega |
| 8 | OfferCatalog | Catálogo de produtos |
| 9 | AggregateRating | Avaliações |

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

⭐ ROTAS DO CARRINHO (v2.9):
/carrinho → Página completa do carrinho
/checkout → Fluxo de checkout (3 etapas)
/pedido/confirmado → Confirmação de pedido

⭐ ROTAS INSTITUCIONAIS (v2.6/v2.7):
/entrega-moveis-curitiba-rmc → Página de cobertura de entrega
/fale-com-a-gente → Página de contato
/ofertas-moveis-curitiba → Página de ofertas
/politica-privacidade → Política de privacidade (v2.7)
/politica-trocas-devolucoes → Política de trocas (v2.7)
```

### Categorias Pai Conhecidas

```typescript
const PARENT_CATEGORIES = ['moveis-para-casa', 'moveis-para-escritorio'];
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
| `orders` | ⭐ (v2.9) — Pedidos |
| `order_items` | ⭐ (v2.9) — Itens dos pedidos |

### IDs Importantes

| Entidade | UUID |
|----------|------|
| Supplier Artely | `5c34ee22-445a-45ac-bec7-e9ac3a1a2b04` |
| Supplier Artany | `f2f7a7d0-68d0-4e0a-aac7-293780d1bf4d` |
| Categoria `moveis-para-casa` | Buscar por slug |
| Categoria `moveis-para-escritorio` | Buscar por slug |

### Campos Importantes de Produto

```sql
-- Campos obrigatórios (NOT NULL)
slug, sku, name, supplier_id, category_id, short_description,
price, width_cm, height_cm, depth_cm, weight_kg, main_material,
assembly_difficulty, assembly_time_minutes

-- Campos de mídia
assembly_video_url      -- URL YouTube vídeo montagem
video_product_url       -- URL YouTube vídeo do produto
manual_pdf_url          -- URL PDF do manual
medidas_image_url       -- URL imagem de medidas

-- Campos de compatibilidade (racks/painéis)
tv_max_size             -- Polegadas máximas TV
weight_capacity         -- Peso suportado kg
requires_wall_mount     -- Precisa furar parede?

-- Campos de características
num_doors, num_drawers, num_shelves, num_niches
has_wheels, has_mirror, has_lighting
door_type, feet_type

-- Campo para Home Page
is_featured             -- Boolean: aparece em "Mais Vendidos"

-- Campos de avaliação (v2.7)
rating_average          -- DECIMAL(2,1): média de 0.0 a 5.0
rating_count            -- INTEGER: quantidade de avaliações
```

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

## 🧩 COMPONENTES PRINCIPAIS

### Header.tsx (Mega Menu)
- Menu desktop com hover dropdowns
- Menu mobile acordeão
- Dropdown simples para Casa
- Dropdown 2 painéis para Escritório (linhas: Home Office, Profissional)
- Busca (abre SearchModal)
- **CartBadge** (v2.9) — Badge do carrinho
- Link WhatsApp fixo
- Fechamento automático ao navegar

### ProductPageContent.tsx (PDP) — v2.9
- **Seções:**
  1. Schema.org JSON-LD (Product, FAQ, Breadcrumb, AggregateRating*)
  2. Breadcrumb
  3. Galeria de imagens (ProductGallery)
  4. Info: H1, preço, Pix, parcelas
  5. **ProductRating (estrelas)** - v2.7
  6. MedidasCompactas (L × A × P)
  7. ShippingCalculator
  8. **BuyNowButton** (v2.9) + WhatsApp
  9. **SaveButton (Minha Lista)** - v2.6
  10. Trust badges
  11. VideoProduct (se tiver vídeo)
  12. RecursosMontagem
  13. Especificações técnicas
  14. ProductFAQ (dinâmico ou do banco)
  15. **ReviewsSection** - v2.8 (avaliações de texto)
  16. Compre com segurança
  17. **VizinhosAprovaram** - v2.8 (fotos de clientes)
  18. Sticky bar mobile

*AggregateRating só é injetado se produto tiver avaliações reais

---

## 📌 APIs

### /api/admin/products
- `GET`: Lista produtos com imagens, filtros (busca, categoria)
- Campos: id, sku, name, slug, price, category_slug, product_images

### /api/admin/products/[id]
- `GET`: Produto específico com detalhes
- `PATCH`: Atualiza campos (video_product_url, tv_max_size, rating_average, rating_count, etc.)

### /api/admin/images/upload
- `POST`: Upload de imagem
- Converte para WebP com sharp
- Gera filename SEO Elite
- Gera alt_text otimizado
- Salva em Supabase Storage

### /api/shipping (⭐ v2.9)
- `POST`: Calcula frete por CEP
- Retorna: fee, deliveryDays, needsConfirmation

### /api/payment/pix (⭐ v2.9)
- `POST`: Gera QR Code Pix
- Retorna: qrCode, qrCodeBase64, expiresAt

### /api/payment/card (⭐ v2.9)
- `POST`: Processa pagamento cartão
- Retorna: status, transactionId

### /api/orders (⭐ v2.9)
- `POST`: Cria novo pedido
- `GET`: Consulta pedido por ID

### /api/customer-photos
- `GET`: Busca fotos de clientes para seção "Vizinhos que Aprovaram"

### /api/search
- `GET`: Busca inteligente (smart-search.ts)

---

## 🔍 SEO (lib/seo.ts)

### Funções Principais

| Função | Descrição |
|--------|-----------|
| `generateProductH1()` | H1 otimizado (inclui TV para racks) |
| `generateProductMetaDescription()` | Meta description com preço e prazo |
| `generateProductSchema()` | Schema.org Product com shippingDetails |
| `generateFAQSchema()` | Schema.org FAQPage |
| `generateProductFAQs()` | FAQs dinâmicas baseadas no tipo |
| `inferCategoryType()` | Detecta tipo (rack, painel, escrivaninha) |
| `generateCategoryH1()` | H1 para páginas de listagem |
| `generateCategoryTitle()` | Meta title para categorias |

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

## 👨‍💼 ADMIN

### /admin (Principal)
**Arquivo:** `src/app/admin/page.tsx`

#### Funcionalidades
- Login com senha (ADMIN_PASSWORD env var)
- Lista produtos com filtros (busca, com/sem imagens)
- Upload de imagens (drag & drop, múltiplas)
- Reordenação de imagens (drag & drop com dnd-kit)
- Edição de campos
- Exclusão de imagens
- Estatísticas (total, com/sem imagens)

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
9. **⭐ Carrinho:** Dados em localStorage, key `moveirama_cart`
10. **⭐ Limite carrinho:** 5 produtos diferentes, 5 unidades cada
11. **Rating:** Schema AggregateRating SÓ se tiver avaliações reais
12. **Reviews:** Dados dinâmicos da tabela `reviews`
13. **Vizinhos:** Fotos dinâmicas da tabela `customer_photos`

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

### Por que limite de 5 produtos no carrinho? (v2.9)
- Móveis são compras planejadas, não impulsivas
- Simplifica logística de entrega
- Evita carrinhos abandonados muito grandes
- Classe C/D compra 1-3 móveis por vez

### Por que bottom sheet no mobile para CartDrawer? (v2.9)
- Padrão familiar (apps de e-commerce)
- Área de toque maior que drawer lateral
- Não bloqueia visualização do header
- Gesture-friendly para fechar (swipe down)

### Por que `export { default as X }` no index.ts?
Componentes React geralmente usam `export default`. Para fazer barrel export (re-exportar tudo de um index.ts), usamos a sintaxe `export { default as NomeComponente } from './NomeComponente'`.

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
10. **⏳ Integrar gateway de pagamento real** (Mercado Pago/Stripe)
11. **⏳ Sistema de coleta de reviews** (formulário no site)
12. **⏳ Moderação de reviews no admin**
13. **⏳ Notificações por email** (confirmação de pedido)

---

## 📝 CHANGELOG RECENTE

| Data | Versão | Mudança |
|------|--------|---------|
| **27/01/2026** | **v2.9.0** | **Sistema de Carrinho v1.1:** CartProvider com Context API, CartDrawer (360px desktop, bottom sheet mobile), BuyNowButton v1.3, página /carrinho, checkout 3 etapas, localStorage com expiração 30 dias |
| **27/01/2026** | **v2.9.0** | **APIs de Compra:** /api/shipping, /api/payment/pix, /api/payment/card, /api/orders |
| **27/01/2026** | **v2.9.0** | **Componentes Carrinho:** CartBadge (3 variantes), CartItem, CartEmpty, CartLoading (5 variantes), QuantityControl, Toast |
| **27/01/2026** | **v2.9.0** | **Integração PDP:** BuyNowButton substitui botão de compra anterior |
| 26/01/2026 | v2.8.0 | **Reviews:** Componentes ReviewsSection, ReviewsSummary, ReviewCard |
| 26/01/2026 | v2.8.0 | **Vizinhos que Aprovaram:** Componente VizinhosAprovaram, API `/api/customer-photos` |
| 26/01/2026 | v2.7.0 | **ProductRating:** Estrelas com preenchimento parcial, Schema AggregateRating condicional |
| 24/01/2026 | v2.6.1 | MinhaListaDrawer v2.2: compartilhamento WhatsApp |
| 24/01/2026 | v2.6 | Feature "Minha Lista" (favoritos) |
| 23/01/2026 | v2.5 | Home Page completa: 11 componentes, 9 schemas JSON-LD |

---

*Documento atualizado pelo Squad Dev — 27 de Janeiro de 2026*
