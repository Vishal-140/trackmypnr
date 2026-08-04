# trackmypnr

A free Indian Railways PNR status checker — FastAPI + Firebase backend, Next.js frontend —
built with a focus on enterprise-grade SEO, performance, and user experience. Not affiliated with Indian Railways or IRCTC.

## Architecture

- **Backend (`backend/`)**: FastAPI service providing PNR lookup (via a RapidAPI provider), save/track/history endpoints backed by Firestore, Firebase-token auth, TTL caching, and rate limiting.
- **Frontend (`frontend/`)**: Next.js 16 (App Router) React 19 application. Features a PNR checker, a dashboard of saved PNRs, and several SEO-optimized content pages (guides, FAQ, travel classes).

## SEO & Performance Features

This project implements enterprise-grade technical SEO and Web Vitals best practices:
- **Google Analytics 4 with Consent Mode v2**: Fully compliant with GDPR/DPDP. Analytics and ad storage are denied by default until the user accepts via the cookie banner.
- **Structured Data**: Comprehensive JSON-LD implementation including `Organization`, `WebSite`, `SearchAction` (sitelinks search box), `BreadcrumbList`, `Article`, and `FAQPage` schemas across relevant pages.
- **OpenGraph & Twitter Cards**: Dynamic social sharing images (`og-default.png`) and metadata on all pages.
- **PWA Ready**: Includes `manifest.json`, `theme-color` (in viewport export), and Apple touch icons.
- **Security Headers**: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy configured at both the Next.js level and Vercel Edge.
- **RSS Feed**: Auto-generated `/feed.xml` for content discovery.
- **Accessibility**: ARIA labels, semantic HTML tags (`<nav>`, `<main>`, `<article>`), and WCAG AA compliant contrast.

## Local development

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in Firebase + RapidAPI credentials, see below
uvicorn main:app --reload
```

Runs on `http://localhost:8000`. `GET /api/health` is a liveness check; interactive docs at `/docs`.

```bash
python -m pytest tests/ -v   # 22 tests, no live credentials required
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # fill in NEXT_PUBLIC_* vars, see below
npm run dev
```

Runs on `http://localhost:3000`.

```bash
npm run test    # vitest — 14 component tests
npm run e2e      # playwright — builds + starts the app, runs against mobile + desktop viewports
```

## Required Environment Variables

| Credential | Where it's used | How to get it |
|---|---|---|
| Firebase service account JSON | `backend/.env` → `FIREBASE_SERVICE_ACCOUNT_JSON` (base64) | Firebase Console → Project Settings → Service Accounts → Generate new private key |
| Firebase Web App config | `frontend/.env.local` → `NEXT_PUBLIC_FIREBASE_*` | Firebase Console → Project Settings → Your apps → Web app |
| RapidAPI PNR key | `backend/.env` → `PNR_API_KEY` | [RapidAPI "IRCTC \| Indian Railway PNR Status"](https://rapidapi.com) listing |
| Google Analytics 4 | `frontend/.env.local` → `NEXT_PUBLIC_GA_ID` | Google Analytics Console → Data Streams → Measurement ID |
| AdSense client ID | `frontend/.env.local` → `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Only after AdSense approval — apply once content pages are live and indexed |

Full variable lists: `backend/.env.example`, `frontend/.env.local.example`.

## Deployment

1. **Firebase**: create project → enable Firestore (production mode) + Authentication → Anonymous provider → `firebase deploy --only firestore:rules,firestore:indexes` from repo root (requires `firebase-tools` and the config in `firebase.json`).
2. **Backend → Render**: new Web Service, root directory `backend`, build command `pip install -r requirements.txt`, start command `uvicorn main:app --host 0.0.0.0 --port $PORT`. Set env vars from `backend/.env.example`. Add custom domain `api.trackmypnr.co.in`.
3. **Frontend → Vercel**: import the repo, framework preset Next.js, set env vars from `frontend/.env.local.example`. Add custom domains `trackmypnr.co.in` + `www.trackmypnr.co.in`.
4. **DNS** (at your registrar): `@` and `www` → Vercel's provided records, `api` → Render's provided CNAME.
