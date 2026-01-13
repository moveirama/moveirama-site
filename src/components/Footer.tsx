import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[var(--color-graphite)] text-white mt-16">
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
            "telephone": "+55-41-99999-9999",
            "email": "contato@moveirama.com.br",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Curitiba",
              "addressRegion": "PR",
              "addressCountry": "BR"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "-25.4284",
              "longitude": "-49.2733"
            },
            "areaServed": [
              {
                "@type": "City",
                "name": "Curitiba"
              },
              {
                "@type": "City",
                "name": "Colombo"
              },
              {
                "@type": "City",
                "name": "São José dos Pinhais"
              },
              {
                "@type": "City",
                "name": "Araucária"
              },
              {
                "@type": "City",
                "name": "Pinhais"
              },
              {
                "@type": "City",
                "name": "Fazenda Rio Grande"
              }
            ],
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "09:00",
              "closes": "18:00"
            },
            "priceRange": "$$",
            "paymentAccepted": ["Pix", "Cartão de Crédito", "Cartão de Débito"],
            "currenciesAccepted": "BRL"
          })
        }}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sobre */}
          <div>
            <h3 className="text-xl font-bold mb-4">moveirama</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Móveis na caixa com entrega rápida em Curitiba e Região Metropolitana. 
              Preço justo, montagem fácil e suporte de verdade.
            </p>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="font-semibold mb-4">Categorias</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/categoria/racks" className="hover:text-white transition-colors">Racks para TV</Link></li>
              <li><Link href="/categoria/paineis" className="hover:text-white transition-colors">Painéis para TV</Link></li>
              <li><Link href="/categoria/escrivaninhas" className="hover:text-white transition-colors">Escrivaninhas</Link></li>
              <li><Link href="/categoria/buffets" className="hover:text-white transition-colors">Buffets</Link></li>
              <li><Link href="/categoria/mesas" className="hover:text-white transition-colors">Mesas</Link></li>
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h4 className="font-semibold mb-4">Atendimento</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/contato" className="hover:text-white transition-colors">Fale Conosco</Link></li>
              <li><Link href="/politicas/troca-devolucao" className="hover:text-white transition-colors">Trocas e Devoluções</Link></li>
              <li><Link href="/politicas/privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
              <li><Link href="/entrega" className="hover:text-white transition-colors">Regiões de Entrega</Link></li>
            </ul>
          </div>

          {/* Entrega */}
          <div>
            <h4 className="font-semibold mb-4">📍 Onde Entregamos</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>Curitiba</li>
              <li>Colombo</li>
              <li>São José dos Pinhais</li>
              <li>Araucária</li>
              <li>Pinhais</li>
              <li>Fazenda Rio Grande</li>
            </ul>
            <p className="mt-4 text-xs text-gray-400">
              Entrega própria • Sem surpresa no frete
            </p>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-700 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* CNPJ e info legal */}
            <div className="text-sm text-gray-400 text-center md:text-left">
              <p>Moveirama Móveis LTDA • CNPJ: XX.XXX.XXX/0001-XX</p>
              <p>Curitiba, PR • CEP XXXXX-XXX</p>
            </div>

            {/* Pagamentos */}
            <div className="flex items-center gap-3 text-gray-400">
              <span className="text-xs">Pagamento seguro:</span>
              <span className="text-sm">Pix</span>
              <span className="text-sm">•</span>
              <span className="text-sm">Cartão</span>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-gray-500 mt-6">
            © {new Date().getFullYear()} Moveirama. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
