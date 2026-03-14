# PRD: Upload PDF Hasil Scan ke Discord

**Produk:** Basis Data PLM (KJSB Benning dan Rekan)  
**Fitur:** Upload file PDF hasil scan ke Discord channel #berkas-plm  
**Sumber:** CEO brief (ceo-to-pm-002.md)

---

## 1. Tujuan

Tambahkan fitur **upload PDF hasil scan** ke Discord server KJSB Benning dan Rekan, channel **#berkas-plm**, dengan thread per kode KJSB. Pola mengikuti fitur upload DXF yang sudah ada.

## 2. Scope

### Dalam scope
- API endpoint upload PDF ke Discord (mirip `/api/upload-dxf` tanpa parsing geometri)
- UI upload PDF di konteks permohonan (tab NIB, GU, dan PBT)
- Validasi: hanya terima file PDF
- Thread otomatis dibuat jika belum ada (nama = kode KJSB)
- Ukuran maksimal file: 25MB (limit Discord)

### Di luar scope
- Parsing isi PDF
- Penyimpanan PDF ke Supabase/database
- Perubahan flow upload DXF yang sudah berjalan
- Multi-file upload dalam satu aksi (MVP: satu file per upload)

## 3. Constraints

- Memanfaatkan integrasi Discord existing (`lib/discord.ts`, env `DISCORD_BOT_TOKEN`, `DISCORD_CHANNEL_ID`)
- Channel #berkas-plm (sama dengan DXF)
- Thread naming = kode KJSB (sama dengan DXF)
- Tidak mengubah flow DXF

## 4. Dependencies Teknis

- `lib/discord.ts` — `getOrCreateThreadForPermohonan`, `sendFileToThread` (sudah ada)
- Tabel `permohonan` dengan `kode_kjsb`, `discord_thread_id` (sudah ada)
- Discord bot terkonfigurasi untuk channel #berkas-plm

## 5. Keputusan PM (Open Questions dari CEO)

| # | Pertanyaan | Keputusan |
|---|------------|-----------|
| 1 | Lokasi UI: tab terpisah atau digabung dengan DXF? | **Digabung** — section baru "Berkas PDF (Scan)" di tab "NIB, GU, dan PBT", di bawah GeoJSONUpload |
| 2 | Multiple PDF per permohonan? | **Satu file per upload** untuk MVP; user bisa upload berkali-kali jika perlu |
| 3 | Ukuran maksimal file? | **25MB** (limit Discord per file) |

## 6. API Contract (untuk Backend & Frontend)

**Endpoint:** `POST /api/upload-pdf`

**Request:** `multipart/form-data`
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

**Validasi:**
- Hanya terima `application/pdf` atau file dengan ekstensi `.pdf`
- Reject jika file > 25MB
- Reject jika `permohonanId` kosong atau tidak valid

## 7. Done When

- User dapat upload file PDF dari dalam aplikasi
- PDF tersimpan di Discord channel #berkas-plm, thread sesuai kode KJSB
- Thread baru dibuat otomatis jika belum ada
- Flow mengikuti pola upload DXF yang sudah ada
- Validasi PDF dan ukuran berjalan dengan benar
