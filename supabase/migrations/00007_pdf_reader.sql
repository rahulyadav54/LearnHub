CREATE TABLE public.reading_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  content_item_id uuid references public.content_items on delete cascade not null,
  current_page integer default 1,
  total_pages integer default 1,
  progress_percentage float default 0,
  last_read_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, content_item_id)
);

ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own reading history" ON public.reading_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own reading history" ON public.reading_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reading history" ON public.reading_history FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE public.pdf_highlights (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  content_item_id uuid references public.content_items on delete cascade not null,
  page_number integer not null,
  rect_data jsonb not null,
  text_content text,
  color text default '#FFEB3B',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.pdf_highlights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own highlights" ON public.pdf_highlights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own highlights" ON public.pdf_highlights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own highlights" ON public.pdf_highlights FOR DELETE USING (auth.uid() = user_id);
