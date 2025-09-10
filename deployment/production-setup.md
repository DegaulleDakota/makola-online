# Makola Online Production Deployment Guide

## ⚠️ AI Assistant Limitation Notice

As an AI assistant, I cannot perform actual hosting, domain configuration, or server management. However, I've prepared all necessary configuration files and deployment instructions for manual setup.

## Required Manual Steps

### 1. Domain & SSL Configuration
- Purchase makolaonline.com domain
- Configure DNS A records to point to hosting provider
- Set up www.makolaonline.com → makolaonline.com redirect
- Enable automatic SSL certificates
- Configure staging.makolaonline.com subdomain

### 2. Hosting Setup (DigitalOcean App Platform)
- Create new App from GitHub repository
- Use provided .do/app.yaml configuration
- Set environment variables as specified
- Enable SPA routing and CDN

### 3. Payment Integration
- Configure Vodafone MoMo webhook endpoints
- Test payment callbacks in staging
- Verify Admin → Payments logging

### 4. Monitoring Setup
- Configure uptime monitoring for key endpoints
- Set up alerting for cron job failures
- Enable rollback capabilities

## Configuration Files Provided
- .do/app.yaml (production config)
- deployment/staging.yaml (staging config)
- scripts/daily-reminders.js (cron job)
- scripts/hourly-cleanup.js (cron job)
- deployment/README.md (detailed instructions)

## Next Steps
1. Manual hosting setup using provided configs
2. Domain and SSL configuration
3. Payment webhook testing
4. Production deployment verification