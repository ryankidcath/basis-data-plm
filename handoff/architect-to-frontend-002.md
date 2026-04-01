# Handoff: System Architect → Frontend Engineer

## From
System Architect

## To
Frontend Engineer

## Context

Fitur **ekstraksi data dari PDF** untuk pre-fill Tambah Permohonan Baru. PM handoff: pm-to-frontend-003. Arsitektur final: `project/basis-data-plm/docs/ARCH-pdf-extraction-001.md`.

## Objective

Ubah **TambahPermohonanForm** agar mendukung flow "Upload PDF & Isi Otomatis" dengan API contract final.

## Constraints

- User harus bisa mengedit hasil pre-fill sebelum save
- Kode KJSB wajib diisi sebelum upload PDF
- Tidak mengubah flow "Tambah pemohon baru" atau "Tambah klien" yang ada

## Deliverables

1. **Urutan field:** Kode KJSB di atas (sebelum area upload PDF)

2. **Area "Upload PDF & Isi Otomatis":**
   - File input
   - Kirim FormData: `file`, `kodeKjsb` ke `POST /api/upload-pdf-extract`
   - Loading state saat ekstraksi (tesseract bisa lambat)

3. **Pre-fill logic:**
   - Isi field form dengan extractedData
   - Pemohon: pre-fill form "Tambah pemohon baru" atau pilih dari list jika nama match (sesuai rekomendasi PM)

4. **Submit:**
   - Include `discord_thread_id` bila dari flow PDF
   - Skip panggil `/api/discord/create-thread` (thread sudah ada dari upload)

## API Contract (Final)

**Endpoint:** `POST /api/upload-pdf-extract`

**Request:** FormData
- `file`: File PDF
- `kodeKjsb`: string (BKS-YYYY-XXXX)

**Response 200:**
```json
{
  "extractedData": {
    "nama": "...",
    "nik": "...",
    "alamat": "...",
    "luas_permohonan": 123,
    "lokasi_tanah": "...",
    "kota_kabupaten": "...",
    "kecamatan": "...",
    "kelurahan_desa": "..."
  },
  "discordThreadId": "123456789..."
}
```

**Response error:** `{ "error": "..." }` — tampilkan pesan ke user

## Dependencies

- ARCH: `project/basis-data-plm/docs/ARCH-pdf-extraction-001.md`
- Backend API: `POST /api/upload-pdf-extract` (implementasi Backend)
- TambahPermohonanForm

## Done When

- User ketik Kode KJSB → upload PDF → field terisi otomatis
- User dapat edit sebelum save
- Saat save, permohonan tersimpan dengan discord_thread_id yang benar
- Loading/error state ditangani dengan baik
