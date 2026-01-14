-- =====================================================
-- MIGRAÇÃO: FAQ Dinâmico por Produto
-- Moveirama - Janeiro 2026
-- =====================================================

-- 1. Criar tabela de FAQs (se não existir)
-- =====================================================

CREATE TABLE IF NOT EXISTS product_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para busca por produto
CREATE INDEX IF NOT EXISTS idx_product_faqs_product_id ON product_faqs(product_id);

-- Índice para ordenação
CREATE INDEX IF NOT EXISTS idx_product_faqs_position ON product_faqs(product_id, position);

-- =====================================================
-- 2. Inserir FAQs do Rack Théo
-- =====================================================

-- Primeiro, buscar o ID do produto Rack Théo
-- (ajuste o slug se necessário)

INSERT INTO product_faqs (product_id, question, answer, position, is_active)
SELECT 
  p.id,
  faq.question,
  faq.answer,
  faq.position,
  true
FROM products p
CROSS JOIN (
  VALUES
    ('Qual tamanho de TV cabe no Rack Théo?', 
     'O Rack Théo acomoda TVs de até 55 polegadas. Com 136cm de largura, ele suporta TVs de até 125cm - sobra espaço nas laterais pra ficar bonito. Se sua TV é de 43" ou 50", também serve tranquilo.', 
     1),
    
    ('É difícil de montar?', 
     'Nada! Montagem nível fácil, tempo estimado de 40 minutos. Vem com manual ilustrado e todas as ferragens - nada de peça faltando. Travou em algum passo? Chama no WhatsApp que ajudamos na hora.', 
     2),
    
    ('Vem com manual e parafusos?', 
     'Sim! O Rack Théo vem com manual completo, parafusos, buchas e todo o kit de ferragens. Só precisa de chave Phillips pra montar. Tudo na caixa, sem precisar comprar nada separado.', 
     3),
    
    ('Qual o material? É resistente?', 
     'Estrutura em MDF 15mm e pés reforçados em MDF 25mm. MDF é mais resistente que MDP - aguenta melhor o peso e não lasca fácil. Não é móvel descartável: é móvel de verdade que dura.', 
     4),
    
    ('Precisa furar a parede?', 
     'Não precisa! O Rack Théo fica apoiado no chão, sem necessidade de fixação na parede. É só montar, colocar no lugar e pronto. Perfeito pra quem mora de aluguel ou não quer complicação.', 
     5),
    
    ('Aguenta o peso da minha TV?', 
     'O tampo superior suporta tranquilamente TVs de até 55 polegadas - incluindo soundbar, videogame e controles em cima. A estrutura de MDF 15mm e os pés de MDF 25mm garantem estabilidade.', 
     6),
    
    ('Vocês entregam em Curitiba? Qual o prazo?', 
     'Sim! Entrega própria em Curitiba e região metropolitana (Colombo, São José dos Pinhais, Araucária, Pinhais e mais). Prazo de até 2 dias úteis após o pagamento. Frota nossa, sem surpresa.', 
     7),
    
    ('E se faltar alguma peça na caixa?', 
     'Difícil acontecer, mas se faltar: tira foto, manda no WhatsApp com o número do pedido e a gente resolve rapidinho. Não deixamos cliente na mão.', 
     8),
    
    ('Posso devolver se não gostar?', 
     'Claro! Você tem 7 dias pra se arrepender, conforme o Código de Defesa do Consumidor. Chegou e não era o que esperava? Chama no WhatsApp que orientamos a troca ou devolução sem enrolação.', 
     9),
    
    ('Vocês são de Curitiba mesmo?', 
     'Sim! Somos de Curitiba, com CNPJ e endereço no rodapé do site. Entrega com frota própria - a gente conhece as ruas da cidade. Qualquer dúvida, o WhatsApp é de verdade e responde rápido.', 
     10)
) AS faq(question, answer, position)
WHERE p.slug = 'rack-theo'
ON CONFLICT DO NOTHING;

-- =====================================================
-- 3. RLS (Row Level Security) - Opcional
-- =====================================================

-- Habilitar RLS se necessário
-- ALTER TABLE product_faqs ENABLE ROW LEVEL SECURITY;

-- Política de leitura pública
-- CREATE POLICY "FAQs são públicos" ON product_faqs
--   FOR SELECT USING (is_active = true);

-- =====================================================
-- 4. Verificar inserção
-- =====================================================

-- Executar após a migração para confirmar:
-- SELECT p.name, pf.question, pf.position 
-- FROM product_faqs pf 
-- JOIN products p ON p.id = pf.product_id 
-- ORDER BY pf.position;
