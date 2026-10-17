-- =============================================================================
-- EBAUB Digital Campus — Complete Database Schema (Consolidated)
-- =============================================================================

-- =============================================================================
-- FILE: 0001_initial_schema.sql
-- =============================================================================

-- Migration: 0001_initial_schema
-- Description: Initial schema for EBAUB Digital Campus

-- 1. Custom Types
CREATE TYPE public.user_role AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');

-- 2. Profiles Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.user_role NOT NULL DEFAULT 'STUDENT',
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profiles_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for creating profile on auth.users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (
        new.id,
        new.email,
        COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'STUDENT'::public.user_role)
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Core Academic Structure Tables
CREATE TABLE public.faculties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES public.faculties(id) ON DELETE CASCADE,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    degree_level TEXT NOT NULL,
    duration_years INT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    credits INT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. User Extension Tables
CREATE TABLE public.teachers (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    designation TEXT NOT NULL,
    bio TEXT,
    joined_at DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE public.students (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
    student_id TEXT NOT NULL UNIQUE,
    enrollment_year INT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE'
);

-- 5. Content Tables
CREATE TABLE public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER on_news_updated
    BEFORE UPDATE ON public.news
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    file_url TEXT,
    category TEXT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    event_date TIMESTAMPTZ NOT NULL,
    location TEXT,
    organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.research (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    abstract TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    publication_date DATE,
    url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    mime_type TEXT,
    size_bytes BIGINT,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Row Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Profiles are readable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete profiles" ON public.profiles FOR DELETE USING (public.is_admin());

-- Generic Public Read & Admin Mod Policies
CREATE POLICY "Faculties are readable by everyone" ON public.faculties FOR SELECT USING (true);
CREATE POLICY "Faculties modified by admins" ON public.faculties FOR ALL USING (public.is_admin());

CREATE POLICY "Departments are readable by everyone" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Departments modified by admins" ON public.departments FOR ALL USING (public.is_admin());

CREATE POLICY "Programs are readable by everyone" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Programs modified by admins" ON public.programs FOR ALL USING (public.is_admin());

CREATE POLICY "Courses are readable by everyone" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Courses modified by admins" ON public.courses FOR ALL USING (public.is_admin());

CREATE POLICY "Teachers are readable by everyone" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Teachers modified by admins" ON public.teachers FOR ALL USING (public.is_admin());

CREATE POLICY "Students are readable by everyone" ON public.students FOR SELECT USING (true);
CREATE POLICY "Students modified by admins" ON public.students FOR ALL USING (public.is_admin());

CREATE POLICY "News are readable by everyone" ON public.news FOR SELECT USING (true);
CREATE POLICY "News modified by admins" ON public.news FOR ALL USING (public.is_admin());

CREATE POLICY "Notices are readable by everyone" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Notices modified by admins" ON public.notices FOR ALL USING (public.is_admin());

CREATE POLICY "Events are readable by everyone" ON public.events FOR SELECT USING (true);
CREATE POLICY "Events modified by admins" ON public.events FOR ALL USING (public.is_admin());

CREATE POLICY "Research is readable by everyone" ON public.research FOR SELECT USING (true);
CREATE POLICY "Research modified by admins" ON public.research FOR ALL USING (public.is_admin());

CREATE POLICY "Media is readable by everyone" ON public.media FOR SELECT USING (true);
CREATE POLICY "Media modified by admins" ON public.media FOR ALL USING (public.is_admin());

-- 7. Storage Buckets & Policies

-- Insert buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('public_media', 'public_media', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('student_files', 'student_files', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('teacher_materials', 'teacher_materials', false);

-- Helper functions for storage RLS
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'TEACHER'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_student()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'STUDENT'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public Media Policies
CREATE POLICY "Public media is publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'public_media');

CREATE POLICY "Admins can upload public media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'public_media' AND public.is_admin());

CREATE POLICY "Admins can update public media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'public_media' AND public.is_admin());

CREATE POLICY "Admins can delete public media"
ON storage.objects FOR DELETE
USING (bucket_id = 'public_media' AND public.is_admin());

-- Student Files Policies
CREATE POLICY "Students and Admins can view student files"
ON storage.objects FOR SELECT
USING (bucket_id = 'student_files' AND (public.is_admin() OR public.is_student()));

CREATE POLICY "Students and Admins can upload student files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'student_files' AND (public.is_admin() OR public.is_student()));

CREATE POLICY "Students and Admins can update student files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'student_files' AND (public.is_admin() OR public.is_student()));

CREATE POLICY "Students and Admins can delete student files"
ON storage.objects FOR DELETE
USING (bucket_id = 'student_files' AND (public.is_admin() OR public.is_student()));

-- Teacher Materials Policies
CREATE POLICY "Teachers and Admins can view teacher materials"
ON storage.objects FOR SELECT
USING (bucket_id = 'teacher_materials' AND (public.is_admin() OR public.is_teacher()));

CREATE POLICY "Teachers and Admins can upload teacher materials"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'teacher_materials' AND (public.is_admin() OR public.is_teacher()));

CREATE POLICY "Teachers and Admins can update teacher materials"
ON storage.objects FOR UPDATE
USING (bucket_id = 'teacher_materials' AND (public.is_admin() OR public.is_teacher()));

CREATE POLICY "Teachers and Admins can delete teacher materials"
ON storage.objects FOR DELETE
USING (bucket_id = 'teacher_materials' AND (public.is_admin() OR public.is_teacher()));


-- =============================================================================
-- FILE: 0002_news_notices_fields.sql
-- =============================================================================

ALTER TABLE public.news ADD COLUMN summary TEXT, ADD COLUMN image_url TEXT, ADD COLUMN category TEXT; ALTER TABLE public.notices ADD COLUMN date DATE, ADD COLUMN priority TEXT, ADD COLUMN description TEXT, ADD COLUMN attachment_url TEXT;

-- =============================================================================
-- FILE: 0003_events_faculty.sql
-- =============================================================================

ALTER TABLE public.events 
ADD COLUMN time TEXT,
ADD COLUMN status TEXT DEFAULT 'Upcoming',
ADD COLUMN image_url TEXT;

CREATE TABLE public.faculty_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    bio TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.faculty_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Faculty is readable by everyone" ON public.faculty_members FOR SELECT USING (true);
CREATE POLICY "Faculty modified by admins" ON public.faculty_members FOR ALL USING (public.is_admin());


-- =============================================================================
-- FILE: 0004_academic_calendar.sql
-- =============================================================================

CREATE TABLE public.academic_calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    category TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.academic_calendar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Calendar is readable by everyone" ON public.academic_calendar FOR SELECT USING (true);
CREATE POLICY "Calendar modified by admins" ON public.academic_calendar FOR ALL USING (public.is_admin());


-- =============================================================================
-- FILE: 0005_contact_messages.sql
-- =============================================================================

CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a contact message (including anon)
CREATE POLICY "Anyone can submit contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Only admins can read, update, delete
CREATE POLICY "Admins can manage contact messages" ON public.contact_messages FOR ALL USING (public.is_admin());


-- =============================================================================
-- FILE: 0006_admissions_info.sql
-- =============================================================================


CREATE TABLE public.admissions_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES public.faculties(id) ON DELETE CASCADE,
    requirements TEXT,
    process_steps TEXT,
    important_dates TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(faculty_id)
);

ALTER TABLE public.admissions_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admissions info is readable by everyone" ON public.admissions_info FOR SELECT USING (true);
CREATE POLICY "Admissions info modified by admins" ON public.admissions_info FOR ALL USING (public.is_admin());



-- =============================================================================
-- FILE: 0007_pages_builder.sql
-- =============================================================================

-- Migration: 0007_pages_builder
-- Description: Pages table with block-based content builder (JSONB content_blocks)

-- 1. Create pages table
CREATE TABLE public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at (reuses existing trigger function)
CREATE TRIGGER on_pages_updated
    BEFORE UPDATE ON public.pages
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. Row Level Security
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published pages"
    ON public.pages FOR SELECT
    USING (is_published = true);

CREATE POLICY "Admins can do everything with pages"
    ON public.pages FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'ADMIN'
        )
    );

