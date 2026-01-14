-- ============================================
-- MOVEIRAMA - CATEGORIAS (2 NÍVEIS)
-- ============================================
-- Estrutura simplificada aprovada pelo Squad Visual
-- Data: Janeiro 2026
-- 
-- ANTES (3 níveis): Casa > Sala > Racks
-- AGORA (2 níveis): Casa > Racks para TV
-- ============================================

-- PASSO 1: Limpar categorias antigas (se existirem)
-- ⚠️ CUIDADO: Isso remove categorias existentes
-- Comente se quiser preservar dados

DELETE FROM categories WHERE slug IN (
  'casa', 'escritorio',
  'sala', 'quarto', 'home-office', 'executivo',
  'racks', 'paineis', 'buffets', 'penteadeiras',
  'escrivaninhas', 'gaveteiros', 'mesas', 'estacoes',
  'racks-para-tv', 'paineis-para-tv', 'mesas-para-escritorio', 'estacoes-de-trabalho'
);

-- PASSO 2: Inserir categorias de nível 1 (raiz)
INSERT INTO categories (slug, name, parent_id, description, is_active)
VALUES 
  ('casa', 'Casa', NULL, 'Móveis para sala, quarto e ambientes da casa', true),
  ('escritorio', 'Escritório', NULL, 'Móveis para home office e escritório', true);

-- PASSO 3: Inserir categorias de nível 2 - Casa
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

-- PASSO 4: Inserir categorias de nível 2 - Escritório
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

-- Verificar estrutura criada
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

-- ============================================
-- OUTPUT ESPERADO:
-- ============================================
-- slug          | name                    | parent_name | level
-- --------------+-------------------------+-------------+-------
-- casa          | Casa                    | NULL        | 1
-- buffets       | Buffets                 | Casa        | 2
-- paineis       | Painéis para TV         | Casa        | 2
-- penteadeiras  | Penteadeiras            | Casa        | 2
-- racks         | Racks para TV           | Casa        | 2
-- escritorio    | Escritório              | NULL        | 1
-- escrivaninhas | Escrivaninhas           | Escritório  | 2
-- estacoes      | Estações de Trabalho    | Escritório  | 2
-- gaveteiros    | Gaveteiros              | Escritório  | 2
-- mesas         | Mesas para Escritório   | Escritório  | 2
-- ============================================
