-- 1. Create the Popovers/Banners table
CREATE TABLE IF NOT EXISTS public.cms_popovers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    is_active boolean DEFAULT false,
    start_at timestamptz,
    end_at timestamptz,
    frequency_hours int DEFAULT 24,
    language text NOT NULL,
    country_code text,
    type text DEFAULT 'template', -- 'template' or 'custom_html'
    component_type text DEFAULT 'modal', -- 'modal' or 'banner'
    target_pages text[] DEFAULT ARRAY['*'],
    title text,
    body text,
    image_url text,
    cta_text text,
    cta_url text,
    raw_html text,
    created_at timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.cms_popovers ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Allow everyone to READ campaigns (needed for the website to display them)
DROP POLICY IF EXISTS "Public Read Popovers" ON public.cms_popovers;
CREATE POLICY "Public Read Popovers" ON public.cms_popovers FOR SELECT USING (true);

-- Allow everyone to EDIT campaigns (needed for your Admin panel if you haven't set up Auth yet)
-- Note: In production, you should restrict this to authenticated users.
DROP POLICY IF EXISTS "Public Write Popovers" ON public.cms_popovers;
CREATE POLICY "Public Write Popovers" ON public.cms_popovers FOR ALL USING (true);

-- 4. Storage Setup (For Image Uploads)
-- Create 'static' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) VALUES ('static', 'static', true) ON CONFLICT DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Public Access Static" ON storage.objects;
CREATE POLICY "Public Access Static" ON storage.objects FOR SELECT USING ( bucket_id = 'static' );

DROP POLICY IF EXISTS "Public Upload Static" ON storage.objects;
CREATE POLICY "Public Upload Static" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'static' );

DROP POLICY IF EXISTS "Public Update Static" ON storage.objects;
CREATE POLICY "Public Update Static" ON storage.objects FOR UPDATE USING ( bucket_id = 'static' );

-- 5. CMS Weekly Words
CREATE TABLE IF NOT EXISTS public.cms_weekly_words (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    language text NOT NULL,
    title text NOT NULL,
    content text,
    image_url text,
    author_name text,
    author_role text,
    start_date timestamptz NOT NULL,
    end_date timestamptz NOT NULL,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.cms_weekly_words ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Words" ON public.cms_weekly_words FOR SELECT USING (true);
CREATE POLICY "Public Write Words" ON public.cms_weekly_words FOR ALL USING (true);

-- 6. CMS Newsletters
CREATE TABLE IF NOT EXISTS public.cms_newsletters (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    language text NOT NULL,
    title text NOT NULL,
    publication_date timestamptz NOT NULL,
    pdf_url text NOT NULL,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.cms_newsletters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Newsletters" ON public.cms_newsletters FOR SELECT USING (true);
CREATE POLICY "Public Write Newsletters" ON public.cms_newsletters FOR ALL USING (true);

-- UPDATE: Add country_code to cms_newsletters if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cms_newsletters' AND column_name='country_code') THEN
        ALTER TABLE public.cms_newsletters ADD COLUMN country_code text DEFAULT NULL;
    END IF;
END $$;

-- 7. CMS Testimonials
CREATE TABLE IF NOT EXISTS public.cms_testimonials (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    language text NOT NULL,
    country_code text,
    author_name text NOT NULL,
    author_role text,
    content text NOT NULL,
    image_url text,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.cms_testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Testimonials" ON public.cms_testimonials FOR SELECT USING (true);
CREATE POLICY "Public Write Testimonials" ON public.cms_testimonials FOR ALL USING (true);
