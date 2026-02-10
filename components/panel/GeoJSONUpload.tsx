"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateStatusPermohonan } from "@/lib/status-permohonan";

interface GeoJSONUploadProps {
  permohonanId: string;
  onSaved: () => void;
  embedded?: boolean;
}

function isValidPolygonGeometry(geom: GeoJSON.Geometry): boolean {
  if (geom.type === "Polygon") {
    return Array.isArray(geom.coordinates) && geom.coordinates.length > 0;
  }
  if (geom.type === "MultiPolygon") {
    return Array.isArray(geom.coordinates) && geom.coordinates.length > 0;
  }
  return false;
}

export default function GeoJSONUpload({ permohonanId, onSaved, embedded = false }: GeoJSONUploadProps) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    setSuccess(false);
    try {
      const text = await file.text();
      const json = JSON.parse(text) as GeoJSON.FeatureCollection | GeoJSON.Feature | GeoJSON.Geometry;
      let geometries: { geom: GeoJSON.Geometry; nib?: string }[] = [];
      if ("type" in json) {
        if (json.type === "FeatureCollection" && Array.isArray((json as GeoJSON.FeatureCollection).features)) {
          const fc = json as GeoJSON.FeatureCollection;
          geometries = fc.features
            .filter((f) => f.geometry && isValidPolygonGeometry(f.geometry))
            .map((f) => ({
              geom: f.geometry!,
              nib: (f.properties as { nib?: string })?.nib,
            }));
        } else if (json.type === "Feature" && (json as GeoJSON.Feature).geometry) {
          const f = json as GeoJSON.Feature;
          if (isValidPolygonGeometry(f.geometry!)) {
            geometries = [{ geom: f.geometry!, nib: (f.properties as { nib?: string })?.nib }];
          }
        } else if (json.type === "Polygon" || json.type === "MultiPolygon") {
          if (isValidPolygonGeometry(json as GeoJSON.Geometry)) {
            geometries = [{ geom: json as GeoJSON.Geometry }];
          }
        }
      }
      if (geometries.length === 0) {
        setError("File GeoJSON tidak valid atau tidak berisi Polygon/MultiPolygon.");
        setUploading(false);
        return;
      }
      const { data: existing } = await supabase.from("bidang_tanah").select("id").eq("permohonan_id", permohonanId);
      const existingIds = (existing ?? []).map((r) => r.id);
      for (let i = 0; i < geometries.length; i++) {
        const g = geometries[i];
        const geojsonStr = JSON.stringify(g.geom);
        const bidId = existingIds[i] ?? null;
        const { error: rpcError } = await supabase.rpc("upsert_bidang_geom", {
          p_id: bidId,
          p_permohonan_id: permohonanId,
          p_geojson: geojsonStr,
          p_nib: g.nib ?? null,
          p_tanggal_nib: null,
        });
        if (rpcError) {
          setError(rpcError.message);
          setUploading(false);
          return;
        }
      }
      setSuccess(true);
      await updateStatusPermohonan(permohonanId);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memproses file GeoJSON.");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const wrapperClass = embedded ? "pb-4" : "rounded-lg border border-navy-200 bg-white p-4";
  return (
    <div className={wrapperClass}>
      <h3 className="text-sm font-medium text-navy-800 mb-2">Upload GeoJSON Bidang Tanah</h3>
      <p className="text-xs text-navy-500 mb-3">
        Upload file GeoJSON (FeatureCollection, Feature, atau Polygon/MultiPolygon) untuk menambah atau memperbarui geometri bidang tanah permohonan ini.
      </p>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      {success && <p className="text-sm text-green-600 mb-2">GeoJSON berhasil disimpan. Peta akan diperbarui.</p>}
      <input
        ref={fileInputRef}
        type="file"
        accept=".geojson,.json,application/geo+json,application/json"
        onChange={handleFile}
        disabled={uploading}
        className="block w-full text-sm text-navy-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-navy-100 file:text-navy-800 file:font-medium"
      />
      <p className="mt-2 text-xs text-navy-500">Format: GeoJSON dengan koordinat WGS84 (EPSG:4326).</p>
    </div>
  );
}
