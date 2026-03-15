"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateStatusPermohonan } from "@/lib/status-permohonan";
import type { BidangTanah } from "@/lib/types";
import { FORM_LABEL, FORM_INPUT, FORM_BUTTON } from "@/lib/formStyles";
import { formatLuasM2 } from "@/lib/format";

interface BidangTanahFormProps {
  permohonanId: string;
  onSaved: () => void;
  embedded?: boolean;
  refreshCount?: number;
}

export function BidangTanahForm({ permohonanId, onSaved, embedded = false, refreshCount = 0 }: BidangTanahFormProps) {
  const supabase = createClient();
  const [rows, setRows] = useState<BidangTanah[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nib, setNib] = useState("");
  const [tanggalNib, setTanggalNib] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("bidang_tanah").select("id, permohonan_id, nib, tanggal_nib, luas_otomatis, created_at, updated_at").eq("permohonan_id", permohonanId);
      setRows((data ?? []) as BidangTanah[]);
      setLoading(false);
    })();
  }, [permohonanId, embedded ? refreshCount : 0]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    if (embedded) {
      const { data: rowWithoutNib } = await supabase
        .from("bidang_tanah")
        .select("id")
        .eq("permohonan_id", permohonanId)
        .or("nib.is.null,nib.eq.")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (rowWithoutNib) {
        const { error: err } = await supabase
          .from("bidang_tanah")
          .update({ nib: nib.trim() || null, tanggal_nib: tanggalNib || null })
          .eq("id", rowWithoutNib.id);
        setError(err?.message ?? null);
        setSaving(false);
        if (!err) {
          setNib("");
          setTanggalNib("");
          await updateStatusPermohonan(permohonanId);
          onSaved();
          const { data } = await supabase.from("bidang_tanah").select("id, permohonan_id, nib, tanggal_nib, luas_otomatis, created_at, updated_at").eq("permohonan_id", permohonanId);
          setRows((data ?? []) as BidangTanah[]);
        }
        return;
      }
      const { error: errInsert } = await supabase.from("bidang_tanah").insert({
        permohonan_id: permohonanId,
        nib: nib.trim() || null,
        tanggal_nib: tanggalNib || null,
      });
      setError(errInsert?.message ?? null);
      setSaving(false);
      if (!errInsert) {
        setNib("");
        setTanggalNib("");
        await updateStatusPermohonan(permohonanId);
        onSaved();
        const { data } = await supabase.from("bidang_tanah").select("id, permohonan_id, nib, tanggal_nib, luas_otomatis, created_at, updated_at").eq("permohonan_id", permohonanId);
        setRows((data ?? []) as BidangTanah[]);
      }
      return;
    }
    const { error: err } = await supabase.from("bidang_tanah").insert({
      permohonan_id: permohonanId,
      nib: nib.trim() || null,
      tanggal_nib: tanggalNib || null,
    });
    setError(err?.message ?? null);
    setSaving(false);
    if (!err) {
      setNib("");
      setTanggalNib("");
      await updateStatusPermohonan(permohonanId);
      onSaved();
      const { data } = await supabase.from("bidang_tanah").select("id, permohonan_id, nib, tanggal_nib, luas_otomatis, created_at, updated_at").eq("permohonan_id", permohonanId);
      setRows((data ?? []) as BidangTanah[]);
    }
  }

  async function handleUpdate(id: string, nibVal: string, tanggalVal: string) {
    const { error: err } = await supabase.from("bidang_tanah").update({ nib: nibVal || null, tanggal_nib: tanggalVal || null }).eq("id", id);
    if (!err) {
      setEditingId(null);
      await updateStatusPermohonan(permohonanId);
      onSaved();
      const { data } = await supabase.from("bidang_tanah").select("id, permohonan_id, nib, tanggal_nib, luas_otomatis, created_at, updated_at").eq("permohonan_id", permohonanId);
      setRows((data ?? []) as BidangTanah[]);
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("bidang_tanah").delete().eq("id", id);
    await updateStatusPermohonan(permohonanId);
    onSaved();
    setRows((r) => r.filter((x) => x.id !== id));
  }

  if (loading) return null;

  const content = (
    <>
      {embedded && (
        <p className="text-xs text-slate-500 mb-3">Upload GeoJSON lalu isi NIB dan simpan, atau isi NIB dulu lalu upload GeoJSON.</p>
      )}
      <form onSubmit={handleAdd} className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={FORM_LABEL}>NIB</label>
            <input value={nib} onChange={(e) => setNib(e.target.value)} className={FORM_INPUT} />
          </div>
          <div>
            <label className={FORM_LABEL}>Tanggal NIB</label>
            <input type="date" value={tanggalNib} onChange={(e) => setTanggalNib(e.target.value)} className={FORM_INPUT} />
          </div>
        </div>
        <button type="submit" disabled={saving} className={FORM_BUTTON}>
          {saving ? "Menambah..." : "Simpan"}
        </button>
      </form>
      {!embedded && (
        <p className="mt-2 text-xs text-slate-500">Gunakan Upload GeoJSON di bawah untuk menambah/ubah geometri.</p>
      )}
      {rows.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm">
          {rows.map((b) => (
            <li key={b.id} className="flex justify-between items-center py-2 border-b border-slate-100">
              {editingId === b.id ? (
                <>
                  <input
                    type="text"
                    defaultValue={b.nib ?? ""}
                    className="flex-1 px-2 py-1 border rounded text-sm"
                    id={`nib-${b.id}`}
                  />
                  <input
                    type="date"
                    defaultValue={b.tanggal_nib?.slice(0, 10)}
                    className="px-2 py-1 border rounded text-sm"
                    id={`tanggal-${b.id}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const nibVal = (document.getElementById(`nib-${b.id}`) as HTMLInputElement)?.value ?? "";
                      const tanggalVal = (document.getElementById(`tanggal-${b.id}`) as HTMLInputElement)?.value ?? "";
                      handleUpdate(b.id, nibVal, tanggalVal);
                    }}
                    className="text-gold-600 text-xs"
                  >
                    Simpan
                  </button>
                  <button type="button" onClick={() => setEditingId(null)} className="text-navy-500 text-xs">
                    Batal
                  </button>
                </>
              ) : (
                <>
                  <span>NIB: {b.nib || "–"} — Luas: {formatLuasM2(b.luas_otomatis, true)}</span>
                  <span>
                    <button type="button" onClick={() => setEditingId(b.id)} className="text-indigo-600 hover:underline text-xs mr-2">
                      Ubah
                    </button>
                    <button type="button" onClick={() => handleDelete(b.id)} className="text-slate-500 hover:text-red-600 text-xs">
                      Hapus
                    </button>
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );

  return content;
}
