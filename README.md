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

## 🌐 Deploying to Cloudflare Pages

To deploy this Next.js repository on **Cloudflare Pages**:

### Step 1: Connect GitHub Repository
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select the repository: `Rentofyy/Keyra_web`.

### Step 2: Build & Deployment Settings
Configure the build settings as follows:

| Setting | Value |
|---|---|
| **Framework preset** | `Next.js` |
| **Build command** | `npm run build` |
| **Build output directory** | `.next` (or default for Cloudflare Next.js preset) |
| **Root directory** | `/` |

### Step 3: Environment Variables
Add the following Environment Variables in the Cloudflare Pages settings:

| Variable Name | Value | Description |
|---|---|---|
| `NODE_VERSION` | `20` | Ensures compatible Node.js LTS runtime |
| `NEXT_PUBLIC_APP_NAME` | `KEYRA - Verified Homes` | Brand title |
| `NEXT_PUBLIC_APP_URL` | `https://keyra-web.pages.dev` (or custom domain) | Base site URL |
| `NEXT_PUBLIC_API_URL` | `https://keyra-backend-803170070973.asia-south1.run.app/api/v1` | Production backend API |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_test_TuuEAa58npPSlK` | Razorpay Key ID |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `803170070973-b8mc27tpbqim5dn2qacf2g8s9tv76gik.apps.googleusercontent.com` | Google OAuth Client ID |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | *(Your Google Maps API key)* | Optional for Maps view |

Click **Save and Deploy**. Cloudflare will build and serve the application globally with automatic SSL and edge caching.

---

## 📄 License
Private & Proprietary — © 2026 KEYRA Technologies Pvt. Ltd. All rights reserved.
