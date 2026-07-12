-- 1. Create Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  description text,
  cover_image_url text,
  category_id uuid references public.categories(id) on delete set null,
  difficulty text check (difficulty in ('Beginner', 'Intermediate', 'Advanced')) default 'Beginner',
  estimated_hours integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Lessons Table
CREATE TABLE IF NOT EXISTS public.lessons (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  video_url text not null, -- Stores YouTube video ID or link
  order_index integer not null,
  description text,
  duration_minutes integer default 10,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create User Course Progress Table
CREATE TABLE IF NOT EXISTS public.user_course_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lesson_id)
);

-- 4. Create Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  certificate_code text not null unique,
  issued_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_id)
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- 5. Define Policies

-- Courses RLS Policies
CREATE POLICY "Allow public read access to courses" ON public.courses
  FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to courses" ON public.courses
  FOR ALL USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

-- Lessons RLS Policies
CREATE POLICY "Allow public read access to lessons" ON public.lessons
  FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to lessons" ON public.lessons
  FOR ALL USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

-- Progress RLS Policies
CREATE POLICY "Allow users to read their own progress" ON public.user_course_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to modify their own progress" ON public.user_course_progress
  FOR ALL USING (auth.uid() = user_id);

-- Certificates RLS Policies
CREATE POLICY "Allow public read access to certificates" ON public.certificates
  FOR SELECT USING (true);

CREATE POLICY "Allow users to modify their own certificates" ON public.certificates
  FOR ALL USING (auth.uid() = user_id);
