# Handoff: PM → Backend Engineer

## From
Project Manager

## To
Backend Engineer

## Context

User melaporkan **field masih kosong setelah upload** PDF form Lampiran 13. Di UI: Lokasi Tanah, Kecamatan, Kelurahan/Desa kosong (Kota/Kabupaten terisi — itu default form). Pattern sudah disesuaikan (pm-to-backend-005) tapi field tidak terisi.

## Objective

Investigasi dan perbaiki mengapa extractedData tidak mengisi field. Kemungkinan penyebab:
1. **OCR output** — PDF scanned/handwritten; tesseract output format berbeda dari yang diharapkan pattern
2. **Pattern tidak match** — Layout teks di OCR (line break, spasi) berbeda
3. **rawText kosong** — Ekstraksi gagal (pdf-parse + tesseract fallback) mengembalikan ""

## Constraints

- Tetap solusi gratis
- Jangan mengubah flow upload ke Discord

## Deliverables

1. **Debug logging** — Log `rawText` (atau substring 500 char) dan `extractedData` di route saat development/debug. Bisa via query param `?debug=1` atau env `DEBUG_PDF_EXTRACT=1` agar tidak log di production.
2. **Verifikasi pattern** — Pastikan pattern "Terletak di", "Kecamatan", "Desa/Kelurahan", "Kabupaten/Kota" cocok dengan format output OCR. OCR sering output: spasi ekstra, line break tidak konsisten, karakter mirip (0/O, 1/l).
3. **Relaksasi pattern** — Pertimbangkan: whitespace fleksibel (`\s*`), optional ":" setelah label, case insensitive sudah ada.
4. **Alternatif** — Jika "Terletak di" dan "Desa/Kelurahan" ada di baris terpisah, pattern `(.+?)(?=\n|$)` mungkin hanya ambil satu baris. Cek apakah perlu multiline atau match lebih panjang.

## Dependencies

- lib/pdf-extract.ts
- app/api/upload-pdf-extract/route.ts

## Open Questions

- Apakah user bisa kirim sample `rawText` dari PDF yang di-upload? (bisa dari log debug) — akan sangat membantu align pattern dengan OCR output aktual.

## Done When

- Upload PDF form Lampiran 13 (scanned) → extractedData berisi lokasi_tanah, kecamatan, kelurahan_desa, luas, dll.
- Atau: debug log tersedia untuk PM/User cek rawText dan laporkan format aktual
