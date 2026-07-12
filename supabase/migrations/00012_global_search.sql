CREATE TABLE public.search_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete set null,
  query_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own search history" ON public.search_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert search history" ON public.search_history FOR INSERT WITH CHECK (true);
