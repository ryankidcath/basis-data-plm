# QA: Ekstraksi Data dari PDF untuk Pre-fill Formulir

**Produk:** Basis Data PLM  
**Sumber handoff:** PM → QA (pm-to-qa-005.md)  
**PRD:** PRD-pdf-extraction-001.md  
**Arsitektur:** ARCH-pdf-extraction-001.md

---

## 1. Acceptance Criteria

### AC-1: Flow Kode KJSB → Upload → Pre-fill

| ID | Acceptance Criteria | Testable? |
|----|---------------------|-----------|
| AC-1.1 | User dapat memasukkan Kode KJSB (format BKS-YYYY-XXXX) di form Tambah Permohonan Baru | ✅ |
| AC-1.2 | Tombol/aksi "Upload PDF & Isi Otomatis" tampil dan hanya aktif bila Kode KJSB sudah diisi | ✅ |
| AC-1.3 | User dapat memilih file PDF → aplikasi upload ke Discord (thread nama = kode KJSB) | ✅ |
| AC-1.4 | Thread Discord dibuat otomatis jika belum ada (via `getOrCreateThreadByKode`) | ✅ |
| AC-1.5 | Aplikasi mengekstrak teks dari PDF (pdf-parse → fallback tesseract) dan parse ke ExtractedData | ✅ |
| AC-1.6 | Field form terisi otomatis: nama, nik, alamat, luas_permohonan, lokasi_tanah, kota_kabupaten, kecamatan, kelurahan_desa | ✅ |
| AC-1.7 | API `POST /api/upload-pdf-extract` return `{ extractedData, discordThreadId }` | ✅ |

---

### AC-2: Edit Sebelum Save

| ID | Acceptance Criteria | Testable? |
|----|---------------------|-----------|
| AC-2.1 | User dapat mengedit semua field hasil ekstraksi sebelum menyimpan | ✅ |
| AC-2.2 | Pre-fill tidak mengunci field; user bisa hapus, ubah, atau tambah nilai | ✅ |
| AC-2.3 | Field yang tidak berhasil diekstrak tetap kosong; user wajib isi manual bila diperlukan | ✅ |
| AC-2.4 | Tidak ada auto-save tanpa konfirmasi user | ✅ |

---

### AC-3: discord_thread_id Tersimpan

| ID | Acceptance Criteria | Testable? |
|----|---------------------|-----------|
| AC-3.1 | Saat user klik "Buat Permohonan", permohonan baru tersimpan dengan `discord_thread_id` dari response upload | ✅ |
| AC-3.2 | `discord_thread_id` mengacu ke thread Discord yang benar (nama = kode KJSB) | ✅ |
| AC-3.3 | PDF terkirim ke thread tersebut sebelum/saat ekstraksi | ✅ |

---

### AC-4: Validasi & Error Handling

| ID | Acceptance Criteria | Testable? |
|----|---------------------|-----------|
| AC-4.1 | Reject file bukan PDF (400) | ✅ |
| AC-4.2 | Reject file kosong (0 byte) (400) | ✅ |
| AC-4.3 | Reject kodeKjsb kosong atau format invalid (400) | ✅ |
| AC-4.4 | Response 404 bila Discord tidak terkonfigurasi | ✅ |
| AC-4.5 | Response 500 dengan pesan jelas bila ekstraksi gagal | ✅ |
| AC-4.6 | UI menampilkan pesan error yang jelas; tidak crash | ✅ |

---

### AC-5: Flow Tanpa PDF (Regression)

| ID | Acceptance Criteria | Testable? |
|----|---------------------|-----------|
| AC-5.1 | User dapat menambah permohonan baru tanpa upload PDF (manual input penuh) | ✅ |
| AC-5.2 | Flow manual tidak memerlukan Kode KJSB atau discord_thread_id | ✅ |
| AC-5.3 | Form Tambah Permohonan tetap berfungsi seperti sebelum fitur PDF extraction | ✅ |

---

## 2. Test Plan

### 2.1 Happy Path

| # | Skenario | Langkah | Expected |
|---|----------|---------|----------|
| HP-1 | PDF valid, template standar | 1) Buka Tambah Permohonan 2) Ketik Kode KJSB (BKS-2025-0001) 3) Klik "Upload PDF & Isi Otomatis" 4) Pilih PDF dengan template standar 5) Tunggu ekstraksi | extractedData terisi; field form pre-filled; discordThreadId return; PDF di Discord |
| HP-2 | Pre-fill → edit → save | 1) Setelah HP-1 2) Edit beberapa field (nama, alamat) 3) Pilih pemohon, klien, tanggal, penggunaan 4) Klik "Buat Permohonan" | Permohonan tersimpan; discord_thread_id terisi; data sesuai edit user |
| HP-3 | Thread baru dibuat | 1) Kode KJSB belum punya thread di Discord 2) Upload PDF | Thread baru dibuat (nama = kode KJSB); PDF terkirim; discordThreadId return |
| HP-4 | Thread sudah ada | 1) Kode KJSB sudah punya thread 2) Upload PDF | PDF terkirim ke thread existing; discordThreadId = thread yang ada |

---

### 2.2 Edge Cases

