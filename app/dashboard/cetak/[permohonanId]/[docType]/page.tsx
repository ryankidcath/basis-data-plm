"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchPermohonanDetail } from "@/lib/supabase/queries";
import type { PermohonanDetail } from "@/lib/types";
import { TandaTerimaDoc } from "@/components/cetak/TandaTerimaDoc";
import { SlaDoc } from "@/components/cetak/SlaDoc";
import { InvoiceDoc } from "@/components/cetak/InvoiceDoc";
import { KwitansiDoc } from "@/components/cetak/KwitansiDoc";
import { SuratTugasDoc } from "@/components/cetak/SuratTugasDoc";
import { SuratPemberitahuanDoc } from "@/components/cetak/SuratPemberitahuanDoc";

const DOC_TYPES = [
  "tanda_terima",
  "sla",
  "invoice",
  "kwitansi",
  "surat_tugas",
  "surat_pemberitahuan",
] as const;
type DocType = (typeof DOC_TYPES)[number];

function isDocType(s: string | undefined): s is DocType {
  return DOC_TYPES.includes(s as DocType);
}

const DOC_LABELS: Record<DocType, string> = {
  tanda_terima: "Tanda Terima",
  sla: "SLA",
  invoice: "Invoice",
  kwitansi: "Kwitansi",
  surat_tugas: "Surat Tugas",
  surat_pemberitahuan: "Surat Pemberitahuan",
};

export default function CetakPage() {
  const params = useParams();
  const permohonanId = params.permohonanId as string | undefined;
  const docTypeParam = params.docType as string | undefined;

  const [detail, setDetail] = useState<PermohonanDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!permohonanId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchPermohonanDetail(permohonanId)
      .then((d) => {
        if (!cancelled) setDetail(d ?? null);
      })
      .catch(() => {
        if (!cancelled) setDetail(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [permohonanId]);

  const docType = isDocType(docTypeParam) ? docTypeParam : null;

  if (!permohonanId || !docType) {
    return (
      <div className="min-h-screen bg-navy-50 p-6">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <p className="text-navy-700 mb-4">Dokumen tidak valid.</p>
          <Link
            href="/dashboard"
            className="text-gold-600 hover:text-gold-700 font-medium"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-50 p-6 flex items-center justify-center">
        <p className="text-navy-600">Memuat...</p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-navy-50 p-6">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <p className="text-navy-700 mb-4">Permohonan tidak ditemukan.</p>
          <Link
            href="/dashboard"
            className="text-gold-600 hover:text-gold-700 font-medium"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  function renderDoc() {
    switch (docType) {
      case "tanda_terima":
        return <TandaTerimaDoc detail={detail} />;
      case "sla":
        return <SlaDoc detail={detail} />;
      case "invoice":
        return <InvoiceDoc detail={detail} />;
      case "kwitansi":
        return <KwitansiDoc detail={detail} />;
      case "surat_tugas":
        return <SuratTugasDoc detail={detail} />;
      case "surat_pemberitahuan":
        return <SuratPemberitahuanDoc detail={detail} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-navy-50">
      <div className="no-print sticky top-0 z-10 bg-white border-b border-navy-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <span className="text-sm text-navy-600">
          {DOC_LABELS[docType]} – {detail.kode_kjsb}
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-navy-800 text-white text-sm font-medium rounded-lg hover:bg-navy-900"
          >
            Cetak
          </button>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-navy-700 text-sm font-medium rounded-lg border border-navy-300 hover:bg-navy-50"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
      <div className="p-6 print:p-0">
        <div className="max-w-[180mm] mx-auto bg-white shadow print:shadow-none rounded-lg print:rounded-none px-14 py-8 print:px-10 print:py-6">
          {renderDoc()}
        </div>
      </div>
    </div>
  );
}
