"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PetaBidangTanah } from "@/lib/types";
import { Card } from "@/components/ui/Card";

interface PetaBidangTanahFormProps {
  permohonanId: string;
  onSaved: () => void;
}

export function PetaBidangTanahForm({ permohonanId, onSaved }: PetaBidangTanahFormProps) {
  const supabase = createClient();
  const [row, setRow] = useState<PetaBidangTanah | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("peta_bidang_tanah").select("*").eq("permohonan_id", permohonanId).maybeSingle();
      setRow(data as PetaBidangTanah | null);
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
      no_pbt: (form.elements.namedItem("no_pbt") as HTMLInputElement).value.trim() || null,
      tanggal_pbt: (form.elements.namedItem("tanggal_pbt") as HTMLInputElement).value || null,
      tanggal_tte_pbt: (form.elements.namedItem("tanggal_tte_pbt") as HTMLInputElement).value || null,
      tanggal_upload_pbt_tte: (form.elements.namedItem("tanggal_upload_pbt_tte") as HTMLInputElement).value || null,
    };
    let err: { message: string } | null = null;
    if (row) {
      const res = await supabase.from("peta_bidang_tanah").update(payload).eq("id", row.id);
      err = res.error;
    } else {
      const res = await supabase.from("peta_bidang_tanah").insert(payload);
      err = res.error;
    }
    setError(err?.message ?? null);
    setSaving(false);
    if (!err) onSaved();
  }

  if (loading) return null;

  return (
    <Card title="Peta Bidang Tanah (PBT)">
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-navy-600 mb-1">No. PBT</label>
            <input name="no_pbt" defaultValue={row?.no_pbt ?? ""} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">Tanggal PBT</label>
            <input type="date" name="tanggal_pbt" defaultValue={row?.tanggal_pbt?.slice(0, 10)} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">Tanggal TTE</label>
            <input type="date" name="tanggal_tte_pbt" defaultValue={row?.tanggal_tte_pbt?.slice(0, 10)} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">Tanggal Upload</label>
            <input type="date" name="tanggal_upload_pbt_tte" defaultValue={row?.tanggal_upload_pbt_tte?.slice(0, 10)} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
        </div>
        <button type="submit" disabled={saving} className="px-4 py-2 bg-navy-800 text-white rounded hover:bg-navy-900 disabled:opacity-60 text-sm">
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </Card>
  );
}
