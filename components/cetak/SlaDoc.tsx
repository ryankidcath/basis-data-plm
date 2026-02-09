"use client";

import type { PermohonanDetail } from "@/lib/types";
import { formatDateLong, formatNoSla, formatNumber } from "@/lib/format";
import { KopSurat } from "./KopSurat";
import { KONTAK_PERUSAHAAN } from "./constants";

interface SlaDocProps {
  detail: PermohonanDetail | null;
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  const display = value != null && value !== "" ? String(value) : "–";
  return (
    <tr>
      <td className="pr-2 text-left align-top text-sm text-navy-800 w-44">
        {label}
      </td>
      <td className="pr-1 w-4 text-sm text-navy-800 align-top">:</td>
      <td className="text-sm text-navy-800">{display}</td>
    </tr>
  );
}

export function SlaDoc({ detail }: SlaDocProps) {
  if (!detail) {
    return <p className="text-navy-600">Data belum tersedia.</p>;
  }
  const admin = detail.administrasi;
  const hasData = admin?.no_sla ?? admin?.tanggal_sla;
  if (!hasData) {
    return (
      <div>
        <KopSurat />
        <p className="text-navy-600">Data SLA untuk permohonan ini belum diisi. Isi di tab Administrasi.</p>
      </div>
    );
  }

  const keu = detail.keuangan;
  const biayaRupiah =
    keu?.biaya_pengukuran != null
      ? `Rp${formatNumber(keu.biaya_pengukuran)},-`
      : "–";

  return (
    <div className="flex flex-col">
      <div className="relative overflow-visible">
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
        <div className="relative z-10 space-y-4 leading-[1.15]">
          <KopSurat />

          <div className="flex justify-between text-sm">
            <table className="border-collapse">
              <tbody>
                <tr>
                  <td className="pr-2 text-left w-20">Nomor</td>
                  <td className="pr-1 w-4">:</td>
                  <td>{formatNoSla(admin?.no_sla, admin?.tanggal_sla)}</td>
                </tr>
                <tr>
                  <td className="pr-2 text-left">Lampiran</td>
                  <td className="pr-1">:</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td className="pr-2 text-left">Perihal</td>
                  <td className="pr-1">:</td>
                  <td className="font-bold uppercase">
                    Service Level Agreement (SLA)
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="text-right">
              <p>Cirebon, {formatDateLong(admin?.tanggal_sla)}</p>
            </div>
          </div>

          <section className="text-sm">
            <p className="font-bold text-navy-900 mb-1">Identitas KJSB</p>
            <table className="border-collapse w-full">
              <tbody>
                <Row label="KJSB" value="KJSB Benning dan Rekan" />
                <Row label="Alamat" value={KONTAK_PERUSAHAAN.alamat} />
                <Row label="Nama Pimpinan" value="Benning Hafidah Kadina, S.T." />
                <Row label="Nomor Lisensi" value="1-0088-16" />
              </tbody>
            </table>
          </section>

          <section className="text-sm">
            <p className="font-bold text-navy-900 mb-1">Identitas Pemohon</p>
            <table className="border-collapse w-full">
              <tbody>
                <Row label="Nama Pemohon" value={detail.pemohon?.nama} />
                <Row label="NIK" value={detail.pemohon?.nik} />
                <Row label="Alamat" value={detail.pemohon?.alamat} />
              </tbody>
            </table>
          </section>

          <section className="text-sm">
            <p className="font-bold text-navy-900 mb-1">Letak Tanah</p>
            <table className="border-collapse w-full">
              <tbody>
                <Row label="Alamat" value={detail.lokasi_tanah} />
                <Row label="Desa/Kelurahan" value={detail.kelurahan_desa} />
                <Row label="Kecamatan" value={detail.kecamatan} />
                <Row label="Kabupaten/Kota" value={detail.kota_kabupaten} />
              </tbody>
            </table>
          </section>

          <section className="text-sm">
            <p className="font-bold text-navy-900 mb-1">I. WAKTU</p>
            <table className="border-collapse w-full">
              <tbody>
                <Row
                  label="Waktu Pekerjaan"
                  value="7 (tujuh)–14 (empat belas) hari"
                />
              </tbody>
            </table>
          </section>

          <section className="text-sm">
            <p className="font-bold text-navy-900 mb-1">II. BIAYA</p>
            <table className="border-collapse w-full">
              <tbody>
                <Row label="Biaya Pekerjaan" value={biayaRupiah} />
              </tbody>
            </table>
          </section>

          <section className="text-sm">
            <p className="font-bold text-navy-900 mb-1">
              III. KETELITIAN HASIL AKHIR
            </p>
            <table className="border-collapse w-full">
              <tbody>
                <Row label="Ketelitian Hasil Ukur" value="0,5 m" />
              </tbody>
            </table>
          </section>

          <section className="text-sm">
            <p className="font-bold text-navy-900">IV. Catatan</p>
          </section>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-8">
        <div className="text-center">
          <p className="text-sm font-medium text-navy-900">
            KJSB Benning dan Rekan
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-navy-900">Pemohon</p>
        </div>
        {/* Ruang untuk tanda tangan (ditulis tangan di sini) */}
        <div className="h-24 flex items-end justify-center" />
        <div className="h-24 flex items-end justify-center" />
        <div className="text-center">
          <span className="text-sm border-b border-navy-800">
            Benning Hafidah Kadina, S.T.
          </span>
        </div>
        <div className="text-center">
          <span className="text-sm border-b border-navy-800">
            {detail.pemohon?.nama || ".................................."}
          </span>
        </div>
        <div className="text-center">
          <span className="text-sm text-navy-600">Pimpinan</span>
        </div>
        <div />
      </div>

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
