import { createClient } from "./server";

export interface PermohonanExportRow {
  kode_kjsb: string;
  pemohon_nama: string;
  tanggal_permohonan: string;
  luas_permohonan: number;
  penggunaan_tanah_1: string;
  lokasi_tanah: string;
  kota_kabupaten: string;
  kecamatan: string;
  kelurahan_desa: string;
  status_permohonan: string;
  created_at: string;
}

export async function fetchPermohonanForExport(): Promise<PermohonanExportRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("permohonan")
    .select(
      "kode_kjsb, tanggal_permohonan, luas_permohonan, penggunaan_tanah_1, lokasi_tanah, kota_kabupaten, kecamatan, kelurahan_desa, status_permohonan, created_at, pemohon(nama)"
    )
    .order("kode_kjsb");

  if (error) throw error;

  const rows: PermohonanExportRow[] = (data ?? []).map((row: Record<string, unknown>) => {
    const pemohon = row.pemohon as { nama?: string } | null;
    return {
      kode_kjsb: String(row.kode_kjsb ?? ""),
      pemohon_nama: pemohon?.nama != null ? String(pemohon.nama) : "",
      tanggal_permohonan: String(row.tanggal_permohonan ?? ""),
      luas_permohonan: Number(row.luas_permohonan ?? 0),
      penggunaan_tanah_1: String(row.penggunaan_tanah_1 ?? ""),
      lokasi_tanah: String(row.lokasi_tanah ?? ""),
      kota_kabupaten: String(row.kota_kabupaten ?? ""),
      kecamatan: String(row.kecamatan ?? ""),
      kelurahan_desa: String(row.kelurahan_desa ?? ""),
      status_permohonan: String(row.status_permohonan ?? ""),
      created_at: String(row.created_at ?? ""),
    };
  });

  return rows;
}
