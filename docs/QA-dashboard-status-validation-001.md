# QA Validation Report: Dashboard Status Berkas

**Produk:** Basis Data PLM  
**Sumber handoff:** PM → QA (pm-to-qa-002.md)  
**Tanggal:** 2025-03-13

---

## 1. Ringkasan

| Aspek | Status |
|-------|--------|
| Code review | **PASS** — Implementasi sesuai AC dan ARCH |
| Manual test | **Diperlukan** — HP-1..HP-5, EC-1..EC-4, R-1..R-4 |
| Critical/High bugs | **0** — Tidak ditemukan dari code review |
| Verdict | **PENDING MANUAL TEST** — Siap divalidasi manual; code siap release bila manual test lolos |

---

## 2. Acceptance Criteria Verification (Code Review)

### AC-1: Tampilan Agregat

| ID | Verdict | Evidence |
|----|---------|----------|
| AC-1.1 | ✅ PASS | `fillAggregation()` ensures all 14 status from `STATUS_PERMOHONAN_ORDER` rendered; RPC returns per-status count |
| AC-1.2 | ✅ PASS | `fillAggregation` uses `STATUS_PERMOHONAN_ORDER.map()` — urutan tetap |
| AC-1.3 | ✅ PASS | `count: byStatus.get(s) ?? 0` — status count 0 tetap tampil |
| AC-1.4 | ✅ PASS | `fetchStatusAggregation()` → `supabase.rpc("get_status_aggregation")` |
| AC-1.5 | ✅ PASS | RPC LEFT JOIN + COUNT; frontend `total = aggregation.reduce((s,r)=>s+r.count,0)`; konsisten |

### AC-2: Filter / Pencarian

| ID | Verdict | Evidence |
|----|---------|----------|
| AC-2.1 | ✅ PASS | User bisa pilih via: 1) klik bar, 2) dropdown "Pilih status" |
| AC-2.2 | ✅ PASS | `fetchPermohonanListByStatus(status, kodeSearch)` uses `.eq("status_permohonan", status)` |
| AC-2.3 | ✅ PASS | Select: `id, kode_kjsb, tanggal_permohonan, status_permohonan, lokasi_tanah, created_at, pemohon(nama)`; tabel tampilkan semua |
| AC-2.4 | ✅ PASS | `query.ilike("kode_kjsb", `%${kodeSearch}%`)` — pencarian kode KJSB ada |
| AC-2.5 | ✅ PASS | `.order("created_at", { ascending: false })` |
| AC-2.6 | ✅ PASS | "Tidak ada permohonan dengan status ini." + hint bila ada filter kode |

### AC-3: Ringkasan Cepat

| ID | Verdict | Evidence |
|----|---------|----------|
| AC-3.1 | ✅ PASS | `total = aggregation.reduce((s,r)=>s+r.count,0)` |
| AC-3.2 | ✅ PASS | `selesaiCount = aggregation.find(r=>r.status_permohonan==="Selesai")?.count ?? 0` |
| AC-3.3 | ✅ PASS | `dalamProses = total - selesaiCount` |
| AC-3.4 | N/A | Diluar scope MVP |

### AC-4: Integrasi Akses

| ID | Verdict | Evidence |
|----|---------|----------|
| AC-4.1 | ✅ PASS | `app/dashboard/status/page.tsx` → route `/dashboard/status` |
| AC-4.2 | ✅ PASS | Dashboard page (line 100-104): Link "Dashboard Status" sejajar "Ekspor data" |
| AC-4.3 | ✅ PASS | `middleware.ts` line 34-38: path `/dashboard` requires `user`; redirect ke `/login` bila tidak ada |
| AC-4.4 | ✅ PASS | Halaman status terpisah; dashboard utama tidak berubah |
| AC-4.5 | ✅ PASS | RLS `permohonan`: authenticated read; list filter pakai Supabase client (RLS applies). RPC SECURITY DEFINER — schema saat ini: authenticated dapat read all permohonan; konsisten dengan flow |

