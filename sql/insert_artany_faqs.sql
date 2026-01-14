-- =====================================================
-- INSERT: FAQs para produtos Artany
-- Data: Janeiro 2026
-- =====================================================

-- =====================================================
-- FAQs: Escrivaninha Spirit
-- =====================================================
INSERT INTO product_faqs (product_id, question, answer, position, is_active)
SELECT id, question, answer, position, true
FROM products
CROSS JOIN (
  VALUES
    ('Qual o tamanho da Escrivaninha Spirit?', 
     'A Escrivaninha Spirit tem 90cm de largura, 75cm de altura e 45cm de profundidade. Tamanho ideal para home office em apartamentos compactos. Dúvida sobre medidas? Chama no WhatsApp.', 
     1),
    
    ('É difícil de montar?', 
     'Montagem nível fácil, tempo estimado de 45 minutos. Vem com manual ilustrado, todas as ferragens e tem vídeo de montagem no YouTube. Peças numeradas pra facilitar.', 
     2),
    
    ('Qual o material da escrivaninha?', 
     'Tampo em MDP de 25mm com revestimento BP (melamínico). O BP é super resistente a arranhões, manchas e fácil de limpar - perfeito pra uso diário.', 
     3),
    
    ('Vem com gavetas?', 
     'Sim! A Escrivaninha Spirit tem 2 gavetas com corrediças metálicas - deslizam suave, sem esforço. Ótimo pra guardar materiais de escritório.', 
     4),
    
    ('Tem prateleiras?', 
     'Sim, tem 2 prateleiras funcionais. Perfeitas pra organizar livros, decoração ou materiais de trabalho.', 
     5),
    
    ('Posso usar como penteadeira?', 
     'Com certeza! A Escrivaninha Spirit é versátil - funciona como escrivaninha, mesa de estudos ou penteadeira. Design moderno que combina em qualquer ambiente.', 
     6),
    
    ('Precisa furar a parede?', 
     'Não precisa! A escrivaninha fica apoiada no chão com pé cavalete. Sem furos, sem complicação. Ideal pra quem mora de aluguel.', 
     7),
    
    ('Entrega em Curitiba em quanto tempo?', 
     'Curitiba e região: até 2 dias úteis após pagamento com frota própria. Sem surpresa no frete - você vê o valor antes de finalizar.', 
     8),
    
    ('E se faltar peça ou vier com defeito?', 
     'Manda foto + número do pedido no WhatsApp. A gente resolve rápido - enviamos a peça que faltou ou fazemos a troca.', 
     9),
    
    ('Qual a garantia?', 
     'Garantia de 3 meses de fábrica. Problema dentro do prazo? WhatsApp de verdade com resposta rápida.', 
     10)
) AS faq(question, answer, position)
WHERE products.slug = 'escrivaninha-spirit';

-- =====================================================
-- FAQs: Gaveteiro Bit
-- =====================================================
INSERT INTO product_faqs (product_id, question, answer, position, is_active)
SELECT id, question, answer, position, true
FROM products
CROSS JOIN (
  VALUES
    ('Quantas gavetas tem o Gaveteiro Bit?', 
     'O Gaveteiro Bit tem 4 gavetas espaçosas. Dá pra organizar documentos, materiais de escritório, livros e muito mais. Cada gaveta desliza suave com corrediças metálicas.', 
     1),
    
    ('Tem chave de segurança?', 
     'Sim! A primeira gaveta tem tranca com chave. Perfeito pra guardar documentos importantes ou objetos de valor com tranquilidade.', 
     2),
    
    ('Tem rodinhas?', 
     'Sim, vem com rodízios! Fácil de mover pra limpar, reorganizar o espaço ou levar de um cômodo pro outro. Praticidade no dia a dia.', 
     3),
    
    ('É difícil de montar?', 
     'Montagem nível fácil, tempo estimado de 30 minutos. Manual ilustrado, peças numeradas e vídeo de montagem no YouTube. Sem mistério.', 
     4),
    
    ('Qual o material?', 
     'MDP com revestimento BP (melamínico). Resistente a arranhões e manchas, fácil de limpar. Traseira também é revestida - pode colocar no meio do ambiente.', 
     5),
    
    ('Qual o tamanho do gaveteiro?', 
     'Medidas: 47cm largura × 67cm altura × 45cm profundidade. Compacto o suficiente pra caber embaixo da escrivaninha ou ao lado.', 
     6),
    
    ('Cabe embaixo da escrivaninha?', 
     'Com 67cm de altura, cabe na maioria das escrivaninhas padrão. Confira a altura livre da sua mesa antes. Dúvida? Manda as medidas no WhatsApp.', 
     7),
    
    ('Entrega em Curitiba em quanto tempo?', 
     'Curitiba e região: até 2 dias úteis após pagamento com frota própria. Frete calculado na hora, sem surpresa.', 
     8),
    
    ('E se faltar peça?', 
     'Manda foto + número do pedido no WhatsApp. A gente resolve rápido - peça que faltou, a gente envia.', 
     9),
    
    ('Qual a garantia?', 
     'Garantia de 3 meses de fábrica. Qualquer problema, WhatsApp de verdade com resposta rápida.', 
     10)
) AS faq(question, answer, position)
WHERE products.slug = 'gaveteiro-bit';

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================
-- SELECT p.name, COUNT(f.id) as total_faqs
-- FROM products p
-- LEFT JOIN product_faqs f ON f.product_id = p.id
-- WHERE p.brand = 'Artany'
-- GROUP BY p.name;
