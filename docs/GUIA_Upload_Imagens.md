# 📸 GUIA: Upload de Imagens de Produtos

> **Para:** Sandro (Moveirama)  
> **Última atualização:** Janeiro 2026  
> **Tempo estimado:** 10-15 minutos por lote

---

## 📋 Antes de Começar

### O que você vai precisar:
- [ ] Pastas com imagens dos produtos (organizadas por slug)
- [ ] Acesso ao Supabase Storage
- [ ] Senha do painel Admin

### Regra das pastas:
```
📁 nome-da-pasta = slug do produto (exatamente igual ao banco)

Exemplo:
📁 rack-theo-cinamomo-off-white/
   ├── 1.jpg  ← foto principal
   ├── 2.jpg
   └── 3.jpg
```

---

## 🚀 Passo a Passo

### PASSO 1 — Organizar as imagens

Renomeie as imagens de cada produto para `1.jpg`, `2.jpg`, `3.jpg`...

> 💡 **Dica:** A imagem `1.jpg` será a foto principal do produto no site.

---

### PASSO 2 — Upload para o Supabase Storage

1. Acesse o **Supabase Dashboard**:
   ```
   https://supabase.com/dashboard/project/ewsmfvisypgxbeqtbmec
   ```

2. No menu lateral, clique em **Storage**

3. Clique no bucket **product-images**

4. Entre na pasta **originais**

5. **Arraste as pastas** dos produtos para dentro da pasta `originais`

> ⚠️ **Importante:** O nome da pasta deve ser EXATAMENTE o slug do produto no banco.

---

### PASSO 3 — Acessar o painel Admin

1. Abra no navegador:
   ```
   https://moveirama-site.vercel.app/admin
   ```

2. Faça login com a senha do admin

---

### PASSO 4 — Abrir o Console do navegador

1. Aperte **F12** no teclado (ou clique com botão direito → "Inspecionar")

2. Clique na aba **Console**

---

### PASSO 5 — Executar o script de processamento

1. Copie o script abaixo
2. **Substitua os slugs** pelos produtos que você fez upload
3. **Substitua a senha** pela senha correta
4. Cole no Console e aperte **Enter**

```javascript
const slugs = [
  'slug-do-produto-1',
  'slug-do-produto-2',
  'slug-do-produto-3'
];

const ADMIN_PASSWORD = 'SUA_SENHA_AQUI';

async function processarTodos() {
  console.log('🚀 Iniciando processamento de ' + slugs.length + ' produtos...\n');
  
  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    
    try {
      const response = await fetch(`/api/admin/images/process-batch?password=${encodeURIComponent(ADMIN_PASSWORD)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug })
      });
      
      const result = await response.json();
      
      if (result.error) {
        console.log(`[${i + 1}/${slugs.length}] ❌ ${slug}: ${result.error}`);
      } else {
        console.log(`[${i + 1}/${slugs.length}] ✅ ${slug}: ${result.images_processed} imagem(ns)`);
      }
    } catch (e) {
      console.log(`[${i + 1}/${slugs.length}] ❌ ${slug}: ${e.message}`);
    }
    
    if (i < slugs.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('\n🎉 PROCESSAMENTO FINALIZADO!');
}

processarTodos();
```

---

### PASSO 6 — Verificar o resultado

No Console você verá algo assim:

```
🚀 Iniciando processamento de 3 produtos...

[1/3] ✅ rack-theo-cinamomo-off-white: 4 imagem(ns)
[2/3] ✅ painel-cross-preto: 3 imagem(ns)
[3/3] ✅ escrivaninha-match-branco: 2 imagem(ns)

🎉 PROCESSAMENTO FINALIZADO!
```

- ✅ = imagens processadas com sucesso
- ❌ = erro (verifique o nome da pasta/slug)

---

### PASSO 7 — Conferir no site

1. Acesse a página do produto no site
2. Verifique se as imagens aparecem na galeria

---

## ❓ Problemas Comuns

| Problema | Causa | Solução |
|----------|-------|---------|
| `Product not found` | Slug da pasta está errado | Verificar se o nome da pasta é igual ao slug no banco |
| `No images found` | Pasta vazia | Fazer upload das imagens 1.jpg, 2.jpg... |
| Imagens não aparecem no site | Processamento não foi feito | Rodar o script novamente |

---

## 📝 Exemplo Completo

Você tem 3 produtos Artany para cadastrar imagens:

**1. Organizar pastas:**
```
📁 gaveteiro-day-olmo-branco/
   ├── 1.jpg
   └── 2.jpg

📁 estante-hit-carvalho-branco/
   ├── 1.jpg
   ├── 2.jpg
   └── 3.jpg

📁 mesa-de-reuniao-modular-y37-nogal-preto/
   └── 1.jpg
```

**2. Upload para:** Supabase → Storage → product-images → originais

**3. Script com os slugs:**
```javascript
const slugs = [
  'gaveteiro-day-olmo-branco',
  'estante-hit-carvalho-branco',
  'mesa-de-reuniao-modular-y37-nogal-preto'
];

const ADMIN_PASSWORD = 'minhasenha123';

// ... resto do script
```

**4. Resultado esperado:**
```
[1/3] ✅ gaveteiro-day-olmo-branco: 2 imagem(ns)
[2/3] ✅ estante-hit-carvalho-branco: 3 imagem(ns)
[3/3] ✅ mesa-de-reuniao-modular-y37-nogal-preto: 1 imagem(ns)
```

---

## 🔗 Links Úteis

| O quê | Link |
|-------|------|
| Supabase Storage | https://supabase.com/dashboard/project/ewsmfvisypgxbeqtbmec/storage/buckets/product-images |
| Admin Moveirama | https://moveirama-site.vercel.app/admin |

---

## ✅ Checklist Rápido

```
□ Pastas organizadas (nome = slug do produto)
□ Imagens renomeadas (1.jpg, 2.jpg...)
□ Upload feito no Supabase → originais/
□ Script executado no Console do Admin
□ Verificado no site se imagens aparecem
```

---

*Dúvidas? Chama o Squad Dev!*
