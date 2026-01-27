import { NextRequest, NextResponse } from 'next/server'

// =============================================================================
// TIPOS
// =============================================================================

interface OrderItem {
  productId: string
  variantId?: string
  name: string
  variant?: string
  quantity: number
  price: number
  image?: string
}

interface CreateOrderRequest {
  customer: {
    name: string
    email: string
    cpf: string
    phone: string
  }
  shipping: {
    cep: string
    address: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    fee: number
    estimatedDays: { min: number; max: number }
  }
  items: OrderItem[]
  subtotal: number
  pixDiscount: number
  shippingFee: number
  total: number
  paymentMethod: 'pix' | 'card'
  installments?: number
}

interface Order extends CreateOrderRequest {
  id: string
  orderNumber: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'approved' | 'rejected' | 'refunded'
  paymentId?: string
  createdAt: string
  updatedAt: string
}

// =============================================================================
// MOCK DATABASE (Em produção, usar Supabase)
// =============================================================================

const ordersDb: Map<string, Order> = new Map()

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const sequence = Math.floor(Math.random() * 99999).toString().padStart(5, '0')
  return `MOV-${year}-${sequence}`
}

function generateOrderId(): string {
  return `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function validateOrder(data: CreateOrderRequest): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Customer validation
  if (!data.customer?.name?.trim()) errors.push('Nome é obrigatório')
  if (!data.customer?.email?.includes('@')) errors.push('Email inválido')
  if (!data.customer?.cpf || data.customer.cpf.replace(/\D/g, '').length !== 11) errors.push('CPF inválido')
  if (!data.customer?.phone?.replace(/\D/g, '').length) errors.push('Telefone é obrigatório')
  
  // Shipping validation
  if (!data.shipping?.cep) errors.push('CEP é obrigatório')
  if (!data.shipping?.address) errors.push('Endereço é obrigatório')
  if (!data.shipping?.number) errors.push('Número é obrigatório')
  if (!data.shipping?.neighborhood) errors.push('Bairro é obrigatório')
  if (!data.shipping?.city) errors.push('Cidade é obrigatória')
  
  // Items validation
  if (!data.items?.length) errors.push('Carrinho vazio')
  if (data.items?.length > 5) errors.push('Máximo 5 produtos por pedido')
  
  // Price validation
  if (data.total <= 0) errors.push('Total inválido')
  
  return { valid: errors.length === 0, errors }
}

// =============================================================================
// API ROUTES
// =============================================================================

// POST - Criar pedido
export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json()
    
    // Validar dados
    const validation = validateOrder(body)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      )
    }
    
    // Criar pedido
    const orderId = generateOrderId()
    const orderNumber = generateOrderNumber()
    const now = new Date().toISOString()
    
    const order: Order = {
      ...body,
      id: orderId,
      orderNumber,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: now,
      updatedAt: now
    }
    
    // Em produção: salvar no Supabase
    // await supabase.from('orders').insert(order)
    
    // Mock: salvar em memória
    ordersDb.set(orderId, order)
    
    console.log(`[Orders] Created order ${orderNumber} (${orderId})`)
    
    return NextResponse.json({
      success: true,
      data: {
        id: orderId,
        orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.total,
        createdAt: order.createdAt
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('[Orders] Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao criar pedido. Tente novamente.' },
      { status: 500 }
    )
  }
}

// GET - Buscar pedido(s)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    const orderNumber = searchParams.get('number')
    const email = searchParams.get('email')
    
    // Buscar por ID
    if (orderId) {
      // Em produção: buscar no Supabase
      // const { data } = await supabase.from('orders').select('*').eq('id', orderId).single()
      
      const order = ordersDb.get(orderId)
      
      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Pedido não encontrado' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ success: true, data: order })
    }
    
    // Buscar por número do pedido
    if (orderNumber) {
      // Em produção: buscar no Supabase
      const order = Array.from(ordersDb.values()).find(o => o.orderNumber === orderNumber)
      
      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Pedido não encontrado' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ success: true, data: order })
    }
    
    // Buscar por email
    if (email) {
      // Em produção: buscar no Supabase com paginação
      const orders = Array.from(ordersDb.values())
        .filter(o => o.customer.email === email)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      return NextResponse.json({ success: true, data: orders })
    }
    
    return NextResponse.json(
      { success: false, error: 'Parâmetro de busca é obrigatório (id, number ou email)' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('[Orders] Error fetching order:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar pedido' },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar pedido (status, pagamento, etc)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, ...updates } = body
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'orderId é obrigatório' },
        { status: 400 }
      )
    }
    
    // Em produção: atualizar no Supabase
    // await supabase.from('orders').update(updates).eq('id', orderId)
    
    const order = ordersDb.get(orderId)
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Pedido não encontrado' },
        { status: 404 }
      )
    }
    
    // Atualizar campos permitidos
    const allowedUpdates = ['status', 'paymentStatus', 'paymentId']
    const updatedOrder = { ...order }
    
    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        (updatedOrder as any)[key] = updates[key]
      }
    }
    
    updatedOrder.updatedAt = new Date().toISOString()
    ordersDb.set(orderId, updatedOrder)
    
    console.log(`[Orders] Updated order ${order.orderNumber}:`, updates)
    
    return NextResponse.json({ success: true, data: updatedOrder })
    
  } catch (error) {
    console.error('[Orders] Error updating order:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar pedido' },
      { status: 500 }
    )
  }
}
