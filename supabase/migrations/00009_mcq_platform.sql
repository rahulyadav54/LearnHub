-- Alter existing MCQs table to add difficulty
ALTER TABLE public.mcqs ADD COLUMN difficulty text default 'medium' check (difficulty in ('easy', 'medium', 'hard'));

-- Create MCQ Attempts table
CREATE TABLE public.mcq_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  subject_id uuid references public.subjects on delete cascade not null,
  score integer not null default 0,
  total_questions integer not null default 0,
  time_taken_seconds integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.mcq_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own MCQ attempts" ON public.mcq_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own MCQ attempts" ON public.mcq_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create MCQ Answers table for granular tracking
CREATE TABLE public.mcq_answers (
  id uuid default gen_random_uuid() primary key,
  attempt_id uuid references public.mcq_attempts on delete cascade not null,
  mcq_id uuid references public.mcqs on delete cascade not null,
  selected_option text,
  is_correct boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.mcq_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see answers for their attempts" ON public.mcq_answers FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.mcq_attempts
    WHERE mcq_attempts.id = mcq_answers.attempt_id
    AND mcq_attempts.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert answers for their attempts" ON public.mcq_answers FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.mcq_attempts
    WHERE mcq_attempts.id = mcq_answers.attempt_id
    AND mcq_attempts.user_id = auth.uid()
  )
);
