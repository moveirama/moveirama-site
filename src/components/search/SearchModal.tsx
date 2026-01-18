'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// ============================================
// TIPOS
// ============================================

type SearchResult = {
  id: string
  name: string
  slug: string
  price: number
  category_slug: string | null
  first_image: string | null
  tv_max_size: number | null
  rating?: number
  review_count?: number
}

type SearchResponse = {
  products: SearchResult[]
  filters: string[]
  total: number
}

type SearchState = 'inicial' | 'loading' | 'resultados' | 'vazio'

// ============================================
// ÍCONES SVG
// ============================================

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.3-4.3"/>
    </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

// ============================================
// DADOS ESTÁTICOS (V1)
// ============================================

const SUGESTOES_POPULARES = [
  { texto: 'Rack TV 55"', query: 'rack tv 55' },
  { texto: 'Escrivaninha', query: 'escrivaninha' },
  { texto: 'Painel para TV', query: 'painel' },
  { texto: 'Penteadeira', query: 'penteadeira' },
  { texto: 'Mesa de centro', query: 'mesa centro' },
  { texto: 'Até R$ 299', query: 'até 299' },
]

const CATEGORIAS = [
  { 
    emoji: '🏠', 
    texto: 'Casa', 
    href: '/casa',
    subcategorias: [
      { texto: 'Sala', href: '/casa/sala' },
      { texto: 'Quarto', href: '/casa/quarto' },
    ] 
  },
  { 
    emoji: '💼', 
    texto: 'Escritório', 
    href: '/escritorio',
    subcategorias: [
      { texto: 'Home Office', href: '/escritorio/home-office' },
      // { texto: 'Linha Executiva', href: '/escritorio/linha-executiva' }, // TODO: Adicionar quando existir
    ] 
  },
]

const SUGESTOES_ALTERNATIVAS = ['Racks', 'Painéis', 'Escrivaninha', 'Penteadeira']

// ============================================
// COMPONENTES AUXILIARES
// ============================================

