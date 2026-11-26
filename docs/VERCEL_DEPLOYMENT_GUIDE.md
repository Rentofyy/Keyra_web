# KEYRA Web — Vercel Production Deployment & Domain Guide

This guide provides step-by-step instructions for deploying the **KEYRA Web** application on **Vercel** with GitHub integration, configuring the production domains **`keyra.in`** and **`www.keyra.in`**, and setting up third-party services (Google OAuth, Razorpay, Cloud Run backend).

---

## 📌 Deployment Overview

- **Repository**: [https://github.com/Rentofyy/Keyra_web](https://github.com/Rentofyy/Keyra_web)
- **Production Branch**: `main`
- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS
- **Backend Architecture**: Google Cloud Run Spring Boot (`https://keyra-backend-803170070973.asia-south1.run.app/api/v1`)
- **Database**: Supabase PostgreSQL (Managed by Backend)
- **Production Domains**: `https://keyra.in` & `https://www.keyra.in`

---

## 🚀 Step 1: Deploy to Vercel via GitHub Integration

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New…** > **Project**.
3. Select **Import Git Repository**:
   - If prompted, authorize access to the **`Rentofyy`** GitHub account/organization.
   - Search for **`Keyra_web`** and click **Import**.
4. Configure the Project Settings:
   - **Project Name**: `keyra-web` (or `keyra`)
   - **Framework Preset**: `Next.js` (automatically detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: Next.js default (`.next`)
   - **Install Command**: `npm install` (default)
5. Expand **Environment Variables** and add the required variables (see Step 2).
6. Click **Deploy**. Vercel will clone `main`, install dependencies, run `npm run build`, and assign an initial `*.vercel.app` URL.

---

## 🔑 Step 2: Configure Environment Variables in Vercel

In Vercel Dashboard > **Project Settings** > **Environment Variables**, add the following variables:

| Variable Name | Environment | Value | Description |
|---|---|---|---|
| `NODE_VERSION` | Production, Preview, Dev | `20.x` | Node.js LTS runtime |
| `NEXT_PUBLIC_APP_NAME` | Production, Preview, Dev | `KEYRA - Verified Homes` | Display title |
| `NEXT_PUBLIC_APP_URL` | Production | `https://keyra.in` | Production web URL |
| `NEXT_PUBLIC_APP_URL` | Preview | `https://${VERCEL_URL}` | Preview web URL |
| `NEXT_PUBLIC_API_URL` | Production, Preview, Dev | `https://keyra-backend-803170070973.asia-south1.run.app/api/v1` | Spring Boot Cloud Run REST API |
| `BACKEND_API_URL` | Production, Preview | `https://keyra-backend-803170070973.asia-south1.run.app/api/v1` | Server-side route proxy destination |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Production, Preview, Dev | `803170070973-b8mc27tpbqim5dn2qacf2g8s9tv76gik.apps.googleusercontent.com` | Google OAuth Client ID |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Production | `rzp_live_...` (or test: `rzp_test_TuuEAa58npPSlK`) | Razorpay public key ID |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Production, Preview, Dev | *(Your Maps API Key)* | Google Maps JavaScript API (Optional) |

> 🔒 **Security Notice**: Do **NOT** add backend secrets, database passwords, or Razorpay Key Secret here. Those reside exclusively on the Google Cloud Run backend.

---

## 🌐 Step 3: Production Domain Setup (`keyra.in` & `www.keyra.in`)

### 1. Add Domains in Vercel
1. In Vercel, navigate to **Project Settings** > **Domains**.
2. Enter `keyra.in` and click **Add**.
3. Vercel will recommend adding both `keyra.in` and `www.keyra.in`:
   - Set **`keyra.in`** as the **Primary / Canonical** domain.
   - Configure **`www.keyra.in`** to **Redirect to `keyra.in`** (with a 308 Permanent Redirect) for optimal SEO and consistent cookies.

### 2. Configure DNS Records with Domain Registrar
Log in to your DNS provider (GoDaddy, Namecheap, Cloudflare DNS, Hostinger, etc.) and add the following records:

#### A Record (Apex Domain: `keyra.in`)
- **Type**: `A`
- **Name / Host**: `@` (or leave blank depending on registrar)
- **Value / IP Address**: `76.76.21.21`
- **TTL**: `600` (or Automatic)

#### CNAME Record (Subdomain: `www.keyra.in`)
- **Type**: `CNAME`
- **Name / Host**: `www`
- **Value / Target**: `cname.vercel-dns.com.`
- **TTL**: `600` (or Automatic)

> ⚠️ **Preserve Existing DNS Records**:
> - **DO NOT delete or modify existing MX, SPF (`TXT`), DKIM, or DMARC records** for email delivery (e.g. Google Workspace, Zoho, Microsoft 365).
> - Only update the `@` (A) and `www` (CNAME) web routing records.

### 3. Automatic SSL & HTTPS
- Vercel automatically requests and provisions a Let's Encrypt / DigiCert SSL certificate for both domains as soon as DNS propagation is verified.
- HTTPS redirection is enforced automatically by Vercel's global edge network.

---

## 🔐 Step 4: Update Google OAuth Authorized Origins

For Google One Tap and "Sign in with Google" to function on your production domain:

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Navigate to **APIs & Services** > **Credentials**.
3. Select your OAuth 2.0 Web Client ID (`803170070973-b8mc27tpbqim5dn2qacf2g8s9tv76gik.apps.googleusercontent.com`).
4. Under **Authorized JavaScript origins**, ensure all required origins are present:
   - `https://keyra.in`
   - `https://www.keyra.in`
   - `https://<your-project>.vercel.app`
   - `http://localhost:3000`
5. Click **Save**. (Changes in Google OAuth typically take 5 minutes to propagate).

---

## 🛡️ Step 5: Backend CORS Verification

The Spring Boot backend on Google Cloud Run already includes CORS headers allowing requests from `https://keyra.in`, `https://www.keyra.in`, and `https://*.vercel.app` with credentials enabled (`Access-Control-Allow-Credentials: true`).

Verification check:
```bash
curl -I -X OPTIONS "https://keyra-backend-803170070973.asia-south1.run.app/api/v1/properties" \
  -H "Origin: https://keyra.in" \
  -H "Access-Control-Request-Method: GET"
# Output includes:
# access-control-allow-origin: https://keyra.in
# access-control-allow-credentials: true
```

---

## 🔄 Step 6: Continuous Deployment Workflow

- **Production**: Every `git push` to `main` on `https://github.com/Rentofyy/Keyra_web` triggers an instant zero-downtime production deployment on `https://keyra.in`.
- **Preview**: Pull requests or feature branches automatically receive a unique preview deployment URL with isolated preview environment variables.
