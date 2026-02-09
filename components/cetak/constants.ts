/** Daftar berkas/dokumen untuk Tanda Terima (statis). */
export const TANDA_TERIMA_BERKAS = [
  "Permohonan (Lampiran 13)",
  "Surat Pernyataan Pemasangan Tanda Batas",
  "Surat Pernyataan Penguasaan Fisik (Sporadik)",
  "Alas hak",
  "PBB tahun berjalan",
  "BPHTB tervalidasi",
  "PPh tervalidasi",
  "Girik, Letter C & Peta Blok Desa",
  "KTP pemohon, saksi desa, kuasa (jika dikuasakan)",
] as const;

/** Kontak perusahaan untuk footer surat. */
export const KONTAK_PERUSAHAAN = {
  telepon: "+62 811 2222 2122",
  alamat: "Jl. Brigjen Darsono No. 72A, Kec. Kedawung, Kab. Cirebon",
  email: "admin@kjsbbenningdanrekan.co.id",
} as const;

/** Untuk blok Info Perusahaan di invoice (alamat lengkap). */
export const INVOICE_INFO_PERUSAHAAN = {
  nama: "KJSB Benning dan Rekan",
  alamat: "Jl. Brigjend Dharsono No.72A, Kertawinangun Kedawung, Kab. Cirebon Jawa Barat 45153",
} as const;

/** Keterangan pembayaran di invoice. */
export const INVOICE_KETERANGAN_PEMBAYARAN =
  "Pembayaran transfer ke Mandiri 1340085085008 a/n Benning dan Rekan";

/** Role untuk blok Tagihan Untuk di invoice. */
export const INVOICE_TAGIHAN_ROLE = "Notaris/PPAT";

/** Nama Petugas Loket untuk tanda tangan invoice (kosong = placeholder). */
export const INVOICE_PETUGAS_LOKET_NAMA = "";
