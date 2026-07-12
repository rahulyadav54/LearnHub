CREATE TABLE public.mock_tests (
  id uuid default gen_random_uuid() primary key,
  program_id uuid references public.programs on delete cascade not null,
  title text not null,
  description text,
  duration_minutes integer not null,
  positive_marks numeric not null default 1,
  negative_marks numeric not null default 0,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.mock_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mock tests are readable by everyone" ON public.mock_tests FOR SELECT USING (is_published = true);

CREATE TABLE public.mock_test_questions (
  id uuid default gen_random_uuid() primary key,
  mock_test_id uuid references public.mock_tests on delete cascade not null,
  mcq_id uuid references public.mcqs on delete cascade not null,
  order_index integer default 0,
  unique(mock_test_id, mcq_id)
);

ALTER TABLE public.mock_test_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions are readable by everyone" ON public.mock_test_questions FOR SELECT USING (true);

CREATE TABLE public.mock_test_attempts (
  id uuid default gen_random_uuid() primary key,
  mock_test_id uuid references public.mock_tests on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  score numeric not null default 0,
  time_taken_seconds integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.mock_test_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own mock attempts" ON public.mock_test_attempts FOR SELECT USING (auth.uid() = user_id);
-- Allow viewing other attempts for leaderboard purposes if needed, but we'll restrict details
CREATE POLICY "Users can insert their own mock attempts" ON public.mock_test_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.mock_test_answers (
  id uuid default gen_random_uuid() primary key,
  attempt_id uuid references public.mock_test_attempts on delete cascade not null,
  mock_test_question_id uuid references public.mock_test_questions on delete cascade not null,
  selected_option text,
  is_correct boolean not null default false,
  marks_awarded numeric not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.mock_test_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see answers for their mock attempts" ON public.mock_test_answers FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.mock_test_attempts
    WHERE mock_test_attempts.id = mock_test_answers.attempt_id
    AND mock_test_attempts.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert answers for their mock attempts" ON public.mock_test_answers FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.mock_test_attempts
    WHERE mock_test_attempts.id = mock_test_answers.attempt_id
    AND mock_test_attempts.user_id = auth.uid()
  )
);
