-- Create Notifications Table
CREATE TABLE public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade, -- null means global announcement
  type text not null check (type in ('ANNOUNCEMENT', 'NEW_NOTE', 'NEW_PAPER', 'SCHOLARSHIP', 'AI_MESSAGE', 'ADMIN')),
  title text not null,
  message text not null,
  link_url text,
  is_read boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own notifications, or global announcements (where user_id is null)
CREATE POLICY "Users can view own notifications and global announcements" 
ON public.notifications FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own notifications (to mark as read)
CREATE POLICY "Users can update own notifications" 
ON public.notifications FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Enable realtime replication for the notifications table
-- This allows the frontend to listen for new inserts instantly
begin;
  -- remove the supabase_realtime publication if it exists to safely recreate or alter
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table public.notifications;
