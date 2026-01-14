/**
 * Componente: Tudo pra montar tranquilo
 * Spec: SPEC_Secao_Montagem_Recursos.md
 * Squad Visual → Squad Dev
 */

interface RecursosMontagem {
  manualUrl?: string | null
  medidasImagemUrl?: string | null
  videoUrl?: string | null
  datasheetUrl?: string | null
  productName: string
  whatsappNumber?: string
}

// Ícones inline para não depender de biblioteca externa
const FileTextIcon = () => (
  <svg className="w-12 h-12 text-[var(--color-sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const RulerIcon = () => (
  <svg className="w-12 h-12 text-[var(--color-sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
)

const PlayIcon = () => (
  <svg className="w-12 h-12 text-[var(--color-sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
)

const ClipboardIcon = () => (
  <svg className="w-12 h-12 text-[var(--color-sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
)

const MessageIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

export default function RecursosMontagem({ 
  manualUrl, 
  medidasImagemUrl, 
  videoUrl,
  datasheetUrl,
  productName,
  whatsappNumber = '5541999999999'
}: RecursosMontagem) {
  // Se nenhum recurso disponível, não renderizar a seção
  const temRecursos = manualUrl || medidasImagemUrl || videoUrl || datasheetUrl
  if (!temRecursos) return null

  const whatsappMessage = encodeURIComponent(`Preciso de ajuda com a montagem do ${productName}`)
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <section 
      className="bg-[var(--color-cream)] p-6 md:p-8 rounded-xl my-8"
      aria-labelledby="montagem-titulo"
    >
      {/* Título */}
      <h2 
        id="montagem-titulo" 
        className="text-xl font-semibold text-[var(--color-graphite)] mb-2"
      >
        Tudo pra montar tranquilo
      </h2>
      <p className="text-base text-[var(--color-toffee)] mb-6">
        Manual, medidas e vídeo — tudo pronto pra você montar sem dor de cabeça.
      </p>

      {/* Grid de Cards */}
      <div className={`grid grid-cols-1 gap-3 md:gap-4 ${datasheetUrl ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
        
        {/* Card: Manual */}
        <div className={`
          bg-white border border-[var(--color-sand-light)] rounded-lg p-4
          flex flex-col items-center text-center
          transition-shadow hover:shadow-md
          ${!manualUrl ? 'opacity-50 pointer-events-none' : ''}
        `}>
          <FileTextIcon />
          <span className="text-base font-medium text-[var(--color-graphite)] mb-3 mt-3">
            Manual de montagem
          </span>
          {manualUrl ? (
            <a
              href={manualUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                bg-transparent border border-[var(--color-sage-500)] text-[var(--color-sage-500)]
                text-sm font-medium py-2 px-4 rounded-lg
                min-h-[44px] inline-flex items-center justify-center gap-2
                transition-all hover:bg-[var(--color-sage-500)]/10
                focus-visible:outline focus-visible:outline-2 
                focus-visible:outline-[var(--color-sage-500)] focus-visible:outline-offset-2
              "
              aria-label="Abrir manual de montagem em PDF"
            >
              <ExternalLinkIcon />
              Abrir PDF
            </a>
          ) : (
            <span className="
              bg-[var(--color-sand-light)] border border-[var(--color-sand-light)] text-[var(--color-toffee)]
              text-sm font-medium py-2 px-4 rounded-lg
              min-h-[44px] inline-flex items-center justify-center
            ">
              Em breve
            </span>
          )}
        </div>

        {/* Card: Medidas */}
        <div className={`
          bg-white border border-[var(--color-sand-light)] rounded-lg p-4
          flex flex-col items-center text-center
          transition-shadow hover:shadow-md
          ${!medidasImagemUrl ? 'opacity-50 pointer-events-none' : ''}
        `}>
          <RulerIcon />
          <span className="text-base font-medium text-[var(--color-graphite)] mb-3 mt-3">
            Imagem das medidas
          </span>
          {medidasImagemUrl ? (
            <a
              href={medidasImagemUrl}
              download
              className="
                bg-transparent border border-[var(--color-sage-500)] text-[var(--color-sage-500)]
                text-sm font-medium py-2 px-4 rounded-lg
                min-h-[44px] inline-flex items-center justify-center gap-2
                transition-all hover:bg-[var(--color-sage-500)]/10
                focus-visible:outline focus-visible:outline-2 
                focus-visible:outline-[var(--color-sage-500)] focus-visible:outline-offset-2
              "
              aria-label="Baixar imagem com medidas do produto"
            >
              <DownloadIcon />
              Baixar
            </a>
          ) : (
            <span className="
              bg-[var(--color-sand-light)] border border-[var(--color-sand-light)] text-[var(--color-toffee)]
              text-sm font-medium py-2 px-4 rounded-lg
              min-h-[44px] inline-flex items-center justify-center
            ">
              Em breve
            </span>
          )}
        </div>

        {/* Card: Vídeo */}
        <div className={`
          bg-white border border-[var(--color-sand-light)] rounded-lg p-4
          flex flex-col items-center text-center
          transition-shadow hover:shadow-md
          ${!videoUrl ? 'opacity-50 pointer-events-none' : ''}
        `}>
          <PlayIcon />
          <span className="text-base font-medium text-[var(--color-graphite)] mb-3 mt-3">
            Vídeo de montagem
          </span>
          {videoUrl ? (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                bg-transparent border border-[var(--color-sage-500)] text-[var(--color-sage-500)]
                text-sm font-medium py-2 px-4 rounded-lg
                min-h-[44px] inline-flex items-center justify-center gap-2
                transition-all hover:bg-[var(--color-sage-500)]/10
                focus-visible:outline focus-visible:outline-2 
                focus-visible:outline-[var(--color-sage-500)] focus-visible:outline-offset-2
              "
              aria-label="Assistir vídeo de montagem no YouTube"
            >
              <ExternalLinkIcon />
              Assistir
            </a>
          ) : (
            <span className="
              bg-[var(--color-sand-light)] border border-[var(--color-sand-light)] text-[var(--color-toffee)]
              text-sm font-medium py-2 px-4 rounded-lg
              min-h-[44px] inline-flex items-center justify-center
            ">
              Em breve
            </span>
          )}
        </div>

        {/* Card: Ficha Técnica (só aparece se tiver) */}
        {datasheetUrl && (
          <div className="
            bg-white border border-[var(--color-sand-light)] rounded-lg p-4
            flex flex-col items-center text-center
            transition-shadow hover:shadow-md
          ">
            <ClipboardIcon />
            <span className="text-base font-medium text-[var(--color-graphite)] mb-3 mt-3">
              Ficha técnica
            </span>
            <a
              href={datasheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                bg-transparent border border-[var(--color-sage-500)] text-[var(--color-sage-500)]
                text-sm font-medium py-2 px-4 rounded-lg
                min-h-[44px] inline-flex items-center justify-center gap-2
                transition-all hover:bg-[var(--color-sage-500)]/10
                focus-visible:outline focus-visible:outline-2 
                focus-visible:outline-[var(--color-sage-500)] focus-visible:outline-offset-2
              "
              aria-label="Abrir ficha técnica em PDF"
            >
              <ExternalLinkIcon />
              Abrir PDF
            </a>
          </div>
        )}
      </div>

      {/* CTA WhatsApp */}
      <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-[var(--color-sand-light)] text-sm text-[var(--color-toffee)]">
        <MessageIcon />
        <span>
          Travou em algum passo?{' '}
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-whatsapp)] font-medium underline hover:no-underline"
          >
            Chama no WhatsApp
          </a>
          {' '}que ajudamos.
        </span>
      </div>
    </section>
  )
}
