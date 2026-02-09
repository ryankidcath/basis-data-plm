"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Permohonan, Pemohon, Klien } from "@/lib/types";
import type { PenggunaanTanah1 } from "@/lib/types";
import { Card } from "@/components/ui/Card";
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
      status_permohonan: (form.elements.namedItem("status_permohonan") as HTMLInputElement).value.trim() || null,
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
    <Card title="Permohonan">
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <label className="block text-sm text-navy-600 mb-1">Kode KJSB</label>
          <input name="kode_kjsb" defaultValue={permohonan.kode_kjsb} required className="w-full px-3 py-2 border border-navy-300 rounded" placeholder="Contoh: BKS-2024-0001" />
        </div>
        <div>
          <label className="block text-sm text-navy-600 mb-1">Pemohon</label>
          <select name="pemohon_id" defaultValue={permohonan.pemohon_id} required className="w-full px-3 py-2 border border-navy-300 rounded">
            {pemohonList.map((p) => (
              <option key={p.id} value={p.id}>{p.nama}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-navy-600 mb-1">Klien (opsional)</label>
          <select name="klien_id" defaultValue={permohonan.klien_id ?? ""} className="w-full px-3 py-2 border border-navy-300 rounded">
            <option value="">–</option>
            {klienList.map((k) => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-navy-600 mb-1">Tanggal Permohonan</label>
            <input type="date" name="tanggal_permohonan" defaultValue={permohonan.tanggal_permohonan?.slice(0, 10)} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">Luas (m²)</label>
            <FormattedIntegerInput name="luas_permohonan" defaultValue={permohonan.luas_permohonan} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-navy-600 mb-1">Penggunaan Tanah</label>
          <select name="penggunaan_tanah_1" defaultValue={permohonan.penggunaan_tanah_1} className="w-full px-3 py-2 border border-navy-300 rounded">
            {PENGGUNAAN_TANAH_1.map((v) => (
              <option key={v} value={v}>{PENGGUNAAN_TANAH_1_LABELS[v] ?? v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-navy-600 mb-1">Lokasi Tanah</label>
          <input name="lokasi_tanah" defaultValue={permohonan.lokasi_tanah ?? ""} className="w-full px-3 py-2 border border-navy-300 rounded" />
        </div>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm text-navy-600 mb-1">Kota/Kabupaten</label>
            <select name="kota_kabupaten" className="w-full px-3 py-2 border border-navy-300 rounded" defaultValue={KABUPATEN_CIREBON}>
              <option value={KABUPATEN_CIREBON}>{KABUPATEN_CIREBON}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">Kecamatan</label>
            <select
              name="kecamatan"
              value={selectedKecamatan}
              onChange={(e) => {
                setSelectedKecamatan(e.target.value);
                setSelectedDesa("");
              }}
              className="w-full px-3 py-2 border border-navy-300 rounded"
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
            <label className="block text-sm text-navy-600 mb-1">Kelurahan/Desa</label>
            <select
              name="kelurahan_desa"
              value={selectedDesa}
              onChange={(e) => setSelectedDesa(e.target.value)}
              disabled={!selectedKecamatan}
              className="w-full px-3 py-2 border border-navy-300 rounded disabled:opacity-60"
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
          <label className="block text-sm text-navy-600 mb-1">Status Permohonan</label>
          <input name="status_permohonan" defaultValue={permohonan.status_permohonan ?? ""} className="w-full px-3 py-2 border border-navy-300 rounded" />
        </div>
        <button type="submit" disabled={saving} className="px-4 py-2 bg-navy-800 text-white rounded hover:bg-navy-900 disabled:opacity-60 text-sm">
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </Card>
  );
}
