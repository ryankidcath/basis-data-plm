"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateStatusPermohonan } from "@/lib/status-permohonan";
import type { Keuangan } from "@/lib/types";
import { FORM_LABEL, FORM_INPUT, FORM_SECTION, FORM_SECTION_HEADING, FORM_BUTTON } from "@/lib/formStyles";
import { FormattedIntegerInput } from "@/components/ui/FormattedIntegerInput";

interface KeuanganFormProps {
  permohonanId: string;
  onSaved: () => void;
}

export function KeuanganForm({ permohonanId, onSaved }: KeuanganFormProps) {
  const supabase = createClient();
  const [row, setRow] = useState<Keuangan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("keuangan").select("*").eq("permohonan_id", permohonanId).maybeSingle();
      setRow(data as Keuangan | null);
      setLoading(false);
    })();
  }, [permohonanId, supabase]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const form = e.currentTarget;
    const payload = {
      permohonan_id: permohonanId,
      no_invoice: (form.elements.namedItem("no_invoice") as HTMLInputElement).value.trim() || null,
      tanggal_invoice: (form.elements.namedItem("tanggal_invoice") as HTMLInputElement).value || null,
      no_kwitansi: (form.elements.namedItem("no_kwitansi") as HTMLInputElement).value.trim() || null,
      tanggal_kwitansi: (form.elements.namedItem("tanggal_kwitansi") as HTMLInputElement).value || null,
      biaya_pengukuran: Number((form.elements.namedItem("biaya_pengukuran") as HTMLInputElement).value) || 0,
    };
    let err: { message: string } | null = null;
    if (row) {
      const res = await supabase.from("keuangan").update(payload).eq("id", row.id);
      err = res.error;
    } else {
      const res = await supabase.from("keuangan").insert(payload);
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
      <h3 className={FORM_SECTION_HEADING}>Keuangan (Invoice, Kwitansi)</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={FORM_LABEL}>No. Invoice</label>
            <input name="no_invoice" defaultValue={row?.no_invoice ?? ""} className={FORM_INPUT} />
          </div>
          <div>
            <label className={FORM_LABEL}>Tanggal Invoice</label>
            <input type="date" name="tanggal_invoice" defaultValue={row?.tanggal_invoice?.slice(0, 10)} className={FORM_INPUT} />
          </div>
          <div>
            <label className={FORM_LABEL}>No. Kwitansi</label>
            <input name="no_kwitansi" defaultValue={row?.no_kwitansi ?? ""} className={FORM_INPUT} />
          </div>
          <div>
            <label className={FORM_LABEL}>Tanggal Kwitansi</label>
            <input type="date" name="tanggal_kwitansi" defaultValue={row?.tanggal_kwitansi?.slice(0, 10)} className={FORM_INPUT} />
          </div>
          <div>
            <label className={FORM_LABEL}>Biaya Pengukuran</label>
            <FormattedIntegerInput name="biaya_pengukuran" defaultValue={row?.biaya_pengukuran ?? 0} className={FORM_INPUT} />
          </div>
        </div>
        <button type="submit" disabled={saving} className={FORM_BUTTON}>
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </section>
  );
}
