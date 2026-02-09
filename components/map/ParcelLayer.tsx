"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import type { Path } from "leaflet";
import type { BidangTanahGeo } from "@/lib/supabase/queries";

const GeoJSON = dynamic(
  () => import("react-leaflet").then((m) => m.GeoJSON),
  { ssr: false }
);

interface GeoJSONFeature {
  type: "Feature";
  id?: string;
  properties?: Record<string, unknown>;
  geometry: GeoJSON.Geometry;
}

interface ParcelLayerProps {
  parcels: BidangTanahGeo[];
  onParcelClick?: (permohonanId: string) => void;
}

export default function ParcelLayer({ parcels, onParcelClick }: ParcelLayerProps) {
  const features = useMemo(() => {
    const feats: GeoJSONFeature[] = parcels
      .filter((p) => p.geom_json)
      .map((p) => {
        let geom: GeoJSON.Geometry;
        try {
          geom = JSON.parse(p.geom_json!) as GeoJSON.Geometry;
        } catch {
          return null;
        }
        return {
          type: "Feature" as const,
          id: p.id,
          properties: { permohonan_id: p.permohonan_id, nib: p.nib },
          geometry: geom,
        };
      })
      .filter((f) => f != null) as GeoJSONFeature[];
    return { type: "FeatureCollection" as const, features: feats };
  }, [parcels]);

  if (features.features.length === 0) return null;

  return (
    <GeoJSON
      key="parcels"
      data={features}
      style={{
        color: "#171717",
        weight: 2,
        fillColor: "#dc2626",
        fillOpacity: 0.25,
      }}
      onEachFeature={(feature, layer) => {
        const props = feature.properties as { permohonan_id?: string } | undefined;
        if (props?.permohonan_id && onParcelClick) {
          layer.on("click", () => onParcelClick(props.permohonan_id!));
        }
        const pathLayer = layer as Path;
        layer.on({
          mouseover: () => {
            pathLayer.setStyle({ weight: 3, fillOpacity: 0.4 });
            pathLayer.bringToFront();
          },
          mouseout: () => {
            pathLayer.setStyle({ weight: 2, fillOpacity: 0.25 });
          },
        });
      }}
    />
  );
}