// Chip de Filtro Removível
function FilterChip({ texto, onRemove }: { texto: string; onRemove: () => void }) {
  return (
    <button 
      onClick={onRemove}
      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-[#6B8E7A] rounded-full text-sm text-[#6B8E7A] hover:bg-[#F0F5F2] transition-colors min-h-[32px] cursor-pointer"
      aria-label={`Remover filtro: ${texto}`}
    >
      {texto}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70 hover:opacity-100">
        <path d="M18 6 6 18M6 6l12 12"/>
      </svg>
    </button>
  )
}

// Skeleton de Resultado
function ResultSkeleton() {
  return (
    <div className="flex gap-3 p-3 bg-[#F0E8DF] rounded-lg animate-pulse">
      <div className="w-20 h-20 bg-[#E8DFD5] rounded-lg shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-[18px] bg-[#E8DFD5] rounded w-[70%]" />
        <div className="h-[14px] bg-[#E8DFD5] rounded w-[40%]" />
        <div className="h-[20px] bg-[#E8DFD5] rounded w-[30%]" />
      </div>
    </div>
  )
}

// Card de Resultado
function ResultCard({ 
  produto, 
  index, 
  onClick 
}: { 
  produto: SearchResult
  index: number
  onClick: () => void 
}) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const formatInstallment = (price: number, parcelas: number = 12) => {
    const valor = price / parcelas
    return `${parcelas}x ${valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
  }

  const rating = produto.rating || 5
  const reviewCount = produto.review_count || 0

  return (
    <button 
      onClick={onClick}
      className="w-full flex gap-3 p-3 bg-[#F0E8DF] rounded-lg hover:bg-white hover:shadow-md transition-all text-left cursor-pointer border-none"
      style={{ 
        animation: `fadeInUp 200ms ease-out ${index * 50}ms both`
      }}
    >
      {/* Imagem */}
      <div className="w-20 h-20 shrink-0 bg-[#E8DFD5] rounded-lg overflow-hidden">
        {produto.first_image ? (
          <img 
            src={produto.first_image} 
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#8B7355] text-xs">
            Sem foto
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col">
        <h4 className="text-base font-semibold text-[#2D2D2D] truncate m-0">
          {produto.name}
        </h4>
        
        {/* Rating */}
        <div className="flex items-center gap-1 text-sm text-[#8B7355]">
          <span className="text-[#B85C38]">
            {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
          </span>
          {reviewCount > 0 && <span>({reviewCount})</span>}
        </div>

        {/* Preço */}
        <p className="text-lg font-bold text-[#2D2D2D] m-0">
          {formatPrice(produto.price)}
        </p>
        <p className="text-sm text-[#8B7355] m-0">
          {formatInstallment(produto.price)}
        </p>
      </div>

      {/* Seta */}
      <div className="flex items-center">
        <svg className="w-5 h-5 text-[#8B7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  )
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [appliedFilters, setAppliedFilters] = useState<string[]>([])
  const [estado, setEstado] = useState<SearchState>('inicial')
  const [total, setTotal] = useState(0)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // ==========================================
  // EFEITOS
  // ==========================================

  // Focar input ao abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Fechar com Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Atalho Ctrl+K / Cmd+K (registrado no parent, mas backup aqui)
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        // Se já está aberto, foca no input
        if (isOpen && inputRef.current) {
          inputRef.current.focus()
        }
      }
    }
    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [isOpen])

  // Bloquear scroll do body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Limpar ao fechar
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setResults([])
      setAppliedFilters([])
      setEstado('inicial')
      setTotal(0)
    }
  }, [isOpen])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return

    const modal = modalRef.current
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    modal.addEventListener('keydown', handleTabKey)
    return () => modal.removeEventListener('keydown', handleTabKey)
  }, [isOpen])

  // ==========================================
  // BUSCA
  // ==========================================

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setAppliedFilters([])
      setEstado('inicial')
      setTotal(0)
      return
    }

    setEstado('loading')

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data: SearchResponse = await res.json()
      
      setResults(data.products || [])
      setAppliedFilters(data.filters || [])
      setTotal(data.total || 0)
      setEstado(data.products?.length > 0 ? 'resultados' : 'vazio')
    } catch (error) {
      console.error('Erro na busca:', error)
      setResults([])
      setEstado('vazio')
    }
  }, [])

  // Debounce da busca (300ms conforme spec)
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, search])

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleProductClick = (product: SearchResult) => {
    const categoryPath = product.category_slug || 'produtos'
    router.push(`/${categoryPath}/${product.slug}`)
    onClose()
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
  }

  const handleCategoryClick = (href: string) => {
    router.push(href)
    onClose()
  }

  const handleViewAll = () => {
    router.push(`/busca?q=${encodeURIComponent(query)}`)
    onClose()
  }

  const handleWhatsAppClick = () => {
    const mensagem = query 
      ? `Oi! Não encontrei "${query}" no site. Vocês têm?`
      : 'Oi! Preciso de ajuda para encontrar um móvel.'
    const url = `https://wa.me/5541984209323?text=${encodeURIComponent(mensagem)}`
    window.open(url, '_blank')
  }

  const removerFiltro = (index: number) => {
    // Por enquanto, limpa a busca (V1 simples)
    // Futuro: remover só o filtro específico e re-buscar
    setQuery('')
  }

  // ==========================================
  // RENDER
  // ==========================================

  if (!isOpen) return null

  return (
    <>
      {/* Animação CSS */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.98) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Overlay */}
      <div 
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: 'overlayFadeIn 200ms ease-out' }}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-modal-title"
        className="fixed inset-x-0 top-0 z-[101] md:inset-x-auto md:left-1/2 md:top-[10vh] md:-translate-x-1/2 md:w-full md:max-w-2xl"
        style={{ animation: 'modalSlideIn 200ms ease-out' }}
      >
        <div className="bg-white md:rounded-xl shadow-2xl max-h-[85vh] md:max-h-[70vh] overflow-hidden flex flex-col">
          
          {/* Header com Input */}
          <header className="p-4 border-b border-[#E8DFD5] shrink-0">
            <label htmlFor="search-input" className="sr-only" id="search-modal-title">
              Buscar produtos
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355]" />
                <input
                  ref={inputRef}
                  id="search-input"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="O que você procura?"
                  className="w-full pl-12 pr-16 py-3 text-base border border-[#E8DFD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E7A] focus:border-transparent bg-[#FAF7F4]"
                  autoComplete="off"
                  aria-describedby="search-hint"
                />
                {/* Atalho (desktop) */}
                <kbd className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 items-center px-2 py-1 bg-[#E8DFD5] rounded text-xs text-[#8B7355]">
                  ⌘K
                </kbd>
              </div>
              <button
                onClick={onClose}
                className="p-3 text-[#8B7355] hover:text-[#2D2D2D] hover:bg-[#F0E8DF] rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Fechar busca"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Filtros detectados */}
            {appliedFilters.length > 0 && (
              <div className="mt-3" aria-live="polite">
                <p className="text-sm text-[#8B7355] mb-2">Entendi sua busca:</p>
                <div className="flex flex-wrap gap-2">
                  {appliedFilters.map((filter, i) => (
                    <FilterChip 
                      key={i}
                      texto={filter}
                      onRemove={() => removerFiltro(i)}
                    />
                  ))}
                </div>
              </div>
            )}
          </header>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4">
            
            {/* Estado: Inicial */}
            {estado === 'inicial' && (
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Buscas populares */}
                <div>
                  <h3 className="text-sm font-semibold text-[#8B7355] uppercase tracking-wider mb-3">
                    Buscas populares
                  </h3>
                  <ul className="list-none p-0 m-0">
                    {SUGESTOES_POPULARES.map((s, i) => (
                      <li key={i}>
                        <button 
                          onClick={() => handleSuggestionClick(s.query)}
                          className="w-full text-left py-2 px-3 rounded-lg text-base text-[#2D2D2D] hover:bg-[#F0E8DF] transition-colors min-h-[44px] flex items-center cursor-pointer border-none bg-transparent"
                        >
                          {s.texto}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Categorias (desktop) */}
                <div className="hidden md:block">
                  <h3 className="text-sm font-semibold text-[#8B7355] uppercase tracking-wider mb-3">
                    Categorias
                  </h3>
                  <ul className="list-none p-0 m-0">
                    {CATEGORIAS.map((c, i) => (
                      <li key={i}>
                        <button 
                          onClick={() => handleCategoryClick(c.href)}
                          className="w-full text-left py-2 px-3 rounded-lg text-base text-[#2D2D2D] hover:bg-[#F0E8DF] transition-colors min-h-[44px] flex items-center cursor-pointer border-none bg-transparent"
                        >
                          {c.emoji} {c.texto}
                        </button>
                        {c.subcategorias.map((sub, j) => (
                          <button 
                            key={j}
                            onClick={() => handleCategoryClick(sub.href)}
                            className="w-full text-left py-2 px-3 pl-10 rounded-lg text-sm text-[#8B7355] hover:bg-[#F0E8DF] transition-colors min-h-[44px] flex items-center cursor-pointer border-none bg-transparent"
                          >
                            {sub.texto}
                          </button>
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Estado: Loading */}
            {estado === 'loading' && (
              <div className="flex flex-col gap-3" aria-live="polite">
                <span className="sr-only">Buscando produtos...</span>
                <ResultSkeleton />
                <ResultSkeleton />
                <ResultSkeleton />
              </div>
            )}

            {/* Estado: Resultados */}
            {estado === 'resultados' && (
              <div className="flex flex-col" aria-live="polite">
                <p className="text-sm text-[#8B7355] mb-3">
                  {total} {total === 1 ? 'produto encontrado' : 'produtos encontrados'}
                </p>
                <div className="flex flex-col gap-3">
                  {results.slice(0, 5).map((produto, i) => (
                    <ResultCard 
                      key={produto.id} 
                      produto={produto} 
                      index={i}
                      onClick={() => handleProductClick(produto)}
                    />
                  ))}
                </div>
                {total > 5 && (
                  <button 
                    onClick={handleViewAll}
                    className="block text-center py-4 mt-3 text-base font-semibold text-[#6B8E7A] border-t border-[#E8DFD5] hover:text-[#5A7A68] transition-colors cursor-pointer bg-transparent border-x-0 border-b-0"
                  >
                    Ver todos os {total} resultados →
                  </button>
                )}
              </div>
            )}

            {/* Estado: Vazio */}
            {estado === 'vazio' && (
              <div className="flex flex-col items-center text-center py-8 px-4" aria-live="polite">
                <div className="text-5xl mb-4">😕</div>
                <p className="text-lg font-semibold text-[#2D2D2D] m-0 mb-2">
                  Não encontramos "{query}"
                </p>
                <p className="text-base text-[#8B7355] m-0 mb-4">
                  Mas a gente pode te ajudar:
                </p>
                <button 
                  onClick={handleWhatsAppClick}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:brightness-110 transition-all mb-6 min-h-[48px] cursor-pointer border-none"
                >
                  <WhatsAppIcon />
                  Chamar no WhatsApp
                </button>
                <p className="text-sm text-[#8B7355] m-0 mb-3">Ou tente buscar por:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGESTOES_ALTERNATIVAS.map(s => (
                    <button 
                      key={s}
                      onClick={() => handleSuggestionClick(s.toLowerCase())}
                      className="inline-flex items-center px-4 py-2 bg-[#F0E8DF] border border-[#E8DFD5] rounded-full text-sm text-[#2D2D2D] hover:bg-white hover:border-[#6B8E7A] transition-colors min-h-[44px] cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer - só no estado inicial */}
          {estado === 'inicial' && (
            <footer className="px-4 py-3 border-t border-[#E8DFD5] bg-[#F0E8DF] shrink-0">
              <p className="text-sm text-[#8B7355] m-0 text-center" id="search-hint">
                💡 <strong className="text-[#2D2D2D]">Dica:</strong> busque por medida (1,80m), TV (55"), ou preço (até R$ 500)
              </p>
            </footer>
          )}

        </div>
      </div>
    </>
  )
}