-- 3. Seed the About page with initial block content
INSERT INTO public.pages (slug, title, is_published, content_blocks)
VALUES (
    'about',
    'About EBAUB',
    true,
    '[{"type":"hero","data":{"badge":"About EXIM Bank Agricultural University Bangladesh","headline":"Pioneering Excellence in Science, Agriculture & Technology","subheadline":"Established in 2022, EBAUB stands as a beacon of academic leadership in Rajshahi, Bangladesh."}},{"type":"text_image","data":{"title":"Our Vision","paragraph":"To become a premier regional and international university recognized for cutting-edge research in Computer Science, Agricultural Engineering, and sustainable technology.","image_url":"","image_alignment":"right"}},{"type":"text_image","data":{"title":"Our Mission","paragraph":"To empower students with rigorous academic foundations, hands-on software & agricultural engineering skills, ethical leadership, and continuous innovation.","image_url":"","image_alignment":"left"}},{"type":"stats","data":{"headline":"By the Numbers","stats":[{"value":"2+","label":"Years of Excellence"},{"value":"160+","label":"Enrolled Students"},{"value":"15+","label":"Expert Faculty"},{"value":"5+","label":"Programs Offered"}]}},{"type":"cta_banner","data":{"headline":"CSE Department 2-Year Anniversary Milestone","description":"Celebrating 2 years of academic breakthroughs, innovative curriculum, and digital transformation in the Department of Computer Science & Engineering.","button_text":"View Programs","button_link":"/academics"}}]'
);


-- =============================================================================
-- FILE: 0008_site_settings.sql
-- =============================================================================

-- Migration: 0008_site_settings
-- Description: Centralized Site Settings (Static Content Manager) table with key-value / grouped JSONB structure

-- 1. Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'on_site_settings_updated'
    ) THEN
        CREATE TRIGGER on_site_settings_updated
            BEFORE UPDATE ON public.site_settings
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
END $$;

-- 2. Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public / Anon users can read settings
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
    ON public.site_settings FOR SELECT
    USING (true);

-- Authenticated Admins can manage all settings (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
CREATE POLICY "Admins can manage site settings"
    ON public.site_settings FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'ADMIN'
        )
    );

