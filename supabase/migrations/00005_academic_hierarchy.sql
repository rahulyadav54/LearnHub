-- Programs (e.g. BSc CSIT, Science, Management)
CREATE TABLE public.programs (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references public.categories on delete cascade not null,
  university_id uuid references public.universities on delete set null,
  name text not null,
  slug text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (category_id, slug)
);

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Programs are readable by everyone" ON public.programs FOR SELECT USING (true);

-- Semesters (e.g. 1st Semester, Class 11)
CREATE TABLE public.semesters (
  id uuid default gen_random_uuid() primary key,
  program_id uuid references public.programs on delete cascade not null,
  name text not null,
  slug text not null,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (program_id, slug)
);

ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Semesters are readable by everyone" ON public.semesters FOR SELECT USING (true);

-- Modify subjects to link to programs and semesters
ALTER TABLE public.subjects ADD COLUMN program_id uuid references public.programs on delete cascade;
ALTER TABLE public.subjects ADD COLUMN semester_id uuid references public.semesters on delete cascade;
ALTER TABLE public.subjects ADD COLUMN syllabus_content text;

-- MCQs
CREATE TABLE public.mcqs (
  id uuid default gen_random_uuid() primary key,
  subject_id uuid references public.subjects on delete cascade not null,
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option text not null check (correct_option in ('a', 'b', 'c', 'd')),
  explanation text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.mcqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "MCQs are readable by everyone" ON public.mcqs FOR SELECT USING (true);
