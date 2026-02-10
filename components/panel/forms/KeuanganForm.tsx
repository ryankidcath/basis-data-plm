"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateStatusPermohonan } from "@/lib/status-permohonan";
import type { Keuangan } from "@/lib/types";
import { Card } from "@/components/ui/Card";
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
    <Card title="Keuangan (Invoice, Kwitansi)">
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-navy-600 mb-1">No. Invoice</label>
            <input name="no_invoice" defaultValue={row?.no_invoice ?? ""} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">Tanggal Invoice</label>
            <input type="date" name="tanggal_invoice" defaultValue={row?.tanggal_invoice?.slice(0, 10)} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-navy-600 mb-1">No. Kwitansi</label>
            <input name="no_kwitansi" defaultValue={row?.no_kwitansi ?? ""} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">Tanggal Kwitansi</label>
            <input type="date" name="tanggal_kwitansi" defaultValue={row?.tanggal_kwitansi?.slice(0, 10)} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-navy-600 mb-1">Biaya Pengukuran</label>
          <FormattedIntegerInput name="biaya_pengukuran" defaultValue={row?.biaya_pengukuran ?? 0} className="w-full px-3 py-2 border border-navy-300 rounded" />
        </div>
        <button type="submit" disabled={saving} className="px-4 py-2 bg-navy-800 text-white rounded hover:bg-navy-900 disabled:opacity-60 text-sm">
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </Card>
  );
}
