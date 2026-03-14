# PRD: Dashboard Status Berkas

**Produk:** Basis Data PLM (KJSB Benning dan Rekan)  
**Fitur:** Dashboard agregat status permohonan  
**Sumber:** CEO brief (ceo-to-pm-001.md)

---

## 1. Tujuan

Tambahkan dashboard yang menampilkan **status berkas** secara agregat untuk memudahkan pemantauan progres permohonan. Fokus utama: visibilitas status, **bukan** pengganti workflow input yang sudah ada.

## 2. Scope

### Dalam scope
- Tampilan agregat jumlah permohonan per status (14 status mengikuti `STATUS_PERMOHONAN_ORDER`)
- Filter/pencarian permohonan menurut status
- Ringkasan cepat: total, selesai, dalam proses, perlu perhatian (opsional)
- Integrasi dengan halaman utama: akses dashboard status tanpa memecah flow utama

### Di luar scope
- Perubahan flow input/lihat berkas
- Penggantian sistem status yang ada

## 3. Constraints

- Gunakan struktur data yang ada (`status_permohonan` di tabel `permohonan`, `computeStatusFromDetail`)
- Tetap dalam ekosistem Next.js + Supabase
- Auth Supabase tetap dipakai

## 4. Dependencies Teknis

- Tabel `permohonan` dengan kolom `status_permohonan` (sudah ada)
- Supabase queries untuk agregasi (perlu dirancang/ditambah)
- `lib/status-permohonan.ts` — urutan dan logika status (sudah ada)

## 5. Open Questions (untuk CEO/Architect)

| # | Pertanyaan | Pemilik |
|---|------------|---------|
| 1 | Apakah perlu timeline/tren (misal per bulan)? | CEO |
| 2 | Apakah ada status/permohonan yang perlu diperlakukan khusus (overdue, stuck > X hari)? | CEO |
| 3 | Apakah dashboard harus di halaman terpisah atau di area dashboard yang sudah ada? | Architect |

## 6. Done When

- User dapat melihat ringkasan jumlah permohonan per status
- User dapat mencari/filter permohonan berdasarkan status
- Dashboard status dapat diakses dari aplikasi dan memberikan nilai bagi operasional harian
