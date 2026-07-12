-- Books
CREATE TABLE public.books (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text not null,
  description text,
  cover_image_url text,
  file_url text,
  subject_id uuid references public.subjects on delete cascade,
  published_year integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Books are readable by everyone" ON public.books FOR SELECT USING (true);
