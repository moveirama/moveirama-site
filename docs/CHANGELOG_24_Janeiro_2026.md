# 📋 CHANGELOG — Janeiro 2026

> **Moveirama — Atualizações Recentes**  
> **Período:** 20-25 de Janeiro 2026  
> **Versão do Projeto:** v2.6

---

## 📌 RESUMO EXECUTIVO

| # | Funcionalidade | Status | Impacto |
|---|----------------|--------|---------|
| 1 | Sistema de Ofertas | ✅ Completo | Alto — Conversão |
| 2 | Categorias Secundárias | ✅ Completo | Médio — SEO/UX |
| 3 | Correção Admin Ofertas | ✅ Completo | Crítico — Bug fix |
| 4 | Header v2.3 | ✅ Completo | Baixo — Navegação |

---

## 1️⃣ SISTEMA DE OFERTAS

### O que é
Página dedicada para produtos em promoção, acessível pelo menu principal.

### URL
```
/ofertas-moveis-curitiba
```

### Funcionalidades
- Listagem de todos produtos com `is_on_sale = true`
- Exibição de desconto calculado (% OFF)
- Preço "De/Por" com riscado
- Badge de desconto nos cards
- SEO otimizado para "ofertas móveis Curitiba"

### Arquivos envolvidos
| Arquivo | Descrição |
|---------|-----------|
| `src/app/ofertas-moveis-curitiba/page.tsx` | Página de ofertas |
| `src/components/Header.tsx` | Link no menu (v2.3) |
| `src/lib/supabase.ts` | Query de produtos em oferta |

### Campos no banco (tabela `products`)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `is_on_sale` | boolean | Marca se está em oferta |
| `price` | decimal | **Preço ATUAL** (que cliente paga) |
| `compare_at_price` | decimal | **Preço ANTERIOR** (riscado "De") |

### Lógica de exibição
```
Se is_on_sale = true E compare_at_price > price:
  → Mostrar "De R$ {compare_at_price}" (riscado)
  → Mostrar "Por R$ {price}" (destaque)
  → Calcular desconto: ((compare_at_price - price) / compare_at_price) * 100
```

---

## 2️⃣ CATEGORIAS SECUNDÁRIAS

### O que é
Permite que um produto apareça em múltiplas categorias sem duplicar o cadastro.

### Caso de uso
- Produto "Penteadeira Dora" está na categoria principal `penteadeiras`
- Também pode aparecer em `escrivaninhas` como categoria secundária
- URL principal permanece `/penteadeiras/penteadeira-dora`

### Estrutura do banco

#### Nova tabela: `product_secondary_categories`
```sql
CREATE TABLE product_secondary_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, category_id)
);
```

#### Índices
```sql
CREATE INDEX idx_psc_product ON product_secondary_categories(product_id);
CREATE INDEX idx_psc_category ON product_secondary_categories(category_id);
```

### Arquivos atualizados
| Arquivo | Versão | Mudança |
|---------|--------|---------|
| `src/lib/supabase.ts` | v2.5 | Função `getProductsByCategory()` busca categorias primárias + secundárias |

### Query atualizada
```typescript
// Busca produtos da categoria (primária OU secundária)
const { data } = await supabase
  .from('products')
  .select(`
    *,
    category:categories!category_id(*),
    product_images(*),
    product_secondary_categories!inner(category_id)
  `)
  .or(`category_id.eq.${categoryId},product_secondary_categories.category_id.eq.${categoryId}`)
```

### Como adicionar categoria secundária
```sql
-- Exemplo: Dora em escrivaninhas (como secundária)
INSERT INTO product_secondary_categories (product_id, category_id)
VALUES (
  (SELECT id FROM products WHERE slug = 'penteadeira-dora-branco'),
  (SELECT id FROM categories WHERE slug = 'escrivaninhas')
);
```

---

## 3️⃣ CORREÇÃO ADMIN OFERTAS (Bug Crítico)

### Problema identificado
Interface do admin estava **invertendo os campos** ao marcar produto em oferta:
- Preço promocional ia para `compare_at_price` (errado!)
- Preço original ficava em `price` (errado!)

### Sintoma
Produtos mostravam "De R$ 179 por R$ 219" (invertido)

### Causa raiz
Campo "Vender por:" no admin salvava no campo errado.

