# QA Test Execution: Upload PDF & Isi Otomatis (Bug Fix Validation)

**Produk:** Basis Data PLM  
**Sumber handoff:** PM → QA (pm-to-qa-006.md)  
**Tujuan:** Validasi bug fix "Unexpected token" dan regression

---

## Instruksi

1. Jalankan aplikasi (dev atau production)
2. Buka tab **Input Data** → **Tambah Permohonan Baru**
3. Jalankan tiap test case di bawah
4. Isi kolom **Hasil** (PASS / FAIL)
5. Bila FAIL, tulis catatan singkat di **Catatan**
6. Laporkan verdict ke PM

---

## Test Cases

### Happy Path

| # | Skenario | Langkah | Expected | Hasil | Catatan |
|---|----------|---------|----------|-------|---------|
| HP-1 | Upload PDF valid | 1) Isi Kode KJSB (BKS-2025-0001) 2) Klik pilih file 3) Pilih PDF valid (<1MB) 4) Tunggu | Tidak ada error "Unexpected token"; extractedData terisi atau kosong; discordThreadId return; PDF di Discord | | |
| HP-2 | extractedData kosong (PDF tanpa template) | 1) Upload PDF yang tidak punya template standar | Tidak error; field kosong; user bisa input manual; discordThreadId tetap return | | |
| HP-3 | extractedData terisi | 1) Upload PDF dengan template standar (nama, NIK, alamat, dll) | Field form terisi otomatis; user bisa edit | | |
| HP-4 | Save dengan discord_thread_id | 1) Setelah HP-1/2/3 2) Lengkapi form 3) Klik "Buat Permohonan" | Permohonan tersimpan; discord_thread_id tersimpan di DB | | |

---

### Error Handling

| # | Skenario | Langkah | Expected | Hasil | Catatan |
|---|----------|---------|----------|-------|---------|
| EH-1 | Server return HTML (simulasi) | Sulit disimulasi tanpa stop server. Alternatif: stop backend, upload PDF | Bila server return HTML: tampil "Server mengembalikan respons tidak valid. Periksa log server atau coba lagi." — BUKAN "Unexpected token '<'..." | | |
| EH-2 | File bukan PDF | Upload file .txt atau .jpg rename ke .pdf | Pesan error user-friendly (bukan crash); "Hanya file PDF..." atau setara | | |
| EH-3 | Kode KJSB kosong | Klik upload tanpa isi Kode KJSB | "Isi Kode KJSB terlebih dahulu (format BKS-YYYY-XXXX)." | | |
| EH-4 | Kode KJSB invalid | Isi "abc" atau "BKS-2025" (tanpa nomor) lalu upload | "Isi Kode KJSB terlebih dahulu..." | | |

---

### Regression

| # | Skenario | Langkah | Expected | Hasil | Catatan |
|---|----------|---------|----------|-------|---------|
| R-1 | Tambah Permohonan tanpa PDF | 1) Jangan upload PDF 2) Isi Kode KJSB 3) Pilih pemohon, klien, tanggal, dll 4) Klik "Buat Permohonan" | Permohonan tersimpan; flow manual tidak terpengaruh | | |

---

### File Size

| # | Skenario | Langkah | Expected | Hasil | Catatan |
|---|----------|---------|----------|-------|---------|
| FS-1 | PDF kecil (<1MB) | Upload PDF < 1MB | Upload berhasil; tidak error | | |
| FS-2 | PDF sedang (1–5MB) | Upload PDF 1–5MB (bila ada) | Upload berhasil; tidak error | | |

---

## Verdict

| Kriteria | Status |
|----------|--------|
| Semua Happy Path (HP-1..HP-4) | |
| Minimal 1 Error Handling (EH-2 atau EH-3) | |
| Regression (R-1) | |
| Minimal 1 File Size (FS-1) | |

**Verdict final:** □ PASS (Release Ready)  □ FAIL (ada blocker)
