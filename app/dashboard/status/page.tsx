"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  fetchStatusAggregation,
  fetchPermohonanListByStatus,
  type StatusAggregationRow,
  type PermohonanListItem,
} from "@/lib/supabase/queries";
import { STATUS_PERMOHONAN_ORDER } from "@/lib/status-permohonan";
import { Clipboard, CheckCircle, Activity, Eye } from "lucide-react";

/** Pastikan 14 status tampil; RPC mungkin tidak return status dengan count 0 */
function fillAggregation(data: StatusAggregationRow[]): StatusAggregationRow[] {
  const byStatus = new Map(data.map((r) => [r.status_permohonan, r.count]));
  return STATUS_PERMOHONAN_ORDER.map((s) => ({
    status_permohonan: s,
    count: byStatus.get(s) ?? 0,
  }));
}

const INPUT_CLASS =
  "px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none";

export default function DashboardStatusPage() {
  const router = useRouter();
  const [aggregation, setAggregation] = useState<StatusAggregationRow[] | null>(null);
  const [aggregationError, setAggregationError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [kodeSearch, setKodeSearch] = useState("");
  const [list, setList] = useState<PermohonanListItem[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setAggregationError(null);
    fetchStatusAggregation()
      .then((d) => {
        if (!cancelled) setAggregation(fillAggregation(d));
      })
      .catch((err) => {
        if (!cancelled)
          setAggregationError(
            err?.message ?? "Gagal memuat agregasi status. Periksa koneksi atau RPC."
          );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadList = useCallback(() => {
    if (!selectedStatus) {
      setList([]);
      return;
    }
    setListLoading(true);
    setListError(null);
    fetchPermohonanListByStatus(selectedStatus, kodeSearch.trim() || undefined)
      .then((d) => setList(d))
      .catch((err) => {
        setListError(err?.message ?? "Gagal memuat daftar permohonan.");
      })
      .finally(() => setListLoading(false));
  }, [selectedStatus, kodeSearch]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const total = aggregation?.reduce((s, r) => s + r.count, 0) ?? 0;
  const selesaiCount =
    aggregation?.find((r) => r.status_permohonan === "Selesai")?.count ?? 0;
  const dalamProses = total - selesaiCount;

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar: putih, border-b tipis */}
      <header className="flex-shrink-0 h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={36} height={36} className="object-contain rounded-sm" />
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            KJSB Benning dan Rekan
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-indigo-600 text-sm font-medium px-3 py-2 rounded-lg bg-indigo-50">
            Dashboard
          </span>
          <Link
            href="/dashboard"
            className="text-slate-600 hover:text-slate-900 text-sm font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Peta
          </Link>
          <a
            href="/api/export/permohonan?format=csv"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-slate-900 text-sm font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Ekspor data
          </a>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-slate-600 hover:text-slate-900 text-sm font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Keluar
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Status Permohonan
        </h2>

        {aggregationError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
            {aggregationError}
          </div>
        )}

        {aggregation && (
          <>
            {/* Hero Stats: compact, icon Lucide, warna angka */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                <div className="p-2.5 bg-slate-100 rounded-xl">
                  <Clipboard className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Total</p>
                  <p className="text-2xl font-bold text-slate-900">{total}</p>
                </div>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                <div className="p-2.5 bg-emerald-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Selesai</p>
                  <p className="text-2xl font-bold text-emerald-600">{selesaiCount}</p>
                </div>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                <div className="p-2.5 bg-amber-50 rounded-xl">
                  <Activity className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Dalam proses</p>
                  <p className="text-2xl font-bold text-amber-600">{dalamProses}</p>
                </div>
              </div>
            </div>

            {/* Progress Section: kartu per status */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700">
                Jumlah per status
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {aggregation.map((row) => {
                  const maxCount = Math.max(
                    ...aggregation.map((r) => r.count),
                    1
                  );
                  const pct = maxCount > 0 ? (row.count / maxCount) * 100 : 0;
                  const isSelected = selectedStatus === row.status_permohonan;
                  const barBg = row.count === 0 ? "bg-slate-100" : "bg-indigo-500/60";
                  return (
                    <button
                      key={row.status_permohonan}
                      type="button"
                      onClick={() => setSelectedStatus(row.status_permohonan)}
                      className={`text-left p-3 rounded-2xl border transition-all ${
                        isSelected
                          ? "border-indigo-300 bg-indigo-50/50 shadow-sm"
                          : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-medium text-slate-700 truncate" title={row.status_permohonan}>
                          {row.status_permohonan}
                        </span>
                        <span className="text-sm font-bold text-slate-900 shrink-0">{row.count}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${barBg}`}
                          style={{ width: `${Math.max(pct, 2)}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Filter & list */}
            <section className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">
                Daftar permohonan per status
              </h3>
              <div className="flex flex-wrap items-end gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Status terpilih
                  </label>
                  <select
                    value={selectedStatus ?? ""}
                    onChange={(e) =>
                      setSelectedStatus(
                        e.target.value ? e.target.value : null
                      )
                    }
                    className={INPUT_CLASS}
                  >
                    <option value="">— Pilih status —</option>
                    {STATUS_PERMOHONAN_ORDER.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedStatus && (
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Cari kode KJSB
                    </label>
                    <input
                      type="text"
                      value={kodeSearch}
                      onChange={(e) => setKodeSearch(e.target.value)}
                      placeholder="Ketik sebagian kode..."
                      className={`${INPUT_CLASS} w-48`}
                    />
                  </div>
                )}
              </div>

              {listError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {listError}
                </div>
              )}

              {listLoading ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  Memuat...
                </div>
              ) : !selectedStatus ? (
                <p className="py-12 text-slate-500 text-sm text-center">
                  Pilih status di atas atau klik kartu untuk melihat daftar permohonan.
                </p>
              ) : list.length === 0 ? (
                <p className="py-12 text-slate-500 text-sm text-center">
                  Tidak ada permohonan dengan status ini.
                  {kodeSearch.trim() &&
                    " Coba ubah atau hapus filter kode KJSB."}
                </p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left py-4 px-4 text-slate-600 font-semibold">
                          Kode KJSB
                        </th>
                        <th className="text-left py-4 px-4 text-slate-600 font-semibold">
                          Tanggal
                        </th>
                        <th className="text-left py-4 px-4 text-slate-600 font-semibold">
                          Status
                        </th>
                        <th className="text-left py-4 px-4 text-slate-600 font-semibold">
                          Lokasi
                        </th>
                        <th className="text-left py-4 px-4 text-slate-600 font-semibold">
                          Pemohon
                        </th>
                        <th className="text-left py-4 px-4 text-slate-600 font-semibold">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((p) => (
                        <tr
                          key={p.id}
                          className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="py-4 px-4 font-bold text-slate-900 font-mono">
                            {p.kode_kjsb}
                          </td>
                          <td className="py-4 px-4 text-slate-500">
                            {p.tanggal_permohonan}
                          </td>
                          <td className="py-4 px-4 text-slate-500">
                            {p.status_permohonan}
                          </td>
                          <td className="py-4 px-4 text-slate-500 max-w-[12rem] truncate">
                            {p.lokasi_tanah || "—"}
                          </td>
                          <td className="py-4 px-4 text-slate-500">
                            {p.pemohon?.nama ?? "—"}
                          </td>
                          <td className="py-4 px-4">
                            <Link
                              href={`/dashboard?highlight=${p.id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              Detail
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {!aggregation && !aggregationError && (
          <div className="py-16 text-center text-slate-500 text-sm">
            Memuat data...
          </div>
        )}
      </main>
    </div>
  );
}
