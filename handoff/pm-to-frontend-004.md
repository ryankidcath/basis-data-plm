# Handoff: PM → Frontend Engineer

## From
Project Manager

## To
Frontend Engineer

## Context

User melaporkan error setelah klik upload di fitur "Upload PDF & Isi Otomatis" (TambahPermohonanForm). Error: **"Unexpected token '<', "<!DOCTYPE "... is not valid JSON"**. Ini terjadi karena server mengembalikan HTML (halaman error) alih-alih JSON, dan frontend memanggil `res.json()` tanpa validasi.

## Objective

Perbaiki penanganan respons di `handlePdfUpload` (TambahPermohonanForm.tsx) agar tidak crash ketika server mengembalikan non-JSON (misalnya HTML error page).

## Constraints

- Jangan mengubah flow atau logika yang ada
- Tetap tampilkan pesan error yang informatif ke user

## Deliverables

1. **Safe JSON parsing** — Jangan langsung `await res.json()`. Gunakan `await res.text()` dulu, lalu `JSON.parse(text)` dalam try-catch.
2. **Fallback error message** — Jika `JSON.parse` gagal (respons HTML atau invalid), tampilkan pesan user-friendly: "Server mengembalikan respons tidak valid. Periksa log server atau coba lagi."
3. **Tetap handle `res.ok`** — Jika `res.ok` false dan parse berhasil, tampilkan `data.error` seperti biasa.

## Dependencies

- TambahPermohonanForm.tsx — fungsi `handlePdfUpload`
- API: `POST /api/upload-pdf-extract`

## Open Questions

- Tidak ada.

## Done When

- User tidak lagi melihat error "Unexpected token '<'..." saat server mengembalikan HTML
- Pesan error yang ditampilkan informatif dan user-friendly
