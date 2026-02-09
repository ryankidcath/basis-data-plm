"use client";

import type { PermohonanDetail } from "@/lib/types";
import type { JenisLisensi } from "@/lib/types";
import { formatDate, formatDateLong, formatNoSuratTugas, formatLuasM2 } from "@/lib/format";
import { KopSurat } from "./KopSurat";
import { KONTAK_PERUSAHAAN } from "./constants";

const JABATAN_LABELS: Record<JenisLisensi, string> = {
  "surveyor kadaster": "Surveyor Kadaster",
  "asisten surveyor kadaster": "Asisten Surveyor Kadaster",
};

interface SuratTugasDocProps {
  detail: PermohonanDetail | null;
}

export function SuratTugasDoc({ detail }: SuratTugasDocProps) {
  if (!detail) {
    return <p className="text-navy-600">Data belum tersedia.</p>;
  }
  const stp = detail.surat_tugas_pemberitahuan;
  const hasData = stp?.no_surat_tugas ?? stp?.tanggal_surat_tugas;
  if (!hasData) {
    return (
      <div>
        <KopSurat />
        <p className="text-navy-600">Data surat tugas untuk permohonan ini belum diisi. Isi di tab Surat Tugas.</p>
      </div>
    );
  }

  const pengukuran = detail.pengukuran ?? [];
  const firstDate = pengukuran.length > 0 ? pengukuran[0].tanggal_pengukuran : null;
  const lastDate = pengukuran.length > 0 ? pengukuran[pengukuran.length - 1].tanggal_pengukuran : null;

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
                  <td>{formatNoSuratTugas(stp?.no_surat_tugas, stp?.tanggal_surat_tugas)}</td>
                </tr>
                <tr>
                  <td className="pr-2 text-left">Lampiran</td>
                  <td className="pr-1">:</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td className="pr-2 text-left">Perihal</td>
                  <td className="pr-1">:</td>
                  <td className="font-bold">SURAT TUGAS PENGUKURAN</td>
                </tr>
              </tbody>
            </table>
            <div className="text-right">
              <p>Cirebon, {formatDateLong(stp?.tanggal_surat_tugas)}</p>
            </div>
          </div>

          <p className="text-sm text-navy-800">
            Dengan ini Pimpinan Kantor Jasa Surveyor Berlisensi Benning dan Rekan menugaskan kepada:
          </p>

          <section className="text-sm">
            <p className="font-bold text-navy-900 mb-1">1. Petugas Ukur & Uraian Tugas</p>
            <p className="text-navy-800 mb-1">a. Petugas Ukur:</p>
            <table className="w-full border border-navy-300 mb-2">
              <thead>
                <tr>
                  <th className="border border-navy-300 px-2 py-1.5 text-center w-12">No.</th>
                  <th className="border border-navy-300 px-2 py-1.5 text-left">Nama</th>
                  <th className="border border-navy-300 px-2 py-1.5 text-left">Nomor Lisensi</th>
                  <th className="border border-navy-300 px-2 py-1.5 text-left">Jabatan</th>
                </tr>
              </thead>
              <tbody>
                {pengukuran.length > 0 ? (
                  pengukuran.map((p, i) => (
                    <tr key={p.id}>
                      <td className="border border-navy-300 px-2 py-1.5 text-center">{i + 1}</td>
                      <td className="border border-navy-300 px-2 py-1.5">{p.surveyor?.nama ?? "–"}</td>
                      <td className="border border-navy-300 px-2 py-1.5">{p.surveyor?.no_lisensi ?? "–"}</td>
                      <td className="border border-navy-300 px-2 py-1.5">
                        {p.surveyor?.jenis_lisensi ? JABATAN_LABELS[p.surveyor.jenis_lisensi] : "–"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border border-navy-300 px-2 py-1.5 text-center">1</td>
                    <td className="border border-navy-300 px-2 py-1.5">–</td>
                    <td className="border border-navy-300 px-2 py-1.5">–</td>
                    <td className="border border-navy-300 px-2 py-1.5">–</td>
                  </tr>
                )}
              </tbody>
            </table>
            <p className="text-navy-800">b. Dengan tugas: Melaksanakan Pengukuran Pendaftaran Tanah Pertama Kali.</p>
          </section>

          <section className="text-sm">
            <p className="font-bold text-navy-900 mb-1">2. Lokasi dan Volume Kegiatan</p>
            <table className="border-collapse">
              <tbody>
                <tr>
                  <td className="pr-2 text-navy-800 w-40">a. Kelurahan/Desa</td>
                  <td className="pr-1 w-4">:</td>
                  <td>{detail.kelurahan_desa || "–"}</td>
                </tr>
                <tr>
                  <td className="pr-2 text-navy-800">b. Kecamatan</td>
                  <td className="pr-1">:</td>
                  <td>{detail.kecamatan || "–"}</td>
                </tr>
                <tr>
                  <td className="pr-2 text-navy-800">c. Volume</td>
                  <td className="pr-1">:</td>
                  <td>{formatLuasM2(detail.luas_permohonan)}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="text-sm">
            <p className="font-bold text-navy-900 mb-1">3. Waktu</p>
            <table className="border-collapse">
              <tbody>
                <tr>
                  <td className="pr-2 text-navy-800 w-40">a. Mulai Tanggal</td>
                  <td className="pr-1 w-4">:</td>
                  <td>{firstDate ? formatDate(firstDate) : "–"}</td>
                </tr>
                <tr>
                  <td className="pr-2 text-navy-800">b. Sampai Tanggal</td>
                  <td className="pr-1">:</td>
                  <td>{lastDate ? formatDate(lastDate) : "–"}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="text-sm">
            <p className="font-bold text-navy-900 mb-1">4. Hasil Pelaksanaan Tugas supaya dilaporkan</p>
          </section>

          <p className="text-sm text-navy-800">
            Demikian Surat Tugas ini dibuat untuk dilaksanakan dengan penuh tanggung jawab dan dipergunakan sebagaimana mestinya.
          </p>

          <div className="text-sm text-navy-800 space-y-1">
            <p>Bahwa benar Petugas Ukur datang ke lokasi</p>
            <p>Pada tanggal: ___________</p>
            <p className="text-center font-medium text-navy-900 mt-2">Mengetahui</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-8">
        <div className="text-center">
          <p className="text-sm font-medium text-navy-900">Pemohon</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-navy-900">KJSB Benning dan Rekan</p>
        </div>
        <div className="h-24 flex items-end justify-center" />
        <div className="h-24 flex items-end justify-center" />
        <div className="text-center">
          <span className="text-sm border-b border-navy-800">
            {detail.pemohon?.nama || ".................................."}
          </span>
        </div>
        <div className="text-center">
          <span className="text-sm border-b border-navy-800">
            Benning Hafidah Kadina, S.T.
          </span>
        </div>
        <div className="text-center">
          <span className="text-sm text-navy-600">Pemohon</span>
        </div>
        <div className="text-center">
          <span className="text-sm text-navy-600">Pimpinan</span>
        </div>
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
