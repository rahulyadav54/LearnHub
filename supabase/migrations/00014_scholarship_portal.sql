-- Expand scholarships table
ALTER TABLE public.scholarships ADD COLUMN scholarship_type text check (scholarship_type in ('Government', 'Private', 'International'));
ALTER TABLE public.scholarships ADD COLUMN eligibility_criteria text;
ALTER TABLE public.scholarships ADD COLUMN required_documents text[] default '{}';

-- Scholarship Bookmarks
CREATE TABLE public.user_scholarship_bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  scholarship_id uuid references public.scholarships on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, scholarship_id)
);

ALTER TABLE public.user_scholarship_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own scholarship bookmarks" ON public.user_scholarship_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own scholarship bookmarks" ON public.user_scholarship_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own scholarship bookmarks" ON public.user_scholarship_bookmarks FOR DELETE USING (auth.uid() = user_id);
