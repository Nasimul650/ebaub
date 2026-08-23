# EBAUB Digital Campus Prototype - Current State & Walkthrough

## 1. Overview
The platform is a fully dynamic, Next.js 15 (App Router) prototype for EXIM Bank Agricultural University Bangladesh. 

## 2. Core Modules Implemented

### A. Admissions Module (Dynamic CMS-driven)
- **Public UI (`/admissions`)**: Displays available faculties with rich, interactive, animated interfaces. Built natively using GSAP scroll triggers and state-driven Radix-style tabs.
- **Admin CMS (`/admin/admissions`)**: Manage requirements, application processes, and deadlines per-faculty via the admin dashboard.
- **Backend Architecture**: Driven by `admissions_info` table (1-to-1 with faculties).

### B. Contact Us Inbox System
- **Public UI (`/contact`)**: Form securely inserts rows anonymously directly into Supabase (via `FOR INSERT WITH CHECK (true)` policy).
- **Admin CMS (`/admin/messages`)**: Read, mark as resolved, and permanently delete messages. Protected strictly by Admin `is_admin()` Row Level Security.

### C. Global Command Menu (Search)
- Press `Cmd/Ctrl + K` anywhere to open.
- Concurrently queries `news`, `notices`, `faculty`, and `programs`.
- Rich empty state features "Quick Navigation Commands" for top-level directories.

### D. Academic Organization
- `Faculties` -> `Departments` -> `Programs` / `Faculty Members`.
- **Public UI (`/academics`)**: Dynamic directory with live search filtering and URL-parameter deep-linking (`?faculty=uuid`).

## 3. Deployment Notes
- Any SQL schemas prefixed with `000x_...sql` in `supabase/migrations/` need to be pushed manually by the repository owner (`npx supabase db push`) to reflect live in the cloud.
