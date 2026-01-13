import Link from 'next/link'

export default function Header() {
  return (
    <header>
      {/* Barra de Localização */}
      <div className="bg-[var(--color-graphite)] text-white text-sm">
        <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-4 md:justify-between">
          <p className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Curitiba e Região Metropolitana</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Entrega rápida com frota própria</span>
          </p>
          <a 
            href="https://wa.me/5541999999999" 
            target="_blank" 
            rel="noopener"
            className="hidden md:flex items-center gap-2 hover:text-[var(--color-sage-500)] transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>Fale conosco</span>
          </a>
        </div>
      </div>

      {/* Barra Principal */}
      <div className="bg-white border-b border-[var(--color-sand-light)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-[var(--color-graphite)]">
            moveirama
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/categoria/racks" className="text-[var(--color-graphite)] hover:text-[var(--color-sage-600)] transition-colors">
              Racks
            </Link>
            <Link href="/categoria/paineis" className="text-[var(--color-graphite)] hover:text-[var(--color-sage-600)] transition-colors">
              Painéis
            </Link>
            <Link href="/categoria/escrivaninhas" className="text-[var(--color-graphite)] hover:text-[var(--color-sage-600)] transition-colors">
              Escrivaninhas
            </Link>
            <Link href="/categoria/buffets" className="text-[var(--color-graphite)] hover:text-[var(--color-sage-600)] transition-colors">
              Buffets
            </Link>
          </nav>

          {/* Ações */}
          <div className="flex items-center gap-4">
            {/* Busca (placeholder) */}
            <button className="p-2 text-[var(--color-toffee)] hover:text-[var(--color-graphite)] transition-colors" aria-label="Buscar">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Carrinho (placeholder) */}
            <button className="p-2 text-[var(--color-toffee)] hover:text-[var(--color-graphite)] transition-colors relative" aria-label="Carrinho">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>

            {/* Menu Mobile */}
            <button className="p-2 text-[var(--color-toffee)] hover:text-[var(--color-graphite)] transition-colors md:hidden" aria-label="Menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
