-- Categories
CREATE TABLE public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  icon_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are readable by everyone" ON public.categories FOR SELECT USING (true);

-- Subjects
CREATE TABLE public.subjects (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references public.categories on delete cascade not null,
  name text not null,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subjects are readable by everyone" ON public.subjects FOR SELECT USING (true);

-- Content Items (Notes, Question Papers)
CREATE TYPE public.content_type AS ENUM ('note', 'question_paper');

CREATE TABLE public.content_items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  content_type public.content_type not null,
  subject_id uuid references public.subjects on delete cascade not null,
  author_id uuid references public.profiles on delete set null,
  file_url text,
  downloads_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Content items are readable by everyone" ON public.content_items FOR SELECT USING (true);

-- Blogs
CREATE TABLE public.blogs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image_url text,
  author_id uuid references public.profiles on delete set null,
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published blogs are readable by everyone" ON public.blogs FOR SELECT USING (published = true);

-- Scholarships
CREATE TABLE public.scholarships (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  provider text not null,
  amount text,
  deadline timestamp with time zone,
  description text,
  link_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Scholarships are readable by everyone" ON public.scholarships FOR SELECT USING (true);

-- Universities
CREATE TABLE public.universities (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  short_name text,
  logo_url text,
  website_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Universities are readable by everyone" ON public.universities FOR SELECT USING (true);
