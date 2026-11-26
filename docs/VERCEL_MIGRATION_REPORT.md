# KEYRA Web — Vercel Migration & Validation Report

**Project**: KEYRA Web Platform  
**Target Repository**: [https://github.com/Rentofyy/Keyra_web](https://github.com/Rentofyy/Keyra_web)  
**Hosting Target**: Vercel (Next.js Native Production Hosting)  
**Production Domain**: `https://keyra.in` / `https://www.keyra.in`  
**Date**: November 26, 2026  
**Status**: Ready for Production Deployment  

---

## 1. Executive Summary

The **KEYRA Web** application has been audited, decoupled from Cloudflare OpenNext experimental dependencies, and validated for native production hosting on **Vercel** with GitHub integration.

- **Cloudflare Dependencies Removed**: Safely excised `@opennextjs/cloudflare`, `wrangler`, `open-next.config.ts`, `wrangler.jsonc`, and `public/_headers`.
- **Pure Next.js Restored**: `next.config.ts`, `package.json`, and `package-lock.json` restored to standard Next.js 15 App Router architecture.
- **Production Build**: Verified locally with `npm run build` — compiled cleanly with **16/16 routes generated** and exit code 0.
- **Unit & Component Tests**: 100% passing (**66/66 tests across 12 test files**).
- **Backend Connectivity**: Cloud Run Spring Boot backend verified reachable with pre-configured CORS headers supporting `https://keyra.in`, `https://www.keyra.in`, and `https://*.vercel.app`.
- **Database & Services**: Zero backend code modifications, zero schema changes, and zero changes to the Supabase database.

---

## 2. Cloudflare Audit & Decoupling Log

| Item | Previous State (Cloudflare OpenNext) | Current State (Vercel Native) | Action Taken |
|---|---|---|---|
| `package.json` dependencies | Contained `@opennextjs/cloudflare: ^1.20.19` | Removed | Restored clean Next.js 15 + React 19 dependencies |
| `package.json` devDependencies | Contained `wrangler: ^4.168.0` | Removed | Removed Wrangler CLI |
| `package.json` scripts | Had `preview`, `deploy`, `upload`, `cf-typegen` | Removed | Preserved clean `dev`, `build`, `start`, `lint`, `test` |
| `next.config.ts` | Had `initOpenNextCloudflareForDev()` import | Removed | Clean `NextConfig` with image domains and `/api/v1` rewrites |
| `open-next.config.ts` | Present | Deleted | Not required for Vercel |
| `wrangler.jsonc` | Present | Deleted | Not required for Vercel |
| `public/_headers` | Present | Deleted | Not required for Vercel |
| `.open-next/` & `.wrangler/` | Present | Cleaned | Removed temporary build artifacts |

---

## 3. Production Build & Validation Metrics

### A. Next.js 15 Build Output (`npm run build`)
```text
✓ Compiled successfully in 3.8s
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (16/16)
✓ Collecting build traces
✓ Finalizing page optimization

Route (app)                                 Size  First Load JS
┌ ○ /                                    5.01 kB         160 kB
├ ○ /_not-found                            995 B         104 kB
├ ƒ /api/auth/logout                       133 B         103 kB
├ ƒ /api/auth/session                      133 B         103 kB
├ ƒ /api/proxy/[...path]                   133 B         103 kB
├ ○ /care-plan                           5.07 kB         149 kB
├ ○ /favourites                          1.45 kB         156 kB
├ ƒ /legal/[slug]                          165 B         106 kB
├ ○ /owner/dashboard                     7.59 kB         152 kB
├ ○ /owner/properties                      133 B         103 kB
├ ○ /owner/properties/new                9.52 kB         145 kB
├ ○ /owners                                165 B         106 kB
├ ○ /profile                             4.81 kB         145 kB
├ ○ /properties                          7.46 kB         162 kB
├ ƒ /properties/[id]                     13.1 kB         163 kB
├ ƒ /properties/[id]/visit               6.08 kB         150 kB
├ ○ /properties/map                      35.9 kB         191 kB
└ ○ /tenant/visits                       4.34 kB         148 kB
+ First Load JS shared by all             103 kB
```

### B. Vitest Suite Results (`npm test`)
```text
Test Files  12 passed (12)
     Tests  66 passed (66)
  Duration  1.70s
```

---

## 4. Backend & Security Parity Verification

### A. Google Cloud Run Backend
- **Endpoint**: `https://keyra-backend-803170070973.asia-south1.run.app/api/v1`
- **Health Check**: Responding HTTP 200 / 401 with valid JSON error schema.
- **CORS Validation**:
  - `Origin: https://keyra.in` -> HTTP 200 with `Access-Control-Allow-Origin: https://keyra.in` and `Access-Control-Allow-Credentials: true`
  - `Origin: https://www.keyra.in` -> HTTP 200 with `Access-Control-Allow-Origin: https://www.keyra.in` and `Access-Control-Allow-Credentials: true`
  - `Origin: https://keyra-web.vercel.app` -> HTTP 200 with `Access-Control-Allow-Origin: https://keyra-web.vercel.app` and `Access-Control-Allow-Credentials: true`

### B. Authentication & Session Handling
- **Mobile OTP Login**: Direct client-to-backend authorization flow via Axios client.
- **Google OAuth (GSI)**: Client-side Google Identity Services credential response exchanged with backend token endpoint.
- **Session Cookies**: Managed by Next.js route handlers (`src/app/api/auth/session` and `src/app/api/auth/logout`) with `HttpOnly`, `SameSite: Lax`, and `Secure` flags.
- **Protected Routes**: Maintained via `useAuthStore` client state and token verification.

---

## 5. Deployment Readiness Checklist

- [x] Cloudflare OpenNext dependencies completely removed.
- [x] Standard Next.js 15 build passes with 0 errors.
- [x] TypeScript validation clean.
- [x] Vitest test suite 100% passing (66/66).
- [x] Environment variables documented in `docs/VERCEL_ENVIRONMENT_VARIABLES.md`.
- [x] Deployment guide documented in `docs/VERCEL_DEPLOYMENT_GUIDE.md`.
- [x] Remote GitHub repository configured and synced with `main`.
- [x] Production DNS requirements documented for `keyra.in` (A record) and `www.keyra.in` (CNAME).
- [x] Google Cloud Console OAuth Authorized Origins documented.
