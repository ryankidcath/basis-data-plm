# Template Format PDF untuk Ekstraksi

**Fitur:** Upload PDF & Isi Otomatis (Tambah Permohonan Baru)  
**Modul:** `lib/pdf-extract.ts` — `parseTextToExtractedData`

---

## 1. Format yang Diharapkan

Parser menggunakan pattern matching untuk label berikut. Teks setelah label (sampai newline) diambil sebagai nilai.

| Field | Label yang dikenali | Contoh |
|-------|---------------------|--------|
| nama | Nama, Nama Pemohon | `Nama: John Doe` atau `Nama Pemohon: Jane Smith` |
| nik | NIK | `NIK: 3201234567890123` (16 digit, spasi diabaikan) |
| alamat | Alamat | `Alamat: Jl. Merdeka No. 1, Jakarta` |
| luas_permohonan | Luas | `Luas: 1.234 m²`, `Luas: + 72 m²`, `Luas: 1234,56` |
| lokasi_tanah | Terletak di, Lokasi, Lokasi Tanah | `Terletak di Desa/Kelurahan: Karangdawa` |
| kota_kabupaten | Kabupaten/Kota, Kota/Kab, Kabupaten | `Kabupaten/Kota: Cirebon` |
| kecamatan | Kecamatan | `Kecamatan: Kedawung` |
| kelurahan_desa | Terletak di Desa/Kelurahan, Desa/Kelurahan, Kelurahan/Desa | `Desa/Kelurahan: Karangdawa` |

## 2. Pemisah

- Label dan nilai dipisah oleh `:` atau spasi
- Contoh valid: `Nama: John`, `Nama : John`, `Nama  John`

## 3. Variasi yang Didukung

- **Nama:** "Nama", "Nama Pemohon" (case insensitive)
- **NIK:** 16 digit, boleh ada spasi (akan dihapus)
- **Luas:** Angka dengan koma atau titik desimal; satuan m², m2 opsional

## 4. Debug Mode

Untuk investigasi field kosong (terutama PDF scanned/OCR):

- **Env:** `DEBUG_PDF_EXTRACT=1` — log ke server console + sertakan `_debug` di response
- **Query param:** `?debug=1` — sertakan `_debug` di response (mis. `POST /api/upload-pdf-extract?debug=1`)

**Response saat debug** berisi field `_debug`:
```json
{
  "extractedData": {...},
  "discordThreadId": "...",
  "_debug": {
    "rawTextLength": 1234,
    "rawTextPreview": "first 1200 chars...",
    "extractedData": {...}
  }
}
```

User bisa copy `rawTextPreview` dari Network tab atau UI dan kirim ke Backend untuk analisis pattern. Log tetap ke server console.

## 5. OCR Fallback (PDF Scan)

Jika pdf-parse mengembalikan teks < 50 char (PDF scan), fallback: **pdf-parse getScreenshot** → render halaman ke PNG → **tesseract.js** OCR. Tidak lagi pakai pdf-to-img (error Object.defineProperty di Next.js).

## 6. Normalisasi

Parser menormalisasi teks: line break diganti spasi, spasi ganda digabung. Pattern mendukung:
- `:?` — colon opsional (OCR kadang hilangkan)
- `\s*\/?\s*` — slash opsional (Desa Kelurahan vs Desa/Kelurahan)
- Lookahead ke label berikutnya untuk batas capture

## 7. Jika Format Berbeda

Jika PDF user memakai label lain (mis. "Nama Lengkap:", "NAMA PEMOHON :"), sesuaikan regex di `lib/pdf-extract.ts` → `parseTextToExtractedData`.

Untuk men-debug: aktifkan DEBUG_PDF_EXTRACT=1 atau ?debug=1, cek log rawText preview.

## 8. Format Permohonan Pengukuran Kadastral (Lampiran 13)

Form standar KJSB Benning dan Rekan. Parser mendukung format ini.

### Section Pemohon ("Yang bertanda tangan di bawah ini:")
| Field DB | Label di Form | Contoh nilai |
|----------|---------------|--------------|
| nama | Nama | Yushi Nurfitriani |
| nik | NIK | 3205179205950002 |
| alamat | Alamat | Blok wuni 1, RT/RW 001/009 Ds. Dawuan, kec. Tengah tani, Kab. Cirebon |

### Section Bidang Tanah
| Field DB | Label di Form | Contoh nilai |
|----------|---------------|--------------|
| lokasi_tanah | Terletak di (di samping label) | Boleh kosong. Nilai setelah label atau dari "Alas bidang tanah:" |
| kelurahan_desa | Desa/Kelurahan | Karangdawa, onyahtani (OCR) |
| kecamatan | Kecamatan | Kedawung |
| kota_kabupaten | Kabupaten/Kota | Cirebon, tirebon (OCR) |
| luas_permohonan | Luas | + 72 m² (tanda + opsional) |

Parser memakai struktur baris: value di baris berikut label. Alamat dapat 2 baris. Koreksi OCR: fushi→Yushi, úrpthani→Nurfitriani, vurfha ni→Nurfitriani.

## 9. Fallback

Jika ekstraksi gagal total (error "Object.defineProperty" atau PDF corrupt):
- API tetap return `{ extractedData: {}, discordThreadId }`
- PDF sudah tersimpan di Discord
- User dapat mengisi field manual
