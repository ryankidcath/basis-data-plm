# Handoff: Backend Engineer → Project Manager

## From
Backend Engineer

## To
Project Manager

## Context

Handoff pm-to-backend-006 (Field kosong setelah upload PDF scanned Lampiran 13) telah ditangani.

## Objective

Lapor penyelesaian. Debug logging tersedia; pattern diperluas untuk output OCR.

## Result

### 1. Debug logging
- **Env:** `DEBUG_PDF_EXTRACT=1` — set di `.env.local` saat development
- **Query param:** `?debug=1` — frontend bisa panggil `POST /api/upload-pdf-extract?debug=1` (perlu update URL di TambahPermohonanForm jika ingin pakai)
- Log: rawText length, preview 500 char, extractedData — ke server console

### 2. Normalisasi OCR
- `normalizeForOcr()` — line break → spasi, spasi ganda → single space
- Teks OCR (line break tidak konsisten, spasi ekstra) dinormalisasi sebelum pattern matching

### 3. Relaksasi pattern
- `:?` — colon opsional
- `\s*\/?\s*` — slash opsional (Desa Kelurahan vs Desa/Kelurahan)
- Lookahead ke label berikutnya untuk batas capture (bukan hanya newline)
- Tetap backward compatible

### 4. Dokumentasi
- **docs/TEMPLATE-PDF-EXTRACTION.md** — section "Debug Mode", "OCR & Normalisasi"

## Constraints

- Tetap solusi gratis
- Flow upload Discord tidak diubah

## Deliverables

- [x] Debug logging (DEBUG_PDF_EXTRACT=1, ?debug=1)
- [x] Normalisasi teks untuk OCR
- [x] Pattern relaksasi (whitespace, optional :, optional /)
- [x] Dokumentasi update

## Open Questions

- **Sample rawText:** Jika field masih kosong, user/PM bisa set DEBUG_PDF_EXTRACT=1, upload PDF, cek log server. Kirim sample rawText ke Backend untuk penyesuaian pattern lebih lanjut.

## Done When

- [x] Debug log tersedia
- [x] Pattern OCR-friendly
- [ ] QA validasi: upload PDF scanned Lampiran 13 → field terisi; atau log debug tersedia untuk investigasi
