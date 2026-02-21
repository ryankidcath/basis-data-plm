"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { fetchPermohonanDetail } from "@/lib/supabase/queries";
import type { PermohonanDetail } from "@/lib/types";
import DetailPanel from "@/components/panel/DetailPanel";
import WorkflowForms from "@/components/panel/WorkflowForms";
import { PermohonanSearchCombobox, type PermohonanOption } from "@/components/ui/PermohonanSearchCombobox";

const MapSection = dynamic(
  () => import("@/components/map/MapSection").then((m) => m.default),
  { ssr: false }
);

type ViewMode = "lihat" | "input";

export default function DashboardPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("input");
  const [selectedPermohonanId, setSelectedPermohonanId] = useState<string | null>(null);
  const [selectedPermohonanLabel, setSelectedPermohonanLabel] = useState<string | null>(null);
  const [detail, setDetail] = useState<PermohonanDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    if (!selectedPermohonanId) {
      setSelectedPermohonanLabel(null);
      return;
    }
    let cancelled = false;
    const supabase = createClient();
    (async () => {
      try {
        const { data } = await supabase
          .from("permohonan")
          .select("kode_kjsb")
          .eq("id", selectedPermohonanId)
          .single();
        if (!cancelled && data) setSelectedPermohonanLabel((data as { kode_kjsb: string }).kode_kjsb);
      } catch {
        if (!cancelled) setSelectedPermohonanLabel(null);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedPermohonanId]);

  useEffect(() => {
    if (viewMode !== "lihat" || !selectedPermohonanId) return;
    let cancelled = false;
    setDetailLoading(true);
    setDetail(null);
    fetchPermohonanDetail(selectedPermohonanId)
      .then((d) => { if (!cancelled) setDetail(d); })
      .catch(() => { if (!cancelled) setDetail(null); })
      .finally(() => { if (!cancelled) setDetailLoading(false); });
    return () => { cancelled = true; };
  }, [viewMode, selectedPermohonanId]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const handleDetailRefresh = useCallback(async () => {
    if (!selectedPermohonanId) return;
    setDetailLoading(true);
    try {
      const d = await fetchPermohonanDetail(selectedPermohonanId);
      setDetail(d);
    } finally {
      setDetailLoading(false);
    }
  }, [selectedPermohonanId]);

  const handleParcelClick = useCallback((permohonanId: string) => {
    setSelectedPermohonanId(permohonanId);
    setViewMode("lihat");
  }, []);

  const handlePermohonanCreated = useCallback((permohonanId: string) => {
    setSelectedPermohonanId(permohonanId);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-navy-50">
<header className="flex-shrink-0 h-14 bg-navy-900 text-white flex items-center justify-between px-5 shadow-md">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-9 w-auto object-contain rounded-sm" />
            <h1 className="text-lg font-serif font-semibold tracking-tight">KJSB Benning dan Rekan</h1>
          </div>
        <div className="flex items-center gap-5">
          <span className="text-navy-200 text-sm">Permohonan Langsung Masyarakat</span>
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
      <div className="flex-1 flex min-h-0">
        <aside className="w-[52%] min-w-0 flex flex-col border-r border-navy-200 bg-white">
          <div className="flex-1 min-h-0 relative">
            <MapSection
              onParcelClick={handleParcelClick}
              fitToPermohonanId={selectedPermohonanId}
              refreshTrigger={refreshCount}
            />
          </div>
        </aside>
        <main className="w-[48%] min-w-0 flex flex-col bg-navy-50 overflow-hidden">
          <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-navy-200 flex items-center gap-3 shadow-sm">
            <label className="text-sm font-medium text-navy-700">Pilih permohonan:</label>
            <PermohonanSearchCombobox
              value={
                selectedPermohonanId && selectedPermohonanLabel
                  ? { id: selectedPermohonanId, kode_kjsb: selectedPermohonanLabel }
                  : null
              }
              onChange={(item) => {
                if (!item) return;
                setSelectedPermohonanId(item.id);
                setSelectedPermohonanLabel(item.kode_kjsb);
                handleParcelClick(item.id);
              }}
              placeholder="Ketik untuk cari kode KJSB..."
            />
            {selectedPermohonanId !== null && (
              <button
                type="button"
                onClick={() => {
                  setSelectedPermohonanId(null);
                  setSelectedPermohonanLabel(null);
                  setViewMode("input");
                }}
                className="flex-shrink-0 px-3 py-2 text-sm font-medium text-navy-600 hover:text-navy-900 hover:bg-navy-100 rounded-lg transition-colors"
              >
                Batal pilih
              </button>
            )}
          </div>
          <div className="flex-shrink-0 flex border-b border-navy-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode("lihat")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${viewMode === "lihat" ? "text-gold-600 border-b-2 border-gold-500 bg-white" : "text-navy-600 hover:text-navy-900 hover:bg-navy-50/50"}`}
            >
              Informasi Berkas
            </button>
            <button
              type="button"
              onClick={() => setViewMode("input")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${viewMode === "input" ? "text-gold-600 border-b-2 border-gold-500 bg-white" : "text-navy-600 hover:text-navy-900 hover:bg-navy-50/50"}`}
            >
              Input Data
            </button>
          </div>
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {viewMode === "lihat" ? (
              <>
                {selectedPermohonanId ? (
                  <>
                    <DetailPanel
                      detail={detail}
                      loading={detailLoading}
                      permohonanId={selectedPermohonanId}
                      onRefresh={handleDetailRefresh}
                      fillHeight={true}
                    />
                    <div className="flex-shrink-0 px-4 py-2 text-navy-500 text-sm border-b border-navy-200 bg-white">
                      Untuk mengisi data, pilih mode Input Data.
                    </div>
                  </>
                ) : (
                  <div className="flex-shrink-0 px-4 py-2 text-navy-500 text-sm border-b border-navy-200 bg-white">
                    Pilih permohonan atau klik poligon di peta untuk melihat informasi berkas.
                  </div>
                )}
              </>
            ) : (
              <>
                {!selectedPermohonanId && (
                  <div className="flex-shrink-0 px-4 py-2 text-navy-500 text-sm border-b border-navy-200 bg-white">
                    Pilih permohonan di atas atau buat baru di bawah.
                  </div>
                )}
                <WorkflowForms
                  permohonanId={selectedPermohonanId}
                  onSaved={() => setRefreshCount((c) => c + 1)}
                  onPermohonanCreated={handlePermohonanCreated}
                  refreshCount={refreshCount}
                />
              </>
            )}
          </div>
          {selectedPermohonanId && (
            <div className="flex-shrink-0 px-4 py-2 bg-white border-t border-navy-200 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="text-navy-500 font-medium">Cetak dokumen:</span>
              <Link
                href={`/dashboard/cetak/${selectedPermohonanId}/tanda_terima`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-600 hover:text-gold-700"
              >
                Tanda Terima
              </Link>
              <Link
                href={`/dashboard/cetak/${selectedPermohonanId}/sla`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-600 hover:text-gold-700"
              >
                SLA
              </Link>
              <Link
                href={`/dashboard/cetak/${selectedPermohonanId}/invoice`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-600 hover:text-gold-700"
              >
                Invoice
              </Link>
              <Link
                href={`/dashboard/cetak/${selectedPermohonanId}/kwitansi`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-600 hover:text-gold-700"
              >
                Kwitansi
              </Link>
              <Link
                href={`/dashboard/cetak/${selectedPermohonanId}/surat_tugas`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-600 hover:text-gold-700"
              >
                Surat Tugas
              </Link>
              <Link
                href={`/dashboard/cetak/${selectedPermohonanId}/surat_pemberitahuan`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-600 hover:text-gold-700"
              >
                Surat Pemberitahuan
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
