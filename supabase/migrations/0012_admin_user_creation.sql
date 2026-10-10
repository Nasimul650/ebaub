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
