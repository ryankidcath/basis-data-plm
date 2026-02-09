"use client";

import { useEffect, useMemo } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import type { BidangTanahGeo } from "@/lib/supabase/queries";

function getBoundsFromGeometries(parcels: BidangTanahGeo[]): L.LatLngBounds | null {
  let minLat = Infinity, minLng = Infinity, maxLat = -Infinity, maxLng = -Infinity;
  let hasPoint = false;

  function addCoord(coord: number[]) {
    const [lng, lat] = coord;
    if (typeof lng !== "number" || typeof lat !== "number") return;
    minLng = Math.min(minLng, lng);
    minLat = Math.min(minLat, lat);
    maxLng = Math.max(maxLng, lng);
    maxLat = Math.max(maxLat, lat);
    hasPoint = true;
  }

  function coordsFromGeometry(geom: GeoJSON.Geometry): void {
    if (!geom) return;
    switch (geom.type) {
      case "Point":
        addCoord(geom.coordinates);
        break;
      case "MultiPoint":
      case "LineString":
        geom.coordinates.forEach((c) => addCoord(c));
        break;
      case "MultiLineString":
      case "Polygon":
        geom.coordinates.forEach((ring) => ring.forEach((c) => addCoord(c)));
        break;
      case "MultiPolygon":
        geom.coordinates.forEach((poly) => poly.forEach((ring) => ring.forEach((c) => addCoord(c))));
        break;
      default:
        break;
    }
  }

  for (const p of parcels) {
    if (!p.geom_json) continue;
    try {
      const geom = JSON.parse(p.geom_json) as GeoJSON.Geometry;
      coordsFromGeometry(geom);
    } catch {
      // skip invalid
    }
  }

  if (!hasPoint) return null;
  return L.latLngBounds(
    [minLat, minLng],
    [maxLat, maxLng]
  );
}

interface FitBoundsToParcelsProps {
  parcels: BidangTanahGeo[];
  loading: boolean;
}

export default function FitBoundsToParcels({ parcels, loading }: FitBoundsToParcelsProps) {
  const map = useMap();
  const bounds = useMemo(() => getBoundsFromGeometries(parcels), [parcels]);

  useEffect(() => {
    if (loading || !bounds || bounds.isValid?.() === false) return;
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 19 });
  }, [map, loading, bounds]);

  return null;
}
