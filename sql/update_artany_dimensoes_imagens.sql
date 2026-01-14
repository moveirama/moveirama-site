-- =====================================================
-- UPDATE: Dimensões reais e imagens temporárias Artany
-- Data: Janeiro 2026
-- Status: TEMPORÁRIO até finalizar página de produto
-- =====================================================

-- =====================================================
-- Escrivaninha Spirit
-- Dimensões: 113 × 82 × 60 cm (L×A×P)
-- Fonte: https://www.artany.com.br/escrivaninha-spirit/
-- =====================================================
UPDATE products
SET
  -- Dimensões reais
  width_cm = 113,
  height_cm = 82,
  depth_cm = 60,
  weight_kg = 25,
  
  -- Capacidade
  weight_capacity = 10,
  
  -- Espessura do tampo
  thickness_mm = 25,
  
  -- Imagem principal (do site Artany - TEMPORÁRIA)
  image_url = 'https://www.artany.com.br/wp-content/uploads/2024/10/escrivaninha-spirit-nogal-branco-4-1024x1024.png',
  
  -- Imagem das medidas
  medidas_image_url = 'https://www.artany.com.br/wp-content/uploads/2025/05/ESCRIVANINHA-SPIRIT.png',
  
  updated_at = NOW()
WHERE slug = 'escrivaninha-spirit';

-- =====================================================
-- Gaveteiro Bit
-- Dimensões: 40 × 69,5 × 40 cm (L×A×P)
-- Fonte: https://www.amazon.com.br/Gaveteiro-Gavetas-Bit-Preto-Artany/
-- =====================================================
UPDATE products
SET
  -- Dimensões reais
  width_cm = 40,
  height_cm = 69.5,
  depth_cm = 40,
  weight_kg = 16,
  
  -- Capacidade
  weight_capacity = 8,
  
  -- Espessura
  thickness_mm = 15,
  
  -- Imagem principal (placeholder genérico - TEMPORÁRIA)
  image_url = 'https://placehold.co/600x600/F0E8DF/2D2D2D?text=Gaveteiro+Bit',
  
  -- Sem imagem de medidas por enquanto
  medidas_image_url = NULL,
  
  updated_at = NOW()
WHERE slug = 'gaveteiro-bit';

-- =====================================================
-- INSERIR IMAGENS ADICIONAIS (galeria)
-- =====================================================

-- Limpar imagens antigas (se houver)
DELETE FROM product_images 
WHERE product_id IN (
  SELECT id FROM products WHERE slug IN ('escrivaninha-spirit', 'gaveteiro-bit')
);

-- Imagens da Escrivaninha Spirit (do site Artany)
INSERT INTO product_images (product_id, url, alt_text, position, is_primary)
SELECT 
  p.id,
  img.url,
  img.alt_text,
  img.position,
  img.is_primary
FROM products p
CROSS JOIN (
  VALUES
    ('https://www.artany.com.br/wp-content/uploads/2024/10/escrivaninha-spirit-nogal-branco-4-1024x1024.png', 
     'Escrivaninha Spirit Nogal com Branco - Vista frontal', 1, true),
    ('https://www.artany.com.br/wp-content/uploads/2024/10/Ambiente-Escrivaninha-Spirit-1.jpg', 
     'Escrivaninha Spirit em ambiente decorado', 2, false),
    ('https://www.artany.com.br/wp-content/uploads/2024/10/escrivaninha-spirit-nogal-branco-3-1024x1024.png', 
     'Escrivaninha Spirit - Detalhe das gavetas', 3, false),
    ('https://www.artany.com.br/wp-content/uploads/2025/05/ESCRIVANINHA-SPIRIT.png', 
     'Escrivaninha Spirit - Medidas e dimensões', 4, false)
) AS img(url, alt_text, position, is_primary)
WHERE p.slug = 'escrivaninha-spirit';

-- Imagens do Gaveteiro Bit (placeholders)
INSERT INTO product_images (product_id, url, alt_text, position, is_primary)
SELECT 
  p.id,
  img.url,
  img.alt_text,
  img.position,
  img.is_primary
FROM products p
CROSS JOIN (
  VALUES
    ('https://placehold.co/600x600/F0E8DF/2D2D2D?text=Gaveteiro+Bit', 
     'Gaveteiro Bit - Vista frontal', 1, true),
    ('https://placehold.co/600x600/F0E8DF/2D2D2D?text=Gaveteiro+Bit+Aberto', 
     'Gaveteiro Bit - Gavetas abertas', 2, false),
    ('https://placehold.co/600x600/F0E8DF/2D2D2D?text=Gaveteiro+Bit+Detalhe', 
     'Gaveteiro Bit - Detalhe das rodinhas', 3, false)
) AS img(url, alt_text, position, is_primary)
WHERE p.slug = 'gaveteiro-bit';

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================
-- SELECT 
--   p.name,
--   p.width_cm || ' × ' || p.height_cm || ' × ' || p.depth_cm || ' cm' as dimensoes,
--   p.weight_kg || ' kg' as peso,
--   p.image_url,
--   COUNT(pi.id) as total_imagens
-- FROM products p
-- LEFT JOIN product_images pi ON pi.product_id = p.id
-- WHERE p.slug IN ('escrivaninha-spirit', 'gaveteiro-bit')
-- GROUP BY p.id;
