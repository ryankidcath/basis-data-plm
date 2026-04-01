# Handoff: Backend Engineer → Project Manager

## From
Backend Engineer

## To
Project Manager

## Context

Handoff pm-to-backend-001 (Upload PDF ke Discord) telah selesai diimplementasikan.

## Objective

Lapor penyelesaian endpoint `POST /api/upload-pdf`. Frontend dapat melanjutkan integrasi UI (pm-to-frontend-001).

## Result

- **Route:** `project/basis-data-plm/app/api/upload-pdf/route.ts`
- **Validasi:** Hanya `application/pdf` atau `.pdf`; max 25MB; `permohonanId` wajib
- **Logika:** `getOrCreateThreadForPermohonan` → `sendFileToThread` (pola sama dengan DXF)
- **Response:** 200 `{ ok: true, message: "PDF berhasil dikirim ke Discord." }`; 4xx/5xx `{ error: "..." }`

## Constraints

- Tidak ada perubahan pada route upload-dxf atau lib/discord.ts

## Deliverables

- [x] Route `app/api/upload-pdf/route.ts`
- [x] Validasi file type, size, permohonanId
- [x] Error handling untuk invalid input dan permohonan tidak ditemukan

## Dependencies

- Frontend (pm-to-frontend-001): API siap digunakan

## Open Questions

- Tidak ada.

## Done When

- [x] Endpoint berfungsi
- [x] File PDF valid terkirim ke Discord thread
- [x] Error handling untuk file invalid, >25MB, permohonanId invalid
