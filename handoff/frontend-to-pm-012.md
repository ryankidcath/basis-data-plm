# Handoff: Frontend Engineer → Project Manager

## From
Frontend Engineer

## To
Project Manager

## Context

Handoff pm-to-frontend-012: Rombak komponen form "Input Data" agar tidak terasa sesak (crowded). Referensi: Linear/Vercel.

## Objective

Mengonfirmasi penyelesaian deliverable layout form Input Data.

## Result Summary

**Status: DONE**

### 1. Sidebar Dihapus ✓
- Navigasi vertikal (Administrasi, Informasi Spasial, Surat Tugas, dll.) dihilangkan
- **Opsi A:** Layout linear — semua section tampil dalam satu scroll

### 2. Grid & Label ✓
- `grid-cols-2` untuk field kecil
- Label: `text-xs font-semibold text-slate-500`
- Input: `border-slate-200 rounded-lg`, focus ring indigo
- Konsisten di semua form

### 3. Kontainer Dibersihkan ✓
- Card wrapper dihapus dari form sections
- Section heading: `border-t border-slate-200 pt-6 mt-6` antar kategori
- Form menyatu dengan background panel

### 4. Dokumen Tersedia ✓ (Opsi B)
- Diubah menjadi dropdown "Cetak Dokumen"
- Tombol compact, dropdown ke atas saat diklik
- Akses ke: Tanda Terima, SLA, Invoice, Kwitansi, Surat Tugas, Surat Pemberitahuan

### 5. Visual Hierarchy ✓
- `space-y-8` antar section
- Tombol Simpan: `w-full py-3 bg-indigo-600 font-semibold rounded-lg` — dominan
- `pb-24` pada scroll area untuk ruang bawah

## Files Modified

- `components/panel/WorkflowForms.tsx` — linear layout, hapus sidebar
- `components/panel/forms/*.tsx` — 14 form: hapus Card, section border-t, FORM_* styling
- `lib/formStyles.ts` — shared constants (FORM_LABEL, FORM_INPUT, FORM_SECTION, FORM_BUTTON)
- `app/dashboard/page.tsx` — DokumenDropdown
- `components/panel/PdfUpload.tsx`, `GeoJSONUpload.tsx` — slate styling

## Constraints Respected

- Hanya layout & styling, logika bisnis/validasi/submit tidak diubah
- Semua form existing tetap didukung

## Done When

- [x] Sidebar vertikal hilang, layout linear
- [x] Grid 2-kolom, label text-xs font-semibold text-slate-500
- [x] Border kotak (Card) dihapus, section border-top
- [x] Dokumen Tersedia → dropdown
- [x] space-y-8, tombol Simpan dominan
- [x] Build PASS
