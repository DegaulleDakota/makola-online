// Environment configuration and validation
export const config = {
  // Core App
  adminSuperEmail: import.meta.env.ADMIN_SUPER_EMAIL || 'dukesnr@yahoo.co.uk',
  adminWhatsAppNumber: import.meta.env.ADMIN_WHATSAPP_NUMBER || '0558271127',
  appBaseUrl: import.meta.env.APP_BASE_URL || 'http://localhost:5173',
  
  // Authentication & Security
  adminPassword: import.meta.env.VITE_ADMIN_PASSWORD || 'Makola2025!',
  otpDigits: parseInt(import.meta.env.OTP_DIGITS || '6'),
  otpValidityMinutes: parseInt(import.meta.env.OTP_VALIDITY_MINUTES || '10'),
  otpMaxAttempts: parseInt(import.meta.env.OTP_MAX_ATTEMPTS || '5'),
  
  // Mobile Money
  platformCommissionPercent: parseFloat(import.meta.env.PLATFORM_COMMISSION_PERCENT || '10'),
  minimumPayoutAmount: parseFloat(import.meta.env.MINIMUM_PAYOUT_AMOUNT || '50'),
  
  // Feature Flags
  softLaunchMode: import.meta.env.SOFT_LAUNCH_MODE === 'true',
  maintenanceMode: import.meta.env.MAINTENANCE_MODE === 'true',
  enableRiderRegistration: import.meta.env.ENABLE_RIDER_REGISTRATION !== 'false',
  enableSellerRegistration: import.meta.env.ENABLE_SELLER_REGISTRATION !== 'false',
  
  // Supabase
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  
  // Environment detection
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isStaging: import.meta.env.APP_BASE_URL?.includes('staging') || false,
};

// Validate required environment variables
export function validateEnvironment(): { isValid: boolean; missing: string[] } {
  const required = [
    'ADMIN_SUPER_EMAIL',
    'ADMIN_WHATSAPP_NUMBER', 
    'APP_BASE_URL',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  const missing = required.filter(key => !import.meta.env[key]);
  
  return {
    isValid: missing.length === 0,
    missing
  };
}

export default config;