"use client";

import type { PermohonanDetail } from "@/lib/types";
import { formatDate, formatNumber } from "@/lib/format";
import { KopSurat } from "./KopSurat";

interface KwitansiDocProps {
  detail: PermohonanDetail | null;
}

export function KwitansiDoc({ detail }: KwitansiDocProps) {
  if (!detail) {
    return <p className="text-navy-600">Data belum tersedia.</p>;
  }
  const keu = detail.keuangan;
  const hasData = keu?.no_kwitansi ?? keu?.tanggal_kwitansi;
  if (!hasData) {
    return (
      <div>
        <KopSurat />
        <p className="text-navy-600">Data kwitansi untuk permohonan ini belum diisi. Isi di tab Keuangan.</p>
      </div>
    );
  }

  const amount = keu?.biaya_pengukuran ?? 0;

  return (
    <div className="space-y-4">
      <KopSurat />
      <h2 className="text-center text-base font-semibold uppercase tracking-wide text-navy-900">
        Kwitansi
      </h2>
      <div className="flex justify-between text-sm">
        <span>No. {keu?.no_kwitansi || "–"}</span>
        <span>Tanggal: {formatDate(keu?.tanggal_kwitansi)}</span>
      </div>
      <div className="text-sm text-navy-800 space-y-2">
        <p>Telah terima dari: <strong>{detail.pemohon?.nama || "–"}</strong></p>
        <p>Uang sejumlah: <strong>Rp {formatNumber(amount)}</strong></p>
        <p>Terbilang: (sesuai kebijakan perusahaan)</p>
        <p>Untuk pembayaran: Jasa pengukuran tanah / PLM – Kode KJSB {detail.kode_kjsb}</p>
      </div>
      <div className="mt-8 flex justify-end">
        <div className="text-center">
          <div className="h-16" />
          <p className="text-sm font-medium text-navy-900">Yang menerima,</p>
        </div>
      </div>
    </div>
  );
}
