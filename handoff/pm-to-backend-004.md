# Handoff: PM → Backend Engineer

## From
Project Manager

## To
Backend Engineer

## Context

User melaporkan: upload PDF **berhasil tersimpan di Discord**, tapi:
1. **Error:** Ada tulisan "Object.defineProperty called on non-object"
2. **Field kosong:** Form tidak otomatis terisi (extractedData tidak mengisi field)
3. **Kemungkinan penyebab:** Miss persepsi format template PDF — parsing pattern mungkin tidak cocok dengan format aktual PDF user

## Objective

1. **Perbaiki error** "Object.defineProperty called on non-object" — kemungkinan dari pdf-parse, pdf-to-img, atau tesseract.js saat memproses PDF tertentu
2. **Perbaiki ekstraksi/pre-fill** — pastikan extractedData sampai ke frontend dan field terisi
3. **Align template format** — pattern matching di `parseTextToExtractedData` harus cocok dengan format PDF yang dipakai user. Saat ini pattern mengharapkan label: Nama, NIK, Alamat, Luas, Lokasi, Kota/Kab, Kecamatan, Kelurahan/Desa

## Constraints

- Tetap solusi gratis (pdf-parse, tesseract)
- Jangan mengubah flow upload ke Discord (sudah berfungsi)

## Deliverables

1. **Error handling** — Tangkap error "Object.defineProperty..." dan error lain dari ekstraksi; return JSON error yang informatif, jangan leak ke user
2. **Investigasi** — Cek apakah error dari pdf-parse `getText()`, pdf-to-img, atau tesseract; tambah logging untuk debug
3. **Template format** — Dokumentasikan format yang diharapkan (label, pemisah, contoh). Jika user punya sample PDF atau format berbeda, sesuaikan pattern di `parseTextToExtractedData` (lib/pdf-extract.ts)
4. **Fallback** — Jika ekstraksi gagal total, tetap return `{ extractedData: {}, discordThreadId }` agar Discord upload tidak "gagal" di mata user; field bisa diisi manual

## Dependencies

- lib/pdf-extract.ts — extractTextFromPdf, parseTextToExtractedData
- app/api/upload-pdf-extract/route.ts
- Pattern saat ini: `/(?:nama|Nama)\s*[:\s]+\s*(.+?)(?=\n|$)/i` dll.

## Open Questions

- **Format template aktual:** Apa format label di PDF user? (contoh: "Nama Pemohon:", "Nama:", "NAMA :") — Backend bisa minta sample teks ekstrak atau sample PDF ke PM/User untuk align pattern
- Error "Object.defineProperty" — di mana muncul? (browser console, server log, UI?) — tambah try-catch dan logging untuk trace

## Done When

- Error "Object.defineProperty" tidak lagi muncul (tertangkap dan di-handle)
- Jika PDF punya format standar: field terisi otomatis
- Jika ekstraksi gagal: return extractedData kosong, discordThreadId tetap; user bisa input manual
- Format template didokumentasikan atau disesuaikan dengan PDF user
