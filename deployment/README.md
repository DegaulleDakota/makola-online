# Makola Online Deployment Guide

## DigitalOcean App Platform Deployment

### Prerequisites
1. DigitalOcean account with App Platform access
2. GitHub repository connected
3. Domain DNS configured

### Deployment Steps

#### 1. Create Production App
```bash
doctl apps create --spec .do/app.yaml
```

#### 2. Create Staging App
```bash
doctl apps create --spec deployment/staging.yaml
```

#### 3. Configure Environment Variables
Production:
- ADMIN_SUPER_EMAIL=dukesnr@yahoo.co.uk
- ADMIN_WHATSAPP_NUMBER=0558271127
- APP_BASE_URL=https://makolaonline.com
- VITE_ADMIN_PASSWORD=Makola2025!
- MTN_MOMO_API_KEY=[live_key]
- VODAFONE_MOMO_API_KEY=[live_key]
- AIRTELTIGO_MOMO_API_KEY=[live_key]

#### 4. DNS Configuration
- Point makolaonline.com A record to DigitalOcean App Platform IP
- Configure www.makolaonline.com CNAME to makolaonline.com
- Point staging.makolaonline.com to staging app

#### 5. SSL/HTTPS
- Automatic SSL certificates enabled via App Platform
- HTTPS redirect enforced

#### 6. Webhook Endpoints
Production: https://makolaonline.com/api/webhooks/momo
Staging: https://staging.makolaonline.com/api/webhooks/momo

#### 7. Monitoring URLs
- https://makolaonline.com/health
- https://makolaonline.com/admin/login
- https://makolaonline.com/seller
- https://makolaonline.com/rider

### Rollback Procedure
```bash
doctl apps create-deployment [app-id] --archive-url [previous-build-url]
```