-- 3. Seed initial default settings data
INSERT INTO public.site_settings (id, data)
VALUES 
(
    'hero',
    '{
        "headline": "Empowering the next generation of engineers.",
        "subtitle": "EXIM Bank Agricultural University Bangladesh (EBAUB) combines academic excellence, hands-on learning, and state-of-the-art research in engineering, agriculture, and business to shape leaders for tomorrow.",
        "video_url": "",
        "fallback_image_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200",
        "badge_text": "Excellence in Higher Education"
    }'::jsonb
),
(
    'general',
    '{
        "site_name": "EXIM Bank Agricultural University Bangladesh",
        "short_name": "EBAUB",
        "tagline": "Excellence in Agricultural Sciences, Engineering & Business",
        "meta_description": "Official portal of EXIM Bank Agricultural University Bangladesh (EBAUB). Explore undergraduate & graduate programs in CSE, Agriculture, Business, and Law.",
        "accreditation": "Approved by UGC & Ministry of Education, Govt. of the People''s Republic of Bangladesh"
    }'::jsonb
),
(
    'contact',
    '{
        "campus_address": "69-69/1, Boro Indara More, Chapai Nawabganj, 6300, Bangladesh",
        "inquiries_email": "info@ebaub.edu.bd",
        "admissions_email": "admission@ebaub.edu.bd",
        "hotline_phone": "02-588893525",
        "admissions_phone": "02-588893526 to 29",
        "office_hours": "Sunday - Thursday: 9:00 AM - 5:00 PM (Friday & Saturday Closed)"
    }'::jsonb
),
(
    'socials',
    '{
        "facebook_url": "https://www.facebook.com/ebaub.chapai",
        "linkedin_url": "https://www.linkedin.com/company/ebaub",
        "youtube_url": "https://www.youtube.com/@ebaub",
        "student_portal_url": "/student",
        "teacher_portal_url": "/teacher"
    }'::jsonb
)
ON CONFLICT (id) DO UPDATE 
SET data = EXCLUDED.data, updated_at = NOW();


-- =============================================================================
-- FILE: 0009_page_based_site_settings.sql
-- =============================================================================

-- Migration: 0009_page_based_site_settings
-- Description: Scale site_settings table to a Page-Based Architecture (excluding block-based 'about' page)

-- 1. Ensure site_settings table exists
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at trigger
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'on_site_settings_updated'
    ) THEN
        CREATE TRIGGER on_site_settings_updated
            BEFORE UPDATE ON public.site_settings
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
END $$;

-- 2. Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
    ON public.site_settings FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
CREATE POLICY "Admins can manage site settings"
    ON public.site_settings FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'ADMIN'
        )
    );

-- 3. Seed / Upsert Page-Based Configuration Records
INSERT INTO public.site_settings (id, data)
VALUES 
(
    'global_footer',
    '{
        "site_name": "EXIM Bank Agricultural University Bangladesh",
        "short_name": "EBAUB",
        "tagline": "Excellence in Agricultural Sciences, Engineering & Business",
        "accreditation": "Approved by UGC & Ministry of Education, Govt. of the People''s Republic of Bangladesh",
        "campus_address": "69-69/1, Boro Indara More, Chapai Nawabganj, 6300, Bangladesh",
        "inquiries_email": "info@ebaub.edu.bd",
        "admissions_email": "admission@ebaub.edu.bd",
        "hotline_phone": "02-588893525",
        "admissions_phone": "02-588893526 to 29",
        "office_hours": "Sunday - Thursday: 9:00 AM - 5:00 PM (Friday & Saturday Closed)",
        "facebook_url": "https://www.facebook.com/ebaub.chapai",
        "linkedin_url": "https://www.linkedin.com/company/ebaub",
        "youtube_url": "https://www.youtube.com/@ebaub",
        "student_portal_url": "/student",
        "teacher_portal_url": "/teacher"
    }'::jsonb
),
(
    'home',
    '{
        "badge_text": "CSE Department 2-Year Anniversary Prototype",
        "hero_headline": "Empowering the next generation of engineers.",
        "hero_subtitle": "EXIM Bank Agricultural University Bangladesh (EBAUB) combines rigorous academic foundations, hands-on engineering, and digital campus workflows.",
        "hero_video_url": "",
        "hero_fallback_image_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=85",
        "explore_cta_text": "Explore Degree Programs",
        "admissions_cta_text": "Admission Guidelines",
        "accreditation_metric": "UGC Bangladesh Approved",
        "curriculum_metric": "160 Credit Curriculum"
    }'::jsonb
),
(
    'academics',
    '{
        "header_badge": "Academics & Degree Programs",
        "header_headline": "Explore EBAUB Faculties, Departments & Curriculums",
        "header_description": "Discover our industry-aligned undergraduate degree offerings designed to build technical proficiency and leadership capabilities.",
        "advising_contact_email": "academic.advising@ebaub.edu.bd",
        "curriculum_overview_text": "All degree curriculums follow outcome-based education (OBE) guidelines recommended by UGC Bangladesh."
    }'::jsonb
),
(
    'admissions',
    '{
        "header_badge": "Fall 2027 Admissions Open",
        "header_headline": "Begin Your Journey at EXIM Bank Agricultural University",
        "header_description": "Discover your potential with our rigorous academic programs. Explore requirements, application steps, and key dates below.",
        "apply_cta_text": "Apply Now",
        "deadline_highlight_text": "Spring & Fall 2027 Application Deadlines are actively underway.",
        "financial_aid_snippet": "Need-based scholarships, merit waivers (up to 100%), and EXIM Bank Foundation stipends available for eligible students.",
        "admissions_hotline": "02-588893526 to 29",
        "admissions_email": "admission@ebaub.edu.bd"
    }'::jsonb
),
(
    'faculty',
    '{
        "header_badge": "Distinguished Educators",
        "header_headline": "Academic Faculty Directory",
        "header_description": "Meet our dedicated academic staff committed to excellence in teaching, research, and innovation across our various faculties and departments.",
        "join_faculty_notice": "Interested in joining our academic roster? Submit your CV and research portfolio to hr@ebaub.edu.bd.",
        "research_focus_text": "Leading breakthroughs in Precision Agriculture, Software Architecture, Machine Learning, and Agribusiness."
    }'::jsonb
),
(
    'student_life',
    '{
        "header_badge": "Campus Events & Student Life",
        "header_headline": "Vibrant Campus Life & Extracurriculars",
        "header_description": "Stay connected with upcoming academic events, workshops, seminars, and student activities across the campus.",
        "clubs_highlight_text": "Join 15+ student clubs including EBAUB Computer Club, Robotics Guild, Cultural Society, and Agri-Tech Innovators.",
        "facilities_snippet": "Modern computer labs, smart classrooms, botanical research fields, central library, and high-speed campus WiFi."
    }'::jsonb
),
(
    'contact',
    '{
        "header_badge": "Contact EBAUB",
        "header_headline": "Get in Touch with EBAUB University Administration",
        "header_description": "We welcome inquiries regarding admissions, departmental programs, research collaborations, and campus visits.",
        "campus_address": "69-69/1, Boro Indara More, Chapai Nawabganj, 6300, Bangladesh",
        "inquiries_email": "info@ebaub.edu.bd",
        "hotline_phone": "02-588893525",
        "admissions_phone": "02-588893526 to 29",
        "office_hours": "Sunday â€“ Thursday: 9:00 AM â€“ 5:00 PM (Friday & Saturday Closed)",
        "transport_directions": "Located at Boro Indara More, easily accessible via regional transport from Rajshahi and Chapai Nawabganj town centers."
    }'::jsonb
)
ON CONFLICT (id) DO UPDATE 
SET data = EXCLUDED.data, updated_at = NOW();


