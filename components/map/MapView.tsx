"use client";

import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);

const DEFAULT_CENTER: [number, number] = [-6.2088, 106.8456]; // Jakarta
const DEFAULT_ZOOM = 10;

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  children?: React.ReactNode;
}

export default function MapView({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  children,
}: MapViewProps) {
  return (
    <div className="h-full min-h-[60vh] w-full relative z-0 rounded-r-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </MapContainer>
    </div>
  );
}
