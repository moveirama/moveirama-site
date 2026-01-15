-- ============================================
-- MOVEIRAMA - CATEGORIAS (2 NÍVEIS) - v3 CORRIGIDO
-- ============================================
-- Problema: category_id é NOT NULL
-- Solução: Criar novas categorias → Migrar produtos → Deletar antigas
-- ============================================

-- PASSO 1: Criar categorias de nível 1 (raiz) com slugs temporários
INSERT INTO categories (slug, name, parent_id, description, is_active)
VALUES 
  ('casa-novo', 'Casa', NULL, 'Móveis para sala, quarto e ambientes da casa', true),
  ('escritorio-novo', 'Escritório', NULL, 'Móveis para home office e escritório', true);

-- PASSO 2: Criar categorias de nível 2 - Casa
INSERT INTO categories (slug, name, parent_id, description, is_active)
SELECT 
  v.slug, 
  v.name, 
  c.id, 
  v.description, 
  true
FROM (
  VALUES 
    ('racks-novo', 'Racks para TV', 'Racks para TV de 43 a 65 polegadas'),
    ('paineis-novo', 'Painéis para TV', 'Painéis de parede para TV'),
    ('buffets-novo', 'Buffets', 'Buffets e aparadores para sala'),
    ('penteadeiras-novo', 'Penteadeiras', 'Penteadeiras com espelho para quarto')
) AS v(slug, name, description)
CROSS JOIN categories c
WHERE c.slug = 'casa-novo';

-- PASSO 3: Criar categorias de nível 2 - Escritório
INSERT INTO categories (slug, name, parent_id, description, is_active)
SELECT 
  v.slug, 
  v.name, 
  c.id, 
  v.description, 
  true
FROM (
  VALUES 
    ('escrivaninhas-novo', 'Escrivaninhas', 'Escrivaninhas compactas para home office'),
    ('gaveteiros-novo', 'Gaveteiros', 'Gaveteiros e organizadores'),
    ('mesas-novo', 'Mesas para Escritório', 'Mesas de trabalho e reunião'),
    ('estacoes-novo', 'Estações de Trabalho', 'Estações de trabalho completas')
) AS v(slug, name, description)
CROSS JOIN categories c
WHERE c.slug = 'escritorio-novo';

-- PASSO 4: Migrar produtos para NOVAS categorias
-- Racks
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'racks-novo')
WHERE slug IN ('rack-theo-180-grafite', 'rack-duetto-180-off-white-freijo', 'rack-theo', 'rack-duetto');

-- Escrivaninhas
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'escrivaninhas-novo')
WHERE slug IN ('escrivaninha-spirit-branca-90cm', 'escrivaninha-match-branca-freijo-120cm', 'escrivaninha-nomad-rustico-mel-canela', 'escrivaninha-spirit', 'escrivaninha-match', 'escrivaninha-nomad');

-- Buffets
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'buffets-novo')
WHERE slug IN ('buffet-charlotte-rustico-mel-180cm', 'buffet-charlotte');

-- Gaveteiros
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'gaveteiros-novo')
WHERE slug IN ('gaveteiro-bit-1-gaveta-2-portas', 'gaveteiro-bit');

-- PASSO 5: Deletar categorias ANTIGAS (na ordem correta)
-- Primeiro as filhas de nível 3 (se existirem)
DELETE FROM categories 
WHERE parent_id IN (
  SELECT id FROM categories 
  WHERE parent_id IS NOT NULL 
  AND slug NOT LIKE '%-novo'
)
AND slug NOT LIKE '%-novo';

-- Depois as filhas de nível 2
DELETE FROM categories 
WHERE parent_id IS NOT NULL 
AND slug NOT LIKE '%-novo';

-- Por fim as raiz (nível 1)
DELETE FROM categories 
WHERE parent_id IS NULL 
AND slug NOT LIKE '%-novo';

-- PASSO 6: Renomear slugs (remover "-novo")
UPDATE categories SET slug = 'casa' WHERE slug = 'casa-novo';
UPDATE categories SET slug = 'escritorio' WHERE slug = 'escritorio-novo';
UPDATE categories SET slug = 'racks' WHERE slug = 'racks-novo';
UPDATE categories SET slug = 'paineis' WHERE slug = 'paineis-novo';
UPDATE categories SET slug = 'buffets' WHERE slug = 'buffets-novo';
UPDATE categories SET slug = 'penteadeiras' WHERE slug = 'penteadeiras-novo';
UPDATE categories SET slug = 'escrivaninhas' WHERE slug = 'escrivaninhas-novo';
UPDATE categories SET slug = 'gaveteiros' WHERE slug = 'gaveteiros-novo';
UPDATE categories SET slug = 'mesas' WHERE slug = 'mesas-novo';
UPDATE categories SET slug = 'estacoes' WHERE slug = 'estacoes-novo';

-- ============================================
-- VERIFICAÇÃO
-- ============================================

-- Ver categorias
SELECT 
  c.slug,
  c.name,
  p.name as parent_name,
  CASE WHEN c.parent_id IS NULL THEN 1 ELSE 2 END as level
FROM categories c
LEFT JOIN categories p ON c.parent_id = p.id
ORDER BY level, p.name NULLS FIRST, c.name;

-- Ver produtos e suas categorias
SELECT 
  pr.name as produto,
  c.name as categoria,
  parent.name as categoria_pai
FROM products pr
LEFT JOIN categories c ON pr.category_id = c.id
LEFT JOIN categories parent ON c.parent_id = parent.id
ORDER BY parent.name, c.name, pr.name;
