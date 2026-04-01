# Handoff: PM → QA Engineer

## From
Project Manager

## To
QA Engineer

## Context

Bug **"Unexpected token '<', "<!DOCTYPE "... is not valid JSON"** pada fitur "Upload PDF & Isi Otomatis" telah diperbaiki. Backend (pm-to-backend-003) dan Frontend (pm-to-frontend-004) selesai diimplementasi. Perlu validasi QA.

## Objective

Validasi bahwa fitur Upload PDF & Isi Otomatis berjalan tanpa error "Unexpected token" dan error handling berfungsi dengan benar.

## Constraints

- Tetap dalam scope bug fix
- Gunakan fitur yang sudah ada (Tambah Permohonan Baru, tab Input Data)

## Deliverables

**Validasi:**

1. **Happy path** — Kode KJSB diisi → upload PDF valid → tidak ada error "Unexpected token"; extractedData terisi atau kosong; discordThreadId return; PDF di Discord
2. **Error handling** — Jika server mengembalikan HTML (simulasi sulit; bisa skip atau cek manual), frontend tampilkan pesan user-friendly, bukan "Unexpected token..."
3. **Regression** — Flow Tambah Permohonan tanpa PDF (manual input) tetap berfungsi
4. **File size** — PDF kecil (<1MB) dan sedang (1–5MB) bila ada: upload berhasil

## Dependencies

- Backend: pm-to-backend-003 (selesai)
- Frontend: pm-to-frontend-004 (selesai)
- TambahPermohonanForm — "Upload PDF & Isi Otomatis"

## Open Questions

- Tidak ada.

## Done When

- Upload PDF berhasil tanpa error "Unexpected token"
- Error handling menampilkan pesan informatif jika ada
- Regression: flow manual tidak terpengaruh
