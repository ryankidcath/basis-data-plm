-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enums
CREATE TYPE jenis_lisensi_enum AS ENUM ('surveyor kadaster', 'asisten surveyor kadaster');
CREATE TYPE penggunaan_tanah_1_enum AS ENUM (
  'pertanian/perkebunan',
  'hunian/pekarangan',
  'komersial',
  'industri',
  'pertambangan'
);
CREATE TYPE penggunaan_tanah_2_enum AS ENUM ('pertanian', 'non-pertanian');

-- 1. pemohon
CREATE TABLE pemohon (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  no_hp TEXT,
  nik TEXT,
  alamat TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. klien
CREATE TABLE klien (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  no_hp TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. surveyor
CREATE TABLE surveyor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  no_lisensi TEXT NOT NULL,
  jenis_lisensi jenis_lisensi_enum NOT NULL,
  no_hp TEXT,
  nik TEXT,
  alamat TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. permohonan
CREATE TABLE permohonan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kode_kjsb TEXT UNIQUE NOT NULL,
  pemohon_id UUID NOT NULL REFERENCES pemohon(id) ON DELETE RESTRICT,
  klien_id UUID REFERENCES klien(id) ON DELETE SET NULL,
  tanggal_permohonan DATE NOT NULL,
  luas_permohonan NUMERIC NOT NULL,
  penggunaan_tanah_1 penggunaan_tanah_1_enum NOT NULL,
  lokasi_tanah TEXT,
  kota_kabupaten TEXT,
  kecamatan TEXT,
  kelurahan_desa TEXT,
  status_permohonan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. administrasi
CREATE TABLE administrasi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permohonan_id UUID UNIQUE NOT NULL REFERENCES permohonan(id) ON DELETE CASCADE,
  no_tanda_terima TEXT,
  tanggal_tanda_terima DATE,
  no_sla TEXT,
  tanggal_sla DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. keuangan
CREATE TABLE keuangan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permohonan_id UUID UNIQUE NOT NULL REFERENCES permohonan(id) ON DELETE CASCADE,
  no_invoice TEXT,
  tanggal_invoice DATE,
  no_kwitansi TEXT,
  tanggal_kwitansi DATE,
  biaya_pengukuran NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. informasi_spasial
CREATE TABLE informasi_spasial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permohonan_id UUID UNIQUE NOT NULL REFERENCES permohonan(id) ON DELETE CASCADE,
  no_berkas TEXT,
  tanggal_berkas DATE,
  tanggal_sps DATE,
  biaya NUMERIC DEFAULT 0,
  tanggal_bayar_sps DATE,
  tanggal_download_hasil DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. informasi_spasial_nib
CREATE TABLE informasi_spasial_nib (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  informasi_spasial_id UUID NOT NULL REFERENCES informasi_spasial(id) ON DELETE CASCADE,
  nib_bidang_eksisting TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. surat_tugas_pemberitahuan
CREATE TABLE surat_tugas_pemberitahuan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permohonan_id UUID UNIQUE NOT NULL REFERENCES permohonan(id) ON DELETE CASCADE,
  no_surat_tugas TEXT,
  tanggal_surat_tugas DATE,
  no_surat_pemberitahuan TEXT,
  tanggal_surat_pemberitahuan DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. pengukuran
CREATE TABLE pengukuran (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  surat_tugas_id UUID NOT NULL REFERENCES surat_tugas_pemberitahuan(id) ON DELETE CASCADE,
  surveyor_id UUID NOT NULL REFERENCES surveyor(id) ON DELETE RESTRICT,
  tanggal_pengukuran DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(surat_tugas_id, surveyor_id, tanggal_pengukuran)
);

-- 11. legalisasi_gu
CREATE TABLE legalisasi_gu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permohonan_id UUID UNIQUE NOT NULL REFERENCES permohonan(id) ON DELETE CASCADE,
  no_berkas TEXT,
  tanggal_berkas DATE,
  luas_hasil_ukur NUMERIC,
  penggunaan_tanah_2 penggunaan_tanah_2_enum,
  tanggal_sps DATE,
  biaya NUMERIC DEFAULT 0,
  tanggal_bayar_sps DATE,
  tanggal_penyelesaian DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. bidang_tanah (with PostGIS geom)
CREATE TABLE bidang_tanah (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permohonan_id UUID NOT NULL REFERENCES permohonan(id) ON DELETE CASCADE,
  geom GEOMETRY(Geometry, 4326),
  nib TEXT,
  tanggal_nib DATE,
  luas_otomatis NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_bidang_tanah_permohonan ON bidang_tanah(permohonan_id);
CREATE INDEX idx_bidang_tanah_geom ON bidang_tanah USING GIST(geom);

-- 13. gambar_ukur
CREATE TABLE gambar_ukur (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permohonan_id UUID UNIQUE NOT NULL REFERENCES permohonan(id) ON DELETE CASCADE,
  no_gu TEXT,
  tanggal_gu DATE,
  tanggal_tte_gu DATE,
  tanggal_upload_gu_tte DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. peta_bidang_tanah
CREATE TABLE peta_bidang_tanah (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permohonan_id UUID UNIQUE NOT NULL REFERENCES permohonan(id) ON DELETE CASCADE,
  no_pbt TEXT,
  tanggal_pbt DATE,
  tanggal_tte_pbt DATE,
  tanggal_upload_pbt_tte DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'pemohon','klien','surveyor','permohonan','administrasi','keuangan',
    'informasi_spasial','informasi_spasial_nib','surat_tugas_pemberitahuan',
    'pengukuran','legalisasi_gu','bidang_tanah','gambar_ukur','peta_bidang_tanah'
  ])
  LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE PROCEDURE set_updated_at()',
      t
    );
  END LOOP;
END;
$$;

-- RLS: enable for all tables
ALTER TABLE pemohon ENABLE ROW LEVEL SECURITY;
ALTER TABLE klien ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveyor ENABLE ROW LEVEL SECURITY;
ALTER TABLE permohonan ENABLE ROW LEVEL SECURITY;
ALTER TABLE administrasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE keuangan ENABLE ROW LEVEL SECURITY;
ALTER TABLE informasi_spasial ENABLE ROW LEVEL SECURITY;
ALTER TABLE informasi_spasial_nib ENABLE ROW LEVEL SECURITY;
ALTER TABLE surat_tugas_pemberitahuan ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengukuran ENABLE ROW LEVEL SECURITY;
ALTER TABLE legalisasi_gu ENABLE ROW LEVEL SECURITY;
ALTER TABLE bidang_tanah ENABLE ROW LEVEL SECURITY;
ALTER TABLE gambar_ukur ENABLE ROW LEVEL SECURITY;
ALTER TABLE peta_bidang_tanah ENABLE ROW LEVEL SECURITY;

-- RLS policies: authenticated users can read/write
CREATE POLICY "Authenticated read" ON pemohon FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write" ON pemohon FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON klien FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write" ON klien FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON surveyor FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write" ON surveyor FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON permohonan FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write" ON permohonan FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON administrasi FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write" ON administrasi FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON keuangan FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write" ON keuangan FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON informasi_spasial FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write" ON informasi_spasial FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON informasi_spasial_nib FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write" ON informasi_spasial_nib FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON surat_tugas_pemberitahuan FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write" ON surat_tugas_pemberitahuan FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON pengukuran FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write" ON pengukuran FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON legalisasi_gu FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write" ON legalisasi_gu FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON bidang_tanah FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write" ON bidang_tanah FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON gambar_ukur FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write" ON gambar_ukur FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated read" ON peta_bidang_tanah FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated write" ON peta_bidang_tanah FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RPC to return bidang_tanah with geom as GeoJSON (for client)
CREATE OR REPLACE FUNCTION get_bidang_tanah_geojson()
RETURNS TABLE (
  id UUID,
  permohonan_id UUID,
  nib TEXT,
  geom_json TEXT
) AS $$
  SELECT
    bt.id,
    bt.permohonan_id,
    bt.nib,
    ST_AsGeoJSON(bt.geom)::TEXT AS geom_json
  FROM bidang_tanah bt
  WHERE bt.geom IS NOT NULL;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- RPC to upsert bidang_tanah geometry from GeoJSON
CREATE OR REPLACE FUNCTION upsert_bidang_geom(
  p_id UUID,
  p_permohonan_id UUID,
  p_geojson TEXT,
  p_nib TEXT DEFAULT NULL,
  p_tanggal_nib DATE DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
  v_area NUMERIC;
BEGIN
  IF p_id IS NOT NULL THEN
    UPDATE bidang_tanah
    SET
      geom = ST_GeomFromGeoJSON(p_geojson)::geometry,
      nib = COALESCE(p_nib, nib),
      tanggal_nib = COALESCE(p_tanggal_nib, tanggal_nib),
      luas_otomatis = ST_Area(ST_Transform(ST_GeomFromGeoJSON(p_geojson)::geometry, 32748)) / 10000
    WHERE bidang_tanah.id = p_id
    RETURNING bidang_tanah.id INTO v_id;
    RETURN v_id;
  ELSE
    INSERT INTO bidang_tanah (permohonan_id, geom, nib, tanggal_nib, luas_otomatis)
    VALUES (
      p_permohonan_id,
      ST_GeomFromGeoJSON(p_geojson)::geometry,
      p_nib,
      p_tanggal_nib,
      ST_Area(ST_Transform(ST_GeomFromGeoJSON(p_geojson)::geometry, 32748)) / 10000
    )
    RETURNING bidang_tanah.id INTO v_id;
    RETURN v_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