-- =============================================================================
-- FILE: 0010_course_materials.sql
-- =============================================================================

-- Migration: 0010_course_materials
-- Description: Course materials management table and storage bucket for Teacher Dashboard

-- 1. Create or configure course_materials storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'course_materials',
    'course_materials',
    true,
    52428800, -- 50 MB in bytes
    ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/zip',
        'application/x-zip-compressed',
        'application/octet-stream',
        'text/plain'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Policies for course_materials bucket
DROP POLICY IF EXISTS "Course materials are viewable by authenticated users" ON storage.objects;
CREATE POLICY "Course materials are viewable by authenticated users"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'course_materials' AND (
        auth.role() = 'authenticated' OR true -- allow public access since public = true
    )
);

DROP POLICY IF EXISTS "Teachers and admins can upload course materials" ON storage.objects;
CREATE POLICY "Teachers and admins can upload course materials"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'course_materials' AND (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('TEACHER', 'ADMIN')
        )
    )
);

DROP POLICY IF EXISTS "Teachers can delete own course materials storage" ON storage.objects;
CREATE POLICY "Teachers can delete own course materials storage"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'course_materials' AND (
        (name LIKE (auth.uid()::text || '/%'))
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    )
);

-- 2. Create course_materials table
CREATE TABLE IF NOT EXISTS public.course_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_code TEXT NOT NULL,
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for speedy queries
CREATE INDEX IF NOT EXISTS idx_course_materials_teacher ON public.course_materials(teacher_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_course_materials_course ON public.course_materials(course_code);

-- 3. Row Level Security (RLS) on course_materials table
ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;

-- SELECT: Authenticated users with roles Teacher, Student, or Admin can view materials
DROP POLICY IF EXISTS "Teachers, Students, and Admins can view course materials" ON public.course_materials;
CREATE POLICY "Teachers, Students, and Admins can view course materials"
ON public.course_materials FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('TEACHER', 'STUDENT', 'ADMIN')
    )
);

-- INSERT: Only authenticated users with Teacher or Admin role can upload
DROP POLICY IF EXISTS "Teachers and Admins can insert course materials" ON public.course_materials;
CREATE POLICY "Teachers and Admins can insert course materials"
ON public.course_materials FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('TEACHER', 'ADMIN')
    )
);

-- DELETE: Teachers can only delete records where teacher_id = auth.uid() (and Admins)
DROP POLICY IF EXISTS "Teachers can delete own course materials" ON public.course_materials;
CREATE POLICY "Teachers can delete own course materials"
ON public.course_materials FOR DELETE
USING (
    (teacher_id = auth.uid())
    OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    )
);


-- =============================================================================
-- FILE: 0011_course_material_departments.sql
-- =============================================================================

