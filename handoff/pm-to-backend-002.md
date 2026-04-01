# Handoff: PM → Backend Engineer

## From
Project Manager

## To
Backend Engineer

## Context

Fitur **ekstraksi data dari PDF** untuk pre-fill Tambah Permohonan Baru. Alur: user ketik Kode KJSB → upload PDF → PDF ke Discord (thread by kode) → ekstrak teks → return extractedData + discordThreadId. PRD: `project/basis-data-plm/docs/PRD-pdf-extraction-001.md`. **Tunggu handoff Architect (pm-to-architect-002)** untuk API contract dan keputusan teknis final.

## Objective

Implementasi:
1. **`getOrCreateThreadByKode(kodeKjsb)`** di `lib/discord.ts` — list threads di channel, cari by name = kode; bila tidak ada, buat baru. Tanpa permohonanId.
2. **API endpoint** upload + ekstraksi — terima PDF + kodeKjsb → upload ke Discord (via getOrCreateThreadByKode) → ekstrak teks (pdf-parse / tesseract) → parse ke struktur → return `{ extractedData, discordThreadId }`
3. **Logic parsing** — pattern matching dari teks mentah ke `{ nama, nik, alamat, luas_permohonan, lokasi_tanah, kota_kabupaten, kecamatan, kelurahan_desa }`

## Constraints

- **Gratis** — pdf-parse, tesseract.js saja
- Tidak mengubah `getOrCreateThreadForPermohonan` atau flow upload PDF existing
- Template PDF standar → parsing presisi dengan pattern matching

## Deliverables

1. **lib/discord.ts** — tambah `getOrCreateThreadByKode(kodeKjsb: string): Promise<string | null>`
2. **Route** `app/api/upload-pdf-extract/route.ts` (atau sesuai keputusan Architect)
3. **Parsing logic** — modul terpisah atau inline, ekstrak field sesuai PRD
4. **Dependencies npm:** pdf-parse, tesseract.js, pdf2pic atau pdf-to-img (untuk OCR fallback)

## Dependencies

- Architect handoff (pm-to-architect-002) — untuk API contract final
- PRD: `project/basis-data-plm/docs/PRD-pdf-extraction-001.md`
- `lib/discord.ts` — sendFileToThread (sudah ada)

## API Contract (sementara, bisa diubah Architect)

**Request:** `POST`, `multipart/form-data`: `file` (PDF), `kodeKjsb` (string)

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

**Response error:** `{ "error": "..." }`

## Open Questions

- Lihat Architect handoff untuk strategi PDF (digital vs scan, fallback)

## Done When

- getOrCreateThreadByKode berfungsi
- Endpoint upload+ekstraksi return extractedData + discordThreadId
- Parsing menghasilkan field sesuai template PDF standar
