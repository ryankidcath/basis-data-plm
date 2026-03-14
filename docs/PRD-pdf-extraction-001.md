# PRD: Ekstraksi Data dari PDF untuk Pre-fill Formulir

**Produk:** Basis Data PLM (KJSB Benning dan Rekan)  
**Fitur:** Baca PDF, ekstrak teks, pre-fill formulir Tambah Permohonan Baru  
**Sumber:** CEO brief (ceo-to-pm-003.md)

---

## 1. Tujuan

Tambahkan fitur **ekstraksi data dari PDF** untuk pre-fill formulir **Tambah Permohonan Baru**. User ketik Kode KJSB → upload PDF → PDF ke Discord (thread = kode) → ekstrak teks → pre-fill form → user edit → save (termasuk `discord_thread_id`).

## 2. Scope

### Dalam scope
- `getOrCreateThreadByKode(kodeKjsb)` — buat/ambil thread Discord by kode (tanpa permohonanId)
- API upload + ekstraksi: terima PDF + kodeKjsb → upload ke Discord → ekstrak teks → parse → return `{ extractedData, discordThreadId }`
- Parsing teks ke struktur: `{ nama, nik, alamat, luas_permohonan, lokasi_tanah, kota_kabupaten, kecamatan, kelurahan_desa }`
- UI di TambahPermohonanForm: Kode KJSB dulu → "Upload PDF & Isi Otomatis" → pre-fill → save dengan `discord_thread_id`
- Solusi **gratis** (pdf-parse, tesseract.js)

### Di luar scope
- API berbayar (Google Document AI, AWS Textract, Azure Form Recognizer)
- Auto-save tanpa konfirmasi user
- Perubahan flow upload PDF untuk permohonan yang sudah ada (tab Administrasi)

## 3. Constraints

- **Gratis** — tidak boleh pakai API berbayar
- User harus bisa mengedit hasil ekstraksi sebelum save
- Tetap Next.js + Supabase
- Thread Discord dibuat **sebelum** permohonan ada di DB (hanya kode KJSB)
- Template PDF standar → parsing dengan pattern matching

## 4. Alur (Flow)

1. User buka "Tambah Permohonan Baru"
2. User ketik **Kode KJSB** (wajib, format BKS-YYYY-XXXX)
3. User klik "Upload PDF & Isi Otomatis" → pilih file PDF
4. Aplikasi: upload PDF ke Discord (thread nama = kode KJSB, buat thread jika belum ada)
5. Aplikasi: ekstrak teks dari PDF → parse dengan pattern matching → pre-fill field
6. User review dan edit field (nama, nik, alamat, luas, lokasi, kota, kecamatan, kelurahan)
7. User pilih/tambah pemohon, klien, tanggal, penggunaan tanah
8. User klik "Buat Permohonan" → insert permohonan dengan `discord_thread_id` dari step 4

## 5. Dependencies Teknis

- npm: pdf-parse (digital PDF), tesseract.js (OCR untuk scan), pdf-to-img atau pdf2pic (PDF→gambar untuk OCR)
- Discord API: list threads di channel, create thread by name
- `lib/discord.ts` — perlu tambah `getOrCreateThreadByKode(kodeKjsb)`
- Form: TambahPermohonanForm
- Tabel: pemohon (nama, nik, alamat, no_hp), permohonan (luas_permohonan, lokasi_tanah, kota_kabupaten, kecamatan, kelurahan_desa, discord_thread_id)

## 6. Struktur Data Ekstraksi

```ts
interface ExtractedData {
  // Pemohon
  nama?: string;
  nik?: string;
  alamat?: string;
  // Permohonan
  luas_permohonan?: number;
  lokasi_tanah?: string;
  kota_kabupaten?: string;
  kecamatan?: string;
  kelurahan_desa?: string;
}
```

## 7. Open Questions (untuk Architect)

- Discord: endpoint tepat untuk list threads di forum channel, cari by name
- PDF: strategi fallback — pdf-parse dulu (digital), tesseract jika perlu (scan)
- API contract: request/response format untuk endpoint upload+ekstraksi

## 8. Done When

- User ketik Kode KJSB → upload PDF → PDF tersimpan di Discord (thread = kode KJSB)
- Aplikasi mengekstrak nama, nik, alamat, luas_permohonan, lokasi_tanah, kota_kabupaten, kecamatan, kelurahan_desa
- Field terisi otomatis; user dapat mengedit sebelum menyimpan
- Saat save, permohonan baru tersimpan dengan `discord_thread_id` yang benar
- Solusi ekstraksi gratis (tidak ada biaya API)
