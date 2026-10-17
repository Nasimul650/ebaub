# Changelog

All notable changes to the EBAUB Digital Campus project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-10-18

### Security & Hardening
- Enforced strict role-based and ownership checks on all server actions and API endpoints
- Disallowed auto-confirm backdoor in production; requires proper email verification flow
- Added current password verification for self-service credential changes
- Created dedicated privileged `adminResetTeacherPassword` action with explicit admin checks
- Masked sensitive password strings in administrative UI and clipboard exports
- Enforced origin whitelisting on file-proxy and pdf-proxy endpoints to prevent SSRF

### Architecture & Modularity
- Refactored monolithic server action files into domain-specific modules (`news.ts`, `notices.ts`, `events.ts`, `faculty.ts`, `programs.ts`, `signup.ts`, `password-reset.ts`, `whitelist-verify.ts`, `upload-material.ts`, `delete-material.ts`, `adminSettings.ts`, `userPreferences.ts`, `systemConfig.ts`)
- Centralized configuration and environment validation in `src/lib/config.ts`
- Centralized form parsing, password strength, and RFC-compliant email validation in `src/lib/form-parser.ts`
- Extracted shared database queries into `src/lib/queries/` (`profile.ts`, `whitelist.ts`)
- Separated `StudyHubWorkspace` into composable `ViewerContainer` and `NoteEditor` components

### Database & Performance
- Added `0022_performance_indexes.sql` with B-tree indexes across all foreign keys, roles, and composite queries
- Refreshed consolidated `database/schema.sql` with performance optimizations

## [1.0.0] - 2026-10-18

### Added

#### Core Platform

- Next.js 16.3 (App Router) with React 19 and TypeScript
- Supabase (PostgreSQL) backend with 21 migration files and full Row-Level Security
- Role-based authentication system (Admin, Teacher, Student) with middleware guards
- Credential whitelisting for institutional ID-based registration
- Responsive design with Tailwind CSS 4

#### Public Website

- Animated hero carousel with GSAP scroll-triggered animations
- News articles CMS with categories, rich content, and cover images
- Notice board with attachments, categories (Academic/Admission/General/Exam), and audience targeting
- Events listing with detail pages and academic calendar
- Faculty & department directory with member profiles
- Academic programs browser with faculty-based deep-linking
- Admissions information pages (per-faculty CMS-driven)
- Contact form with admin message inbox
- Global command palette search (Ctrl/Cmd+K) across news, notices, faculty, programs
- Public AI floating assistant widget (Gemini-powered)
- Block-based Page Builder (Hero, Stats, CTA Banner, Rich Text, Text+Image blocks)
- Page-based site settings for all public pages, header, and footer

#### Student Portal

- AI Study Assistant — conversational chat with Google Gemini + Tavily web search
- AI Tutor — dedicated tutoring interface
- Study Hub — PDF/DOCX viewer workspace with per-session notes
- Exam Center — take published quizzes, AI-generated practice exams, view scored results
- Course materials browser (department-filtered teacher uploads)
- Personal file manager with 50MB upload support
- Student-targeted notice feed

#### Teacher Portal

- Teaching dashboard with overview statistics
- Course material management — upload, tag to multiple departments, preview
- AI Exam Generator — generate MCQ, Short Answer, and Creative questions from any topic
- Quiz manager — create, edit, publish, and print-ready exam formatting
- Student submission viewer with grading interface
- Teacher AI assistant

#### Admin Dashboard

- Admin metrics grid, quick actions, and recent activity feed
- Full News & Notice CMS (CRUD + publish/unpublish)
- Events & Academic Calendar management
- Faculty member profile management
- Academic structure manager (Faculties → Departments → Programs)
- Admissions CMS (per-faculty requirements, process steps, dates)
- User account management — create users with role assignment
- Credential whitelist manager — pre-register institutional IDs
- Contact message inbox (read, resolve, delete)
- Media manager for uploaded assets
- Block-based About page builder
- Centralized site settings editor (per-page configuration)

#### Infrastructure

- 21 incremental SQL migrations covering full database schema
- Supabase Storage buckets: public_media, student_files, teacher_materials, course_materials, personal_study_files, avatars
- Storage RLS policies per bucket and role
- Supabase SSR for server-side authentication
- API routes: AI chat, quiz generation, study assistant, PDF/file proxy, DOCX converter, global search
- Mock data services for offline/demo development
