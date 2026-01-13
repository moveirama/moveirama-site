import Link from 'next/link'

export default function ProductNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-[var(--color-graphite)] mb-2">
          Produto não encontrado
        </h1>
        <p className="text-[var(--color-toffee)] mb-6">
          Este produto pode ter sido removido ou o link está incorreto.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Voltar para a loja
        </Link>
      </div>
    </main>
  )
}