-- Migration: 0011_course_material_departments
-- Description: Multi-department tagging for course materials & profiles department association

-- 1. Add department_id to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL;

-- 2. Create junction table course_material_departments
CREATE TABLE IF NOT EXISTS public.course_material_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL REFERENCES public.course_materials(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_material_department UNIQUE (material_id, department_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cmd_material_id ON public.course_material_departments(material_id);
CREATE INDEX IF NOT EXISTS idx_cmd_department_id ON public.course_material_departments(department_id);

-- 3. Row Level Security (RLS)
ALTER TABLE public.course_material_departments ENABLE ROW LEVEL SECURITY;

-- SELECT: All authenticated users can view junction records
DROP POLICY IF EXISTS "Authenticated users can view course material departments" ON public.course_material_departments;
CREATE POLICY "Authenticated users can view course material departments"
ON public.course_material_departments FOR SELECT
USING (true);

-- INSERT: Only teachers and admins can insert junction records
DROP POLICY IF EXISTS "Teachers and Admins can insert course material departments" ON public.course_material_departments;
CREATE POLICY "Teachers and Admins can insert course material departments"
ON public.course_material_departments FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('TEACHER', 'ADMIN')
    )
);

-- DELETE: Only teachers and admins can delete junction records
DROP POLICY IF EXISTS "Teachers and Admins can delete course material departments" ON public.course_material_departments;
CREATE POLICY "Teachers and Admins can delete course material departments"
ON public.course_material_departments FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('TEACHER', 'ADMIN')
    )
);


-- =============================================================================
-- FILE: 0012_admin_user_creation.sql
-- =============================================================================

-- Migration: 0012_admin_user_creation
-- Description: Institutional ID, full name, department & faculty associations on profiles, with Admin RLS policies

-- 1. Ensure required columns exist on public.profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS institutional_id TEXT;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS faculty_id UUID REFERENCES public.faculties(id) ON DELETE SET NULL;

-- 2. Add unique index on institutional_id (for non-null entries)
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_institutional_id 
ON public.profiles(institutional_id) 
WHERE institutional_id IS NOT NULL;

-- 3. Update Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- SELECT: Authenticated users can view basic profiles
DROP POLICY IF EXISTS "Profiles are readable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles FOR SELECT
USING (true);

-- INSERT: Admins and service role can insert profiles
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
CREATE POLICY "Admins can insert profiles"
ON public.profiles FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    )
);

-- UPDATE: Admins can update all profiles, users can update their own
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    )
    OR auth.uid() = id
);

-- DELETE: Only Admins can delete profiles
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles"
ON public.profiles FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    )
);


-- =============================================================================
-- FILE: 0013_student_batch.sql
-- =============================================================================

-- Migration: 0013_student_batch
-- Description: Add batch property to students and profiles tables for academic cohort tracking

-- 1. Add batch column to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS batch TEXT;

-- 2. Add batch column to profiles table for fast direct lookups
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS batch TEXT;

-- 3. Create indexes for fast filtering and search performance
CREATE INDEX IF NOT EXISTS idx_students_batch ON public.students(batch);
CREATE INDEX IF NOT EXISTS idx_profiles_batch ON public.profiles(batch);


-- =============================================================================
-- FILE: 0014_user_profile_settings.sql
-- =============================================================================

-- Migration: 0014_user_profile_settings
-- Description: Profile settings fields (avatar_url, bio, phone) and avatars storage bucket with RLS policies

-- 1. Ensure profile columns exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 2. Ensure RLS on profiles allows users to update their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (
    auth.uid() = id 
    OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    )
)
WITH CHECK (
    auth.uid() = id 
    OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    )
);

-- 3. Create or configure avatars storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,
    5242880, -- 5 MB in bytes
    ARRAY[
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/gif'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 4. Storage Policies for avatars bucket

-- SELECT: Public (everyone can view avatars)
DROP POLICY IF EXISTS "Avatars are viewable by everyone" ON storage.objects;
CREATE POLICY "Avatars are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- INSERT: Authenticated users can only upload files in their own folder: ${auth.uid()}/...
DROP POLICY IF EXISTS "Authenticated users can upload own avatar" ON storage.objects;
CREATE POLICY "Authenticated users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
    AND (name LIKE (auth.uid()::text || '/%'))
);

-- UPDATE: Authenticated users can update files in their own folder
DROP POLICY IF EXISTS "Authenticated users can update own avatar" ON storage.objects;
CREATE POLICY "Authenticated users can update own avatar"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'avatars' 
    AND (
        (name LIKE (auth.uid()::text || '/%'))
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    )
);

-- DELETE: Authenticated users can delete files in their own folder
DROP POLICY IF EXISTS "Authenticated users can delete own avatar" ON storage.objects;
CREATE POLICY "Authenticated users can delete own avatar"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'avatars' 
    AND (
        (name LIKE (auth.uid()::text || '/%'))
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    )
);


-- =============================================================================
-- FILE: 0015_profile_username.sql
-- =============================================================================

-- Migration: 0015_profile_username
-- Description: Add username column to public.profiles

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username TEXT;


-- =============================================================================
-- FILE: 0016_quizzes_schema.sql
-- =============================================================================

-- Migration: 0016_quizzes_schema
-- Description: AI-Powered Quizzes and Quiz Questions tables with RLS for Teacher Dashboard

