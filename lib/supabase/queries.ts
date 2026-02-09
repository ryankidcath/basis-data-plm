import { createClient } from "./client";
import type { PermohonanDetail } from "./types";

export interface BidangTanahGeo {
  id: string;
  permohonan_id: string;
  nib: string | null;
  geom_json: string | null;
}

export async function fetchBidangTanahGeo(): Promise<BidangTanahGeo[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_bidang_tanah_geojson");
  if (error) throw error;
  return (data ?? []) as BidangTanahGeo[];
}

export async function fetchPermohonanDetail(
  permohonanId: string
): Promise<PermohonanDetail | null> {
  const supabase = createClient();

  const [permRes, pemohonRes, klienRes, adminRes, keuRes, infoSpasialRes, stpRes, legalRes, bidangRes, guRes, pbtRes] =
    await Promise.all([
      supabase.from("permohonan").select("*").eq("id", permohonanId).single(),
      supabase.from("pemohon").select("*"),
      supabase.from("klien").select("*"),
      supabase.from("administrasi").select("*").eq("permohonan_id", permohonanId).maybeSingle(),
      supabase.from("keuangan").select("*").eq("permohonan_id", permohonanId).maybeSingle(),
      supabase.from("informasi_spasial").select("*").eq("permohonan_id", permohonanId).maybeSingle(),
      supabase.from("surat_tugas_pemberitahuan").select("*").eq("permohonan_id", permohonanId).maybeSingle(),
      supabase.from("legalisasi_gu").select("*").eq("permohonan_id", permohonanId).maybeSingle(),
      supabase.from("bidang_tanah").select("id, permohonan_id, nib, tanggal_nib, luas_otomatis, created_at, updated_at").eq("permohonan_id", permohonanId),
      supabase.from("gambar_ukur").select("*").eq("permohonan_id", permohonanId).maybeSingle(),
      supabase.from("peta_bidang_tanah").select("*").eq("permohonan_id", permohonanId).maybeSingle(),
    ]);

  if (permRes.error || !permRes.data) return null;
  const detail = permRes.data as PermohonanDetail;

  detail.pemohon = pemohonRes.data?.find((p: { id: string }) => p.id === detail.pemohon_id) ?? null;
  detail.klien = detail.klien_id
    ? (klienRes.data?.find((k: { id: string }) => k.id === detail.klien_id) ?? null)
    : null;
  detail.administrasi = adminRes.data ?? null;
  detail.keuangan = keuRes.data ?? null;
  detail.informasi_spasial = infoSpasialRes.data ?? null;
  detail.surat_tugas_pemberitahuan = stpRes.data ?? null;
  detail.legalisasi_gu = legalRes.data ?? null;
  detail.bidang_tanah = (bidangRes.data ?? []) as PermohonanDetail["bidang_tanah"];
  detail.gambar_ukur = guRes.data ?? null;
  detail.peta_bidang_tanah = pbtRes.data ?? null;

  if (infoSpasialRes.data?.id) {
    const { data: nibData } = await supabase
      .from("informasi_spasial_nib")
      .select("*")
      .eq("informasi_spasial_id", infoSpasialRes.data.id);
    detail.informasi_spasial_nib = nibData ?? [];
  } else {
    detail.informasi_spasial_nib = [];
  }

  if (stpRes.data?.id) {
    const { data: pengukuranData } = await supabase
      .from("pengukuran")
      .select("*, surveyor:surveyor(*)")
      .eq("surat_tugas_id", stpRes.data.id);
    detail.pengukuran = (pengukuranData ?? []) as PermohonanDetail["pengukuran"];
  } else {
    detail.pengukuran = [];
  }

  return detail;
}
