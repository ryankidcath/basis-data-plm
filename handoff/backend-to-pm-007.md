# Handoff: Backend Engineer → Project Manager

## From
Backend Engineer

## To
Project Manager

## Context

Handoff pm-to-backend-007 (rawText dalam response agar user bisa lihat tanpa akses server) telah selesai.

## Objective

Lapor penyelesaian. Response API saat debug berisi `_debug.rawTextPreview` untuk copy/share.

## Result

### 1. Response saat debug
Bila `debug=1` (query param) atau `DEBUG_PDF_EXTRACT=1` (env), response berisi:
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

### 2. rawTextPreview
- 1200 karakter pertama rawText (cukup untuk lihat format OCR)
- User bisa copy dari Network tab (Response) atau UI

### 3. Console log
- Tetap log ke server console untuk yang punya akses

## Constraints

- `_debug` hanya muncul saat debugMode (env atau ?debug=1)
- Production: jika DEBUG_PDF_EXTRACT tidak set, ?debug=1 dari client tetap aktif (bisa diubah nanti jika perlu lock down)

## Deliverables

- [x] Field `_debug` di response saat debug
- [x] rawTextPreview 1200 char
- [x] Tetap log ke console

## Done When

- [x] API return _debug saat ?debug=1
- [ ] Frontend update URL: `fetch("/api/upload-pdf-extract?debug=1", ...)` saat user ingin debug (atau toggle)
- [ ] User bisa copy rawTextPreview dari Network tab dan share ke Backend
