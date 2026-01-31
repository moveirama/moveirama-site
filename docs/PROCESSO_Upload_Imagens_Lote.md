# 📸 PROCESSO: Upload de Imagens em Lote

> **Documento de referência para o Squad Dev**  
> **Última atualização:** 30/01/2026  
> **Versão:** 3.0  
> **Uso:** Cadastrar imagens de produtos Artany/Artely em massa

---

## ✨ NOVIDADE v3.0 (30/01/2026) — SEO Automático

O script de processamento agora gera **automaticamente**:

| Campo | Padrão gerado |
|-------|---------------|
| **Nome do arquivo físico** | `{slug}-tv-ate-{pol}-{cor}-curitiba-moveirama-{n}.webp` |
| **filename_seo** | Igual ao nome do arquivo |
| **alt_text** | `{Nome} para TV até {pol} polegadas - {Cor} - Móveis Curitiba \| Moveirama` |

### Benefícios SEO
- **Google Imagens:** Nome do arquivo otimizado para busca local
- **Acessibilidade:** Alt text legível para screen readers
- **AIO (AI Optimization):** Sufixo "Moveirama" para citações de IA
- **SEO Local:** "Curitiba" reforça autoridade regional

---

## ⚠️ CORREÇÕES IMPORTANTES (v2.0 - Janeiro 2026)

### Problema Resolvido: Imagens não apareciam no site

Em Janeiro/2026 descobrimos que o script de processamento tinha campos incorretos. As correções foram:

| Campo Errado | Campo Correto | Motivo |
|--------------|---------------|--------|
| `url` | `urls` | Nome da coluna no banco é `urls` (com "s") |
| `is_primary` | `is_active` | Coluna `is_primary` não existe |
| `image_type: 'product'` | `image_type: 'principal'` ou `'galeria'` | Constraint só aceita: principal, galeria, ambientada, dimensional |
| `cloudinary_path: seoFilename` | `cloudinary_path: imageUrl` | **CRÍTICO:** Site lê a URL completa do `cloudinary_path`, não só o filename |

### Estrutura correta do INSERT (process-batch/route.ts)

```typescript
.insert({
  product_id: product.id,
  urls: imageUrl,                              // URL completa
  alt_text: altText,                           // SEO: "{Nome} - Móveis Curitiba | Moveirama"
  position: nextPosition,
  is_active: true,
  filename_seo: seoFilename,                   // SEO: "{slug}-curitiba-moveirama-{n}.webp"
  format: 'webp',
  cloudinary_path: imageUrl,                   // URL COMPLETA (não só filename!)
  image_type: nextPosition === 0 ? 'principal' : 'galeria'
})
```

---

## 📋 Visão Geral

Este processo permite fazer upload de centenas de imagens de produtos de forma organizada e automatizada.

### Fluxo Resumido

```
1. Organizar pastas (nome = slug do produto)
2. Renomear arquivos para 1.jpg, 2.jpg, 3.jpg...
3. Upload para Supabase Storage → originais/{slug}/
4. Rodar script de processamento (converte WebP + SEO automático)
```

### O que o processamento faz automaticamente

| Etapa | Descrição |
|-------|-----------|
| Conversão | JPG/PNG → WebP (qualidade 82%) |
| Redimensionamento | Máximo 1200x1200px |
| Compressão | Imagens > 3MB são comprimidas |
| **Nomenclatura SEO** | `{slug}-tv-ate-{pol}-{cor}-curitiba-moveirama-{n}.webp` |
| **Alt text SEO** | `{Nome} para TV até {pol} polegadas - {Cor} - Móveis Curitiba \| Moveirama` |
| Registro no banco | Insere em `product_images` com todos os campos corretos |

---

## 📁 Estrutura de Pastas Esperada

### Antes de rodar o script

```
produtos-artany/
├── escrivaninha-dubai-branco-grafito/
│   ├── foto_original.jpg
│   ├── IMG_2024.png
│   └── detalhe.jpeg
├── escrivaninha-flex-olmo-branco/
│   ├── 001.jpg
│   └── 002.jpg
└── ...
```

**Regras:**
- Nome da pasta = **slug exato** do produto no banco
- Imagens podem ter qualquer nome (serão renomeadas)
- Formatos aceitos: `.jpg`, `.jpeg`, `.png`, `.webp`

