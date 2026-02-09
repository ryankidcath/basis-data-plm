export type JenisLisensi = "surveyor kadaster" | "asisten surveyor kadaster";
export type PenggunaanTanah1 =
  | "pertanian/perkebunan"
  | "hunian/pekarangan"
  | "komersial"
  | "industri"
  | "pertambangan";
export type PenggunaanTanah2 = "pertanian" | "non-pertanian";

export interface Pemohon {
  id: string;
  nama: string;
  no_hp: string;
  nik: string;
  alamat: string;
  created_at: string;
  updated_at: string;
}

export interface Klien {
  id: string;
  nama: string;
  no_hp: string;
  created_at: string;
  updated_at: string;
}

export interface Surveyor {
  id: string;
  nama: string;
  no_lisensi: string;
  jenis_lisensi: JenisLisensi;
  no_hp: string;
  nik: string;
  alamat: string;
  created_at: string;
  updated_at: string;
}

export interface Permohonan {
  id: string;
  kode_kjsb: string;
  pemohon_id: string;
  klien_id: string | null;
  tanggal_permohonan: string;
  luas_permohonan: number;
  penggunaan_tanah_1: PenggunaanTanah1;
  lokasi_tanah: string;
  kota_kabupaten: string;
  kecamatan: string;
  kelurahan_desa: string;
  status_permohonan: string;
  created_at: string;
  updated_at: string;
}

export interface Administrasi {
  id: string;
  permohonan_id: string;
  no_tanda_terima: string;
  tanggal_tanda_terima: string;
  no_sla: string;
  tanggal_sla: string;
  created_at: string;
  updated_at: string;
}

export interface Keuangan {
  id: string;
  permohonan_id: string;
  no_invoice: string;
  tanggal_invoice: string;
  no_kwitansi: string;
  tanggal_kwitansi: string;
  biaya_pengukuran: number;
  created_at: string;
  updated_at: string;
}

export interface InformasiSpasial {
  id: string;
  permohonan_id: string;
  no_berkas: string;
  tanggal_berkas: string;
  tanggal_sps: string;
  biaya: number;
  tanggal_bayar_sps: string;
  tanggal_download_hasil: string;
  created_at: string;
  updated_at: string;
}

export interface InformasiSpasialNib {
  id: string;
  informasi_spasial_id: string;
  nib_bidang_eksisting: string;
  created_at: string;
  updated_at: string;
}

export interface SuratTugasPemberitahuan {
  id: string;
  permohonan_id: string;
  no_surat_tugas: string;
  tanggal_surat_tugas: string;
  no_surat_pemberitahuan: string;
  tanggal_surat_pemberitahuan: string;
  created_at: string;
  updated_at: string;
}

export interface Pengukuran {
  id: string;
  surat_tugas_id: string;
  surveyor_id: string;
  tanggal_pengukuran: string;
  created_at: string;
  updated_at: string;
}

export interface LegalisasiGu {
  id: string;
  permohonan_id: string;
  no_berkas: string;
  tanggal_berkas: string;
  luas_hasil_ukur: number;
  penggunaan_tanah_2: PenggunaanTanah2;
  tanggal_sps: string;
  biaya: number;
  tanggal_bayar_sps: string;
  tanggal_penyelesaian: string;
  created_at: string;
  updated_at: string;
}

export interface BidangTanah {
  id: string;
  permohonan_id: string;
  geom: GeoJSON.Geometry | null;
  nib: string;
  tanggal_nib: string;
  luas_otomatis: number | null;
  created_at: string;
  updated_at: string;
}

export interface GambarUkur {
  id: string;
  permohonan_id: string;
  no_gu: string;
  tanggal_gu: string;
  tanggal_tte_gu: string;
  tanggal_upload_gu_tte: string;
  created_at: string;
  updated_at: string;
}

export interface PetaBidangTanah {
  id: string;
  permohonan_id: string;
  no_pbt: string;
  tanggal_pbt: string;
  tanggal_tte_pbt: string;
  tanggal_upload_pbt_tte: string;
  created_at: string;
  updated_at: string;
}

export interface PermohonanDetail extends Permohonan {
  pemohon?: Pemohon | null;
  klien?: Klien | null;
  administrasi?: Administrasi | null;
  keuangan?: Keuangan | null;
  informasi_spasial?: InformasiSpasial | null;
  informasi_spasial_nib?: InformasiSpasialNib[];
  surat_tugas_pemberitahuan?: SuratTugasPemberitahuan | null;
  pengukuran?: (Pengukuran & { surveyor?: Surveyor })[];
  legalisasi_gu?: LegalisasiGu | null;
  bidang_tanah?: BidangTanah[];
  gambar_ukur?: GambarUkur | null;
  peta_bidang_tanah?: PetaBidangTanah | null;
}
