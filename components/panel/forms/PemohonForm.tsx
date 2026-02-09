"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Permohonan, Pemohon } from "@/lib/types";
import { Card } from "@/components/ui/Card";

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
      <Card title="Pemohon">
        <p className="text-sm text-navy-500">Pilih pemohon di form Permohonan terlebih dahulu.</p>
      </Card>
    );
  }

  return (
    <Card title="Pemohon">
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <label className="block text-sm text-navy-600 mb-1">Nama</label>
          <input name="nama" defaultValue={pemohon.nama} required className="w-full px-3 py-2 border border-navy-300 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-navy-600 mb-1">No. HP</label>
            <input name="no_hp" defaultValue={pemohon.no_hp ?? ""} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">NIK</label>
            <input name="nik" defaultValue={pemohon.nik ?? ""} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-navy-600 mb-1">Alamat</label>
          <input name="alamat" defaultValue={pemohon.alamat ?? ""} className="w-full px-3 py-2 border border-navy-300 rounded" />
        </div>
        <button type="submit" disabled={saving} className="px-4 py-2 bg-navy-800 text-white rounded hover:bg-navy-900 disabled:opacity-60 text-sm">
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </Card>
  );
}
