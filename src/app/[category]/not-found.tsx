import Link from 'next/link'

export default function CategoryNotFound() {
  return (
    <main className="min-h-screen bg-[var(--color-warm-white)] flex items-center justify-center">
      <div className="text-center px-4 py-16">
        {/* Ícone */}
        <svg 
          className="w-20 h-20 mx-auto mb-6 text-[var(--color-sand-light)]"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>

        {/* Título */}
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-graphite)] mb-3">
          Categoria não encontrada
        </h1>

        {/* Descrição */}
        <p className="text-base text-[var(--color-toffee)] mb-8 max-w-md mx-auto">
          A categoria que você está procurando não existe ou foi removida. 
          Que tal explorar nossas outras opções?
        </p>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            href="/casa"
            className="inline-flex items-center justify-center px-6 py-3 min-h-[48px] text-base font-semibold text-white bg-[var(--color-sage-500)] hover:bg-[var(--color-sage-600)] rounded-lg transition-colors"
          >
            Móveis para Casa
          </Link>
          <Link 
            href="/escritorio"
            className="inline-flex items-center justify-center px-6 py-3 min-h-[48px] text-base font-semibold text-[var(--color-graphite)] border-2 border-[var(--color-graphite)] hover:bg-[var(--color-cream)] rounded-lg transition-colors"
          >
            Móveis para Escritório
          </Link>
        </div>

        {/* Link para home */}
        <p className="mt-8 text-sm text-[var(--color-toffee)]">
          Ou volte para a{' '}
          <Link href="/" className="text-[var(--color-sage-600)] hover:underline">
            página inicial
          </Link>
        </p>
      </div>
    </main>
  )
}
