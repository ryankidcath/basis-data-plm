# Handoff: PM → Backend Engineer

## From
Project Manager

## To
Backend Engineer

## Context

User melaporkan error setelah klik upload di fitur "Upload PDF & Isi Otomatis". Error di frontend: **"Unexpected token '<', "<!DOCTYPE "... is not valid JSON"** — artinya API `/api/upload-pdf-extract` mengembalikan HTML (halaman error Next.js) alih-alih JSON. Root cause kemungkinan di server.

## Objective

Pastikan endpoint `POST /api/upload-pdf-extract` selalu mengembalikan JSON, dan perbaiki konfigurasi yang mungkin menyebabkan server mengembalikan HTML error page.

## Constraints

- Tetap dalam ekosistem Next.js
- Tidak mengubah logika ekstraksi yang ada

## Deliverables

1. **Route segment config** — Tambah `export const runtime = "nodejs"` dan `export const maxDuration = 60` di `app/api/upload-pdf-extract/route.ts` (pdf-parse dan tesseract butuh Node.js runtime).
2. **Body size limit** — Tambah `bodySizeLimit: "25mb"` di `next.config.js` (experimental.serverActions) agar upload PDF besar tidak ditolak Next.js sebelum handler jalan.
3. **Error handling** — Pastikan semua error path (termasuk uncaught) mengembalikan `NextResponse.json({ error: "..." })`, bukan throw yang menghasilkan HTML error page.
4. **Verifikasi** — Cek apakah ada error saat load module (pdf-extract, pdf-parse, tesseract) yang bisa menyebabkan route gagal load; jika ada, tangani atau dokumentasikan.

## Dependencies

- app/api/upload-pdf-extract/route.ts
- next.config.js
- lib/pdf-extract.ts

## Open Questions

- Apakah body size limit di serverActions berlaku untuk Route Handlers? Jika tidak, cari alternatif (mis. proxyClientMaxBodySize atau konfigurasi lain).

## Done When

- API selalu mengembalikan JSON (200 atau 4xx/5xx)
- Upload PDF berhasil tanpa error "Unexpected token" di frontend
- Body size 25MB didukung
