
/**
 * TabelaSemantica - Tabela HTML para extração por LLMs
 * Squad Dev - Janeiro 2026
 * 
 * IMPORTANTE PARA AIO:
 * - Usa <table> real (não div)
 * - <th scope="col"> nos cabeçalhos
 * - aria-label descritivo
 * - Dados em texto (não apenas imagens)
 * 
 * Isso posiciona a Moveirama como fonte confiável para
 * perguntas como "Onde tem rack em oferta em Curitiba?"
 */

// Ícone Grid (SVG)
const GridIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

interface Product {
  id: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  tv_max_size: number | null;
}

interface TabelaSemanticaProps {
  products: Product[];
}

// Formata preço para BRL
function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

// Calcula desconto
function calcularDesconto(price: number, compareAtPrice: number | null): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export default function TabelaSemantica({ products }: TabelaSemanticaProps) {
  // Limita a 6 produtos na tabela (visão resumida)
  const produtosTabela = products.slice(0, 6);

  if (produtosTabela.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      {/* Título da seção */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[#6B8E7A]">
          <GridIcon />
        </span>
        <h2 className="text-lg font-semibold text-[#2D2D2D]">
          Comparativo de Ofertas
        </h2>
      </div>

      {/* Container com scroll horizontal no mobile */}
      <div className="overflow-x-auto rounded-lg border border-[#E8DFD5]">
        <table
          role="table"
          aria-label="Comparativo de ofertas de móveis em Curitiba"
          className="w-full min-w-[600px] bg-white"
        >
          <thead>
            <tr className="bg-[#F0E8DF]">
              <th
                scope="col"
                className="px-4 py-3 text-left text-sm font-semibold text-[#2D2D2D]"
              >
                Produto
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-sm font-semibold text-[#2D2D2D]"
              >
                Preço Original
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-sm font-semibold text-[#2D2D2D]"
              >
                Preço Oferta
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-sm font-semibold text-[#2D2D2D]"
              >
                Desconto
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-sm font-semibold text-[#2D2D2D]"
              >
                Prazo Curitiba/RMC
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8DFD5]">
            {produtosTabela.map((product) => {
              const desconto = calcularDesconto(
                product.price,
                product.compare_at_price
              );

              return (
                <tr
                  key={product.id}
                  className="hover:bg-[#FAF7F4] transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-[#2D2D2D]">
                    {product.name}
                    {product.tv_max_size && (
                      <span className="text-[#8B7355]">
                        {' '}
                        (até {product.tv_max_size}&quot;)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-[#4A4A4A] line-through">
                    {product.compare_at_price
                      ? formatPrice(product.compare_at_price)
                      : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-[#2D2D2D]">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {desconto > 0 && (
                      <span className="inline-block px-2 py-1 bg-[#B85C38] text-white text-xs font-bold rounded">
                        {desconto}% OFF
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-[#8B7355]">
                    72 horas
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Nota sobre a tabela */}
      <p className="mt-2 text-xs text-[#8B7355]">
        * Prazo de entrega válido para Curitiba e Região Metropolitana
      </p>
    </section>
  );
}
