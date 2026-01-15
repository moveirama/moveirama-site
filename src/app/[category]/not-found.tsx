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

      <style jsx>{`
        .not-found {
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 64px 0;
        }
        
        .not-found__content {
          text-align: center;
          max-width: 480px;
        }
        
        .not-found__title {
          font-size: 72px;
          font-weight: 700;
          color: var(--color-sand-light);
          margin: 0 0 8px 0;
          line-height: 1;
        }
        
        .not-found__subtitle {
          font-size: 24px;
          font-weight: 600;
          color: var(--color-graphite);
          margin: 0 0 16px 0;
        }
        
        .not-found__text {
          font-size: 16px;
          color: var(--color-toffee);
          margin: 0 0 32px 0;
        }
        
        .not-found__actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        @media (min-width: 480px) {
          .not-found__actions {
            flex-direction: row;
            justify-content: center;
          }
        }
        
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 12px 24px;
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-graphite);
          background-color: transparent;
          border: 2px solid var(--color-graphite);
          border-radius: var(--radius-md);
          text-decoration: none;
          transition: background-color 150ms ease-out;
        }
        
        .btn-secondary:hover {
          background-color: var(--color-cream);
        }
      `}</style>
    </>
  )
}
