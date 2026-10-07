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
