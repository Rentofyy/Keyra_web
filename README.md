# KEYRA Web — Official Web Platform

The modern web platform for **KEYRA (Verified Homes & Zero-Brokerage Rentals)** built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **React 19**.

---

## 🚀 Features

- **0% Brokerage Property Marketplace**: Browse, filter, and inspect verified rental homes across Pune West (Baner, Wakad, Hinjewadi, Balewadi High Street, etc.).
- **Property Finalization & Deal Closure Pass**: Direct assisted property finalization modal with Razorpay test/production checkout.
- **Interactive Map Search**: Dynamic Google Maps integration displaying property clusters and neighborhood amenities.
- **Coliving & Commercial Coming Soon Pages**: Dedicated zero-brokerage waitlist registration and launch corridors.
- **Owner Dashboard**: Free property listing submission and management.

---

## 🛠️ Local Development

### 1. Prerequisites
- Node.js >= 18.18 (Node.js 20 LTS recommended)
- npm or pnpm

### 2. Setup
```bash
git clone https://github.com/Rentofyy/Keyra_web.git
cd Keyra_web

npm install
cp .env.example .env.local
```

### 3. Run Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Run Tests & Build
```bash
# Unit & component test suite (Vitest)
npm test

# Production build verification
npm run build
```

---

## 🌐 Deploying to Vercel (Production Domain: https://keyra.in)

The application is architected for native Next.js 15 hosting on **Vercel** with GitHub integration.

### Step 1: Connect GitHub Repository
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New…** > **Project** and import **`Rentofyy/Keyra_web`**.
3. Framework Preset: **Next.js** (auto-detected).
4. Root Directory: `./` (default).
5. Build Command: `npm run build` (default).

### Step 2: Environment Variables
Add the required environment variables under **Project Settings** > **Environment Variables**:

| Variable Name | Environment | Value | Description |
|---|---|---|---|
| `NODE_VERSION` | Production, Preview, Dev | `20.x` | Node.js LTS runtime |
| `NEXT_PUBLIC_APP_NAME` | Production, Preview, Dev | `KEYRA - Verified Homes` | Brand title |
| `NEXT_PUBLIC_APP_URL` | Production | `https://keyra.in` | Canonical site URL |
| `NEXT_PUBLIC_APP_URL` | Preview | `https://${VERCEL_URL}` | Preview deployment URL |
| `NEXT_PUBLIC_API_URL` | Production, Preview, Dev | `https://keyra-backend-803170070973.asia-south1.run.app/api/v1` | Spring Boot Cloud Run backend |
| `BACKEND_API_URL` | Production, Preview | `https://keyra-backend-803170070973.asia-south1.run.app/api/v1` | Server-side proxy base URL |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Production | `rzp_live_...` (or test: `rzp_test_TuuEAa58npPSlK`) | Razorpay public key ID |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Production, Preview, Dev | `803170070973-b8mc27tpbqim5dn2qacf2g8s9tv76gik.apps.googleusercontent.com` | Google OAuth Web Client ID |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Production, Preview, Dev | *(Your Maps API Key)* | Google Maps JS API (Optional) |

### Step 3: Production Domain Configuration (`keyra.in`)
1. In Vercel Project Settings > **Domains**, add `keyra.in` (Primary) and `www.keyra.in` (Redirect to `keyra.in`).
2. Add DNS records at your domain registrar:
   - **Apex (`@`)**: `A` record pointing to `76.76.21.21`
   - **Subdomain (`www`)**: `CNAME` record pointing to `cname.vercel-dns.com.`
3. Vercel automatically issues and renews global SSL certificates.

Detailed documentation:
- 📖 [Vercel Deployment Guide](docs/VERCEL_DEPLOYMENT_GUIDE.md)
- 📋 [Environment Variables Specification](docs/VERCEL_ENVIRONMENT_VARIABLES.md)
- 📝 [Migration & Validation Report](docs/VERCEL_MIGRATION_REPORT.md)

---

## 📄 License
Private & Proprietary — © 2026 KEYRA Technologies Pvt. Ltd. All rights reserved.
