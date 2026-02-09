"use client";

import type { PermohonanDetail } from "@/lib/types";
import { formatDate, formatNumber } from "@/lib/format";
import { KopSurat } from "./KopSurat";

interface InvoiceDocProps {
  detail: PermohonanDetail | null;
}

export function InvoiceDoc({ detail }: InvoiceDocProps) {
  if (!detail) {
    return <p className="text-navy-600">Data belum tersedia.</p>;
  }
  const keu = detail.keuangan;
  const hasData = keu?.no_invoice ?? keu?.tanggal_invoice;
  if (!hasData) {
    return (
      <div>
        <KopSurat />
        <p className="text-navy-600">Data invoice untuk permohonan ini belum diisi. Isi di tab Keuangan.</p>
      </div>
    );
  }

  const amount = keu?.biaya_pengukuran ?? 0;

  return (
    <div className="space-y-4">
      <KopSurat />
      <h2 className="text-center text-base font-semibold uppercase tracking-wide text-navy-900">
        Invoice
      </h2>
      <div className="flex justify-between text-sm">
        <span>No. {keu?.no_invoice || "–"}</span>
        <span>Tanggal: {formatDate(keu?.tanggal_invoice)}</span>
      </div>
      <div className="text-sm text-navy-800">
        <p className="mb-2">Kepada: {detail.pemohon?.nama || "–"}</p>
        {detail.klien && <p className="mb-2">Klien: {detail.klien.nama}</p>}
        <p className="mb-2">Kode KJSB: {detail.kode_kjsb}</p>
      </div>
      <table className="w-full text-sm border border-navy-300">
        <thead>
          <tr className="bg-navy-100">
            <th className="border border-navy-300 px-2 py-2 text-left">No</th>
            <th className="border border-navy-300 px-2 py-2 text-left">Uraian</th>
            <th className="border border-navy-300 px-2 py-2 text-right">Jumlah (Rp)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-navy-300 px-2 py-2">1</td>
            <td className="border border-navy-300 px-2 py-2">Jasa pengukuran tanah / PLM</td>
            <td className="border border-navy-300 px-2 py-2 text-right">{formatNumber(amount)}</td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-end text-sm font-medium">
        Total: Rp {formatNumber(amount)}
      </div>
      <div className="mt-8 flex justify-end">
        <div className="text-center">
          <div className="h-16" />
          <p className="text-sm font-medium text-navy-900">KJSB Benning dan Rekan</p>
        </div>
      </div>
    </div>
  );
}
