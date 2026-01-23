
/**
 * OfertasFiltros - Filtros e Ordenação
 * Squad Dev - Janeiro 2026
 * 
 * FILTROS POR "DOR" (não por atributo técnico):
 * - Todas as ofertas
 * - Para sala pequena
 * - Até R$ 300
 * 
 * ORDENAÇÃO:
 * - Maior desconto (default)
 * - Menor preço
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface OfertasFiltrosProps {
  filtroAtivo: string;
  ordenacaoAtiva: string;
  totalResultados: number;
}

const FILTROS = [
  { id: 'todos', label: 'Todas as ofertas' },
  { id: 'sala-pequena', label: 'Para sala pequena' },
  { id: 'ate-300', label: 'Até R$ 300' },
];

const ORDENACOES = [
  { value: 'maior-desconto', label: 'Maior desconto' },
  { value: 'menor-preco', label: 'Menor preço' },
];

export default function OfertasFiltros({
  filtroAtivo,
  ordenacaoAtiva,
  totalResultados,
}: OfertasFiltrosProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Atualiza URL com novos parâmetros
  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === 'todos' || value === 'maior-desconto') {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      // Reset página ao mudar filtro/ordenação
      params.delete('pagina');

      const queryString = params.toString();
      const url = queryString
        ? `/ofertas-moveis-curitiba?${queryString}`
        : '/ofertas-moveis-curitiba';

      router.push(url);
    },
    [router, searchParams]
  );

  const handleFiltroChange = (filtroId: string) => {
    updateParams('filtro', filtroId);
  };

  const handleOrdenacaoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams('ordenar', e.target.value);
  };

  return (
    <div className="mb-6">
      {/* Filtros e Ordenação */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        {/* Filtros por "Dor" */}
        <div className="flex flex-wrap gap-2">
          {FILTROS.map((filtro) => {
            const isActive = filtroAtivo === filtro.id;

            return (
              <button
                key={filtro.id}
                onClick={() => handleFiltroChange(filtro.id)}
                className={`
                  px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                  min-h-[44px]
                  ${
                    isActive
                      ? 'bg-[#E8F0EB] text-[#5A7A68] border border-[#6B8E7A]'
                      : 'bg-white text-[#2D2D2D] border border-[#E8DFD5] hover:border-[#D9CFC4]'
                  }
                `}
                aria-pressed={isActive}
              >
                {filtro.label}
              </button>
            );
          })}
        </div>

        {/* Ordenação */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="ordenacao"
            className="text-sm text-[#4A4A4A] whitespace-nowrap"
          >
            Ordenar:
          </label>
          <select
            id="ordenacao"
            value={ordenacaoAtiva}
            onChange={handleOrdenacaoChange}
            className="
              px-3 py-2.5 pr-8 rounded-lg text-sm
              bg-white text-[#2D2D2D]
              border border-[#E8DFD5]
              min-h-[44px]
              cursor-pointer
              appearance-none
              bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%234A4A4A%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E')]
              bg-no-repeat
              bg-[length:16px]
              bg-[right_8px_center]
              focus:outline-none focus:border-[#6B8E7A] focus:ring-2 focus:ring-[#6B8E7A]/20
            "
          >
            {ORDENACOES.map((opcao) => (
              <option key={opcao.value} value={opcao.value}>
                {opcao.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contagem de resultados */}
      <p className="text-sm text-[#4A4A4A]">
        {totalResultados === 0 ? (
          'Nenhuma oferta encontrada'
        ) : totalResultados === 1 ? (
          '1 oferta encontrada'
        ) : (
          <>{totalResultados} ofertas encontradas</>
        )}
      </p>
    </div>
  );
}
