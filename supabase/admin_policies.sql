-- ==========================================
-- Admin Policies Configuration Script
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 0. Role Synchronization Trigger (Sync profile role updates back to auth.users metadata)
CREATE OR REPLACE FUNCTION public.sync_profile_role_to_auth()
RETURNS trigger AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('role', new.role::text)
  WHERE id = new.id;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_role_updated ON public.profiles;
CREATE TRIGGER on_profile_role_updated
  AFTER UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_role_to_auth();

-- 1. Profiles Table Policies (Allow admins to list and update profiles)
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);

CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);

-- 2. Categories Table Policies
CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT WITH CHECK (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);

-- 3. Subjects Table Policies
CREATE POLICY "Admins can insert subjects" ON public.subjects FOR INSERT WITH CHECK (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);
CREATE POLICY "Admins can update subjects" ON public.subjects FOR UPDATE USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);
CREATE POLICY "Admins can delete subjects" ON public.subjects FOR DELETE USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);

-- 4. Universities Table Policies
CREATE POLICY "Admins can insert universities" ON public.universities FOR INSERT WITH CHECK (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);
CREATE POLICY "Admins can update universities" ON public.universities FOR UPDATE USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);
CREATE POLICY "Admins can delete universities" ON public.universities FOR DELETE USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);

-- 5. Content Items Table Policies (Notes & Question Papers)
CREATE POLICY "Admins can insert content items" ON public.content_items FOR INSERT WITH CHECK (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);
CREATE POLICY "Admins can update content items" ON public.content_items FOR UPDATE USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);
CREATE POLICY "Admins can delete content items" ON public.content_items FOR DELETE USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);

-- 6. Books Table Policies
CREATE POLICY "Admins can insert books" ON public.books FOR INSERT WITH CHECK (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);
CREATE POLICY "Admins can update books" ON public.books FOR UPDATE USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);
CREATE POLICY "Admins can delete books" ON public.books FOR DELETE USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);

-- 7. Scholarships Table Policies
CREATE POLICY "Admins can insert scholarships" ON public.scholarships FOR INSERT WITH CHECK (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);
CREATE POLICY "Admins can update scholarships" ON public.scholarships FOR UPDATE USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);
CREATE POLICY "Admins can delete scholarships" ON public.scholarships FOR DELETE USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);

-- 8. Fix Blog Policies (Replace existing 'ADMIN' uppercase policies with lowercase 'admin' checks)
DROP POLICY IF EXISTS "Admins can insert blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins can update blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins can delete blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins can select all blogs" ON public.blogs;

CREATE POLICY "Admins can insert blogs" ON public.blogs FOR INSERT WITH CHECK (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);
CREATE POLICY "Admins can update blogs" ON public.blogs FOR UPDATE USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);
CREATE POLICY "Admins can delete blogs" ON public.blogs FOR DELETE USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);
CREATE POLICY "Admins can select all blogs" ON public.blogs FOR SELECT USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
);
