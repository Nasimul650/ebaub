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
