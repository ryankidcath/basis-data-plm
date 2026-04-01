# Handoff: PM → Frontend Engineer

## From
Project Manager

## To
Frontend Engineer

## Context

User feedback: Urutan link di navbar tidak konsisten antar halaman:
- **Halaman Dashboard** (`/dashboard/status`): Dashboard, Peta, Ekspor data, Keluar ✓
- **Halaman Peta** (`/dashboard`): Peta, Dashboard, Ekspor data, Keluar ✗

User ingin urutan **sama** di kedua halaman.

## Objective

Samakan urutan link navbar di kedua halaman menjadi: **Dashboard, Peta, Ekspor data, Keluar**

## Constraints

- Hanya urutan elemen navbar — tidak ubah styling, routing, atau logika
- Tetap: link aktif pakai Indigo, link lain slate

## Deliverables

- **Halaman Peta** (`/dashboard`): Ubah urutan link dari "Peta, Dashboard, ..." menjadi **"Dashboard, Peta, Ekspor data, Keluar"**
- **Halaman Dashboard Status** (`/dashboard/status`): Pastikan urutan sudah **"Dashboard, Peta, Ekspor data, Keluar"** (bila belum, perbaiki)

## Dependencies

- `app/dashboard/page.tsx` — navbar halaman Peta
- `app/dashboard/status/page.tsx` — navbar halaman Dashboard Status

## Done When

- Kedua halaman menampilkan navbar dengan urutan: Dashboard, Peta, Ekspor data, Keluar
- Build PASS
