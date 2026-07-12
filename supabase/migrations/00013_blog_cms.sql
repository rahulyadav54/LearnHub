-- Expand blogs table
ALTER TABLE public.blogs ADD COLUMN seo_title text;
ALTER TABLE public.blogs ADD COLUMN seo_description text;
ALTER TABLE public.blogs ADD COLUMN reading_time_minutes integer default 5;
ALTER TABLE public.blogs ADD COLUMN tags text[] default '{}';
ALTER TABLE public.blogs ADD COLUMN category_id uuid references public.categories on delete set null;

-- Blog Comments
CREATE TABLE public.blog_comments (
  id uuid default gen_random_uuid() primary key,
  blog_id uuid references public.blogs on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Blog comments are readable by everyone" ON public.blog_comments FOR SELECT USING (true);
CREATE POLICY "Users can insert their own comments" ON public.blog_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.blog_comments FOR DELETE USING (auth.uid() = user_id);

-- Ensure admin policy exists for blogs (if not already fully covered by a global one)
-- Admins can do anything on blogs
CREATE POLICY "Admins can insert blogs" ON public.blogs FOR INSERT WITH CHECK (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'ADMIN')
);
CREATE POLICY "Admins can update blogs" ON public.blogs FOR UPDATE USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'ADMIN')
);
CREATE POLICY "Admins can delete blogs" ON public.blogs FOR DELETE USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'ADMIN')
);

-- Note: We already have a policy "Published blogs are readable by everyone" ON public.blogs FOR SELECT USING (published = true);
-- We need to ensure Admins can select unpublished blogs too:
CREATE POLICY "Admins can select all blogs" ON public.blogs FOR SELECT USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'ADMIN')
);
