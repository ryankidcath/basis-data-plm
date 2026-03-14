# Architecture: Ekstraksi Data dari PDF untuk Pre-fill Formulir

**Produk:** Basis Data PLM  
**Sumber:** PM handoff pm-to-architect-002.md  
**PRD:** PRD-pdf-extraction-001.md

---

## 1. Ringkasan Keputusan

| Aspek | Keputusan |
|-------|-----------|
| Discord | `getOrCreateThreadByKode(kodeKjsb)` — list active + archived threads, cari by name; bila tidak ada, buat baru via POST |
| PDF extraction | pdf-parse dulu (digital); fallback tesseract.js (scan) jika teks kosong/terlalu pendek |
| API endpoint | `POST /api/upload-pdf-extract` |
| Request | FormData: `file`, `kodeKjsb` |
| Response | `{ extractedData: ExtractedData, discordThreadId: string }` |

---

## 2. Discord: getOrCreateThreadByKode

### 2.1 Endpoint yang Digunakan

- **List active threads:** `GET /channels/{channel_id}/threads/active`  
  - Returns: `{ threads: Channel[], members: ThreadMember[], has_more?: boolean }`  
  - Thread object punya field `name` (string, 1–100 chars)

- **List archived threads (public):** `GET /channels/{channel_id}/threads/archived/public`  
  - Query: `?before=<ISO8601>&limit=100`  
  - Returns: `{ threads, members, has_more }`  
  - Untuk forum channel (#berkas-plm), threads adalah PUBLIC_THREAD

- **Create thread (forum):** `POST /channels/{channel_id}/threads`  
  - Body: `{ name, message: { content } }` (forum thread memerlukan message)  
  - Sudah dipakai di `getOrCreateThreadForPermohonan`

### 2.2 Alur getOrCreateThreadByKode

```
1. GET /channels/{channelId}/threads/active
2. Cari thread dimana thread.name === kodeKjsb (exact match, trim)
3. Jika ditemukan → return thread.id
4. Jika tidak:
   a. GET /channels/{channelId}/threads/archived/public?limit=100
   b. Cari thread dimana thread.name === kodeKjsb
   c. Jika ditemukan → return thread.id (Discord auto-unarchive saat kirim message)
5. Jika masih tidak ada:
   POST /channels/{channelId}/threads
   body: { name: kodeKjsb.slice(0,100), message: { content: `Berkas ${kodeKjsb}` } }
   return thread.id
6. Return null jika Discord tidak terkonfigurasi
```

### 2.3 Perbedaan dengan getOrCreateThreadForPermohonan

| Aspek | getOrCreateThreadForPermohonan | getOrCreateThreadByKode |
|-------|--------------------------------|--------------------------|
| Input | permohonanId | kodeKjsb |
| DB lookup | Ya (baca kode_kjsb, discord_thread_id) | Tidak |
| Update DB | Ya (simpan thread_id ke permohonan) | Tidak |
| Use case | Permohonan sudah ada | Sebelum permohonan dibuat |

---

## 3. Strategi PDF Extraction

### 3.1 Digital vs Scan

- **Digital PDF** (embedded text): gunakan **pdf-parse** — ekstrak teks langsung, cepat, gratis.
- **Scanned PDF** (gambar): pdf-parse mengembalikan teks kosong atau sangat sedikit → fallback **tesseract.js** (OCR).

### 3.2 Alur Ekstraksi

```
1. Baca PDF buffer
2. Coba pdf-parse(buffer)
3. Jika text.length >= MIN_TEXT_LENGTH (mis. 50 chars) → gunakan teks ini
4. Jika text kosong atau terlalu pendek:
   a. Konversi PDF → gambar (pdf2pic atau pdf-poppler)
   b. Untuk tiap halaman: tesseract.recognize(imageBuffer, 'ind')
   c. Gabung teks dari semua halaman
5. Parse teks dengan pattern matching → ExtractedData
```

### 3.3 Dependencies

- `pdf-parse` — ekstraksi digital
- `tesseract.js` — OCR untuk scan
- `pdf2pic` atau `pdf-to-img` — PDF → PNG untuk OCR (pilih salah satu yang stabil di Node.js)

### 3.4 Threshold

- `MIN_TEXT_LENGTH = 50` — jika pdf-parse mengembalikan teks < 50 karakter, anggap PDF scan dan fallback ke tesseract.

---

## 4. API Contract

### 4.1 Endpoint

`POST /api/upload-pdf-extract`

### 4.2 Request

- **Content-Type:** `multipart/form-data`
- **Fields:**
  - `file` (required): File PDF
  - `kodeKjsb` (required): string, format BKS-YYYY-XXXX

### 4.3 Response 200

```ts
{
  extractedData: {
    nama?: string;
    nik?: string;
    alamat?: string;
    luas_permohonan?: number;
    lokasi_tanah?: string;
    kota_kabupaten?: string;
    kecamatan?: string;
    kelurahan_desa?: string;
  };
  discordThreadId: string;
}
```

### 4.4 Response Error

- **400:** `{ error: "..." }` — validasi gagal (file kosong, bukan PDF, kodeKjsb kosong)
- **404:** `{ error: "Discord tidak terkonfigurasi." }` — DISCORD_BOT_TOKEN / DISCORD_CHANNEL_ID tidak set
- **500:** `{ error: "..." }` — ekstraksi gagal, Discord error, dll.

### 4.5 Urutan Operasi di Endpoint

1. Validasi request (file, kodeKjsb)
2. `threadId = getOrCreateThreadByKode(kodeKjsb)`
3. `sendFileToThread(threadId, buffer, filename, "Upload PDF")`
4. Ekstrak teks (pdf-parse → fallback tesseract)
5. Parse teks → extractedData
6. Return `{ extractedData, discordThreadId: threadId }`

---

## 5. Struktur extractedData

Sesuai PRD section 6:

```ts
interface ExtractedData {
  nama?: string;
  nik?: string;
  alamat?: string;
  luas_permohonan?: number;
  lokasi_tanah?: string;
  kota_kabupaten?: string;
  kecamatan?: string;
  kelurahan_desa?: string;
}
```

Semua field optional — parsing bisa gagal untuk sebagian field. User wajib review dan edit sebelum save.

---

## 6. Parsing (Pattern Matching)

- Template PDF standar → regex / string matching untuk label seperti "Nama:", "NIK:", "Alamat:", "Luas:", "Lokasi:", "Kota/Kab:", "Kecamatan:", "Kelurahan/Desa:".
- Implementasi detail di Backend; format template diserahkan ke PM/domain expert bila perlu.
- `luas_permohonan`: parse number dari teks (angka + optional "m²", "m2", koma sebagai desimal).

---

## 7. Component Boundaries

| Komponen | Lokasi | Tugas |
|----------|--------|-------|
| getOrCreateThreadByKode | lib/discord.ts | List + cari + create thread by kode |
| sendFileToThread | lib/discord.ts | Sudah ada |
| API route | app/api/upload-pdf-extract/route.ts | Validasi, Discord, ekstraksi, parsing |
| PDF extractor | lib/pdf-extract.ts (atau inline) | pdf-parse + tesseract fallback |
| Parser | lib/pdf-extract.ts atau terpisah | Pattern matching → ExtractedData |
| Form UI | TambahPermohonanForm | Upload, pre-fill, submit dengan discord_thread_id |

---

## 8. Risiko & Mitigasi

| Risiko | Mitigasi |
|--------|----------|
| Template PDF berubah | Pattern matching bisa break; dokumentasikan format template, siap iterasi |
| OCR lambat (tesseract) | Jalankan di server; beri feedback "Sedang memproses..." di UI |
| Thread archived | Discord auto-unarchive saat send message; tidak perlu unarchive API |
| Discord rate limit | Jarang; thread create + 1 message per upload; monitor jika volume tinggi |

---

## 9. Out of Scope (MVP)

- Auto-detect digital vs scan tanpa threshold
- Parsing AI/LLM
- Multi-bahasa OCR (ind cukup)
- Retry/queue untuk Discord
