"use client";

import type { PermohonanDetail } from "@/lib/types";
import { formatDateShort, formatNumber } from "@/lib/format";
import { PENGGUNAAN_TANAH_1_LABELS } from "@/lib/format";
import {
  INVOICE_INFO_PERUSAHAAN,
  INVOICE_KETERANGAN_PEMBAYARAN,
  INVOICE_PETUGAS_LOKET_NAMA,
} from "./constants";

const BIAYA_SPASIAL_PER_BERKAS = 100_000;

interface InvoiceDocProps {
  detail: PermohonanDetail | null;
}

export function InvoiceDoc({ detail }: InvoiceDocProps) {
  if (!detail) {
    return <p className="text-navy-600">Data belum tersedia.</p>;
  }

  const keu = detail.keuangan;
  const infoSpasial = detail.informasi_spasial;
  const hasData = keu?.no_invoice ?? keu?.tanggal_invoice;

  const tagihanNama = detail.klien?.nama ?? detail.pemohon?.nama ?? "–";
  const penggunaanLabel = detail.penggunaan_tanah_1
    ? PENGGUNAAN_TANAH_1_LABELS[detail.penggunaan_tanah_1] ?? detail.penggunaan_tanah_1
    : "–";

  const showSpasial = !!infoSpasial;
  const totalInput = keu?.biaya_pengukuran ?? 0;
  const barisSpasial = showSpasial
    ? { produk: "Informasi Data Spasial Pertanahan", jenis: "–", volume: "1 Berkas", jumlah: BIAYA_SPASIAL_PER_BERKAS }
    : null;
  const barisPengukuran =
    keu != null
      ? {
          produk: "Pengukuran Kadastral dan Pembuatan Peta Bidang Tanah",
          jenis: penggunaanLabel,
          volume: `${detail.luas_permohonan ?? 0} m²`,
          jumlah: showSpasial ? Math.max(0, totalInput - BIAYA_SPASIAL_PER_BERKAS) : totalInput,
        }
      : null;

  const total = totalInput;
  const barisList = [barisSpasial, barisPengukuran].filter(Boolean) as {
    produk: string;
    jenis: string;
    volume: string;
    jumlah: number;
  }[];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-6">
        <div className="flex shrink-0 justify-start">
          <img
            src="/logo.png"
            alt=""
            className="h-24 w-auto object-contain object-left-bottom"
            width={200}
            height={96}
          />
        </div>
        <div className="text-right">
          <h2 className="text-lg font-bold uppercase tracking-wide text-navy-900">
            Invoice
          </h2>
          {hasData ? (
            <>
              <p className="mt-2 text-sm text-navy-800">
                <span className="text-navy-600">Nomor</span>{" "}
                {keu?.no_invoice || "–"}
              </p>
              <p className="mt-0.5 text-sm text-navy-800">
                <span className="text-navy-600">Tanggal</span>{" "}
                {formatDateShort(keu?.tanggal_invoice)}
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-navy-600">
              Data invoice belum diisi.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="max-w-[38%] shrink-0 text-left text-sm">
          <p className="text-xs font-semibold uppercase text-navy-600">
            Info Perusahaan
          </p>
          <p className="mt-0.5 font-semibold text-navy-900">
            {INVOICE_INFO_PERUSAHAAN.nama}
          </p>
          <p className="mt-0.5 text-navy-700">
            {INVOICE_INFO_PERUSAHAAN.alamat}
          </p>
        </div>
        <div className="min-w-0 flex-1 text-right text-sm">
          <p className="text-xs font-semibold uppercase text-navy-600">
            Tagihan Untuk
          </p>
          <p className="mt-0.5 font-medium text-navy-900">{tagihanNama}</p>
        </div>
      </div>

      {!hasData ? (
        <p className="text-sm text-navy-600">
          Data invoice untuk permohonan ini belum diisi. Isi di tab Keuangan.
        </p>
      ) : (
        <>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr
                className="bg-[#A51A25] text-white print:bg-[#A51A25]"
                style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" } as React.CSSProperties}
              >
                <th className="border border-[#8B1620] px-2 py-2 text-left font-medium">
                  Produk
                </th>
                <th className="border border-[#8B1620] px-2 py-2 text-left font-medium">
                  Jenis Properti
                </th>
                <th className="border border-[#8B1620] px-2 py-2 text-left font-medium">
                  Volume
                </th>
                <th className="border border-[#8B1620] px-2 py-2 text-right font-medium">
                  Harga Satuan
                </th>
                <th className="border border-[#8B1620] px-2 py-2 text-right font-medium">
                  Jumlah Harga
                </th>
              </tr>
            </thead>
            <tbody>
              {barisList.map((baris, idx) => (
                <tr key={idx} className="text-navy-800">
                  <td className="border border-navy-300 px-2 py-2">
                    {baris.produk}
                  </td>
                  <td className="border border-navy-300 px-2 py-2">
                    {baris.jenis}
                  </td>
                  <td className="border border-navy-300 px-2 py-2">
                    {baris.volume}
                  </td>
                  <td className="border border-navy-300 px-2 py-2 text-right">
                    {formatNumber(baris.jumlah)}
                  </td>
                  <td className="border border-navy-300 px-2 py-2 text-right">
                    {formatNumber(baris.jumlah)}
                  </td>
                </tr>
              ))}
              <tr className="font-medium text-navy-900">
                <td
                  className="border border-navy-300 px-2 py-2"
                  colSpan={3}
                />
                <td className="border border-navy-300 px-2 py-2 text-right">
                  Total
                </td>
                <td className="border border-navy-300 px-2 py-2 text-right">
                  {formatNumber(total)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase text-navy-600">
              Keterangan
            </p>
            <p className="mt-0.5 text-sm text-navy-800">
              {INVOICE_KETERANGAN_PEMBAYARAN}
            </p>
          </div>
        </>
      )}

      <div className="mt-10 flex justify-end">
        <div className="text-center">
          <p className="text-sm font-medium text-navy-800">
            Petugas Loket
          </p>
          <div className="mt-12 h-0 w-40 border-b border-navy-800" />
          <p className="mt-1 text-sm text-navy-900">
            {INVOICE_PETUGAS_LOKET_NAMA}
          </p>
        </div>
      </div>
    </div>
  );
}
