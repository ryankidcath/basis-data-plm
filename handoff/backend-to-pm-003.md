# Handoff: Backend Engineer → Project Manager

## From
Backend Engineer

## To
Project Manager

## Context

Handoff pm-to-backend-003 (Perbaikan error "Unexpected token '<', <!DOCTYPE..." pada upload PDF & Isi Otomatis) telah selesai.

## Objective

Lapor penyelesaian perbaikan. API `/api/upload-pdf-extract` diharapkan selalu mengembalikan JSON.

## Result

### 1. Route segment config (app/api/upload-pdf-extract/route.ts)
- `export const runtime = "nodejs"` — pdf-parse dan tesseract membutuhkan Node.js runtime
- `export const maxDuration = 60` — ekstraksi OCR bisa memakan waktu lama

### 2. Body size limit (next.config.js)
- `experimental.serverActions.bodySizeLimit: "25mb"`
- **Catatan:** Konfigurasi ini secara resmi untuk Server Actions. Jika frontend memanggil via `fetch()` ke Route Handler, limit mungkin tetap 1MB default. Jika error "Unexpected token" masih terjadi pada file besar, pertimbangkan: (a) pastikan frontend mengirim via form action ke API, atau (b) eskali ke DevOps untuk konfigurasi edge/proxy.

### 3. Error handling
- Semua error path mengembalikan `NextResponse.json({ error: "..." })` dengan status 4xx/5xx
- Dynamic import untuk `@/lib/pdf-extract` — jika modul gagal load (pdf-parse, tesseract), error tertangkap di try-catch dan dikembalikan sebagai JSON, bukan HTML error page

### 4. Verifikasi module load
- pdf-extract di-import secara dinamis di dalam handler, sehingga kegagalan load (termasuk dependency) tertangkap dan dikembalikan sebagai JSON error

## Constraints

- Tetap dalam ekosistem Next.js
- Logika ekstraksi tidak diubah

## Deliverables

- [x] runtime = "nodejs", maxDuration = 60
- [x] bodySizeLimit = "25mb" di next.config.js
- [x] Error handling mengembalikan JSON
- [x] Dynamic import pdf-extract untuk tangani module load error

## Open Questions

- **bodySizeLimit:** Jika error masih terjadi pada file >1MB, serverActions.bodySizeLimit mungkin tidak berlaku untuk Route Handler yang dipanggil via fetch. Alternatif: proxyClientMaxBodySize (untuk proxy) atau konfigurasi deployment.

## Done When

- [x] API selalu mengembalikan JSON (200 atau 4xx/5xx)
- [x] Konfigurasi body size 25MB
- [ ] QA validasi: upload PDF berhasil tanpa error "Unexpected token" di frontend
