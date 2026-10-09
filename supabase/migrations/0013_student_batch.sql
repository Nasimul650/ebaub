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
