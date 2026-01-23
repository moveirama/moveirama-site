# 🖥️ SETUP LOCAL — Moveirama

> **Criado:** 23 de Janeiro de 2026  
> **Objetivo:** Documentar o ambiente de desenvolvimento local

---

## ✅ PRÉ-REQUISITOS INSTALADOS

| Software | Versão | Status |
|----------|--------|--------|
| Node.js | v24.11.0 | ✅ |
| Git | v2.52.0 | ✅ |
| VS Code | Atual | ✅ |

---

## 📁 LOCALIZAÇÃO DO PROJETO

```
C:\Users\sandr\Desktop\moveirama-site
```

---

## 🔑 VARIÁVEIS DE AMBIENTE

Arquivo: `.env.local` (na raiz do projeto)

```env
NEXT_PUBLIC_SUPABASE_URL=https://ewsmfvisypgxbeqtbmec.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG... (chave completa)
SUPABASE_SERVICE_ROLE_KEY=eyJhbG... (chave completa)
ADMIN_PASSWORD=moveirama2026
```

⚠️ **IMPORTANTE:** O arquivo `.env.local` **não vai para o GitHub** (está no `.gitignore`). As chaves de produção estão configuradas na Vercel.

---

## 🛠️ COMANDOS ÚTEIS

### Abrir o projeto no VS Code
```bash
cd C:\Users\sandr\Desktop\moveirama-site
code .
```

### Instalar dependências (só precisa 1x, ou quando mudar package.json)
```bash
npm install
```

### Testar o build localmente
```bash
npm run build
```
Se aparecer `✓ Compiled successfully` → está OK para deploy.

### Rodar o site localmente (modo desenvolvimento)
```bash
npm run dev
```
Acessa em: http://localhost:3000

### Enviar alterações para GitHub (e consequentemente Vercel)
```bash
git add .
git commit -m "descrição do que mudou"
git push
```

---

## 📊 FLUXO DE TRABALHO

```
1. Editar arquivos no VS Code
         ↓
2. Testar build: npm run build
         ↓
3. Se PASSOU → git add . → git commit → git push
         ↓
4. GitHub recebe → Vercel faz deploy automático
         ↓
5. Site atualizado em produção
```

---

## 🔗 LINKS IMPORTANTES

| Recurso | URL |
|---------|-----|
| Site produção | https://moveirama-site.vercel.app |
| Admin | https://moveirama-site.vercel.app/admin |
| GitHub | https://github.com/moveirama/moveirama-site |
| Supabase | https://supabase.com/dashboard/project/ewsmfvisypgxbeqtbmec |
| Vercel | https://vercel.com (projeto moveirama-site) |

---

## 📝 HISTÓRICO DE CORREÇÕES

### 23/01/2026 — Lazy Initialization Supabase

**Problema:** Build falhava na Vercel porque 3 arquivos de API tinham `createClient()` no escopo global.

**Arquivos corrigidos:**
- `src/app/api/admin/images/sync/route.ts`
- `src/app/api/admin/images/process-batch/route.ts`
- `src/app/api/admin/products/[id]/route.ts`

**Solução:** Usar função `getSupabaseAdmin()` que só cria o client quando chamada.

---

## ⚠️ AVISOS CONHECIDOS (não bloqueiam)

1. **Middleware deprecated:** Aviso sobre convenção de middleware. Não afeta funcionamento.

2. **Erro `product_images_1.url`:** Query na Home Page tem problema de nome de coluna. Não impede build.

---

*Documento criado pelo Squad Dev — Janeiro 2026*
