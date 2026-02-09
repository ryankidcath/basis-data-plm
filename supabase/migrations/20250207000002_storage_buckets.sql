-- Storage buckets for permohonan files (scan berkas, hasil ukur, etc.)
-- Path: permohonan/{permohonan_id}/...

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'permohonan',
  'permohonan',
  false,
  52428800, -- 50MB
  ARRAY['application/json', 'application/geo+json', 'application/pdf', 'image/jpeg', 'image/png', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- RLS: authenticated users can read/write
CREATE POLICY "Authenticated read permohonan bucket"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'permohonan');

CREATE POLICY "Authenticated insert permohonan bucket"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'permohonan');

CREATE POLICY "Authenticated update permohonan bucket"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'permohonan');

CREATE POLICY "Authenticated delete permohonan bucket"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'permohonan');
