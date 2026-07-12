CREATE TABLE public.ai_chat_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null default 'New Conversation',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own chat sessions" ON public.ai_chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own chat sessions" ON public.ai_chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own chat sessions" ON public.ai_chat_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own chat sessions" ON public.ai_chat_sessions FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE public.ai_chat_messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.ai_chat_sessions on delete cascade not null,
  role text not null check (role in ('user', 'assistant', 'system', 'data')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see messages of their sessions" ON public.ai_chat_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.ai_chat_sessions
    WHERE ai_chat_sessions.id = ai_chat_messages.session_id
    AND ai_chat_sessions.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert messages to their sessions" ON public.ai_chat_messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.ai_chat_sessions
    WHERE ai_chat_sessions.id = ai_chat_messages.session_id
    AND ai_chat_sessions.user_id = auth.uid()
  )
);
