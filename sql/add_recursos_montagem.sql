-- =====================================================
-- MIGRATION: Adicionar campos de recursos de montagem
-- Data: Janeiro 2026
-- =====================================================

-- Adicionar campos na tabela products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS manual_url TEXT,
ADD COLUMN IF NOT EXISTS medidas_image_url TEXT,
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Comentários para documentação
COMMENT ON COLUMN products.manual_url IS 'URL do PDF do manual de montagem';
COMMENT ON COLUMN products.medidas_image_url IS 'URL da imagem com medidas do produto';
COMMENT ON COLUMN products.video_url IS 'URL do vídeo do produto (YouTube/Vimeo)';

-- =====================================================
-- COMO EXECUTAR:
-- 1. Acesse o Supabase Dashboard
-- 2. Vá em SQL Editor
-- 3. Cole este script
-- 4. Clique em RUN
-- =====================================================
