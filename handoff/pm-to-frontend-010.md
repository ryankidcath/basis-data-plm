# Handoff: PM → Frontend Engineer

## From
Project Manager

## To
Frontend Engineer

## Context

User feedback: Tulisan judul tabel di DetailPanel (Permohonan, Pemohon, Status, Tanggal, Luas, dll.) terlihat sama dengan tulisan datanya. User ingin label/judul tabel terlihat lebih jelas — diperbesar, dipertebal, atau dibedakan dengan cara lain.

**File:** `project/basis-data-plm/components/panel/DetailPanel.tsx`

**Catatan:** PM sempat mengedit langsung (seharusnya handoff dulu). Frontend: validasi hasil saat ini dan sesuaikan bila perlu agar sesuai keinginan user.

## Objective

Buat label/judul tabel (Permohonan, Pemohon, Status, Tanggal, Luas, Penggunaan, dll.) terlihat lebih jelas dan berbeda dari tulisan data values. Hierarki visual harus jelas: label ≠ value.

## Constraints

- Next.js 14, TypeScript, Tailwind CSS
- Jangan ubah struktur data atau logika — hanya styling `labelClass` (dan `valueClass` bila perlu kontras)

## Deliverables

- Label (dt, h3 section header): lebih besar dan/atau lebih tebal dan/atau warna lebih gelap daripada value
- Value (dd): tetap readable, tapi jelas lebih "ringan" daripada label
- Contoh: label `text-xs font-extrabold text-slate-600`, value `text-sm font-medium text-slate-800` — atau kombinasi lain yang mencapai kontras jelas

## Dependencies

- DetailPanel.tsx existing
- Tailwind (slate, text sizing)

## Done When

- Label judul tabel (Permohonan, Pemohon, Status, Tanggal, dll.) terlihat lebih jelas daripada data values
- User bisa membedakan label dan data dengan mudah
- Build PASS
