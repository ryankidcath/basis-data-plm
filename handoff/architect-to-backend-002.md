# Handoff: System Architect → Backend Engineer

## From
System Architect

## To
Backend Engineer

## Context

Fitur **ekstraksi data dari PDF** untuk pre-fill Tambah Permohonan Baru. PM handoff: pm-to-backend-002. Arsitektur final: `project/basis-data-plm/docs/ARCH-pdf-extraction-001.md`.

## Objective

Implementasi sesuai ARCH:
1. **getOrCreateThreadByKode(kodeKjsb)** di lib/discord.ts
2. **POST /api/upload-pdf-extract** — upload PDF ke Discord, ekstrak teks, parse, return extractedData + discordThreadId
3. Strategi PDF: pdf-parse dulu → fallback tesseract.js jika teks < 50 chars

## Constraints

- Gratis (pdf-parse, tesseract.js)
- Tidak mengubah getOrCreateThreadForPermohonan atau flow upload PDF existing
- Template PDF standar → pattern matching

## Deliverables

1. **lib/discord.ts** — tambah `getOrCreateThreadByKode(kodeKjsb: string): Promise<string | null>`
   - Alur: GET threads/active → cari by name → bila tidak ada, GET threads/archived/public → cari → bila tidak ada, POST threads
   - Endpoint: `GET /channels/{channelId}/threads/active`, `GET .../threads/archived/public`, `POST .../threads`

2. **app/api/upload-pdf-extract/route.ts**
   - Request: FormData `file`, `kodeKjsb`
   - Urutan: validasi → getOrCreateThreadByKode → sendFileToThread → ekstrak teks → parse → return

3. **lib/pdf-extract.ts** (atau modul terpisah)
   - pdf-parse dulu; jika text.length < 50, fallback: PDF→gambar (pdf2pic) + tesseract.recognize
   - parseTextToExtractedData(rawText): ExtractedData

4. **Dependencies:** pdf-parse, tesseract.js, pdf2pic (atau pdf-to-img)

## API Contract (Final)

**Request:** POST, multipart/form-data
- `file` (required): PDF
- `kodeKjsb` (required): string

**Response 200:**
```json
{
  "extractedData": {
    "nama": "...",
    "nik": "...",
    "alamat": "...",
    "luas_permohonan": 123,
    "lokasi_tanah": "...",
    "kota_kabupaten": "...",
    "kecamatan": "...",
    "kelurahan_desa": "..."
  },
  "discordThreadId": "123456789..."
}
```

**Response error:** `{ "error": "..." }` — 400/404/500

## Dependencies

- ARCH: `project/basis-data-plm/docs/ARCH-pdf-extraction-001.md`
- PRD: `project/basis-data-plm/docs/PRD-pdf-extraction-001.md`
- lib/discord.ts — sendFileToThread (ada), getOrCreateThreadForPermohonan (jangan ubah)

## Done When

- getOrCreateThreadByKode berfungsi (list active + archived, create jika tidak ada)
- Endpoint return extractedData + discordThreadId
- pdf-parse + tesseract fallback berjalan
- Parsing menghasilkan field sesuai ExtractedData interface
