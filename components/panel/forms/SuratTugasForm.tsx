"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateStatusPermohonan } from "@/lib/status-permohonan";
import type { SuratTugasPemberitahuan } from "@/lib/types";
import { Card } from "@/components/ui/Card";

interface SuratTugasFormProps {
  permohonanId: string;
  onSaved: () => void;
}

export function SuratTugasForm({ permohonanId, onSaved }: SuratTugasFormProps) {
  const supabase = createClient();
  const [row, setRow] = useState<SuratTugasPemberitahuan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("surat_tugas_pemberitahuan").select("*").eq("permohonan_id", permohonanId).maybeSingle();
      setRow(data as SuratTugasPemberitahuan | null);
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
      no_surat_tugas: (form.elements.namedItem("no_surat_tugas") as HTMLInputElement).value.trim() || null,
      tanggal_surat_tugas: (form.elements.namedItem("tanggal_surat_tugas") as HTMLInputElement).value || null,
      no_surat_pemberitahuan: (form.elements.namedItem("no_surat_pemberitahuan") as HTMLInputElement).value.trim() || null,
      tanggal_surat_pemberitahuan: (form.elements.namedItem("tanggal_surat_pemberitahuan") as HTMLInputElement).value || null,
    };
    let err: { message: string } | null = null;
    if (row) {
      const res = await supabase.from("surat_tugas_pemberitahuan").update(payload).eq("id", row.id);
      err = res.error;
    } else {
      const res = await supabase.from("surat_tugas_pemberitahuan").insert(payload);
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
    <Card title="Surat Tugas & Pemberitahuan">
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-navy-600 mb-1">No. Surat Tugas</label>
            <input name="no_surat_tugas" defaultValue={row?.no_surat_tugas ?? ""} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">Tanggal Surat Tugas</label>
            <input type="date" name="tanggal_surat_tugas" defaultValue={row?.tanggal_surat_tugas?.slice(0, 10)} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-navy-600 mb-1">No. Surat Pemberitahuan</label>
            <input name="no_surat_pemberitahuan" defaultValue={row?.no_surat_pemberitahuan ?? ""} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">Tanggal Surat Pemberitahuan</label>
            <input type="date" name="tanggal_surat_pemberitahuan" defaultValue={row?.tanggal_surat_pemberitahuan?.slice(0, 10)} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
        </div>
        <button type="submit" disabled={saving} className="px-4 py-2 bg-navy-800 text-white rounded hover:bg-navy-900 disabled:opacity-60 text-sm">
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </Card>
  );
}
