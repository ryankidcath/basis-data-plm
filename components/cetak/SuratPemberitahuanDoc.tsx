"use client";

import type { PermohonanDetail } from "@/lib/types";
import { formatDateLong, formatNoSuratPemberitahuan } from "@/lib/format";
import { KopSurat } from "./KopSurat";
import { KONTAK_PERUSAHAAN } from "./constants";

interface SuratPemberitahuanDocProps {
  detail: PermohonanDetail | null;
}

const DAFTAR_PERSYARATAN = [
  "Hadir pada waktunya di lokasi yang dimohon untuk keperluan pengukuran.",
  "Menghadirkan para pemilik tanah yang berbatasan (tetangga) untuk keperluan penegasan batas.",
  "Penandatanganan persetujuan dari pemilik tanah yang berbatasan apabila tidak dapat hadir.",
  "Untuk memberitahukan kepada apparat desa/kelurahan setempat guna keperluan pengukuran.",
] as const;

export function SuratPemberitahuanDoc({ detail }: SuratPemberitahuanDocProps) {
  if (!detail) {
    return <p className="text-navy-600">Data belum tersedia.</p>;
  }
  const stp = detail.surat_tugas_pemberitahuan;
  const hasData = stp?.no_surat_pemberitahuan ?? stp?.tanggal_surat_pemberitahuan;
  if (!hasData) {
    return (
      <div>
        <KopSurat />
        <p className="text-navy-600">Data surat pemberitahuan untuk permohonan ini belum diisi. Isi di tab Surat Tugas.</p>
      </div>
    );
  }

  const pengukuran = detail.pengukuran ?? [];
  const tanggalPengukuran = pengukuran.length > 0 ? pengukuran[0].tanggal_pengukuran : stp?.tanggal_surat_pemberitahuan;

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
                  <td>{formatNoSuratPemberitahuan(stp?.no_surat_pemberitahuan, stp?.tanggal_surat_pemberitahuan)}</td>
                </tr>
                <tr>
                  <td className="pr-2 text-left">Lampiran</td>
                  <td className="pr-1">:</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td className="pr-2 text-left">Perihal</td>
                  <td className="pr-1">:</td>
                  <td className="font-bold uppercase">Pemberitahuan Pengukuran Bidang Tanah</td>
                </tr>
              </tbody>
            </table>
            <div className="text-right">
              <p>Cirebon, {formatDateLong(stp?.tanggal_surat_pemberitahuan)}</p>
            </div>
          </div>

          <div className="text-sm text-navy-800 space-y-0">
            <p>Kepada:</p>
            <p>Yth. Sdr {detail.pemohon?.nama || "–"}</p>
            <p>Di tempat</p>
          </div>

          <p className="text-sm text-navy-800 text-justify">
            Sehubungan permohonan pengukuran hak atas tanah Saudara yang terletak di
          </p>
          <table className="border-collapse text-sm text-navy-800">
            <tbody>
              <tr>
                <td className="pr-2 w-40">Jalan/RT/RW</td>
                <td className="pr-1 w-4">:</td>
                <td>{detail.lokasi_tanah || "–"}</td>
              </tr>
              <tr>
                <td className="pr-2">Desa/Kelurahan</td>
                <td className="pr-1">:</td>
                <td>{detail.kelurahan_desa || "–"}</td>
              </tr>
              <tr>
                <td className="pr-2">Kecamatan</td>
                <td className="pr-1">:</td>
                <td>{detail.kecamatan || "–"}</td>
              </tr>
            </tbody>
          </table>

          <p className="text-sm text-navy-800 text-justify">
            Maka dengan ini kami memberitahukan bahwa pengukuran bidang tanah tersebut akan dilakukan pada tanggal{" "}
            <strong>{tanggalPengukuran ? formatDateLong(tanggalPengukuran) : "–"}</strong>.
          </p>

          <p className="text-sm text-navy-800 text-justify">
            Untuk memenuhi ketentuan Pasal 19 ayat (2) Peraturan Pemerintah No. 24 Tahun 1997 tentang Pendaftaran Tanah Jo Pasal 20 Peraturan Menteri Negara Agraria/Kepala Badan Pertanahan Nasional No. 3 Tahun 1997 tentang Pengukuran dan Pemetaan untuk penyelenggaraan Pendaftaran Tanah, kami mohon agar Saudara:
          </p>
          <ol className="list-decimal list-outside text-sm text-navy-800 space-y-2 pl-6 ml-0.5 text-justify">
            {DAFTAR_PERSYARATAN.map((item, i) => (
              <li key={i} className="pl-1 text-justify">{item}</li>
            ))}
          </ol>

          <p className="text-sm text-navy-800 text-justify">
            Demikian untuk menjadikan maklum dan perhatian seperlunya.
          </p>

          <div className="flex justify-end mt-10">
            <div className="text-center">
              <p className="text-sm font-medium text-navy-900">KJSB Benning dan Rekan</p>
              <div className="h-24 flex items-end justify-center" />
              <span className="text-sm border-b border-navy-800 inline-block">
                Benning Hafidah Kadina, S.T.
              </span>
              <p className="text-sm text-navy-600 mt-1">Pimpinan</p>
            </div>
          </div>
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
