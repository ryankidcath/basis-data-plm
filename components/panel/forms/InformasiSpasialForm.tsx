"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { InformasiSpasial, InformasiSpasialNib } from "@/lib/types";
import { Card } from "@/components/ui/Card";

interface InformasiSpasialFormProps {
  permohonanId: string;
  onSaved: () => void;
}

export function InformasiSpasialForm({ permohonanId, onSaved }: InformasiSpasialFormProps) {
  const supabase = createClient();
  const [row, setRow] = useState<InformasiSpasial | null>(null);
  const [nibList, setNibList] = useState<InformasiSpasialNib[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddNib, setShowAddNib] = useState(false);
  const [addNibValue, setAddNibValue] = useState("");
  const [addNibSaving, setAddNibSaving] = useState(false);
  const [nibError, setNibError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("informasi_spasial").select("*").eq("permohonan_id", permohonanId).maybeSingle();
      setRow(data as InformasiSpasial | null);
      if (data?.id) {
        const { data: nibData } = await supabase.from("informasi_spasial_nib").select("*").eq("informasi_spasial_id", data.id);
        setNibList((nibData ?? []) as InformasiSpasialNib[]);
      } else {
        setNibList([]);
      }
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
      tanggal_sps: (form.elements.namedItem("tanggal_sps") as HTMLInputElement).value || null,
      biaya: Number((form.elements.namedItem("biaya") as HTMLInputElement).value) || 0,
      tanggal_bayar_sps: (form.elements.namedItem("tanggal_bayar_sps") as HTMLInputElement).value || null,
      tanggal_download_hasil: (form.elements.namedItem("tanggal_download_hasil") as HTMLInputElement).value || null,
    };
    let err: { message: string } | null = null;
    if (row) {
      const res = await supabase.from("informasi_spasial").update(payload).eq("id", row.id);
      err = res.error;
    } else {
      const res = await supabase.from("informasi_spasial").insert(payload).select("id").single();
      err = res.error;
      if (!err && res.data) {
        setRow({ ...payload, id: res.data.id } as InformasiSpasial);
      }
    }
    setError(err?.message ?? null);
    setSaving(false);
    if (!err) onSaved();
  }

  async function handleAddNib() {
    if (!row?.id || !addNibValue.trim()) return;
    setNibError(null);
    setAddNibSaving(true);
    const { data, error: err } = await supabase
      .from("informasi_spasial_nib")
      .insert({ informasi_spasial_id: row.id, nib_bidang_eksisting: addNibValue.trim() })
      .select()
      .single();
    setAddNibSaving(false);
    if (err) {
      setNibError(err.message);
      return;
    }
    setNibList((prev) => [...prev, data as InformasiSpasialNib]);
    setAddNibValue("");
    setShowAddNib(false);
    onSaved();
  }

  async function handleDeleteNib(id: string) {
    await supabase.from("informasi_spasial_nib").delete().eq("id", id);
    setNibList((prev) => prev.filter((n) => n.id !== id));
    onSaved();
  }

  if (loading) return null;

  return (
    <Card title="Informasi Spasial">
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
            <label className="block text-sm text-navy-600 mb-1">Tanggal Download Hasil</label>
            <input type="date" name="tanggal_download_hasil" defaultValue={row?.tanggal_download_hasil?.slice(0, 10)} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
        </div>
        <button type="submit" disabled={saving} className="px-4 py-2 bg-navy-800 text-white rounded hover:bg-navy-900 disabled:opacity-60 text-sm">
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </form>

      <div className="mt-4 pt-4 border-t border-navy-200">
        <h4 className="text-sm font-medium text-navy-700 mb-2">NIB Bidang Eksisting</h4>
        {!row ? (
          <p className="text-xs text-navy-500">Simpan informasi spasial di atas terlebih dahulu untuk menambah NIB.</p>
        ) : (
          <>
            {nibError && <p className="text-sm text-red-600 mb-2">{nibError}</p>}
            {!showAddNib ? (
              <button type="button" onClick={() => setShowAddNib(true)} className="text-sm text-gold-600 hover:text-gold-700">
                + Tambah NIB
              </button>
            ) : (
              <div className="space-y-2 p-2 border border-navy-200 rounded bg-navy-50/50">
                <input
                  value={addNibValue}
                  onChange={(e) => setAddNibValue(e.target.value)}
                  placeholder="NIB bidang eksisting"
                  className="w-full px-3 py-2 border border-navy-300 rounded text-sm"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={handleAddNib} disabled={addNibSaving || !addNibValue.trim()} className="px-3 py-1.5 bg-navy-800 text-white rounded text-sm">
                    {addNibSaving ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button type="button" onClick={() => { setShowAddNib(false); setAddNibValue(""); setNibError(null); }} className="px-3 py-1.5 border border-navy-300 rounded text-sm">
                    Batal
                  </button>
                </div>
              </div>
            )}
            {nibList.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm">
                {nibList.map((n) => (
                  <li key={n.id} className="flex justify-between items-center py-1 border-b border-navy-100">
                    <span>{n.nib_bidang_eksisting || "–"}</span>
                    <button type="button" onClick={() => handleDeleteNib(n.id)} className="text-red-600 hover:underline text-xs">
                      Hapus
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
