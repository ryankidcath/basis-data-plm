# Handoff: CEO → Project Manager

## From
CEO

## To
Project Manager

## Context

User meminta **rekonstruksi layout dashboard GIS** (halaman setelah login) menjadi modern SaaS style dengan konsep **"Floating UI"** di atas peta. Halaman login sudah selesai (ceo-to-pm-004).

**Referensi:** Desain ringan, luas, premium — mirip Linear/Vercel.

**File utama:**
- `app/dashboard/page.tsx` — layout utama, header, struktur
- `components/panel/DetailPanel.tsx` — detail berkas (Informasi Berkas)
- `components/map/MapView.tsx` — container Leaflet
- `components/map/MapSection.tsx` — wrapper map

## Objective

Ubah layout dashboard dari split-view (map kiri 52%, panel kanan 48%) menjadi **fullscreen map** dengan **floating card** di sisi kanan. Navbar ramping atau floating menu. Styling konsisten dengan estetika SaaS modern.

## Constraints

- Next.js 14, TypeScript, Tailwind CSS
- Gunakan **Lucide React** untuk icon (perlu `npm install lucide-react` bila belum ada)
- Jangan ubah logika bisnis, autentikasi, atau flow data — hanya layout & styling

## Deliverables

### 1. Layout Utama

- Map (Leaflet) memenuhi seluruh layar: `h-screen`, `w-full`
- Panel data (sidebar) menjadi **kartu mengambang** di sisi kanan:
  - `absolute`, `z-[1000]`, `top-6`, `right-6`, `bottom-6`
  - Lebar maksimal `450px`
  - `bg-white/90`, `backdrop-blur-md`, `rounded-[32px]`, `shadow-2xl`

### 2. Tipografi & Data (DetailPanel — "Informasi Berkas")

- Ubah tampilan list data menjadi **grid 2 kolom**
- **Label:** `text-[10px] uppercase tracking-widest text-slate-400 font-bold`
- **Value:** `text-sm text-slate-800 font-medium`
- Space antar baris: `space-y-4` (cukup bernapas)

### 3. Navigasi & Header

- **Opsi A (preferensi):** Hilangkan navbar hitam, ganti dengan **floating menu kecil** di pojok kiri atas
- **Opsi B:** Jika tetap pakai Navbar — gunakan `bg-white/80`, `text-slate-900`, `border-b border-slate-100`, jauh lebih ramping
- Link yang harus tetap ada: Dashboard Status, Ekspor data, Keluar
- Logo + branding tetap terlihat

### 4. Tombol Cetak Dokumen

- Di bagian bawah detail berkas, buat section **"Dokumen Tersedia"**
- Tampilkan sebagai **grid tombol kecil dengan icon** (Lucide)
- Styling: `bg-slate-50`, `hover:bg-slate-100`, border halus
- **Jangan gunakan teks merah** (ganti dari `text-gold-600` / merah ke slate/indigo netral)
- Dokumen: Tanda Terima, SLA, Invoice, Kwitansi, Surat Tugas, Surat Pemberitahuan

### 5. Map Controls (Leaflet)

- Pindahkan **zoom controls** ke pojok kanan bawah agar tidak tertutup floating sidebar
- Styling ulang: `rounded-xl`, shadow konsisten dengan UI lainnya
- Leaflet ZoomControl: gunakan `position="bottomright"` (atau sesuaikan agar tidak overlap dengan sidebar)

### 6. Search & Tabs

- Combobox "Pilih permohonan" dan tab "Informasi Berkas" / "Input Data" — pindahkan ke dalam floating card atau floating search di atas map
- Pastikan UX tetap jelas: user bisa cari permohonan, pilih mode lihat/input, dan akses WorkflowForms

## Dependencies

- `lucide-react` — install bila belum ada
- Leaflet, react-leaflet (existing)
- Tailwind (slate, backdrop-blur tersedia)

## Open Questions

- Floating menu vs navbar ramping — user memberi dua opsi; PM/Frontend bisa pilih yang lebih cocok untuk layout fullscreen map.
- Posisi search combobox — bisa di dalam floating card bagian atas, atau floating search bar terpisah di kiri atas.

## Done When

- Map fullscreen, floating card di kanan dengan styling `bg-white/90`, `backdrop-blur-md`, `rounded-[32px]`, `shadow-2xl`
- Detail berkas: grid 2 kolom, label/value sesuai spec, `space-y-4`
- Navbar ramping atau floating menu di kiri atas
- Dokumen Tersedia: grid tombol dengan icon, `bg-slate-50`/`hover:bg-slate-100`, tanpa teks merah
- Zoom controls Leaflet di pojok kanan bawah, `rounded-xl`, tidak tertutup sidebar
- Desain terasa ringan, luas, premium
