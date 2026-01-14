-- ============================================
-- MOVEIRAMA - MIGRAÇÃO DE PRODUTOS (2 NÍVEIS)
-- ============================================
-- Executar APÓS categories_2_niveis.sql
-- Data: Janeiro 2026
-- ============================================

-- PASSO 1: Atualizar produtos para categoria RACKS
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'racks')
WHERE slug IN (
  'rack-theo-180-grafite',
  'rack-duetto-180-off-white-freijo'
);

-- PASSO 2: Atualizar produtos para categoria ESCRIVANINHAS
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'escrivaninhas')
WHERE slug IN (
  'escrivaninha-spirit-branca-90cm',
  'escrivaninha-match-branca-freijo-120cm',
  'escrivaninha-nomad-rustico-mel-canela'
);

-- PASSO 3: Atualizar produtos para categoria BUFFETS
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'buffets')
WHERE slug IN (
  'buffet-charlotte-rustico-mel-180cm'
);

-- PASSO 4: Atualizar produtos para categoria GAVETEIROS
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'gaveteiros')
WHERE slug IN (
  'gaveteiro-bit-1-gaveta-2-portas'
);

-- ============================================
-- VERIFICAÇÃO
-- ============================================

-- Verificar produtos e suas categorias
SELECT 
  p.name as produto,
  p.slug as produto_slug,
  c.name as categoria,
  parent.name as categoria_pai
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN categories parent ON c.parent_id = parent.id
ORDER BY parent.name, c.name, p.name;

-- ============================================
-- OUTPUT ESPERADO:
-- ============================================
-- produto                              | categoria      | categoria_pai
-- -------------------------------------+----------------+---------------
-- Rack Theo 180 Grafite                | Racks para TV  | Casa
-- Rack Duetto 180 Off White Freijó     | Racks para TV  | Casa
-- Buffet Charlotte Rústico Mel 180cm   | Buffets        | Casa
-- Escrivaninha Spirit Branca 90cm      | Escrivaninhas  | Escritório
-- Escrivaninha Match Branca Freijó     | Escrivaninhas  | Escritório
-- Escrivaninha Nomad Rústico Mel       | Escrivaninhas  | Escritório
-- Gaveteiro Bit 1 Gaveta 2 Portas      | Gaveteiros     | Escritório
-- ============================================
