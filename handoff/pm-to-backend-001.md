# Handoff: PM → Backend Engineer

## From
Project Manager

## To
Backend Engineer

## Context

Fitur **upload PDF hasil scan** ke Discord channel #berkas-plm. Pola mengikuti upload DXF yang sudah ada (`/api/upload-dxf`). PDF tidak perlu parsing — cukup kirim file ke Discord via `getOrCreateThreadForPermohonan` dan `sendFileToThread`. PRD: `project/basis-data-plm/docs/PRD-upload-pdf-001.md`.

## Objective

Implementasi API endpoint `POST /api/upload-pdf` yang menerima file PDF dan mengirim ke Discord thread sesuai permohonan.

## Constraints

- Gunakan `lib/discord.ts` — `getOrCreateThreadForPermohonan`, `sendFileToThread`
- Channel #berkas-plm (DISCORD_CHANNEL_ID yang sama dengan DXF)
- Tidak mengubah route atau flow upload DXF

## Deliverables

1. **Route baru** `app/api/upload-pdf/route.ts`
2. **Validasi:**
   - Hanya terima `application/pdf` atau ekstensi `.pdf`
   - Reject jika file > 25MB
   - Reject jika `permohonanId` kosong
3. **Logika:** Ambil thread via `getOrCreateThreadForPermohonan(permohonanId)`, kirim buffer via `sendFileToThread(threadId, buffer, filename, "Upload PDF")`

## Dependencies

- `lib/discord.ts` — `getOrCreateThreadForPermohonan`, `sendFileToThread`
- Tabel `permohonan` dengan `kode_kjsb`, `discord_thread_id`

## API Contract (untuk sinkronisasi dengan Frontend)

**Request:** `POST /api/upload-pdf`, `multipart/form-data`
- `file` (required): File PDF
- `permohonanId` (required): UUID permohonan

**Response sukses (200):**
```json
{ "ok": true, "message": "PDF berhasil dikirim ke Discord." }
```

**Response error (4xx/5xx):**
```json
{ "error": "Pesan error" }
```

## Open Questions

- Tidak ada. Contract sudah jelas dari PRD.

## Done When

- Endpoint `/api/upload-pdf` berfungsi
- File PDF valid terkirim ke Discord thread
- Error handling untuk file invalid, ukuran > 25MB, permohonanId invalid
