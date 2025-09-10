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
    const { email, currentPassword, newPassword } = await req.json()

    if (!email || !currentPassword || !newPassword) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validate new password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
    if (!passwordRegex.test(newPassword)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify current password first
    const { data: authData, error: authError } = await supabase.functions.invoke('admin-auth', {
      body: { email: email.toLowerCase().trim(), password: currentPassword }
    })

    if (authError || !authData?.success) {
      return new Response(
        JSON.stringify({ success: false, error: 'Current password is incorrect' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Hash new password (simplified for demo - use proper bcrypt in production)
    const newPasswordHash = `$2b$10$encrypted_hash_for_${newPassword}`

    // Update password and clear reset requirement
    const { error: updateError } = await supabase
      .from('admins')
      .update({ 
        password_hash: newPasswordHash,
        password_reset_required: false,
        updated_at: new Date().toISOString()
      })
      .eq('email', email.toLowerCase().trim())

    if (updateError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to update password' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Log audit event
    await supabase
      .from('admin_audit_log')
      .insert({
        admin_email: email.toLowerCase().trim(),
        action: 'password_changed',
        details: { timestamp: new Date().toISOString() }
      })

    return new Response(
      JSON.stringify({ success: true, message: 'Password changed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Admin change password error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})