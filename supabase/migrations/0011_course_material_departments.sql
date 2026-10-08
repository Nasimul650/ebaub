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
