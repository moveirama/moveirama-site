import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CategoryNotFound() {
  return (
    <>
      <Header />
      
      <main className="not-found">
        <div className="container">
          <div className="not-found__content">
            <h1 className="not-found__title">404</h1>
            <h2 className="not-found__subtitle">Categoria não encontrada</h2>
            <p className="not-found__text">
              A categoria que você está procurando não existe ou foi removida.
            </p>
            <div className="not-found__actions">
              <Link href="/casa" className="btn-primary">
                Ver móveis para Casa
              </Link>
              <Link href="/escritorio" className="btn-secondary">
                Ver móveis para Escritório
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />

    </>
  )
}
