"use client";

import type { PermohonanDetail } from "@/lib/types";
import { formatDateLong, formatNumber, terbilang } from "@/lib/format";
import {
  INVOICE_INFO_PERUSAHAAN,
  INVOICE_PETUGAS_LOKET_NAMA,
  KWITANSI_UNTUK_PEMBAYARAN,
} from "./constants";

interface KwitansiDocProps {
  detail: PermohonanDetail | null;
}

function LabelValueRow({
  label,
  value,
  underline = false,
}: {
  label: string;
  value: string;
  underline?: boolean;
}) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="shrink-0 text-navy-700">{label}</span>
      <span
        className={
          underline
            ? "min-w-[200px] flex-1 border-b border-navy-800 border-dotted"
            : "flex-1"
        }
      >
        {value}
      </span>
    </div>
  );
}

export function KwitansiDoc({ detail }: KwitansiDocProps) {
  if (!detail) {
    return <p className="text-navy-600">Data belum tersedia.</p>;
  }

  const keu = detail.keuangan;
  const hasData = keu?.no_kwitansi ?? keu?.tanggal_kwitansi;
  const tagihanNama = detail.klien?.nama ?? detail.pemohon?.nama ?? "–";
  const amount = keu?.biaya_pengukuran ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-6">
        <div className="flex shrink-0 flex-col">
          <img
            src="/logo.png"
            alt=""
            className="h-24 w-auto object-contain object-left-bottom"
            width={200}
            height={96}
          />
          <p className="mt-2 text-xs font-semibold uppercase text-navy-600">
            Info Perusahaan
          </p>
          <p className="mt-0.5 text-sm font-semibold text-navy-900">
            {INVOICE_INFO_PERUSAHAAN.nama}
          </p>
          <p className="mt-0.5 text-sm text-navy-700">
            {INVOICE_INFO_PERUSAHAAN.alamat}
          </p>
        </div>
        <h2 className="text-lg font-bold uppercase tracking-wide text-navy-900">
          Kwitansi
        </h2>
      </div>

      {!hasData ? (
        <p className="text-sm text-navy-600">
          Data kwitansi untuk permohonan ini belum diisi. Isi di tab Keuangan.
        </p>
      ) : (
        <>
          <div className="space-y-1 text-sm">
            <div className="flex gap-2">
              <span className="w-24 shrink-0 text-navy-700">No. Kwitansi</span>
              <span className="min-w-[180px] flex-1 border-b border-navy-400 border-dotted">
                {keu?.no_kwitansi || "–"}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="w-24 shrink-0 text-navy-700">No. Invoice</span>
              <span className="min-w-[180px] flex-1 border-b border-navy-400 border-dotted">
                {keu?.no_invoice || "–"}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <LabelValueRow
              label="Sudah terima dari"
              value={tagihanNama}
              underline
            />
            <LabelValueRow
              label="Banyaknya"
              value={terbilang(amount)}
              underline
            />
            <LabelValueRow
              label="Untuk pembayaran"
              value={KWITANSI_UNTUK_PEMBAYARAN}
              underline
            />
          </div>

          <div className="flex items-stretch justify-between gap-8 pt-4">
            <div className="flex flex-col">
              <p className="text-sm font-bold text-navy-900">Jumlah</p>
              <div className="mt-2 min-w-[140px] border-b border-navy-800" />
              <p className="mt-1 text-sm font-semibold text-navy-900">
                Rp{formatNumber(amount)}
              </p>
            </div>
            <div className="text-right text-sm">
              <p className="text-navy-800">
                {formatDateLong(keu?.tanggal_kwitansi)}
              </p>
              <p className="mt-4 font-semibold text-navy-900">
                {INVOICE_INFO_PERUSAHAAN.nama}
              </p>
              <div className="mt-8">
                <span className="inline-block min-w-[120px] border-b border-navy-800 border-dotted">
                  {INVOICE_PETUGAS_LOKET_NAMA}
                </span>
              </div>
              <p className="mt-1 text-navy-700">Petugas Loket</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
