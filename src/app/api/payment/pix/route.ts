import { NextRequest, NextResponse } from 'next/server'

// =============================================================================
// TIPOS
// =============================================================================

interface PixPaymentRequest {
  orderId: string
  amount: number
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
}

interface PixPaymentResponse {
  success: boolean
  data?: {
    paymentId: string
    qrCode: string
    qrCodeBase64: string
    copyPasteCode: string
    expiresAt: string
    amount: number
  }
  error?: string
}

// =============================================================================
// MOCK PIX - Em produção, integrar com Mercado Pago
// =============================================================================

function generateMockPixCode(): string {
  // Simula um código Pix (EMV)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = '00020126580014br.gov.bcb.pix0136'
  for (let i = 0; i < 36; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  code += '5204000053039865802BR5925MOVEIRAMA MOVEIS LTDA6009CURITIBA62070503***63046'
  return code
}

function generateMockQRCodeBase64(): string {
  // Em produção, gerar QR Code real com biblioteca como 'qrcode'
  // Este é um placeholder
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
}

// =============================================================================
// API ROUTES
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body: PixPaymentRequest = await request.json()
    
    // Validações básicas
    if (!body.orderId || !body.amount || !body.customer) {
      return NextResponse.json(
        { success: false, error: 'Dados incompletos para gerar Pix' },
        { status: 400 }
      )
    }
    
    if (body.amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valor inválido' },
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
    
    // Em produção: integrar com Mercado Pago
    // const mp = new MercadoPago({ accessToken: process.env.MP_ACCESS_TOKEN })
    // const payment = await mp.payment.create({
    //   transaction_amount: body.amount,
    //   payment_method_id: 'pix',
    //   payer: {
    //     email: body.customer.email,
    //     first_name: body.customer.name.split(' ')[0],
    //     last_name: body.customer.name.split(' ').slice(1).join(' '),
    //     identification: { type: 'CPF', number: cpfClean }
    //   }
    // })
    
    // Mock response
    const paymentId = `pix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
    
    const response: PixPaymentResponse = {
      success: true,
      data: {
        paymentId,
        qrCode: generateMockQRCodeBase64(),
        qrCodeBase64: generateMockQRCodeBase64(),
        copyPasteCode: generateMockPixCode(),
        expiresAt: expiresAt.toISOString(),
        amount: body.amount
      }
    }
    
    // Em produção: salvar payment no banco
    // await supabase.from('payments').insert({
    //   id: paymentId,
    //   order_id: body.orderId,
    //   method: 'pix',
    //   amount: body.amount,
    //   status: 'pending',
    //   expires_at: expiresAt.toISOString()
    // })
    
    return NextResponse.json(response, { status: 200 })
    
  } catch (error) {
    console.error('Erro ao gerar Pix:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar pagamento Pix. Tente novamente.' },
      { status: 500 }
    )
  }
}

// GET para verificar status do pagamento Pix
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
    // return NextResponse.json({
    //   success: true,
    //   status: payment.status,
    //   paid: payment.status === 'approved'
    // })
    
    // Mock: simula pagamento aprovado após 10 segundos
    // Para testar, usar timestamp no paymentId
    const timestamp = parseInt(paymentId.split('_')[1] || '0')
    const elapsed = Date.now() - timestamp
    const isPaid = elapsed > 10000 // Simula aprovação após 10s
    
    return NextResponse.json({
      success: true,
      paymentId,
      status: isPaid ? 'approved' : 'pending',
      paid: isPaid
    })
    
  } catch (error) {
    console.error('Erro ao verificar status Pix:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao verificar pagamento' },
      { status: 500 }
    )
  }
}
