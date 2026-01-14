-- =====================================================
-- UPDATE: Dimensões reais e imagens temporárias Artany
-- Data: Janeiro 2026
-- Status: TEMPORÁRIO até finalizar página de produto
-- CORREÇÃO v3: Estrutura correta da tabela product_images
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
  
  -- Sem imagem de medidas por enquanto
  medidas_image_url = NULL,
  
  updated_at = NOW()
WHERE slug = 'gaveteiro-bit';

-- =====================================================
-- INSERIR IMAGENS (galeria via product_images)
-- Estrutura real: cloudinary_path, image_type, position, is_active
-- =====================================================

-- Limpar imagens antigas (se houver)
DELETE FROM product_images 
WHERE product_id IN (
  SELECT id FROM products WHERE slug IN ('escrivaninha-spirit', 'gaveteiro-bit')
);

-- Imagens da Escrivaninha Spirit (do site Artany)
INSERT INTO product_images (product_id, variant_id, cloudinary_path, alt_text, image_type, position, is_active)
SELECT 
  p.id,
  NULL,
  img.cloudinary_path,
  img.alt_text,
  img.image_type,
  img.position,
  true
FROM products p
CROSS JOIN (
  VALUES
    ('https://www.artany.com.br/wp-content/uploads/2024/10/escrivaninha-spirit-nogal-branco-4-1024x1024.png', 
     'Escrivaninha Spirit Nogal com Branco - Vista frontal', 'principal', 1),
    ('https://www.artany.com.br/wp-content/uploads/2024/10/Ambiente-Escrivaninha-Spirit-1.jpg', 
     'Escrivaninha Spirit em ambiente decorado', 'ambientada', 2),
    ('https://www.artany.com.br/wp-content/uploads/2024/10/escrivaninha-spirit-nogal-branco-3-1024x1024.png', 
     'Escrivaninha Spirit - Detalhe das gavetas', 'galeria', 3),
    ('https://www.artany.com.br/wp-content/uploads/2025/05/ESCRIVANINHA-SPIRIT.png', 
     'Escrivaninha Spirit - Medidas e dimensões', 'dimensional', 4)
) AS img(cloudinary_path, alt_text, image_type, position)
WHERE p.slug = 'escrivaninha-spirit';

-- Imagens do Gaveteiro Bit (placeholders)
INSERT INTO product_images (product_id, variant_id, cloudinary_path, alt_text, image_type, position, is_active)
SELECT 
  p.id,
  NULL,
  img.cloudinary_path,
  img.alt_text,
  img.image_type,
  img.position,
  true
FROM products p
CROSS JOIN (
  VALUES
    ('https://placehold.co/600x600/F0E8DF/2D2D2D?text=Gaveteiro+Bit', 
     'Gaveteiro Bit - Vista frontal', 'principal', 1),
    ('https://placehold.co/600x600/F0E8DF/2D2D2D?text=Gaveteiro+Bit+Aberto', 
     'Gaveteiro Bit - Gavetas abertas', 'galeria', 2),
    ('https://placehold.co/600x600/F0E8DF/2D2D2D?text=Gaveteiro+Bit+Detalhe', 
     'Gaveteiro Bit - Detalhe das rodinhas', 'galeria', 3)
) AS img(cloudinary_path, alt_text, image_type, position)
WHERE p.slug = 'gaveteiro-bit';
