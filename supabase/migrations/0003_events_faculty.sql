ALTER TABLE public.events 
ADD COLUMN time TEXT,
ADD COLUMN status TEXT DEFAULT 'Upcoming',
ADD COLUMN image_url TEXT;

CREATE TABLE public.faculty_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    bio TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.faculty_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Faculty is readable by everyone" ON public.faculty_members FOR SELECT USING (true);
CREATE POLICY "Faculty modified by admins" ON public.faculty_members FOR ALL USING (public.is_admin());
