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
