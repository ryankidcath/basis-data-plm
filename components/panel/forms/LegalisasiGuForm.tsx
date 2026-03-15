"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateStatusPermohonan } from "@/lib/status-permohonan";
import type { LegalisasiGu } from "@/lib/types";
import type { PenggunaanTanah2 } from "@/lib/types";
import { FORM_LABEL, FORM_INPUT, FORM_SECTION, FORM_SECTION_HEADING, FORM_BUTTON } from "@/lib/formStyles";
import { FormattedIntegerInput } from "@/components/ui/FormattedIntegerInput";
import { PENGGUNAAN_TANAH_2_LABELS } from "@/lib/format";

const PENGGUNAAN_TANAH_2: PenggunaanTanah2[] = ["pertanian", "non-pertanian"];

interface LegalisasiGuFormProps {
  permohonanId: string;
  onSaved: () => void;
}

export function LegalisasiGuForm({ permohonanId, onSaved }: LegalisasiGuFormProps) {
  const supabase = createClient();
  const [row, setRow] = useState<LegalisasiGu | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("legalisasi_gu").select("*").eq("permohonan_id", permohonanId).maybeSingle();
      setRow(data as LegalisasiGu | null);
      setLoading(false);
    })();
  }, [permohonanId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const form = e.currentTarget;
    const payload = {
      permohonan_id: permohonanId,
      no_berkas: (form.elements.namedItem("no_berkas") as HTMLInputElement).value.trim() || null,
      tanggal_berkas: (form.elements.namedItem("tanggal_berkas") as HTMLInputElement).value || null,
      luas_hasil_ukur: Number((form.elements.namedItem("luas_hasil_ukur") as HTMLInputElement).value) || null,
      penggunaan_tanah_2: (form.elements.namedItem("penggunaan_tanah_2") as HTMLSelectElement).value as PenggunaanTanah2 || null,
      tanggal_sps: (form.elements.namedItem("tanggal_sps") as HTMLInputElement).value || null,
      biaya: Number((form.elements.namedItem("biaya") as HTMLInputElement).value) || 0,
      tanggal_bayar_sps: (form.elements.namedItem("tanggal_bayar_sps") as HTMLInputElement).value || null,
      tanggal_penyelesaian: row?.tanggal_penyelesaian ?? null,
    };
    let err: { message: string } | null = null;
    if (row) {
      const res = await supabase.from("legalisasi_gu").update(payload).eq("id", row.id);
      err = res.error;
    } else {
      const res = await supabase.from("legalisasi_gu").insert(payload);
      err = res.error;
    }
    setError(err?.message ?? null);
    setSaving(false);
    if (!err) {
      await updateStatusPermohonan(permohonanId);
      onSaved();
    }
  }

  if (loading) return null;

  return (
    <section className={FORM_SECTION}>
      <h3 className={FORM_SECTION_HEADING}>Legalisasi GU</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={FORM_LABEL}>No. Berkas</label>
            <input name="no_berkas" defaultValue={row?.no_berkas ?? ""} className={FORM_INPUT} />
          </div>
          <div>
            <label className={FORM_LABEL}>Tanggal Berkas</label>
            <input type="date" name="tanggal_berkas" defaultValue={row?.tanggal_berkas?.slice(0, 10)} className={FORM_INPUT} />
          </div>
          <div>
            <label className={FORM_LABEL}>Luas Hasil Ukur (m²)</label>
            <FormattedIntegerInput name="luas_hasil_ukur" defaultValue={row?.luas_hasil_ukur ?? ""} optional className={FORM_INPUT} />
          </div>
          <div>
            <label className={FORM_LABEL}>Penggunaan Tanah</label>
            <select name="penggunaan_tanah_2" defaultValue={row?.penggunaan_tanah_2 ?? ""} className={FORM_INPUT}>
              <option value="">–</option>
              {PENGGUNAAN_TANAH_2.map((v) => (
                <option key={v} value={v}>{PENGGUNAAN_TANAH_2_LABELS[v] ?? v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={FORM_LABEL}>Tanggal SPS</label>
            <input type="date" name="tanggal_sps" defaultValue={row?.tanggal_sps?.slice(0, 10)} className={FORM_INPUT} />
          </div>
          <div>
            <label className={FORM_LABEL}>Biaya</label>
            <FormattedIntegerInput name="biaya" defaultValue={row?.biaya ?? 0} className={FORM_INPUT} />
          </div>
          <div>
            <label className={FORM_LABEL}>Tanggal Bayar SPS</label>
            <input type="date" name="tanggal_bayar_sps" defaultValue={row?.tanggal_bayar_sps?.slice(0, 10)} className={FORM_INPUT} />
          </div>
        </div>
        <button type="submit" disabled={saving} className={FORM_BUTTON}>
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </section>
  );
}
