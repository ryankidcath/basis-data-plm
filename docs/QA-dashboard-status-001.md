# QA: Dashboard Status Berkas

**Produk:** Basis Data PLM  
**Sumber handoff:** PM → QA (pm-to-qa-001.md)  
**PRD:** PRD-dashboard-status-001.md  
**Arsitektur:** ARCH-dashboard-status-001.md

---

## 1. Acceptance Criteria

### AC-1: Tampilan Agregat Jumlah Permohonan per Status

| ID | Acceptance Criteria | Testable? |
|----|---------------------|-----------|
| AC-1.1 | Dashboard menampilkan count permohonan untuk masing-masing dari 14 status (`STATUS_PERMOHONAN_ORDER`) | ✅ |
| AC-1.2 | Urutan tampilan mengikuti `STATUS_PERMOHONAN_ORDER` (Pendaftaran → … → Selesai) | ✅ |
| AC-1.3 | Status dengan count = 0 tetap ditampilkan (bukan disembunyikan) | ✅ |
| AC-1.4 | Data agregat bersumber dari RPC `get_status_aggregation` | ✅ |
| AC-1.5 | Total dari semua count per status = jumlah row permohonan (kecuali `status_permohonan = NULL`) | ✅ |

**14 status (urutan):** Pendaftaran, Pembayaran, Entri Informasi Spasial, Verifikasi Informasi Berkas, Pembayaran Informasi Spasial, Pembuatan Surat Tugas, Pengukuran, Verifikasi Berkas, Pembayaran Legalisasi GU, Pemetaan, TTE GU & PBT, Upload GU & PBT, Menunggu Penyelesaian, Selesai.

---

### AC-2: Filter / Pencarian Permohonan

| ID | Acceptance Criteria | Testable? |
|----|---------------------|-----------|
| AC-2.1 | User dapat memilih satu status (mis. klik bar/segment) untuk memfilter list permohonan | ✅ |
| AC-2.2 | List menampilkan hanya permohonan dengan `status_permohonan` = status terpilih | ✅ |
| AC-2.3 | List memuat minimal: id, kode_kjsb, tanggal_permohonan, status_permohonan, lokasi_tanah, created_at, pemohon(nama) | ✅ |
| AC-2.4 | Pencarian teks (opsional): filter by kode_kjsb (ilike) — bila diimplementasikan | ✅ |
| AC-2.5 | Urutan list: `created_at` descending | ✅ |
| AC-2.6 | Bila status terpilih punya 0 permohonan, list kosong dengan pesan jelas (tidak error) | ✅ |

---

### AC-3: Ringkasan Cepat

| ID | Acceptance Criteria | Testable? |
|----|---------------------|-----------|
| AC-3.1 | **Total:** sum dari semua count status, ditampilkan dengan benar | ✅ |
| AC-3.2 | **Selesai:** count untuk status "Selesai" | ✅ |
| AC-3.3 | **Dalam proses:** Total − Selesai | ✅ |
| AC-3.4 | **Perlu perhatian:** Diluar scope MVP (ARCH) — tidak wajib diimplementasikan | N/A |

---

### AC-4: Integrasi Akses

| ID | Acceptance Criteria | Testable? |
|----|---------------------|-----------|
| AC-4.1 | Dashboard status dapat diakses dari aplikasi via route `/dashboard/status` | ✅ |
| AC-4.2 | Link ke dashboard status tersedia di header (sejajar "Ekspor data") — ARCH | ✅ |
| AC-4.3 | Akses membutuhkan auth Supabase; user tidak ter-authenticated di-redirect ke login | ✅ |
| AC-4.4 | Flow utama (peta + panel input/lihat) tidak berubah; navigasi ke status tidak memecah flow | ✅ |
| AC-4.5 | RLS berlaku; user hanya melihat permohonan yang diizinkan hak aksesnya | ✅ |

---

## 2. Test Plan

### 2.1 Happy Path

| # | Skenario | Langkah | Expected |
|---|----------|---------|----------|
| HP-1 | Agregat tampil benar | 1) Login 2) Navigate ke /dashboard/status | Chart/tabel menampilkan 14 status dengan count masing-masing, urutan benar |
| HP-2 | Ringkasan benar | Lihat Total, Selesai, Dalam proses | Total = sum(count), Selesai = count "Selesai", Dalam proses = Total − Selesai |
| HP-3 | Filter by status | Pilih satu status (mis. "Pembayaran") | List hanya menampilkan permohonan dengan status tersebut |
| HP-4 | Akses dari header | Dari dashboard utama, klik link "Dashboard Status" | Masuk ke /dashboard/status tanpa error |
| HP-5 | List berisi data lengkap | Filter status yang punya data | Kolom id, kode_kjsb, tanggal_permohonan, status_permohonan, lokasi_tanah, pemohon.nama tampil |

### 2.2 Edge Cases

