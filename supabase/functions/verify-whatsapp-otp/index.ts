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
    const { phone, otp, purpose, admin_email } = await req.json()
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Find valid OTP
    const { data: otpRecord, error: otpError } = await supabaseClient
      .from('admin_otp_codes')
      .select('*')
      .eq('phone_number', phone)
      .eq('otp_code', otp)
      .eq('purpose', purpose)
      .eq('admin_email', admin_email)
      .gt('expires_at', new Date().toISOString())
      .lt('attempts', 5)
      .single()

    if (otpError || !otpRecord) {
      // Increment attempts if record exists
      await supabaseClient
        .from('admin_otp_codes')
        .update({ attempts: supabaseClient.rpc('increment_attempts') })
        .eq('phone_number', phone)
        .eq('purpose', purpose)
        .eq('admin_email', admin_email)
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid or expired OTP' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Mark OTP as used
    await supabaseClient
      .from('admin_otp_codes')
      .update({ 
        used_at: new Date().toISOString(),
        attempts: otpRecord.attempts + 1
      })
      .eq('id', otpRecord.id)

    // Log successful verification
    await supabaseClient
      .from('admin_audit_log')
      .insert({
        admin_email,
        action: `otp_verified_${purpose}`,
        meta: { phone_number: phone }
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP verified successfully' 
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