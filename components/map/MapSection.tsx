"use client";

import { useParcelGeometries } from "./useParcelGeometries";
import MapView from "./MapView";
import ParcelLayer from "./ParcelLayer";
import FitBoundsToParcels from "./FitBoundsToParcels";

interface MapSectionProps {
  onParcelClick?: (permohonanId: string) => void;
  fitToPermohonanId?: string | null;
}

export default function MapSection({ onParcelClick, fitToPermohonanId }: MapSectionProps) {
  const { parcels, loading, error } = useParcelGeometries();
  const parcelsToFit = fitToPermohonanId
    ? parcels.filter((p) => p.permohonan_id === fitToPermohonanId)
    : parcels;

  return (
    <div className="h-full w-full flex flex-col">
      {loading && (
        <div className="absolute top-4 left-4 z-[1000] bg-white/95 px-3 py-2 rounded-lg shadow text-sm text-navy-700">
          Memuat peta...
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-4 z-[1000] bg-red-50 border border-red-200 px-3 py-2 rounded-lg shadow text-sm text-red-700">
          {error}
        </div>
      )}
      <MapView>
        <FitBoundsToParcels parcels={parcelsToFit} loading={loading} />
        <ParcelLayer parcels={parcels} onParcelClick={onParcelClick} />
      </MapView>
    </div>
  );
}
