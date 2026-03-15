"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { fetchPermohonanDetail } from "@/lib/supabase/queries";
import type { PermohonanDetail } from "@/lib/types";
import DetailPanel from "@/components/panel/DetailPanel";
import WorkflowForms from "@/components/panel/WorkflowForms";
import { PermohonanSearchCombobox, type PermohonanOption } from "@/components/ui/PermohonanSearchCombobox";
import {
  FileCheck,
  FileText,
  Receipt,
  FileSpreadsheet,
  Briefcase,
  Mail,
  ChevronDown,
  Printer,
} from "lucide-react";

const MapSection = dynamic(
  () => import("@/components/map/MapSection").then((m) => m.default),
  { ssr: false }
);

const DOC_TYPES = [
  { slug: "tanda_terima", label: "Tanda Terima", icon: FileCheck },
  { slug: "sla", label: "SLA", icon: FileText },
  { slug: "invoice", label: "Invoice", icon: FileSpreadsheet },
  { slug: "kwitansi", label: "Kwitansi", icon: Receipt },
  { slug: "surat_tugas", label: "Surat Tugas", icon: Briefcase },
  { slug: "surat_pemberitahuan", label: "Surat Pemberitahuan", icon: Mail },
] as const;

function DokumenDropdown({
  permohonanId,
  docTypes,
}: {
  permohonanId: string;
  docTypes: typeof DOC_TYPES;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex-shrink-0 p-3 border-t border-slate-100 bg-slate-50/50 relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
      >
        <Printer className="w-4 h-4" />
        Cetak Dokumen
        <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[999]" aria-hidden onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-3 right-3 mb-1 py-2 bg-white border border-slate-200 rounded-lg shadow-lg z-[1000] max-h-48 overflow-y-auto">
            {docTypes.map(({ slug, label, icon: Icon }) => (
              <Link
                key={slug}
                href={`/dashboard/cetak/${permohonanId}/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Icon className="w-4 h-4 text-slate-500" />
                {label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

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
    <div className="h-screen w-full flex flex-col overflow-hidden bg-slate-100">
      {/* Navbar: sama dengan Dashboard Status */}
      <header className="flex-shrink-0 h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={36} height={36} className="object-contain rounded-sm" />
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            KJSB Benning dan Rekan
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <Link
            href="/dashboard/status"
            className="text-slate-600 hover:text-slate-900 text-sm font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-indigo-600 text-sm font-medium px-3 py-2 rounded-lg bg-indigo-50">
            Peta
          </span>
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

      {/* Map area + floating card */}
      <div className="flex-1 min-h-0 relative">
        <div className="absolute inset-0 z-0">
          <MapSection
            onParcelClick={handleParcelClick}
            fitToPermohonanId={selectedPermohonanId}
            refreshTrigger={refreshCount}
          />
        </div>

        {/* Floating card - right side */}
        <div className="absolute top-6 right-6 bottom-6 z-[1000] w-full max-w-[450px] flex flex-col bg-white/90 backdrop-blur-md rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden">
        {/* Search & tabs inside card */}
        <div className="flex-shrink-0 p-4 space-y-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 shrink-0">Pilih permohonan:</label>
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
              className="flex-1"
            />
            {selectedPermohonanId !== null && (
              <button
                type="button"
                onClick={() => {
                  setSelectedPermohonanId(null);
                  setSelectedPermohonanLabel(null);
                  setViewMode("input");
                }}
                className="shrink-0 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Batal
              </button>
            )}
          </div>
          <div className="flex rounded-lg bg-slate-50/80 p-1">
            <button
              type="button"
              onClick={() => setViewMode("lihat")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === "lihat" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              Informasi Berkas
            </button>
            <button
              type="button"
              onClick={() => setViewMode("input")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === "input" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              Input Data
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 min-h-0 overflow-y-auto">
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
                  <div className="flex-shrink-0 px-4 py-3 text-slate-500 text-sm border-t border-slate-100 bg-slate-50/50">
                    Untuk mengisi data, pilih mode Input Data.
                  </div>
                </>
              ) : (
                <div className="px-4 py-8 text-slate-500 text-sm text-center">
                  Pilih permohonan atau klik poligon di peta untuk melihat informasi berkas.
                </div>
              )}
            </>
          ) : (
            <>
              {!selectedPermohonanId && (
                <div className="flex-shrink-0 px-4 py-3 text-slate-500 text-sm border-b border-slate-100 bg-slate-50/50">
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

        {/* Dokumen Tersedia - dropdown */}
        {selectedPermohonanId && (
          <DokumenDropdown permohonanId={selectedPermohonanId} docTypes={DOC_TYPES} />
        )}
        </div>
      </div>
    </div>
  );
}
