-- =====================================================
-- INSERT: Produtos Artany (teste)
-- Data: Janeiro 2026
-- IMPORTANTE: Executar APÓS a migração add_product_fields_v2.sql
-- =====================================================

-- Primeiro, garantir que a categoria "escrivaninhas" existe
INSERT INTO categories (slug, name, description, is_active)
SELECT 'escrivaninhas', 'Escrivaninhas', 'Escrivaninhas e mesas para home office', true
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'escrivaninhas');

-- Garantir que a categoria "gaveteiros" existe
INSERT INTO categories (slug, name, description, is_active)
SELECT 'gaveteiros', 'Gaveteiros', 'Gaveteiros e organizadores para escritório', true
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'gaveteiros');

-- =====================================================
-- PRODUTO 1: Escrivaninha Spirit (Artany)
-- =====================================================
INSERT INTO products (
  slug,
  sku,
  name,
  short_description,
  brand,
  category_id,
  supplier_id,
  
  -- Preço (PREENCHER COM VALOR REAL)
  price,
  compare_at_price,
  
  -- Dimensões (aproximadas - verificar ficha técnica)
  width_cm,
  height_cm,
  depth_cm,
  weight_kg,
  
  -- Material
  main_material,
  thickness_mm,
  coating,
  
  -- Atributos específicos
  num_drawers,
  num_shelves,
  has_wheels,
  has_lock,
  slide_type,
  
  -- Montagem
  assembly_difficulty,
  assembly_time_minutes,
  requires_wall_mount,
  
  -- URLs de recursos
  manual_url,
  video_url,
  datasheet_url,
  
  -- SEO
  meta_title,
  meta_description,
  
  -- Status
  is_active,
  stock_quantity
)
SELECT
  'escrivaninha-spirit',
  'ESC-SPIRIT-6017',
  'Escrivaninha Spirit',
  'Escrivaninha versátil com design moderno, pé cavalete e gavetas com corrediças metálicas. Ideal para home office ou penteadeira.',
  'Artany',
  id,
  'f2f7a7d0-68d0-4e0a-aac7-293780d1bf4d'::uuid,
  
  -- PREENCHER: Preço de venda e preço comparativo
  449.00,        -- price (EXEMPLO - ajustar)
  NULL,          -- compare_at_price
  
  -- Dimensões (verificar ficha técnica real)
  90,            -- width_cm (EXEMPLO)
  75,            -- height_cm (EXEMPLO)
  45,            -- depth_cm (EXEMPLO)
  18.0,          -- weight_kg (EXEMPLO)
  
  -- Material
  'MDP',
  25,
  'BP',
  
  -- Atributos
  2,             -- num_drawers (tem gavetas)
  2,             -- num_shelves (2 prateleiras funcionais)
  FALSE,         -- has_wheels
  FALSE,         -- has_lock
  'metalica',    -- slide_type (corrediças metálicas)
  
  -- Montagem
  'facil',
  45,
  FALSE,
  
  -- URLs
  'https://drive.google.com/file/d/1H7CkoYapyE0ETc4IegOm0IUc_k5X2IB3/view',
  'https://www.youtube.com/watch?v=8wmTZt_sR5M',
  'https://drive.google.com/file/d/14gYCTxDcwUQgnxLF4A_2bNHPXqFrO4PX/view',
  
  -- SEO
  'Escrivaninha Spirit Artany - Home Office | Moveirama Curitiba',
  'Escrivaninha Spirit com design moderno, pé cavalete e corrediças metálicas. Perfeita para home office. Entrega rápida em Curitiba.',
  
  -- Status
  TRUE,
  10             -- stock_quantity (AJUSTAR)
  
FROM categories WHERE slug = 'escrivaninhas';

-- =====================================================
-- PRODUTO 2: Gaveteiro Bit (Artany)
-- =====================================================
INSERT INTO products (
  slug,
  sku,
  name,
  short_description,
  brand,
  category_id,
  supplier_id,
  
  -- Preço (PREENCHER COM VALOR REAL)
  price,
  compare_at_price,
  
  -- Dimensões (aproximadas - verificar ficha técnica)
  width_cm,
  height_cm,
  depth_cm,
  weight_kg,
  
  -- Material
  main_material,
  thickness_mm,
  coating,
  
  -- Atributos específicos
  num_drawers,
  num_shelves,
  has_wheels,
  has_lock,
  slide_type,
  
  -- Montagem
  assembly_difficulty,
  assembly_time_minutes,
  requires_wall_mount,
  
  -- URLs de recursos
  manual_url,
  video_url,
  datasheet_url,
  
  -- SEO
  meta_title,
  meta_description,
  
  -- Status
  is_active,
  stock_quantity
)
SELECT
  'gaveteiro-bit',
  'GAV-BIT-5670',
  'Gaveteiro Bit',
  'Gaveteiro com 4 gavetas espaçosas, rodízios para fácil movimentação e chave de segurança. Ideal para escritório e home office.',
  'Artany',
  id,
  'f2f7a7d0-68d0-4e0a-aac7-293780d1bf4d'::uuid,
  
  -- PREENCHER: Preço de venda
  349.00,        -- price (EXEMPLO - ajustar)
  NULL,          -- compare_at_price
  
  -- Dimensões (verificar ficha técnica real)
  47,            -- width_cm (EXEMPLO)
  67,            -- height_cm (EXEMPLO)
  45,            -- depth_cm (EXEMPLO)
  22.0,          -- weight_kg (EXEMPLO)
  
  -- Material
  'MDP',
  15,            -- thickness_mm (EXEMPLO)
  'BP',
  
  -- Atributos
  4,             -- num_drawers (4 gavetas)
  0,             -- num_shelves
  TRUE,          -- has_wheels (tem rodízios)
  TRUE,          -- has_lock (tem chave)
  'metalica',    -- slide_type (corrediças metálicas)
  
  -- Montagem
  'facil',
  30,
  FALSE,
  
  -- URLs
  'https://drive.google.com/file/d/1_lqBIsBcgcqddwO08n7APj5BR8Vr2ZNE/view',
  'https://www.youtube.com/watch?v=teFbzLoSAgI',
  'https://drive.google.com/file/d/1sBA4EAPJRXGYJw0zgm2HAaq_L8Je8kmw/view',
  
  -- SEO
  'Gaveteiro Bit Artany - 4 Gavetas com Chave | Moveirama Curitiba',
  'Gaveteiro Bit com 4 gavetas, rodízios e chave de segurança. Organize seu escritório. Entrega rápida em Curitiba.',
  
  -- Status
  TRUE,
  10             -- stock_quantity (AJUSTAR)
  
FROM categories WHERE slug = 'gaveteiros';

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================
-- SELECT slug, name, brand, coating, num_drawers, num_shelves, has_wheels, has_lock 
-- FROM products 
-- WHERE brand = 'Artany';
