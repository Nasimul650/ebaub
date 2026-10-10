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
