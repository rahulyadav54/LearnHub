-- Add streak tracking to profiles
ALTER TABLE public.profiles ADD COLUMN current_streak integer default 0;
ALTER TABLE public.profiles ADD COLUMN longest_streak integer default 0;
ALTER TABLE public.profiles ADD COLUMN last_active_date date;

-- User Downloads Tracker
CREATE TABLE public.user_downloads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  content_item_id uuid references public.content_items on delete cascade not null,
  downloaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.user_downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own downloads" ON public.user_downloads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own downloads" ON public.user_downloads FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Achievements
CREATE TABLE public.achievements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  icon_name text not null,
  points integer default 10,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Achievements are readable by everyone" ON public.achievements FOR SELECT USING (true);

-- Seed basic achievements
INSERT INTO public.achievements (title, description, icon_name, points) VALUES
('First Blood', 'Completed your first Mock Test.', 'sword', 10),
('Bookworm', 'Read your first PDF note.', 'book-open', 10),
('Curious Mind', 'Asked the AI Tutor a question.', 'sparkles', 10),
('Streak Starter', 'Hit a 3-day study streak.', 'flame', 20),
('Sharpshooter', 'Achieved 100% accuracy on a practice quiz.', 'target', 50);

-- User Achievements mapping
CREATE TABLE public.user_achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  achievement_id uuid references public.achievements on delete cascade not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own unlocked achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can unlock achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications
CREATE TABLE public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  message text not null,
  link_url text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
