# Handoff: Backend Engineer → Project Manager

## From
Backend Engineer

## To
Project Manager

## Context

Handoff pm-to-backend-002 dan architect-to-backend-002 (Ekstraksi PDF untuk pre-fill Tambah Permohonan) telah selesai diimplementasikan.

## Objective

Lapor penyelesaian fitur ekstraksi PDF. Frontend dapat melanjutkan integrasi "Upload PDF & Isi Otomatis" di TambahPermohonanForm.

## Result

### 1. lib/discord.ts — getOrCreateThreadByKode(kodeKjsb)
- List active threads → cari by name
- Jika tidak ada: list archived/public → cari by name
- Jika masih tidak ada: POST create thread
- Return thread.id atau null jika Discord tidak terkonfigurasi

### 2. lib/pdf-extract.ts
- `extractTextFromPdf(buffer)`: pdf-parse dulu; jika text < 50 chars → fallback pdf-to-img + tesseract.js (ind)
- `parseTextToExtractedData(rawText)`: pattern matching ke ExtractedData (nama, nik, alamat, luas_permohonan, lokasi_tanah, kota_kabupaten, kecamatan, kelurahan_desa)

### 3. POST /api/upload-pdf-extract
- Request: FormData `file`, `kodeKjsb`
- Urutan: validasi → getOrCreateThreadByKode → sendFileToThread → extractTextFromPdf → parseTextToExtractedData → return
- Response 200: `{ extractedData, discordThreadId }`
- Response error: 400 (validasi), 404 (Discord tidak terkonfigurasi), 500

### 4. Dependencies
- pdf-parse, tesseract.js, pdf-to-img (pure JS, no system deps)

## Constraints

- Tidak mengubah getOrCreateThreadForPermohonan atau flow upload-pdf existing
- Parsing pattern matching — template PDF standar; bisa iterasi jika format berubah

## Deliverables

- [x] getOrCreateThreadByKode di lib/discord.ts
- [x] lib/pdf-extract.ts (extract + parse)
- [x] app/api/upload-pdf-extract/route.ts
- [x] npm: pdf-parse, tesseract.js, pdf-to-img

## Dependencies

- Frontend: API siap; integrasi di TambahPermohonanForm (Kode KJSB → Upload PDF & Isi Otomatis → pre-fill → save dengan discord_thread_id)

## Open Questions

- Tidak ada.

## Done When

- [x] getOrCreateThreadByKode berfungsi (active + archived + create)
- [x] Endpoint return extractedData + discordThreadId
- [x] pdf-parse + tesseract fallback berjalan
- [x] Parsing menghasilkan field sesuai ExtractedData
