/**
 * Moveirama - Cálculo de Frete
 * Curitiba e Região Metropolitana
 * 
 * Usa API ViaCEP para identificar cidade/bairro
 * Preços variam por bairro específico
 */

// ============================================
// TYPES
// ============================================

export type ShippingResult = {
  city: string
  neighborhood: string
  fee: number
  deliveryDaysMin: number
  deliveryDaysMax: number
  needsConfirmation: boolean  // true = bairro desconhecido, confirmar no WhatsApp
  notDeliverable: boolean     // true = não entregamos nessa região
  message?: string            // mensagem adicional
}

export type ViaCepResponse = {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string  // cidade
  uf: string
  erro?: boolean
}

// ============================================
// REGRAS DE FRETE POR CIDADE/BAIRRO
// ============================================

// Normaliza nome para comparação (lowercase, sem acento)
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

// Curitiba - base R$ 25,00
const CURITIBA_EXCEPTIONS: Record<string, number> = {
  'umbara': 27,
  'campo de santana': 35,
  'caximba': 35,
}
const CURITIBA_BASE = 25

// São José dos Pinhais - base R$ 35,00
const SJP_EXCEPTIONS: Record<string, number> = {
  'sao marcos': 40,
  'borda do campo': 40,
  'colonia murici': 40,
  'campo largo da roseira': 50,
  'olho dagua': 50,
  'campina do taquaral': 55,
  'contenda': 60,
}
const SJP_BASE = 35
// Bairros rurais de SJP que precisam de confirmação
const SJP_NEEDS_CONFIRMATION = [
  'area rural',
  'zona rural',
  'rio pequeno',
  'guatupe',
  'rio grande',
]

// Colombo - base R$ 35,00
const COLOMBO_EXCEPTIONS: Record<string, number> = {
  'centro': 40,
  'sao joao': 40,
}
const COLOMBO_BASE = 35

// Almirante Tamandaré - base R$ 40,00
const TAMANDARE_EXCEPTIONS: Record<string, number> = {
  'cachoeira': 35,
  'lamenha grande': 35,
}
const TAMANDARE_BASE = 40

// Campina Grande do Sul - base R$ 40,00
const CGS_EXCEPTIONS: Record<string, number> = {
  'centro': 45,
}
const CGS_NOT_DELIVERED = ['paiol de baixo']
const CGS_BASE = 40

// Cidades com preço fixo
const FIXED_PRICE_CITIES: Record<string, number> = {
  'piraquara': 40,
  'quatro barras': 40,
  'fazenda rio grande': 40,
  'pinhais': 35,
}

// Cidades atendidas (para validação)
const DELIVERED_CITIES = [
  'curitiba',
  'pinhais',
  'sao jose dos pinhais',
  'piraquara',
  'quatro barras',
  'campina grande do sul',
  'almirante tamandare',
  'colombo',
  'fazenda rio grande',
]

// Prazo de entrega padrão (dias úteis)
const DELIVERY_DAYS_MIN = 1
const DELIVERY_DAYS_MAX = 3

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Normaliza CEP removendo caracteres não numéricos
 */
export function normalizeCep(cep: string): string {
  return cep.replace(/\D/g, '')
}

/**
 * Valida formato do CEP (8 dígitos)
 */
export function isValidCep(cep: string): boolean {
  const normalized = normalizeCep(cep)
  return normalized.length === 8 && /^\d+$/.test(normalized)
}

/**
 * Formata CEP para exibição (00000-000)
 */
export function formatCep(cep: string): string {
  const normalized = normalizeCep(cep)
  if (normalized.length !== 8) return cep
  return `${normalized.slice(0, 5)}-${normalized.slice(5)}`
}

// ============================================
// CÁLCULO DE FRETE
// ============================================

/**
 * Calcula o frete baseado na cidade e bairro
 */
