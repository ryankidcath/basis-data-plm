"use client";

import type { PermohonanDetail, JenisLisensi } from "@/lib/types";
import { formatNumber, formatLuasM2, PENGGUNAAN_TANAH_1_LABELS, PENGGUNAAN_TANAH_2_LABELS } from "@/lib/format";

const JABATAN_LABELS: Record<JenisLisensi, string> = {
  "surveyor kadaster": "Surveyor Kadaster",
  "asisten surveyor kadaster": "Asisten Surveyor Kadaster",
};

interface DetailPanelProps {
  detail: PermohonanDetail | null;
  loading: boolean;
  permohonanId: string | null;
  onRefresh: () => void;
  fillHeight?: boolean;
}

function formatDate(s: string | null | undefined) {
  if (!s) return "–";
  try {
    return new Date(s).toLocaleDateString("id-ID");
  } catch {
    return s;
  }
}

export default function DetailPanel({
  detail,
  loading,
  permohonanId,
  onRefresh,
  fillHeight = false,
}: DetailPanelProps) {
  if (!permohonanId) {
    return (
      <div className="p-6 text-slate-500 text-sm">
        Klik satu bidang di peta untuk melihat detail permohonan.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="p-6 text-slate-600 text-sm">
        Gagal memuat detail.{" "}
        <button type="button" onClick={onRefresh} className="text-indigo-600 hover:text-indigo-700 font-medium underline">
          Coba lagi
        </button>
      </div>
    );
  }

  const sectionHeaderClass = "text-sm font-bold text-slate-900";
  const fieldLabelClass = "text-[10px] uppercase tracking-widest text-slate-500 font-semibold";
  const valueClass = "text-sm font-normal text-slate-600";

  const p = detail;
  return (
    <div className={`flex flex-col min-h-0 ${fillHeight ? "flex-1" : "flex-shrink-0 max-h-[40vh]"}`}>
      <div className="p-4 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
        <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
          {p.kode_kjsb}
        </h2>
        <button
          type="button"
          onClick={onRefresh}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          Segarkan
        </button>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto min-h-0">
        <section className="space-y-4">
          <h3 className={sectionHeaderClass}>Permohonan</h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
            <dt className={fieldLabelClass}>Status</dt>
            <dd className={valueClass}>{p.status_permohonan || "–"}</dd>
            <dt className={fieldLabelClass}>Tanggal</dt>
            <dd className={valueClass}>{formatDate(p.tanggal_permohonan)}</dd>
            <dt className={fieldLabelClass}>Luas</dt>
            <dd className={valueClass}>{formatLuasM2(p.luas_permohonan, false)}</dd>
            <dt className={fieldLabelClass}>Penggunaan</dt>
            <dd className={valueClass}>{PENGGUNAAN_TANAH_1_LABELS[p.penggunaan_tanah_1] ?? p.penggunaan_tanah_1}</dd>
            <dt className={fieldLabelClass}>Lokasi</dt>
            <dd className={valueClass}>{p.lokasi_tanah || "–"}</dd>
            <dt className={fieldLabelClass}>Kelurahan/Desa</dt>
            <dd className={valueClass}>{p.kelurahan_desa || "–"}</dd>
            <dt className={fieldLabelClass}>Kecamatan</dt>
            <dd className={valueClass}>{p.kecamatan || "–"}</dd>
            <dt className={fieldLabelClass}>Kota/Kabupaten</dt>
            <dd className={valueClass}>{p.kota_kabupaten || "–"}</dd>
          </dl>
        </section>

        {p.pemohon && (
          <section className="space-y-4">
            <h3 className={sectionHeaderClass}>Pemohon</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
              <dt className={fieldLabelClass}>Nama</dt>
              <dd className={valueClass}>{p.pemohon.nama}</dd>
              <dt className={fieldLabelClass}>No. HP</dt>
              <dd className={valueClass}>{p.pemohon.no_hp || "–"}</dd>
              <dt className={fieldLabelClass}>NIK</dt>
              <dd className={valueClass}>{p.pemohon.nik || "–"}</dd>
              <dt className={fieldLabelClass}>Alamat</dt>
              <dd className={`${valueClass} break-words`}>{p.pemohon.alamat || "–"}</dd>
            </dl>
          </section>
        )}

        {p.klien && (
          <section className="space-y-4">
            <h3 className={sectionHeaderClass}>Klien</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
              <dt className={fieldLabelClass}>Nama</dt>
              <dd className={valueClass}>{p.klien.nama}</dd>
              <dt className={fieldLabelClass}>No. HP</dt>
              <dd className={valueClass}>{p.klien.no_hp || "–"}</dd>
            </dl>
          </section>
        )}

        {p.administrasi && (
          <section className="space-y-4">
            <h3 className={sectionHeaderClass}>Administrasi</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
              <dt className={fieldLabelClass}>No. Tanda Terima</dt>
              <dd className={valueClass}>{p.administrasi.no_tanda_terima || "–"}</dd>
              <dt className={fieldLabelClass}>Tanggal</dt>
              <dd className={valueClass}>{formatDate(p.administrasi.tanggal_tanda_terima)}</dd>
              <dt className={fieldLabelClass}>No. SLA</dt>
              <dd className={valueClass}>{p.administrasi.no_sla || "–"}</dd>
              <dt className={fieldLabelClass}>Tanggal SLA</dt>
              <dd className={valueClass}>{formatDate(p.administrasi.tanggal_sla)}</dd>
            </dl>
          </section>
        )}

        {p.keuangan && (
          <section className="space-y-4">
            <h3 className={sectionHeaderClass}>Keuangan</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
              <dt className={fieldLabelClass}>No. Invoice</dt>
              <dd className={valueClass}>{p.keuangan.no_invoice || "–"}</dd>
              <dt className={fieldLabelClass}>Tanggal Invoice</dt>
              <dd className={valueClass}>{formatDate(p.keuangan.tanggal_invoice)}</dd>
              <dt className={fieldLabelClass}>No. Kwitansi</dt>
              <dd className={valueClass}>{p.keuangan.no_kwitansi || "–"}</dd>
              <dt className={fieldLabelClass}>Tanggal Kwitansi</dt>
              <dd className={valueClass}>{formatDate(p.keuangan.tanggal_kwitansi)}</dd>
              <dt className={fieldLabelClass}>Biaya Pengukuran</dt>
              <dd className={valueClass}>{formatNumber(p.keuangan.biaya_pengukuran)}</dd>
            </dl>
          </section>
        )}

        {p.informasi_spasial && (
          <section className="space-y-4">
            <h3 className={sectionHeaderClass}>Informasi Spasial</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
              <dt className={fieldLabelClass}>No. Berkas</dt>
              <dd className={valueClass}>{p.informasi_spasial.no_berkas || "–"}</dd>
              <dt className={fieldLabelClass}>Tanggal Berkas</dt>
              <dd className={valueClass}>{formatDate(p.informasi_spasial.tanggal_berkas)}</dd>
              <dt className={fieldLabelClass}>Tanggal SPS</dt>
              <dd className={valueClass}>{formatDate(p.informasi_spasial.tanggal_sps)}</dd>
              <dt className={fieldLabelClass}>Biaya</dt>
              <dd className={valueClass}>{formatNumber(p.informasi_spasial.biaya)}</dd>
              <dt className={fieldLabelClass}>Tanggal Bayar SPS</dt>
              <dd className={valueClass}>{formatDate(p.informasi_spasial.tanggal_bayar_sps)}</dd>
              <dt className={fieldLabelClass}>Tanggal Download Hasil</dt>
              <dd className={valueClass}>{formatDate(p.informasi_spasial.tanggal_download_hasil)}</dd>
            </dl>
            {p.informasi_spasial_nib && p.informasi_spasial_nib.length > 0 && (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-4 mt-4">
                {p.informasi_spasial_nib.map((n, i) => [
                  <dt key={`${n.id}-dt`} className={fieldLabelClass}>NIB Bidang Eksisting {i + 1}</dt>,
                  <dd key={`${n.id}-dd`} className={valueClass}>{n.nib_bidang_eksisting || "–"}</dd>,
                ])}
              </dl>
            )}
          </section>
        )}

        {p.surat_tugas_pemberitahuan && (
          <section className="space-y-4">
            <h3 className={sectionHeaderClass}>Surat Tugas & Pemberitahuan</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
              <dt className={fieldLabelClass}>No. Surat Tugas</dt>
              <dd className={valueClass}>{p.surat_tugas_pemberitahuan.no_surat_tugas || "–"}</dd>
              <dt className={fieldLabelClass}>Tanggal Surat Tugas</dt>
              <dd className={valueClass}>{formatDate(p.surat_tugas_pemberitahuan.tanggal_surat_tugas)}</dd>
              <dt className={fieldLabelClass}>No. Surat Pemberitahuan</dt>
              <dd className={valueClass}>{p.surat_tugas_pemberitahuan.no_surat_pemberitahuan || "–"}</dd>
              <dt className={fieldLabelClass}>Tanggal Surat Pemberitahuan</dt>
              <dd className={valueClass}>{formatDate(p.surat_tugas_pemberitahuan.tanggal_surat_pemberitahuan)}</dd>
            </dl>
          </section>
        )}

        {p.pengukuran && p.pengukuran.length > 0 && (
          <section className="space-y-4">
            <h3 className={sectionHeaderClass}>Surveyor</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
              {p.pengukuran.flatMap((u, i) => [
                <dt key={`${u.id}-nama`} className={fieldLabelClass}>Nama {p.pengukuran!.length > 1 ? `(${i + 1})` : ""}</dt>,
                <dd key={`${u.id}-nama-v`} className={valueClass}>{u.surveyor?.nama ?? "–"}</dd>,
                <dt key={`${u.id}-lisensi`} className={fieldLabelClass}>No. Lisensi {p.pengukuran!.length > 1 ? `(${i + 1})` : ""}</dt>,
                <dd key={`${u.id}-lisensi-v`} className={valueClass}>{u.surveyor?.no_lisensi ?? "–"}</dd>,
                <dt key={`${u.id}-jabatan`} className={fieldLabelClass}>Jabatan {p.pengukuran!.length > 1 ? `(${i + 1})` : ""}</dt>,
                <dd key={`${u.id}-jabatan-v`} className={valueClass}>{u.surveyor?.jenis_lisensi ? JABATAN_LABELS[u.surveyor.jenis_lisensi] : "–"}</dd>,
                <dt key={`${u.id}-tanggal`} className={fieldLabelClass}>Tanggal Pengukuran {p.pengukuran!.length > 1 ? `(${i + 1})` : ""}</dt>,
                <dd key={`${u.id}-tanggal-v`} className={valueClass}>{formatDate(u.tanggal_pengukuran)}</dd>,
              ])}
            </dl>
          </section>
        )}

        {p.legalisasi_gu && (
          <section className="space-y-4">
            <h3 className={sectionHeaderClass}>Legalisasi GU</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
              <dt className={fieldLabelClass}>No. Berkas</dt>
              <dd className={valueClass}>{p.legalisasi_gu.no_berkas || "–"}</dd>
              <dt className={fieldLabelClass}>Tanggal Berkas</dt>
              <dd className={valueClass}>{formatDate(p.legalisasi_gu.tanggal_berkas)}</dd>
              <dt className={fieldLabelClass}>Luas Hasil Ukur</dt>
              <dd className={valueClass}>{formatLuasM2(p.legalisasi_gu.luas_hasil_ukur, false)}</dd>
              <dt className={fieldLabelClass}>Penggunaan Tanah</dt>
              <dd className={valueClass}>{(PENGGUNAAN_TANAH_2_LABELS[p.legalisasi_gu.penggunaan_tanah_2] ?? p.legalisasi_gu.penggunaan_tanah_2) || "–"}</dd>
              <dt className={fieldLabelClass}>Tanggal SPS</dt>
              <dd className={valueClass}>{formatDate(p.legalisasi_gu.tanggal_sps)}</dd>
              <dt className={fieldLabelClass}>Biaya</dt>
              <dd className={valueClass}>{formatNumber(p.legalisasi_gu.biaya)}</dd>
              <dt className={fieldLabelClass}>Tanggal Bayar SPS</dt>
              <dd className={valueClass}>{formatDate(p.legalisasi_gu.tanggal_bayar_sps)}</dd>
              <dt className={fieldLabelClass}>Tanggal Penyelesaian</dt>
              <dd className={valueClass}>{formatDate(p.legalisasi_gu.tanggal_penyelesaian)}</dd>
            </dl>
          </section>
        )}

        {p.bidang_tanah && p.bidang_tanah.length > 0 && (
          <section className="space-y-4">
            <h3 className={sectionHeaderClass}>Bidang Tanah</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
              {p.bidang_tanah.flatMap((b, i) => [
                <dt key={`${b.id}-nib`} className={fieldLabelClass}>NIB (Bidang {i + 1})</dt>,
                <dd key={`${b.id}-nib-v`} className={valueClass}>{b.nib || "–"}</dd>,
                <dt key={`${b.id}-tanggal`} className={fieldLabelClass}>Tanggal NIB (Bidang {i + 1})</dt>,
                <dd key={`${b.id}-tanggal-v`} className={valueClass}>{formatDate(b.tanggal_nib)}</dd>,
                <dt key={`${b.id}-luas`} className={fieldLabelClass}>Luas (Bidang {i + 1})</dt>,
                <dd key={`${b.id}-luas-v`} className={valueClass}>{formatLuasM2(b.luas_otomatis, true)}</dd>,
              ])}
            </dl>
          </section>
        )}

        {p.gambar_ukur && (
          <section className="space-y-4">
            <h3 className={sectionHeaderClass}>Gambar Ukur</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
              <dt className={fieldLabelClass}>No. GU</dt>
              <dd className={valueClass}>{p.gambar_ukur.no_gu || "–"}</dd>
              <dt className={fieldLabelClass}>Tanggal GU</dt>
              <dd className={valueClass}>{formatDate(p.gambar_ukur.tanggal_gu)}</dd>
              <dt className={fieldLabelClass}>Tanggal TTE</dt>
              <dd className={valueClass}>{formatDate(p.gambar_ukur.tanggal_tte_gu)}</dd>
              <dt className={fieldLabelClass}>Tanggal Upload</dt>
              <dd className={valueClass}>{formatDate(p.gambar_ukur.tanggal_upload_gu_tte)}</dd>
            </dl>
          </section>
        )}

        {p.peta_bidang_tanah && (
          <section className="space-y-4">
            <h3 className={sectionHeaderClass}>Peta Bidang Tanah</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
              <dt className={fieldLabelClass}>No. PBT</dt>
              <dd className={valueClass}>{p.peta_bidang_tanah.no_pbt || "–"}</dd>
              <dt className={fieldLabelClass}>Tanggal PBT</dt>
              <dd className={valueClass}>{formatDate(p.peta_bidang_tanah.tanggal_pbt)}</dd>
              <dt className={fieldLabelClass}>Tanggal TTE</dt>
              <dd className={valueClass}>{formatDate(p.peta_bidang_tanah.tanggal_tte_pbt)}</dd>
              <dt className={fieldLabelClass}>Tanggal Upload</dt>
              <dd className={valueClass}>{formatDate(p.peta_bidang_tanah.tanggal_upload_pbt_tte)}</dd>
            </dl>
          </section>
        )}
      </div>
    </div>
  );
}
