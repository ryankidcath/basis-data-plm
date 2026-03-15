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
import GeoJSONUpload from "./GeoJSONUpload";
import PdfUpload from "./PdfUpload";

const SECTION_CLASS = "border-t border-slate-200 pt-6 mt-6 first:border-t-0 first:pt-0 first:mt-0";
const SECTION_HEADING = "text-sm font-bold text-slate-900 mb-4";

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
  const noSelection = !permohonanId;

  return (
    <div className="flex flex-col min-h-0 flex-1">
      {noSelection ? (
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-4">
            {onPermohonanCreated && (
              <TambahPermohonanForm onCreated={onPermohonanCreated} refreshCount={refreshCount} />
            )}
            <p className="text-slate-500 text-sm">
              Atau pilih satu bidang di peta untuk mengisi data per tahapan.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto p-5 pb-24">
          <div className="space-y-8">
            {/* Administrasi: Upload + Permohonan + Pemohon + Klien + Administrasi + Keuangan */}
            <section className={SECTION_CLASS}>
              <h3 className={SECTION_HEADING}>Upload Berkas Permohonan</h3>
              <PdfUpload permohonanId={permohonanId} onSaved={onSaved} embedded />
            </section>
            <PermohonanForm permohonanId={permohonanId} onSaved={onSaved} refreshCount={refreshCount} />
            <PemohonForm permohonanId={permohonanId} onSaved={onSaved} />
            <KlienForm permohonanId={permohonanId} onSaved={onSaved} />
            <AdministrasiForm permohonanId={permohonanId} onSaved={onSaved} />
            <KeuanganForm permohonanId={permohonanId} onSaved={onSaved} />

            {/* Informasi Spasial */}
            <InformasiSpasialForm permohonanId={permohonanId} onSaved={onSaved} />

            {/* Surat Tugas & Pengukuran */}
            <SuratTugasForm permohonanId={permohonanId} onSaved={onSaved} />
            <PengukuranForm permohonanId={permohonanId} onSaved={onSaved} refreshCount={refreshCount} />

            {/* Legalisasi GU */}
            <LegalisasiGuForm permohonanId={permohonanId} onSaved={onSaved} />

            {/* NIB, GU, PBT */}
            <section className={SECTION_CLASS}>
              <h3 className={SECTION_HEADING}>Bidang Tanah (NIB) & GeoJSON</h3>
              <GeoJSONUpload permohonanId={permohonanId} onSaved={onSaved} embedded />
              <div className="mt-4 pt-4 border-t border-slate-100">
                <BidangTanahForm permohonanId={permohonanId} onSaved={onSaved} embedded refreshCount={refreshCount} />
              </div>
            </section>
            <GambarUkurForm permohonanId={permohonanId} onSaved={onSaved} />
            <PetaBidangTanahForm permohonanId={permohonanId} onSaved={onSaved} />
            <TanggalPenyelesaianForm permohonanId={permohonanId} onSaved={onSaved} />
          </div>
        </div>
      )}
    </div>
  );
}