function calculateFeeByLocation(city: string, neighborhood: string): {
  fee: number
  needsConfirmation: boolean
  notDeliverable: boolean
  message?: string
} {
  const cityNorm = normalize(city)
  const neighborhoodNorm = normalize(neighborhood)

  // Verifica se a cidade é atendida
  if (!DELIVERED_CITIES.includes(cityNorm)) {
    return {
      fee: 0,
      needsConfirmation: false,
      notDeliverable: true,
      message: 'Desculpe, não fazemos entregas para esta cidade.'
    }
  }

  // CURITIBA
  if (cityNorm === 'curitiba') {
    const exceptionFee = Object.entries(CURITIBA_EXCEPTIONS).find(
      ([bairro]) => neighborhoodNorm.includes(bairro)
    )
    return {
      fee: exceptionFee ? exceptionFee[1] : CURITIBA_BASE,
      needsConfirmation: false,
      notDeliverable: false
    }
  }

  // SÃO JOSÉ DOS PINHAIS
  if (cityNorm === 'sao jose dos pinhais') {
    // Verifica se precisa confirmação (bairros rurais)
    const needsCheck = SJP_NEEDS_CONFIRMATION.some(b => neighborhoodNorm.includes(b))
    if (needsCheck) {
      return {
        fee: 0,
        needsConfirmation: true,
        notDeliverable: false,
        message: 'Este bairro pode estar em área rural. Por favor, confirme a disponibilidade no WhatsApp.'
      }
    }
    
    const exceptionFee = Object.entries(SJP_EXCEPTIONS).find(
      ([bairro]) => neighborhoodNorm.includes(bairro)
    )
    return {
      fee: exceptionFee ? exceptionFee[1] : SJP_BASE,
      needsConfirmation: false,
      notDeliverable: false
    }
  }

  // COLOMBO
  if (cityNorm === 'colombo') {
    const exceptionFee = Object.entries(COLOMBO_EXCEPTIONS).find(
      ([bairro]) => neighborhoodNorm.includes(bairro)
    )
    return {
      fee: exceptionFee ? exceptionFee[1] : COLOMBO_BASE,
      needsConfirmation: false,
      notDeliverable: false
    }
  }

  // ALMIRANTE TAMANDARÉ
  if (cityNorm === 'almirante tamandare') {
    const exceptionFee = Object.entries(TAMANDARE_EXCEPTIONS).find(
      ([bairro]) => neighborhoodNorm.includes(bairro)
    )
    return {
      fee: exceptionFee ? exceptionFee[1] : TAMANDARE_BASE,
      needsConfirmation: false,
      notDeliverable: false
    }
  }

  // CAMPINA GRANDE DO SUL
  if (cityNorm === 'campina grande do sul') {
    // Verifica se é bairro não atendido
    const notDelivered = CGS_NOT_DELIVERED.some(b => neighborhoodNorm.includes(b))
    if (notDelivered) {
      return {
        fee: 0,
        needsConfirmation: false,
        notDeliverable: true,
        message: 'Desculpe, não fazemos entregas para este bairro.'
      }
    }
    
    const exceptionFee = Object.entries(CGS_EXCEPTIONS).find(
      ([bairro]) => neighborhoodNorm.includes(bairro)
    )
    return {
      fee: exceptionFee ? exceptionFee[1] : CGS_BASE,
      needsConfirmation: false,
      notDeliverable: false
    }
  }

  // CIDADES COM PREÇO FIXO
  if (FIXED_PRICE_CITIES[cityNorm] !== undefined) {
    return {
      fee: FIXED_PRICE_CITIES[cityNorm],
      needsConfirmation: false,
      notDeliverable: false
    }
  }

  // Cidade não mapeada (não deveria chegar aqui)
  return {
    fee: 0,
    needsConfirmation: true,
    notDeliverable: false,
    message: 'Por favor, confirme a disponibilidade de entrega no WhatsApp.'
  }
}

/**
 * Consulta CEP na API ViaCEP
 */
export async function fetchAddressFromCep(cep: string): Promise<ViaCepResponse | null> {
  const normalized = normalizeCep(cep)
  
  if (!isValidCep(normalized)) {
    return null
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${normalized}/json/`)
    
    if (!response.ok) {
      return null
    }
    
    const data: ViaCepResponse = await response.json()
    
    if (data.erro) {
      return null
    }
    
    return data
  } catch (error) {
    console.error('Erro ao consultar ViaCEP:', error)
    return null
  }
}

/**
 * Calcula frete completo a partir do CEP
 */
export async function calculateShipping(cep: string): Promise<ShippingResult | null> {
  const address = await fetchAddressFromCep(cep)
  
  if (!address) {
    return null  // CEP inválido ou não encontrado
  }

  const city = address.localidade
  const neighborhood = address.bairro
  const cityNorm = normalize(city)

  const { fee, needsConfirmation, notDeliverable, message } = calculateFeeByLocation(city, neighborhood)

  return {
    city,
    neighborhood,
    fee,
    deliveryDaysMin: DELIVERY_DAYS_MIN,
    deliveryDaysMax: DELIVERY_DAYS_MAX,
    needsConfirmation,
    notDeliverable,
    message
  }
}

/**
 * Retorna lista de cidades atendidas (para exibição)
 */
export function getDeliveredCities(): string[] {
  return [
    'Curitiba',
    'Pinhais',
    'São José dos Pinhais',
    'Piraquara',
    'Quatro Barras',
    'Campina Grande do Sul',
    'Almirante Tamandaré',
    'Colombo',
    'Fazenda Rio Grande',
  ]
}
