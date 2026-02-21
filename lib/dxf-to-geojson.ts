import { DxfParser } from "dxf-parser";
import proj4 from "proj4";

/** TM-3 Zona 49.1 (EPSG:23835) - DGN95 / Indonesia TM-3 zone 49.1 */
const TM3_ZONE_49_1 =
  "+proj=tmerc +lat_0=0 +lon_0=109.5 +k=0.9999 +x_0=200000 +y_0=1500000 +datum=WGS84 +units=m +no_defs";

proj4.defs("EPSG:23835", TM3_ZONE_49_1);

export interface DxfToGeoJsonOptions {
  /** Nama layer DXF yang berisi poligon bidang (case-insensitive). Default "BIDANG". */
  layerName?: string;
  /** Jika true, transform koordinat dari TM-3 Zona 49.1 ke WGS84. Default true. */
  transformToWgs84?: boolean;
}

/**
 * Parse DXF string, ekstrak closed LWPOLYLINE dari layer tertentu, konversi ke GeoJSON Polygon (WGS84).
 * Hanya entitas LWPOLYLINE dengan shape closed yang diambil.
 */
export function dxfToGeoJson(
  dxfString: string,
  options: DxfToGeoJsonOptions = {}
): GeoJSON.Polygon[] {
  const layerName = (options.layerName ?? "BIDANG").trim().toUpperCase();
  const transformToWgs84 = options.transformToWgs84 !== false;

  const parser = new DxfParser();
  const dxf = parser.parse(dxfString);
  if (!dxf?.entities?.length) return [];

  const polygons: GeoJSON.Polygon[] = [];

  for (const entity of dxf.entities) {
    if (entity.type !== "LWPOLYLINE") continue;
    const layer = (entity as { layer?: string }).layer;
    if (!layer || layer.trim().toUpperCase() !== layerName) continue;
    const pl = entity as { shape?: boolean; vertices?: { x: number; y: number; z?: number }[] };
    if (!pl.shape || !pl.vertices?.length) continue;

    const ring: [number, number][] = pl.vertices.map((v) => {
      let x = v.x;
      let y = v.y;
      if (transformToWgs84) {
        const [lon, lat] = proj4("EPSG:23835", "WGS84", [x, y]);
        return [lon, lat];
      }
      return [x, y];
    });

    if (ring.length < 3) continue;
    const first = ring[0];
    const last = ring[ring.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) ring.push([first[0], first[1]]);

    polygons.push({ type: "Polygon", coordinates: [ring] });
  }

  return polygons;
}
