# Manual Deployment Steps for Makola Online

## Important Note
As an AI assistant, I cannot directly deploy to DigitalOcean. Please follow these manual steps:

## 1. DigitalOcean Setup

### Create New App
1. Go to DigitalOcean Apps dashboard
2. Click "Create App"
3. Connect your GitHub repository
4. Select branch: `main` for production, `staging` for staging

### Build Settings
- **Runtime**: Node 18
- **Build Command**: `npm run build`
- **Run Command**: `npm run preview` (NOT npm start)
- **Output Directory**: `dist`

## 2. Environment Variables

### Production Environment
Copy these exactly:
```
NODE_ENV=production
ADMIN_SUPER_EMAIL=dukesnr@yahoo.co.uk
ADMIN_WHATSAPP_NUMBER=0558271127
APP_BASE_URL=https://makolaonline.com
VITE_ADMIN_PASSWORD=Makola2025!
PLATFORM_COMMISSION_PERCENT=10
MINIMUM_PAYOUT_AMOUNT=20
VODAFONE_MOMO_API_KEY=[your_vodafone_key]
VODAFONE_MOMO_SECRET=[your_vodafone_secret]
VODAFONE_MOMO_WEBHOOK_SECRET=[your_webhook_secret]
```

### Staging Environment
```
NODE_ENV=staging
ADMIN_SUPER_EMAIL=dukesnr@yahoo.co.uk
ADMIN_WHATSAPP_NUMBER=0558271127
APP_BASE_URL=https://staging.makolaonline.com
VITE_ADMIN_PASSWORD=Makola2025!
PLATFORM_COMMISSION_PERCENT=5
MINIMUM_PAYOUT_AMOUNT=10
VODAFONE_MOMO_API_KEY=test_vodafone_key
```

## 3. Domain Configuration

### If domains are ready:
- Production: `makolaonline.com` (primary)
- Staging: `staging.makolaonline.com`
- Enable SSL/TLS certificates
- Set up www → root redirect

### If domains not ready:
- Use temporary DigitalOcean URLs
- Note the URLs provided after deployment

## 4. Cron Jobs Setup
Configure these in DigitalOcean:
- Daily reminders: `0 6 * * *` (06:00 Africa/Accra)
- Hourly cleanup: `0 * * * *`

## 5. After Deployment

### Test These URLs:
- `/` - Homepage
- `/health` - Health check
- `/admin/login` - Admin login
- `/seller` - Seller dashboard
- `/rider` - Rider dashboard
- `/sitemap.xml` - SEO sitemap

### Run Prelaunch Check:
1. Go to `/admin/prelaunch`
2. Ensure all items are green
3. Test Vodafone MoMo webhook
4. Verify WhatsApp OTP works

## 6. What to Report Back:
- ✅ Production URL: https://makolaonline.com (or temp URL)
- ✅ Staging URL: https://staging.makolaonline.com (or temp URL)
- ✅ SSL status (if custom domains connected)
- ✅ Cron jobs status
- ✅ Vodafone webhook test result
- ✅ Rollback procedure confirmation

## 7. Security Notes:
- Rate limiting active on /admin/login
- HTTPS enforced (if custom domains)
- Staging robots.txt blocks crawlers
- Production allows SEO indexing