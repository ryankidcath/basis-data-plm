# Test Execution Report: Dashboard Status Berkas

**Produk:** Basis Data PLM  
**Sumber handoff:** PM → QA (pm-to-qa-003.md)  
**Checklist referensi:** QA-dashboard-status-validation-001.md §4

---

## Pengantar

Dokumen ini berisi langkah detail untuk setiap test dan kolom **hasil** untuk dicatat oleh executor (user/PM).  
Setelah semua test dijalankan, isi kolom **PASS/FAIL** dan **Notes**; verdict final dapat ditentukan.

**Prasyarat:**
- App berjalan (`npm run dev` di `project/basis-data-plm`)
- Supabase lokal atau remote tersambung
- Ada akun untuk login (email + password)
- (Opsional) Data permohonan untuk test dengan data; bisa kosong untuk EC-1

---

## 1. Happy Path

### HP-1: Agregat tampil benar

| Aspek | Detail |
|-------|--------|
| **Langkah** | 1) Buka app (biasanya http://localhost:3000) 2) Login dengan email/password 3) Navigate ke `/dashboard/status` (atau klik link "Dashboard Status" di header) |
| **Expected** | Chart/tabel menampilkan 14 status (Pendaftaran … Selesai) dengan count masing-masing; urutan sesuai |
| **Hasil** | ☐ PASS ☐ FAIL |
| **Notes** | |

### HP-2: Ringkasan benar

| Aspek | Detail |
|-------|--------|
| **Langkah** | Di halaman /dashboard/status, perhatikan tiga kartu: Total, Selesai, Dalam proses. Hitung manual: Total = sum(count semua status), Selesai = count "Selesai", Dalam proses = Total − Selesai |
| **Expected** | Angka di kartu sesuai perhitungan |
| **Hasil** | ☐ PASS ☐ FAIL |
| **Notes** | |

### HP-3: Filter by status

| Aspek | Detail |
|-------|--------|
| **Langkah** | Pilih satu status (klik bar atau dropdown "Pilih status") — mis. "Pembayaran" atau status lain yang punya data |
| **Expected** | List menampilkan hanya permohonan dengan status tersebut |
| **Hasil** | ☐ PASS ☐ FAIL |
| **Notes** | |

### HP-4: Akses dari header

| Aspek | Detail |
|-------|--------|
| **Langkah** | Dari dashboard utama (/dashboard), klik link "Dashboard Status" di header |
| **Expected** | Masuk ke /dashboard/status tanpa error |
| **Hasil** | ☐ PASS ☐ FAIL |
| **Notes** | |

### HP-5: List berisi data lengkap

| Aspek | Detail |
|-------|--------|
| **Langkah** | Filter status yang punya data; perhatikan kolom tabel |
| **Expected** | Kolom: Kode KJSB, Tanggal, Status, Lokasi, Pemohon tampil |
| **Hasil** | ☐ PASS ☐ FAIL |
| **Notes** | |

---

## 2. Edge Cases

### EC-1: Data kosong (0 permohonan)

| Aspek | Detail |
|-------|--------|
| **Langkah** | (Bila DB kosong atau gunakan env dengan 0 permohonan) Buka /dashboard/status |
| **Expected** | Semua 14 status tampil dengan count 0; Total=0; pilih status → list kosong dengan pesan "Tidak ada permohonan dengan status ini." |
| **Hasil** | ☐ PASS ☐ FAIL ☐ N/A (tidak ada env kosong) |
| **Notes** | |

### EC-2: Satu status punya data, sisanya 0

| Aspek | Detail |
|-------|--------|
| **Langkah** | Pilih status yang punya count > 0; lalu pilih status dengan count 0 |
| **Expected** | Agregat benar; filter status ber-data tampilkan row; filter status 0 tampilkan list kosong + pesan |
| **Hasil** | ☐ PASS ☐ FAIL |
| **Notes** | |

### EC-3: Semua permohonan di satu status

| Aspek | Detail |
|-------|--------|
| **Langkah** | (Bila data memungkinkan) Perhatikan bila hampir semua di "Selesai" |
| **Expected** | Total = Selesai; Dalam proses = 0 (atau mendekati); filter "Selesai" menampilkan semua |
| **Hasil** | ☐ PASS ☐ FAIL ☐ N/A |
| **Notes** | |

### EC-4: Status NULL

| Aspek | Detail |
|-------|--------|
| **Langkah** | (Bila ada permohonan dengan status_permohonan = NULL) Buka dashboard |
| **Expected** | Tidak error; Total tidak termasuk permohonan NULL |
| **Hasil** | ☐ PASS ☐ FAIL ☐ N/A |
| **Notes** | |

---

## 3. Negative

### NC-1: Unauthenticated access

| Aspek | Detail |
|-------|--------|
| **Langkah** | Logout; atau buka tab incognito, akses langsung http://localhost:3000/dashboard/status |
| **Expected** | Redirect ke /login; tidak tampil data agregat |
| **Hasil** | ☐ PASS ☐ FAIL |
| **Notes** | |

### NC-4: Empty result list

| Aspek | Detail |
|-------|--------|
| **Langkah** | Pilih status dengan count 0 |
| **Expected** | UI tampilkan "Tidak ada permohonan dengan status ini." (bukan blank/error) |
| **Hasil** | ☐ PASS ☐ FAIL |
| **Notes** | |

---

## 4. Regression

### R-1: Link Ekspor data

| Aspek | Detail |
|-------|--------|
| **Langkah** | Di dashboard utama, klik "Ekspor data" |
| **Expected** | Link berfungsi (bisa download atau buka tab baru) |
| **Hasil** | ☐ PASS ☐ FAIL |
| **Notes** | |

### R-2: Peta + panel input/lihat

| Aspek | Detail |
|-------|--------|
| **Langkah** | Di dashboard utama, pilih permohonan, lihat peta dan panel Lihat/Input |
| **Expected** | Flow utama jalan; input/lihat permohonan tetap berfungsi |
| **Hasil** | ☐ PASS ☐ FAIL |
| **Notes** | |

### R-3: Halaman lain list permohonan

| Aspek | Detail |
|-------|--------|
| **Langkah** | (Bila ada) Buka halaman lain yang menampilkan list permohonan |
| **Expected** | Tetap berjalan normal |
| **Hasil** | ☐ PASS ☐ FAIL ☐ N/A |
| **Notes** | |

### R-4: Auth / session

| Aspek | Detail |
|-------|--------|
| **Langkah** | Login, logout, login lagi; navigasi antar halaman |
| **Expected** | Session normal; tidak unexpected redirect |
| **Hasil** | ☐ PASS ☐ FAIL |
| **Notes** | |

---

## 5. Ringkasan Hasil

| Kategori | Total | PASS | FAIL | N/A |
|----------|-------|------|------|-----|
| Happy Path (HP-1..HP-5) | 5 | | | |
| Edge (EC-1..EC-4) | 4 | | | |
| Negative (NC-1, NC-4) | 2 | | | |
| Regression (R-1..R-4) | 4 | | | |

**Bug Critical/High:** (catat bila ada)

---

## 6. Verdict

- [ ] **RELEASE READY** — Semua test PASS (atau N/A wajar); tidak ada bug Critical/High
- [ ] **BLOCKER** — Ada FAIL atau bug Critical/High; perlu fix sebelum release

**Executor:** ________________  **Tanggal:** ________________
