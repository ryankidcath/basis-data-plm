# Handoff: PM → Frontend Engineer

## From
Project Manager

## To
Frontend Engineer

## Context

User melaporkan **field masih kosong setelah upload** PDF. Lokasi Tanah, Kecamatan, Kelurahan/Desa kosong. extractedData mungkin terisi dari API tapi frontend tidak menampilkan karena:
1. **Match ketat** — Kecamatan dan Kelurahan/Desa hanya terisi jika nilai **exact match** dengan `KECAMATAN_LIST` dan `getDesaByKecamatan`. OCR/handwriting bisa output "Kedavung" vs "Kedawung", atau "Karangdawa" vs "Kedungdawa" (wilayah).
2. **lokasi_tanah** — Free text; harusnya terisi jika extractedData.lokasi_tanah ada. Cek apakah state ter-set.

## Objective

Perbaiki pre-fill di TambahPermohonanForm agar field terisi lebih robust:
1. **lokasi_tanah** — Pastikan `setLokasiTanah(extractedData.lokasi_tanah)` dipanggil saat ada nilai (termasuk string kosong " " yang trim jadi "")
2. **Kecamatan** — Tambah **fuzzy/partial match**: jika exact match gagal, coba `kecamatan.toLowerCase().includes(extracted.toLowerCase())` atau `extracted.toLowerCase().includes(kecamatan.toLowerCase())` untuk nilai terdekat
3. **Kelurahan/Desa** — Same: fuzzy match bila exact match gagal. Contoh: "Karangdawa" bisa match "Kedungdawa" (Levenshtein/jarak) atau minimal cari yang `startsWith` / `includes`
4. **Fallback** — Jika kecamatan/kelurahan tidak ada di list wilayah, tetap set lokasi_tanah dengan nilai lengkap (Desa X, Kec Y, Kab Z) agar user bisa baca dan edit manual

## Constraints

- Jangan mengubah struktur form atau dropdown
- Fuzzy match jangan terlalu agresif (false positive)

## Deliverables

1. **lokasi_tanah** — Pastikan pre-fill jalan; cek `if (extractedData.lokasi_tanah)` — handle empty string
2. **Fuzzy match kecamatan** — Jika exact match gagal, coba: cari kecamatan yang `includes` extracted atau extracted `includes` kecamatan (case insensitive)
3. **Fuzzy match kelurahan** — Same untuk desa dalam kecamatan yang match
4. **Fallback lokasi** — Jika extractedData punya lokasi_tanah (dari "Terletak di") tapi kecamatan/kelurahan tidak match, tetap set lokasi_tanah agar user lihat dan bisa salin/edit

## Dependencies

- TambahPermohonanForm.tsx — handlePdfUpload
- lib/wilayah.ts — KECAMATAN_LIST, getDesaByKecamatan

## Open Questions

- Tidak ada.

## Done When

- lokasi_tanah terisi bila extractedData.lokasi_tanah ada
- Kecamatan terisi dengan fuzzy match (mis. "Kedavung" → "Kedawung")
- Kelurahan terisi dengan fuzzy match bila memungkinkan
- User tidak melihat field kosong padahal API return data
