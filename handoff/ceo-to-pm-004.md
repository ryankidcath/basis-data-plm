# Handoff: CEO → Project Manager

## From
CEO

## To
Project Manager

## Context

User meminta **rekonstruksi total halaman login** Basis Data PLM agar mencapai standar UI/UX SaaS modern (referensi: Linear, Vercel). Tampilan harus bersih, profesional, dan memiliki hierarki visual yang kuat.

**Catatan:** Implementasi sudah pernah dilakukan langsung oleh agent sebelumnya. PM perlu memastikan hasil akhir sesuai spesifikasi di bawah, dan delegasikan ke Frontend Engineer bila perlu penyesuaian atau validasi.

## Objective

Rekonstruksi halaman login (`app/login/page.tsx`) dengan desain modern SaaS:
- Bersih, profesional, hierarki visual kuat
- Terlihat "mahal" dan fungsional
- Hapus styling lama yang terlihat kaku atau amatir

## Constraints

- **Tech stack:** Next.js 14, TypeScript, Tailwind CSS
- Gunakan komponen reusable (Button, Input) bila sudah ada — sesuaikan via `className` props
- Jangan ubah flow autentikasi (Supabase) — hanya UI/UX

## Deliverables

### 1. Layout Utama & Background
- Background: `bg-slate-950` (bukan hitam pekat)
- Kartu login center vertikal dan horizontal

### 2. Desain Kartu (Login Card)
- `bg-white`, `p-12` (atau `p-16` untuk layar besar)
- `rounded-3xl`
- `border border-slate-100`, `shadow-2xl`
- `max-w-lg`

### 3. Header & Branding
- Logo: kecilkan, letakkan di container `bg-red-50`, `p-3`, `rounded-2xl`
- Judul: "KJSB Benning dan Rekan" — `text-3xl`, `font-extrabold`, `text-slate-950`, `tracking-tight`, font sans-serif (Inter/Geist), **jangan serif**
- Subjudul: "Selamat datang kembali. Silakan masuk untuk mengakses sistem." — `text-lg`, `font-medium`, `text-slate-600`, jarak cukup dari judul

### 4. Komponen Input
- Label: `text-sm`, `font-medium`, `text-slate-700`
- Input: `bg-white`, `border-slate-200`, `px-4`, `py-3`, `rounded-lg`
- Fokus: `focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all`
- Link "Lupa kata sandi?" di atas input password sebelah kanan — `text-indigo-600`, `text-sm`

### 5. Tombol Aksi
- `bg-indigo-600`, hover `bg-indigo-700`
- `py-3.5`, `font-semibold`, `text-white`

### 6. Spacing
- Antar elemen: `space-y-6` atau `space-y-8` agar desain "bernapas"

## Dependencies

- Halaman login existing: `project/basis-data-plm/app/login/page.tsx`
- Supabase auth flow (tetap)
- Tailwind config (slate, indigo tersedia di default Tailwind)

## Open Questions

- Link "Lupa kata sandi?" — user tidak spesifik tujuan. PM/Frontend bisa pakai `/forgot-password` atau placeholder; halaman forgot-password bisa scope terpisah.

## Done When

- Halaman login tampil sesuai spesifikasi di atas
- Terlihat bersih, profesional, hierarki visual kuat
- Fungsionalitas login (Supabase) tetap berjalan
- Tidak ada styling lama yang terlihat kaku/amatir
