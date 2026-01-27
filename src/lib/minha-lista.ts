/**
 * Minha Lista — Sistema de Favoritos (localStorage)
 * 
 * Moveirama E-commerce
 * Janeiro 2026
 */

// ============================================
// TIPOS
// ============================================

export interface ListaItem {
  id: string           // UUID do produto
  name: string         // Nome para exibição
  price: string        // Preço formatado (ex: "301,00")
  width: string        // Largura em cm (ex: "80")
  slug: string         // Para link do produto
  subcategorySlug: string  // NOVO
  imageUrl: string     // URL da thumbnail
  savedAt: string      // ISO timestamp
}

// ============================================
// CONSTANTES
// ============================================

const STORAGE_KEY = 'moveirama_minha_lista'

// ============================================
// FUNÇÕES PRINCIPAIS
// ============================================

/**
 * Recupera a lista do localStorage
 */
export function getMinhaLista(): ListaItem[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    console.warn('[MinhaLista] Erro ao ler localStorage')
    return []
  }
}

/**
 * Salva a lista no localStorage e dispara evento customizado
 */
export function saveMinhaLista(items: ListaItem[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    // Dispara evento para sincronizar componentes na mesma aba
    window.dispatchEvent(new CustomEvent('minha-lista-updated'))
  } catch (e) {
    console.warn('[MinhaLista] localStorage indisponível:', e)
  }
}

/**
 * Adiciona um item à lista
 * @returns true se adicionou, false se já existia
 */
export function addItem(item: Omit<ListaItem, 'savedAt'>): boolean {
  const lista = getMinhaLista()
  
  // Evita duplicados
  if (lista.some(i => i.id === item.id)) {
    return false
  }
  
  lista.push({ 
    ...item, 
    savedAt: new Date().toISOString() 
  })
  
  saveMinhaLista(lista)
  return true
}

/**
 * Remove um item da lista pelo ID
 * @returns true se removeu, false se não existia
 */
export function removeItem(productId: string): boolean {
  const lista = getMinhaLista()
  const novaLista = lista.filter(i => i.id !== productId)
  
  if (novaLista.length === lista.length) {
    return false
  }
  
  saveMinhaLista(novaLista)
  return true
}

/**
 * Verifica se um produto está na lista
 */
export function isInLista(productId: string): boolean {
  return getMinhaLista().some(i => i.id === productId)
}

/**
 * Retorna a quantidade de itens na lista
 */
export function countItems(): number {
  return getMinhaLista().length
}

/**
 * Limpa toda a lista
 */
export function clearLista(): void {
  saveMinhaLista([])
}

/**
 * Toggle: adiciona se não existe, remove se existe
 * @returns { added: boolean, item?: ListaItem }
 */
export function toggleItem(item: Omit<ListaItem, 'savedAt'>): { 
  added: boolean
  currentCount: number 
} {
  const wasInLista = isInLista(item.id)
  
  if (wasInLista) {
    removeItem(item.id)
    return { added: false, currentCount: countItems() }
  } else {
    addItem(item)
    return { added: true, currentCount: countItems() }
  }
}

// ============================================
// WHATSAPP
// ============================================

const WHATSAPP_NUMBER = '5541984209323'

/**
 * Gera a mensagem pré-preenchida para WhatsApp
 */
export function generateWhatsAppMessage(): string {
  const items = getMinhaLista()
  
  if (items.length === 0) {
    return 'Oi! Preciso de ajuda para escolher um móvel.'
  }
  
  let message = 'Oi! Estou comparando esses móveis e preciso de ajuda:\n\n'
  
  items.forEach((item, i) => {
    message += `${i + 1}. ${item.name} (${item.width}cm) - R$ ${item.price}\n`
  })
  
  message += '\nQual cabe melhor no meu espaço?'
  
  return message
}

/**
 * Abre o WhatsApp com a mensagem pré-preenchida
 */
export function openWhatsAppWithList(): void {
  const message = generateWhatsAppMessage()
  const encoded = encodeURIComponent(message)
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank')
}

// ============================================
// HOOKS HELPERS (para uso em componentes)
// ============================================

/**
 * Listener para sincronização entre abas
 * Usar dentro de useEffect
 */
export function subscribeToStorageChanges(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  
  // Escuta mudanças de outras abas
  const storageHandler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback()
    }
  }
  
  // Escuta evento customizado (mesma aba)
  const customHandler = () => callback()
  
  window.addEventListener('storage', storageHandler)
  window.addEventListener('minha-lista-updated', customHandler)
  
  // Cleanup
  return () => {
    window.removeEventListener('storage', storageHandler)
    window.removeEventListener('minha-lista-updated', customHandler)
  }
}
