# Handoff: PM → QA Engineer

## From
Project Manager

## To
QA Engineer

## Context

Fitur **ekstraksi data dari PDF** untuk pre-fill formulir Tambah Permohonan Baru. Alur: Kode KJSB → upload PDF → PDF ke Discord → ekstrak → pre-fill → user edit → save. PRD: `project/basis-data-plm/docs/PRD-pdf-extraction-001.md`. Architect akan putuskan API contract (pm-to-architect-002); Backend dan Frontend implementasi paralel setelah itu.

## Objective

Tulis acceptance criteria dan test plan untuk fitur ekstraksi PDF. QA bisa mulai dari PRD; tidak perlu menunggu implementasi selesai.

## Constraints

- Tetap dalam scope PRD
- Siap di-update bila Architect/implementasi menambah detail teknis

## Deliverables

- Acceptance criteria: flow Kode KJSB → upload → pre-fill, edit sebelum save, discord_thread_id tersimpan
- Test plan: happy path (PDF valid, template standar), edge cases (PDF kosong, format salah, ekstraksi gagal, Kode KJSB invalid)
- Regression: pastikan flow Tambah Permohonan tanpa PDF tidak terpengaruh

## Dependencies

- PRD: `project/basis-data-plm/docs/PRD-pdf-extraction-001.md`
- Struktur extractedData di PRD section 6

## Open Questions

- Apakah perlu sample PDF template untuk testing?

## Done When

- Acceptance criteria dan test plan siap dipakai untuk validasi setelah Backend dan Frontend selesai implementasi