---

## 3. RPC & Backend Verification

| Aspek | Verdict | Evidence |
|-------|---------|----------|
| Migration ada | ✅ | `supabase/migrations/20250313000001_add_get_status_aggregation.sql` |
| 14 status urutan benar | ✅ | Array match `STATUS_PERMOHONAN_ORDER` |
| NULL excluded | ✅ | LEFT JOIN on status; permohonan NULL tidak match — correct |
| Return format | ✅ | `(status_permohonan TEXT, count BIGINT)` |
| Error handling FE | ✅ | `aggregationError` state, pesan "Gagal memuat agregasi status..." |
| List error handling | ✅ | `listError` state, pesan "Gagal memuat daftar permohonan." |

---

## 4. Manual Test Execution Checklist

**Test Execution Report (langkah detail + kolom hasil):** `QA-dashboard-status-test-execution-001.md`

**Untuk final release verdict, jalankan test berikut secara manual:**

### Happy Path (HP-1..HP-5)

- [ ] **HP-1** Login → Navigate ke /dashboard/status → 14 status tampil, urutan benar
- [ ] **HP-2** Total, Selesai, Dalam proses tampil dan hitungan benar
- [ ] **HP-3** Pilih status (bar atau dropdown) → list hanya permohonan status itu
- [ ] **HP-4** Dari dashboard utama, klik "Dashboard Status" → masuk tanpa error
- [ ] **HP-5** Filter status yang punya data → kolom kode_kjsb, tanggal, status, lokasi, pemohon tampil

### Edge Cases (EC-1..EC-4 minimal)

- [ ] **EC-1** Data kosong (atau status tertentu 0): semua 14 tampil count 0; list kosong dengan pesan
- [ ] **EC-2** Satu status punya data: agregat benar; filter lain = list kosong
- [ ] **EC-3** Semua di Selesai: Total=Selesai, Dalam proses=0
- [ ] **EC-4** (Bila ada data NULL): tidak error; total tidak termasuk NULL

### Negative

- [ ] **NC-1** Logout / buka /dashboard/status di tab incognito → redirect ke login
- [ ] **NC-4** Filter status dengan 0 permohonan → "Tidak ada permohonan dengan status ini."

### Regression (R-1..R-4)

- [ ] **R-1** Link "Ekspor data" di dashboard utama masih berfungsi
- [ ] **R-2** Peta + panel input/lihat permohonan tetap jalan
- [ ] **R-3** (Bila ada) Halaman lain yang list permohonan tetap jalan
- [ ] **R-4** Login, logout, session normal

---

## 5. Catatan & Risiko

| ID | Catatan | Severity |
|----|---------|----------|
| QA-R1 | Status NULL: RPC exclude NULL. Bila ada permohonan lama NULL, tidak error — acceptable per ARCH. | Low |
| QA-R2 | RPC SECURITY DEFINER: schema current = authenticated baca all. Bila kelak ada RLS per-user, RPC perlu diubah ke INVOKER atau filter manual. | Low (future) |

---

## 6. Definition of Done Checklist

| # | Kriteria | Status |
|---|----------|--------|
| 1 | AC-1 s/d AC-4 (kec. AC-3.4) PASS | ✅ Code review |
| 2 | HP-1..HP-5, EC-1..EC-4 minimal lolos | ⏳ Manual test |
| 3 | Regression R-1..R-4 tidak ada regresi | ⏳ Manual test |
| 4 | Tidak ada bug Critical/High open | ✅ 0 from code review |
| 5 | Auth/RLS enforced | ✅ Middleware + RLS verified |

---

## 7. Rekomendasi

1. **Jalankan manual test** HP-1..HP-5, EC-1..EC-4, NC-1, NC-4, R-1..R-4.
2. Bila semua checklist di atas **lolos** → **RELEASE READY**.
3. Bila ditemukan bug Critical/High → eskalasi ke PM, assign ke Backend/Frontend sesuai area.