-- 1. Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_code TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    exam_type TEXT NOT NULL DEFAULT 'mcq',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create quiz_questions table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_type TEXT NOT NULL DEFAULT 'mcq',
    question_text TEXT NOT NULL,
    options JSONB DEFAULT '[]'::jsonb,
    correct_answer TEXT,
    suggested_answer TEXT,
    grading_rubric TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_quizzes_teacher_id ON public.quizzes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_course_code ON public.quizzes(course_code);
CREATE INDEX IF NOT EXISTS idx_quizzes_status ON public.quizzes(status);
CREATE INDEX IF NOT EXISTS idx_quizzes_exam_type ON public.quizzes(exam_type);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_question_type ON public.quiz_questions(question_type);

-- Enable Row Level Security (RLS)
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quizzes
-- Teachers and Admins can SELECT their own quizzes (Admins can view all)
DROP POLICY IF EXISTS "Teachers can view own quizzes" ON public.quizzes;
CREATE POLICY "Teachers can view own quizzes"
ON public.quizzes FOR SELECT
USING (
    auth.uid() = teacher_id
    OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    )
);

-- Teachers and Admins can INSERT quizzes
DROP POLICY IF EXISTS "Teachers can insert own quizzes" ON public.quizzes;
CREATE POLICY "Teachers can insert own quizzes"
ON public.quizzes FOR INSERT
WITH CHECK (
    auth.uid() = teacher_id
    OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    )
);

-- Teachers and Admins can UPDATE own quizzes
DROP POLICY IF EXISTS "Teachers can update own quizzes" ON public.quizzes;
CREATE POLICY "Teachers can update own quizzes"
ON public.quizzes FOR UPDATE
USING (
    auth.uid() = teacher_id
    OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    )
);

-- Teachers and Admins can DELETE own quizzes
DROP POLICY IF EXISTS "Teachers can delete own quizzes" ON public.quizzes;
CREATE POLICY "Teachers can delete own quizzes"
ON public.quizzes FOR DELETE
USING (
    auth.uid() = teacher_id
    OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    )
);

-- RLS Policies for quiz_questions
-- View questions if teacher owns the parent quiz or is admin
DROP POLICY IF EXISTS "Teachers can view quiz questions" ON public.quiz_questions;
CREATE POLICY "Teachers can view quiz questions"
ON public.quiz_questions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.quizzes
        WHERE public.quizzes.id = public.quiz_questions.quiz_id
        AND (
            public.quizzes.teacher_id = auth.uid()
            OR EXISTS (
                SELECT 1 FROM public.profiles
                WHERE id = auth.uid() AND role = 'ADMIN'
            )
        )
    )
);

-- Insert questions if teacher owns the parent quiz or is admin
DROP POLICY IF EXISTS "Teachers can insert quiz questions" ON public.quiz_questions;
CREATE POLICY "Teachers can insert quiz questions"
ON public.quiz_questions FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.quizzes
        WHERE public.quizzes.id = public.quiz_questions.quiz_id
        AND (
            public.quizzes.teacher_id = auth.uid()
            OR EXISTS (
                SELECT 1 FROM public.profiles
                WHERE id = auth.uid() AND role = 'ADMIN'
            )
        )
    )
);

-- Update questions if teacher owns the parent quiz or is admin
DROP POLICY IF EXISTS "Teachers can update quiz questions" ON public.quiz_questions;
CREATE POLICY "Teachers can update quiz questions"
ON public.quiz_questions FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.quizzes
        WHERE public.quizzes.id = public.quiz_questions.quiz_id
        AND (
            public.quizzes.teacher_id = auth.uid()
            OR EXISTS (
                SELECT 1 FROM public.profiles
                WHERE id = auth.uid() AND role = 'ADMIN'
            )
        )
    )
);

-- Delete questions if teacher owns the parent quiz or is admin
DROP POLICY IF EXISTS "Teachers can delete quiz questions" ON public.quiz_questions;
CREATE POLICY "Teachers can delete quiz questions"
ON public.quiz_questions FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.quizzes
        WHERE public.quizzes.id = public.quiz_questions.quiz_id
        AND (
            public.quizzes.teacher_id = auth.uid()
            OR EXISTS (
                SELECT 1 FROM public.profiles
                WHERE id = auth.uid() AND role = 'ADMIN'
            )
        )
    )
);


-- =============================================================================
-- FILE: 0017_exam_generator_upgrade.sql
-- =============================================================================

-- Migration: 0017_exam_generator_upgrade
-- Description: Upgrade quizzes and quiz_questions to support Multiple Question Types (MCQ, Short, Creative), Draft/Published states, and Suggested Answers/Rubrics.

-- 1. Update quizzes table
ALTER TABLE public.quizzes 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
ADD COLUMN IF NOT EXISTS exam_type TEXT NOT NULL DEFAULT 'mcq';

-- 2. Update quiz_questions table
ALTER TABLE public.quiz_questions 
ADD COLUMN IF NOT EXISTS question_type TEXT NOT NULL DEFAULT 'mcq',
ADD COLUMN IF NOT EXISTS suggested_answer TEXT,
ADD COLUMN IF NOT EXISTS grading_rubric TEXT;

