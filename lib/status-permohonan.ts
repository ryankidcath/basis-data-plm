import { createClient } from "@/lib/supabase/client";
import { fetchPermohonanDetail } from "@/lib/supabase/queries";
import type { PermohonanDetail } from "@/lib/types";

/** Urutan status dari tahap awal (1) ke tahap akhir (14) */
export const STATUS_PERMOHONAN_ORDER = [
  "Pendaftaran",
  "Pembayaran",
  "Entri Informasi Spasial",
  "Verifikasi Informasi Berkas",
  "Pembayaran Informasi Spasial",
  "Pembuatan Surat Tugas",
  "Pengukuran",
  "Verifikasi Berkas",
  "Pembayaran Legalisasi GU",
  "Pemetaan",
  "TTE GU & PBT",
  "Upload GU & PBT",
  "Menunggu Penyelesaian",
  "Selesai",
] as const;

function filled(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === "string") return v.trim() !== "";
  return true;
}

/**
 * Menghitung status permohonan dari data detail. Dicek dari tahap tertinggi (14) ke terendah (1).
 */
export function computeStatusFromDetail(detail: PermohonanDetail): string {
  const k = detail.keuangan;
  const isp = detail.informasi_spasial;
  const stp = detail.surat_tugas_pemberitahuan;
  const leg = detail.legalisasi_gu;
  const bt = detail.bidang_tanah ?? [];
  const gu = detail.gambar_ukur;
  const pbt = detail.peta_bidang_tanah;

  if (leg && filled(leg.tanggal_penyelesaian)) return "Selesai";
  if (gu && pbt && filled(gu.tanggal_upload_gu_tte) && filled(pbt.tanggal_upload_pbt_tte))
    return "Menunggu Penyelesaian";
  if (gu && pbt && filled(gu.tanggal_tte_gu) && filled(pbt.tanggal_tte_pbt)) return "Upload GU & PBT";
  const hasNib = bt.some((b) => filled(b.nib));
  if (hasNib && gu && pbt && filled(gu.no_gu) && filled(pbt.no_pbt)) return "TTE GU & PBT";
  if (leg && filled(leg.tanggal_bayar_sps)) return "Pemetaan";
  if (leg && filled(leg.tanggal_sps)) return "Pembayaran Legalisasi GU";
  if (leg && filled(leg.no_berkas) && filled(leg.tanggal_berkas)) return "Verifikasi Berkas";
  if (stp && filled(stp.no_surat_tugas) && filled(stp.tanggal_surat_tugas)) return "Pengukuran";
  if (isp && filled(isp.tanggal_bayar_sps)) return "Pembuatan Surat Tugas";
  if (isp && filled(isp.tanggal_sps)) return "Pembayaran Informasi Spasial";
  if (isp && filled(isp.no_berkas) && filled(isp.tanggal_berkas)) return "Verifikasi Informasi Berkas";
  if (k && filled(k.no_kwitansi) && filled(k.tanggal_kwitansi)) return "Entri Informasi Spasial";
  if (k && filled(k.no_invoice) && filled(k.tanggal_invoice)) return "Pembayaran";

  return "Pendaftaran";
}

/**
 * Mengambil detail permohonan, menghitung status, lalu mengupdate kolom status_permohonan.
 * Tidak throw jika detail null (skip update).
 */
export async function updateStatusPermohonan(permohonanId: string): Promise<void> {
  const detail = await fetchPermohonanDetail(permohonanId);
  if (!detail) return;
  const status = computeStatusFromDetail(detail);
  const supabase = createClient();
  await supabase.from("permohonan").update({ status_permohonan: status }).eq("id", permohonanId);
}
