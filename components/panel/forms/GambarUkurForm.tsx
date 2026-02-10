"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateStatusPermohonan } from "@/lib/status-permohonan";
import type { GambarUkur } from "@/lib/types";
import { Card } from "@/components/ui/Card";

interface GambarUkurFormProps {
  permohonanId: string;
  onSaved: () => void;
}

export function GambarUkurForm({ permohonanId, onSaved }: GambarUkurFormProps) {
  const supabase = createClient();
  const [row, setRow] = useState<GambarUkur | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("gambar_ukur").select("*").eq("permohonan_id", permohonanId).maybeSingle();
      setRow(data as GambarUkur | null);
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
      no_gu: (form.elements.namedItem("no_gu") as HTMLInputElement).value.trim() || null,
      tanggal_gu: (form.elements.namedItem("tanggal_gu") as HTMLInputElement).value || null,
      tanggal_tte_gu: (form.elements.namedItem("tanggal_tte_gu") as HTMLInputElement).value || null,
      tanggal_upload_gu_tte: (form.elements.namedItem("tanggal_upload_gu_tte") as HTMLInputElement).value || null,
    };
    let err: { message: string } | null = null;
    if (row) {
      const res = await supabase.from("gambar_ukur").update(payload).eq("id", row.id);
      err = res.error;
    } else {
      const res = await supabase.from("gambar_ukur").insert(payload);
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
    <Card title="Gambar Ukur (GU)">
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-navy-600 mb-1">No. GU</label>
            <input name="no_gu" defaultValue={row?.no_gu ?? ""} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">Tanggal GU</label>
            <input type="date" name="tanggal_gu" defaultValue={row?.tanggal_gu?.slice(0, 10)} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">Tanggal TTE</label>
            <input type="date" name="tanggal_tte_gu" defaultValue={row?.tanggal_tte_gu?.slice(0, 10)} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">Tanggal Upload</label>
            <input type="date" name="tanggal_upload_gu_tte" defaultValue={row?.tanggal_upload_gu_tte?.slice(0, 10)} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
        </div>
        <button type="submit" disabled={saving} className="px-4 py-2 bg-navy-800 text-white rounded hover:bg-navy-900 disabled:opacity-60 text-sm">
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </Card>
  );
}
