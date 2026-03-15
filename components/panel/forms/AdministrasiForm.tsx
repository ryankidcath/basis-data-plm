"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Administrasi } from "@/lib/types";
import { FORM_LABEL, FORM_INPUT, FORM_SECTION, FORM_SECTION_HEADING, FORM_BUTTON } from "@/lib/formStyles";

interface AdministrasiFormProps {
  permohonanId: string;
  onSaved: () => void;
}

export function AdministrasiForm({ permohonanId, onSaved }: AdministrasiFormProps) {
  const supabase = createClient();
  const [row, setRow] = useState<Administrasi | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("administrasi").select("*").eq("permohonan_id", permohonanId).maybeSingle();
      setRow(data as Administrasi | null);
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
      no_tanda_terima: (form.elements.namedItem("no_tanda_terima") as HTMLInputElement).value.trim() || null,
      tanggal_tanda_terima: (form.elements.namedItem("tanggal_tanda_terima") as HTMLInputElement).value || null,
      no_sla: (form.elements.namedItem("no_sla") as HTMLInputElement).value.trim() || null,
      tanggal_sla: (form.elements.namedItem("tanggal_sla") as HTMLInputElement).value || null,
    };
    let err: { message: string } | null = null;
    if (row) {
      const res = await supabase.from("administrasi").update(payload).eq("id", row.id);
      err = res.error;
    } else {
      const res = await supabase.from("administrasi").insert(payload);
      err = res.error;
    }
    setError(err?.message ?? null);
    setSaving(false);
    if (!err) onSaved();
  }

  if (loading) return null;

  return (
    <section className={FORM_SECTION}>
      <h3 className={FORM_SECTION_HEADING}>Administrasi (Tanda Terima, SLA)</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={FORM_LABEL}>No. Tanda Terima</label>
            <input name="no_tanda_terima" defaultValue={row?.no_tanda_terima ?? ""} className={FORM_INPUT} />
          </div>
          <div>
            <label className={FORM_LABEL}>Tanggal Tanda Terima</label>
            <input type="date" name="tanggal_tanda_terima" defaultValue={row?.tanggal_tanda_terima?.slice(0, 10)} className={FORM_INPUT} />
          </div>
          <div>
            <label className={FORM_LABEL}>No. SLA</label>
            <input name="no_sla" defaultValue={row?.no_sla ?? ""} className={FORM_INPUT} />
          </div>
          <div>
            <label className={FORM_LABEL}>Tanggal SLA</label>
            <input type="date" name="tanggal_sla" defaultValue={row?.tanggal_sla?.slice(0, 10)} className={FORM_INPUT} />
          </div>
        </div>
        <button type="submit" disabled={saving} className={FORM_BUTTON}>
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </section>
  );
}
