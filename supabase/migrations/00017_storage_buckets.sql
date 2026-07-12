-- 1. Create Public Storage Bucket named 'materials'
INSERT INTO storage.buckets (id, name, public)
VALUES ('materials', 'materials', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable policies for public read and admin uploads
CREATE POLICY "Allow public read access to materials" ON storage.objects
  FOR SELECT USING (bucket_id = 'materials');

CREATE POLICY "Allow admin insert access to materials" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'materials' AND 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Allow admin update access to materials" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'materials' AND 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Allow admin delete access to materials" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'materials' AND 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
