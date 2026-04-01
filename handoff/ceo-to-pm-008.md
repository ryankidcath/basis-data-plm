# Handoff: CEO → Project Manager

## From
CEO

## To
Project Manager

## Context

User meminta **konsistensi navbar** antara halaman Peta (map) dan halaman Dashboard Status. Saat ini:
- **Halaman Peta** (`/dashboard`): Memakai floating menu dropdown di pojok kiri atas
- **Halaman Dashboard Status** (`/dashboard/status`): Memakai navbar penuh (putih, border-b)

User ingin kedua halaman memakai **navbar yang sama** (seperti di Dashboard Status), dan **penamaan link** diseragamkan.

## Objective

1. Halaman Peta (`/dashboard`) memakai **navbar penuh** seperti halaman Dashboard Status (bukan floating menu dropdown)
2. **Penamaan link:**
   - Link ke `/dashboard` → label **"Peta"**
   - Link ke `/dashboard/status` → label **"Dashboard"**
3. Navbar konsisten di kedua halaman: `bg-white`, `border-b border-slate-100`, link Peta, link Dashboard, Ekspor data, Keluar

## Constraints

- Next.js 14, TypeScript, Tailwind CSS
- Jangan ubah routing atau logika — hanya UI navbar dan label
- Tetap support fullscreen map di halaman Peta (navbar di atas, map di bawah)

## Deliverables

### 1. Halaman Peta (`/dashboard`)

- **Ganti** floating menu dropdown dengan **navbar penuh** seperti Dashboard Status
- Navbar: `bg-white`, `border-b border-slate-100`, `h-14`, layout horizontal
- Isi navbar: Logo + "KJSB Benning dan Rekan" | **Peta** (active/indigo) | Dashboard | Ekspor data | Keluar
- Map tetap fullscreen di bawah navbar (bukan lagi `absolute inset-0` — perlu adjust layout: navbar fixed/flex-shrink-0, map flex-1)

### 2. Halaman Dashboard Status (`/dashboard/status`)

- **Ganti label:** "Dashboard Status" → **"Dashboard"** (untuk halaman saat ini / active)
- **Ganti label:** "Dashboard" → **"Peta"** (untuk link ke /dashboard)
- Navbar tetap sama (sudah benar), hanya ubah teks

### 3. Ringkasan Label

| Route            | Label di Navbar | Saat active |
|------------------|-----------------|-------------|
| `/dashboard`     | Peta            | Peta (indigo) |
| `/dashboard/status` | Dashboard     | Dashboard (indigo) |

## Dependencies

- `app/dashboard/page.tsx` — layout, navbar
- `app/dashboard/status/page.tsx` — label navbar

## Open Questions

- Layout map: Bila navbar ditambah di atas, pastikan map tetap memenuhi sisa layar (`h-[calc(100vh-3.5rem)]` atau flex-1). Floating card di kanan tetap di posisi yang benar.

## Done When

- Halaman Peta punya navbar penuh (bukan floating menu)
- Label "Peta" untuk /dashboard, "Dashboard" untuk /dashboard/status
- Kedua halaman konsisten: navbar putih, link sama, active state Indigo
