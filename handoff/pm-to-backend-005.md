# Handoff: PM → Backend Engineer

## From
Project Manager

## To
Backend Engineer

## Context

User mengirim **format template aktual** dari PDF yang dipakai: form **Permohonan Pengukuran Kadastral** (Lampiran 13). Ini format standar KJSB Benning dan Rekan. Pattern di `parseTextToExtractedData` perlu disesuaikan agar field terisi otomatis.

## Objective

Sesuaikan regex di `lib/pdf-extract.ts` → `parseTextToExtractedData` dengan format form Permohonan Pengukuran Kadastral (Lampiran 13).

## Format Aktual (dari sample form)

### Section Pemohon ("Yang bertanda tangan di bawah ini:")
| Field DB | Label di Form | Contoh nilai |
|----------|---------------|--------------|
| nama | `Nama` | Yushi Nurfitriani |
| nik | `NIK` | 3205179205950002 |
| alamat | `Alamat` | Blok wuni 1, RT/RW 001/009. Ds. Dawuan, kec. Tenyah tani, kab. cirebon |

### Section Bidang Tanah ("Atas bidang tanah:")
| Field DB | Label di Form | Contoh nilai |
|----------|---------------|--------------|
| lokasi_tanah | `Terletak di` | Nilai setelah label (bisa "Desa/Kelurahan: Karangdawa" atau kombinasi desa, kec, kab) |
| kelurahan_desa | `Terletak di Desa/Kelurahan` | Karangdawa |
| kecamatan | `Kecamatan` | Kedawung |
| kota_kabupaten | `Kabupaten/Kota` | Cirebon |
| luas_permohonan | `Luas` | + 72 m² |

### Perbedaan dengan pattern saat ini
1. **lokasi_tanah** — Label `Terletak di` (bukan Lokasi atau Nomor Hak). Tambah pattern.
2. **Kabupaten/Kota** — Form pakai `Kabupaten/Kota:` (bukan Kota/Kab). Tambah pattern.
3. **Desa/Kelurahan** — Form pakai `Terletak di Desa/Kelurahan:` — tambah pattern.
4. **Luas** — Format `+ 72 m²` (ada tanda +). Pastikan regex tangkap angka meski ada `+` di depan.

## Constraints

- Tetap backward compatible dengan format lama (Nama Pemohon, Kota/Kab, dll.)
- Jangan mengubah extractTextFromPdf

## Deliverables

1. **Update pattern** di `parseTextToExtractedData`:
   - `lokasi_tanah`: tambah `Terletak di` — nilai setelah label
   - `kota_kabupaten`: tambah `Kabupaten/Kota`
   - `kelurahan_desa`: tambah `Terletak di Desa/Kelurahan` dan `Desa/Kelurahan`
   - `luas_permohonan`: handle `+ 72 m²` (angka setelah `+` opsional)
2. **Update** `docs/TEMPLATE-PDF-EXTRACTION.md` — tambah section "Format Permohonan Pengukuran Kadastral (Lampiran 13)"

## Dependencies

- lib/pdf-extract.ts
- docs/TEMPLATE-PDF-EXTRACTION.md

## Open Questions

- Tidak ada.

## Done When

- Upload PDF form Permohonan Pengukuran Kadastral → field nama, nik, alamat, lokasi_tanah, luas, kecamatan, kelurahan_desa, kota_kabupaten terisi otomatis
- Format terdokumentasi di TEMPLATE-PDF-EXTRACTION.md
