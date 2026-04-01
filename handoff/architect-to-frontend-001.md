# Handoff: System Architect → Frontend Engineer

## From
System Architect

## To
Frontend Engineer

## Context

Fitur **Dashboard Status Berkas** untuk Basis Data PLM. PM meminta tampilan agregat status permohonan, filter/pencarian, dan integrasi dengan UI yang ada. Arsitektur: halaman terpisah `/dashboard/status`, agregasi via Supabase RPC, list via query langsung. Dokumen lengkap: `project/basis-data-plm/docs/ARCH-dashboard-status-001.md`.

## Objective

Implementasi halaman dashboard status dan integrasi navigasi ke dashboard utama.

## Constraints

- Tetap Next.js + Supabase
- Gunakan `STATUS_PERMOHONAN_ORDER` dari `lib/status-permohonan.ts` untuk urutan dan label
- Tidak mengubah flow input/lihat berkas yang ada
- Styling konsisten dengan dashboard yang ada (Tailwind, navy/gold palette)

## Deliverables

1. **Halaman `/dashboard/status`** — `app/dashboard/status/page.tsx`
   - Tampilan agregat: chart atau ringkasan jumlah per status (14 status)
   - Ringkasan cepat: Total, Selesai, Dalam proses (hitung dari data RPC)
   - Filter: pilih status → tampilkan list permohonan dengan status tersebut
   - Pencarian opsional: filter list by `kode_kjsb` (ilike)

2. **Link navigasi** — Tambah link "Dashboard Status" di header `app/dashboard/page.tsx` (sejajar "Ekspor data")

3. **Data flow:**
   - Agregasi: `supabase.rpc("get_status_aggregation")` → `{ status_permohonan: string, count: number }[]`
   - List permohonan: `supabase.from("permohonan").select(...).eq("status_permohonan", status).order(...)`
   - Kolom list: id, kode_kjsb, tanggal_permohonan, status_permohonan, lokasi_tanah, created_at, pemohon(nama)

## Out Of Scope (MVP)

- "Perlu perhatian" / overdue / stuck — defer ke post-MVP
- Timeline/tren per bulan — belum diputuskan CEO
- Halaman terpisah untuk detail permohonan dari list — klik bisa redirect ke dashboard utama dengan permohonan terpilih (atau link ke `/dashboard?highlight=id` jika ada dukungan)

## Dependencies

- RPC `get_status_aggregation` dari Backend (dapat dimock dulu untuk development paralel)
- `lib/status-permohonan.ts` — `STATUS_PERMOHONAN_ORDER`
- Auth: halaman harus di bawah route yang dilindungi (sama seperti `/dashboard`)

## Component Suggestions

- Client component (konsisten dengan `app/dashboard/page.tsx`)
- Reuse `PermohonanSearchCombobox` atau buat combobox/select untuk filter status
- Chart: bar chart sederhana (dapat pakai CSS atau library ringan seperti recharts — cek dependency existing)

## Done When

- User dapat membuka `/dashboard/status` dari link di header dashboard
- User dapat melihat ringkasan jumlah permohonan per status
- User dapat memfilter dan melihat list permohonan berdasarkan status
- Ringkasan cepat (Total, Selesai, Dalam proses) tampil benar
