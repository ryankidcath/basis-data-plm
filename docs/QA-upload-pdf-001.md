# QA: Upload PDF Hasil Scan ke Discord

**Produk:** Basis Data PLM  
**Sumber handoff:** PM → QA (pm-to-qa-004.md)  
**PRD:** PRD-upload-pdf-001.md

---

## 1. Acceptance Criteria

### AC-1: Upload PDF ke Discord

| ID | Acceptance Criteria | Testable? |
|----|---------------------|-----------|
| AC-1.1 | User dapat upload file PDF dari UI di tab "NIB, GU, dan PBT" (section "Berkas PDF (Scan)") | ✅ |
| AC-1.2 | API `POST /api/upload-pdf` menerima `multipart/form-data` dengan field `file` dan `permohonanId` | ✅ |
| AC-1.3 | PDF berhasil dikirim ke Discord channel #berkas-plm, di thread sesuai kode KJSB permohonan | ✅ |
| AC-1.4 | Response sukses (200): `{ "ok": true, "message": "PDF berhasil dikirim ke Discord." }` | ✅ |
| AC-1.5 | Satu file per upload; user dapat upload berkali-kali untuk menambah PDF ke thread yang sama | ✅ |

---

### AC-2: Validasi File

| ID | Acceptance Criteria | Testable? |
|----|---------------------|-----------|
| AC-2.1 | Hanya menerima file dengan MIME type `application/pdf` atau ekstensi `.pdf` | ✅ |
| AC-2.2 | Reject file > 25MB dengan response error (400) dan pesan jelas | ✅ |
| AC-2.3 | Reject file kosong (0 byte) dengan response error (400) | ✅ |
| AC-2.4 | Reject jika `permohonanId` kosong atau bukan UUID valid dengan response error (400) | ✅ |
| AC-2.5 | Reject jika `permohonanId` tidak ditemukan di database dengan response error (404) | ✅ |

---

### AC-3: Thread Discord

| ID | Acceptance Criteria | Testable? |
|----|---------------------|-----------|
| AC-3.1 | Thread otomatis dibuat jika belum ada (nama thread = kode KJSB) | ✅ |
| AC-3.2 | Menggunakan `getOrCreateThreadForPermohonan` dan `sendFileToThread` dari `lib/discord.ts` | ✅ |
| AC-3.3 | File PDF terkirim sebagai attachment di thread (bukan hanya link) | ✅ |
| AC-3.4 | Channel target: #berkas-plm (sama dengan DXF) | ✅ |

---

### AC-4: Feedback UI

| ID | Acceptance Criteria | Testable? |
|----|---------------------|-----------|
| AC-4.1 | Section "Berkas PDF (Scan)" tampil di bawah GeoJSONUpload di tab NIB, GU, PBT | ✅ |
| AC-4.2 | UI menampilkan pesan sukses setelah upload berhasil | ✅ |
| AC-4.3 | UI menampilkan pesan error yang jelas saat upload gagal | ✅ |
| AC-4.4 | UI menampilkan loading state saat upload sedang berjalan | ✅ |
| AC-4.5 | File input hanya menerima PDF (accept=".pdf,application/pdf") | ✅ |
| AC-4.6 | Pola UI mengikuti GeoJSONUpload (Card, file input, feedback success/error) | ✅ |

---

## 2. Test Plan

### 2.1 Happy Path

| # | Skenario | Langkah | Expected |
|---|----------|---------|----------|
| HP-1 | Upload PDF valid ke permohonan yang punya thread | 1) Pilih permohonan 2) Tab NIB/GU/PBT 3) Pilih file PDF <25MB 4) Upload | Response 200; PDF muncul di thread Discord; UI tampilkan sukses |
| HP-2 | Upload PDF ke permohonan tanpa thread | 1) Pilih permohonan baru (belum ada thread) 2) Upload PDF | Thread baru dibuat (nama = kode KJSB); PDF terkirim; response 200 |
| HP-3 | Multiple upload ke permohonan sama | 1) Upload PDF pertama 2) Upload PDF kedua ke permohonan yang sama | Kedua PDF muncul di thread yang sama; response 200 untuk keduanya |
| HP-4 | Section UI tampil benar | 1) Buka permohonan 2) Tab NIB, GU, PBT | Section "Berkas PDF (Scan)" tampil di bawah GeoJSONUpload |

---

### 2.2 Edge Cases

