-- Migration: 0009_page_based_site_settings
-- Description: Scale site_settings table to a Page-Based Architecture (excluding block-based 'about' page)

-- 1. Ensure site_settings table exists
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at trigger
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

DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
    ON public.site_settings FOR SELECT
    USING (true);

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

-- 3. Seed / Upsert Page-Based Configuration Records
INSERT INTO public.site_settings (id, data)
VALUES 
(
    'global_footer',
    '{
        "site_name": "EXIM Bank Agricultural University Bangladesh",
        "short_name": "EBAUB",
        "tagline": "Excellence in Agricultural Sciences, Engineering & Business",
        "accreditation": "Approved by UGC & Ministry of Education, Govt. of the People''s Republic of Bangladesh",
        "campus_address": "69-69/1, Boro Indara More, Chapai Nawabganj, 6300, Bangladesh",
        "inquiries_email": "info@ebaub.edu.bd",
        "admissions_email": "admission@ebaub.edu.bd",
        "hotline_phone": "02-588893525",
        "admissions_phone": "02-588893526 to 29",
        "office_hours": "Sunday - Thursday: 9:00 AM - 5:00 PM (Friday & Saturday Closed)",
        "facebook_url": "https://www.facebook.com/ebaub.chapai",
        "linkedin_url": "https://www.linkedin.com/company/ebaub",
        "youtube_url": "https://www.youtube.com/@ebaub",
        "student_portal_url": "/student",
        "teacher_portal_url": "/teacher"
    }'::jsonb
),
(
    'home',
    '{
        "badge_text": "CSE Department 2-Year Anniversary Prototype",
        "hero_headline": "Empowering the next generation of engineers.",
        "hero_subtitle": "EXIM Bank Agricultural University Bangladesh (EBAUB) combines rigorous academic foundations, hands-on engineering, and digital campus workflows.",
        "hero_video_url": "",
        "hero_fallback_image_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=85",
        "explore_cta_text": "Explore Degree Programs",
        "admissions_cta_text": "Admission Guidelines",
        "accreditation_metric": "UGC Bangladesh Approved",
        "curriculum_metric": "160 Credit Curriculum"
    }'::jsonb
),
(
    'academics',
    '{
        "header_badge": "Academics & Degree Programs",
        "header_headline": "Explore EBAUB Faculties, Departments & Curriculums",
        "header_description": "Discover our industry-aligned undergraduate degree offerings designed to build technical proficiency and leadership capabilities.",
        "advising_contact_email": "academic.advising@ebaub.edu.bd",
        "curriculum_overview_text": "All degree curriculums follow outcome-based education (OBE) guidelines recommended by UGC Bangladesh."
    }'::jsonb
),
(
    'admissions',
    '{
        "header_badge": "Fall 2027 Admissions Open",
        "header_headline": "Begin Your Journey at EXIM Bank Agricultural University",
        "header_description": "Discover your potential with our rigorous academic programs. Explore requirements, application steps, and key dates below.",
        "apply_cta_text": "Apply Now",
        "deadline_highlight_text": "Spring & Fall 2027 Application Deadlines are actively underway.",
        "financial_aid_snippet": "Need-based scholarships, merit waivers (up to 100%), and EXIM Bank Foundation stipends available for eligible students.",
        "admissions_hotline": "02-588893526 to 29",
        "admissions_email": "admission@ebaub.edu.bd"
    }'::jsonb
),
(
    'faculty',
    '{
        "header_badge": "Distinguished Educators",
        "header_headline": "Academic Faculty Directory",
        "header_description": "Meet our dedicated academic staff committed to excellence in teaching, research, and innovation across our various faculties and departments.",
        "join_faculty_notice": "Interested in joining our academic roster? Submit your CV and research portfolio to hr@ebaub.edu.bd.",
        "research_focus_text": "Leading breakthroughs in Precision Agriculture, Software Architecture, Machine Learning, and Agribusiness."
    }'::jsonb
),
(
    'student_life',
    '{
        "header_badge": "Campus Events & Student Life",
        "header_headline": "Vibrant Campus Life & Extracurriculars",
        "header_description": "Stay connected with upcoming academic events, workshops, seminars, and student activities across the campus.",
        "clubs_highlight_text": "Join 15+ student clubs including EBAUB Computer Club, Robotics Guild, Cultural Society, and Agri-Tech Innovators.",
        "facilities_snippet": "Modern computer labs, smart classrooms, botanical research fields, central library, and high-speed campus WiFi."
    }'::jsonb
),
(
    'contact',
    '{
        "header_badge": "Contact EBAUB",
        "header_headline": "Get in Touch with EBAUB University Administration",
        "header_description": "We welcome inquiries regarding admissions, departmental programs, research collaborations, and campus visits.",
        "campus_address": "69-69/1, Boro Indara More, Chapai Nawabganj, 6300, Bangladesh",
        "inquiries_email": "info@ebaub.edu.bd",
        "hotline_phone": "02-588893525",
        "admissions_phone": "02-588893526 to 29",
        "office_hours": "Sunday – Thursday: 9:00 AM – 5:00 PM (Friday & Saturday Closed)",
        "transport_directions": "Located at Boro Indara More, easily accessible via regional transport from Rajshahi and Chapai Nawabganj town centers."
    }'::jsonb
)
ON CONFLICT (id) DO UPDATE 
SET data = EXCLUDED.data, updated_at = NOW();
