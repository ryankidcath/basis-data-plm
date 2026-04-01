# Handoff: System Architect → Backend Engineer

## From
System Architect

## To
Backend Engineer

## Context

Fitur **Dashboard Status Berkas** untuk Basis Data PLM. PM meminta agregasi count per status permohonan dan filter list. Arsitektur sudah ditetapkan: agregasi via Supabase RPC, tanpa API route Next.js. Dokumen lengkap: `project/basis-data-plm/docs/ARCH-dashboard-status-001.md`.

## Objective

Implementasi **Supabase RPC `get_status_aggregation`** yang mengembalikan count permohonan per status, mengikuti urutan `STATUS_PERMOHONAN_ORDER` (14 status).

## Constraints

- Tetap Next.js + Supabase
- Gunakan kolom `status_permohonan` di tabel `permohonan`
- Tidak mengubah skema tabel yang ada; tambah RPC saja
- RPC harus return status yang tidak punya permohonan dengan count = 0

## Deliverables

1. **Migration Supabase** — file migration baru yang mendefinisikan fungsi `get_status_aggregation()`
2. **Return format:** `TABLE (status_permohonan TEXT, count BIGINT)`
3. **Urutan:** Mengikuti `STATUS_PERMOHONAN_ORDER` di `lib/status-permohonan.ts`:
   - Pendaftaran, Pembayaran, Entri Informasi Spasial, Verifikasi Informasi Berkas,
   - Pembayaran Informasi Spasial, Pembuatan Surat Tugas, Pengukuran, Verifikasi Berkas,
   - Pembayaran Legalisasi GU, Pemetaan, TTE GU & PBT, Upload GU & PBT,
   - Menunggu Penyelesaian, Selesai

## SQL Reference (dari ARCH)

```sql
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
```

## Dependencies

- Tabel `permohonan` dengan kolom `status_permohonan`
- Folder migrations: `project/basis-data-plm/supabase/migrations/`

## Open Questions

- Status NULL: Permohonan dengan `status_permohonan = NULL` tidak masuk agregasi. Bila perlu baris "Tanpa status", beri tahu Architect.

## Done When

- Migration berjalan sukses (`supabase db push` atau `migrate`)
- RPC `get_status_aggregation` dapat dipanggil dari client Supabase dan mengembalikan 14 baris `{ status_permohonan, count }`
