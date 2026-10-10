-- Migration: 0016_quizzes_schema
-- Description: AI-Powered Quizzes and Quiz Questions tables with RLS for Teacher Dashboard

-- 1. Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_code TEXT NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create quiz_questions table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    correct_answer TEXT NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_quizzes_teacher_id ON public.quizzes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_course_code ON public.quizzes(course_code);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);

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
