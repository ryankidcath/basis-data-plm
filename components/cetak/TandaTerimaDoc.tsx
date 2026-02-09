"use client";

import type { PermohonanDetail } from "@/lib/types";
import { formatDateLong, formatDateWithDay, formatNoTandaTerima } from "@/lib/format";
import { KopSurat } from "./KopSurat";
import { TANDA_TERIMA_BERKAS, KONTAK_PERUSAHAAN } from "./constants";

interface TandaTerimaDocProps {
  detail: PermohonanDetail | null;
}

export function TandaTerimaDoc({ detail }: TandaTerimaDocProps) {
  if (!detail) {
    return <p className="text-navy-600">Data belum tersedia.</p>;
  }
  const admin = detail.administrasi;
  const hasData = admin?.no_tanda_terima ?? admin?.tanggal_tanda_terima;
  if (!hasData) {
    return (
      <div>
        <KopSurat />
        <p className="text-navy-600">Data tanda terima untuk permohonan ini belum diisi. Isi di tab Administrasi.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Wrapper: logo sampai ke atas (kop) dan ujung kiri kertas, tanpa batas clipping */}
      <div className="relative overflow-visible">
        {/* Lapisan logo: diperbesar, titik tengah-atas tetap (scale dari atas-tengah) */}
        <div
          className="absolute z-0 w-[600px] h-[600px] opacity-25 pointer-events-none"
          style={{ top: "-24px", left: "-380px" }}
        >
          <img
            src="/logo.png"
            alt=""
            className="w-full h-full object-contain"
            width={600}
            height={600}
          />
        </div>
        {/* Konten di atas logo: kop + isi */}
        <div className="relative z-10 space-y-4 leading-[1.15]">
          <KopSurat />
          {/* A. Blok informasi dokumen */}
          <div className="flex justify-between text-sm">
            <table className="border-collapse">
              <tbody>
                <tr>
                  <td className="pr-2 text-left w-20">Nomor</td>
                  <td className="pr-1 w-4">:</td>
                  <td>{formatNoTandaTerima(admin?.no_tanda_terima, admin?.tanggal_tanda_terima)}</td>
                </tr>
                <tr>
                  <td className="pr-2 text-left">Lampiran</td>
                  <td className="pr-1">:</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td className="pr-2 text-left">Perihal</td>
                  <td className="pr-1">:</td>
                  <td className="font-bold uppercase">Tanda Terima</td>
                </tr>
              </tbody>
            </table>
            <div className="text-right">
              <p>Cirebon, {formatDateLong(admin?.tanggal_tanda_terima)}</p>
            </div>
          </div>

          {/* B. Paragraf pembuka */}
          <p className="text-sm text-navy-800 text-justify">
            Pada hari ini, {formatDateWithDay(admin?.tanggal_tanda_terima)}, telah diterima sejumlah berkas/dokumen dengan perincian sebagai berikut:
          </p>

          {/* C. Tabel berkas/dokumen */}
          <table className="w-full text-sm border border-navy-300">
            <thead>
              <tr>
                <th className="border border-navy-300 px-2 py-2 text-center w-12">No.</th>
                <th className="border border-navy-300 px-2 py-2 text-left">Berkas/Dokumen</th>
                <th className="border border-navy-300 px-2 py-2 text-center w-24">Jumlah</th>
                <th className="border border-navy-300 px-2 py-2 text-left">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {TANDA_TERIMA_BERKAS.map((berkas, i) => (
                <tr key={i}>
                  <td className="border border-navy-300 px-2 py-2 text-center">{i + 1}</td>
                  <td className="border border-navy-300 px-2 py-2">{berkas}</td>
                  <td className="border border-navy-300 px-2 py-2 text-center" />
                  <td className="border border-navy-300 px-2 py-2" />
                </tr>
              ))}
            </tbody>
          </table>

          {/* D. Paragraf penutup */}
          <p className="text-sm text-navy-800 text-justify">
            Demikian Tanda Terima ini dibuat berdasarkan keadaan yang sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
          </p>
        </div>
      </div>

      {/* E. Bagian tanda tangan */}
      <div className="flex justify-between gap-8 mt-8">
        <div className="flex-1 text-center">
          <p className="text-sm font-medium text-navy-900">Yang menerima,</p>
          <div className="h-32 flex items-end justify-center">
            <span className="text-sm text-navy-500">(..................................)</span>
          </div>
        </div>
        <div className="flex-1 text-center">
          <p className="text-sm font-medium text-navy-900">Yang menyerahkan,</p>
          <div className="h-32 flex items-end justify-center">
            <span className="text-sm text-navy-500">(..................................)</span>
          </div>
        </div>
      </div>

      {/* F. Footer: garis merah + kontak */}
      <div className="mt-6 print:mt-6">
        <div className="flex">
          <div className="flex-[0.35]" />
          <div className="flex-[0.65] border-t border-red-600/80 pt-2" />
        </div>
        <div className="text-right text-[10pt] text-navy-600 space-y-0.5 font-agency pt-1 leading-none">
          <p>{KONTAK_PERUSAHAAN.telepon}</p>
          <p>{KONTAK_PERUSAHAAN.alamat}</p>
          <p>{KONTAK_PERUSAHAAN.email}</p>
        </div>
      </div>
    </div>
  );
}
