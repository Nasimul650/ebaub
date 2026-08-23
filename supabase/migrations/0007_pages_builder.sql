-- Migration: 0007_pages_builder
-- Description: Pages table with block-based content builder (JSONB content_blocks)

-- 1. Create pages table
CREATE TABLE public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at (reuses existing trigger function)
CREATE TRIGGER on_pages_updated
    BEFORE UPDATE ON public.pages
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. Row Level Security
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published pages"
    ON public.pages FOR SELECT
    USING (is_published = true);

CREATE POLICY "Admins can do everything with pages"
    ON public.pages FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'ADMIN'
        )
    );

-- 3. Seed the About page with initial block content
INSERT INTO public.pages (slug, title, is_published, content_blocks)
VALUES (
    'about',
    'About EBAUB',
    true,
    '[{"type":"hero","data":{"badge":"About EXIM Bank Agricultural University Bangladesh","headline":"Pioneering Excellence in Science, Agriculture & Technology","subheadline":"Established in 2022, EBAUB stands as a beacon of academic leadership in Rajshahi, Bangladesh."}},{"type":"text_image","data":{"title":"Our Vision","paragraph":"To become a premier regional and international university recognized for cutting-edge research in Computer Science, Agricultural Engineering, and sustainable technology.","image_url":"","image_alignment":"right"}},{"type":"text_image","data":{"title":"Our Mission","paragraph":"To empower students with rigorous academic foundations, hands-on software & agricultural engineering skills, ethical leadership, and continuous innovation.","image_url":"","image_alignment":"left"}},{"type":"stats","data":{"headline":"By the Numbers","stats":[{"value":"2+","label":"Years of Excellence"},{"value":"160+","label":"Enrolled Students"},{"value":"15+","label":"Expert Faculty"},{"value":"5+","label":"Programs Offered"}]}},{"type":"cta_banner","data":{"headline":"CSE Department 2-Year Anniversary Milestone","description":"Celebrating 2 years of academic breakthroughs, innovative curriculum, and digital transformation in the Department of Computer Science & Engineering.","button_text":"View Programs","button_link":"/academics"}}]'
);
