CREATE TABLE public.academic_calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    category TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.academic_calendar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Calendar is readable by everyone" ON public.academic_calendar FOR SELECT USING (true);
CREATE POLICY "Calendar modified by admins" ON public.academic_calendar FOR ALL USING (public.is_admin());