---

## 🔧 Etapa 1: Renomear Imagens (PowerShell)

### Script: `renomear-imagens.ps1`

```powershell
# ============================================
# SCRIPT: Renomear imagens para 1.jpg, 2.jpg...
# ============================================

$pastas = Get-ChildItem -Directory

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RENOMEANDO IMAGENS PARA UPLOAD" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

foreach ($pasta in $pastas) {
    Write-Host "📁 $($pasta.Name)" -ForegroundColor Yellow
    
    $arquivos = Get-ChildItem -Path $pasta.FullName -File | 
                Where-Object { $_.Extension -match '\.(jpg|jpeg|png|webp)$' } | 
                Sort-Object Name
    
    if ($arquivos.Count -eq 0) {
        Write-Host "   ⚠️  Nenhuma imagem encontrada" -ForegroundColor Red
        continue
    }
    
    $contador = 1
    foreach ($arquivo in $arquivos) {
        $novoNome = "$contador.jpg"
        
        if ($arquivo.Name -ne $novoNome) {
            Rename-Item -Path $arquivo.FullName -NewName $novoNome -Force
            Write-Host "   $($arquivo.Name) → $novoNome" -ForegroundColor Gray
        }
        $contador++
    }
}

Write-Host "✅ CONCLUÍDO!" -ForegroundColor Green
```

---

## ☁️ Etapa 2: Upload para Supabase Storage

1. Acesse: **https://supabase.com/dashboard/project/ewsmfvisypgxbeqtbmec**
2. Navegue: **Storage → product-images → originais**
3. Para cada produto:
   - Crie pasta com nome = slug do produto
   - Arraste os arquivos `1.jpg`, `2.jpg`, etc.

---

## ⚡ Etapa 3: Processar Imagens

### Onde executar

1. Acesse: **https://moveirama-site.vercel.app/admin**
2. Faça login
3. Abra o **Console do navegador** (F12 → Console)
4. Cole e execute:

### Script para UM produto

```javascript
fetch('/api/admin/images/process-batch?password=SUA_SENHA_AQUI', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ slug: 'SLUG-DO-PRODUTO-AQUI' })
}).then(r => r.json()).then(console.log)
```

### Script para VÁRIOS produtos

```javascript
const slugs = [
  'produto-1-slug',
  'produto-2-slug',
  'produto-3-slug',
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
    
    // Pausa de 3 segundos entre cada produto
    if (i < slugs.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('\n🎉 PROCESSAMENTO FINALIZADO!');
}

processarTodos();
```

---

## 🔍 Verificação e Troubleshooting

### Verificar se imagens foram processadas

```sql
-- Produtos com imagens
SELECT p.name, p.slug, COUNT(pi.id) as qtd_imagens
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id
GROUP BY p.id, p.name, p.slug
HAVING COUNT(pi.id) > 0
ORDER BY p.name;

-- Produtos SEM imagens
SELECT p.name, p.slug
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE pi.id IS NULL AND p.is_active = true
ORDER BY p.name;
```

### Verificar se SEO está correto

```sql
-- Deve retornar filename_seo com "-curitiba-moveirama" e alt_text com "Móveis Curitiba | Moveirama"
SELECT filename_seo, alt_text 
FROM product_images 
WHERE product_id = (SELECT id FROM products WHERE slug = 'SEU-SLUG-AQUI')
LIMIT 3;
```

### Verificar se cloudinary_path está correto

```sql
-- Deve retornar URLs COMPLETAS (https://...)
SELECT cloudinary_path 
FROM product_images 
WHERE product_id = (SELECT id FROM products WHERE slug = 'SEU-SLUG-AQUI')
LIMIT 3;
```

### Erros comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `Product not found` | Slug da pasta não existe no banco | Verificar slug correto |
| `No images found` | Pasta vazia ou sem originais | Upload dos arquivos 1.jpg, 2.jpg |
| `Timeout` | Imagem muito grande | Comprimir antes do upload |
| `401 Unauthorized` | Senha incorreta | Verificar ADMIN_PASSWORD |
| `url does not exist` | Código antigo usando `url` em vez de `urls` | Atualizar código |
| `is_primary does not exist` | Código antigo | Usar `is_active: true` |
| `violates check constraint image_type` | Valor inválido | Usar: principal, galeria, ambientada, dimensional |
| **Imagens não aparecem no site** | `cloudinary_path` tem só filename | Deve ter URL COMPLETA |