| # | Skenario | Langkah | Expected |
|---|----------|---------|----------|
| EC-1 | File bukan PDF | Upload file .docx, .txt, .jpg, atau .dxf | Reject 400; pesan error jelas (mis. "Hanya file PDF yang diterima"); file tidak terkirim ke Discord |
| EC-2 | File > 25MB | Upload PDF berukuran > 25MB | Reject 400; pesan error jelas (mis. "Ukuran file maksimal 25MB"); file tidak terkirim |
| EC-3 | File tepat 25MB | Upload PDF berukuran tepat 25MB | Diterima; response 200; PDF terkirim |
| EC-4 | permohonanId invalid (bukan UUID) | POST dengan permohonanId="abc" atau "123" | Reject 400; pesan error jelas |
| EC-5 | permohonanId UUID valid tapi tidak ada di DB | POST dengan permohonanId UUID random yang tidak ada | Reject 404; pesan error jelas |
| EC-6 | permohonanId kosong | POST tanpa permohonanId atau permohonanId="" | Reject 400; pesan error jelas |
| EC-7 | Thread belum ada (permohonan baru) | Permohonan dengan discord_thread_id = NULL | Thread dibuat otomatis; discord_thread_id tersimpan; PDF terkirim |
| EC-8 | File PDF dengan ekstensi .PDF (uppercase) | Upload file named "scan.PDF" | Diterima (case-insensitive); response 200 |
| EC-9 | Discord tidak dikonfigurasi | DISCORD_BOT_TOKEN atau DISCORD_CHANNEL_ID kosong | Backend handle gracefully; response 500 atau 503 dengan pesan error; UI tampilkan error |

---

### 2.3 Negative / Error Cases

| # | Skenario | Langkah | Expected |
|---|----------|---------|----------|
| NC-1 | Request tanpa file | POST dengan permohonanId saja, tanpa field file | Reject 400 |
| NC-2 | Request tanpa permohonanId | POST dengan file saja | Reject 400 |
| NC-3 | File corrupt / bukan PDF sebenarnya | File dengan ekstensi .pdf tapi isi bukan PDF | Backend validasi MIME/header; reject 400 bila terdeteksi |
| NC-4 | User tidak ter-authenticated | Upload tanpa login (bila endpoint dilindungi auth) | Sesuai arsitektur: redirect login atau 401 |

---

## 3. Regression Checklist

| # | Area | Yang dicek |
|---|------|------------|
| R-1 | Upload DXF | GeoJSONUpload tetap berfungsi; upload DXF ke Discord tidak terpengaruh |
| R-2 | Flow DXF | Parsing DXF, simpan ke bidang_tanah, update status — tidak berubah |
| R-3 | lib/discord.ts | getOrCreateThreadForPermohonan, sendFileToThread — tidak ada breaking change |
| R-4 | Tab NIB, GU, PBT | Layout tab; GeoJSONUpload tetap tampil dan berfungsi |
| R-5 | Permohonan + thread | Permohonan dengan discord_thread_id existing — DXF dan PDF sama-sama pakai thread yang sama |

---

## 4. Definition of Done (QA Validation)

Upload PDF **Done** bila:

1. Semua acceptance criteria AC-1 s/d AC-4 **PASS**.
2. Minimal **happy path HP-1 s/d HP-4** dan **edge case EC-1, EC-2, EC-4, EC-5, EC-6, EC-7** lolos test.
3. **Regression R-1 s/d R-5** tidak ada regresi baru.
4. Tidak ada bug **Critical** atau **High** yang open.
5. API contract (PRD section 6) dipatuhi: request/response format, validasi.

---

## 5. Risiko & Catatan QA

| ID | Risiko | Severity | Mitigasi |
|----|--------|----------|----------|
| QA-R1 | Validasi MIME bisa di-bypass (rename file) | Medium | Backend wajib cek magic bytes / header PDF, bukan hanya ekstensi |
| QA-R2 | Discord API rate limit | Low | Satu file per upload; bila banyak user concurrent, monitor |
| QA-R3 | Thread creation gagal (Discord down) | Medium | Error handling graceful; user dapat pesan jelas; tidak crash |
| QA-R4 | PDF terkirim tapi response error (race) | Low | Pastikan response 200 hanya setelah sendFileToThread sukses |

---

## 6. API Contract Reference (dari PRD)

**Endpoint:** `POST /api/upload-pdf`

**Request:** `multipart/form-data`
- `file` (required): File PDF
- `permohonanId` (required): UUID permohonan

**Response sukses (200):**
```json
{ "ok": true, "message": "PDF berhasil dikirim ke Discord." }
```

**Response error (4xx/5xx):**
```json
{ "error": "Pesan error" }
```

**Validasi:**
- Hanya terima `application/pdf` atau file dengan ekstensi `.pdf`
- Reject jika file > 25MB
- Reject jika `permohonanId` kosong atau tidak valid
