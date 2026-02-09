"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";

interface TambahPemohonFormProps {
  onSaved: () => void;
}

export function TambahPemohonForm({ onSaved }: TambahPemohonFormProps) {
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [nama, setNama] = useState("");
  const [noHp, setNoHp] = useState("");
  const [nik, setNik] = useState("");
  const [alamat, setAlamat] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { error: err } = await supabase.from("pemohon").insert({
      nama: nama.trim(),
      no_hp: noHp.trim() || null,
      nik: nik.trim() || null,
      alamat: alamat.trim() || null,
    });
    setError(err?.message ?? null);
    setSaving(false);
    if (!err) {
      setAdding(false);
      setNama("");
      setNoHp("");
      setNik("");
      setAlamat("");
      onSaved();
    }
  }

  return (
    <Card title="Tambah Pemohon Baru">
      <p className="text-xs text-navy-500 mb-3">Buat pemohon baru untuk dipilih di Permohonan.</p>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      {!adding ? (
        <button type="button" onClick={() => setAdding(true)} className="px-4 py-2 bg-gold-500 text-white rounded hover:bg-gold-600 text-sm">
          + Tambah Pemohon
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-navy-600 mb-1">Nama *</label>
            <input value={nama} onChange={(e) => setNama(e.target.value)} required className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-navy-600 mb-1">No. HP</label>
              <input value={noHp} onChange={(e) => setNoHp(e.target.value)} className="w-full px-3 py-2 border border-navy-300 rounded" />
            </div>
            <div>
              <label className="block text-sm text-navy-600 mb-1">NIK</label>
              <input value={nik} onChange={(e) => setNik(e.target.value)} className="w-full px-3 py-2 border border-navy-300 rounded" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">Alamat</label>
            <input value={alamat} onChange={(e) => setAlamat(e.target.value)} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-navy-800 text-white rounded hover:bg-navy-900 disabled:opacity-60 text-sm">
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
            <button type="button" onClick={() => setAdding(false)} className="px-4 py-2 border border-navy-300 rounded text-sm">
              Batal
            </button>
          </div>
        </form>
      )}
    </Card>
  );
}