-- Ensure options and correct_answer can be NULL for non-MCQ questions
ALTER TABLE public.quiz_questions 
ALTER COLUMN options DROP NOT NULL,
ALTER COLUMN correct_answer DROP NOT NULL;

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_quizzes_status ON public.quizzes(status);
CREATE INDEX IF NOT EXISTS idx_quizzes_exam_type ON public.quizzes(exam_type);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_question_type ON public.quiz_questions(question_type);


-- =============================================================================
-- FILE: 0018_credential_whitelist.sql
-- =============================================================================

-- Migration: 0018_credential_whitelist
-- Description: Create credential_whitelist table for pre-registered university IDs with RLS policies

-- 1. Create credential_whitelist table
CREATE TABLE IF NOT EXISTS public.credential_whitelist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institutional_id TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (LOWER(role) IN ('teacher', 'student')),
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    batch TEXT,
    is_claimed BOOLEAN NOT NULL DEFAULT FALSE,
    claimed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Indexes for lookup and filtering performance
CREATE INDEX IF NOT EXISTS idx_credential_whitelist_inst_id ON public.credential_whitelist(institutional_id);
CREATE INDEX IF NOT EXISTS idx_credential_whitelist_claimed ON public.credential_whitelist(is_claimed);
CREATE INDEX IF NOT EXISTS idx_credential_whitelist_role ON public.credential_whitelist(role);
CREATE INDEX IF NOT EXISTS idx_credential_whitelist_dept ON public.credential_whitelist(department_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.credential_whitelist ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Public/Anon: SELECT only where is_claimed = false
DROP POLICY IF EXISTS "Public can view unclaimed whitelist" ON public.credential_whitelist;
CREATE POLICY "Public can view unclaimed whitelist"
ON public.credential_whitelist FOR SELECT
TO anon, authenticated
USING (is_claimed = false);

-- 5. RLS Policy: Admin: Full access (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Admins have full access to whitelist" ON public.credential_whitelist;
CREATE POLICY "Admins have full access to whitelist"
ON public.credential_whitelist FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    )
);


-- =============================================================================
-- FILE: 0019_ai_chat_sessions.sql
-- =============================================================================

CREATE TABLE ai_chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Chat',
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chat sessions" ON ai_chat_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat sessions" ON ai_chat_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions" ON ai_chat_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat sessions" ON ai_chat_sessions
    FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX ai_chat_sessions_user_id_idx ON ai_chat_sessions(user_id);


-- =============================================================================
-- FILE: 0020_study_hub.sql
-- =============================================================================

-- Migration: 0020_study_hub.sql
-- Description: Creates personal_study_files storage bucket and study_sessions table with RLS

-- 1. Storage bucket for personal study files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'personal_study_files',
    'personal_study_files',
    true,
    52428800, -- 50 MB
    ARRAY[
        'application/pdf'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Policies for personal_study_files bucket
DROP POLICY IF EXISTS "Authenticated users can upload personal study files" ON storage.objects;
CREATE POLICY "Authenticated users can upload personal study files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'personal_study_files'
);

DROP POLICY IF EXISTS "Users can view personal study files" ON storage.objects;
CREATE POLICY "Users can view personal study files"
ON storage.objects FOR SELECT
TO authenticated, anon
USING (
    bucket_id = 'personal_study_files'
);

DROP POLICY IF EXISTS "Users can delete own personal study files" ON storage.objects;
CREATE POLICY "Users can delete own personal study files"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'personal_study_files' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- 2. Create study_sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Untitled Study Session',
    source_material_id UUID REFERENCES course_materials(id) ON DELETE SET NULL,
    personal_file_url TEXT,
    notes_content TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- Study Sessions RLS Policies
DROP POLICY IF EXISTS "Students can view own study sessions" ON study_sessions;
CREATE POLICY "Students can view own study sessions"
ON study_sessions FOR SELECT
TO authenticated
USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can insert own study sessions" ON study_sessions;
CREATE POLICY "Students can insert own study sessions"
ON study_sessions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can update own study sessions" ON study_sessions;
CREATE POLICY "Students can update own study sessions"
ON study_sessions FOR UPDATE
TO authenticated
USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can delete own study sessions" ON study_sessions;
CREATE POLICY "Students can delete own study sessions"
ON study_sessions FOR DELETE
TO authenticated
USING (auth.uid() = student_id);

-- Performance Index
CREATE INDEX IF NOT EXISTS study_sessions_student_id_idx ON study_sessions(student_id);
CREATE INDEX IF NOT EXISTS study_sessions_updated_at_idx ON study_sessions(updated_at DESC);


-- =============================================================================
-- FILE: 0021_student_exam_center.sql
-- =============================================================================

-- Migration: 0021_student_exam_center.sql
-- Description: Updates quizzes table with creator_id and is_practice, creates exam_submissions and exam_answers tables with RLS for Student Exam Center.

-- 1. Rename teacher_id to creator_id in quizzes if present
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'teacher_id'
    ) THEN
        ALTER TABLE public.quizzes RENAME COLUMN teacher_id TO creator_id;
    END IF;
END $$;

-- 2. Add is_practice to quizzes
ALTER TABLE public.quizzes 
ADD COLUMN IF NOT EXISTS is_practice BOOLEAN NOT NULL DEFAULT false;

