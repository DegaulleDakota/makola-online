import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone, purpose, admin_email } = await req.json()
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Store OTP in database with 10-minute expiry
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    
    await supabaseClient
      .from('admin_otp_codes')
      .insert({
        phone_number: phone,
        otp_code: otp,
        purpose,
        admin_email,
        expires_at: expiresAt,
        attempts: 0
      })

    // In production, integrate with WhatsApp Business API
    // For now, log the OTP (remove in production)
    console.log(`WhatsApp OTP for ${phone}: ${otp}`)
    
    // Mock WhatsApp message sending
    const message = `Makola Online Admin OTP: ${otp}\n\nThis code expires in 10 minutes. Do not share with anyone.`
    
    // Here you would integrate with WhatsApp Business API
    // await sendWhatsAppMessage(phone, message)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        // Remove in production - only for testing
        otp_code: otp 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})