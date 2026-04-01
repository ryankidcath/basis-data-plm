# Handoff: CEO → Project Manager

## From
CEO

## To
Project Manager

## Context

User meminta fitur baru: **upload file PDF (hasil scan)** ke Discord server KJSB Benning dan Rekan, channel **#berkas-plm**, dengan thread per kode KJSB.

**Pola existing:** Fitur upload DXF sudah ada dan berfungsi sama:
- API `/api/upload-dxf` menerima file + `permohonanId`
- `getOrCreateThreadForPermohonan(permohonanId)` — ambil atau buat thread (nama = `kode_kjsb`)
- `sendFileToThread(threadId, buffer, filename, "Upload DXF")` — kirim file ke thread
- UI: GeoJSONUpload di WorkflowForms (tab NIB, GU, PBT)

**Perbedaan PDF vs DXF:**
- DXF: parse → ekstrak geometri → simpan ke Supabase + kirim ke Discord
- PDF: **tidak perlu parsing** — cukup kirim file ke Discord saja

## Objective

Tambahkan fitur **upload PDF hasil scan** yang mengikuti pola DXF:
- File PDF di-upload dari dalam aplikasi
- Tersimpan di Discord channel #berkas-plm, thread sesuai kode KJSB
- Jika thread belum ada → buat thread baru dengan nama kode KJSB
- Memanfaatkan `getOrCreateThreadForPermohonan` dan `sendFileToThread` yang sudah ada

## Constraints

- Memanfaatkan integrasi Discord existing (`lib/discord.ts`, env `DISCORD_BOT_TOKEN`, `DISCORD_CHANNEL_ID`)
- Channel #berkas-plm (sama dengan DXF)
- Thread naming = kode KJSB (sama dengan DXF)
- Tidak mengubah flow DXF yang sudah berjalan

## Deliverables

1. **API endpoint** — upload PDF ke Discord (mirip `/api/upload-dxf` tapi tanpa parsing geometri)
2. **UI upload PDF** — tempat upload di konteks permohonan (ikuti pola DXF; PM tentukan tab/lokasi)
3. **Validasi** — hanya terima file PDF

## Dependencies

- `lib/discord.ts` — `getOrCreateThreadForPermohonan`, `sendFileToThread` (sudah ada)
- Tabel `permohonan` dengan `kode_kjsb`, `discord_thread_id` (sudah ada)
- Discord bot terkonfigurasi untuk channel #berkas-plm

## Open Questions

- Lokasi UI: tab terpisah untuk berkas/PDF, atau digabung dengan area upload DXF?
- Multiple PDF per permohonan: satu file per upload atau mendukung multi-file?
- Ukuran maksimal file PDF (Discord limit ~25MB per file)?

## Done When

- User dapat upload file PDF dari dalam aplikasi
- PDF tersimpan di Discord channel #berkas-plm, thread sesuai kode KJSB
- Thread baru dibuat otomatis jika belum ada
- Flow mengikuti pola upload DXF yang sudah ada
