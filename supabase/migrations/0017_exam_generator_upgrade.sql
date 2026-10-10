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
