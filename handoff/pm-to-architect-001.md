# Handoff: PM → System Architect

## From
Project Manager

## To
System Architect

## Context

Fitur: **Dashboard Status Berkas** untuk Basis Data PLM. CEO meminta tampilan agregat status permohonan, filter/pencarian, dan integrasi dengan UI yang ada. Produk sudah punya: workflow 5 tahap, 14 status (`STATUS_PERMOHONAN_ORDER`), halaman dashboard dengan peta + panel input/lihat. Data `status_permohonan` ada di tabel `permohonan`. PRD: `project/basis-data-plm/docs/PRD-dashboard-status-001.md`.

## Objective

Putuskan arsitektur teknis untuk fitur dashboard status: penempatan halaman/komponen, alur data agregasi, dan API/query contract agar Backend dan Frontend bisa implementasi tanpa ambiguity.

## Constraints

- Tetap Next.js + Supabase
- Gunakan `status_permohonan` dan struktur data yang ada
- Tidak mengubah flow input berkas yang berjalan

## Deliverables

- Keputusan: dashboard di halaman terpisah vs area dashboard yang ada (jawab open question #3 dari PRD)
- Component boundaries: mana yang server, mana yang client; apakah perlu API route atau cukup Supabase query langsung
- Data flow untuk agregasi: struktur query/RPC, format response (count per status, ringkasan)
- API contract atau contract Supabase (bila ada endpoint baru)

## Dependencies

- PRD: `project/basis-data-plm/docs/PRD-dashboard-status-001.md`
- `lib/status-permohonan.ts` untuk urutan status
- Struktur `permohonan` dan `status_permohonan`

## Open Questions

- Apakah perlu API route khusus untuk agregasi atau cukup query Supabase langsung dari Frontend?
- Apakah ringkasan "perlu perhatian" (overdue/stuck) masuk scope MVP atau ditunda?

## Done When

- Arsitektur dan contract jelas sehingga PM bisa membuat handoff ke Backend dan Frontend untuk implementasi paralel
