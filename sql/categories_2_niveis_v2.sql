-- ============================================
-- MOVEIRAMA - CATEGORIAS (2 NÍVEIS) - CORRIGIDO
-- ============================================
-- Estrutura simplificada aprovada pelo Squad Visual
-- Data: Janeiro 2026
-- ============================================

-- PASSO 1: Remover referência de produtos às categorias antigas
UPDATE products SET category_id = NULL;

-- PASSO 2: Deletar categorias na ordem correta (filhas primeiro)
-- Nível 3 (se existir)
DELETE FROM categories WHERE parent_id IN (
  SELECT id FROM categories WHERE parent_id IS NOT NULL
);

-- Nível 2
DELETE FROM categories WHERE parent_id IS NOT NULL;

-- Nível 1 (raiz)
DELETE FROM categories WHERE parent_id IS NULL;

-- PASSO 3: Inserir categorias de nível 1 (raiz)
INSERT INTO categories (slug, name, parent_id, description, is_active)
VALUES 
  ('casa', 'Casa', NULL, 'Móveis para sala, quarto e ambientes da casa', true),
  ('escritorio', 'Escritório', NULL, 'Móveis para home office e escritório', true);

-- PASSO 4: Inserir categorias de nível 2 - Casa
INSERT INTO categories (slug, name, parent_id, description, is_active)
SELECT 
  v.slug, 
  v.name, 
  c.id, 
  v.description, 
  true
FROM (
  VALUES 
    ('racks', 'Racks para TV', 'Racks para TV de 43 a 65 polegadas'),
    ('paineis', 'Painéis para TV', 'Painéis de parede para TV'),
    ('buffets', 'Buffets', 'Buffets e aparadores para sala'),
    ('penteadeiras', 'Penteadeiras', 'Penteadeiras com espelho para quarto')
) AS v(slug, name, description)
CROSS JOIN categories c
WHERE c.slug = 'casa';

-- PASSO 5: Inserir categorias de nível 2 - Escritório
INSERT INTO categories (slug, name, parent_id, description, is_active)
SELECT 
  v.slug, 
  v.name, 
  c.id, 
  v.description, 
  true
FROM (
  VALUES 
    ('escrivaninhas', 'Escrivaninhas', 'Escrivaninhas compactas para home office'),
    ('gaveteiros', 'Gaveteiros', 'Gaveteiros e organizadores'),
    ('mesas', 'Mesas para Escritório', 'Mesas de trabalho e reunião'),
    ('estacoes', 'Estações de Trabalho', 'Estações de trabalho completas')
) AS v(slug, name, description)
CROSS JOIN categories c
WHERE c.slug = 'escritorio';

-- ============================================
-- VERIFICAÇÃO
-- ============================================

SELECT 
  c.id,
  c.slug,
  c.name,
  p.name as parent_name,
  CASE 
    WHEN c.parent_id IS NULL THEN 1 
    ELSE 2 
  END as level
FROM categories c
LEFT JOIN categories p ON c.parent_id = p.id
ORDER BY 
  CASE WHEN c.parent_id IS NULL THEN c.name ELSE p.name END,
  c.parent_id NULLS FIRST,
  c.name;
