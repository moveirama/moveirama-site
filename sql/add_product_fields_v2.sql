-- =====================================================
-- MIGRAÇÃO: Novos campos para produtos (Artany e futuros)
-- Data: Janeiro 2026
-- Motivo: Suportar atributos de escrivaninhas, gaveteiros, etc.
-- =====================================================

-- 1. Revestimento (BP, Laca, Melamínico, etc.)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS coating TEXT;

COMMENT ON COLUMN products.coating IS 'Tipo de revestimento: BP, Laca, Melamínico, etc.';

-- 2. Número de gavetas
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS num_drawers INTEGER;

COMMENT ON COLUMN products.num_drawers IS 'Quantidade de gavetas do móvel';

-- 3. Número de prateleiras
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS num_shelves INTEGER;

COMMENT ON COLUMN products.num_shelves IS 'Quantidade de prateleiras do móvel';

-- 4. Tem rodízios/rodinhas
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS has_wheels BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN products.has_wheels IS 'Móvel possui rodízios para movimentação';

-- 5. Tem chave/tranca
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS has_lock BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN products.has_lock IS 'Móvel possui chave de segurança';

-- 6. Tipo de corrediça
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS slide_type TEXT;

COMMENT ON COLUMN products.slide_type IS 'Tipo de corrediça: metalica, plastica, telescopica, etc.';

-- 7. URL da ficha técnica (PDF)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS datasheet_url TEXT;

COMMENT ON COLUMN products.datasheet_url IS 'URL do PDF com ficha técnica do produto';

-- =====================================================
-- VERIFICAÇÃO: Listar campos da tabela products
-- =====================================================
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'products' 
-- ORDER BY ordinal_position;
