# Handoff: QA Engineer → Project Manager

## From
QA Engineer

## To
Project Manager

## Context

Handoff PM-to-QA-001 diproses. Fitur: **Dashboard Status Berkas** untuk Basis Data PLM. QA telah menulis acceptance criteria, test plan, edge cases, regression checklist, dan definition of done berdasarkan PRD dan arsitektur.

## Objective

Menyampaikan deliverable QA siap dipakai untuk validasi setelah Backend dan Frontend selesai implementasi.

## Constraints

- Tetap dalam scope PRD dan ARCH
- AC dapat di-update bila implementasi menambah detail teknis

## Deliverables

| Item | Lokasi | Deskripsi |
|------|--------|-----------|
| Acceptance criteria | QA-dashboard-status-001.md §1 | AC-1 (agregat), AC-2 (filter), AC-3 (ringkasan), AC-4 (integrasi) |
| Test plan | QA-dashboard-status-001.md §2 | Happy path (HP-1..HP-5), edge cases (EC-1..EC-7), negative (NC-1..NC-4) |
| Regression checklist | QA-dashboard-status-001.md §3 | R-1..R-5 — area yang mungkin terkena |
| Definition of done | QA-dashboard-status-001.md §4 | Kriteria QA validation untuk release |
| Jawaban open question | QA-dashboard-status-001.md §5 | Prioritas: data kosong P1, banyak data/NULL P2, concurrent P3 (skip MVP) |
| Risiko QA | QA-dashboard-status-001.md §6 | QA-R1..QA-R3 |

**File lengkap:** `project/basis-data-plm/docs/QA-dashboard-status-001.md`

## Dependencies

- PRD: PRD-dashboard-status-001.md
- Arsitektur: ARCH-dashboard-status-001.md
- Backend: migration RPC `get_status_aggregation`
- Frontend: halaman `/dashboard/status`, link di header

## Open Questions

- Tidak ada. Open question PM (skenario prioritas) sudah dijawab di §5 QA doc.

## Done When

- Backend dan Frontend selesai implementasi
- QA validasi menggunakan QA-dashboard-status-001.md
- Semua AC pass, minimal HP + EC-1..EC-4, regression R-1..R-4 clean
- Tidak ada bug Critical/High open
