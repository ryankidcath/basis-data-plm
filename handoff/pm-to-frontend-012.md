# Handoff: PM → Frontend Engineer

## From
Project Manager

## To
Frontend Engineer

## Context

CEO brief (ceo-to-pm-006): User meminta **rombak komponen form "Input Data"** agar tidak terasa sesak (crowded). Form ada di WorkflowForms — saat user pilih permohonan dan mode "Input Data", tampil form multi-tahap (Administrasi, Informasi Spasial, Surat Tugas, Legalisasi GU, NIB/GU/PBT).

**Tujuan:** User bisa melihat lebih banyak field dalam satu pandangan tanpa merasa terhimpit oleh dekorasi UI yang tidak perlu.

**File utama (di `project/basis-data-plm/`):**
- `components/panel/WorkflowForms.tsx` — container, sidebar, tabs, orchestration
- `components/panel/forms/*.tsx` — form individual (AdministrasiForm, PermohonanForm, InformasiSpasialForm, KeuanganForm, SuratTugasForm, LegalisasiGuForm, BidangTanahForm, GambarUkurForm, PetaBidangTanahForm, dll)
- `components/ui/Card.tsx` — wrapper yang dipakai tiap section
- `app/dashboard/page.tsx` — bagian "Dokumen Tersedia" (link cetak) di bawah panel

## Objective

Rombak layout form Input Data: hilangkan sidebar vertikal, optimasi grid, bersihkan border kotak, reposisi Dokumen Tersedia, visual hierarchy jelas. Jangan ubah logika bisnis, validasi, atau submit — hanya layout & styling. Tetap support semua form existing.

## Constraints

- Next.js 14, TypeScript, Tailwind CSS
- Jangan ubah logika bisnis, validasi, atau submit — hanya layout & styling
- Tetap support semua form existing (Administrasi, Informasi Spasial, Surat Tugas, Legalisasi GU, NIB/GU/PBT)

## Deliverables

### 1. Hapus Sidebar Internal

- **Hilangkan** navigasi vertikal di dalam panel (aside dengan Administrasi, Informasi Spasial, Surat Tugas, Legalisasi GU, NIB/GU/PBT)
- **Ganti** dengan salah satu:
  - **Opsi A:** Struktur linear (kebawah) — semua section tampil dalam satu scroll, dibatasi section heading
  - **Opsi B:** Horizontal tabs sangat simpel di bagian atas (ringan, tidak memakan ruang)
- Pilih opsi yang paling mengurangi rasa sesak

### 2. Optimasi Grid

- Gunakan `grid-cols-2` untuk input field yang ukurannya kecil (No Berkas, Tanggal, Luas, dll)
- **Label:** `text-xs`, `font-semibold`, `text-slate-500`
- Label di atas field (bukan inline)
- Terapkan konsisten di semua form (AdministrasiForm, PermohonanForm, InformasiSpasialForm, KeuanganForm, dll)

### 3. Bersihkan Kontainer

- **Hapus** border kotak putih di dalam panel — jangan pakai Card wrapper yang menambah box
- Form menyatu dengan background putih panel utama
- **Section heading:** bersih dengan `border-top` tipis antar kategori data (bukan box terpisah)
- Contoh: `border-t border-slate-200 pt-6 mt-6` antar section

### 4. Reposisi Dokumen Tersedia

- **Opsi A:** Pindahkan ke bagian paling bawah form sebagai section tambahan yang lebih kecil
- **Opsi B:** Ubah menjadi tombol dropdown "Cetak Dokumen" agar tidak memakan ruang visual utama
- Pilih yang lebih cocok untuk UX
- Tetap akses ke: Tanda Terima, SLA, Invoice, Kwitansi, Surat Tugas, Surat Pemberitahuan

### 5. Visual Hierarchy

- **Padding antar section:** `space-y-8` (lebih bernapas)
- **Font:** Inter atau Geist untuk konsistensi (sesuaikan dengan layout global)
- **Tombol Simpan:** Terlihat dominan di bagian bawah, **sticky bottom**
  - Masing-masing form punya tombol Simpan sendiri — pastikan tombol terlihat jelas, tidak tenggelam
  - Bisa pertimbangkan sticky bar di bawah saat scroll form panjang

## Dependencies

- WorkflowForms, form components (existing)
- Card component — mungkin tidak dipakai lagi untuk form sections, atau hanya untuk wrapper khusus (PdfUpload, GeoJSONUpload)
- Dashboard page — koordinasi untuk Dokumen Tersedia

## Open Questions

- Linear (scroll semua) vs horizontal tabs — pilih yang lebih mengurangi crowded feeling.
- Sticky Simpan — tiap form punya Simpan sendiri; bisa satu sticky bar global saat ada form terlihat, atau per-section. Putuskan yang paling praktis.

## Done When

- Sidebar vertikal hilang, diganti linear atau horizontal tabs simpel
- Grid 2-kolom untuk field kecil, label `text-xs font-semibold text-slate-500`
- Border kotak putih (Card) di dalam form dihapus; section heading bersih dengan border-top
- Dokumen Tersedia dipindah/dropdown, tidak memakan ruang utama
- `space-y-8` antar section, tombol Simpan dominan (sticky bottom)
- User bisa melihat lebih banyak field tanpa rasa terhimpit
- Build PASS
