# Handoff: PM → Frontend Engineer

## From
Project Manager

## To
Frontend Engineer

## Context

User meminta **hapus fitur pembaca PDF otomatis**. Fitur upload PDF ke Discord tetap ada. User input manual saat menambah permohonan baru. Posisi upload: **persis sebelum tombol "Buat Permohonan"**.

## Objective

1. **Hapus ekstraksi** — Hapus seluruh UI dan logika terkait ekstraksi: pre-fill dari extractedData, debug checkbox, debug info, fuzzy match
2. **Sederhanakan upload** — Upload PDF hanya mengirim ke Discord (by kodeKjsb), dapat discordThreadId, simpan saat submit
3. **Pindahkan posisi** — Area upload PDF dipindah ke **persis sebelum tombol "Buat Permohonan"**
4. **Ubah label** — "Upload PDF & Isi Otomatis" → "Upload Berkas PDF" (atau "Upload PDF ke Discord")

## Constraints

- Fitur upload ke Discord tetap berfungsi
- User input manual semua field
- Tidak mengubah flow submit (discord_thread_id tetap disertakan bila dari upload)

## Deliverables

1. **Hapus** — Pre-fill logic (setAddPemohonNama, setLuasPermohonan, setLokasiTanah, setSelectedKecamatan, setSelectedDesa dari extractedData)
2. **Hapus** — Debug checkbox, pdfDebugMode, pdfDebugInfo, pdfDebugExpanded
3. **Hapus** — Fuzzy match (fuzzyMatchKecamatan, fuzzyMatchDesa) jika hanya dipakai untuk ekstraksi
4. **Sederhanakan handlePdfUpload** — Panggil API (tanpa ?debug=1), dapat { discordThreadId }, setDiscordThreadId. Tidak perlu extractedData
5. **Pindahkan** — Blok upload PDF dari posisi saat ini (setelah Kode KJSB) ke **persis sebelum tombol "Buat Permohonan"**
6. **Label** — "Upload Berkas PDF" — "Isi Kode KJSB di atas, lalu pilih file PDF. Berkas akan dikirim ke Discord."
7. **State** — Hapus state yang tidak dipakai: luasPermohonan (defaultValue form), lokasiTanah bisa tetap (user input manual). Pastikan form tidak bergantung pada state dari ekstraksi.

## Dependencies

- TambahPermohonanForm.tsx
- API: POST /api/upload-pdf-extract (Backend akan simplify, response hanya { discordThreadId })

## Open Questions

- Tidak ada.

## Done When

- Upload PDF sederhana: pilih file → kirim ke Discord → dapat discordThreadId
- Posisi upload persis sebelum "Buat Permohonan"
- Label "Upload Berkas PDF"
- Tidak ada ekstraksi, debug, atau pre-fill
