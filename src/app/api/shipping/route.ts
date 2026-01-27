import { NextRequest, NextResponse } from 'next/server'

// =============================================================================
// TIPOS
// =============================================================================

interface ViaCEPResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

interface ShippingResult {
  success: boolean
  data?: {
    cep: string
    address: string
    neighborhood: string
    city: string
    state: string
    fee: number
    estimatedDays: { min: number; max: number }
    isLocalDelivery: boolean
    message: string
  }
  error?: string
}

// =============================================================================
// CONFIGURAÇÃO DE FRETE
// =============================================================================

// Curitiba - entrega própria
const CURITIBA_BASE_FEE = 25.00
const CURITIBA_DELIVERY_DAYS = { min: 1, max: 3 } // Regra de negócio: 1-3 dias úteis

// Região Metropolitana
const RMC_CITIES: Record<string, { fee: number; days: { min: number; max: number } }> = {
  'pinhais': { fee: 35.00, days: { min: 1, max: 3 } },
  'são josé dos pinhais': { fee: 35.00, days: { min: 1, max: 3 } },
  'sao jose dos pinhais': { fee: 35.00, days: { min: 1, max: 3 } },
  'colombo': { fee: 35.00, days: { min: 1, max: 3 } },
  'piraquara': { fee: 40.00, days: { min: 2, max: 3 } },
  'quatro barras': { fee: 40.00, days: { min: 2, max: 3 } },
  'campina grande do sul': { fee: 40.00, days: { min: 2, max: 3 } },
  'almirante tamandaré': { fee: 40.00, days: { min: 2, max: 3 } },
  'almirante tamandare': { fee: 40.00, days: { min: 2, max: 3 } },
  'fazenda rio grande': { fee: 40.00, days: { min: 2, max: 3 } },
  'araucária': { fee: 40.00, days: { min: 2, max: 3 } },
  'araucaria': { fee: 40.00, days: { min: 2, max: 3 } },
  'campo largo': { fee: 45.00, days: { min: 2, max: 4 } },
  'campo magro': { fee: 45.00, days: { min: 2, max: 4 } },
  'mandirituba': { fee: 50.00, days: { min: 3, max: 5 } },
  'contenda': { fee: 50.00, days: { min: 3, max: 5 } },
}

// Bairros de Curitiba com exceção (mais distantes)
const CURITIBA_EXCEPTION_BAIRROS: Record<string, number> = {
  'santa felicidade': 30.00,
  'campo comprido': 30.00,
  'cidade industrial': 30.00,
  'cic': 30.00,
  'tatuquara': 30.00,
  'pinheirinho': 28.00,
  'sítio cercado': 28.00,
  'sitio cercado': 28.00,
  'cajuru': 28.00,
  'boqueirão': 28.00,
  'boqueirao': 28.00,
}

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

function normalizeCEP(cep: string): string {
  return cep.replace(/\D/g, '')
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

async function fetchViaCEP(cep: string): Promise<ViaCEPResponse | null> {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      next: { revalidate: 86400 } // Cache por 24h
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    
    if (data.erro) {
      return null
    }
    
    return data
  } catch (error) {
    console.error('Erro ao consultar ViaCEP:', error)
    return null
  }
}

function calculateShipping(viaCepData: ViaCEPResponse): ShippingResult {
  const city = normalizeText(viaCepData.localidade)
  const neighborhood = normalizeText(viaCepData.bairro)
  const state = viaCepData.uf.toUpperCase()
  
  // Verifica se é do Paraná
  if (state !== 'PR') {
    return {
      success: false,
      error: 'Desculpe, no momento só entregamos no Paraná (Curitiba e Região Metropolitana).'
    }
  }
  
  // Curitiba
  if (city === 'curitiba') {
    // Verifica exceções por bairro
    let fee = CURITIBA_BASE_FEE
    const normalizedNeighborhood = normalizeText(neighborhood)
    
    if (CURITIBA_EXCEPTION_BAIRROS[normalizedNeighborhood]) {
      fee = CURITIBA_EXCEPTION_BAIRROS[normalizedNeighborhood]
    }
    
    return {
      success: true,
      data: {
        cep: viaCepData.cep,
        address: viaCepData.logradouro,
        neighborhood: viaCepData.bairro,
        city: viaCepData.localidade,
        state: viaCepData.uf,
        fee,
        estimatedDays: CURITIBA_DELIVERY_DAYS,
        isLocalDelivery: true,
        message: `Entrega em ${CURITIBA_DELIVERY_DAYS.min}-${CURITIBA_DELIVERY_DAYS.max} dias úteis • Frota própria Moveirama`
      }
    }
  }
  
  // Região Metropolitana
  const rmcConfig = RMC_CITIES[city]
  if (rmcConfig) {
    return {
      success: true,
      data: {
        cep: viaCepData.cep,
        address: viaCepData.logradouro,
        neighborhood: viaCepData.bairro,
        city: viaCepData.localidade,
        state: viaCepData.uf,
        fee: rmcConfig.fee,
        estimatedDays: rmcConfig.days,
        isLocalDelivery: true,
        message: `Entrega em ${rmcConfig.days.min}-${rmcConfig.days.max} dias úteis • Frota própria Moveirama`
      }
    }
  }
  
  // Fora da área de entrega
  return {
    success: false,
    error: `No momento não entregamos em ${viaCepData.localidade}. Entre em contato pelo WhatsApp para verificar disponibilidade.`
  }
}

// =============================================================================
// API ROUTE
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cep } = body
    
    if (!cep) {
      return NextResponse.json(
        { success: false, error: 'CEP é obrigatório' },
        { status: 400 }
      )
    }
    
    const normalizedCEP = normalizeCEP(cep)
    
    // Valida formato do CEP
    if (normalizedCEP.length !== 8) {
      return NextResponse.json(
        { success: false, error: 'CEP inválido. Digite 8 números.' },
        { status: 400 }
      )
    }
    
    // Consulta ViaCEP
    const viaCepData = await fetchViaCEP(normalizedCEP)
    
    if (!viaCepData) {
      return NextResponse.json(
        { success: false, error: 'CEP não encontrado. Verifique e tente novamente.' },
        { status: 404 }
      )
    }
    
    // Calcula frete
    const result = calculateShipping(viaCepData)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 200 })
    }
    
    return NextResponse.json(result, { status: 200 })
    
  } catch (error) {
    console.error('Erro na API de frete:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao calcular frete. Tente novamente.' },
      { status: 500 }
    )
  }
}

// GET para verificar se API está funcionando
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'API de cálculo de frete Moveirama',
    coverage: [
      'Curitiba',
      'Pinhais',
      'São José dos Pinhais',
      'Colombo',
      'Piraquara',
      'Quatro Barras',
      'Campina Grande do Sul',
      'Almirante Tamandaré',
      'Fazenda Rio Grande',
      'Araucária',
      'Campo Largo',
      'Campo Magro',
      'Mandirituba',
      'Contenda'
    ]
  })
}
