"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Permohonan, Pemohon, Klien } from "@/lib/types";
import type { PenggunaanTanah1 } from "@/lib/types";
import { FORM_LABEL, FORM_INPUT, FORM_SECTION, FORM_SECTION_HEADING, FORM_BUTTON } from "@/lib/formStyles";
import { FormattedIntegerInput } from "@/components/ui/FormattedIntegerInput";
import { PENGGUNAAN_TANAH_1_LABELS } from "@/lib/format";
import { KABUPATEN_CIREBON, KECAMATAN_LIST, getDesaByKecamatan } from "@/lib/wilayah";

const PENGGUNAAN_TANAH_1: PenggunaanTanah1[] = [
  "pertanian/perkebunan",
  "hunian/pekarangan",
  "komersial",
  "industri",
  "pertambangan",
];

interface PermohonanFormProps {
  permohonanId: string;
  onSaved: () => void;
  refreshCount?: number;
}

export function PermohonanForm({ permohonanId, onSaved, refreshCount = 0 }: PermohonanFormProps) {
  const supabase = createClient();
  const [permohonan, setPermohonan] = useState<Permohonan | null>(null);
  const [pemohonList, setPemohonList] = useState<Pemohon[]>([]);
  const [klienList, setKlienList] = useState<Klien[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedDesa, setSelectedDesa] = useState("");

  useEffect(() => {
    (async () => {
      const [pRes, pemRes, kRes] = await Promise.all([
        supabase.from("permohonan").select("*").eq("id", permohonanId).single(),
        supabase.from("pemohon").select("*").order("nama"),
        supabase.from("klien").select("*").order("nama"),
      ]);
      if (pRes.data) {
        const p = pRes.data as Permohonan;
        setPermohonan(p);
        const k = p.kecamatan?.trim() ?? "";
        const d = p.kelurahan_desa?.trim() ?? "";
        setSelectedKecamatan(KECAMATAN_LIST.includes(k) ? k : "");
        setSelectedDesa(k && getDesaByKecamatan(k).includes(d) ? d : "");
      }
      setPemohonList((pemRes.data ?? []) as Pemohon[]);
      setKlienList((kRes.data ?? []) as Klien[]);
      setLoading(false);
    })();
  }, [permohonanId, refreshCount]);

  const KODE_KJSB_REGEX = /^BKS-\d{4}-\d{1,4}$/;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!permohonan) return;
    const form = e.currentTarget;
    const kodeKjsb = (form.elements.namedItem("kode_kjsb") as HTMLInputElement).value.trim();
    if (!KODE_KJSB_REGEX.test(kodeKjsb)) {
      setError("Kode KJSB harus berformat BKS-YYYY-XXXX (contoh: BKS-2024-0001).");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      kode_kjsb: kodeKjsb,
      pemohon_id: (form.elements.namedItem("pemohon_id") as HTMLSelectElement).value,
      klien_id: (form.elements.namedItem("klien_id") as HTMLSelectElement).value || null,
      tanggal_permohonan: (form.elements.namedItem("tanggal_permohonan") as HTMLInputElement).value,
      luas_permohonan: Number((form.elements.namedItem("luas_permohonan") as HTMLInputElement).value) || 0,
      penggunaan_tanah_1: (form.elements.namedItem("penggunaan_tanah_1") as HTMLSelectElement).value as PenggunaanTanah1,
      lokasi_tanah: (form.elements.namedItem("lokasi_tanah") as HTMLInputElement).value.trim() || null,
      kota_kabupaten: (form.elements.namedItem("kota_kabupaten") as HTMLSelectElement).value?.trim() || null,
      kecamatan: (form.elements.namedItem("kecamatan") as HTMLSelectElement).value?.trim() || null,
      kelurahan_desa: (form.elements.namedItem("kelurahan_desa") as HTMLSelectElement).value?.trim() || null,
    };
    const { error: err } = await supabase.from("permohonan").update(payload).eq("id", permohonanId);
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    onSaved();
  }

  if (loading || !permohonan) return null;

  return (
    <section className={FORM_SECTION}>
      <h3 className={FORM_SECTION_HEADING}>Permohonan</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <label className={FORM_LABEL}>Kode KJSB</label>
          <input name="kode_kjsb" defaultValue={permohonan.kode_kjsb} required className={FORM_INPUT} placeholder="Contoh: BKS-2024-0001" />
        </div>
        <div>
          <label className={FORM_LABEL}>Pemohon</label>
          <select name="pemohon_id" defaultValue={permohonan.pemohon_id} required className={FORM_INPUT}>
            {pemohonList.map((p) => (
              <option key={p.id} value={p.id}>{p.nama}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={FORM_LABEL}>Klien (opsional)</label>
          <select name="klien_id" defaultValue={permohonan.klien_id ?? ""} className={FORM_INPUT}>
            <option value="">–</option>
            {klienList.map((k) => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={FORM_LABEL}>Tanggal Permohonan</label>
            <input type="date" name="tanggal_permohonan" defaultValue={permohonan.tanggal_permohonan?.slice(0, 10)} className={FORM_INPUT} />
          </div>
          <div>
            <label className={FORM_LABEL}>Luas (m²)</label>
            <FormattedIntegerInput name="luas_permohonan" defaultValue={permohonan.luas_permohonan} className={FORM_INPUT} />
          </div>
        </div>
        <div>
          <label className={FORM_LABEL}>Penggunaan Tanah</label>
          <select name="penggunaan_tanah_1" defaultValue={permohonan.penggunaan_tanah_1} className={FORM_INPUT}>
            {PENGGUNAAN_TANAH_1.map((v) => (
              <option key={v} value={v}>{PENGGUNAAN_TANAH_1_LABELS[v] ?? v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={FORM_LABEL}>Lokasi Tanah</label>
          <input name="lokasi_tanah" defaultValue={permohonan.lokasi_tanah ?? ""} className={FORM_INPUT} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={FORM_LABEL}>Kota/Kabupaten</label>
            <select name="kota_kabupaten" className={FORM_INPUT} defaultValue={KABUPATEN_CIREBON}>
              <option value={KABUPATEN_CIREBON}>{KABUPATEN_CIREBON}</option>
            </select>
          </div>
          <div>
            <label className={FORM_LABEL}>Kecamatan</label>
            <select
              name="kecamatan"
              value={selectedKecamatan}
              onChange={(e) => {
                setSelectedKecamatan(e.target.value);
                setSelectedDesa("");
              }}
              className={FORM_INPUT}
            >
              <option value="">– Pilih Kecamatan –</option>
              {permohonan.kecamatan?.trim() && !KECAMATAN_LIST.includes(permohonan.kecamatan.trim()) && (
                <option value={permohonan.kecamatan}>{permohonan.kecamatan}</option>
              )}
              {KECAMATAN_LIST.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={FORM_LABEL}>Kelurahan/Desa</label>
            <select
              name="kelurahan_desa"
              value={selectedDesa}
              onChange={(e) => setSelectedDesa(e.target.value)}
              disabled={!selectedKecamatan}
              className={`${FORM_INPUT} disabled:opacity-60`}
            >
              <option value="">{selectedKecamatan ? "– Pilih Desa –" : "– Pilih Kecamatan dulu –"}</option>
              {permohonan.kelurahan_desa?.trim() && selectedKecamatan && !getDesaByKecamatan(selectedKecamatan).includes(permohonan.kelurahan_desa.trim()) && (
                <option value={permohonan.kelurahan_desa}>{permohonan.kelurahan_desa}</option>
              )}
              {getDesaByKecamatan(selectedKecamatan).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className={FORM_LABEL}>Status Permohonan</label>
          <p className="px-3 py-2 bg-slate-50 text-slate-800 rounded-lg border border-slate-200 text-sm">
            {permohonan.status_permohonan ?? "–"}
          </p>
          <p className="text-xs text-slate-500 mt-1">Status diisi otomatis menurut tahapan data.</p>
        </div>
        <button type="submit" disabled={saving} className={FORM_BUTTON}>
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </section>
  );
}
