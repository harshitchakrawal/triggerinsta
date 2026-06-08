# TriggerFlow

An Instagram comment automation tool. When someone comments a keyword on your reel, it automatically replies to their comment and sends them a DM.

This is a **monorepo** split into two services:

```
triggerflow/
├── frontend/   # Next.js 16 (App Router) — UI + NextAuth + a thin proxy to the backend
└── backend/    # Django 5 + DRF — all business logic, Meta Graph API, the webhook engine
```

## Architecture

```
Browser
  │  (NextAuth session cookie)
  ▼
frontend/  Next.js — keeps NextAuth (Google + Instagram OAuth) and the UI.
  │  Proxy at app/api/backend/[...path] runs auth(), injects:
  │    X-Internal-Secret  (shared secret, proves the call is from the frontend)
  │    X-User-Email        (the authenticated user's identity)
  ▼
backend/   Django + DRF — all data/Meta/Groq logic.
  ▼
Neon Postgres — the SAME database, schema owned by Prisma (frontend/prisma).
                Django reads/writes it via introspected `managed=False` models.
        ▲
Meta webhook ──────────────► backend  /api/webhook   (Meta calls Django directly)
```

The frontend never talks to the database. NextAuth callbacks and the Instagram
OAuth handshake delegate persistence to internal Django endpoints
(`/api/internal/users/upsert`, `/api/instagram/oauth/exchange`).

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind v4, NextAuth v5, Redux Toolkit
- **Backend:** Django 5, Django REST Framework, `psycopg` (Postgres), `requests`
- **Database:** PostgreSQL via [Neon](https://neon.tech); schema managed by **Prisma 7** (source of truth), read by Django as `managed=False` models
- **Meta Graph API:** Instagram webhooks, comment replies, DMs
- **Groq:** `llama-3.3-70b-versatile` for AI content suggestions
- **ngrok:** to expose localhost to Meta webhooks

---

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+ and `venv`
- ngrok (`brew install ngrok` on macOS)

---

## 1. Backend (Django) — `backend/`

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env` (ask a team member for secret values):

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/neondb?sslmode=require

# Meta / Instagram Graph API
PAGE_ACCESS_TOKEN=
INSTAGRAM_ACCOUNT_ID=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
INSTAGRAM_REDIRECT_URI=https://<your-ngrok-domain>/api/auth/instagram/callback
VERIFY_TOKEN=triggerflow123
GRAPH_API_VERSION=v19.0

# Groq
GROQ_API_KEY=

# Must match the frontend value
INTERNAL_API_SECRET=<shared secret>

# Django
DJANGO_SECRET_KEY=<random>
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

Run it (port 8000):

```bash
python manage.py runserver 8000
```

> Django uses `managed=False` models over the existing Prisma tables — it never
> migrates or alters the schema. There is nothing to migrate on the backend.

---

## 2. Frontend (Next.js) — `frontend/`

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
AUTH_TRUST_HOST=true

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Facebook/Instagram OAuth (used by the OAuth URL builder routes)
FACEBOOK_APP_ID=
INSTAGRAM_REDIRECT_URI=https://<your-ngrok-domain>/api/auth/instagram/callback

# Django backend connection
BACKEND_URL=http://localhost:8000
INTERNAL_API_SECRET=<same shared secret as backend>
```

Run it (port 3000):

```bash
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

---

## 3. Database (Prisma — schema source of truth)

The database lives in `frontend/prisma`. Schema changes still go through Prisma:

```bash
cd frontend
npx prisma migrate dev     # apply/create migrations
npx prisma studio          # GUI
```

After a schema change, update the Django models in `backend/core/models.py`
(re-run `python manage.py inspectdb` for guidance) so they stay in sync.

---

## 4. ngrok (for Instagram webhooks)

Meta needs a public HTTPS URL.

- **Webhook events** are sent by Meta directly to the **backend**:
  ```bash
  ngrok http --domain=<your-ngrok-domain> 8000
  # Meta webhook URL: https://<your-ngrok-domain>/api/webhook
  ```
- **The OAuth redirect** (`INSTAGRAM_REDIRECT_URI`) points at the **frontend**
  `:3000` `/api/auth/instagram/callback`. In development, expose both ports
  (two tunnels) or proxy the webhook through the frontend if you only have one.

---

## How It Works

1. User logs in with Google (or "Login with Instagram").
2. User connects their Instagram Business account via Meta OAuth — the frontend
   callback forwards the code to Django (`/api/instagram/oauth/exchange`), which
   does the Graph API token exchange and stores the long-lived page token.
3. User creates an automation rule — pastes a reel URL, sets a keyword, writes
   the comment reply and DM messages.
4. When someone comments the keyword on that reel, Meta sends a webhook event to
   the backend `/api/webhook`.
5. The Django webhook engine: finds the matching rule, dedups (user + reel),
   replies to the comment, sends a DM, saves the processed comment, updates stats.

---

## Notes

- **DM sending** requires Meta app review for `instagram_manage_messages`. Until
  approved, only comment replies work.
- `VERIFY_TOKEN` (backend) must match the Meta Developer Console webhook config.
- `INTERNAL_API_SECRET` must be identical in `backend/.env` and
  `frontend/.env.local`; it is never exposed to the browser.
