"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Permohonan, Klien } from "@/lib/types";
import { Card } from "@/components/ui/Card";

interface KlienFormProps {
  permohonanId: string;
  onSaved: () => void;
}

export function KlienForm({ permohonanId, onSaved }: KlienFormProps) {
  const supabase = createClient();
  const [permohonan, setPermohonan] = useState<Permohonan | null>(null);
  const [klien, setKlien] = useState<Klien | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: pData } = await supabase.from("permohonan").select("klien_id").eq("id", permohonanId).single();
      const perm = pData as Permohonan | null;
      setPermohonan(perm ?? null);
      if (perm?.klien_id) {
        const { data: kData } = await supabase.from("klien").select("*").eq("id", perm.klien_id).single();
        setKlien(kData as Klien | null);
      } else {
        setKlien(null);
      }
      setLoading(false);
    })();
  }, [permohonanId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!klien) return;
    setSaving(true);
    setError(null);
    const form = e.currentTarget;
    const payload = {
      nama: (form.elements.namedItem("nama") as HTMLInputElement).value.trim(),
      no_hp: (form.elements.namedItem("no_hp") as HTMLInputElement).value.trim() || null,
    };
    const { error: err } = await supabase.from("klien").update(payload).eq("id", klien.id);
    setError(err?.message ?? null);
    setSaving(false);
    if (!err) onSaved();
  }

  if (loading) return null;
  if (!permohonan?.klien_id || !klien) {
    return (
      <Card title="Klien">
        <p className="text-sm text-navy-500">Pilih klien di form Permohonan jika ada.</p>
      </Card>
    );
  }

  return (
    <Card title="Klien">
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <label className="block text-sm text-navy-600 mb-1">Nama</label>
          <input name="nama" defaultValue={klien.nama} required className="w-full px-3 py-2 border border-navy-300 rounded" />
        </div>
        <div>
          <label className="block text-sm text-navy-600 mb-1">No. HP</label>
          <input name="no_hp" defaultValue={klien.no_hp ?? ""} className="w-full px-3 py-2 border border-navy-300 rounded" />
        </div>
        <button type="submit" disabled={saving} className="px-4 py-2 bg-navy-800 text-white rounded hover:bg-navy-900 disabled:opacity-60 text-sm">
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </Card>
  );
}
