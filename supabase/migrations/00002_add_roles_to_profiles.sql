-- Create an Enum for Roles
CREATE TYPE public.user_role AS ENUM ('student', 'teacher', 'admin');

-- Add the role column to profiles, defaulting to 'student'
ALTER TABLE public.profiles 
ADD COLUMN role public.user_role DEFAULT 'student'::public.user_role NOT NULL;

-- Update the handle_new_user trigger to accept role from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
