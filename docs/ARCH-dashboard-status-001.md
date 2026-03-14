# Architecture: Dashboard Status Berkas

**Produk:** Basis Data PLM  
**Sumber:** PM handoff pm-to-architect-001.md  
**PRD:** PRD-dashboard-status-001.md

---

## 1. Keputusan Penempatan Halaman

**Dashboard status di halaman terpisah:** `/dashboard/status`

Alasan:
- PRD: "akses ke dashboard status dari UI yang ada **tanpa memecah flow utama**"
- Flow utama = peta + panel input/lihat permohonan; tidak boleh terganggu
- Tab ketiga di panel akan memenuhi ruang dan membingungkan
- Halaman terpisah memungkinkan fokus agregat + filter tanpa mengubah layout peta
- Akses via link di header (sejajar "Ekspor data") — user bisa beralih kapan perlu

---

## 2. Component Boundaries

| Komponen | Lokasi | Server / Client | Tugas |
|----------|--------|-----------------|-------|
| Halaman Status | `app/dashboard/status/page.tsx` | Client | Fetch agregasi + list, render chart + filter |
| Agregasi count per status | Supabase RPC | N/A | Query DB, return JSON |
| List permohonan filter | Supabase `.from("permohonan")` | Client | Select + filter by status |
| Header link | `app/dashboard/page.tsx` | Client | Tambah link "Dashboard Status" |
| Status aggregation query | `lib/supabase/queries.ts` (optional) | — | Wrapper `supabase.rpc()` bila ingin reuse |

**Tidak perlu API route Next.js** untuk agregasi: frontend memanggil Supabase RPC langsung (sesuai pola `get_bidang_tanah_geojson`). RPC jalan dengan auth token user; RLS tetap berlaku via Supabase.

---

## 3. Data Flow & Contract

### 3.1 Agregasi Count per Status

**RPC:** `get_status_aggregation`

**Return:**
```ts
// Array of { status_permohonan: string, count: number }
// Urutan mengikuti STATUS_PERMOHONAN_ORDER (14 status)
// Status yang tidak ada permohonan: count = 0 (harus diisi di frontend)
```

**Implementasi SQL (dalam migration):**
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

Catatan: Status `NULL` di permohonan tidak dimasukkan ke agregasi (edge case minor). Bila perlu, bisa ditambah baris khusus "Tanpa status".

### 3.2 Ringkasan Cepat

Dihitung di frontend dari hasil RPC:
- **Total:** sum semua count
- **Selesai:** count untuk status "Selesai"
- **Dalam proses:** Total - Selesai
- **Perlu perhatian:** **Diluar scope MVP** (overdue/stuck butuh definisi bisnis dari CEO). Defer ke post-MVP.

### 3.3 List Permohonan Filter

**Query:** Standard Supabase select dari client.

```ts
supabase
  .from("permohonan")
  .select("id, kode_kjsb, tanggal_permohonan, status_permohonan, lokasi_tanah, created_at, pemohon(nama)")
  .eq("status_permohonan", selectedStatus)
  .order("created_at", { ascending: false })
```

Filter opsional: tambah `.ilike("kode_kjsb", `%${search}%`)` bila ada pencarian teks.

### 3.4 Urutan Status

Gunakan `STATUS_PERMOHONAN_ORDER` dari `lib/status-permohonan.ts` untuk:
- Sort chart / tabel
- Label konsisten

---

## 4. Tradeoff

| Keputusan | Alternatif | Alasan dipilih |
|-----------|------------|----------------|
| RPC vs API route | API route `/api/dashboard/aggregation` | RPC: konsisten dengan `get_bidang_tanah_geojson`, tidak perlu layer tambahan, auth via Supabase |
| Halaman terpisah vs tab | Tab di dashboard | Halaman terpisah: flow utama tidak terganggu, layout lebih rapi |
| Agregasi di DB vs client | Fetch semua row, aggregate di client | DB: efisien untuk ribuan permohonan, beban di DB bukan browser |

---

## 5. Risiko

- **Status NULL:** Permohonan lama mungkin `status_permohonan = NULL`. RPC saat ini tidak memasukkan baris untuk NULL. Bila perlu, tambah handling di RPC atau tampilkan "Tanpa status".
- **Perlu perhatian:** Tanpa definisi overdue/stuck dari CEO, fitur "perlu perhatian" ditunda.

---

## 6. Dependency untuk Implementasi

- Backend: migration Supabase untuk `get_status_aggregation`
- Frontend: halaman `/dashboard/status`, komponen chart/list, link di header
- Dapat dikerjakan paralel: Frontend bisa mock response RPC dulu, Backend fokus pada migration
