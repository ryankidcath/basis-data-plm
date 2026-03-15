"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Pengukuran, Surveyor, SuratTugasPemberitahuan, JenisLisensi } from "@/lib/types";
import { FORM_LABEL, FORM_INPUT, FORM_SECTION, FORM_SECTION_HEADING, FORM_BUTTON } from "@/lib/formStyles";

const JENIS_LISENSI: JenisLisensi[] = ["surveyor kadaster", "asisten surveyor kadaster"];
const JENIS_LISENSI_LABELS: Record<JenisLisensi, string> = {
  "surveyor kadaster": "Surveyor Kadaster",
  "asisten surveyor kadaster": "Asisten Surveyor Kadaster",
};

interface PengukuranFormProps {
  permohonanId: string;
  onSaved: () => void;
  refreshCount?: number;
}

export function PengukuranForm({ permohonanId, onSaved, refreshCount = 0 }: PengukuranFormProps) {
  const supabase = createClient();
  const [stp, setStp] = useState<SuratTugasPemberitahuan | null>(null);
  const [pengukuranList, setPengukuranList] = useState<(Pengukuran & { surveyor?: Surveyor })[]>([]);
  const [surveyorList, setSurveyorList] = useState<Surveyor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [surveyorId, setSurveyorId] = useState("");
  const [tanggalPengukuran, setTanggalPengukuran] = useState("");
  const [showAddSurveyor, setShowAddSurveyor] = useState(false);
  const [inlineNama, setInlineNama] = useState("");
  const [inlineNoLisensi, setInlineNoLisensi] = useState("");
  const [inlineJenisLisensi, setInlineJenisLisensi] = useState<JenisLisensi>("surveyor kadaster");
  const [inlineNoHp, setInlineNoHp] = useState("");
  const [inlineNik, setInlineNik] = useState("");
  const [inlineAlamat, setInlineAlamat] = useState("");
  const [inlineSaving, setInlineSaving] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [stpRes, surRes] = await Promise.all([
        supabase.from("surat_tugas_pemberitahuan").select("*").eq("permohonan_id", permohonanId).maybeSingle(),
        supabase.from("surveyor").select("*").order("nama"),
      ]);
      const stpData = stpRes.data as SuratTugasPemberitahuan | null;
      setStp(stpData);
      if (stpData?.id) {
        const { data } = await supabase.from("pengukuran").select("*, surveyor:surveyor(*)").eq("surat_tugas_id", stpData.id);
        setPengukuranList((data ?? []) as (Pengukuran & { surveyor?: Surveyor })[]);
      } else {
        setPengukuranList([]);
      }
      setSurveyorList((surRes.data ?? []) as Surveyor[]);
      setLoading(false);
    })();
  }, [permohonanId, refreshCount]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!stp?.id || !surveyorId || !tanggalPengukuran) return;
    setSaving(true);
    setError(null);
    const { error: err } = await supabase.from("pengukuran").insert({
      surat_tugas_id: stp.id,
      surveyor_id: surveyorId,
      tanggal_pengukuran: tanggalPengukuran,
    });
    setError(err?.message ?? null);
    setSaving(false);
    if (!err) {
      setSurveyorId("");
      setTanggalPengukuran("");
      onSaved();
      const { data } = await supabase.from("pengukuran").select("*, surveyor:surveyor(*)").eq("surat_tugas_id", stp.id);
      setPengukuranList((data ?? []) as (Pengukuran & { surveyor?: Surveyor })[]);
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("pengukuran").delete().eq("id", id);
    onSaved();
    if (stp?.id) {
      const { data } = await supabase.from("pengukuran").select("*, surveyor:surveyor(*)").eq("surat_tugas_id", stp.id);
      setPengukuranList((data ?? []) as (Pengukuran & { surveyor?: Surveyor })[]);
    }
  }

  async function handleSaveNewSurveyor() {
    if (!inlineNama.trim() || !inlineNoLisensi.trim()) return;
    setInlineError(null);
    setInlineSaving(true);
    const { data: newRow, error: err } = await supabase
      .from("surveyor")
      .insert({
        nama: inlineNama.trim(),
        no_lisensi: inlineNoLisensi.trim(),
        jenis_lisensi: inlineJenisLisensi,
        no_hp: inlineNoHp.trim() || null,
        nik: inlineNik.trim() || null,
        alamat: inlineAlamat.trim() || null,
      })
      .select("id")
      .single();
    setInlineSaving(false);
    if (err) {
      setInlineError(err.message);
      return;
    }
    const { data: list } = await supabase.from("surveyor").select("*").order("nama");
    setSurveyorList((list ?? []) as Surveyor[]);
    if (newRow?.id) setSurveyorId(newRow.id);
    setShowAddSurveyor(false);
    setInlineNama("");
    setInlineNoLisensi("");
    setInlineNoHp("");
    setInlineNik("");
    setInlineAlamat("");
    onSaved();
  }

  if (loading) return null;
  if (!stp) {
    return (
      <section className={FORM_SECTION}>
        <h3 className={FORM_SECTION_HEADING}>Pengukuran</h3>
        <p className="text-sm text-slate-500">Isi Surat Tugas & Pemberitahuan terlebih dahulu.</p>
      </section>
    );
  }

  return (
    <section className={FORM_SECTION}>
      <h3 className={FORM_SECTION_HEADING}>Pengukuran</h3>
      <form onSubmit={handleAdd} className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={FORM_LABEL}>Surveyor Berlisensi</label>
            <select value={surveyorId} onChange={(e) => setSurveyorId(e.target.value)} required className={FORM_INPUT}>
              <option value="">– Pilih –</option>
              {surveyorList.map((s) => (
                <option key={s.id} value={s.id}>{s.nama}</option>
              ))}
            </select>
            {!showAddSurveyor ? (
              <button type="button" onClick={() => setShowAddSurveyor(true)} className="mt-1 text-sm text-indigo-600 hover:text-indigo-700">
                + Tambah surveyor baru
              </button>
            ) : (
              <div className="mt-3 p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-2">
                {inlineError && <p className="text-sm text-red-600">{inlineError}</p>}
                <div>
                  <label className={FORM_LABEL}>Nama *</label>
                  <input value={inlineNama} onChange={(e) => setInlineNama(e.target.value)} className={FORM_INPUT} />
                </div>
                <div>
                  <label className={FORM_LABEL}>No. Lisensi *</label>
                  <input value={inlineNoLisensi} onChange={(e) => setInlineNoLisensi(e.target.value)} className={FORM_INPUT} />
                </div>
                <div>
                  <label className={FORM_LABEL}>Jenis Lisensi</label>
                  <select value={inlineJenisLisensi} onChange={(e) => setInlineJenisLisensi(e.target.value as JenisLisensi)} className={FORM_INPUT}>
                    {JENIS_LISENSI.map((v) => (
                      <option key={v} value={v}>{JENIS_LISENSI_LABELS[v]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={FORM_LABEL}>No. HP</label>
                  <input value={inlineNoHp} onChange={(e) => setInlineNoHp(e.target.value)} className={FORM_INPUT} />
                </div>
                <div>
                  <label className={FORM_LABEL}>NIK</label>
                  <input value={inlineNik} onChange={(e) => setInlineNik(e.target.value)} className={FORM_INPUT} />
                </div>
                <div>
                  <label className={FORM_LABEL}>Alamat</label>
                  <input value={inlineAlamat} onChange={(e) => setInlineAlamat(e.target.value)} className={FORM_INPUT} />
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={handleSaveNewSurveyor} disabled={inlineSaving || !inlineNama.trim() || !inlineNoLisensi.trim()} className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-60">
                    {inlineSaving ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button type="button" onClick={() => { setShowAddSurveyor(false); setInlineError(null); }} className="px-3 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className={FORM_LABEL}>Tanggal Pengukuran</label>
            <input type="date" value={tanggalPengukuran} onChange={(e) => setTanggalPengukuran(e.target.value)} required className={FORM_INPUT} />
          </div>
        </div>
        <button type="submit" disabled={saving} className={FORM_BUTTON}>
          {saving ? "Menambah..." : "Tambah Pengukuran"}
        </button>
      </form>
      {pengukuranList.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm">
          {pengukuranList.map((p) => (
            <li key={p.id} className="flex justify-between items-center py-2 border-b border-slate-100">
              <span>{p.surveyor?.nama ?? p.surveyor_id} — {p.tanggal_pengukuran?.slice(0, 10)}</span>
              <button type="button" onClick={() => handleDelete(p.id)} className="text-slate-500 hover:text-red-600 text-xs">
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
