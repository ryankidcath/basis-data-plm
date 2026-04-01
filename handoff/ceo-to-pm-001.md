# Handoff: CEO → Project Manager

## From
CEO

## To
Project Manager

## Context

User ingin menambahkan **dashboard**, terutama untuk **status berkas** (status permohonan).  
Produk: **Basis Data PLM** (KJSB Benning dan Rekan) — sistem basis data spasial untuk Permohonan Langsung Masyarakat.

Saat ini aplikasi sudah punya:
- Workflow 5 tahap (Administrasi, Informasi Spasial, Surat Tugas, Legalisasi GU, NIB/GU/PBT)
- 14 status permohonan: Pendaftaran → Pembayaran → … → Selesai
- Halaman dashboard dengan peta + panel input/lihat; tidak ada tampilan agregat status
- `status_permohonan` tersimpan di tabel `permohonan`; dapat dihitung dari `computeStatusFromDetail` atau diekspor via CSV

## Objective

Tambahkan dashboard yang menampilkan **status berkas** secara agregat dan memudahkan pemantauan progres permohonan. Fokus utama: visibilitas status, bukan pengganti workflow input yang sudah ada.

## Constraints

- Tetap memanfaatkan struktur data dan status yang sudah ada (`status_permohonan`, `STATUS_PERMOHONAN_ORDER`)
- Tidak mengubah flow input/lihat berkas yang sudah berjalan
- Tetap dalam ekosistem Next.js + Supabase

## Deliverables

1. **Dashboard status berkas** — tampilan agregat status permohonan:
   - Jumlah per status (misal: chart atau ringkasan)
   - Kemampuan filter/pencarian permohonan menurut status
   - Ringkasan cepat: total, selesai, dalam proses, perlu perhatian (opsional)
2. **Integrasi dengan halaman utama** — akses ke dashboard status dari UI yang ada tanpa memecah flow utama

## Dependencies

- Data `permohonan` dengan kolom `status_permohonan` ( sudah ada )
- Supabase queries untuk agregasi status (perlu dirancang/ditambah)
- Auth Supabase (sudah ada)

## Open Questions

- Apakah perlu timeline/tren (misal per bulan)?
- Apakah ada status/permohonan yang perlu diperlakukan khusus (overdue, stuck > X hari)?
- Apakah dashboard harus di halaman terpisah atau di area dashboard yang sudah ada?

## Done When

- User dapat melihat ringkasan jumlah permohonan per status
- User dapat mencari/filter permohonan berdasarkan status
- Dashboard status dapat diakses dari aplikasi dan memberikan nilai bagi operasional harian
