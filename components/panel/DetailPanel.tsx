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
      <div className="p-6 text-navy-500 text-sm border-b border-navy-200 bg-white">
        Klik satu bidang di peta untuk melihat detail permohonan.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 border-b border-navy-200 bg-white">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-navy-200 rounded w-3/4" />
            <div className="h-4 bg-navy-200 rounded w-1/2" />
            <div className="h-4 bg-navy-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="p-6 text-red-600 text-sm border-b border-navy-200 bg-white">
        Gagal memuat detail.{" "}
        <button type="button" onClick={onRefresh} className="underline">
          Coba lagi
        </button>
      </div>
    );
  }

  const p = detail;
  return (
    <div className={`border-b border-navy-200 bg-white flex flex-col min-h-0 shadow-sm ${fillHeight ? "flex-1" : "flex-shrink-0 max-h-[40vh]"}`}>
      <div className="p-4 border-b border-navy-200 flex justify-between items-center flex-shrink-0 bg-navy-50/50">
        <h2 className="font-serif font-semibold text-navy-900 tracking-tight">
          {p.kode_kjsb}
        </h2>
        <button
          type="button"
          onClick={onRefresh}
          className="text-sm font-medium text-gold-600 hover:text-gold-700 px-2 py-1 rounded-lg hover:bg-gold-50 transition-colors"
        >
          Segarkan
        </button>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto min-h-0">
        <section className="rounded-xl border border-navy-200 p-3 shadow-sm">
          <h3 className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-2">
            Permohonan
          </h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <dt className="text-navy-500">Status</dt>
            <dd className="text-navy-900">{p.status_permohonan || "–"}</dd>
            <dt className="text-navy-500">Tanggal</dt>
            <dd>{formatDate(p.tanggal_permohonan)}</dd>
            <dt className="text-navy-500">Luas</dt>
            <dd>{formatLuasM2(p.luas_permohonan, false)}</dd>
            <dt className="text-navy-500">Penggunaan</dt>
            <dd>{PENGGUNAAN_TANAH_1_LABELS[p.penggunaan_tanah_1] ?? p.penggunaan_tanah_1}</dd>
            <dt className="text-navy-500">Lokasi</dt>
            <dd>{p.lokasi_tanah || "–"}</dd>
            <dt className="text-navy-500">Kelurahan/Desa</dt>
            <dd>{p.kelurahan_desa || "–"}</dd>
            <dt className="text-navy-500">Kecamatan</dt>
            <dd>{p.kecamatan || "–"}</dd>
            <dt className="text-navy-500">Kota/Kabupaten</dt>
            <dd>{p.kota_kabupaten || "–"}</dd>
          </dl>
        </section>

        {p.pemohon && (
          <section className="rounded-xl border border-navy-200 p-3 shadow-sm">
            <h3 className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-2">
              Pemohon
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <dt className="text-navy-500">Nama</dt>
              <dd className="text-navy-900">{p.pemohon.nama}</dd>
              <dt className="text-navy-500">No. HP</dt>
              <dd>{p.pemohon.no_hp || "–"}</dd>
              <dt className="text-navy-500">NIK</dt>
              <dd>{p.pemohon.nik || "–"}</dd>
              <dt className="text-navy-500">Alamat</dt>
              <dd className="break-words">{p.pemohon.alamat || "–"}</dd>
            </dl>
          </section>
        )}

        {p.klien && (
          <section className="rounded-xl border border-navy-200 p-3 shadow-sm">
            <h3 className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-2">
              Klien
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <dt className="text-navy-500">Nama</dt>
              <dd className="text-navy-900">{p.klien.nama}</dd>
              <dt className="text-navy-500">No. HP</dt>
              <dd>{p.klien.no_hp || "–"}</dd>
            </dl>
          </section>
        )}

        {p.administrasi && (
          <section className="rounded-xl border border-navy-200 p-3 shadow-sm">
            <h3 className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-2">
              Administrasi
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <dt className="text-navy-500">No. Tanda Terima</dt>
              <dd>{p.administrasi.no_tanda_terima || "–"}</dd>
              <dt className="text-navy-500">Tanggal</dt>
              <dd>{formatDate(p.administrasi.tanggal_tanda_terima)}</dd>
              <dt className="text-navy-500">No. SLA</dt>
              <dd>{p.administrasi.no_sla || "–"}</dd>
              <dt className="text-navy-500">Tanggal SLA</dt>
              <dd>{formatDate(p.administrasi.tanggal_sla)}</dd>
            </dl>
          </section>
        )}

        {p.keuangan && (
          <section className="rounded-xl border border-navy-200 p-3 shadow-sm">
            <h3 className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-2">
              Keuangan
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <dt className="text-navy-500">No. Invoice</dt>
              <dd>{p.keuangan.no_invoice || "–"}</dd>
              <dt className="text-navy-500">Tanggal Invoice</dt>
              <dd>{formatDate(p.keuangan.tanggal_invoice)}</dd>
              <dt className="text-navy-500">No. Kwitansi</dt>
              <dd>{p.keuangan.no_kwitansi || "–"}</dd>
              <dt className="text-navy-500">Tanggal Kwitansi</dt>
              <dd>{formatDate(p.keuangan.tanggal_kwitansi)}</dd>
              <dt className="text-navy-500">Biaya Pengukuran</dt>
              <dd>{formatNumber(p.keuangan.biaya_pengukuran)}</dd>
            </dl>
          </section>
        )}

        {p.informasi_spasial && (
          <section className="rounded-xl border border-navy-200 p-3 shadow-sm">
            <h3 className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-2">
              Informasi Spasial
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <dt className="text-navy-500">No. Berkas</dt>
              <dd>{p.informasi_spasial.no_berkas || "–"}</dd>
              <dt className="text-navy-500">Tanggal Berkas</dt>
              <dd>{formatDate(p.informasi_spasial.tanggal_berkas)}</dd>
              <dt className="text-navy-500">Tanggal SPS</dt>
              <dd>{formatDate(p.informasi_spasial.tanggal_sps)}</dd>
              <dt className="text-navy-500">Biaya</dt>
              <dd>{formatNumber(p.informasi_spasial.biaya)}</dd>
              <dt className="text-navy-500">Tanggal Bayar SPS</dt>
              <dd>{formatDate(p.informasi_spasial.tanggal_bayar_sps)}</dd>
              <dt className="text-navy-500">Tanggal Download Hasil</dt>
              <dd>{formatDate(p.informasi_spasial.tanggal_download_hasil)}</dd>
            </dl>
            {p.informasi_spasial_nib && p.informasi_spasial_nib.length > 0 && (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-3">
                {p.informasi_spasial_nib.map((n, i) => [
                  <dt key={`${n.id}-dt`} className="text-navy-500">NIB Bidang Eksisting {i + 1}</dt>,
                  <dd key={`${n.id}-dd`}>{n.nib_bidang_eksisting || "–"}</dd>,
                ])}
              </dl>
            )}
          </section>
        )}

        {p.surat_tugas_pemberitahuan && (
          <section className="rounded-xl border border-navy-200 p-3 shadow-sm">
            <h3 className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-2">
              Surat Tugas & Pemberitahuan
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <dt className="text-navy-500">No. Surat Tugas</dt>
              <dd>{p.surat_tugas_pemberitahuan.no_surat_tugas || "–"}</dd>
              <dt className="text-navy-500">Tanggal Surat Tugas</dt>
              <dd>{formatDate(p.surat_tugas_pemberitahuan.tanggal_surat_tugas)}</dd>
              <dt className="text-navy-500">No. Surat Pemberitahuan</dt>
              <dd>{p.surat_tugas_pemberitahuan.no_surat_pemberitahuan || "–"}</dd>
              <dt className="text-navy-500">Tanggal Surat Pemberitahuan</dt>
              <dd>{formatDate(p.surat_tugas_pemberitahuan.tanggal_surat_pemberitahuan)}</dd>
            </dl>
          </section>
        )}

        {p.pengukuran && p.pengukuran.length > 0 && (
          <section className="rounded-xl border border-navy-200 p-3 shadow-sm">
            <h3 className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-2">
              Surveyor
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {p.pengukuran.flatMap((u, i) => [
                <dt key={`${u.id}-nama`} className="text-navy-500">Nama {p.pengukuran!.length > 1 ? `(${i + 1})` : ""}</dt>,
                <dd key={`${u.id}-nama-v`}>{u.surveyor?.nama ?? "–"}</dd>,
                <dt key={`${u.id}-lisensi`} className="text-navy-500">No. Lisensi {p.pengukuran!.length > 1 ? `(${i + 1})` : ""}</dt>,
                <dd key={`${u.id}-lisensi-v`}>{u.surveyor?.no_lisensi ?? "–"}</dd>,
                <dt key={`${u.id}-jabatan`} className="text-navy-500">Jabatan {p.pengukuran!.length > 1 ? `(${i + 1})` : ""}</dt>,
                <dd key={`${u.id}-jabatan-v`}>{u.surveyor?.jenis_lisensi ? JABATAN_LABELS[u.surveyor.jenis_lisensi] : "–"}</dd>,
                <dt key={`${u.id}-tanggal`} className="text-navy-500">Tanggal Pengukuran {p.pengukuran!.length > 1 ? `(${i + 1})` : ""}</dt>,
                <dd key={`${u.id}-tanggal-v`}>{formatDate(u.tanggal_pengukuran)}</dd>,
              ])}
            </dl>
          </section>
        )}

        {p.legalisasi_gu && (
          <section className="rounded-xl border border-navy-200 p-3 shadow-sm">
            <h3 className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-2">
              Legalisasi GU
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <dt className="text-navy-500">No. Berkas</dt>
              <dd>{p.legalisasi_gu.no_berkas || "–"}</dd>
              <dt className="text-navy-500">Tanggal Berkas</dt>
              <dd>{formatDate(p.legalisasi_gu.tanggal_berkas)}</dd>
              <dt className="text-navy-500">Luas Hasil Ukur</dt>
              <dd>{formatLuasM2(p.legalisasi_gu.luas_hasil_ukur, false)}</dd>
              <dt className="text-navy-500">Penggunaan Tanah</dt>
              <dd>{(PENGGUNAAN_TANAH_2_LABELS[p.legalisasi_gu.penggunaan_tanah_2] ?? p.legalisasi_gu.penggunaan_tanah_2) || "–"}</dd>
              <dt className="text-navy-500">Tanggal SPS</dt>
              <dd>{formatDate(p.legalisasi_gu.tanggal_sps)}</dd>
              <dt className="text-navy-500">Biaya</dt>
              <dd>{formatNumber(p.legalisasi_gu.biaya)}</dd>
              <dt className="text-navy-500">Tanggal Bayar SPS</dt>
              <dd>{formatDate(p.legalisasi_gu.tanggal_bayar_sps)}</dd>
              <dt className="text-navy-500">Tanggal Penyelesaian</dt>
              <dd>{formatDate(p.legalisasi_gu.tanggal_penyelesaian)}</dd>
            </dl>
          </section>
        )}

        {p.bidang_tanah && p.bidang_tanah.length > 0 && (
          <section className="rounded-xl border border-navy-200 p-3 shadow-sm">
            <h3 className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-2">
              Bidang Tanah
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {p.bidang_tanah.flatMap((b, i) => [
                <dt key={`${b.id}-nib`} className="text-navy-500">NIB (Bidang {i + 1})</dt>,
                <dd key={`${b.id}-nib-v`}>{b.nib || "–"}</dd>,
                <dt key={`${b.id}-tanggal`} className="text-navy-500">Tanggal NIB (Bidang {i + 1})</dt>,
                <dd key={`${b.id}-tanggal-v`}>{formatDate(b.tanggal_nib)}</dd>,
                <dt key={`${b.id}-luas`} className="text-navy-500">Luas (Bidang {i + 1})</dt>,
                <dd key={`${b.id}-luas-v`}>{formatLuasM2(b.luas_otomatis, true)}</dd>,
              ])}
            </dl>
          </section>
        )}

        {p.gambar_ukur && (
          <section className="rounded-xl border border-navy-200 p-3 shadow-sm">
            <h3 className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-2">
              Gambar Ukur
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <dt className="text-navy-500">No. GU</dt>
              <dd>{p.gambar_ukur.no_gu || "–"}</dd>
              <dt className="text-navy-500">Tanggal GU</dt>
              <dd>{formatDate(p.gambar_ukur.tanggal_gu)}</dd>
              <dt className="text-navy-500">Tanggal TTE</dt>
              <dd>{formatDate(p.gambar_ukur.tanggal_tte_gu)}</dd>
              <dt className="text-navy-500">Tanggal Upload</dt>
              <dd>{formatDate(p.gambar_ukur.tanggal_upload_gu_tte)}</dd>
            </dl>
          </section>
        )}

        {p.peta_bidang_tanah && (
          <section className="rounded-xl border border-navy-200 p-3 shadow-sm">
            <h3 className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-2">
              Peta Bidang Tanah
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <dt className="text-navy-500">No. PBT</dt>
              <dd>{p.peta_bidang_tanah.no_pbt || "–"}</dd>
              <dt className="text-navy-500">Tanggal PBT</dt>
              <dd>{formatDate(p.peta_bidang_tanah.tanggal_pbt)}</dd>
              <dt className="text-navy-500">Tanggal TTE</dt>
              <dd>{formatDate(p.peta_bidang_tanah.tanggal_tte_pbt)}</dd>
              <dt className="text-navy-500">Tanggal Upload</dt>
              <dd>{formatDate(p.peta_bidang_tanah.tanggal_upload_pbt_tte)}</dd>
            </dl>
          </section>
        )}
      </div>
    </div>
  );
}
