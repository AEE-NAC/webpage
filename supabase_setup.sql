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
