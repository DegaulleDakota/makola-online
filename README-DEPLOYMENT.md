# Makola Online - Production Deployment Guide

## 🚀 Quick Deployment Checklist

### 1. Domain & DNS Setup
- **Primary Domain**: `makolaonline.com`
- **Staging Domain**: `staging.makolaonline.com`
- Configure DNS A/AAAA records to hosting provider
- Set up `www.makolaonline.com` → `makolaonline.com` redirect
- Enable automatic SSL certificates
- Force HTTPS redirect for all traffic

### 2. Environment Configuration
#### Production Environment Variables
```bash
# Core Settings
APP_BASE_URL=https://makolaonline.com
ADMIN_SUPER_EMAIL=dukesnr@yahoo.co.uk
ADMIN_WHATSAPP_NUMBER=0558271127

# Security & Authentication
VITE_ADMIN_PASSWORD=Makola2025!
OTP_DIGITS=6
OTP_VALIDITY_MINUTES=10
OTP_MAX_ATTEMPTS=5

# Mobile Money (LIVE KEYS)
MTN_MOMO_ENVIRONMENT=live
VODAFONE_ENVIRONMENT=live
AIRTELTIGO_ENVIRONMENT=live
PLATFORM_COMMISSION_PERCENT=10
MINIMUM_PAYOUT_AMOUNT=50

# Feature Flags
SOFT_LAUNCH_MODE=false
MAINTENANCE_MODE=false
ENABLE_RIDER_REGISTRATION=true
ENABLE_SELLER_REGISTRATION=true
```

#### Staging Environment Variables
```bash
# Core Settings
APP_BASE_URL=https://staging.makolaonline.com
ADMIN_SUPER_EMAIL=dukesnr@yahoo.co.uk
ADMIN_WHATSAPP_NUMBER=0558271127

# Security & Authentication
VITE_ADMIN_PASSWORD=Makola2025!
OTP_DIGITS=6
OTP_VALIDITY_MINUTES=10
OTP_MAX_ATTEMPTS=5

# Mobile Money (TEST KEYS)
MTN_MOMO_ENVIRONMENT=sandbox
VODAFONE_ENVIRONMENT=sandbox
AIRTELTIGO_ENVIRONMENT=sandbox
PLATFORM_COMMISSION_PERCENT=10
MINIMUM_PAYOUT_AMOUNT=50

# Feature Flags
SOFT_LAUNCH_MODE=true
MAINTENANCE_MODE=false
```

### 3. Build Configuration

#### Static Asset Optimization
- Enable CDN for static assets (JS/CSS/images)
- Set cache headers:
  - Static assets: `max-age=31536000` (1 year) with content hashing
  - HTML files: `no-store` or `max-age=300` (5 minutes)
- Enable gzip/brotli compression

#### SPA Routing
- Configure clean URLs (remove `.html`)
- Set up fallback to `index.html` for client-side routing
- Ensure `/admin/*` routes are protected

### 4. Security Headers

Add these headers to all responses:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
```

### 5. Background Jobs Setup

Configure cron jobs for:
```bash
# Daily at 06:00 Africa/Accra
0 6 * * * curl -X POST https://[supabase-url]/functions/v1/daily-notification-sweep

# Hourly cleanup (optional)
0 * * * * curl -X POST https://[supabase-url]/functions/v1/cleanup-stale-jobs
```

#### Uptime Monitoring URLs
- `https://makolaonline.com/` (Homepage)
- `https://makolaonline.com/health` (Environment validation)
- `https://makolaonline.com/admin/login` (Admin access)
- `https://makolaonline.com/sell` (Seller onboarding)
- `https://makolaonline.com/rider/register` (Rider registration)
- `https://makolaonline.com/sitemap.xml` (SEO)
- `https://staging.makolaonline.com/health` (Staging health check)

#### Error Tracking
- Enable server error logs with 30-90 day retention
- Set up alerts for error rate spikes
- Monitor 404/500 error rates

### 7. Database & Backups

#### Supabase Configuration
- Enable Row Level Security (RLS) on all tables
- Configure automated daily backups (30-day retention)
- Test point-in-time recovery on staging
- Monitor database performance metrics

### 8. Mobile Money Integration

#### Production Webhooks
Configure webhook URLs:
```
MTN MoMo: https://makolaonline.com/api/webhooks/mtn-momo
Vodafone Cash: https://makolaonline.com/api/webhooks/vodafone-cash
AirtelTigo Money: https://makolaonline.com/api/webhooks/airteltigo-money
```

#### Security
- Implement HMAC signature validation
- Log all webhook requests to admin audit
- Ensure idempotency to prevent double-processing

### 9. Staging → Production Deployment

#### Pre-Deployment Checklist
1. Run `/admin/prelaunch` checklist on staging
2. Test complete user flows:
   - Seller registration → product upload → publish
   - Rider registration → job acceptance → delivery
   - Admin login → payout approval → MoMo webhook
3. Verify WhatsApp OTP works with production number
4. Test MoMo integration with test transactions

#### Deployment Process
1. Deploy to staging first
2. Run automated tests
3. Manual QA verification
4. Promote same build artifact to production (no rebuild)
5. Run post-deployment health checks

### 10. Rollback Strategy

#### Preparation
- Keep 3 previous build artifacts
- Document database migration rollback steps
- Test rollback procedure on staging

#### Emergency Rollback
1. Revert to previous build artifact
2. Check database compatibility
3. Run health checks
4. Notify team of rollback

### 11. Post-Launch Monitoring

#### First 24 Hours
- Monitor error rates and response times
- Check WhatsApp OTP delivery success rate
- Verify MoMo webhook processing
- Monitor user registration flows

#### Ongoing Monitoring
- Weekly performance reports
- Monthly security audits
- Quarterly disaster recovery tests

### 12. Performance Targets

- **Lighthouse Score**: ≥85 mobile, ≥90 desktop
- **Page Load Time**: <3 seconds on 3G
- **Uptime**: 99.9% availability
- **Error Rate**: <0.1% of requests

## 🔧 Quick Commands

### Health Check
```bash
curl https://[supabase-url]/functions/v1/production-health-check
```

### Force Cache Clear
```bash
# Update version in manifest.webmanifest and redeploy
```

### Emergency Maintenance Mode
```javascript
// In admin panel, toggle:
ENV_CONFIG.MAINTENANCE_MODE = true
```

## 📞 Emergency Contacts

- **Technical Issues**: dukesnr@yahoo.co.uk
- **Domain/DNS**: [Domain registrar support]
- **Hosting**: [Hosting provider support]
- **Payment Issues**: [MoMo provider support]

---

**Last Updated**: January 2025
**Version**: 1.0
**Environment**: Production Ready