# Handoff: PM → QA Engineer

## From
Project Manager

## To
QA Engineer

## Context

Fitur **upload PDF hasil scan** ke Discord channel #berkas-plm. Pola mengikuti upload DXF. PRD: `project/basis-data-plm/docs/PRD-upload-pdf-001.md`. Backend dan Frontend akan implementasi paralel (handoff pm-to-backend-001, pm-to-frontend-001).

## Objective

Tulis acceptance criteria dan test plan untuk fitur upload PDF. QA bisa mulai dari PRD; tidak perlu menunggu implementasi selesai.

## Constraints

- Tetap dalam scope PRD
- Siap di-update bila implementasi menambah detail teknis

## Deliverables

- Acceptance criteria per fitur: upload PDF, validasi file, thread Discord, feedback UI
- Test plan: happy path, edge cases (file bukan PDF, > 25MB, permohonanId invalid, thread belum ada)
- Regression: pastikan upload DXF tidak terpengaruh

## Dependencies

- PRD: `project/basis-data-plm/docs/PRD-upload-pdf-001.md`
- API contract di PRD section 6
- Pola existing: `app/api/upload-dxf/route.ts`, `GeoJSONUpload.tsx`

## Open Questions

- Tidak ada.

## Done When

- Acceptance criteria dan test plan siap dipakai untuk validasi setelah Backend dan Frontend selesai implementasi
