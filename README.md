# Makola Online - Ghana's Premier Marketplace

A modern, feature-rich marketplace platform for Ghana, built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Multi-user Platform**: Buyers, Sellers, Riders, and Admin roles
- **Mobile Money Integration**: Vodafone MoMo payments (MTN & AirtelTigo coming soon)
- **WhatsApp Integration**: OTP verification and notifications
- **Real-time Updates**: Live product updates and notifications
- **Responsive Design**: Mobile-first approach with modern UI
- **Admin Dashboard**: Comprehensive management tools
- **SEO Optimized**: Built for search engine visibility

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **UI Components**: Radix UI, Shadcn/ui
- **Routing**: React Router DOM
- **State Management**: React Query
- **Authentication**: WhatsApp OTP
- **Payments**: Mobile Money (Vodafone, MTN, AirtelTigo)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/makola-online.git
cd makola-online

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## 🚀 Deployment

### Build Commands
- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Runtime**: Node 18

### Environment Setup
See `.env.example` for required environment variables.

### Production Deployment
1. Push code to GitHub repository
2. Connect to DigitalOcean Apps
3. Configure environment variables
4. Set build/run commands as specified above
5. Run prelaunch checks at `/admin/prelaunch`

For detailed deployment instructions, see `deployment/MANUAL_DEPLOYMENT_STEPS.md`.

## 🔧 Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📱 Key Pages

- `/` - Homepage with featured products
- `/sell` - Seller registration and product listing
- `/admin/login` - Admin dashboard access
- `/seller` - Seller dashboard
- `/rider` - Rider dashboard and job management
- `/health` - Application health check

## 🔐 Admin Access

- **Super Admin Email**: dukesnr@yahoo.co.uk
- **WhatsApp OTP**: 0558271127
- **Default Password**: Set via environment variables

## 📞 Support

- **WhatsApp**: 0558271127
- **Email**: support@makolaonline.com

## 📄 License

Private - All rights reserved

---

Built with ❤️ for Ghana's digital marketplace revolution.