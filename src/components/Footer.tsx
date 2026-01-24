import Link from 'next/link'

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
            "logo": "https://moveirama.com.br/logo.png",
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
          
          {/* Coluna 1: Categorias */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-base font-semibold text-[#FAF7F4] mb-4">
              Categorias
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/moveis-para-casa/racks-tv" 
                  className="text-sm text-[#FAF7F4]/70 hover:text-[#FAF7F4] transition-colors"
                >
                  Racks para TV
                </Link>
              </li>
              <li>
                <Link 
                  href="/moveis-para-casa/paineis-tv" 
                  className="text-sm text-[#FAF7F4]/70 hover:text-[#FAF7F4] transition-colors"
                >
                  Painéis para TV
                </Link>
              </li>
              <li>
                <Link 
                  href="/moveis-para-escritorio/escrivaninha-home-office" 
                  className="text-sm text-[#FAF7F4]/70 hover:text-[#FAF7F4] transition-colors"
                >
                  Escrivaninhas
                </Link>
              </li>
              <li>
                <Link 
                  href="/moveis-para-escritorio" 
                  className="text-sm text-[#FAF7F4]/70 hover:text-[#FAF7F4] transition-colors"
                >
                  Home Office
                </Link>
              </li>
              <li>
                <Link 
                  href="/moveis-para-casa/penteadeiras" 
                  className="text-sm text-[#FAF7F4]/70 hover:text-[#FAF7F4] transition-colors"
                >
                  Penteadeiras
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 2: Atendimento */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-base font-semibold text-[#FAF7F4] mb-4">
              Atendimento
            </h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://wa.me/5541984209323"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#FAF7F4]/70 hover:text-[#FAF7F4] transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <span className="text-sm text-[#FAF7F4]/70">
                  Seg a Sex: 9h às 18h
                </span>
              </li>
              <li>
                <span className="text-sm text-[#FAF7F4]/70">
                  Sábado: 9h às 13h
                </span>
              </li>
              <li>
                <Link 
                  href="/entrega" 
                  className="text-sm text-[#FAF7F4]/70 hover:text-[#FAF7F4] transition-colors"
                >
                  Regiões de Entrega
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Institucional */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-base font-semibold text-[#FAF7F4] mb-4">
              Institucional
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/sobre" 
                  className="text-sm text-[#FAF7F4]/70 hover:text-[#FAF7F4] transition-colors"
                >
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link 
                  href="/politicas/privacidade" 
                  className="text-sm text-[#FAF7F4]/70 hover:text-[#FAF7F4] transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link 
                  href="/politicas/troca-devolucao" 
                  className="text-sm text-[#FAF7F4]/70 hover:text-[#FAF7F4] transition-colors"
                >
                  Trocas e Devoluções
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Moveirama é curitibana! */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="text-base font-semibold text-[#FAF7F4]">
              Moveirama é curitibana!
            </h3>
            <p className="text-sm text-[#FAF7F4]/70 leading-relaxed">
              Entrega própria em Curitiba e região metropolitana.
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#FAF7F4]/20">
        <div className="max-w-[1280px] mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-[#FAF7F4]/70">
            <span>CNPJ 00.000.000/0001-00 • Curitiba, PR</span>
            <span>© 2026 Moveirama. Todos os direitos reservados.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
