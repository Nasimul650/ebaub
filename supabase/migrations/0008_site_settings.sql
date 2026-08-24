-- Migration: 0008_site_settings
-- Description: Centralized Site Settings (Static Content Manager) table with key-value / grouped JSONB structure

-- 1. Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'on_site_settings_updated'
    ) THEN
        CREATE TRIGGER on_site_settings_updated
            BEFORE UPDATE ON public.site_settings
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
END $$;

-- 2. Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public / Anon users can read settings
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
    ON public.site_settings FOR SELECT
    USING (true);

-- Authenticated Admins can manage all settings (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
CREATE POLICY "Admins can manage site settings"
    ON public.site_settings FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'ADMIN'
        )
    );

-- 3. Seed initial default settings data
INSERT INTO public.site_settings (id, data)
VALUES 
(
    'hero',
    '{
        "headline": "Empowering the next generation of engineers.",
        "subtitle": "EXIM Bank Agricultural University Bangladesh (EBAUB) combines academic excellence, hands-on learning, and state-of-the-art research in engineering, agriculture, and business to shape leaders for tomorrow.",
        "video_url": "",
        "fallback_image_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200",
        "badge_text": "Excellence in Higher Education"
    }'::jsonb
),
(
    'general',
    '{
        "site_name": "EXIM Bank Agricultural University Bangladesh",
        "short_name": "EBAUB",
        "tagline": "Excellence in Agricultural Sciences, Engineering & Business",
        "meta_description": "Official portal of EXIM Bank Agricultural University Bangladesh (EBAUB). Explore undergraduate & graduate programs in CSE, Agriculture, Business, and Law.",
        "accreditation": "Approved by UGC & Ministry of Education, Govt. of the People''s Republic of Bangladesh"
    }'::jsonb
),
(
    'contact',
    '{
        "campus_address": "69-69/1, Boro Indara More, Chapai Nawabganj, 6300, Bangladesh",
        "inquiries_email": "info@ebaub.edu.bd",
        "admissions_email": "admission@ebaub.edu.bd",
        "hotline_phone": "02-588893525",
        "admissions_phone": "02-588893526 to 29",
        "office_hours": "Sunday - Thursday: 9:00 AM - 5:00 PM (Friday & Saturday Closed)"
    }'::jsonb
),
(
    'socials',
    '{
        "facebook_url": "https://www.facebook.com/ebaub.chapai",
        "linkedin_url": "https://www.linkedin.com/company/ebaub",
        "youtube_url": "https://www.youtube.com/@ebaub",
        "student_portal_url": "/student",
        "teacher_portal_url": "/teacher"
    }'::jsonb
)
ON CONFLICT (id) DO UPDATE 
SET data = EXCLUDED.data, updated_at = NOW();
