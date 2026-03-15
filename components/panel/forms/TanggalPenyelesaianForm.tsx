"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateStatusPermohonan } from "@/lib/status-permohonan";
import type { LegalisasiGu } from "@/lib/types";
import { FORM_LABEL, FORM_INPUT, FORM_SECTION, FORM_SECTION_HEADING, FORM_BUTTON } from "@/lib/formStyles";

interface TanggalPenyelesaianFormProps {
  permohonanId: string;
  onSaved: () => void;
}

export function TanggalPenyelesaianForm({ permohonanId, onSaved }: TanggalPenyelesaianFormProps) {
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
    const tanggalPenyelesaian = (form.elements.namedItem("tanggal_penyelesaian") as HTMLInputElement).value || null;

    let err: { message: string } | null = null;
    if (row) {
      const res = await supabase.from("legalisasi_gu").update({ tanggal_penyelesaian: tanggalPenyelesaian || null }).eq("id", row.id);
      err = res.error;
    } else {
      const res = await supabase
        .from("legalisasi_gu")
        .insert({
          permohonan_id: permohonanId,
          tanggal_penyelesaian: tanggalPenyelesaian || null,
        })
        .select()
        .single();
      err = res.error;
      if (!err && res.data) {
        setRow(res.data as LegalisasiGu);
      }
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
      <h3 className={FORM_SECTION_HEADING}>Tanggal Penyelesaian</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="max-w-xs">
          <label className={FORM_LABEL}>Tanggal Penyelesaian</label>
          <input
            type="date"
            name="tanggal_penyelesaian"
            defaultValue={row?.tanggal_penyelesaian?.slice(0, 10)}
            className={FORM_INPUT}
          />
        </div>
        <button type="submit" disabled={saving} className={FORM_BUTTON}>
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </section>
  );
}
