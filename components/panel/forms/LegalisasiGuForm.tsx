"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { LegalisasiGu } from "@/lib/types";
import type { PenggunaanTanah2 } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { PENGGUNAAN_TANAH_2_LABELS } from "@/lib/format";

const PENGGUNAAN_TANAH_2: PenggunaanTanah2[] = ["pertanian", "non-pertanian"];

interface LegalisasiGuFormProps {
  permohonanId: string;
  onSaved: () => void;
}

export function LegalisasiGuForm({ permohonanId, onSaved }: LegalisasiGuFormProps) {
  const supabase = createClient();
  const [row, setRow] = useState<LegalisasiGu | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("legalisasi_gu").select("*").eq("permohonan_id", permohonanId).maybeSingle();
      setRow(data as LegalisasiGu | null);
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
      no_berkas: (form.elements.namedItem("no_berkas") as HTMLInputElement).value.trim() || null,
      tanggal_berkas: (form.elements.namedItem("tanggal_berkas") as HTMLInputElement).value || null,
      luas_hasil_ukur: Number((form.elements.namedItem("luas_hasil_ukur") as HTMLInputElement).value) || null,
      penggunaan_tanah_2: (form.elements.namedItem("penggunaan_tanah_2") as HTMLSelectElement).value as PenggunaanTanah2 || null,
      tanggal_sps: (form.elements.namedItem("tanggal_sps") as HTMLInputElement).value || null,
      biaya: Number((form.elements.namedItem("biaya") as HTMLInputElement).value) || 0,
      tanggal_bayar_sps: (form.elements.namedItem("tanggal_bayar_sps") as HTMLInputElement).value || null,
      tanggal_penyelesaian: (form.elements.namedItem("tanggal_penyelesaian") as HTMLInputElement).value || null,
    };
    let err: { message: string } | null = null;
    if (row) {
      const res = await supabase.from("legalisasi_gu").update(payload).eq("id", row.id);
      err = res.error;
    } else {
      const res = await supabase.from("legalisasi_gu").insert(payload);
      err = res.error;
    }
    setError(err?.message ?? null);
    setSaving(false);
    if (!err) onSaved();
  }

  if (loading) return null;

  return (
    <Card title="Legalisasi GU">
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-navy-600 mb-1">No. Berkas</label>
            <input name="no_berkas" defaultValue={row?.no_berkas ?? ""} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">Tanggal Berkas</label>
            <input type="date" name="tanggal_berkas" defaultValue={row?.tanggal_berkas?.slice(0, 10)} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">Luas Hasil Ukur (m²)</label>
            <input type="number" name="luas_hasil_ukur" defaultValue={row?.luas_hasil_ukur ?? ""} step="any" className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">Penggunaan Tanah</label>
            <select name="penggunaan_tanah_2" defaultValue={row?.penggunaan_tanah_2 ?? ""} className="w-full px-3 py-2 border border-navy-300 rounded">
              <option value="">–</option>
              {PENGGUNAAN_TANAH_2.map((v) => (
                <option key={v} value={v}>{PENGGUNAAN_TANAH_2_LABELS[v] ?? v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">Tanggal SPS</label>
            <input type="date" name="tanggal_sps" defaultValue={row?.tanggal_sps?.slice(0, 10)} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">Biaya</label>
            <input type="number" name="biaya" defaultValue={row?.biaya ?? 0} step="any" className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">Tanggal Bayar SPS</label>
            <input type="date" name="tanggal_bayar_sps" defaultValue={row?.tanggal_bayar_sps?.slice(0, 10)} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">Tanggal Penyelesaian</label>
            <input type="date" name="tanggal_penyelesaian" defaultValue={row?.tanggal_penyelesaian?.slice(0, 10)} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
        </div>
        <button type="submit" disabled={saving} className="px-4 py-2 bg-navy-800 text-white rounded hover:bg-navy-900 disabled:opacity-60 text-sm">
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </Card>
  );
}
