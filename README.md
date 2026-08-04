# trackmypnr

A free Indian Railways PNR status checker — FastAPI + Firebase backend, Next.js frontend —
built from `PNR_Alert_Platform_Spec.md`. Not affiliated with Indian Railways or IRCTC.

## What's here

- **`backend/`** — FastAPI service: PNR lookup (via a RapidAPI provider), save/track/history
  endpoints backed by Firestore, Firebase-token auth, TTL caching, rate limiting.
- **`frontend/`** — Next.js 16 (App Router) app: the PNR checker, a dashboard of saved PNRs,
  four SEO content pages, FAQ, legal pages.
- **`firebase.json`, `backend/firestore.rules`, `backend/firestore.indexes.json`** — Firestore
  config, ready to deploy with the Firebase CLI.
- **`.github/workflows/ci.yml`** — runs backend pytest + frontend vitest/tsc on every PR.

Both apps are fully built and independently tested (22/22 backend tests, 14/14 frontend tests,
clean `next build` and `tsc --noEmit`) but **not yet deployed** — see "What's left" below.

## Local development

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in Firebase + RapidAPI credentials, see below
uvicorn main:app --reload
```

Runs on `http://localhost:8000`. `GET /api/health` is a liveness check; interactive docs at
`/docs`.

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

## Required credentials (none of these are included in this repo)

| Credential | Where it's used | How to get it |
|---|---|---|
| Firebase service account JSON | `backend/.env` → `FIREBASE_SERVICE_ACCOUNT_JSON` (base64) | Firebase Console → Project Settings → Service Accounts → Generate new private key |
| Firebase Web App config | `frontend/.env.local` → `NEXT_PUBLIC_FIREBASE_*` | Firebase Console → Project Settings → Your apps → Web app |
| RapidAPI PNR key | `backend/.env` → `PNR_API_KEY` | [RapidAPI "IRCTC \| Indian Railway PNR Status"](https://rapidapi.com) listing — **rotate any previously-exposed key before use** |
| AdSense client ID *(later)* | `frontend/.env.local` → `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Only after AdSense approval — apply once content pages are live and indexed |

Full variable lists: `backend/.env.example`, `frontend/.env.local.example`.

## Deployment (once credentials above exist)

1. **Firebase**: create project → enable Firestore (production mode) + Authentication →
   Anonymous provider → `firebase deploy --only firestore:rules,firestore:indexes` from repo
   root (requires `firebase-tools` and the config in `firebase.json`).
2. **Backend → Render**: new Web Service, root directory `backend`, build command
   `pip install -r requirements.txt`, start command
   `uvicorn main:app --host 0.0.0.0 --port $PORT`. Set env vars from `backend/.env.example`.
   Add custom domain `api.trackmypnr.co.in`. Immediately set up an external keep-alive ping
   (e.g. cron-job.org) hitting `/api/health` every 10 minutes — Render's free tier spins down
   after ~15 minutes idle.
3. **Frontend → Vercel**: import the repo, framework preset Next.js, set env vars from
   `frontend/.env.local.example`. Add custom domains `trackmypnr.co.in` + `www.trackmypnr.co.in`.
4. **DNS** (at your registrar): `@` and `www` → Vercel's provided records, `api` → Render's
   provided CNAME.

## What's left

This repo is code-complete and tested, but three things need to happen outside of what an
assistant can do unattended, since they all require your own account access:

- **Push to GitHub** — needs your credentials.
- **Create the Firebase project** — needs your Google login.
- **Get a RapidAPI key** — and rotate the one referenced in the original spec if it was ever
  shared anywhere public.

Render deployment also needs to happen from your Render dashboard (connected to the pushed
GitHub repo) since there's no automation available for that step here.
