"use client";

import { useState, useEffect } from "react";
import type { PermohonanDetail } from "@/lib/types";
import type { BidangTanahGeo } from "@/lib/supabase/queries";

interface GambarHasilUkurDocProps {
  detail: PermohonanDetail | null;
  parcels: BidangTanahGeo[];
}

const FALLBACK_MSG =
  "Belum ada file DXF di Discord. Upload DXF di tab NIB, GU, dan PBT; file akan tersimpan di thread Discord.";

export function GambarHasilUkurDoc({ detail, parcels }: GambarHasilUkurDocProps) {
  const [svgFull, setSvgFull] = useState<string | null>(null);
  const [svgBidang, setSvgBidang] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ widthMm: number; heightMm: number } | null>(null);
  const [dimensionsBidang, setDimensionsBidang] = useState<{ widthMm: number; heightMm: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!detail?.id) {
      setLoading(false);
      setSvgFull(null);
      setSvgBidang(null);
      setDimensions(null);
      setDimensionsBidang(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    setSvgFull(null);
    setSvgBidang(null);
    fetch(`/api/cetak/gambar-hasil-ukur?permohonanId=${encodeURIComponent(detail.id)}`)
      .then((res) => {
        if (cancelled) return;
        if (!res.ok) {
          if (res.status === 404) setError(FALLBACK_MSG);
          else setError("Gagal memuat gambar hasil ukur.");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled || !data?.svgFull) return;
        setSvgFull(data.svgFull);
        setSvgBidang(data.svgBidang ?? null);
        setDimensions(data.dimensions ?? null);
        setDimensionsBidang(data.dimensionsBidang ?? null);
        setError(null);
      })
      .catch(() => {
        if (!cancelled) setError("Gagal memuat gambar hasil ukur.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [detail?.id]);

  if (loading) {
    return (
      <p className="text-navy-600 text-sm">Memuat gambar dari Discord...</p>
    );
  }

  if (error) {
    return <p className="text-navy-600 text-sm">{error}</p>;
  }

  if (!svgFull) {
    return <p className="text-navy-600 text-sm">{FALLBACK_MSG}</p>;
  }

  return (
    <div
      className="relative w-[420mm] min-h-[297mm] text-black"
      style={{ width: "420mm", minHeight: "297mm" }}
    >
      {/* Judul: titik tengah (315, 20) */}
      <div
        className="absolute"
        style={{
          left: "315mm",
          top: "20mm",
          transform: "translate(-50%, -50%)",
        }}
      >
        <h2 className="text-base font-semibold border-b border-black pb-0.5 whitespace-nowrap">
          Gambar Hasil Ukur
        </h2>
      </div>

      {/* Panah utara: apex (375, 20) + Skala di bawah */}
      <div
        className="absolute flex flex-col items-center"
        style={{
          left: "375mm",
          top: "20mm",
          transform: "translateX(-50%)",
        }}
      >
        <svg width={14} height={18} viewBox="0 0 14 18" className="text-black">
          <path d="M 7 1 L 12 9 L 2 9 Z" fill="currentColor" />
          <path
            d="M 7 9 L 7 17 L 4 14 L 7 17 L 10 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <p className="text-xs mt-1">Skala 1:250</p>
      </div>

      {/* Gambar utama: titik tengah (315, 75) */}
      <div
        className="absolute"
        style={{
          left: "315mm",
          top: "75mm",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: svgFull }}
          style={
            dimensions
              ? { width: `${dimensions.widthMm}mm`, height: `${dimensions.heightMm}mm` }
              : undefined
          }
        />
      </div>

      {/* Gambar bidang: titik tengah (315, 223) */}
      {svgBidang && (
        <div
          className="absolute"
          style={{
            left: "315mm",
            top: "223mm",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: svgBidang }}
            style={
              dimensionsBidang
                ? { width: `${dimensionsBidang.widthMm}mm`, height: `${dimensionsBidang.heightMm}mm` }
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
}
