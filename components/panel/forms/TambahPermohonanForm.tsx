"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Pemohon, Klien } from "@/lib/types";
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

interface TambahPermohonanFormProps {
  onCreated: (permohonanId: string) => void;
  refreshCount?: number;
}

export function TambahPermohonanForm({ onCreated, refreshCount = 0 }: TambahPermohonanFormProps) {
  const supabase = createClient();
  const [pemohonList, setPemohonList] = useState<Pemohon[]>([]);
  const [klienList, setKlienList] = useState<Klien[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedPemohonId, setSelectedPemohonId] = useState<string>("");
  const [selectedKlienId, setSelectedKlienId] = useState<string>("");
  const [showAddPemohon, setShowAddPemohon] = useState(false);
  const [showAddKlien, setShowAddKlien] = useState(false);

  const [addPemohonSaving, setAddPemohonSaving] = useState(false);
  const [addKlienSaving, setAddKlienSaving] = useState(false);
  const [addPemohonNama, setAddPemohonNama] = useState("");
  const [addPemohonNoHp, setAddPemohonNoHp] = useState("");
  const [addPemohonNik, setAddPemohonNik] = useState("");
  const [addPemohonAlamat, setAddPemohonAlamat] = useState("");
  const [addKlienNama, setAddKlienNama] = useState("");
  const [addKlienNoHp, setAddKlienNoHp] = useState("");
  const [addPemohonError, setAddPemohonError] = useState<string | null>(null);
  const [addKlienError, setAddKlienError] = useState<string | null>(null);

  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedDesa, setSelectedDesa] = useState("");

  useEffect(() => {
    (async () => {
      const [pemRes, kRes] = await Promise.all([
        supabase.from("pemohon").select("*").order("nama"),
        supabase.from("klien").select("*").order("nama"),
      ]);
      setPemohonList((pemRes.data ?? []) as Pemohon[]);
      setKlienList((kRes.data ?? []) as Klien[]);
      setLoading(false);
    })();
  }, [refreshCount]);

  async function handleAddPemohon(e?: React.FormEvent) {
    e?.preventDefault();
    setAddPemohonError(null);
    setAddPemohonSaving(true);
    const { data, error: err } = await supabase
      .from("pemohon")
      .insert({
        nama: addPemohonNama.trim(),
        no_hp: addPemohonNoHp.trim() || null,
        nik: addPemohonNik.trim() || null,
        alamat: addPemohonAlamat.trim() || null,
      })
      .select("id")
      .single();
    setAddPemohonSaving(false);
    if (err || !data?.id) {
      setAddPemohonError(err?.message ?? "Gagal menyimpan pemohon.");
      return;
    }
    const { data: list } = await supabase.from("pemohon").select("*").order("nama");
    setPemohonList((list ?? []) as Pemohon[]);
    setSelectedPemohonId(data.id);
    setShowAddPemohon(false);
    setAddPemohonNama("");
    setAddPemohonNoHp("");
    setAddPemohonNik("");
    setAddPemohonAlamat("");
  }

  async function handleAddKlien(e?: React.FormEvent) {
    e?.preventDefault();
    setAddKlienError(null);
    setAddKlienSaving(true);
    const { data, error: err } = await supabase
      .from("klien")
      .insert({
        nama: addKlienNama.trim(),
        no_hp: addKlienNoHp.trim() || null,
      })
      .select("id")
      .single();
    setAddKlienSaving(false);
    if (err || !data?.id) {
      setAddKlienError(err?.message ?? "Gagal menyimpan klien.");
      return;
    }
    const { data: list } = await supabase.from("klien").select("*").order("nama");
    setKlienList((list ?? []) as Klien[]);
    setSelectedKlienId(data.id);
    setShowAddKlien(false);
    setAddKlienNama("");
    setAddKlienNoHp("");
  }

  const KODE_KJSB_REGEX = /^BKS-\d{4}-\d{1,4}$/;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedPemohonId) {
      setError("Pilih atau tambah pemohon terlebih dahulu.");
      return;
    }
    const form = e.currentTarget;
    const kodeKjsb = (form.elements.namedItem("kode_kjsb") as HTMLInputElement).value.trim();
    if (!KODE_KJSB_REGEX.test(kodeKjsb)) {
      setError("Kode KJSB harus berformat BKS-YYYY-XXXX (contoh: BKS-2024-0001).");
      return;
    }
    setSaving(true);
    setError(null);
    const { data, error: err } = await supabase.from("permohonan").insert({
      kode_kjsb: kodeKjsb,
      pemohon_id: selectedPemohonId,
      klien_id: selectedKlienId || null,
      tanggal_permohonan: (form.elements.namedItem("tanggal_permohonan") as HTMLInputElement).value,
      luas_permohonan: Number((form.elements.namedItem("luas_permohonan") as HTMLInputElement).value) || 0,
      penggunaan_tanah_1: (form.elements.namedItem("penggunaan_tanah_1") as HTMLSelectElement).value as PenggunaanTanah1,
      lokasi_tanah: (form.elements.namedItem("lokasi_tanah") as HTMLInputElement).value.trim() || null,
      kota_kabupaten: (form.elements.namedItem("kota_kabupaten") as HTMLSelectElement).value?.trim() || null,
      kecamatan: (form.elements.namedItem("kecamatan") as HTMLSelectElement).value?.trim() || null,
      kelurahan_desa: (form.elements.namedItem("kelurahan_desa") as HTMLSelectElement).value?.trim() || null,
      status_permohonan: "draft",
    }).select("id").single();
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (data?.id) onCreated(data.id);
  }

  if (loading) return null;

  return (
    <Card title="Tambah Permohonan Baru">
      <p className="text-xs text-navy-500 mb-3">Pilih pemohon dan klien (jika ada), atau tambah baru jika belum ada di list.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <label className="block text-sm text-navy-600 mb-1">Kode KJSB *</label>
          <input name="kode_kjsb" required className="w-full px-3 py-2 border border-navy-300 rounded" placeholder="Contoh: BKS-2024-0001" />
        </div>

        <div>
          <label className="block text-sm text-navy-600 mb-1">Pemohon *</label>
          <select
            name="pemohon_id"
            value={selectedPemohonId}
            onChange={(e) => setSelectedPemohonId(e.target.value)}
            className="w-full px-3 py-2 border border-navy-300 rounded"
          >
            <option value="">– Pilih Pemohon –</option>
            {pemohonList.map((p) => (
              <option key={p.id} value={p.id}>{p.nama}</option>
            ))}
          </select>
          {!showAddPemohon ? (
            <button
              type="button"
              onClick={() => setShowAddPemohon(true)}
              className="mt-1 text-sm text-gold-600 hover:text-gold-700"
            >
              + Tambah pemohon baru
            </button>
          ) : (
            <div className="mt-3 p-3 border border-navy-200 rounded-lg bg-navy-50/50 space-y-2">
              <p className="text-xs font-medium text-navy-600">Form pemohon baru</p>
              {addPemohonError && <p className="text-sm text-red-600">{addPemohonError}</p>}
              <div className="space-y-2">
                <input
                  value={addPemohonNama}
                  onChange={(e) => setAddPemohonNama(e.target.value)}
                  placeholder="Nama *"
                  required
                  className="w-full px-3 py-2 border border-navy-300 rounded text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={addPemohonNoHp}
                    onChange={(e) => setAddPemohonNoHp(e.target.value)}
                    placeholder="No. HP"
                    className="w-full px-3 py-2 border border-navy-300 rounded text-sm"
                  />
                  <input
                    value={addPemohonNik}
                    onChange={(e) => setAddPemohonNik(e.target.value)}
                    placeholder="NIK"
                    className="w-full px-3 py-2 border border-navy-300 rounded text-sm"
                  />
                </div>
                <input
                  value={addPemohonAlamat}
                  onChange={(e) => setAddPemohonAlamat(e.target.value)}
                  placeholder="Alamat"
                  className="w-full px-3 py-2 border border-navy-300 rounded text-sm"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => handleAddPemohon()} disabled={addPemohonSaving || !addPemohonNama.trim()} className="px-3 py-1.5 bg-navy-800 text-white rounded text-sm">
                    {addPemohonSaving ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button type="button" onClick={() => { setShowAddPemohon(false); setAddPemohonError(null); }} className="px-3 py-1.5 border border-navy-300 rounded text-sm">
                    Batal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-navy-600 mb-1">Klien (opsional)</label>
          <select
            name="klien_id"
            value={selectedKlienId}
            onChange={(e) => setSelectedKlienId(e.target.value)}
            className="w-full px-3 py-2 border border-navy-300 rounded"
          >
            <option value="">–</option>
            {klienList.map((k) => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </select>
          {!showAddKlien ? (
            <button
              type="button"
              onClick={() => setShowAddKlien(true)}
              className="mt-1 text-sm text-gold-600 hover:text-gold-700"
            >
              + Tambah klien baru
            </button>
          ) : (
            <div className="mt-3 p-3 border border-navy-200 rounded-lg bg-navy-50/50 space-y-2">
              <p className="text-xs font-medium text-navy-600">Form klien baru</p>
              {addKlienError && <p className="text-sm text-red-600">{addKlienError}</p>}
              <div className="space-y-2">
                <input
                  value={addKlienNama}
                  onChange={(e) => setAddKlienNama(e.target.value)}
                  placeholder="Nama *"
                  required
                  className="w-full px-3 py-2 border border-navy-300 rounded text-sm"
                />
                <input
                  value={addKlienNoHp}
                  onChange={(e) => setAddKlienNoHp(e.target.value)}
                  placeholder="No. HP"
                  className="w-full px-3 py-2 border border-navy-300 rounded text-sm"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => handleAddKlien()} disabled={addKlienSaving || !addKlienNama.trim()} className="px-3 py-1.5 bg-navy-800 text-white rounded text-sm">
                    {addKlienSaving ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button type="button" onClick={() => { setShowAddKlien(false); setAddKlienError(null); }} className="px-3 py-1.5 border border-navy-300 rounded text-sm">
                    Batal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-navy-600 mb-1">Tanggal Permohonan</label>
            <input type="date" name="tanggal_permohonan" required className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
          <div>
            <label className="block text-sm text-navy-600 mb-1">Luas (m²)</label>
            <FormattedIntegerInput name="luas_permohonan" defaultValue={0} className="w-full px-3 py-2 border border-navy-300 rounded" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-navy-600 mb-1">Penggunaan Tanah</label>
          <select name="penggunaan_tanah_1" className="w-full px-3 py-2 border border-navy-300 rounded">
            {PENGGUNAAN_TANAH_1.map((v) => (
              <option key={v} value={v}>{PENGGUNAAN_TANAH_1_LABELS[v] ?? v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-navy-600 mb-1">Lokasi Tanah</label>
          <input name="lokasi_tanah" className="w-full px-3 py-2 border border-navy-300 rounded" />
        </div>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm text-navy-600 mb-1">Kota/Kabupaten</label>
            <select name="kota_kabupaten" className="w-full px-3 py-2 border border-navy-300 rounded">
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
              {getDesaByKecamatan(selectedKecamatan).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" disabled={saving} className="px-4 py-2 bg-gold-500 text-white rounded hover:bg-gold-600 disabled:opacity-60 text-sm">
          {saving ? "Membuat..." : "Buat Permohonan"}
        </button>
      </form>
    </Card>
  );
}
