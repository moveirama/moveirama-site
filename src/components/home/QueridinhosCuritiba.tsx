/**
 * QueridinhosCuritiba.tsx - Carrossel de Prova Social
 * Squad Dev - Fevereiro 2026
 * 
 * Carrossel horizontal com os produtos mais vendidos.
 * - Desktop: 4 cards visíveis + setas de navegação
 * - Mobile: 1.2 cards (peek) + swipe + dots
 * - Badges: Top 1 Vendas, Favorito Curitibano
 * - Integração com "Minha Lista" (favoritos)
 * 
 * @since v2.8
 */

import { QueridinhoCard } from './QueridinhoCard'
import { QueridinhoNav } from './QueridinhoNav'
import { getBestSellers } from '@/lib/supabase'

// ============================================
// COMPONENTE PRINCIPAL (Server Component)
// ============================================

export default async function QueridinhosCuritiba() {
  const products = await getBestSellers(6)

  // Se não houver produtos, não renderiza a seção
  if (products.length === 0) {
    return null
  }

  return (
    <section 
      className="queridinhos"
      aria-labelledby="queridinhos-title"
    >
      <div className="queridinhos__container">
        
        {/* Header da Seção */}
        <header className="queridinhos__header">
          <div className="queridinhos__titles">
            <h2 id="queridinhos-title" className="queridinhos__title">
              Os Queridinhos de Curitiba
            </h2>
            <p className="queridinhos__subtitle">
              A escolha inteligente dos curitibanos
            </p>
          </div>

          {/* Setas Desktop - Componente Cliente */}
          <QueridinhoNav totalProducts={products.length} />
        </header>

        {/* Carrossel */}
        <div className="queridinhos__carousel">
          <ul 
            id="queridinhos-track"
            className="queridinhos__track"
            role="list"
            aria-label="Produtos mais vendidos"
          >
            {products.map((product, index) => (
              <li 
                key={product.id} 
                className="queridinhos__item"
                role="listitem"
              >
                <QueridinhoCard 
                  product={product} 
                  index={index}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Dots para Mobile - Gerenciados pelo QueridinhoNav */}
        <div id="queridinhos-dots" className="queridinhos__dots" aria-label="Navegação do carrossel">
          {products.map((_, index) => (
            <button
              key={index}
              className={`queridinhos__dot ${index === 0 ? 'queridinhos__dot--active' : ''}`}
              aria-label={`Ir para produto ${index + 1}`}
              data-index={index}
            />
          ))}
        </div>

        {/* Link Ver Todos */}
        <div className="queridinhos__footer">
          <a 
            href="/moveis-para-casa" 
            className="queridinhos__ver-todos"
          >
            Ver todos os móveis
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

      </div>
    </section>
  )
}
