# Handoff: CEO → Project Manager

## From
CEO

## To
Project Manager

## Context

User meminta **rekonstruksi halaman "Status Permohonan"** (dashboard status) agar terlihat seperti dashboard SaaS premium. Halaman ini menampilkan agregasi status permohonan, bar progress per status, dan tabel daftar permohonan.

**Tujuan:** Dashboard yang informatif, tidak melelahkan mata, dan terlihat profesional bagi klien atau pimpinan.

**File utama:**
- `app/dashboard/status/page.tsx` — halaman lengkap (header, hero stats, progress, tabel)

## Objective

Rekonstruksi dashboard status dengan estetika SaaS premium:
- Navbar putih, menu aktif Indigo
- Hero stats compact dengan icon Lucide
- Progress section: kartu tersendiri, bar kontras (0 = abu-abu muda, >0 = Indigo)
- Data table: header bersih, padding luas, tombol Detail (bukan link merah)
- Custom Select konsisten dengan halaman login
- Visual hierarchy: Kode KJSB bold, data sekunder slate-500

## Constraints

- Next.js 14, TypeScript, Tailwind CSS
- Gunakan **Lucide React** untuk icon (Clipboard, CheckCircle, Activity, Eye)
- Jangan ubah logika data, fetch, atau routing — hanya layout & styling

## Deliverables

### 1. Layout & Header

- **Navbar:** `bg-white` dengan `border-b border-slate-100`
- **Menu aktif:** Ganti dari merah/gold ke Indigo — `text-indigo-600` (untuk link "Dashboard Status Berkas" atau halaman saat ini)
- **Font:** Sans-serif Inter atau Geist untuk seluruh elemen (sesuaikan dengan layout global)
- Link: Dashboard, Ekspor data, Keluar — styling konsisten

### 2. Hero Stats (Top Section)

- Ubah 3 card statistik (Total, Selesai, Dalam Proses) menjadi **lebih compact**
- **Icon Lucide:** Clipboard (Total), CheckCircle (Selesai), Activity (Dalam Proses)
- **Warna angka spesifik:**
  - Selesai: `text-emerald-600`
  - Dalam Proses: `text-amber-600`
  - Total: `text-slate-900`
- Styling: `rounded-2xl`, shadow sangat lembut

### 3. Progress Section (Jumlah per Status)

- Ubah list status menjadi **kartu tersendiri** (masing-masing status = kartu)
- **Bar progress lebih kontras:**
  - Jika nilai = 0: abu-abu sangat muda (`bg-slate-100` atau serupa)
  - Jika nilai > 0: warna Indigo dengan opacity (`bg-indigo-500/60` atau serupa)
- **Jarak:** Dekatkan jarak antara Label Status dan Angka — jangan dipaksa full width jika layar terlalu lebar
- Tetap bisa diklik untuk filter daftar permohonan

### 4. Data Table (Bottom Section)

- **Header tabel:** Bersih dengan `bg-slate-50`
- **Padding baris:** `py-4` (lebih luas)
- **Aksi "Lihat":** Ganti teks merah dengan **Button kecil**:
  - Label: "Detail" atau icon mata (Lucide Eye)
  - Style: `ghost` atau `outline` (`border-slate-200`)
  - Tetap link ke `/dashboard?highlight={id}`
- **Dropdown "Pilih status":** Ganti select bawaan browser dengan **custom Select** yang stylenya konsisten dengan input di halaman login:
  - `rounded-lg`, `border-slate-200`
  - `focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500`

### 5. Visual Hierarchy

- **Kode KJSB:** `font-bold` agar menonjol
- **Data sekunder** (tanggal, lokasi): `text-slate-500`

## Dependencies

- `lucide-react` — icon Clipboard, CheckCircle, Activity, Eye
- Tailwind: slate, indigo, emerald, amber (default)
- Custom Select — bisa buat komponen atau pakai library (Headless UI, Radix) bila ada; bila tidak, buat simple custom select dengan styling konsisten

## Open Questions

- Custom Select — bila belum ada komponen reusable, buat simple dropdown dengan div + state, atau pakai native select dengan styling maksimal (beberapa browser membatasi styling native select).

## Done When

- Navbar putih, border-b tipis, menu aktif Indigo
- Hero stats: compact, icon Lucide, warna angka (Emerald/Amber/Slate)
- Progress section: kartu per status, bar kontras (0 = abu-abu, >0 = Indigo)
- Tabel: header bg-slate-50, py-4, tombol Detail/icon mata (ghost/outline)
- Custom Select konsisten dengan login
- Kode KJSB bold, data sekunder slate-500
- Dashboard terlihat premium, informatif, tidak melelahkan mata
