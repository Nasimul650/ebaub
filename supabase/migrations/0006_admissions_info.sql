
CREATE TABLE public.admissions_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES public.faculties(id) ON DELETE CASCADE,
    requirements TEXT,
    process_steps TEXT,
    important_dates TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(faculty_id)
);

ALTER TABLE public.admissions_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admissions info is readable by everyone" ON public.admissions_info FOR SELECT USING (true);
CREATE POLICY "Admissions info modified by admins" ON public.admissions_info FOR ALL USING (public.is_admin());

