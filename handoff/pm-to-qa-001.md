# Handoff: PM → QA Engineer

## From
Project Manager

## To
QA Engineer

## Context

Fitur: **Dashboard Status Berkas** untuk Basis Data PLM. User perlu melihat agregat status permohonan, filter/pencarian berdasarkan status, dan akses dari UI yang ada. PRD: `project/basis-data-plm/docs/PRD-dashboard-status-001.md`. Arsitektur akan diputuskan oleh System Architect (handoff pm-to-architect-001.md).

## Objective

Tulis acceptance criteria dan test plan untuk fitur dashboard status berkas. QA bisa mulai dari PRD; tidak perlu menunggu implementasi.

## Constraints

- Tetap dalam scope PRD
- Siap di-update bila Architect/implementasi menambah detail teknis

## Deliverables

- Acceptance criteria per fitur: tampilan agregat, filter/pencarian, ringkasan, integrasi akses
- Test plan: happy path, edge cases, regression yang mungkin terkena
- Definition of done untuk QA validation

## Dependencies

- PRD: `project/basis-data-plm/docs/PRD-dashboard-status-001.md`
- 14 status dari `STATUS_PERMOHONAN_ORDER` (lib/status-permohonan.ts)

## Open Questions

- Apakah ada skenario khusus (concurrent users, data kosong, banyak permohonan) yang perlu prioritas?

## Done When

- Acceptance criteria dan test plan siap dipakai untuk validasi setelah Backend dan Frontend selesai implementasi
