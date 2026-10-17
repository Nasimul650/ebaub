# Changelog

All notable changes to the EBAUB Digital Campus project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
