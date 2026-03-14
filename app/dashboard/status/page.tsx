"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  fetchStatusAggregation,
  fetchPermohonanListByStatus,
  type StatusAggregationRow,
  type PermohonanListItem,
} from "@/lib/supabase/queries";
import { STATUS_PERMOHONAN_ORDER } from "@/lib/status-permohonan";

/** Pastikan 14 status tampil; RPC mungkin tidak return status dengan count 0 */
function fillAggregation(data: StatusAggregationRow[]): StatusAggregationRow[] {
  const byStatus = new Map(data.map((r) => [r.status_permohonan, r.count]));
  return STATUS_PERMOHONAN_ORDER.map((s) => ({
    status_permohonan: s,
    count: byStatus.get(s) ?? 0,
  }));
}

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
    <div className="min-h-screen flex flex-col bg-navy-50">
      <header className="flex-shrink-0 h-14 bg-navy-900 text-white flex items-center justify-between px-5 shadow-md">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-9 w-auto object-contain rounded-sm" />
          <h1 className="text-lg font-serif font-semibold tracking-tight">
            KJSB Benning dan Rekan
          </h1>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-navy-200 text-sm">Dashboard Status Berkas</span>
          <Link
            href="/dashboard"
            className="text-gold-400 hover:text-gold-300 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            Dashboard
          </Link>
          <a
            href="/api/export/permohonan?format=csv"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-400 hover:text-gold-300 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            Ekspor data
          </a>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-gold-400 hover:text-gold-300 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            Keluar
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-6">
        <h2 className="text-xl font-serif font-semibold text-navy-900">
          Status Permohonan
        </h2>

        {aggregationError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {aggregationError}
          </div>
        )}

        {aggregation && (
          <>
            {/* Ringkasan cepat */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-navy-200 rounded-lg p-4 shadow-sm">
                <p className="text-navy-500 text-sm">Total</p>
                <p className="text-2xl font-semibold text-navy-900">{total}</p>
              </div>
              <div className="bg-white border border-navy-200 rounded-lg p-4 shadow-sm">
                <p className="text-navy-500 text-sm">Selesai</p>
                <p className="text-2xl font-semibold text-navy-900">{selesaiCount}</p>
              </div>
              <div className="bg-white border border-navy-200 rounded-lg p-4 shadow-sm">
                <p className="text-navy-500 text-sm">Dalam proses</p>
                <p className="text-2xl font-semibold text-navy-900">{dalamProses}</p>
              </div>
            </div>

            {/* Chart agregat (bar) */}
            <section className="bg-white border border-navy-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-navy-700 mb-4">
                Jumlah per status
              </h3>
              <div className="space-y-2">
                {aggregation.map((row) => {
                  const maxCount = Math.max(
                    ...aggregation.map((r) => r.count),
                    1
                  );
                  const pct = maxCount > 0 ? (row.count / maxCount) * 100 : 0;
                  const isSelected = selectedStatus === row.status_permohonan;
                  return (
                    <div
                      key={row.status_permohonan}
                      className="flex items-center gap-3 min-w-0"
                    >
                      <span
                        className="w-48 shrink-0 text-sm text-navy-700"
                        title={row.status_permohonan}
                      >
                        {row.status_permohonan}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedStatus(row.status_permohonan)
                        }
                        className={`flex-1 min-w-0 h-6 rounded flex items-center justify-end pr-2 text-xs font-medium transition-colors shrink ${
                          isSelected
                            ? "bg-gold-500 text-white"
                            : "bg-navy-100 hover:bg-navy-200 text-navy-700"
                        }`}
                        style={{ width: `${Math.max(pct, 4)}%` }}
                      >
                        {row.count}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Filter & list */}
            <section className="bg-white border border-navy-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-navy-700 mb-4">
                Daftar permohonan per status
              </h3>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div>
                  <label className="block text-xs text-navy-500 mb-1">
                    Status terpilih
                  </label>
                  <select
                    value={selectedStatus ?? ""}
                    onChange={(e) =>
                      setSelectedStatus(
                        e.target.value ? e.target.value : null
                      )
                    }
                    className="px-3 py-2 border border-navy-300 rounded-lg text-sm focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
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
                    <label className="block text-xs text-navy-500 mb-1">
                      Cari kode KJSB
                    </label>
                    <input
                      type="text"
                      value={kodeSearch}
                      onChange={(e) => setKodeSearch(e.target.value)}
                      placeholder="Ketik sebagian kode..."
                      className="px-3 py-2 border border-navy-300 rounded-lg text-sm w-48 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    />
                  </div>
                )}
              </div>

              {listError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                  {listError}
                </div>
              )}

              {listLoading ? (
                <div className="py-8 text-center text-navy-500 text-sm">
                  Memuat...
                </div>
              ) : !selectedStatus ? (
                <p className="py-6 text-navy-500 text-sm text-center">
                  Pilih status di atas atau klik bar untuk melihat daftar
                  permohonan.
                </p>
              ) : list.length === 0 ? (
                <p className="py-6 text-navy-500 text-sm text-center">
                  Tidak ada permohonan dengan status ini.
                  {kodeSearch.trim() &&
                    " Coba ubah atau hapus filter kode KJSB."}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-navy-200">
                        <th className="text-left py-2 px-3 text-navy-600 font-medium">
                          Kode KJSB
                        </th>
                        <th className="text-left py-2 px-3 text-navy-600 font-medium">
                          Tanggal
                        </th>
                        <th className="text-left py-2 px-3 text-navy-600 font-medium">
                          Status
                        </th>
                        <th className="text-left py-2 px-3 text-navy-600 font-medium">
                          Lokasi
                        </th>
                        <th className="text-left py-2 px-3 text-navy-600 font-medium">
                          Pemohon
                        </th>
                        <th className="text-left py-2 px-3 text-navy-600 font-medium">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b border-navy-100 hover:bg-navy-50"
                        >
                          <td className="py-2 px-3 text-navy-800 font-mono">
                            {p.kode_kjsb}
                          </td>
                          <td className="py-2 px-3 text-navy-700">
                            {p.tanggal_permohonan}
                          </td>
                          <td className="py-2 px-3 text-navy-700">
                            {p.status_permohonan}
                          </td>
                          <td className="py-2 px-3 text-navy-700 max-w-[12rem] truncate">
                            {p.lokasi_tanah || "—"}
                          </td>
                          <td className="py-2 px-3 text-navy-700">
                            {p.pemohon?.nama ?? "—"}
                          </td>
                          <td className="py-2 px-3">
                            <Link
                              href={`/dashboard?highlight=${p.id}`}
                              className="text-gold-600 hover:text-gold-700"
                            >
                              Lihat
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
          <div className="py-12 text-center text-navy-500 text-sm">
            Memuat data...
          </div>
        )}
      </main>
    </div>
  );
}
