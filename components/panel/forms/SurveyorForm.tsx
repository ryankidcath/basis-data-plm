"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Surveyor } from "@/lib/types";
import type { JenisLisensi } from "@/lib/types";
import { Card } from "@/components/ui/Card";

const JENIS_LISENSI: JenisLisensi[] = ["surveyor kadaster", "asisten surveyor kadaster"];

interface SurveyorFormProps {
  onSaved?: () => void;
}

export function SurveyorForm({ onSaved }: SurveyorFormProps) {
  const supabase = createClient();
  const [list, setList] = useState<Surveyor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [nama, setNama] = useState("");
  const [noLisensi, setNoLisensi] = useState("");
  const [jenisLisensi, setJenisLisensi] = useState<JenisLisensi>("surveyor kadaster");
  const [noHp, setNoHp] = useState("");
  const [nik, setNik] = useState("");
  const [alamat, setAlamat] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("surveyor").select("*").order("nama");
      setList((data ?? []) as Surveyor[]);
      setLoading(false);
    })();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { error: err } = await supabase.from("surveyor").insert({
      nama: nama.trim(),
      no_lisensi: noLisensi.trim(),
      jenis_lisensi: jenisLisensi,
      no_hp: noHp.trim() || null,
      nik: nik.trim() || null,
      alamat: alamat.trim() || null,
    });
    setError(err?.message ?? null);
    setSaving(false);
    if (!err) {
      setAdding(false);
      setNama("");
      setNoLisensi("");
      setNoHp("");
      setNik("");
      setAlamat("");
      onSaved?.();
      const { data } = await supabase.from("surveyor").select("*").order("nama");
      setList((data ?? []) as Surveyor[]);
    }
  }

  if (loading) return null;

  return (
    <Card title="Master Surveyor">
      <p className="text-xs text-navy-500 mb-3">Tambah surveyor untuk dipilih di Pengukuran.</p>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      {!adding ? (
        <button type="button" onClick={() => setAdding(true)} className="px-4 py-2 bg-gold-500 text-white rounded hover:bg-gold-600 text-sm">
          + Tambah Surveyor
        </button>
      ) : (
        <form onSubmit={handleAdd} className="space-y-3">
          <div>
            <label className="block text-sm text-navy-600 mb-1">Nama</label>
            <input value={nama} onChange={(e) => setNama(e.target.value)} required className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-navy-600 mb-1">No. Lisensi</label>
              <input value={noLisensi} onChange={(e) => setNoLisensi(e.target.value)} required className="w-full px-3 py-2 border border-navy-300 rounded" />
            </div>
            <div>
              <label className="block text-sm text-navy-600 mb-1">Jenis Lisensi</label>
              <select value={jenisLisensi} onChange={(e) => setJenisLisensi(e.target.value as JenisLisensi)} className="w-full px-3 py-2 border border-navy-300 rounded">
                {JENIS_LISENSI.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
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
      {list.length > 0 && (
        <ul className="mt-4 space-y-1 text-sm text-navy-700">
          {list.map((s) => (
            <li key={s.id}>{s.nama} — {s.no_lisensi}</li>
          ))}
        </ul>
      )}
    </Card>
  );
}
