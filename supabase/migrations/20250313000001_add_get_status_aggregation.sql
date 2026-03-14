-- RPC: get_status_aggregation
-- Dashboard Status Berkas: agregasi count permohonan per status
-- Urutan mengikuti STATUS_PERMOHONAN_ORDER (lib/status-permohonan.ts)
-- Status tanpa permohonan: count = 0
-- Permohonan dengan status_permohonan = NULL tidak termasuk (ARCH)

CREATE OR REPLACE FUNCTION get_status_aggregation()
RETURNS TABLE (status_permohonan TEXT, count BIGINT) AS $$
  SELECT
    s.status_permohonan,
    COUNT(p.id)::BIGINT
  FROM (SELECT unnest(ARRAY[
    'Pendaftaran','Pembayaran','Entri Informasi Spasial','Verifikasi Informasi Berkas',
    'Pembayaran Informasi Spasial','Pembuatan Surat Tugas','Pengukuran','Verifikasi Berkas',
    'Pembayaran Legalisasi GU','Pemetaan','TTE GU & PBT','Upload GU & PBT',
    'Menunggu Penyelesaian','Selesai'
  ]) AS status_permohonan) s
  LEFT JOIN permohonan p ON p.status_permohonan = s.status_permohonan
  GROUP BY s.status_permohonan
  ORDER BY array_position(ARRAY[
    'Pendaftaran','Pembayaran','Entri Informasi Spasial','Verifikasi Informasi Berkas',
    'Pembayaran Informasi Spasial','Pembuatan Surat Tugas','Pengukuran','Verifikasi Berkas',
    'Pembayaran Legalisasi GU','Pemetaan','TTE GU & PBT','Upload GU & PBT',
    'Menunggu Penyelesaian','Selesai'
  ], s.status_permohonan);
$$ LANGUAGE sql SECURITY DEFINER STABLE;
