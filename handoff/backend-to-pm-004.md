# Handoff: Backend Engineer → Project Manager

## From
Backend Engineer

## To
Project Manager

## Context

Handoff pm-to-backend-004 (Error "Object.defineProperty", field kosong, align template) telah selesai.

## Objective

Lapor penyelesaian. API selalu return `{ extractedData, discordThreadId }`; jika ekstraksi gagal, extractedData kosong dan Discord upload tetap berhasil.

## Result

### 1. Error handling
- **pdf-extract.ts:** Try-catch di tiap langkah (pdf-parse, pdf-to-img, tesseract); log warning, return "" on failure
- **Route:** Jika ekstraksi throw (termasuk "Object.defineProperty"), return `{ extractedData: {}, discordThreadId }` — Discord upload sudah berhasil
- Error tidak lagi leak ke user sebagai HTML/stack trace

### 2. Logging
- `[pdf-extract] pdf-parse failed: ...` — saat pdf-parse error
- `[pdf-extract] tesseract page failed: ...` — per halaman OCR
- `[pdf-extract] pdf-to-img/tesseract fallback failed: ...` — saat fallback gagal
- `[upload-pdf-extract] Ekstraksi gagal (Discord OK): ...` — saat extraction throw di route

### 3. Template format
- **docs/TEMPLATE-PDF-EXTRACTION.md** — dokumentasi format label yang didukung
- Pattern diperluas: "Nama Pemohon", NIK dengan spasi, Luas dengan koma/titik
- Jika format PDF user berbeda, sesuaikan regex di `parseTextToExtractedData`

### 4. Fallback
- Ekstraksi gagal → `{ extractedData: {}, discordThreadId }` — user isi manual
- Parsing error di parseTextToExtractedData → return `{}` (try-catch)

## Constraints

- Tetap solusi gratis (pdf-parse, tesseract)
- Flow upload ke Discord tidak diubah

## Deliverables

- [x] Error handling untuk "Object.defineProperty" dan error lain
- [x] Logging untuk debug (pdf-parse, tesseract, route)
- [x] Dokumentasi template format (TEMPLATE-PDF-EXTRACTION.md)
- [x] Fallback: extractedData kosong jika ekstraksi gagal

## Open Questions

- **Format template aktual:** Jika user punya sample PDF/teks ekstrak dengan label berbeda (mis. "Nama Lengkap:", "NAMA PEMOHON :"), kirim ke Backend untuk penyesuaian pattern.

## Done When

- [x] Error "Object.defineProperty" tertangkap dan di-handle
- [x] Jika ekstraksi gagal: return extractedData kosong, discordThreadId tetap
- [x] Format template didokumentasikan
- [ ] QA validasi: field terisi jika PDF punya format standar; tidak error jika format berbeda
