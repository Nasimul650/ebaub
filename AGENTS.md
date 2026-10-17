<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# EBAUB Digital Campus — AI Agent Guide

## Architecture

- **Framework:** Next.js 16.3 (App Router) with React 19 and TypeScript
- **Backend:** Supabase (PostgreSQL) with Row-Level Security (RLS) on every table
- **Auth:** Supabase Auth (email/password) with three roles: ADMIN, TEACHER, STUDENT
- **Middleware:** `src/proxy.ts` intercepts all requests → `src/utils/supabase/middleware.ts` handles session refresh and role-based route protection
- **AI:** Google Gemini via Vercel AI SDK (`ai` package) + Tavily web search
- **Styling:** Tailwind CSS 4 with custom `campus-*` colour palette

## Folder Map

```
src/
├── app/
│   ├── (auth)/           # Login, signup, email verification pages
│   ├── (public)/         # Public-facing pages (home, news, academics, etc.)
│   ├── actions/          # Server Actions — all mutating logic lives here
│   │   ├── auth.ts       # Login/signup/logout
│   │   ├── cms.ts        # News, notices, events, faculty, programs CRUD
│   │   ├── contact.ts    # Contact form submission
│   │   ├── exam.ts       # Exam submission & grading
│   │   ├── grading.ts    # Teacher grading actions
│   │   ├── profile.ts    # User profile updates
│   │   ├── quiz.ts       # Quiz CRUD & AI generation
│   │   ├── settings.ts   # Site settings management
│   │   ├── study-hub.ts  # Study session CRUD
│   │   ├── teacher.ts    # Teacher material management
│   │   ├── whitelist.ts  # Credential whitelist management
│   │   └── admin-users.ts # Admin user creation
│   ├── admin/            # Admin dashboard (ADMIN role required)
│   ├── api/              # API routes (chat, quiz gen, search, proxies)
│   ├── student/          # Student portal (STUDENT/ADMIN role required)
│   └── teacher/          # Teacher portal (TEACHER/ADMIN role required)
├── components/           # React components grouped by feature
│   ├── admin/            # Admin dashboard components + page-builder/
│   ├── student/          # Student portal components + study-hub/ + exams/
│   ├── teacher/          # Teacher portal components
│   ├── home/             # Homepage sections
│   ├── layout/           # Navbar, Footer, MegaMenu, etc.
│   ├── public/           # Public widgets (AI assistant, search modal)
│   ├── shared/           # Reusable components (PageHeader, ErrorState, etc.)
│   └── ui/               # Primitives (button, card, dialog, input, etc.)
├── lib/
│   ├── utils.ts          # cn() helper (clsx + tailwind-merge)
│   ├── gsapConfig.ts     # GSAP animation registration
│   └── mock/             # Mock data & services for offline dev
├── types/
│   ├── index.ts          # Domain types (UserRole, NewsItem, Quiz, Page, etc.)
│   └── settings.ts       # Site settings types & defaults
└── utils/supabase/
    ├── client.ts         # Browser Supabase client
    ├── server.ts         # Server Component/Action Supabase client
    ├── admin.ts          # Service role client (privileged ops)
    ├── middleware.ts      # Session refresh + role-based route guards
    └── queries.ts        # Centralised read queries
```

## Conventions

1. **Server Actions over API routes** — All mutations go through `src/app/actions/`. API routes are only for streaming (AI chat) and file proxies.
2. **Auth pattern** — Every server action that mutates data calls `supabase.auth.getUser()` and checks `profile.role` before proceeding.
3. **RLS as defence-in-depth** — Even if server action auth is bypassed, Supabase RLS policies enforce role checks at the database level.
4. **Component naming** — PascalCase, grouped by feature domain (e.g., `components/admin/NewsForm.tsx`).
5. **Types** — All domain types in `src/types/index.ts`. Settings types in `src/types/settings.ts`.
6. **Styling** — Tailwind utility classes. Custom theme colours prefixed with `campus-`. No CSS modules.
7. **Forms** — React Hook Form + Zod for client validation. Server-side validation in actions.

## Database

- 21 incremental migrations in `supabase/migrations/`
- Key tables: `profiles`, `faculties`, `departments`, `programs`, `courses`, `news`, `notices`, `events`, `faculty_members`, `pages`, `site_settings`, `contact_messages`, `admissions_info`, `course_materials`, `quizzes`, `quiz_questions`, `credential_whitelist`, `ai_chat_sessions`, `study_sessions`, `exam_submissions`, `exam_answers`
- Helper functions: `is_admin()`, `is_teacher()`, `is_student()` — used in RLS policies

## How to Run Tests

No test suite is configured yet. To add tests:
1. Install: `npm install -D vitest @testing-library/react`
2. Add to package.json scripts: `"test": "vitest"`
3. Place test files as `*.test.ts(x)` alongside source files

## Key Commands

```bash
npm run dev      # Start dev server on port 3000
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```
