# Handoff: PM → Frontend Engineer

## From
Project Manager

## To
Frontend Engineer

## Context

Fitur **upload PDF hasil scan** ke Discord channel #berkas-plm. Pola mengikuti upload DXF di `GeoJSONUpload`. PRD: `project/basis-data-plm/docs/PRD-upload-pdf-001.md`. API: `POST /api/upload-pdf` (handoff pm-to-backend-001.md).

## Objective

Tambahkan UI upload PDF di tab "NIB, GU, dan PBT" (WorkflowForms), section baru "Berkas PDF (Scan)" di bawah GeoJSONUpload.

## Constraints

- Ikuti pola UI GeoJSONUpload (Card, file input, feedback success/error)
- Lokasi: tab 5 "NIB, GU, dan PBT", di dalam Card terpisah di bawah "Bidang Tanah (NIB) & GeoJSON"
- Tidak mengubah GeoJSONUpload atau flow DXF

## Deliverables

1. **Komponen baru** `PdfUpload.tsx` (atau nama serupa) dengan:
   - Props: `permohonanId`, `onSaved` (callback setelah sukses, opsional untuk refresh)
   - Input file: `accept=".pdf,application/pdf"`
   - Kirim ke `POST /api/upload-pdf` dengan FormData: `file`, `permohonanId`
   - Tampilkan loading, success, error
2. **Integrasi** di `WorkflowForms.tsx`: tambah Card "Berkas PDF (Scan)" berisi PdfUpload, di bawah Card GeoJSONUpload

## Dependencies

- API `/api/upload-pdf` (Backend handoff pm-to-backend-001)
- `WorkflowForms.tsx` — tab 5 structure
- Pola `GeoJSONUpload.tsx` untuk referensi UI

## API Contract (dari Backend)

**Request:** `POST /api/upload-pdf`, FormData: `file`, `permohonanId`

**Response sukses (200):** `{ "ok": true, "message": "..." }`

**Response error:** `{ "error": "Pesan error" }`

## Open Questions

- Tidak ada.

## Done When

- User dapat memilih file PDF dan meng-upload dari tab NIB, GU, dan PBT
- Feedback jelas (loading, sukses, error)
- File terkirim ke Discord (validasi di Backend)
