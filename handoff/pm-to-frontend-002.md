# Handoff: PM → Frontend Engineer

## From
Project Manager

## To
Frontend Engineer

## Context

Fitur upload PDF (pm-to-frontend-001) sudah diimplementasi dan berhasil diuji. User meminta perubahan **posisi dan label** komponen PdfUpload.

## Objective

Pindahkan komponen PdfUpload dari tab "NIB, GU, dan PBT" ke tab **Administrasi**, letakkan di **bagian paling atas** (sebelum card Permohonan / PermohonanForm). Ubah label dari "Berkas PDF (Scan)" menjadi **"Upload Berkas Permohonan"**.

## Constraints

- Komponen PdfUpload tidak berubah (props, logika, API call tetap sama)
- Hanya ubah lokasi di WorkflowForms dan label Card
- Hapus PdfUpload dari tab 5 (NIB, GU, dan PBT)

## Deliverables

1. **Pindahkan** PdfUpload dari tab 5 ke tab 1 (Administrasi)
2. **Letakkan** di bagian paling atas tab Administrasi (sebelum PermohonanForm)
3. **Ubah** title Card dari "Berkas PDF (Scan)" menjadi "Upload Berkas Permohonan"
4. **Hapus** Card "Berkas PDF (Scan)" dan PdfUpload dari tab 5

## Dependencies

- WorkflowForms.tsx
- PdfUpload component (sudah ada)

## Open Questions

- Tidak ada.

## Done When

- PdfUpload tampil di tab Administrasi, di bagian paling atas (sebelum card Permohonan)
- Label Card = "Upload Berkas Permohonan"
- PdfUpload tidak lagi ada di tab NIB, GU, dan PBT
