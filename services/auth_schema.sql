-- 1. USERS TABLE (Custom Admin System)
CREATE TABLE IF NOT EXISTS public.cms_users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    username text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    role text DEFAULT 'editor', -- 'super_admin', 'admin', 'editor'
    country_code text, -- NULL = Global/All Countries, 'HT' = Haiti only, etc.
    created_at timestamptz DEFAULT now()
);

-- 2. INVITES TABLE
CREATE TABLE IF NOT EXISTS public.cms_invites (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    token uuid DEFAULT gen_random_uuid() UNIQUE,
    role text DEFAULT 'editor',
    country_code text,
    is_used boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    expires_at timestamptz DEFAULT (now() + interval '7 days')
);

-- 3. ENABLE RLS
ALTER TABLE public.cms_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_invites ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES (Strict Security)
-- Public cannot read user data. Only Service Role (Next.js Server) can access via API.
CREATE POLICY "No Public Access to Users" ON public.cms_users FOR ALL USING (false);
CREATE POLICY "No Public Access to Invites" ON public.cms_invites FOR ALL USING (false);

-- 5. UPDATE CONTENT TABLES RLS (Read Public, Write Private)
-- Re-apply strict rules to content tables ensuring only Server Side (Service Role) can write
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read" ON public.cms_content;
CREATE POLICY "Public Read" ON public.cms_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Write" ON public.cms_content;
CREATE POLICY "Service Role Write" ON public.cms_content FOR ALL USING (false); 
-- Note: 'false' means NO ONE via client-side libraries can write. 
-- Writes must happen via Next.js API using SUPABASE_SERVICE_ROLE_KEY.
