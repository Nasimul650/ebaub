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
