# TriggerFlow

An Instagram comment automation tool. When someone comments a keyword on your reel, it automatically replies to their comment and sends them a DM.

## Tech Stack

- **Next.js 15** (App Router) + TypeScript
- **PostgreSQL** via [Neon](https://neon.tech) (serverless)
- **Prisma 7** ORM with `@prisma/adapter-neon`
- **NextAuth v5** — Google OAuth
- **Meta Graph API** — Instagram webhooks, comment replies, DMs
- **Tailwind CSS**
- **ngrok** — for exposing localhost to Meta webhooks

---

## Prerequisites

Make sure you have these installed:
- Node.js 18+
- npm
- ngrok (`brew install ngrok` on macOS)

---

## 1. Clone & Install

```bash
git clone <repo-url>
cd triggerflow
npm install
```

---

## 2. Set up Environment Variables

Create a `.env.local` file in the root of the project:

```env
# PostgreSQL (Neon)
DATABASE_URL=postgresql://<user>:<password>@<host>/neondb?sslmode=require

# Meta / Instagram
PAGE_ACCESS_TOKEN=
PAGE_ID=
INSTAGRAM_ACCOUNT_ID=
VERIFY_TOKEN=triggerflow123
INSTAGRAM_ACCESS_TOKEN=

# Facebook App Credentials
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
INSTAGRAM_APP_ID=
INSTAGRAM_APP_SECRET=
INSTAGRAM_REDIRECT_URI=https://<your-ngrok-domain>/api/auth/instagram/callback

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
AUTH_TRUST_HOST=true

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

> Ask a team member for the actual values — never commit this file.

---

## 3. Set up the Database

We use [Neon](https://neon.tech) for PostgreSQL. Ask a team member for the `DATABASE_URL` connection string and add it to `.env.local`.

Then run Prisma migrations to create all tables:

```bash
npx prisma migrate dev
```

To view the database in a GUI:

```bash
npx prisma studio
```

---

## 4. Run the Dev Server

```bash
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000)

---

## 5. Run ngrok (for Instagram Webhooks)

Meta requires a public HTTPS URL to send webhook events. We use ngrok with a fixed domain.

```bash
ngrok http --domain=<your-ngrok-domain> 3000
```

> The ngrok domain is set in `INSTAGRAM_REDIRECT_URI` in `.env.local`. Ask a team member for the domain.

The webhook endpoint Meta calls is:
```
https://<your-ngrok-domain>/api/webhook
```

---

## Project Structure

```
app/
├── api/
│   ├── auth/           # NextAuth + Instagram OAuth callback
│   ├── webhook/        # Instagram comment webhook handler
│   ├── rules/          # CRUD for automation rules
│   ├── dashboard/      # Dashboard stats API
│   ├── analytics/      # Analytics API
│   ├── activity/       # Activity log API
│   └── instagram/      # Instagram status, media, disconnect
├── dashboard/          # All dashboard pages (UI)
├── components/         # Shared UI components
├── lib/
│   ├── prisma.ts       # Prisma client singleton
│   ├── auth.ts         # NextAuth config
│   └── mongodb.ts      # (deprecated, no longer used)
├── models/             # (deprecated Mongoose models, no longer used)
└── prisma/
    └── schema.prisma   # Database schema
```

---

## How It Works

1. User logs in with Google
2. User connects their Instagram Business account via Meta OAuth
3. User creates an automation rule — pastes a reel URL, sets a keyword, writes reply messages
4. When someone comments the keyword on that reel, Meta sends a webhook event to `/api/webhook`
5. The webhook handler:
   - Finds the matching automation rule
   - Checks for duplicate (same user + reel)
   - Replies publicly to the comment
   - Sends a DM to the commenter (requires Meta `instagram_manage_messages` approval)
   - Saves the processed comment and updates stats

---

## Common Commands

```bash
npm run dev           # Start dev server
npx prisma migrate dev   # Run DB migrations
npx prisma generate      # Regenerate Prisma client after schema changes
npx prisma studio        # Open DB GUI
```

---

## Notes

- **DM sending** requires Meta app review approval for `instagram_manage_messages` permission. Until approved, only comment replies work.
- The `VERIFY_TOKEN` in `.env.local` must match what's configured in the Meta Developer Console under webhook settings.
- If you change `prisma/schema.prisma`, always run `npx prisma migrate dev` and `npx prisma generate`.
