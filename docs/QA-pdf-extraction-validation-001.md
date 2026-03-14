# QA Validation Report: Upload PDF & Isi Otomatis (Bug Fix)

**Produk:** Basis Data PLM  
**Sumber handoff:** PM → QA (pm-to-qa-006.md)  
**Bug:** "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"  
**Backend:** pm-to-backend-003 | **Frontend:** pm-to-frontend-004

---

## 1. Ringkasan

| Aspek | Status |
|-------|--------|
| Code review (fix verification) | **PASS** — Frontend safe JSON parsing; Backend JSON di semua error path |
| Manual test | **Diperlukan** — HP-1..HP-4, Error handling, Regression, File size |
| Critical/High bugs | **0** — Tidak ditemukan dari code review |
| Verdict | **CONDITIONAL PASS** — Code fix verified; manual test oleh User/PM untuk verdict final |

---

## 2. Bug Fix Verification (Code Review)

### 2.1 Frontend — Safe JSON Parsing (pm-to-frontend-004)

| Deliverable | Verdict | Evidence |
|-------------|---------|----------|
| Safe JSON parsing | ✅ PASS | `TambahPermohonanForm.tsx` lines 154–162: `const text = await res.text()`; `try { data = JSON.parse(text); } catch { ... }` — tidak langsung `res.json()` |
| Fallback error message | ✅ PASS | `catch` block: `setPdfError("Server mengembalikan respons tidak valid. Periksa log server atau coba lagi.")` — user-friendly |
| Handle `res.ok` false | ✅ PASS | `if (!res.ok) { setPdfError(data.error ?? "Gagal mengekstrak PDF."); ... }` — tampilkan `data.error` bila parse berhasil |

**Kesimpulan:** Error "Unexpected token '<'..." tidak akan muncul lagi. Respons HTML akan ditangkap di `JSON.parse` catch → pesan user-friendly ditampilkan.

---

### 2.2 Backend — JSON di Semua Error Path (pm-to-backend-003)

| Deliverable | Verdict | Evidence |
|-------------|---------|----------|
| Route segment config | ✅ PASS | `route.ts` lines 4–5: `export const runtime = "nodejs"`; `export const maxDuration = 60` |
| Body size limit | ✅ PASS | `next.config.js`: `serverActions.bodySizeLimit: "25mb"` |
| Error handling JSON | ✅ PASS | Semua path return `NextResponse.json({ error: "..." })`: 400 (kodeKjsb kosong, file kosong, bukan PDF, >25MB), 404 (Discord tidak terkonfigurasi), 500 (catch block) |
| No uncaught throw | ✅ PASS | `try/catch` di POST; `catch` return `NextResponse.json({ error: message }, { status: 500 })` |

**Kesimpulan:** API tidak akan mengembalikan HTML error page. Semua error path mengembalikan JSON.

---

## 3. Deliverables Handoff — Checklist

| # | Deliverable | Status |
|---|-------------|--------|
| 1 | Happy path — tidak ada error "Unexpected token" | ✅ Code verified; manual test diperlukan |
| 2 | Error handling — frontend tampilkan pesan user-friendly bila server return HTML | ✅ Implemented |
| 3 | Regression — flow Tambah Permohonan tanpa PDF tetap berfungsi | ✅ Code unchanged; manual test diperlukan |
| 4 | File size — PDF kecil (<1MB) dan sedang (1–5MB) upload berhasil | ⏳ Manual test diperlukan |

---

## 4. Manual Test Execution

QA (AI) tidak dapat menjalankan test di browser. User/PM wajib menjalankan test di **QA-pdf-extraction-test-execution-001.md** dan mengisi kolom hasil.

**Verdict final:** Bila semua test PASS → **RELEASE READY** untuk fitur Upload PDF & Isi Otomatis.
