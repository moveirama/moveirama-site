import { NextRequest, NextResponse } from 'next/server'

// =============================================================================
// TIPOS - Mercado Pago Webhook
// =============================================================================

interface MercadoPagoWebhook {
  id: number
  live_mode: boolean
  type: 'payment' | 'plan' | 'subscription' | 'invoice' | 'point_integration_wh'
  date_created: string
  user_id: string
  api_version: string
  action: string
  data: {
    id: string
  }
}

interface PaymentDetails {
  id: string
  status: 'pending' | 'approved' | 'authorized' | 'in_process' | 'in_mediation' | 'rejected' | 'cancelled' | 'refunded' | 'charged_back'
  status_detail: string
  external_reference: string // orderId
  transaction_amount: number
  payment_method_id: string
  payment_type_id: string
  date_approved: string | null
  payer: {
    email: string
    identification: {
      type: string
      number: string
    }
  }
}

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

async function getPaymentDetails(paymentId: string): Promise<PaymentDetails | null> {
  // Em produção: consultar Mercado Pago
  // const mp = new MercadoPago({ accessToken: process.env.MP_ACCESS_TOKEN })
  // return await mp.payment.get(paymentId)
  
  // Mock - retorna aprovado para qualquer ID
  return {
    id: paymentId,
    status: 'approved',
    status_detail: 'accredited',
    external_reference: 'order_123',
    transaction_amount: 100,
    payment_method_id: 'pix',
    payment_type_id: 'bank_transfer',
    date_approved: new Date().toISOString(),
    payer: {
      email: 'test@test.com',
      identification: { type: 'CPF', number: '12345678900' }
    }
  }
}

async function updateOrderStatus(orderId: string, paymentStatus: string, paymentDetails: PaymentDetails) {
  // Em produção: atualizar no Supabase
  // await supabase.from('orders').update({
  //   payment_status: paymentStatus,
  //   payment_id: paymentDetails.id,
  //   payment_method: paymentDetails.payment_method_id,
  //   paid_at: paymentStatus === 'approved' ? paymentDetails.date_approved : null,
  //   updated_at: new Date().toISOString()
  // }).eq('id', orderId)
  
  console.log(`[Webhook] Order ${orderId} updated to status: ${paymentStatus}`)
}

async function sendConfirmationEmail(orderId: string, paymentDetails: PaymentDetails) {
  // Em produção: enviar email via serviço (Resend, SendGrid, etc)
  // await resend.emails.send({
  //   from: 'Moveirama <pedidos@moveirama.com.br>',
  //   to: paymentDetails.payer.email,
  //   subject: `Pedido ${orderId} confirmado!`,
  //   template: 'order-confirmation',
  //   data: { orderId, paymentDetails }
  // })
  
  console.log(`[Webhook] Confirmation email sent for order ${orderId}`)
}

async function notifyWhatsApp(orderId: string, paymentDetails: PaymentDetails) {
  // Em produção: notificar via API do WhatsApp Business
  console.log(`[Webhook] WhatsApp notification for order ${orderId}`)
}

// =============================================================================
// WEBHOOK HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    // Verificar header de assinatura (em produção)
    // const signature = request.headers.get('x-signature')
    // if (!verifyMercadoPagoSignature(signature, body)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    // }
    
    const body: MercadoPagoWebhook = await request.json()
    
    console.log('[Webhook] Received:', JSON.stringify(body, null, 2))
    
    // Só processar notificações de pagamento
    if (body.type !== 'payment') {
      return NextResponse.json({ received: true, processed: false, reason: 'Not a payment notification' })
    }
    
    const paymentId = body.data.id
    
    // Buscar detalhes do pagamento
    const paymentDetails = await getPaymentDetails(paymentId)
    
    if (!paymentDetails) {
      console.error(`[Webhook] Payment not found: ${paymentId}`)
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }
    
    const orderId = paymentDetails.external_reference
    
    if (!orderId) {
      console.error(`[Webhook] No order reference in payment: ${paymentId}`)
      return NextResponse.json({ error: 'No order reference' }, { status: 400 })
    }
    
    // Atualizar status do pedido
    await updateOrderStatus(orderId, paymentDetails.status, paymentDetails)
    
    // Se pagamento aprovado, enviar notificações
    if (paymentDetails.status === 'approved') {
      await Promise.all([
        sendConfirmationEmail(orderId, paymentDetails),
        notifyWhatsApp(orderId, paymentDetails)
      ])
    }
    
    return NextResponse.json({
      received: true,
      processed: true,
      orderId,
      paymentId,
      status: paymentDetails.status
    })
    
  } catch (error) {
    console.error('[Webhook] Error:', error)
    
    // Retornar 200 mesmo em caso de erro para evitar retentativas infinitas
    // O ideal é logar o erro e investigar manualmente
    return NextResponse.json({
      received: true,
      processed: false,
      error: 'Internal error'
    }, { status: 200 })
  }
}

// GET para teste/health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Moveirama Payment Webhook',
    timestamp: new Date().toISOString()
  })
}
