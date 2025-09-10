# 📦 Makola Online Deployment Checklist

## ⚠️ Important Notice
This checklist is prepared by an AI assistant. **Manual deployment is required** as AI cannot access hosting services, domains, or payment providers.

## Pre-Deployment Requirements

### 1. Domain & DNS Setup
- [ ] Purchase makolaonline.com domain
- [ ] Configure DNS A records to hosting provider
- [ ] Set up www.makolaonline.com → makolaonline.com redirect
- [ ] Configure staging.makolaonline.com subdomain
- [ ] Verify DNS propagation

### 2. DigitalOcean App Platform Setup
- [ ] Create DigitalOcean account
- [ ] Connect GitHub repository
- [ ] Use deployment/production.yaml configuration
- [ ] Set up staging environment with deployment/staging.yaml
- [ ] Configure environment variables

### 3. Environment Variables (Production)
```
ADMIN_SUPER_EMAIL=dukesnr@yahoo.co.uk
ADMIN_WHATSAPP_NUMBER=0558271127
APP_BASE_URL=https://makolaonline.com
VITE_ADMIN_PASSWORD=Makola2025!
PLATFORM_COMMISSION_PERCENT=10
MINIMUM_PAYOUT_AMOUNT=20
VODAFONE_MOMO_API_KEY=[ENTER_KEY]
VODAFONE_MOMO_SECRET=[ENTER_SECRET]
VODAFONE_MOMO_WEBHOOK_SECRET=[ENTER_WEBHOOK_SECRET]
```

### 4. SSL & Security
- [ ] Enable automatic SSL certificates
- [ ] Force HTTPS redirect
- [ ] Configure security headers
- [ ] Set up rate limiting on sensitive endpoints

## Deployment Steps

### 1. Initial Deployment
- [ ] Deploy to staging first
- [ ] Run webhook tests: `node scripts/webhook-test.js`
- [ ] Verify health endpoint: `/health`
- [ ] Test all critical flows

### 2. Production Deployment
- [ ] Deploy production environment
- [ ] Configure domains and SSL
- [ ] Set up cron jobs (daily 06:00 Africa/Accra + hourly)
- [ ] Test payment webhooks

### 3. Post-Deployment Verification
- [ ] Access https://makolaonline.com
- [ ] Test admin login at /admin/login
- [ ] Verify WhatsApp OTP functionality
- [ ] Test seller onboarding flow
- [ ] Test rider registration
- [ ] Verify MoMo payment integration

## Monitoring Setup

### 1. Uptime Monitoring
Monitor these endpoints:
- [ ] https://makolaonline.com/
- [ ] https://makolaonline.com/health
- [ ] https://makolaonline.com/admin/login
- [ ] https://makolaonline.com/seller
- [ ] https://makolaonline.com/rider
- [ ] https://makolaonline.com/sitemap.xml

### 2. Cron Job Monitoring
- [ ] Daily reminders (06:00 Africa/Accra)
- [ ] Hourly cleanup jobs
- [ ] Set up failure alerts

## Final Deliverables

### URLs
- [ ] Production: https://makolaonline.com
- [ ] Staging: https://staging.makolaonline.com
- [ ] Admin: https://makolaonline.com/admin/login

### Testing Proof
- [ ] Screenshot of successful health checks
- [ ] MoMo webhook test results
- [ ] Cron job execution logs
- [ ] SSL certificate verification

### Rollback Plan
- [ ] Document rollback procedure
- [ ] Keep 3 previous builds available
- [ ] Test rollback process

## Support Information
- Admin Email: dukesnr@yahoo.co.uk
- WhatsApp: 0558271127
- Fallback Password: Makola2025!