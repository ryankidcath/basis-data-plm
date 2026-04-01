# Handoff: CEO → Project Manager

## From
CEO

## To
Project Manager

## Context

User meminta fitur **baca PDF dan isi data otomatis** ke formulir. Setelah user upload PDF, aplikasi membaca teks dari PDF dan mengisi field sesuai tabel pemohon dan permohonan. User dapat mengedit hasil ekstraksi sebelum menyimpan.

**Constraint biaya:** Tidak ada biaya khusus — usahakan **gratis**. Hindari API berbayar (Google Document AI, AWS Textract, Azure Form Recognizer, dll).

**Fitur existing:**
- Upload PDF ke Discord sudah selesai (tab NIB, GU, PBT; `PdfUpload.tsx`, `/api/upload-pdf`)
- Form: `TambahPermohonanForm` (buat permohonan baru), `PermohonanForm` (edit), `PemohonForm` (edit pemohon)
- Tabel `pemohon`: nama, nik, alamat, no_hp
- Tabel `permohonan`: luas_permohonan, lokasi_tanah, kota_kabupaten, kecamatan, kelurahan_desa, dll
- `getOrCreateThreadForPermohonan(permohonanId)` — butuh permohonan sudah ada di DB

**Klarifikasi user (confirmed):**
1. **Template PDF** — Formulir memakai format yang sama (layout standar) → parsing bisa presisi dengan pattern matching
2. **Alur** — Saat menambah permohonan baru (belum ada data terpilih): user ketik Kode KJSB dulu → upload PDF → PDF langsung tersimpan di Discord (thread nama = Kode KJSB) → ekstrak data → pre-fill form → user edit → save. **Catatan teknis:** Permohonan belum ada di DB saat upload, jadi perlu `getOrCreateThreadByKode(kodeKjsb)` atau sejenisnya; saat save, simpan `discord_thread_id` ke permohonan baru.
3. **Ekstraksi** — Kota, kecamatan, kelurahan diekstrak terpisah sesuai kolom database (kota_kabupaten, kecamatan, kelurahan_desa)

## Objective

Tambahkan fitur **ekstraksi data dari PDF** untuk pre-fill formulir **Tambah Permohonan Baru**:
- Alur: user ketik Kode KJSB → upload PDF → PDF ke Discord (thread = kode) → ekstrak teks → pre-fill form → user edit → save (termasuk `discord_thread_id`)
- Ekstrak: **nama, nik, alamat** (pemohon); **luas_permohonan, lokasi_tanah, kota_kabupaten, kecamatan, kelurahan_desa** (permohonan) — sesuai kolom DB
- Template PDF standar → parsing dengan pattern matching
- Solusi **gratis** (pdf-parse, Tesseract.js)

## Constraints

- **Gratis** — tidak boleh pakai API berbayar
- User harus bisa mengedit hasil ekstraksi (bukan auto-save tanpa konfirmasi)
- Tetap dalam ekosistem Next.js + Supabase
- Thread Discord dibuat **sebelum** permohonan ada di DB (hanya kode KJSB yang sudah diketik user)

## Deliverables

1. **`getOrCreateThreadByKode(kodeKjsb)`** — buat/ambil thread Discord by kode (tanpa permohonanId). List thread di channel, cari yang namanya = kode; bila tidak ada, buat baru.
2. **API upload + ekstraksi** — endpoint yang: terima PDF + kodeKjsb → upload ke Discord (thread by kode) → ekstrak teks → parse ke struktur → return `{ extractedData, discordThreadId }`
3. **Logic parsing** — dari teks mentah ke: `{ nama, nik, alamat, luas_permohonan, lokasi_tanah, kota_kabupaten, kecamatan, kelurahan_desa }` (pattern matching sesuai template standar)
4. **UI di TambahPermohonanForm** — field Kode KJSB harus diisi dulu; tombol/area "Upload PDF & Isi Otomatis" → user pilih file → kirim PDF + kode → dapat extractedData + threadId → pre-fill semua field; simpan threadId untuk di-include saat insert permohonan
5. **Insert permohonan** — saat save, sertakan `discord_thread_id` bila dari flow upload PDF

## Dependencies

- npm: pdf-parse (digital PDF), tesseract.js (OCR untuk scan), pdf-to-img atau pdf2pic (konversi PDF→gambar untuk OCR)
- Discord API: list threads di channel, create thread by name
- Form: TambahPermohonanForm

## Open Questions

- (Resolved) Template PDF standar — ya
- (Resolved) Alur — TambahPermohonanForm saja; Kode KJSB dulu, lalu upload PDF
- (Resolved) Kota/kecamatan/kelurahan — ekstrak terpisah

## Done When

- User ketik Kode KJSB → upload PDF → PDF tersimpan di Discord (thread = kode KJSB)
- Aplikasi mengekstrak nama, nik, alamat, luas_permohonan, lokasi_tanah, kota_kabupaten, kecamatan, kelurahan_desa
- Field terisi otomatis; user dapat mengedit sebelum menyimpan
- Saat save, permohonan baru tersimpan dengan `discord_thread_id` yang benar
- Solusi ekstraksi gratis (tidak ada biaya API)