| # | Skenario | Langkah | Expected |
|---|----------|---------|----------|
| EC-1 | Data kosong (0 permohonan) | Database: semua count = 0 | Semua 14 status tampil dengan count 0; Total = 0; list filter kosong dengan pesan informatif |
| EC-2 | Satu status punya data, sisanya 0 | Database: hanya "Pendaftaran" punya 5 permohonan | Agregat benar; filter "Pendaftaran" tampilkan 5 row; filter status lain tampilkan list kosong |
| EC-3 | Semua permohonan di satu status | Mis. semua di "Selesai" | Total = Selesai; Dalam proses = 0; filter "Selesai" menampilkan semua |
| EC-4 | Status NULL di permohonan | Ada permohonan dengan `status_permohonan = NULL` | ARCH: NULL tidak dimasukkan RPC; Total tidak termasuk NULL; tidak error |
| EC-5 | Banyak permohonan (stress) | 500+ permohonan tersebar | Agregasi tetap cepat (<3s); list filter boleh paginasi bila ada |
| EC-6 | Pencarian kode_kjsb (bila ada) | Filter status + ketik kode partial | List terfilter by status DAN kode_kjsb ilike; hasil benar |
| EC-7 | User tanpa akses RLS | User dengan role terbatas | Hanya melihat permohonan yang diizinkan; agregat hanya count data visible |

### 2.3 Negative / Error Cases

| # | Skenario | Langkah | Expected |
|---|----------|---------|----------|
| NC-1 | Unauthenticated access | Buka /dashboard/status tanpa login | Redirect ke login; tidak tampil data agregat |
| NC-2 | RPC gagal / timeout | Simulate: Supabase down atau RPC error | Error handling graceful; pesan user-friendly; tidak crash |
| NC-3 | Invalid status value (API abuse) | Kirim status tidak ada di ORDER (bila ada API) | Tidak berlaku untuk filter client-side; Backend filter harus validate bila terpapar |
| NC-4 | Empty result list | Filter status dengan 0 permohonan | UI menampilkan "Tidak ada permohonan" atau setara, bukan blank/error |

---

## 3. Regression Checklist

Area yang mungkin terkena saat implementasi dashboard status:

| # | Area | Yang dicek |
|---|------|------------|
| R-1 | Dashboard utama | Link "Ekspor data" tetap berfungsi; layout tidak berubah |
| R-2 | Peta + panel input/lihat | Flow utama tidak terpengaruh; input/lihat permohonan tetap jalan |
| R-3 | Tabel permohonan lain | Bila ada halaman lain yang list permohonan, tetap berjalan |
| R-4 | Auth / RLS | Login, logout, session tidak bermasalah |
| R-5 | `status_permohonan` compute | `computeStatusFromDetail` dan update status tidak berubah — out of scope tapi pastikan tidak ada side effect |

---

## 4. Definition of Done (QA Validation)

Dashboard Status Berkas **Done** bila:

1. Semua acceptance criteria AC-1 s/d AC-4 (kecuali AC-3.4) **PASS**.
2. Minimal **happy path HP-1 s/d HP-5** dan **edge case EC-1 s/d EC-4** lolos test manual atau otomatis.
3. **Regression R-1 s/d R-4** tidak ada regresi baru.
4. Tidak ada bug **Critical** atau **High** yang open.
5. Auth/RLS enforced — tidak ada kebocoran data (AC-4.3, AC-4.5).

---

## 5. Jawaban Open Question PM

> Apakah ada skenario khusus (concurrent users, data kosong, banyak permohonan) yang perlu prioritas?

**Jawaban:**

| Skenario | Prioritas | Catatan |
|----------|-----------|---------|
| **Data kosong** | **P1** | Wajib: UI harus handle 0 permohonan tanpa error; semua status tampil count 0. Sering terjadi saat onboarding atau environment baru. |
| **Banyak permohonan (500+)** | **P2** | Agregasi di DB (RPC) sudah dirancang untuk efisien. Prioritas: pastikan RPC <3s; list filter boleh paginasi. |
| **Concurrent users** | **P3** | Dashboard baca-only; tidak ada write race. RLS dan auth sudah handle multi-user. Tidak perlu test concurrency khusus untuk MVP. |
| **Status NULL** | **P2** | ARCH menyebut permohonan lama mungkin NULL. RPC tidak include NULL. Prioritas: pastikan tidak error; bila perlu "Tanpa status" bisa post-MVP. |

**Rekomendasi:** Fokus P1 (data kosong) dan P2 (banyak data, NULL) di test plan. Concurrent users bisa di-skip untuk MVP.

---

## 6. Risiko & Catatan QA

| ID | Risiko | Severity | Mitigasi |
|----|--------|----------|----------|
| QA-R1 | Status NULL tidak di-handle | Medium | RPC saat ini exclude NULL; validasi EC-4 |
| QA-R2 | RPC return format berubah | Medium | Pastikan contract { status_permohonan, count } mengikuti ARCH |
| QA-R3 | "Perlu perhatian" didefer — bila CEO nanti minta | Low | Out of scope MVP; akan ada AC tambahan |
