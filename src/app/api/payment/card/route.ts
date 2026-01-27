import { NextRequest, NextResponse } from 'next/server'

// =============================================================================
// TIPOS
// =============================================================================

interface CardPaymentRequest {
  orderId: string
  amount: number
  installments: number
  customer: {
    name: string
    email: string
    cpf: string
    phone: string
  }
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  shipping: {
    address: string
    neighborhood: string
    city: string
    state: string
    cep: string
    fee: number
  }
}

interface CardPaymentResponse {
  success: boolean
  data?: {
    paymentId: string
    preferenceId: string
    checkoutUrl: string
    expiresAt: string
  }
  error?: string
}

// =============================================================================
// CONFIGURAÇÃO
// =============================================================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://moveirama.com.br'

// Máximo de parcelas sem juros
const MAX_INSTALLMENTS = 12

// =============================================================================
// API ROUTES
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body: CardPaymentRequest = await request.json()
    
    // Validações básicas
    if (!body.orderId || !body.amount || !body.customer || !body.items?.length) {
      return NextResponse.json(
        { success: false, error: 'Dados incompletos para pagamento' },
        { status: 400 }
      )
    }
    
    if (body.amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valor inválido' },
        { status: 400 }
      )
    }
    
    // Validar parcelas
    if (body.installments < 1 || body.installments > MAX_INSTALLMENTS) {
      return NextResponse.json(
        { success: false, error: `Parcelas devem ser entre 1 e ${MAX_INSTALLMENTS}` },
        { status: 400 }
      )
    }
    
    // Validar CPF (básico)
    const cpfClean = body.customer.cpf.replace(/\D/g, '')
    if (cpfClean.length !== 11) {
      return NextResponse.json(
        { success: false, error: 'CPF inválido' },
        { status: 400 }
      )
    }
    
    // Em produção: criar preferência no Mercado Pago
    // const mp = new MercadoPago({ accessToken: process.env.MP_ACCESS_TOKEN })
    // const preference = await mp.preferences.create({
    //   items: body.items.map(item => ({
    //     id: item.id,
    //     title: item.name,
    //     quantity: item.quantity,
    //     unit_price: item.price,
    //     currency_id: 'BRL'
    //   })),
    //   payer: {
    //     name: body.customer.name,
    //     email: body.customer.email,
    //     phone: { number: body.customer.phone.replace(/\D/g, '') },
    //     identification: { type: 'CPF', number: cpfClean }
    //   },
    //   shipments: {
    //     cost: body.shipping.fee,
    //     receiver_address: {
    //       zip_code: body.shipping.cep,
    //       street_name: body.shipping.address,
    //       city_name: body.shipping.city,
    //       state_name: body.shipping.state
    //     }
    //   },
    //   payment_methods: {
    //     installments: body.installments,
    //     default_installments: body.installments
    //   },
    //   back_urls: {
    //     success: `${SITE_URL}/pedido/confirmado?id=${body.orderId}`,
    //     failure: `${SITE_URL}/checkout?error=payment_failed`,
    //     pending: `${SITE_URL}/pedido/confirmado?id=${body.orderId}&status=pending`
    //   },
    //   auto_return: 'approved',
    //   external_reference: body.orderId,
    //   notification_url: `${SITE_URL}/api/payment/webhook`
    // })
    
    // Mock response
    const paymentId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const preferenceId = `pref_${Math.random().toString(36).substr(2, 16)}`
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hora
    
    // URL mock - em produção usar preference.init_point
    const checkoutUrl = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${preferenceId}`
    
    const response: CardPaymentResponse = {
      success: true,
      data: {
        paymentId,
        preferenceId,
        checkoutUrl,
        expiresAt: expiresAt.toISOString()
      }
    }
    
    // Em produção: salvar payment no banco
    // await supabase.from('payments').insert({
    //   id: paymentId,
    //   order_id: body.orderId,
    //   preference_id: preferenceId,
    //   method: 'card',
    //   amount: body.amount,
    //   installments: body.installments,
    //   status: 'pending',
    //   expires_at: expiresAt.toISOString()
    // })
    
    return NextResponse.json(response, { status: 200 })
    
  } catch (error) {
    console.error('Erro ao criar pagamento com cartão:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar pagamento. Tente novamente.' },
      { status: 500 }
    )
  }
}

// GET para verificar status do pagamento
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('paymentId')
    
    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: 'paymentId é obrigatório' },
        { status: 400 }
      )
    }
    
    // Em produção: consultar Mercado Pago
    // const mp = new MercadoPago({ accessToken: process.env.MP_ACCESS_TOKEN })
    // const payment = await mp.payment.get(paymentId)
    
    // Mock response
    return NextResponse.json({
      success: true,
      paymentId,
      status: 'pending',
      paid: false
    })
    
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao verificar pagamento' },
      { status: 500 }
    )
  }
}
