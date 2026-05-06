-- Public storage bucket for AI-generated OG images per blog post.
INSERT INTO storage.buckets (id, name, public)
VALUES ('og-images', 'og-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access; uploads only via service role (edge function).
DROP POLICY IF EXISTS "Public can read og-images" ON storage.objects;
CREATE POLICY "Public can read og-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'og-images');