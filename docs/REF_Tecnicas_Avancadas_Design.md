# Moveirama — Técnicas Avançadas de Design

> **Uso:** Referência para decisões de design que vão além do básico.  
> **Consultar quando:** Precisar justificar escolhas, resolver dilemas visuais, ou elevar a qualidade das entregas.  
> **Quem usa:** Squad Visual (todos os papéis).

---

## Índice

1. [Psicologia Cromática Contextual](#1-psicologia-cromática-contextual)
2. [Peso Visual e Percepção de Qualidade](#2-peso-visual-e-percepção-de-qualidade)
3. [Semiótica Aplicada a Ícones](#3-semiótica-aplicada-a-ícones)
4. [Coerência Produto ↔ Comunicação](#4-coerência-produto--comunicação)
5. [Hierarquia de Processamento Cerebral](#5-hierarquia-de-processamento-cerebral)
6. [Gatilhos Visuais para Classe C/D](#6-gatilhos-visuais-para-classe-cd)
7. [Técnicas de Redução de Atrito](#7-técnicas-de-redução-de-atrito)
8. [Comunicação Assíncrona com Dev](#8-comunicação-assíncrona-com-dev)
9. [Checklist de Decisão Avançada](#9-checklist-de-decisão-avançada)

---

## 1. Psicologia Cromática Contextual

### Princípio

Cores não têm significado universal — elas ganham significado **em contexto**. A mesma cor pode transmitir mensagens opostas dependendo de onde é aplicada.

### Matriz de Associação por Contexto

| Cor | Contexto Digital/Tech | Contexto Móveis/Casa | Contexto Financeiro |
|-----|----------------------|---------------------|---------------------|
| Verde | Sucesso, confirmar | Natureza abstrata | Dinheiro, lucro |
| Azul | Confiança, tech | Frio, distante | Segurança, banco |
| Marrom/Toffee | Antiquado | **Madeira, artesanal, qualidade** | Conservador |
| Laranja | Alerta, CTA | Energia, promoção | Urgência |
| Bege/Cream | Neutro, vazio | **Aconchego, lar, acessível** | Premium discreto |

### Regra para Moveirama

```
AÇÃO (CTAs, botões)     → Sage #6B8E7A (verde = "vá em frente")
CONFIANÇA (ícones info) → Toffee #8B7355 (marrom = "sólido como madeira")
ACONCHEGO (fundos)      → Cream/Warm White (bege = "sua casa")
```

### Erro Comum

Usar a cor de CTA (Sage) em elementos informativos. Isso "gasta" o impacto visual do verde e confunde a hierarquia de ação.

### Aplicação Prática

| Situação | ❌ Errado | ✅ Certo |
|----------|----------|---------|
| Ícones de benefícios | Sage (cor de ação) | Toffee (cor de produto) |
| Badges de "Frota própria" | Vermelho (alarme) | Sage (positivo) |
| Fundo de seção | Branco puro (frio) | Warm White (acolhedor) |
| Preço com desconto | Só verde | "De" em vermelho, "Por" em grafite |

---

## 2. Peso Visual e Percepção de Qualidade

### Princípio

O cérebro associa **peso visual** a **peso físico** e **qualidade material**. Elementos mais "pesados" (traços grossos, cores densas, formas sólidas) transmitem durabilidade.

### Escala de Peso Visual

```
LEVE ←――――――――――――――――――――――――――――――→ PESADO

Traço 1px    Traço 1.5px    Traço 2px    Traço 2.5px    Traço 3px
   ↓             ↓              ↓             ↓             ↓
Digital      Elegante      Padrão       Robusto       Industrial
Frágil       Refinado      Neutro       Confiável     Pesado
```

### Regra para Moveirama

Como vendemos **móveis físicos** que precisam "aguentar o tranco":

| Elemento | Peso Recomendado | Por quê |
|----------|------------------|---------|
| Ícones informativos | 2.5px stroke | Transmite solidez |
| Ícones de UI (setas, fechar) | 2px stroke | Não compete com conteúdo |
| Bordas de cards | 1px | Limpo, não pesado |
| Tipografia títulos | Semibold/Bold | Presença sem gritar |

### Aplicação: Ícones de Benefícios

```
ANTES (frágil)              DEPOIS (robusto)
┌─────────────┐             ┌─────────────┐
│   ╭───╮     │             │   ╔═══╗     │
│   │   │     │  stroke:2   │   ║   ║     │  stroke:2.5
│   ╰───╯     │  24px       │   ╚═══╝     │  28px
└─────────────┘             └─────────────┘
"Parece app"                "Parece móvel"
```

### Exceção

Elementos de **luxo/premium** usam traços finos intencionalmente. Mas nosso público é classe C/D — eles associam fino a "frágil" ou "vai quebrar".

---

## 3. Semiótica Aplicada a Ícones

### Princípio

Ícones são **signos** que representam conceitos. Existem 3 tipos (Charles Peirce):

| Tipo | Definição | Exemplo | Força |
|------|-----------|---------|-------|
| **Ícone** | Semelhança direta | Foto de caminhão | Máxima |
| **Índice** | Relação causal | Fumaça = fogo | Alta |
| **Símbolo** | Convenção social | ✓ = confirmado | Variável |

### Problema dos Ícones Genéricos

Bibliotecas como Lucide, Feather, Heroicons usam **símbolos universais**. São úteis para UI padrão, mas não comunicam **especificidade**.

| Contexto | Ícone Genérico | Problema |
|----------|----------------|----------|
| "Entrega rápida" | 🚚 Caminhão simples | Pode ser Correios, iFood, qualquer um |
| "Suporte" | 💬 Balão de fala | Chat, comentário, mensagem? |
| "Seguro" | 🛡️ Escudo | Antivírus? Seguro de vida? |

### Solução: Ícones Contextualizados

Adicionar **detalhes específicos** que transformam símbolo em índice:

| Genérico | Contextualizado | Ganho |
|----------|-----------------|-------|
| Caminhão | Caminhão baú + linhas de carga | "Caminhão de móveis" |
| Balão de fala | Smartphone + notificação ✓ | "A loja me avisa no celular" |
| Prédio | Prédio + elevador + setas | "Eles sobem no meu apê" |
| Escudo | Escudo + textura de madeira | "Proteção do material" |

### Regra para Moveirama

```
NÍVEL 1 (UI básica): Lucide/Heroicons padrão
         → Setas, fechar, menu, busca

NÍVEL 2 (Diferenciação): SVGs customizados
         → Benefícios, diferenciais, trust badges

NÍVEL 3 (Identidade): Ilustrações únicas
         → Hero images, empty states, onboarding
```

### Técnica de Customização Rápida

Pegar ícone base e adicionar 1-2 elementos:

```
Truck (Lucide)
    + linhas verticais no baú (= carga)
    + traço mais grosso (= robusto)
    = Caminhão da Moveirama
```

---

## 4. Coerência Produto ↔ Comunicação

### Princípio

> **A linguagem visual deve refletir a materialidade do produto.**

O cérebro busca consistência. Se vendo algo físico/tangível mas comunico de forma digital/abstrata, gero dissonância cognitiva.

### Matriz de Coerência

| Tipo de Produto | Linguagem Visual Adequada |
|-----------------|---------------------------|
| Software/SaaS | Gradientes, formas fluidas, cores vibrantes |
| Moda/Lifestyle | Fotos editoriais, tipografia elegante |
| **Móveis/Casa** | **Tons terrosos, texturas, peso visual** |
| Alimentação | Cores quentes, fotos apetitosas |
| Financeiro | Azul, linhas retas, sobriedade |

### Aplicação Moveirama

| Elemento | ❌ Desconexo | ✅ Coerente |
|----------|-------------|-------------|
| Paleta | Roxo + ciano (tech) | Toffee + Sage + Cream (terra) |
| Ícones | Outline fino (app) | Duotone robusto (físico) |
| Fotos | Fundo infinito branco | Ambiente real, luz natural |
| Tipografia | Geométrica fria | Inter (neutra-quente) |
| Fundos | Branco puro #FFF | Warm White #FAF7F4 |

### Teste de Coerência

Pergunte: *"Se eu tirasse o logo e os textos, ainda pareceria uma loja de móveis?"*

Se a resposta for "parece clínica/banco/tech", há problema de coerência.

---

## 5. Hierarquia de Processamento Cerebral

### Timeline de Processamento

```
0-50ms    → Processamento pré-atencional
            Cor, tamanho, contraste
            PERGUNTA: "É seguro? É bonito?"

50-200ms  → Reconhecimento de padrão
            Layout, estrutura, tipo de site
            PERGUNTA: "É loja? É confiável?"

200-500ms → Leitura superficial
            Preço, título, CTA principal
            PERGUNTA: "É pra mim? Quanto custa?"

2-3s      → DECISÃO: fico ou saio
            Se passou, explora mais

5s+       → Exploração consciente
            Detalhes, scroll, comparação
```

### Implicações para Design

| Fase | O que otimizar | Como |
|------|----------------|------|
| 0-50ms | Primeira impressão | Cores equilibradas, sem poluição |
| 50-200ms | Reconhecimento | Layout de e-commerce padrão |
| 200-500ms | Informação crítica | Preço grande, CTA óbvio |
| 2-3s | Decisão de ficar | Proposta de valor clara |
| 5s+ | Exploração | Conteúdo organizado, FAQ |

### Regra dos 3 Segundos

Tudo que importa para a **decisão inicial** precisa estar visível em 3 segundos:

```
ACIMA DA DOBRA (viewport inicial):
✓ Logo (é loja conhecida?)
✓ Categoria (tem o que procuro?)
✓ Preço ou faixa (cabe no bolso?)
✓ Foto do produto (é bonito?)
✓ CTA ou próximo passo (o que faço?)
```

---

## 6. Gatilhos Visuais para Classe C/D

### Contexto do Público

| Característica | Implicação Visual |
|----------------|-------------------|
| Orçamento apertado | Preço visível IMEDIATAMENTE |
| Já foi enganado | Precisa ver CNPJ, endereço, WhatsApp real |
| Tempo escasso | Sem caça ao tesouro, tudo óbvio |
| Apê pequeno | Fotos em ambientes compactos |
| Medo de montagem | Ícones de "fácil", vídeo, suporte |

### Gatilhos que Funcionam

| Gatilho | Aplicação Visual | Exemplo |
|---------|------------------|---------|
| **Prova social local** | Badge com bairro | "Entregue hoje no Cajuru" |
| **Autoridade técnica** | Specs visíveis | "MDP 18mm • Suporta 25kg" |
| **Reciprocidade** | Dar antes de pedir | "Guia de medidas grátis" |
| **Inimigo comum** | Comparativo sutil | "≠ móvel descartável" |
| **Ancoragem** | Preço "de/por" | ~~R$ 399~~ **R$ 299** |
| **Escassez real** | Só se verdade | "Últimas 3 unidades" |

### Gatilhos que NÃO Funcionam

| Gatilho | Por que falha | Alternativa |
|---------|---------------|-------------|
| "Premium/Luxo" | Intimida, parece caro | "Custo-benefício" |
| "Exclusivo" | Distante | "Popular no seu bairro" |
| "Design sofisticado" | Não entende | "Bonito e prático" |
| Estética minimalista extrema | Parece incompleto | Clean mas completo |
| Fotos de revista | Não se identifica | Fotos de apê real |

### Teste do "Vizinho"

> *"Meu vizinho entenderia isso em 3 segundos?"*

Se precisar explicar, simplifica.

---

## 7. Técnicas de Redução de Atrito

### Princípio

Cada ponto de dúvida ou esforço extra é **atrito** que reduz conversão.

### Mapa de Atrito em E-commerce

```
ALTO ATRITO                              BAIXO ATRITO
←――――――――――――――――――――――――――――――――――――――――――――――――――→

Preço escondido                          Preço na primeira dobra
Frete "calcule depois"                   Frete calculável na PDP
Medidas em tabela técnica                Medidas com "cabe TV de X"
Botão "Saiba mais"                       Botão "Comprar agora"
Form de 10 campos                        Form progressivo
Sem WhatsApp                             WhatsApp visível sempre
```

### Técnicas de Redução

| Técnica | Aplicação |
|---------|-----------|
| **Defaults inteligentes** | CEP pré-sugere cidade baseado em IP |
| **Progressive disclosure** | Mostra básico, expande se quiser |
| **Chunking** | Agrupa info relacionada (preço + parcelas + Pix) |
| **Eliminação** | Remove o que não ajuda a vender |
| **Tradução** | "140cm largura" → "Cabe TV até 55 polegadas" |

### Aplicação: Medidas de Móvel

```
❌ ALTO ATRITO:
"Dimensões: 133,5 × 59 × 33 cm (L×A×P)"

✅ BAIXO ATRITO:
"📐 133,5 × 59 × 33 cm • Cabe TV até 55 polegadas"
    ↳ Medida técnica + tradução prática
```

---

## 8. Comunicação Assíncrona com Dev

### Princípio

Handoffs ruins geram retrabalho. A comunicação deve ser **completa, clara e respeitosa do tempo do Dev**.

### Estrutura de Mensagem Eficiente

```markdown
## [Tipo]: [Título curto]

### O que mudou
[Lista objetiva de alterações]

### Por quê
[1-2 frases de justificativa]

### Onde encontrar
[Links para arquivos/specs]

### Impacto no tempo
[Estimativa honesta]

### Detalhe específico
[Algo que pode gerar dúvida]
```

### Boas Práticas

| Fazer | Evitar |
|-------|--------|
| Ser específico: "Mudar cor de #6B8E7A para #8B7355" | Vago: "Deixar mais quente" |
| Incluir código/specs prontos | Só imagem sem specs |
| Estimar impacto: "+30min" | Sem noção de esforço |
| Explicar o porquê | Mudança sem contexto |
| Um canal, uma mensagem | Informação espalhada |

### Template de Atualização de Spec

```markdown
**Assunto:** 🔄 Atualização — [Componente/Página]

**O que mudou:**
- Item 1: de X para Y
- Item 2: de A para B

**Por quê:** [Justificativa em 1 linha]

**Arquivos:** [Links]

**Impacto:** ~[tempo] adicional

**Dúvida específica:** [Se houver]
```

---

## 9. Checklist de Decisão Avançada

Antes de finalizar qualquer entrega, passe por este checklist:

### Coerência

- [ ] As cores refletem o produto (móveis = tons terrosos)?
- [ ] O peso visual transmite solidez/qualidade?
- [ ] Tirando logo e texto, ainda parece loja de móveis?

### Psicologia

- [ ] Informação crítica visível em 3 segundos?
- [ ] Preço é o elemento mais destacado na PDP?
- [ ] Medos do cliente estão endereçados visualmente?

### Semiótica

- [ ] Ícones comunicam especificidade ou são genéricos?
- [ ] Cliente classe C/D reconhece a situação dele?
- [ ] Elementos visuais têm significado claro?

### Atrito

- [ ] Existe algum "caça ao tesouro" escondido?
- [ ] Termos técnicos foram traduzidos?
- [ ] WhatsApp está visível como escape?

### Comunicação

- [ ] Spec está completa para Dev implementar sem dúvidas?
- [ ] Justificativa está documentada?
- [ ] Estimativa de tempo foi informada?

---

## Referências

### Livros e Autores

| Tema | Referência |
|------|------------|
| Psicologia das cores | Eva Heller — "A Psicologia das Cores" |
| Gestalt | Rudolf Arnheim — "Arte e Percepção Visual" |
| Semiótica | Charles Peirce — Teoria dos Signos |
| Design Emocional | Don Norman — "Design Emocional" |
| Neuromarketing | Roger Dooley — "Brainfluence" |
| CRO | Peep Laja — CXL Institute |

### Aplicação E-commerce

| Conceito | Fonte |
|----------|-------|
| Lei de Hick | UX research (tempo de decisão) |
| Padrão F de leitura | Nielsen Norman Group |
| Above the fold | Google UX research |
| Mobile-first | Luke Wroblewski |

---

## Changelog

| Versão | Data | Mudanças |
|--------|------|----------|
| 1.0 | Jan 2026 | Versão inicial |

---

*Documento criado pelo Squad Visual — Janeiro 2026*
