<div align="center">
  <h1>🎓 EBAUB Digital Campus</h1>
  <p><strong>Official web portal & headless CMS for EXIM Bank Agricultural University Bangladesh</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-16.3-black?logo=next.js" alt="Next.js">
    <img src="https://img.shields.io/badge/React-19.2-blue?logo=react" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase" alt="Supabase">
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-38BDF8?logo=tailwindcss" alt="Tailwind">
  </p>
</div>

---

## 📋 What Is This?

EBAUB Digital Campus is a full-featured university web portal designed for **students**, **teachers**, and **administrators** at EXIM Bank Agricultural University Bangladesh. It serves as a centralized platform for academic management, content publishing, AI-powered learning, and institutional communication.

## 👥 Who Is It For?

| Role | Access |
|------|--------|
| **Public Visitors** | Browse news, notices, events, faculty directory, academics, admissions, contact |
| **Students** | AI Study Assistant & Tutor, Study Hub with PDF/DOCX viewer, Exam Center, Course Materials, Personal File Manager |
| **Teachers** | Course Material Management, AI Quiz/Exam Generator (MCQ, Short, Creative), Student Submission Grading, Teaching Dashboard |
| **Administrators** | Full CMS (News, Notices, Events, Faculty, Programs, Admissions), User Management, Credential Whitelisting, Page Builder, Site Settings, Media Manager |

## 🚀 Quick Start

See [**HowToSetup.md**](./HowToSetup.md) for detailed installation, database setup (Supabase migrations & seed data), environment variable configuration, and deployment instructions for VPS and Docker.

## ✨ Feature List

### Public Website

- 🏠 Animated hero carousel with GSAP scroll animations
- 📰 News articles with categories & rich content
- 📢 Notice board with attachments & audience targeting
- 📅 Events calendar & academic calendar
- 🏛️ Faculty & department directory with profiles
- 🎓 Academic programs browser with deep-linking
- 📝 Admissions information (per-faculty CMS-driven)
- 📬 Contact form with message inbox
- 🔍 Global search (Cmd/Ctrl+K command palette)
- 🤖 Public AI floating assistant widget

### Student Portal (`/student`)

- 🤖 AI Study Assistant — Chat with Gemini AI, web search via Tavily
- 📖 Study Hub — Open PDFs/DOCX, annotate, take notes per session
- 📝 Exam Center — Take published quizzes, practice exams, view results
- 📚 Course Materials — Browse department-wise teacher uploads
- 📁 Personal File Manager — Upload & manage study files
- 📢 Student-targeted notices

### Teacher Portal (`/teacher`)

- 📊 Teaching Dashboard with stats overview
- 📁 Course Material Upload — Multi-department tagging, 50MB file support
- 🧠 AI Exam Generator — Generate MCQ, Short Answer, Creative questions from topics
- 📝 Quiz Manager — Create, edit, publish, print exams
- 📋 Student Submission Viewer & Grading
- 🤖 AI Assistant for teachers

### Admin Dashboard (`/admin`)

- 📊 Dashboard with metrics, quick actions, recent activity
- 📰 News CMS — Create, edit, publish articles
- 📢 Notice CMS — Manage notices with categories & priority
- 📅 Events & Academic Calendar management
- 🏛️ Faculty member profiles CMS
- 🎓 Academic Structure Manager (Faculties → Departments → Programs)
- 📝 Admissions CMS (per-faculty)
- 🔧 Page Builder — Block-based CMS (Hero, Stats, CTA, RichText, TextImage)
- ⚙️ Site Settings — Page-based configuration for all public pages
- 👥 User Management — Create accounts, assign roles
- 🔐 Credential Whitelist — Pre-register institutional IDs
- 📬 Contact Message Inbox
- 🖼️ Media Manager

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16.3 (App Router) |
| **UI Library** | React 19.2 |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS 4 |
| **Database** | Supabase (PostgreSQL) with Row-Level Security |
| **Auth** | Supabase Auth (email/password) with role-based middleware |
| **AI** | Google Gemini via Vercel AI SDK, Tavily web search |
| **Rich Text** | TipTap Editor |
| **PDF/Doc Viewer** | react-pdf-viewer, mammoth (DOCX), pptxgenjs |
| **Animations** | GSAP 3.15 with React integration |
| **UI Components** | Radix UI, Lucide Icons, cmdk |
| **Math Rendering** | KaTeX with rehype-katex |
| **Forms** | React Hook Form + Zod validation |
| **Deployment** | Vercel / any Node.js host |

## 📁 Project Structure

```
ebaub/
├── public/                   # Static assets (SVGs, video)
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/           # Login, signup, email verification
│   │   ├── (public)/         # Public website pages
│   │   ├── actions/          # Server Actions (auth, cms, quiz, etc.)
│   │   ├── admin/            # Admin dashboard (role-protected)
│   │   ├── api/              # API routes (chat, quiz gen, search, proxies)
│   │   ├── auth/             # Auth callback handler
│   │   ├── settings/         # User profile settings
│   │   ├── student/          # Student portal (role-protected)
│   │   └── teacher/          # Teacher portal (role-protected)
│   ├── components/           # React components organized by feature
│   ├── lib/                  # Utilities (GSAP config, cn helper, mock data)
│   ├── types/                # TypeScript type definitions
│   └── utils/supabase/       # Supabase client helpers (server, client, admin, middleware)
├── supabase/migrations/      # 21 migration files (full schema from scratch)
├── .env.example              # Environment variable template
├── HowToSetup.md             # Installation & deployment guide
├── CHANGELOG.md              # Version history
└── package.json              # Dependencies & scripts
```

## 🔒 Security

- **Middleware-level auth** — All `/admin`, `/teacher`, `/student`, `/settings` routes are protected via Next.js middleware with Supabase session validation
- **Server-side layout guards** — Each portal layout verifies role before rendering
- **Row-Level Security (RLS)** — Every Supabase table has RLS enabled with role-based policies
- **Credential Whitelist** — Pre-registered institutional IDs required for signup
- **Service role isolation** — Admin operations use service role key server-side only

## 📸 Screenshots

> _Screenshots can be added here_

## 📄 Licence

This project is proprietary software developed for EXIM Bank Agricultural University Bangladesh (EBAUB). All rights reserved.
