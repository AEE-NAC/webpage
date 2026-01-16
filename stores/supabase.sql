-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. CMS Content Table
-- Stores all dynamic content (text, image URLs, html snippets)
create table if not exists public.cms_content (
  id uuid default uuid_generate_v4() primary key,
  key text not null, -- e.g., "home.hero.title" or "about.team.image_1"
  language text not null, -- ISO code: 'en', 'fr', 'es'
  country_code text, -- ISO Alpha-2: 'US', 'FR', 'CA'. Null means "All regions for this language"
  content_type text check (content_type in ('text', 'image', 'html')) default 'text',
  value text not null, -- The actual text, HTML string, or Image URL
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Prevent duplicate entries for the exact same targeting
  constraint unique_content_target unique nulls not distinct (key, language, country_code)
);

-- 2. Popovers / Marketing Campaigns
create table if not exists public.cms_popovers (
  id uuid default uuid_generate_v4() primary key,
  name text not null, -- Internal name for admin reference
  is_active boolean default true,
  
  -- Scheduling
  start_at timestamp with time zone,
  end_at timestamp with time zone,
  frequency_hours integer default 24, -- Show once every X hours per user
  
  -- Targeting
  language text not null,
  country_code text, -- Null = global for that language
  
  -- Content
  type text check (type in ('template', 'custom_html')) default 'template',
  title text, -- Used if type = template
  body text, -- Used if type = template
  image_url text, -- Used if type = template
  cta_text text, -- Used if type = template
  cta_url text, -- Used if type = template
  
  raw_html text, -- Used if type = custom_html
  
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS Policies (Security)
alter table public.cms_content enable row level security;
alter table public.cms_popovers enable row level security;

-- CLEANUP OLD POLICIES (Fixes RLS Errors)
drop policy if exists "Allow public read access" on public.cms_content;
drop policy if exists "Allow public insert content" on public.cms_content;
drop policy if exists "Allow public update content" on public.cms_content;
drop policy if exists "Public Read" on public.cms_content;
drop policy if exists "Public Insert" on public.cms_content;
drop policy if exists "Public Update" on public.cms_content;

-- CREATE NEW PERMISSIVE POLICIES
create policy "Public Read" on public.cms_content for select using (true);
create policy "Public Insert" on public.cms_content for insert with check (true);
create policy "Public Update" on public.cms_content for update using (true);

create policy "Allow public read access active popovers" on public.cms_popovers
  for select using (is_active = true);

-- Indexes for performance
create index if not exists idx_cms_key_lang on public.cms_content(key, language);
create index if not exists idx_cms_lookup on public.cms_content(key, language, country_code);
