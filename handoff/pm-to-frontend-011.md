# Handoff: PM → Frontend Engineer

## From
Project Manager

## To
Frontend Engineer

## Context

User feedback: Tulisan "PERMOHONAN" (judul section) terlihat mirip dengan "STATUS", "TANGGAL", "LUAS", "PENGGUNAAN" (label field). User bingung bacanya — tidak jelas mana judul bagian (bagian dari apa) dan mana label field.

**File:** `project/basis-data-plm/components/panel/DetailPanel.tsx`

**Struktur saat ini:**
- `h3` = judul section (Permohonan, Pemohon, Klien, Administrasi, dll.) — pakai `labelClass`
- `dt` = label field (Status, Tanggal, Luas, Nama, dll.) — pakai `labelClass`

Keduanya pakai class sama → terlihat mirip.

## Objective

Pisahkan styling **judul section** (h3) dan **label field** (dt) agar hierarki jelas:
- **Judul section** (Permohonan, Pemohon, Klien, dll.): lebih besar, lebih menonjol — user langsung tahu "ini bagian dari apa"
- **Label field** (Status, Tanggal, Luas, dll.): lebih kecil/ringan — jelas sebagai sub-label di bawah judul section

## Constraints

- Next.js 14, TypeScript, Tailwind CSS
- Hanya styling — tidak ubah struktur atau logika

## Deliverables

1. **Section header class** (untuk h3): Permohonan, Pemohon, Klien, Administrasi, Keuangan, dll.
   - Lebih besar dari label field (mis. `text-sm` atau `text-base`)
   - Lebih tebal atau warna lebih gelap
   - Contoh: `text-sm font-bold text-slate-900` atau `text-base font-semibold text-slate-800` — jelas sebagai "judul bagian"

2. **Field label class** (untuk dt): Status, Tanggal, Luas, Nama, dll.
   - Tetap lebih menonjol dari value, tapi lebih kecil/ringan dari section header
   - Contoh: `text-[10px] uppercase tracking-widest text-slate-500 font-semibold` — jelas sebagai "label field"

3. **Value class** (dd): tetap seperti sekarang — paling ringan

## Dependencies

- DetailPanel.tsx existing

## Done When

- Judul section (Permohonan, Pemohon, dll.) terlihat JELAS berbeda dari label field (Status, Tanggal, dll.)
- User tidak bingung mana judul bagian dan mana label field
- Hierarki: Section header > Field label > Value
- Build PASS
