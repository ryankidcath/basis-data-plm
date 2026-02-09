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
    <div className="flex text-sm">
      <span className="w-40 shrink-0 text-navy-700">
        {label}
      </span>
      <span
        className={
          underline
            ? "min-w-0 flex-1 border-b border-navy-800 border-dotted"
            : "min-w-0 flex-1"
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
      <div className="grid grid-cols-[auto_1fr_auto] items-start gap-6">
        <img
          src="/logo.png"
          alt=""
          className="h-24 w-auto object-contain"
          width={200}
          height={96}
        />
        <div className="text-sm">
          <p className="font-semibold text-navy-900">
            {INVOICE_INFO_PERUSAHAAN.nama}
          </p>
          <p className="mt-0.5 text-navy-700">
            {INVOICE_INFO_PERUSAHAAN.alamat}
          </p>
        </div>
        <div className="flex flex-col items-end text-right">
          <h2 className="text-lg font-bold uppercase tracking-wide text-navy-900">
            Kwitansi
          </h2>
          {hasData && (
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex gap-2 justify-end">
                <span className="text-navy-700">No. Kwitansi</span>
                <span className="min-w-[140px] border-b border-navy-400 border-dotted">
                  {keu?.no_kwitansi || "–"}
                </span>
              </div>
              <div className="flex gap-2 justify-end">
                <span className="text-navy-700">No. Invoice</span>
                <span className="min-w-[140px] border-b border-navy-400 border-dotted">
                  {keu?.no_invoice || "–"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {!hasData ? (
        <p className="text-sm text-navy-600">
          Data kwitansi untuk permohonan ini belum diisi. Isi di tab Keuangan.
        </p>
      ) : (
        <>

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
            <div className="flex flex-col items-end">
              <div className="w-52 text-center text-sm">
                <p className="text-navy-800">
                  {formatDateLong(keu?.tanggal_kwitansi)}
                </p>
                <p className="mt-16 font-semibold text-navy-900">
                  {INVOICE_INFO_PERUSAHAAN.nama}
                </p>
                <div className="mt-16">
                  <span className="inline-block min-w-[120px] border-b border-navy-800 border-dotted">
                    {INVOICE_PETUGAS_LOKET_NAMA}
                  </span>
                </div>
                <p className="mt-1 text-navy-700">Petugas Loket</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
