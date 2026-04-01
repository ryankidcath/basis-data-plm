# Handoff: Backend Engineer → Project Manager

## From
Backend Engineer

## To
Project Manager

## Context

Handoff pm-to-backend-005 (Sesuaikan pattern dengan form Permohonan Pengukuran Kadastral Lampiran 13) telah selesai.

## Objective

Lapor penyelesaian. Pattern di `parseTextToExtractedData` sekarang mendukung format form Lampiran 13.

## Result

### 1. Update pattern di lib/pdf-extract.ts

| Field | Perubahan |
|-------|-----------|
| lokasi_tanah | Tambah `Terletak di` (nilai setelah label) |
| kota_kabupaten | Tambah `Kabupaten/Kota` (prioritas sebelum Kota/Kab) |
| kelurahan_desa | Tambah `Terletak di Desa/Kelurahan`, `Desa/Kelurahan` |
| luas_permohonan | Handle `+ 72 m²` (opsional `+` sebelum angka) |

### 2. Backward compatibility

- Format lama tetap didukung: Nama Pemohon, Kota/Kab, Lokasi, Kelurahan/Desa, dll.

### 3. Dokumentasi

- **docs/TEMPLATE-PDF-EXTRACTION.md** — tambah section "Format Permohonan Pengukuran Kadastral (Lampiran 13)" dengan tabel label dan contoh nilai

## Constraints

- extractTextFromPdf tidak diubah
- Backward compatible dengan format lama

## Deliverables

- [x] lokasi_tanah: pattern `Terletak di`
- [x] kota_kabupaten: pattern `Kabupaten/Kota`
- [x] kelurahan_desa: pattern `Terletak di Desa/Kelurahan`, `Desa/Kelurahan`
- [x] luas_permohonan: handle `+ 72 m²`
- [x] Update TEMPLATE-PDF-EXTRACTION.md

## Done When

- [x] Pattern disesuaikan
- [x] Format terdokumentasi
- [ ] QA validasi: upload PDF form Lampiran 13 → field terisi otomatis
