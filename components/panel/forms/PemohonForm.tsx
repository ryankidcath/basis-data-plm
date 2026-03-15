"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Permohonan, Pemohon } from "@/lib/types";
import { FORM_LABEL, FORM_INPUT, FORM_SECTION, FORM_SECTION_HEADING, FORM_BUTTON } from "@/lib/formStyles";

interface PemohonFormProps {
  permohonanId: string;
  onSaved: () => void;
}

export function PemohonForm({ permohonanId, onSaved }: PemohonFormProps) {
  const supabase = createClient();
  const [permohonan, setPermohonan] = useState<Permohonan | null>(null);
  const [pemohon, setPemohon] = useState<Pemohon | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: pData } = await supabase.from("permohonan").select("pemohon_id").eq("id", permohonanId).single();
      const perm = pData as Permohonan | null;
      setPermohonan(perm ?? null);
      if (perm?.pemohon_id) {
        const { data: pemData } = await supabase.from("pemohon").select("*").eq("id", perm.pemohon_id).single();
        setPemohon(pemData as Pemohon | null);
      } else {
        setPemohon(null);
      }
      setLoading(false);
    })();
  }, [permohonanId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pemohon) return;
    setSaving(true);
    setError(null);
    const form = e.currentTarget;
    const payload = {
      nama: (form.elements.namedItem("nama") as HTMLInputElement).value.trim(),
      no_hp: (form.elements.namedItem("no_hp") as HTMLInputElement).value.trim() || null,
      nik: (form.elements.namedItem("nik") as HTMLInputElement).value.trim() || null,
      alamat: (form.elements.namedItem("alamat") as HTMLInputElement).value.trim() || null,
    };
    const { error: err } = await supabase.from("pemohon").update(payload).eq("id", pemohon.id);
    setError(err?.message ?? null);
    setSaving(false);
    if (!err) onSaved();
  }

  if (loading) return null;
  if (!permohonan?.pemohon_id || !pemohon) {
    return (
      <section className={FORM_SECTION}>
        <h3 className={FORM_SECTION_HEADING}>Pemohon</h3>
        <p className="text-sm text-slate-500">Pilih pemohon di form Permohonan terlebih dahulu.</p>
      </section>
    );
  }

  return (
    <section className={FORM_SECTION}>
      <h3 className={FORM_SECTION_HEADING}>Pemohon</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <label className={FORM_LABEL}>Nama</label>
          <input name="nama" defaultValue={pemohon.nama} required className={FORM_INPUT} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={FORM_LABEL}>No. HP</label>
            <input name="no_hp" defaultValue={pemohon.no_hp ?? ""} className={FORM_INPUT} />
          </div>
          <div>
            <label className={FORM_LABEL}>NIK</label>
            <input name="nik" defaultValue={pemohon.nik ?? ""} className={FORM_INPUT} />
          </div>
        </div>
        <div>
          <label className={FORM_LABEL}>Alamat</label>
          <input name="alamat" defaultValue={pemohon.alamat ?? ""} className={FORM_INPUT} />
        </div>
        <button type="submit" disabled={saving} className={FORM_BUTTON}>
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </section>
  );
}
