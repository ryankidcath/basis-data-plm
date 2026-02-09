"use client";

import { useState } from "react";
import { TambahPermohonanForm } from "./forms/TambahPermohonanForm";
import { PermohonanForm } from "./forms/PermohonanForm";
import { PemohonForm } from "./forms/PemohonForm";
import { KlienForm } from "./forms/KlienForm";
import { AdministrasiForm } from "./forms/AdministrasiForm";
import { KeuanganForm } from "./forms/KeuanganForm";
import { InformasiSpasialForm } from "./forms/InformasiSpasialForm";
import { SuratTugasForm } from "./forms/SuratTugasForm";
import { PengukuranForm } from "./forms/PengukuranForm";
import { LegalisasiGuForm } from "./forms/LegalisasiGuForm";
import { BidangTanahForm } from "./forms/BidangTanahForm";
import { GambarUkurForm } from "./forms/GambarUkurForm";
import { PetaBidangTanahForm } from "./forms/PetaBidangTanahForm";
import { TanggalPenyelesaianForm } from "./forms/TanggalPenyelesaianForm";
import { Card } from "@/components/ui/Card";
import GeoJSONUpload from "./GeoJSONUpload";

const TABS = [
  { id: "1", label: "Administrasi" },
  { id: "2", label: "Informasi Spasial" },
  { id: "3", label: "Surat Tugas" },
  { id: "4", label: "Legalisasi GU" },
  { id: "5", label: "NIB, GU, dan PBT" },
] as const;

interface WorkflowFormsProps {
  permohonanId: string | null;
  onSaved: () => void;
  onPermohonanCreated?: (permohonanId: string) => void;
  refreshCount?: number;
}

export default function WorkflowForms({
  permohonanId,
  onSaved,
  onPermohonanCreated,
  refreshCount = 0,
}: WorkflowFormsProps) {
  const [activeTab, setActiveTab] = useState<string>("1");

  const noSelection = !permohonanId;

  return (
    <div className="flex flex-col bg-white border-t border-navy-200 min-h-0 flex-1">
      {noSelection ? (
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-4">
            {onPermohonanCreated && (
              <TambahPermohonanForm onCreated={onPermohonanCreated} refreshCount={refreshCount} />
            )}
            <p className="text-navy-500 text-sm">
              Atau pilih satu bidang di peta untuk mengisi data per tahapan.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 min-h-0 w-full min-w-0">
          <aside
            aria-label="Tahap"
            className="flex flex-col flex-shrink-0 w-40 min-w-[7.5rem] border-r-2 border-navy-200 bg-white overflow-y-auto"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`block w-full text-left px-3 py-2.5 text-sm font-medium transition-colors border-l-4 ${
                  activeTab === tab.id
                    ? "text-gold-600 bg-navy-100 border-gold-500"
                    : "border-transparent text-navy-700 hover:bg-navy-50 hover:text-navy-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </aside>
          <div className="flex-1 min-w-0 overflow-y-auto p-5 bg-navy-50/30">
            {activeTab === "1" && (
              <div className="space-y-4">
                <PermohonanForm permohonanId={permohonanId} onSaved={onSaved} refreshCount={refreshCount} />
                <PemohonForm permohonanId={permohonanId} onSaved={onSaved} />
                <KlienForm permohonanId={permohonanId} onSaved={onSaved} />
                <AdministrasiForm permohonanId={permohonanId} onSaved={onSaved} />
                <KeuanganForm permohonanId={permohonanId} onSaved={onSaved} />
              </div>
            )}
            {activeTab === "2" && (
              <InformasiSpasialForm
                permohonanId={permohonanId}
                onSaved={onSaved}
              />
            )}
            {activeTab === "3" && (
              <div className="space-y-4">
                <SuratTugasForm permohonanId={permohonanId} onSaved={onSaved} />
                <PengukuranForm permohonanId={permohonanId} onSaved={onSaved} />
              </div>
            )}
            {activeTab === "4" && (
              <LegalisasiGuForm permohonanId={permohonanId} onSaved={onSaved} />
            )}
            {activeTab === "5" && (
              <div className="space-y-4">
                <Card title="Bidang Tanah (NIB) & GeoJSON">
                  <GeoJSONUpload permohonanId={permohonanId} onSaved={onSaved} embedded />
                  <div className="mt-4 pt-4 border-t border-navy-200">
                    <BidangTanahForm permohonanId={permohonanId} onSaved={onSaved} embedded />
                  </div>
                </Card>
                <GambarUkurForm permohonanId={permohonanId} onSaved={onSaved} />
                <PetaBidangTanahForm
                  permohonanId={permohonanId}
                  onSaved={onSaved}
                />
                <TanggalPenyelesaianForm
                  permohonanId={permohonanId}
                  onSaved={onSaved}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
