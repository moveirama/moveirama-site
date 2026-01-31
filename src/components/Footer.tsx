import Link from 'next/link'

// ============================================
// FOOTER v2.1
// Atualizado: 31/01/2026
// Changelog:
// - v2.1 (31/01/2026): Logo novo (SVG negativo para fundo escuro)
// - v2.0 (Jan/2026): Versão inicial com Schema.org
// ============================================

export default function Footer() {
  return (
    <footer className="bg-[#2D2D2D] text-[#FAF7F4] mt-16 overflow-x-hidden">
      {/* Schema.org LocalBusiness */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FurnitureStore",
            "name": "Moveirama",
            "description": "Loja de móveis em Curitiba. Racks, painéis, escrivaninhas e mais com entrega rápida em Curitiba e Região Metropolitana.",
            "url": "https://moveirama.com.br",
            "logo": "https://moveirama.com.br/logo/logo-completo.svg",
            "telephone": "+55-41-98420-9323",
            "email": "contato@moveirama.com.br",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Rua Barão de Guaraúna, 517",
              "addressLocality": "Curitiba",
              "addressRegion": "PR",
              "addressCountry": "BR",
              "postalCode": "80030-310"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "-25.4284",
              "longitude": "-49.2733"
            },
            "areaServed": [
              { "@type": "City", "name": "Curitiba" },
              { "@type": "City", "name": "Colombo" },
              { "@type": "City", "name": "São José dos Pinhais" },
              { "@type": "City", "name": "Araucária" },
              { "@type": "City", "name": "Pinhais" },
              { "@type": "City", "name": "Fazenda Rio Grande" },
              { "@type": "City", "name": "Almirante Tamandaré" },
              { "@type": "City", "name": "Campina Grande do Sul" },
              { "@type": "City", "name": "Quatro Barras" }
            ],
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              "opens": "09:00",
              "closes": "18:00"
            },
            "priceRange": "$$",
            "paymentAccepted": ["Pix", "Cartão de Crédito", "Cartão de Débito"],
            "currenciesAccepted": "BRL"
          })
        }}
      />

      <div className="max-w-[1280px] mx-auto px-4 py-12 overflow-x-hidden">
        <div className="grid md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Sobre - com logo novo */}
          <div className="flex flex-col items-center md:items-start">
            {/* ============================================
                LOGO v2.6 - 48px fixo (mobile e desktop)
                ============================================ */}
            <Link href="/" className="mb-4 hover:opacity-90 transition-opacity">
              <svg 
                viewBox="0 0 280 80" 
                className="h-12 w-auto"
                aria-label="Moveirama"
              >
                {/* Ícone True Squircle */}
                <path d="M40,10 C10,10 10,10 10,40 S10,70 40,70 S70,70 70,40 S70,10 40,10 Z" fill="#A85628" transform="scale(1.1)"/>
                {/* Letra "m" - 65% da altura */}
                <text x="44" y="55" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="42" textAnchor="middle" fill="#FFFFFF">m</text>
                {/* Wordmark BRANCO com kerning NEGATIVO */}
                <text x="85" y="54" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="34" letterSpacing="-0.68" fill="#FFFFFF">moveirama</text>
              </svg>
            </Link>
            <p className="text-[#FAF7F4]/70 text-sm leading-relaxed">
              Móveis novos com entrega rápida em Curitiba e Região Metropolitana. 
              Preço justo, montagem fácil e suporte de verdade.
            </p>
            {/* Redes Sociais */}
            <div className="flex justify-center md:justify-start gap-4 mt-6">
              <a 
                href="https://facebook.com/moveirama" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-11 h-11 rounded-full bg-[#FAF7F4]/10 border border-[#FAF7F4]/30 hover:bg-[#6B8E7A] hover:border-[#6B8E7A] transition-all"
                aria-label="Facebook da Moveirama"
              >
                <svg className="w-5 h-5 fill-[#FAF7F4]" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com/moveirama" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-11 h-11 rounded-full bg-[#FAF7F4]/10 border border-[#FAF7F4]/30 hover:bg-[#6B8E7A] hover:border-[#6B8E7A] transition-all"
                aria-label="Instagram da Moveirama"
              >
                <svg className="w-5 h-5 fill-[#FAF7F4]" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a 
                href="https://wa.me/5541984209323" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-11 h-11 rounded-full bg-[#FAF7F4]/10 border border-[#FAF7F4]/30 hover:bg-[#25D366] hover:border-[#25D366] transition-all"
                aria-label="WhatsApp da Moveirama"
              >
                <svg className="w-5 h-5 fill-[#FAF7F4]" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Categorias */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold mb-4 text-[#FAF7F4]">Categorias</h4>
            <ul className="space-y-2 text-sm text-[#FAF7F4]/70">
              <li><Link href="/moveis-para-casa/racks-tv" className="hover:text-[#FAF7F4] transition-colors">Racks para TV</Link></li>
              <li><Link href="/moveis-para-casa/paineis-tv" className="hover:text-[#FAF7F4] transition-colors">Painéis para TV</Link></li>
              <li><Link href="/moveis-para-escritorio/escrivaninha-home-office" className="hover:text-[#FAF7F4] transition-colors">Escrivaninhas</Link></li>
              <li><Link href="/moveis-para-casa/buffets" className="hover:text-[#FAF7F4] transition-colors">Buffets</Link></li>
              <li><Link href="/moveis-para-escritorio/mesa-em-l" className="hover:text-[#FAF7F4] transition-colors">Mesas em L</Link></li>
            </ul>
          </div>

          {/* Atendimento */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold mb-4 text-[#FAF7F4]">Atendimento</h4>
            <ul className="space-y-2 text-sm text-[#FAF7F4]/70">
              <li><Link href="/fale-com-a-gente" className="hover:text-[#FAF7F4] transition-colors">Fale com a Gente</Link></li>
              <li><Link href="/politica-trocas-devolucoes" className="hover:text-[#FAF7F4] transition-colors">Trocas e Devoluções</Link></li>
              <li><Link href="/politica-privacidade" className="hover:text-[#FAF7F4] transition-colors">Política de Privacidade</Link></li>
              <li><Link href="/entrega-moveis-curitiba-rmc" className="hover:text-[#FAF7F4] transition-colors">Onde entregamos</Link></li>
            </ul>
          </div>

          {/* Moveirama é curitibana! (substitui "Onde Entregamos") */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <h4 className="font-semibold text-[#FAF7F4]">Moveirama é curitibana!</h4>
            <p className="text-sm text-[#FAF7F4]/70 leading-relaxed">
              Entrega própria em Curitiba e região metropolitana.
            </p>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-[#FAF7F4]/20 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* CNPJ e info legal */}
            <div className="text-sm text-[#FAF7F4]/70 text-center md:text-left">
              <p>Moveirama Eureka Móveis Ltda - CNPJ: 61.154.643/0001-84</p>
              <p>Escritório Administrativo - Bairro Juvevê - Curitiba - PR</p>
            </div>

            {/* Pagamentos */}
            <div className="flex items-center gap-3 text-[#FAF7F4]/70">
              <span className="text-xs">Pagamento seguro:</span>
              <span className="text-sm">Pix</span>
              <span className="text-sm">•</span>
              <span className="text-sm">Cartão</span>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-[#FAF7F4]/70 mt-6">
            © {new Date().getFullYear()} Moveirama. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
