-- Expand content_items
ALTER TABLE public.content_items ADD COLUMN slug text unique;
ALTER TABLE public.content_items ADD COLUMN content_md text;
ALTER TABLE public.content_items ADD COLUMN views_count integer default 0;
ALTER TABLE public.content_items ADD COLUMN likes_count integer default 0;
ALTER TABLE public.content_items ADD COLUMN reading_time_minutes integer default 5;

-- User Likes
CREATE TABLE public.user_likes (
  user_id uuid references auth.users on delete cascade not null,
  content_item_id uuid references public.content_items on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, content_item_id)
);

ALTER TABLE public.user_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see all likes" ON public.user_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own likes" ON public.user_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON public.user_likes FOR DELETE USING (auth.uid() = user_id);

-- User Bookmarks
CREATE TABLE public.user_bookmarks (
  user_id uuid references auth.users on delete cascade not null,
  content_item_id uuid references public.content_items on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, content_item_id)
);

ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own bookmarks" ON public.user_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bookmarks" ON public.user_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookmarks" ON public.user_bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Comments
CREATE TABLE public.comments (
  id uuid default gen_random_uuid() primary key,
  content_item_id uuid references public.content_items on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are readable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can insert their own comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION increment_like(item_id uuid) RETURNS void AS $$
BEGIN
  UPDATE public.content_items SET likes_count = likes_count + 1 WHERE id = item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_like(item_id uuid) RETURNS void AS $$
BEGIN
  UPDATE public.content_items SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_view(item_id uuid) RETURNS void AS $$
BEGIN
  UPDATE public.content_items SET views_count = views_count + 1 WHERE id = item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
