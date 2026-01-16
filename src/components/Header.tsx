'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Estrutura de navegação (2 níveis)
const NAVIGATION = {
  casa: {
    label: 'Casa',
    href: '/casa',
    items: [
      { label: 'Racks para TV', href: '/casa/racks' },
      { label: 'Painéis para TV', href: '/casa/paineis' },
      { label: 'Buffets', href: '/casa/buffets' },
      { label: 'Penteadeiras', href: '/casa/penteadeiras' },
    ],
  },
  escritorio: {
    label: 'Escritório',
    href: '/escritorio',
    items: [
      { label: 'Escrivaninhas', href: '/escritorio/escrivaninhas' },
      { label: 'Gaveteiros', href: '/escritorio/gaveteiros' },
      { label: 'Mesas para Escritório', href: '/escritorio/mesas' },
      { label: 'Estações de Trabalho', href: '/escritorio/estacoes' },
    ],
  },
}

// Ícone Chevron
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

// Ícone WhatsApp
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

// Ícone Busca
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

// Ícone Hamburger
function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

// Ícone X (fechar)
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

// Ícone Seta
function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

// Ícone Localização
function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const pathname = usePathname()
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Fechar menu mobile ao navegar
  useEffect(() => {
    setMobileMenuOpen(false)
    setExpandedCategory(null)
  }, [pathname])

  // Fechar menu com Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [mobileMenuOpen])

  // Bloquear scroll do body quando menu está aberto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const toggleCategory = (key: string) => {
    setExpandedCategory(expandedCategory === key ? null : key)
  }

  return (
    <>
      <header className="sticky top-0 z-[1000]">
        {/* Barra de Localização */}
        <div className="bg-[var(--color-graphite)] text-white text-sm">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-2 flex items-center justify-center gap-4 md:justify-between">
            <p className="flex items-center gap-2">
              <LocationIcon className="w-4 h-4" />
              <span>Curitiba e Região Metropolitana</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Receba em até 3 dias úteis</span>
            </p>
            <a 
              href="https://wa.me/5541984209323" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 hover:text-[var(--color-sage-500)] transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Fale conosco</span>
            </a>
          </div>
        </div>

        {/* Barra Principal */}
        <div className="bg-white border-b border-[var(--color-sand-light)]">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-8 h-[72px] flex items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
              className="text-2xl font-bold text-[var(--color-graphite)] hover:text-[var(--color-sage-600)] transition-colors"
              aria-label="Moveirama - Página inicial"
            >
              moveirama
            </Link>

            {/* Nav Desktop */}
            <nav className="hidden lg:block" aria-label="Menu principal">
              <ul className="flex items-center gap-2">
                {Object.entries(NAVIGATION).map(([key, category]) => (
                  <li key={key} className="relative group">
                    <button
                      className="flex items-center gap-1 px-4 py-3 text-[15px] font-medium text-[var(--color-graphite)] hover:bg-[var(--color-gray-100)] hover:text-[var(--color-sage-600)] rounded-lg transition-all duration-150"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      {category.label}
                      <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                    </button>
                    
                    {/* Dropdown */}
                    <div className="absolute top-full left-0 min-w-[220px] bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] p-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                      <ul>
                        {category.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className="block px-3 py-2.5 text-sm text-[var(--color-graphite)] hover:bg-[var(--color-sage-100)] hover:text-[var(--color-sage-700)] rounded-lg transition-colors duration-150"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 pt-2 border-t border-[var(--color-sand-light)]">
                        <Link
                          href={category.href}
                          className="flex items-center gap-1 px-3 py-2.5 text-[13px] font-medium text-[var(--color-sage-600)] hover:bg-[var(--color-sage-100)] rounded-lg transition-colors duration-150"
                        >
                          Ver todos
                          <ArrowRightIcon className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Ações */}
            <div className="flex items-center gap-3">
              {/* Busca */}
              <button 
                className="flex items-center justify-center w-11 h-11 text-[var(--color-toffee)] hover:text-[var(--color-graphite)] hover:bg-[var(--color-gray-100)] rounded-lg transition-colors"
                aria-label="Buscar"
              >
                <SearchIcon className="w-6 h-6" />
              </button>
              
              {/* WhatsApp Desktop */}
              <a
                href="https://wa.me/5541984209323"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[var(--color-whatsapp)] hover:bg-[#20BD5A] rounded-lg transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5" />
                <span>WhatsApp</span>
              </a>

              {/* Hamburger Mobile */}
              <button 
                className="flex lg:hidden items-center justify-center w-11 h-11 text-[var(--color-graphite)] hover:bg-[var(--color-gray-100)] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Abrir menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[2000] ${mobileMenuOpen ? 'visible' : 'invisible'}`}
        aria-hidden={!mobileMenuOpen}
        ref={mobileMenuRef}
      >
        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
        
        {/* Panel */}
        <div 
          className={`absolute top-0 right-0 w-full max-w-[320px] h-full bg-white flex flex-col transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Header do Menu */}
          <div className="flex justify-end p-4 border-b border-[var(--color-sand-light)]">
            <button
              className="flex items-center justify-center w-11 h-11 text-[var(--color-graphite)] hover:bg-[var(--color-gray-100)] rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fechar menu"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Nav Mobile */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul>
              {Object.entries(NAVIGATION).map(([key, category]) => (
                <li key={key}>
                  <button
                    className={`flex items-center justify-between w-full px-5 py-3.5 text-base font-medium text-left transition-colors ${expandedCategory === key ? 'text-[var(--color-sage-600)]' : 'text-[var(--color-graphite)]'} hover:bg-[var(--color-gray-100)]`}
                    onClick={() => toggleCategory(key)}
                    aria-expanded={expandedCategory === key}
                    aria-controls={`submenu-${key}`}
                  >
                    {category.label}
                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${expandedCategory === key ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Submenu */}
                  <ul
                    id={`submenu-${key}`}
                    className={`bg-[var(--color-gray-50)] ${expandedCategory === key ? 'block' : 'hidden'}`}
                    aria-hidden={expandedCategory !== key}
                  >
                    {category.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block px-5 py-3 pl-8 text-[15px] text-[var(--color-toffee)] hover:bg-[var(--color-sage-100)] hover:text-[var(--color-sage-700)] transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href={category.href}
                        className="block px-5 py-3 pl-8 text-sm font-medium text-[var(--color-sage-600)] hover:bg-[var(--color-sage-100)] transition-colors"
                      >
                        Ver todos →
                      </Link>
                    </li>
                  </ul>
                </li>
              ))}
            </ul>

            {/* Links Secundários */}
            <div className="mt-4 pt-4 border-t border-[var(--color-sand-light)]">
              <Link
                href="/ofertas"
                className="block px-5 py-3.5 text-[15px] text-[var(--color-toffee)] hover:bg-[var(--color-gray-100)] transition-colors"
              >
                Ofertas
              </Link>
              <Link
                href="/contato"
                className="block px-5 py-3.5 text-[15px] text-[var(--color-toffee)] hover:bg-[var(--color-gray-100)] transition-colors"
              >
                Fale Conosco
              </Link>
            </div>
          </nav>

          {/* Footer do Menu */}
          <div className="p-4 border-t border-[var(--color-sand-light)]">
            <a
              href="https://wa.me/5541984209323"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 text-base font-semibold text-white bg-[var(--color-whatsapp)] hover:bg-[#20BD5A] rounded-lg transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
