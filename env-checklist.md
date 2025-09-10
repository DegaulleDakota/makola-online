# 📋 Makola Online — Environment Variables Checklist

## ✅ STAGING ENVIRONMENT (staging.makolaonline.com)

### 1. Core App
- [ ] `ADMIN_SUPER_EMAIL` = `dukesnr@yahoo.co.uk`
- [ ] `ADMIN_WHATSAPP_NUMBER` = `0558271127`
- [ ] `APP_BASE_URL` = `https://staging.makolaonline.com`

### 2. Authentication & Security
- [ ] `VITE_ADMIN_PASSWORD` = `Makola2025!`
- [ ] `OTP_DIGITS` = `6`
- [ ] `OTP_VALIDITY_MINUTES` = `10`
- [ ] `OTP_MAX_ATTEMPTS` = `5`

### 3. Mobile Money (TEST KEYS)
- [ ] `MTN_MOMO_ENVIRONMENT` = `sandbox`
- [ ] `VODAFONE_ENVIRONMENT` = `sandbox`
- [ ] `AIRTELTIGO_ENVIRONMENT` = `sandbox`
- [ ] `PLATFORM_COMMISSION_PERCENT` = `10`
- [ ] `MINIMUM_PAYOUT_AMOUNT` = `50`

### 4. Feature Flags
- [ ] `SOFT_LAUNCH_MODE` = `true`
- [ ] `MAINTENANCE_MODE` = `false`

---

## ✅ PRODUCTION ENVIRONMENT (makolaonline.com)

### 1. Core App
- [ ] `ADMIN_SUPER_EMAIL` = `dukesnr@yahoo.co.uk`
- [ ] `ADMIN_WHATSAPP_NUMBER` = `0558271127`
- [ ] `APP_BASE_URL` = `https://makolaonline.com`

### 2. Authentication & Security
- [ ] `VITE_ADMIN_PASSWORD` = `Makola2025!`
- [ ] `OTP_DIGITS` = `6`
- [ ] `OTP_VALIDITY_MINUTES` = `10`
- [ ] `OTP_MAX_ATTEMPTS` = `5`

### 3. Mobile Money (LIVE KEYS)
- [ ] `MTN_MOMO_ENVIRONMENT` = `live`
- [ ] `VODAFONE_ENVIRONMENT` = `live`
- [ ] `AIRTELTIGO_ENVIRONMENT` = `live`
- [ ] `PLATFORM_COMMISSION_PERCENT` = `10`
- [ ] `MINIMUM_PAYOUT_AMOUNT` = `50`

### 4. Feature Flags
- [ ] `SOFT_LAUNCH_MODE` = `false` (or `true` for controlled launch)
- [ ] `MAINTENANCE_MODE` = `false`

---

## 🔍 VERIFICATION STEPS

### Environment Variable Validation
1. Check `/health` endpoint shows all required env vars as "OK"
2. Admin login works with super admin credentials
3. OTP system enforces 6-digit, 10-minute validity, 5-attempt limit
4. MoMo test transactions work on staging
5. Cron jobs are scheduled and running

### SEO & Branding Final Check
- [ ] `robots.txt` blocks staging, allows production
- [ ] `sitemap.xml` accessible and current
- [ ] Open Graph meta tags working
- [ ] Favicon and manifest icons loading
- [ ] SSL certificates active on both domains

### Post-Deploy Testing
- [ ] Super admin can login at `/admin`
- [ ] Seller registration → WhatsApp upload → product publish flow
- [ ] Rider registration → job acceptance flow
- [ ] MoMo webhook processing (test payment)
- [ ] Analytics tracking active
- [ ] Error pages show Makola branding