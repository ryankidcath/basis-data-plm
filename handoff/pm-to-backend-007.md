# Handoff: PM → Backend Engineer

## From
Project Manager

## To
Backend Engineer

## Context

Backend (pm-to-backend-006) dan Frontend (pm-to-frontend-005) sudah selesai. User sudah uji lagi — **field masih kosong**. Debug log ke server console ada, tapi user perlu cara **melihat rawText tanpa akses server** agar bisa share sample ke Backend untuk penyesuaian pattern.

## Objective

Saat `debug=1` (query param) atau `DEBUG_PDF_EXTRACT=1`, **sertakan rawText dalam response API** agar user bisa lihat di browser (Network tab atau UI) dan copy/share ke Backend.

## Constraints

- Hanya saat debug mode
- Jangan expose di production (debug=1 dari client bisa diabaikan di production jika env tidak set)

## Deliverables

1. **Response saat debug** — Bila debugMode true, tambah field `_debug` di response:
   ```json
   {
     "extractedData": {...},
     "discordThreadId": "...",
     "_debug": {
       "rawTextLength": 1234,
       "rawTextPreview": "first 1000 chars...",
       "extractedData": {...}
     }
   }
   ```
2. **rawTextPreview** — 1000–1500 karakter pertama rawText (cukup untuk lihat format)
3. **Tetap log ke console** — untuk yang punya akses server

## Dependencies

- app/api/upload-pdf-extract/route.ts

## Open Questions

- Tidak ada.

## Done When

- User panggil API dengan `?debug=1` (Frontend perlu update URL) → response berisi `_debug.rawTextPreview`
- User bisa copy rawTextPreview dari Network tab atau UI dan kirim ke Backend untuk analisis pattern
