# Handoff: PM → Frontend Engineer

## From
Project Manager

## To
Frontend Engineer

## Context

Fitur **ekstraksi data dari PDF** untuk pre-fill Tambah Permohonan Baru. Alur: user ketik Kode KJSB dulu → upload PDF → dapat extractedData + discordThreadId → pre-fill form → user edit → save dengan discord_thread_id. PRD: `project/basis-data-plm/docs/PRD-pdf-extraction-001.md`. **Tunggu handoff Architect (pm-to-architect-002)** untuk API contract final.

## Objective

Ubah **TambahPermohonanForm** agar mendukung flow "Upload PDF & Isi Otomatis":
1. Field **Kode KJSB** harus diisi dulu (validasi format BKS-YYYY-XXXX)
2. Tambah area/tombol **"Upload PDF & Isi Otomatis"** — user pilih file → kirim ke API (file + kodeKjsb) → dapat `{ extractedData, discordThreadId }`
3. **Pre-fill** field: nama, nik, alamat (pemohon); luas_permohonan, lokasi_tanah, kota_kabupaten, kecamatan, kelurahan_desa (permohonan)
4. Simpan **discordThreadId** di state; saat submit, sertakan `discord_thread_id` di insert permohonan
5. Jika dari flow PDF, **jangan** panggil `/api/discord/create-thread` lagi (thread sudah ada)

## Constraints

- User harus bisa mengedit hasil pre-fill sebelum save
- Kode KJSB wajib diisi sebelum upload PDF
- Tidak mengubah flow "Tambah pemohon baru" atau "Tambah klien" yang ada

## Deliverables

1. **Urutan field:** Kode KJSB di atas (atau paling tidak sebelum area upload PDF)
2. **Area "Upload PDF & Isi Otomatis":** file input, kirim FormData (file, kodeKjsb) ke API upload+ekstraksi
3. **Pre-fill logic:** isi field form dengan extractedData; untuk pemohon: bisa pre-fill form "Tambah pemohon baru" atau pilih dari list jika nama match
4. **Submit:** include `discord_thread_id` bila dari flow PDF; skip create-thread API call

## Dependencies

- Architect handoff (pm-to-architect-002) — untuk API contract
- Backend API: `POST /api/upload-pdf-extract` (atau nama final dari Architect)
- TambahPermohonanForm.tsx

## API Contract (sementara)

**Request:** FormData: `file`, `kodeKjsb`

**Response:** `{ extractedData: {...}, discordThreadId: string }`

## Open Questions

- Untuk pre-fill pemohon: apakah buat pemohon baru otomatis dari extractedData, atau pre-fill form "Tambah pemohon baru" dan user klik Simpan? (PM rekomendasi: pre-fill form, user konfirmasi/edit lalu Simpan)

## Done When

- User ketik Kode KJSB → upload PDF → field terisi otomatis
- User dapat edit sebelum save
- Saat save, permohonan tersimpan dengan discord_thread_id yang benar
