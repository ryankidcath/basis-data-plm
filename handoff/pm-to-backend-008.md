# Handoff: PM → Backend Engineer

## From
Project Manager

## To
Backend Engineer

## Context

User meminta **hapus fitur pembaca PDF otomatis** (ekstraksi data). Fitur upload PDF ke Discord tetap ada. User akan input manual saat menambah permohonan baru. Tidak ada lagi ekstraksi, parsing, atau pre-fill dari PDF.

## Objective

Sederhanakan endpoint `POST /api/upload-pdf-extract` — **hapus seluruh logika ekstraksi**. Endpoint hanya: terima PDF + kodeKjsb → upload ke Discord (getOrCreateThreadByKode, sendFileToThread) → return `{ discordThreadId }`.

## Constraints

- Fitur upload ke Discord tetap berfungsi
- Tetap Next.js + Supabase
- Tidak mengubah getOrCreateThreadByKode atau sendFileToThread

## Deliverables

1. **Hapus ekstraksi** — Hapus import dan pemanggilan `extractTextFromPdf`, `parseTextToExtractedData` dari route
2. **Response** — Hanya return `{ discordThreadId }` (bukan extractedData)
3. **Hapus debug** — Hapus debug mode, _debug, DEBUG_PDF_EXTRACT, query param ?debug=1
4. **Opsional: rename** — Bisa rename route ke `upload-pdf-by-kode` atau tetap `upload-pdf-extract` (Frontend akan update URL jika berubah)
5. **Hapus dependency** — Bisa hapus atau biarkan `lib/pdf-extract.ts` (tidak dipanggil lagi dari route ini). Atau hapus file jika tidak dipakai di tempat lain.

## Dependencies

- app/api/upload-pdf-extract/route.ts
- lib/discord.ts (getOrCreateThreadByKode, sendFileToThread)
- lib/pdf-extract.ts (akan tidak dipakai)

## Open Questions

- Tidak ada.

## Done When

- API hanya upload PDF ke Discord, return { discordThreadId }
- Tidak ada ekstraksi, tidak ada _debug
- Frontend bisa panggil dengan file + kodeKjsb, dapat discordThreadId untuk disimpan saat insert permohonan
