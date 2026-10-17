# 🚀 HowToSetup — EBAUB Digital Campus

Complete installation and deployment guide for the EBAUB Digital Campus web portal.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Option A: VPS / Bare-Metal Deployment](#option-a-vps--bare-metal-deployment)
3. [Option B: Docker Deployment](#option-b-docker-deployment)
4. [Database Setup (Supabase)](#database-setup-supabase)
5. [Environment Variables](#environment-variables)
6. [First Admin Login](#first-admin-login)
7. [Seed Demo Data](#seed-demo-data)
8. [Branding Changes](#branding-changes)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js** 18.17 or later (recommended: 20.x LTS)
- **npm** 9+ (ships with Node.js)
- **Git** for cloning the repository
- **Supabase account** — free tier at [supabase.com](https://supabase.com) or self-hosted
- (Optional) **Docker** and **Docker Compose** for containerised deployment
- (Optional) **Supabase CLI** for running migrations locally

---

## Option A: VPS / Bare-Metal Deployment

### Step 1: Clone and Install

```bash
git clone <repository-url> ebaub
cd ebaub
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials and API keys (see [Environment Variables](#environment-variables)).

### Step 3: Run Database Migrations

See [Database Setup](#database-setup-supabase) below.

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

The app runs on port 3000. Use a reverse proxy (Nginx/Caddy) for HTTPS.

### Step 6: Process Manager (Recommended)

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

### Dockerfile (create at project root)

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production=false

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
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

> **Note:** Add `output: 'standalone'` to `next.config.ts` for Docker builds.

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

### Run

```bash
docker compose up -d --build
```

---

## Database Setup (Supabase)

### Option 1: Supabase Cloud (Recommended)

1. Create a new project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Go to **Project Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY`
3. Run all 21 migration files in order via the **SQL Editor**:
   - Open each file in `supabase/migrations/` (from `0001_initial_schema.sql` to `0021_student_exam_center.sql`)
   - Paste and execute sequentially in the Supabase SQL Editor
4. Alternatively, use the Supabase CLI:
   ```bash
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase db push
   ```

### Option 2: Self-Hosted Supabase

Follow the [Supabase self-hosting guide](https://supabase.com/docs/guides/self-hosting) and run the same migrations against your local PostgreSQL instance.

### Storage Buckets

The migration `0001_initial_schema.sql` creates these storage buckets automatically:
- `public_media` (public) — general media assets
- `student_files` (private) — student uploads
- `teacher_materials` (private) — teacher materials

Additional buckets created by later migrations:
- `course_materials` (public, 50MB limit) — created by `0010`
- `personal_study_files` (public, 50MB limit) — created by `0020`
- `avatars` (public) — created by `0014`

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous/public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (server-side only) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | ✅ | Google AI (Gemini) API key for AI features |
| `TAVILY_API_KEY` | ⬚ | Tavily API key for AI web search (optional but recommended) |

---

## First Admin Login

### Method 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project → **Authentication → Users**
2. Click **"Add User"** → **"Create New User"**
3. Enter email and password
4. After creation, go to **SQL Editor** and run:
   ```sql
   UPDATE public.profiles
   SET role = 'ADMIN', full_name = 'System Administrator'
   WHERE email = 'your-admin@email.com';
   ```
5. Log in at `http://localhost:3000/login?portal=admin`

### Method 2: SQL Console

```sql
-- Create user via Supabase Auth (use the Dashboard for this step)
-- Then promote to admin:
UPDATE public.profiles
SET role = 'ADMIN',
    full_name = 'Admin User',
    institutional_id = 'ADMIN-001'
WHERE email = 'admin@ebaub.edu.bd';
```

### Demo Credentials (for reviewers)

After seeding demo data (see below), use:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.ebaub.edu.bd | Demo@Admin2026 |
| Teacher | teacher@demo.ebaub.edu.bd | Demo@Teacher2026 |
| Student | student@demo.ebaub.edu.bd | Demo@Student2026 |

---

## Seed Demo Data

After running migrations, optionally load demo data:

```bash
# Using Supabase SQL Editor:
# Paste and run the contents of database/seed.sql
```

Or via CLI:
```bash
npx supabase db execute --file database/seed.sql
```

This creates sample faculties, departments, programs, news articles, notices, events, and faculty members.

---

## Branding Changes

### University Name & Tagline
Edit `src/types/settings.ts` → `PAGE_SETTINGS_DEFAULTS` object, or change via the **Admin Dashboard → Settings** page at runtime.

### Logo & Favicon
Replace files in `public/`:
- `favicon.ico` — browser tab icon
- Add your logo SVG/PNG to `public/` and reference it in components

### Colours
Edit `src/app/globals.css` — the project uses a `campus-*` colour palette via Tailwind CSS custom theme.

### Fonts
Edit `src/app/layout.tsx` — currently uses `Roboto Condensed` (Latin) and `Noto Sans Bengali` (Bengali) via `next/font/google`.

### Hero Slides & Content
All homepage content, hero carousel slides, section text, and CTA buttons can be modified via **Admin Dashboard → Settings** without code changes.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Cannot find module '@supabase/ssr'` | Run `npm install` to restore dependencies |
| Migrations fail with "relation already exists" | Migrations are idempotent; safe to re-run. Check `IF NOT EXISTS` clauses. |
| Auth redirects loop | Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct |
| AI features not working | Check `GOOGLE_GENERATIVE_AI_API_KEY` is set and has quota |
| Storage upload fails | Ensure storage buckets exist (run migration 0001, 0010, 0014, 0020) |
| 500 errors on admin pages | Confirm the logged-in user has `role = 'ADMIN'` in the profiles table |
| PDF viewer blank | `pdfjs-dist` requires the worker; check `serverExternalPackages` in `next.config.ts` |