### Solução implementada (v2.1)
Lógica automática ao marcar "Produto em Oferta":

1. **Ao marcar checkbox:**
   - Preço atual (`price`) → move para `compare_at_price`
   - Campo `price` limpa para digitar valor promocional

2. **Ao desmarcar checkbox:**
   - `compare_at_price` → restaura para `price`
   - `compare_at_price` limpa

### Arquivo corrigido
```
src/app/admin/imagens/page.tsx (v2.1)
```

### Melhorias na interface
- Preview mostra "Preço original (será riscado)"
- Campo promocional destacado em terracota (#B85C38)
- Validação: avisa se preço promocional ≥ preço original
- Campo de preço normal oculto quando em oferta

### SQL para corrigir produtos já afetados
```sql
-- Identificar produtos com inversão
SELECT sku, name, price, compare_at_price
FROM products
WHERE compare_at_price IS NOT NULL 
  AND price > compare_at_price
  AND is_on_sale = true;

-- Corrigir um produto específico (exemplo)
UPDATE products 
SET price = 179.00,           -- preço promocional
    compare_at_price = 219.00 -- preço original
WHERE sku = '004706';
```

---

## 4️⃣ HEADER v2.3

### Mudança
Link "Ofertas" no menu apontava para URL errada.

### Antes
```jsx
href="/ofertas"  // ❌ Não existe
```

### Depois
```jsx
href="/ofertas-moveis-curitiba"  // ✅ Correto
```

### Locais alterados
- Linha ~477: Menu desktop
- Linha ~577: Menu mobile

---

## 📁 ARQUIVOS MODIFICADOS/CRIADOS

### Novos arquivos
| Arquivo | Descrição |
|---------|-----------|
| `src/app/ofertas-moveis-curitiba/page.tsx` | Página de ofertas |
| `sql/product_secondary_categories.sql` | Criação da tabela |

### Arquivos atualizados
| Arquivo | Versão | Mudança |
|---------|--------|---------|
| `src/components/Header.tsx` | v2.3 | Link ofertas corrigido |
| `src/lib/supabase.ts` | v2.5 | Suporte a categorias secundárias |
| `src/app/admin/imagens/page.tsx` | v2.1 | Lógica de oferta corrigida |

---

## 🗄️ MUDANÇAS NO BANCO DE DADOS

### Nova tabela
```sql
product_secondary_categories
```

### Novos campos (já existiam, documentando uso)
```sql
products.is_on_sale      -- Boolean: está em oferta?
products.compare_at_price -- Decimal: preço "De" (anterior)
```

---

## ✅ CHECKLIST DE DEPLOY

### Banco de dados
- [x] Criar tabela `product_secondary_categories`
- [x] Criar índices
- [ ] Corrigir produtos com preços invertidos (se houver)

### Código
- [x] `Header.tsx` v2.3 — Link ofertas
- [x] `supabase.ts` v2.5 — Categorias secundárias  
- [x] `page.tsx` (admin) v2.1 — Lógica ofertas
- [x] Página `/ofertas-moveis-curitiba`

### Testes
- [ ] Verificar página de ofertas carrega
- [ ] Verificar produtos aparecem nas categorias secundárias
- [ ] Testar fluxo de marcar/desmarcar oferta no admin
- [ ] Validar preços exibidos corretamente (De/Por)

---

## 📊 IMPACTO NAS MÉTRICAS

| Área | Esperado |
|------|----------|
| **SEO** | +visibilidade para "ofertas móveis Curitiba" |
| **Conversão** | +cliques em produtos com desconto visível |
| **UX** | Produtos em múltiplas categorias = melhor descoberta |
| **Operação** | Admin mais intuitivo para gerenciar ofertas |

---

## 🔜 PRÓXIMOS PASSOS SUGERIDOS

1. **Auditoria de ofertas** — Verificar se há produtos com preços invertidos
2. **Adicionar mais categorias secundárias** — Identificar produtos que fazem sentido em múltiplas categorias
3. **Banner de ofertas na home** — Destacar promoções na página inicial
4. **Filtro de ofertas nas listagens** — Permitir filtrar "só ofertas" em qualquer categoria

---

*Documento criado em 25 de Janeiro de 2026*  
*Squad Dev Moveirama*
