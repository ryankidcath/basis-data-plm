# Handoff: PM → Frontend Engineer

## From
Project Manager

## To
Frontend Engineer

## Context

Field masih kosong setelah upload. Backend akan return `_debug` (rawTextPreview) saat `?debug=1` (pm-to-backend-007). Frontend perlu: (1) panggil API dengan debug param saat user aktifkan debug, (2) tampilkan debug info agar user bisa copy rawText dan share.

## Objective

1. **URL dengan debug** — Saat upload PDF, jika ada cara aktivasi debug (mis. checkbox "Debug ekstraksi" atau env), panggil `POST /api/upload-pdf-extract?debug=1` (bukan tanpa query).
2. **Tampilkan debug info** — Jika response punya `_debug`, tampilkan di UI (collapsible/expandable): rawTextPreview, extractedData. User bisa copy untuk share ke Backend.
3. **Cara aktivasi** — Bisa: checkbox "Debug mode" di atas area upload, atau selalu pakai ?debug=1 di development (NEXT_PUBLIC_DEBUG_PDF=1). PM rekomendasi: checkbox "Tampilkan debug ekstraksi" agar user bisa toggle tanpa rebuild.

## Constraints

- Jangan mengubah flow normal (tanpa debug)
- Debug info hanya tampil bila response punya `_debug`

## Deliverables

1. **Checkbox** — "Debug ekstraksi" di area Upload PDF & Isi Otomatis. Saat dicentang, panggil API dengan `?debug=1`.
2. **Response handling** — Jika `data._debug` ada, simpan dan tampilkan.
3. **UI debug** — Section expandable: "Debug: rawText (preview): ..." dan "extractedData: ..." dengan tombol Copy atau textarea bisa di-select.

## Dependencies

- TambahPermohonanForm — handlePdfUpload
- Backend (pm-to-backend-007): response dengan _debug

## Open Questions

- Tidak ada.

## Done When

- User centang "Debug ekstraksi" → upload PDF → lihat rawTextPreview di UI
- User bisa copy rawTextPreview dan kirim ke Backend untuk analisis
