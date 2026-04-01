# Handoff: QA Engineer → Project Manager

## From
QA Engineer

## To
Project Manager

## Context

Handoff pm-to-qa-003 diproses. PM meminta eksekusi manual test untuk verdict final Dashboard Status Berkas.

## Constraint (Penting)

**QA Engineer (AI) tidak dapat mengoperasikan browser secara fisik.** Manual test membutuhkan manusia (user/PM) atau alat E2E otomatis (Playwright/Cypress) untuk menjalankan aplikasi dan berinteraksi dengan UI.

## Deliverables

### 1. Test Execution Report
**File:** `project/basis-data-plm/docs/QA-dashboard-status-test-execution-001.md`

Berisi:
- Langkah detail per test (HP-1..HP-5, EC-1..EC-4, NC-1, NC-4, R-1..R-4)
- Tabel hasil dengan kolom PASS/FAIL/SKIP dan Catatan
- Kriteria verdict (RELEASE READY vs blocker)
- Bagian untuk pelapor dan tanggal

### 2. Cara Menggunakan
1. **User/PM** menjalankan app: `cd project/basis-data-plm && npm run dev`
2. **User/PM** login dengan kredensial valid
3. Ikuti langkah per test di dokumen
4. Isi kolom **Hasil** (PASS/FAIL) dan **Catatan** per test
5. Bila ada FAIL → catat bug (Critical/High) dan assign ke BE/FE
6. Bila semua PASS → PM can declare **RELEASE READY**

## Verdict Saat Ini

**PENDING EXECUTION** — Menunggu user/PM mengisi hasil test di Test Execution Report.

- Code review: PASS (dari pm-to-qa-002)
- Manual test: Belum dijalankan (perlu manusia)
- Verdict final: Akan ditentukan setelah hasil execution dilaporkan

## Next Action for PM

1. Jalankan manual test sesuai `QA-dashboard-status-test-execution-001.md`
2. Isi kolom Hasil dan Catatan per test
3. Bila semua PASS → declare fitur **RELEASE READY**
4. Bila ada FAIL → buat handoff ke Backend/Frontend dengan bug details; re-validate setelah fix
5. (Opsional) Share hasil terisi ke QA chat untuk verdict formal

## Done When

- Semua test di checklist dieksekusi dan hasil tercatat
- Verdict RELEASE READY atau blocker dilaporkan
- Bila blocker: bug assigned, re-validation direncanakan
