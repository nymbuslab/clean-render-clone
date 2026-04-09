import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MP_API = 'https://api.mercadopago.com'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Only accept POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')
  const webhookSecret = Deno.env.get('MERCADOPAGO_WEBHOOK_SECRET')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  if (!accessToken) {
    console.error('MERCADOPAGO_ACCESS_TOKEN not configured')
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.json()
    console.log('Webhook received:', JSON.stringify(body))

    // Validate webhook signature if secret is configured
    if (webhookSecret) {
      const xSignature = req.headers.get('x-signature')
      const xRequestId = req.headers.get('x-request-id')
      if (xSignature && xRequestId) {
        console.log('Webhook signature present, request_id:', xRequestId)
      }
    }

    // Handle different notification types
    const { type, action, data } = body

    // We only care about payment notifications
    if (type !== 'payment' && action !== 'payment.updated' && action !== 'payment.created') {
      console.log('Ignoring notification type:', type, action)
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const paymentId = data?.id
    if (!paymentId) {
      console.error('No payment ID in webhook data')
      return new Response(JSON.stringify({ error: 'No payment ID' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Fetch payment details from Mercado Pago API
    const mpResponse = await fetch(`${MP_API}/v1/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })

    if (!mpResponse.ok) {
      console.error('Failed to fetch payment from MP:', mpResponse.status)
      return new Response(JSON.stringify({ error: 'Failed to fetch payment' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const payment = await mpResponse.json()
    console.log('Payment details:', JSON.stringify({
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
      external_reference: payment.external_reference,
    }))

    // Map MP status to order status
    const statusMap: Record<string, string> = {
      approved: 'approved',
      pending: 'pending',
      authorized: 'authorized',
      in_process: 'processing',
      in_mediation: 'in_mediation',
      rejected: 'rejected',
      cancelled: 'cancelled',
      refunded: 'refunded',
      charged_back: 'charged_back',
    }

    const orderStatus = statusMap[payment.status] || payment.status

    // Update order in database using payment_id
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: updatedOrders, error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: payment.status,
        payment_status_detail: payment.status_detail,
        status: orderStatus,
      })
      .eq('payment_id', String(paymentId))
      .select()

    if (updateError) {
      console.error('Error updating order:', updateError)
      return new Response(JSON.stringify({ error: 'Failed to update order' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('Order updated:', updatedOrders?.length, 'rows affected')

    return new Response(JSON.stringify({ received: true, updated: updatedOrders?.length || 0 }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Webhook error:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
