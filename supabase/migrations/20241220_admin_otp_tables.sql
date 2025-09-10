-- Create admin OTP codes table
CREATE TABLE IF NOT EXISTS admin_otp_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  purpose TEXT NOT NULL CHECK (purpose IN ('login', 'password_reset')),
  admin_email TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER DEFAULT 0,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add admin WhatsApp OTP setting to admin_settings
-- Add admin WhatsApp OTP setting to admin_settings
ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS admin_whatsapp_otp TEXT DEFAULT '0558271127';

-- Add password reset required field to admins table
ALTER TABLE admins ADD COLUMN IF NOT EXISTS password_reset_required BOOLEAN DEFAULT FALSE;

-- Update existing super admin to not require password reset
UPDATE admins SET password_reset_required = FALSE WHERE email = 'dukesnr@yahoo.co.uk';

-- Insert default admin if not exists and set all new admins to require password reset
INSERT INTO admins (email, role, password_hash, password_reset_required) 
VALUES ('dukesnr@yahoo.co.uk', 'super_admin', '$2b$10$encrypted_hash_for_Makola2025!', FALSE)
ON CONFLICT (email) DO UPDATE SET password_reset_required = FALSE WHERE admins.email = 'dukesnr@yahoo.co.uk';

-- Set all other admins to require password reset
UPDATE admins SET password_reset_required = TRUE WHERE email != 'dukesnr@yahoo.co.uk';

-- Create index for OTP lookup
CREATE INDEX IF NOT EXISTS idx_admin_otp_lookup ON admin_otp_codes(phone_number, purpose, admin_email, expires_at);