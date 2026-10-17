# 🚀 HowToSetup — EBAUB Digital Campus

Complete installation, database setup, and deployment guide for the EBAUB Digital Campus web portal.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Setup (Step-by-Step)](#quick-setup-step-by-step)
3. [Database Setup](#3-database-setup)
4. [Environment Variables & AI Keys](#environment-variables)
5. [Option A: VPS / Bare-Metal Deployment](#option-a-vps--bare-metal-deployment)
6. [Option B: Docker Deployment](#option-b-docker-deployment)
7. [First Admin Login](#first-admin-login)
8. [Seed Demo Data](#seed-demo-data)
9. [Branding Changes](#branding-changes)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js**: **18.18+** or later (Node 20.x LTS recommended). Verify with `node -v`. Download from [nodejs.org](https://nodejs.org) if needed.
- **npm**: 9+ (ships with Node.js)
- **Git**: For cloning the repository and managing versions
- **Supabase Account**: Free tier at [supabase.com](https://supabase.com) or self-hosted PostgreSQL instance
- (Optional) **Docker & Docker Compose**: For containerized deployment
- (Optional) **Supabase CLI**: For local migration management (`npm install -g supabase`)

---

## Quick Setup (Step-by-Step)

### Step 1: Clone Repository & Configure Environment

Copy `.env.example` to `.env.local` **before** installation so all build tools and environment guards detect your configuration immediately:

```bash
git clone <repository-url> ebaub
cd ebaub
cp .env.example .env.local
```

*(On Windows PowerShell: `Copy-Item .env.example .env.local`)*

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Edit `.env.local` with your Supabase credentials and API keys (see [Optional vs Required Keys](#optional-vs-required-keys) below).

---

## 3. Database Setup

> [!IMPORTANT]
> **Source of Truth:** Individual migration files in `supabase/migrations/` are the authoritative source of truth for the database schema. The file `database/schema.sql` is a consolidated reference dump of all migrations combined.

You can set up the database using either the **Supabase CLI** or the **Supabase Dashboard**:

### Method A: Supabase CLI (Recommended for Developers)

Run the following command from the project root to apply all incremental migrations and seed demo data in a single step:

```bash
cd supabase && supabase db reset
```

Or to push migrations directly to your remote linked project:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
npx supabase db execute --file database/seed.sql
```

### Method B: Supabase Dashboard SQL Editor

1. Log in to [supabase.com/dashboard](https://supabase.com/dashboard) and open your project.
2. In the left navigation, click **SQL Editor** → **New query**.
3. Open [`database/schema.sql`](./database/schema.sql), copy its entire contents, paste into the SQL Editor, and click **Run**.
   - *This creates all 21+ tables, enum types, triggers, RLS policies, storage buckets, and performance indexes.*
4. Next, open [`database/seed.sql`](./database/seed.sql), copy its contents, paste into a new query, and click **Run**.
   - *This loads demonstration faculties, departments, degree programs, courses, news, notices, and faculty profiles.*

---

## Environment Variables

Copy `.env.example` to `.env.local` before starting:

```bash
cp .env.example .env.local
```

### Critical Environment Variables (Mandatory)

1. **`NEXT_PUBLIC_SUPABASE_URL`**: Your Supabase project URL (e.g. `https://xyzproject.supabase.co`).
2. **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Your Supabase anonymous public API key. Required for authentication and client queries.
3. **`SUPABASE_SERVICE_ROLE_KEY`**: Your Supabase service role secret key. Required for server-side user provisioning and bypassing RLS for background jobs. **Keep secret.**

### Optional vs Required Keys

- **`GOOGLE_GENERATIVE_AI_API_KEY`**:
  - **Status:** Required for AI features.
  - **Features enabled:** AI Study Assistant, AI Quiz/Exam Generator, and Public AI Widget.
  - **How to obtain:** Get a free API key at [Google AI Studio](https://aistudio.google.com/apikey) (requires a Google account). Note that newly registered Google AI Studio accounts may occasionally require a brief approval/waiting period.
  - **Fallback:** The application will boot and run without this key, but AI chat and exam generation actions will return clear configuration notices.
- **`TAVILY_API_KEY`**:
  - **Status:** Optional.
  - **Features enabled:** Real-time web search and social media context retrieval for the public AI assistant.
  - **How to obtain:** Free key at [tavily.com](https://tavily.com/).
  - **Fallback:** If omitted, the AI assistant gracefully falls back to university database context.

| Variable | Required | Description |
|----------|:--------:|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Mandatory | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Mandatory | Supabase anonymous public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Mandatory | Supabase service role key (server-side only) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | ✅ Required for AI | Google Gemini API key for Study Assistant & Quiz Generator |
| `TAVILY_API_KEY` | ⬚ Optional | Tavily API key for live web search integration |

---

## Option A: VPS / Bare-Metal Deployment

### Step 4: Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Step 5: Production Build & Run

```bash
npm run build
npm start
```

### Step 6: Process Manager (PM2)

```bash
npm install -g pm2
pm2 start npm --name "ebaub" -- start
pm2 save
pm2 startup
```

### Nginx Reverse Proxy Example

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Option B: Docker Deployment

### Dockerfile (at project root)

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production=false

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  ebaub:
    build: .
    ports:
      - '3000:3000'
    env_file:
      - .env.local
    restart: unless-stopped
```

Run container:

```bash
docker compose up -d --build
```

---

## First Admin Login

### Method 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project → **Authentication → Users**.
2. Click **Add User** → **Create New User**, enter email and password.
3. Open **SQL Editor** and run:
   ```sql
   UPDATE public.profiles
   SET role = 'ADMIN', full_name = 'System Administrator'
   WHERE email = 'your-admin@email.com';
   ```
4. Log in at `http://localhost:3000/login?portal=admin`.

### Demo Credentials (for reviewers)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.ebaub.edu.bd | Demo@Admin2026 |
| Teacher | teacher@demo.ebaub.edu.bd | Demo@Teacher2026 |
| Student | student@demo.ebaub.edu.bd | Demo@Student2026 |

---

## Seed Demo Data

After applying the schema, optionally load demo data:

```bash
# Using Supabase SQL Editor:
# Paste and run the contents of database/seed.sql
```

Or via CLI:
```bash
npx supabase db execute --file database/seed.sql
```

---

## Branding Changes

### University Name & Tagline
Edit `src/types/settings.ts` → `PAGE_SETTINGS_DEFAULTS` object, or update via the **Admin Dashboard → Settings** page at runtime.

### Logo & Favicon
Replace files in `public/`:
- `favicon.ico` — browser tab icon
- Add your logo SVG/PNG to `public/` and reference it in components.

### Colours
Edit `src/app/globals.css` — the project uses a `campus-*` colour palette via Tailwind CSS custom theme.

---

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `Module not found` or dependency errors after install | Corrupted `node_modules` or cache conflict | Run `rm -rf node_modules package-lock.json && npm install` (or on PowerShell: `Remove-Item -Recurse -Force node_modules; npm install`). |
| Port 3000 already in use (`EADDRINUSE`) | Another process is occupying port 3000 | Linux/macOS: `PORT=3001 npm run dev`<br>Windows PowerShell: `$env:PORT=3001; npm run dev`<br>Or terminate existing process: `npx kill-port 3000`. |
| Supabase connection error / Auth loop | Invalid URL or API keys in `.env.local` | Ensure `NEXT_PUBLIC_SUPABASE_URL` starts with `https://` and has no trailing slash. Confirm `NEXT_PUBLIC_SUPABASE_ANON_KEY` matches Project Settings → API in Supabase. |
| Predev script warning | `.env.local` was not found during startup | Run `cp .env.example .env.local` before `npm run dev`. |
| AI features return 500 or configuration notice | Missing Google AI Studio API key | Add `GOOGLE_GENERATIVE_AI_API_KEY` to `.env.local`. Get key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey). |
| Storage upload error (e.g. `bucket not found`) | Storage buckets not yet provisioned | Run `database/schema.sql` in Supabase SQL Editor, which creates all storage buckets and policies automatically. |
| 500 errors on admin dashboard | User account lacks `ADMIN` role in `profiles` | Run `UPDATE public.profiles SET role = 'ADMIN' WHERE email = 'your-email';` in Supabase SQL Editor. |
