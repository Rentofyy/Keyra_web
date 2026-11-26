# KEYRA Web — Vercel Environment Variables Specification

This document details every environment variable used by the **KEYRA Web** Next.js 15 application when deploying to **Vercel**.

---

## 📋 Environment Variables Summary Table

| Variable Name | Classification | Purpose | Environments | Production Value / Source |
|---|---|---|---|---|
| `NEXT_PUBLIC_APP_NAME` | Public | Application title and branding | Production, Preview, Dev | `KEYRA - Verified Homes` |
| `NEXT_PUBLIC_APP_URL` | Public | Canonical web URL for metadata, OAuth & redirects | Production, Preview, Dev | `https://keyra.in` (or `https://www.keyra.in`) |
| `NEXT_PUBLIC_API_URL` | Public | Google Cloud Run Spring Boot REST API base | Production, Preview, Dev | `https://keyra-backend-803170070973.asia-south1.run.app/api/v1` |
| `BACKEND_API_URL` | Private (Server-side) | Server-side route proxy destination (optional) | Production, Preview | `https://keyra-backend-803170070973.asia-south1.run.app/api/v1` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Public | Google Identity Services OAuth 2.0 Web Client ID | Production, Preview, Dev | `803170070973-b8mc27tpbqim5dn2qacf2g8s9tv76gik.apps.googleusercontent.com` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public | Razorpay client key for payment checkout | Production, Preview, Dev | Production: `rzp_live_...` / Test: `rzp_test_TuuEAa58npPSlK` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Public | Google Maps JS API key for interactive map | Production, Preview, Dev | Google Cloud Console Maps API Key (Optional) |
| `NODE_VERSION` | System / Build | Node.js runtime version | Production, Preview, Dev | `20.x` |

---

## 🔍 Detailed Variable Specifications

### 1. `NEXT_PUBLIC_APP_NAME`
- **Classification**: Public (`NEXT_PUBLIC_`)
- **Usage**: Referenced in page titles, OpenGraph metadata, and layout branding.
- **Default / Fallback**: `"KEYRA - Verified Homes"`
- **Required Environments**: Production, Preview, Development.

### 2. `NEXT_PUBLIC_APP_URL`
- **Classification**: Public (`NEXT_PUBLIC_`)
- **Usage**: Used to construct absolute canonical URLs for OpenGraph tags, sitemaps, and authentication callbacks.
- **Production**: `https://keyra.in`
- **Preview**: Automatically set or overridden to Vercel preview domain (`https://${VERCEL_URL}`).
- **Development**: `http://localhost:3000`
- **Required Environments**: Production, Preview, Development.

### 3. `NEXT_PUBLIC_API_URL`
- **Classification**: Public (`NEXT_PUBLIC_`)
- **Usage**: Base URL for all REST API communication with the backend. Referenced in:
  - `src/lib/api-client.ts`: Axios client used throughout tenant, owner, and property flows.
  - `src/lib/property-helper.ts`: Resolves relative property media URLs against the backend host.
  - `src/app/api/proxy/[...path]/route.ts`: Default target for the Next.js API proxy.
- **Value**: `https://keyra-backend-803170070973.asia-south1.run.app/api/v1`
- **Required Environments**: Production, Preview, Development.

### 4. `BACKEND_API_URL`
- **Classification**: Private (Server-side Only)
- **Usage**: Read exclusively in `src/app/api/proxy/[...path]/route.ts` on the Node.js / edge runtime. Allows overriding the backend base URL without exposing it in browser bundles. If not set, the route handler cleanly defaults to `NEXT_PUBLIC_API_URL`.
- **Value**: `https://keyra-backend-803170070973.asia-south1.run.app/api/v1`
- **Required Environments**: Production (recommended), Preview (optional).

### 5. `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- **Classification**: Public (`NEXT_PUBLIC_`)
- **Usage**: Used in `src/components/auth/auth-modal.tsx` to initialize Google One Tap and "Sign in with Google" buttons via Google Identity Services (`https://accounts.google.com/gsi/client`).
- **Value**: `803170070973-b8mc27tpbqim5dn2qacf2g8s9tv76gik.apps.googleusercontent.com`
- **Required Environments**: Production, Preview, Development.
- **Important**: In Google Cloud Console > APIs & Services > Credentials, ensure the following Authorized JavaScript Origins are whitelisted:
  - `https://keyra.in`
  - `https://www.keyra.in`
  - `http://localhost:3000`

### 6. `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- **Classification**: Public (`NEXT_PUBLIC_`)
- **Usage**: Initialized in `src/components/property/property-finalization-modal.tsx` to launch the official Razorpay Standard Checkout SDK for the ₹9,999 zero-brokerage deal closure pass.
- **Value**:
  - **Production**: Live Merchant Key (`rzp_live_...`)
  - **Preview & Development**: Test Merchant Key (`rzp_test_TuuEAa58npPSlK`)
- **Required Environments**: Production, Preview, Development.
- **Security Note**: This is the Razorpay **Key ID** (public key), NOT the Key Secret. The Key Secret resides exclusively on the backend Spring Boot server.

### 7. `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- **Classification**: Public (`NEXT_PUBLIC_`)
- **Usage**: Used in `src/app/properties/map/page.tsx` for Google Maps JavaScript API integration.
- **Value**: Google Cloud Console Maps API Key (restricted to HTTP referrers `keyra.in/*`, `*.pages.dev/*`, `*.vercel.app/*`, `localhost:3000/*`).
- **Required Environments**: Optional. If omitted, the map screen displays fallback neighborhood cards without errors.

### 8. `NODE_VERSION`
- **Classification**: Vercel Project Setting
- **Usage**: Configures Vercel's Node.js runtime environment.
- **Value**: `20.x`
- **Setting Location**: Vercel Dashboard > Project Settings > General > Node.js Version.

---

## 🔒 Security Best Practices for Vercel

1. **Never prefix private secrets with `NEXT_PUBLIC_`**: Next.js inlines all `NEXT_PUBLIC_*` values into the client-side JavaScript bundles sent to the browser.
2. **Never commit `.env.local`**: Ensure `.env.local` remains in `.gitignore`. Only `.env.example` should be committed to the repository.
3. **Set Production vs Preview scopes**: In Vercel Project Settings > Environment Variables, assign production domains and live keys specifically to the **Production** environment, and staging/test keys to **Preview** and **Development**.