| # | Skenario | Langkah | Expected |
|---|----------|---------|----------|
| EC-1 | PDF kosong (0 halaman / corrupt) | Upload PDF kosong atau corrupt | Error handling; response 500 atau 400; pesan jelas; UI tidak crash |
| EC-2 | PDF format salah (bukan PDF sebenarnya) | Upload file .txt rename ke .pdf | Reject 400; validasi MIME/header |
| EC-3 | Ekstraksi gagal (teks tidak terbaca) | PDF scan buruk, OCR gagal | Return extractedData sebagian kosong atau response 500; UI tampilkan pesan; user bisa input manual |
| EC-4 | Kode KJSB invalid format | Ketik "abc", "123", "BKS-2025" (tanpa nomor) | Validasi format BKS-YYYY-XXXX; reject atau disable upload |
| EC-5 | Kode KJSB kosong | Klik upload tanpa isi Kode KJSB | Tombol disabled atau reject dengan pesan jelas |
| EC-6 | PDF digital (embedded text) | PDF dari Word/export, bukan scan | pdf-parse berhasil; ekstraksi cepat; extractedData terisi |
| EC-7 | PDF scan (gambar) | PDF hasil scan, tidak ada embedded text | Fallback tesseract; ekstraksi lebih lama; extractedData terisi (kualitas tergantung OCR) |
| EC-8 | Parsing sebagian gagal | Template tidak standar untuk beberapa field | Field yang ter-parse terisi; yang gagal kosong; user edit manual |
| EC-9 | File > 25MB | Upload PDF > 25MB | Reject 400 (limit Discord) |
| EC-10 | Discord tidak terkonfigurasi | DISCORD_BOT_TOKEN atau DISCORD_CHANNEL_ID kosong | Response 404; UI tampilkan error jelas |

---

### 2.3 Negative / Error Cases

| # | Skenario | Langkah | Expected |
|---|----------|---------|----------|
| NC-1 | Request tanpa file | POST dengan kodeKjsb saja | Reject 400 |
| NC-2 | Request tanpa kodeKjsb | POST dengan file saja | Reject 400 |
| NC-3 | User tidak ter-authenticated | Akses form tanpa login | Sesuai arsitektur: redirect login atau 401 |
| NC-4 | Network error saat upload | Simulate timeout / disconnect | UI tampilkan error; tidak crash; user bisa retry |

---

## 3. Regression Checklist

| # | Area | Yang dicek |
|---|------|------------|
| R-1 | Tambah Permohonan tanpa PDF | User bisa buat permohonan baru dengan input manual penuh; tidak wajib upload PDF |
| R-2 | Form field existing | Pemohon, klien, tanggal, penggunaan tanah, kecamatan, desa — tetap berfungsi |
| R-3 | Validasi form | Validasi required field, format — tidak berubah |
| R-4 | Upload PDF untuk permohonan existing | Fitur upload PDF di tab NIB/GU/PBT (permohonanId) — tidak terpengaruh |
| R-5 | lib/discord.ts | getOrCreateThreadForPermohonan, sendFileToThread — tidak ada breaking change |

---

## 4. Definition of Done (QA Validation)

PDF Extraction **Done** bila:

1. Semua acceptance criteria AC-1 s/d AC-5 **PASS**.
2. Minimal **happy path HP-1 s/d HP-4** dan **edge case EC-1, EC-2, EC-4, EC-5, EC-6, EC-7** lolos test.
3. **Regression R-1 s/d R-5** tidak ada regresi baru.
4. Tidak ada bug **Critical** atau **High** yang open.
5. API contract (ARCH section 4) dipatuhi.

---

## 5. Jawaban Open Question PM

> Apakah perlu sample PDF template untuk testing?

**Jawaban: Ya, sangat disarankan.**

| Prioritas | Alasan |
|-----------|--------|
| **P1** | Tanpa sample template, test ekstraksi tidak reproducible. Parsing bergantung pada format (label "Nama:", "NIK:", dll). |
| **Rekomendasi** | Buat 1–2 sample PDF: (a) digital PDF dengan template standar, (b) scanned PDF dengan template sama. Simpan di `project/basis-data-plm/docs/samples/` atau repo test. |
| **Format template** | Dokumentasikan format template (label, urutan field) di PRD atau ARCH agar Backend dan QA sinkron. |

---

## 6. Risiko & Catatan QA

| ID | Risiko | Severity | Mitigasi |
|----|--------|----------|----------|
| QA-R1 | Template PDF berubah → parsing break | High | Dokumentasikan format; sample PDF untuk regression |
| QA-R2 | OCR (tesseract) lambat → UX buruk | Medium | Loading state jelas; timeout handling; ARCH: "Sedang memproses..." |
| QA-R3 | Ekstraksi partial → user lupa edit | Medium | UI hint: "Periksa dan edit data hasil ekstraksi sebelum menyimpan" |
| QA-R4 | Kode KJSB format tidak divalidasi konsisten | Medium | FE dan BE sama-sama validasi format BKS-YYYY-XXXX |
| QA-R5 | discord_thread_id tidak tersimpan saat save | High | Test eksplisit: cek DB setelah save; thread_id harus ada |

---

## 7. API Contract Reference (dari ARCH)

**Endpoint:** `POST /api/upload-pdf-extract`

**Request:** `multipart/form-data`
- `file` (required): File PDF
- `kodeKjsb` (required): string, format BKS-YYYY-XXXX

**Response 200:**
```json
{
  "extractedData": {
    "nama": "string?",
    "nik": "string?",
    "alamat": "string?",
    "luas_permohonan": "number?",
    "lokasi_tanah": "string?",
    "kota_kabupaten": "string?",
    "kecamatan": "string?",
    "kelurahan_desa": "string?"
  },
  "discordThreadId": "string"
}
```

**Response Error:**
- 400: validasi gagal (file kosong, bukan PDF, kodeKjsb kosong)
- 404: Discord tidak terkonfigurasi
- 500: ekstraksi gagal, Discord error