-- 3. Update Indexes for quizzes
CREATE INDEX IF NOT EXISTS idx_quizzes_creator_id ON public.quizzes(creator_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_is_practice ON public.quizzes(is_practice);

-- 4. Update RLS on quizzes
DROP POLICY IF EXISTS "Teachers can view own quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Users can view published or own quizzes" ON public.quizzes;

CREATE POLICY "Users can view published or own quizzes"
ON public.quizzes FOR SELECT
USING (
    -- Creator can view own
    auth.uid() = creator_id
    -- Students/authenticated can view published official exams
    OR (status = 'published' AND is_practice = false)
    -- Admins can view all
    OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    )
);

DROP POLICY IF EXISTS "Teachers can insert own quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Users can insert own quizzes" ON public.quizzes;

CREATE POLICY "Users can insert own quizzes"
ON public.quizzes FOR INSERT
WITH CHECK (
    auth.uid() = creator_id
    OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    )
);

DROP POLICY IF EXISTS "Teachers can update own quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Users can update own quizzes" ON public.quizzes;

CREATE POLICY "Users can update own quizzes"
ON public.quizzes FOR UPDATE
USING (
    auth.uid() = creator_id
    OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    )
);

DROP POLICY IF EXISTS "Teachers can delete own quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Users can delete own quizzes" ON public.quizzes;

CREATE POLICY "Users can delete own quizzes"
ON public.quizzes FOR DELETE
USING (
    auth.uid() = creator_id
    OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    )
);

-- 5. Update RLS on quiz_questions
DROP POLICY IF EXISTS "Teachers can view quiz questions" ON public.quiz_questions;
DROP POLICY IF EXISTS "Users can view quiz questions" ON public.quiz_questions;

CREATE POLICY "Users can view quiz questions"
ON public.quiz_questions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.quizzes
        WHERE public.quizzes.id = public.quiz_questions.quiz_id
        AND (
            public.quizzes.creator_id = auth.uid()
            OR (public.quizzes.status = 'published' AND public.quizzes.is_practice = false)
            OR EXISTS (
                SELECT 1 FROM public.profiles
                WHERE id = auth.uid() AND role = 'ADMIN'
            )
        )
    )
);

DROP POLICY IF EXISTS "Teachers can insert quiz questions" ON public.quiz_questions;
DROP POLICY IF EXISTS "Users can insert quiz questions" ON public.quiz_questions;

CREATE POLICY "Users can insert quiz questions"
ON public.quiz_questions FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.quizzes
        WHERE public.quizzes.id = public.quiz_questions.quiz_id
        AND (
            public.quizzes.creator_id = auth.uid()
            OR EXISTS (
                SELECT 1 FROM public.profiles
                WHERE id = auth.uid() AND role = 'ADMIN'
            )
        )
    )
);

-- 6. Create exam_submissions table
CREATE TABLE IF NOT EXISTS public.exam_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score INTEGER,
    total_questions INTEGER DEFAULT 0,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Create exam_answers table
CREATE TABLE IF NOT EXISTS public.exam_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES public.exam_submissions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
    student_answer TEXT,
    is_correct BOOLEAN
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_exam_submissions_quiz_id ON public.exam_submissions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_exam_submissions_student_id ON public.exam_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_answers_submission_id ON public.exam_answers(submission_id);
CREATE INDEX IF NOT EXISTS idx_exam_answers_question_id ON public.exam_answers(question_id);

-- 8. Enable RLS on exam_submissions & exam_answers
ALTER TABLE public.exam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_answers ENABLE ROW LEVEL SECURITY;

-- exam_submissions policies
DROP POLICY IF EXISTS "Students can insert own submissions" ON public.exam_submissions;
CREATE POLICY "Students can insert own submissions"
ON public.exam_submissions FOR INSERT
WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can view own submissions" ON public.exam_submissions;
CREATE POLICY "Students can view own submissions"
ON public.exam_submissions FOR SELECT
USING (
    auth.uid() = student_id
    OR EXISTS (
        SELECT 1 FROM public.quizzes
        WHERE public.quizzes.id = public.exam_submissions.quiz_id
        AND public.quizzes.creator_id = auth.uid()
    )
    OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    )
);

-- exam_answers policies
DROP POLICY IF EXISTS "Students can insert answers for own submissions" ON public.exam_answers;
CREATE POLICY "Students can insert answers for own submissions"
ON public.exam_answers FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.exam_submissions
        WHERE public.exam_submissions.id = public.exam_answers.submission_id
        AND public.exam_submissions.student_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can view relevant exam answers" ON public.exam_answers;
CREATE POLICY "Users can view relevant exam answers"
ON public.exam_answers FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.exam_submissions
        WHERE public.exam_submissions.id = public.exam_answers.submission_id
        AND (
            public.exam_submissions.student_id = auth.uid()
            OR EXISTS (
                SELECT 1 FROM public.quizzes
                WHERE public.quizzes.id = public.exam_submissions.quiz_id
                AND public.quizzes.creator_id = auth.uid()
            )
            OR EXISTS (
                SELECT 1 FROM public.profiles
                WHERE id = auth.uid() AND role = 'ADMIN'
            )
        )
    )
);