### Corrigir imagens que não aparecem

Se as imagens foram processadas mas não aparecem, verifique se `cloudinary_path` tem a URL completa:

```sql
-- Verificar
SELECT urls, cloudinary_path 
FROM product_images 
WHERE product_id = (SELECT id FROM products WHERE slug = 'SEU-SLUG')
LIMIT 2;

-- Se cloudinary_path tiver só o filename (não URL completa), corrigir:
UPDATE product_images 
SET cloudinary_path = TRIM(BOTH '"' FROM urls::text)
WHERE product_id = (SELECT id FROM products WHERE slug = 'SEU-SLUG');
```

---

## 📊 Estrutura da Tabela product_images

### Colunas obrigatórias (NOT NULL)

| Coluna | Tipo | Valor |
|--------|------|-------|
| `product_id` | UUID | ID do produto |
| `cloudinary_path` | TEXT | **URL COMPLETA** da imagem |
| `image_type` | TEXT | `'principal'`, `'galeria'`, `'ambientada'`, ou `'dimensional'` |

### Colunas opcionais importantes

| Coluna | Tipo | Valor |
|--------|------|-------|
| `urls` | JSONB | URL completa (mesmo valor de cloudinary_path) |
| `alt_text` | TEXT | **SEO:** `{Nome} - Móveis Curitiba \| Moveirama` |
| `position` | INTEGER | Ordem da imagem (0 = primeira) |
| `is_active` | BOOLEAN | true |
| `filename_seo` | TEXT | **SEO:** `{slug}-curitiba-moveirama-{n}.webp` |
| `format` | TEXT | 'webp' |

---

## 🔍 SEO Automático — Padrões Gerados

### Nome do arquivo físico (v3.0)

```
{slug}-tv-ate-{polegadas}-{cor}-curitiba-moveirama-{numero}.webp
```

**Exemplos:**
```
rack-theo-tv-ate-55-polegadas-cinamomo-curitiba-moveirama-1.webp
escrivaninha-dubai-branco-grafito-curitiba-moveirama-1.webp
```

### Alt text (v3.0)

```
{Nome do Produto} para TV até {polegadas} polegadas - {Cor} - Móveis Curitiba | Moveirama
```

**Exemplos:**
```
Rack Theo para TV até 55 polegadas - Cinamomo - Móveis Curitiba | Moveirama
Escrivaninha Dubai - Branco/Grafito - Móveis Curitiba | Moveirama
```

### Por que esse padrão?

| Elemento | Propósito SEO |
|----------|---------------|
| `{slug}` | Palavra-chave do produto |
| `tv-ate-{pol}-polegadas` | Busca por compatibilidade |
| `{cor}` | Busca por variante |
| `curitiba` | SEO local |
| `moveirama` | Branding + citações IA |

---

## ✅ Checklist de Upload

```
□ Pastas organizadas com nome = slug
□ Script PowerShell executado (1.jpg, 2.jpg...)
□ Upload para Supabase Storage → originais/{slug}/
□ Script de processamento executado no console
□ Verificar se imagens aparecem no site
□ Verificar alt_text tem "Móveis Curitiba | Moveirama" (F12 → inspecionar)
□ Verificar filename_seo tem "-curitiba-moveirama"
□ (Opcional) Upload imagens de medidas
```

---

## 🔗 Links Úteis

| Recurso | URL |
|---------|-----|
| Admin do site | https://moveirama-site.vercel.app/admin |
| Supabase Dashboard | https://supabase.com/dashboard/project/ewsmfvisypgxbeqtbmec |
| Storage (imagens) | Dashboard → Storage → product-images |
| SQL Editor | Dashboard → SQL Editor |

---

## 📝 Changelog

| Data | Versão | Mudança |
|------|--------|---------|
| **30/01/2026** | **v3.0** | **SEO Automático:** filename e alt_text com "-curitiba-moveirama" e "Móveis Curitiba \| Moveirama" |
| 24/01/2026 | v2.0 | Documentado correções: urls, is_active, image_type, cloudinary_path |
| Janeiro 2026 | v1.0 | Versão inicial |

---

*Documento atualizado pelo Squad Dev — 30 de Janeiro de 2026*
