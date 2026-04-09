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

  const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')
  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'MERCADOPAGO_ACCESS_TOKEN not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  try {
    const body = await req.json()
    const { payment_method, items, payer, transaction_amount, installments, token, issuer_id, payment_method_id, order_data } = body

    if (!payment_method || !payer || !transaction_amount) {
      return new Response(JSON.stringify({ error: 'Missing required fields: payment_method, payer, transaction_amount' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create order in database first
    const supabase = createClient(supabaseUrl, supabaseKey)
    const orderPayload = {
      payment_method,
      total: transaction_amount,
      subtotal: order_data?.subtotal || transaction_amount,
      shipping: order_data?.shipping || 0,
      discount: order_data?.discount || 0,
      items: items || [],
      payer,
      status: 'pending',
      payment_status: 'pending',
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return new Response(JSON.stringify({ error: 'Failed to create order' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let paymentBody: Record<string, unknown>

    if (payment_method === 'pix') {
      paymentBody = {
        transaction_amount,
        payment_method_id: 'pix',
        payer: {
          email: payer.email,
          first_name: payer.first_name,
          last_name: payer.last_name,
          identification: payer.identification,
        },
        description: items?.map((i: { name: string }) => i.name).join(', ') || 'Compra na loja',
        external_reference: order.id,
        notification_url: `${supabaseUrl}/functions/v1/mercadopago-webhook`,
      }
    } else if (payment_method === 'credit_card') {
      if (!token) {
        return new Response(JSON.stringify({ error: 'Card token is required for credit card payments' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      paymentBody = {
        transaction_amount,
        token,
        installments: installments || 1,
        issuer_id,
        payment_method_id,
        payer: {
          email: payer.email,
          identification: payer.identification,
        },
        description: items?.map((i: { name: string }) => i.name).join(', ') || 'Compra na loja',
        external_reference: order.id,
        notification_url: `${supabaseUrl}/functions/v1/mercadopago-webhook`,
      }
    } else {
      return new Response(JSON.stringify({ error: 'Invalid payment method. Use "pix" or "credit_card"' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const response = await fetch(`${MP_API}/v1/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify(paymentBody),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Mercado Pago API error:', JSON.stringify(data))
      // Update order with failure
      await supabase.from('orders').update({
        status: 'failed',
        payment_status: 'error',
        payment_status_detail: data.message || data.cause?.[0]?.description || 'Unknown error',
      }).eq('id', order.id)

      return new Response(JSON.stringify({
        error: 'Payment creation failed',
        details: data.message || data.cause?.[0]?.description || 'Unknown error',
        status_code: response.status,
        order_id: order.id,
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Update order with payment info
    const updateData: Record<string, unknown> = {
      payment_id: String(data.id),
      payment_status: data.status,
      payment_status_detail: data.status_detail,
      status: data.status === 'approved' ? 'approved' : 'pending',
    }

    if (payment_method === 'pix') {
      const txData = data.point_of_interaction?.transaction_data
      updateData.pix_data = {
        qr_code: txData?.qr_code,
        qr_code_base64: txData?.qr_code_base64,
        ticket_url: txData?.ticket_url,
      }
    }

    await supabase.from('orders').update(updateData).eq('id', order.id)

    // Build response
    const result: Record<string, unknown> = {
      id: data.id,
      order_id: order.id,
      status: data.status,
      status_detail: data.status_detail,
      payment_method,
    }

    if (payment_method === 'pix') {
      const txData = data.point_of_interaction?.transaction_data
      result.pix = {
        qr_code: txData?.qr_code,
        qr_code_base64: txData?.qr_code_base64,
        ticket_url: txData?.ticket_url,
      }
      result.date_of_expiration = data.date_of_expiration
    }

    if (payment_method === 'credit_card') {
      result.installments = data.installments
      result.transaction_amount = data.transaction_amount
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Edge function error:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
