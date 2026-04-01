# Handoff: PM → System Architect

## From
Project Manager

## To
System Architect

## Context

Fitur **ekstraksi data dari PDF** untuk pre-fill formulir Tambah Permohonan Baru. User ketik Kode KJSB → upload PDF → PDF ke Discord (thread by kode, sebelum permohonan ada) → ekstrak teks → pre-fill form → save dengan `discord_thread_id`. PRD: `project/basis-data-plm/docs/PRD-pdf-extraction-001.md`.

**Constraint kritis:** Solusi harus **gratis** — tidak boleh pakai API berbayar (Google Document AI, AWS Textract, dll). Gunakan pdf-parse, tesseract.js.

## Objective

Putuskan arsitektur teknis untuk:
1. **Discord:** `getOrCreateThreadByKode(kodeKjsb)` — list threads di channel #berkas-plm, cari yang namanya = kode; bila tidak ada, buat baru. Permohonan belum ada di DB.
2. **PDF ekstraksi:** Strategi pdf-parse (digital) vs tesseract.js (OCR scan) — kapan pakai yang mana, fallback
3. **API contract:** Endpoint upload+ekstraksi — request/response format agar Backend dan Frontend sinkron

## Constraints

- Gratis (pdf-parse, tesseract.js)
- Next.js + Supabase
- Template PDF standar → pattern matching
- User harus bisa edit hasil ekstraksi sebelum save

## Deliverables

- Keputusan: Discord API untuk list threads di forum channel, cari by name
- Keputusan: Strategi PDF extraction (digital vs scan, fallback)
- API contract: `POST /api/upload-pdf-extract` (atau nama lain) — request (FormData: file, kodeKjsb), response (`{ extractedData, discordThreadId }`)
- Struktur `extractedData` sesuai PRD section 6

## Dependencies

- PRD: `project/basis-data-plm/docs/PRD-pdf-extraction-001.md`
- `lib/discord.ts` — struktur existing, channel #berkas-plm (GUILD_FORUM)
- Tabel pemohon, permohonan

## Open Questions

- Discord: endpoint untuk list active threads di forum channel?
- PDF: apakah perlu deteksi digital vs scan, atau coba pdf-parse dulu lalu fallback tesseract?

## Done When

- Arsitektur dan API contract jelas sehingga PM bisa membuat handoff ke Backend dan Frontend untuk implementasi
