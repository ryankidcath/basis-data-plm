import { DxfParser } from "dxf-parser";

type Point = { x: number; y: number; z?: number };

function colorToHex(color: number | undefined): string {
  if (color != null && color > 0 && color !== 256) {
    return "#" + (color >>> 0).toString(16).padStart(6, "0").slice(-6);
  }
  return "#000000";
}

function getBbox(
  entities: { type: string; vertices?: Point[]; center?: Point; radius?: number; startAngle?: number; endAngle?: number; startPoint?: Point; text?: string; textHeight?: number }[]
): { minX: number; minY: number; maxX: number; maxY: number } | null {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  let hasPoint = false;

  function add(x: number, y: number) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    hasPoint = true;
  }

  for (const e of entities) {
    if (e.type === "LINE" && e.vertices && e.vertices.length >= 2) {
      add(e.vertices[0].x, e.vertices[0].y);
      add(e.vertices[1].x, e.vertices[1].y);
    } else if (e.type === "LWPOLYLINE" && e.vertices) {
      for (const v of e.vertices) add(v.x, v.y);
    } else if ((e.type === "CIRCLE" || e.type === "ARC") && e.center) {
      const r = e.radius ?? 0;
      add(e.center.x - r, e.center.y - r);
      add(e.center.x + r, e.center.y + r);
    } else if (e.type === "TEXT" && e.startPoint) {
      const h = (e.textHeight ?? 1) * (e.text?.length ?? 1) * 0.6;
      add(e.startPoint.x, e.startPoint.y);
      add(e.startPoint.x + h, e.startPoint.y + (e.textHeight ?? 1));
    } else if (e.type === "POLYLINE" && e.vertices) {
      for (const v of e.vertices) add((v as Point).x, (v as Point).y);
    }
  }
  if (!hasPoint) return null;
  return { minX, minY, maxX, maxY };
}

export type Bbox = { minX: number; minY: number; maxX: number; maxY: number } | null;

/**
 * Parses DXF string and returns bounding box. Assumes 1 DXF unit = 1 meter.
 */
export function getBboxFromDxf(dxfString: string): Bbox {
  let dxf: { entities?: unknown[] } | null;
  try {
    const parser = new DxfParser();
    dxf = parser.parse(dxfString);
  } catch {
    return null;
  }
  if (!dxf?.entities?.length) return null;
  const entities = dxf.entities as Parameters<typeof getBbox>[0];
  return getBbox(entities);
}

const LAYER_BIDANG = "BIDANG";

/**
 * Returns bounding box for BIDANG layer entities only (closed LWPOLYLINE with shape).
 */
export function getBboxBidangFromDxf(dxfString: string): Bbox {
  let dxf: { entities?: unknown[] } | null;
  try {
    const parser = new DxfParser();
    dxf = parser.parse(dxfString);
  } catch {
    return null;
  }
  if (!dxf?.entities?.length) return null;
  const entities = dxf.entities as { type: string; layer?: string; shape?: boolean; vertices?: Point[] }[];
  const bidang = entities.filter(
    (e) =>
      e.type === "LWPOLYLINE" &&
      (e.layer as string)?.trim().toUpperCase() === LAYER_BIDANG &&
      e.shape &&
      e.vertices?.length
  );
  return getBbox(bidang as Parameters<typeof getBbox>[0]);
}

function transform(
  x: number,
  y: number,
  bbox: { minX: number; minY: number; maxX: number; maxY: number },
  width: number,
  height: number,
  padding: number
): [number, number] {
  const dx = bbox.maxX - bbox.minX || 1;
  const dy = bbox.maxY - bbox.minY || 1;
  const scale = Math.min((width - 2 * padding) / dx, (height - 2 * padding) / dy);
  const cx = width / 2;
  const cy = height / 2;
  const midX = (bbox.minX + bbox.maxX) / 2;
  const midY = (bbox.minY + bbox.maxY) / 2;
  const sx = cx + (x - midX) * scale;
  const sy = cy - (y - midY) * scale;
  return [sx, sy];
}

export interface DxfToSvgOverlay {
  nib: string;
  luas: number;
}

/**
 * Parses DXF string and returns an SVG string (full layer drawing) for the right-half A3 layout.
 * Uses raw DXF coordinates (no TM-3 to WGS84); fits all entities to viewBox.
 * Optional overlays: NIB and L=luas m² at centroid of each BIDANG polygon.
 */
export function dxfToSvg(
  dxfString: string,
  width = 200,
  height = 260,
  padding = 10,
  overlays: DxfToSvgOverlay[] = []
): string {
  let dxf: { entities?: unknown[] } | null;
  try {
    const parser = new DxfParser();
    dxf = parser.parse(dxfString);
  } catch {
    return "";
  }
  if (!dxf?.entities?.length) return "";

  const entities = dxf.entities as {
    type: string;
    layer?: string;
    color?: number;
    colorIndex?: number;
    vertices?: Point[];
    center?: Point;
    radius?: number;
    startAngle?: number;
    endAngle?: number;
    startPoint?: Point;
    text?: string;
    textHeight?: number;
    xScale?: number;
    rotation?: number;
    shape?: boolean;
  }[];

  const bbox = getBbox(entities);
  if (!bbox) return "";

  const dx = bbox.maxX - bbox.minX || 1;
  const dy = bbox.maxY - bbox.minY || 1;
  const scale = Math.min((width - 2 * padding) / dx, (height - 2 * padding) / dy);
  const t = (x: number, y: number) => transform(x, y, bbox, width, height, padding);

  const paths: string[] = [];
  const texts: string[] = [];
  const overlayScale = scale;

  const bidang = entities.filter(
    (e) =>
      e.type === "LWPOLYLINE" &&
      (e.layer as string)?.trim().toUpperCase() === LAYER_BIDANG &&
      e.shape &&
      e.vertices?.length
  );
  for (let i = 0; i < bidang.length && i < overlays.length; i++) {
    const e = bidang[i];
    const ov = overlays[i];
    if (!ov || !e.vertices?.length) continue;
    const centroid = polygonCentroid(e.vertices);
    const [sx, sy] = t(centroid.x, centroid.y);
    const fontSize = Math.max(4, 8 * overlayScale);
    if (ov.nib) {
      texts.push(`<text x="${sx}" y="${sy}" font-size="${fontSize}" fill="#000000" text-anchor="middle" dominant-baseline="middle">${escapeXml(ov.nib)}</text>`);
    }
    if (ov.luas > 0) {
      texts.push(`<text x="${sx}" y="${sy + fontSize * 1.2}" font-size="${fontSize * 0.9}" fill="#000000" text-anchor="middle" dominant-baseline="middle">L=${Math.round(ov.luas)} m²</text>`);
    }
  }

  for (const e of entities) {
    const stroke = colorToHex(e.color);
    if (e.type === "LINE" && e.vertices && e.vertices.length >= 2) {
      const [x1, y1] = t(e.vertices[0].x, e.vertices[0].y);
      const [x2, y2] = t(e.vertices[1].x, e.vertices[1].y);
      paths.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="0.5"/>`);
    } else if (e.type === "LWPOLYLINE" && e.vertices && e.vertices.length > 0) {
      const pts = e.vertices.map((v) => t(v.x, v.y)).map(([a, b]) => `${a},${b}`).join(" ");
      paths.push(`<polyline points="${pts}" fill="none" stroke="${stroke}" stroke-width="0.5"/>`);
    } else if (e.type === "CIRCLE" && e.center != null && e.radius != null) {
      const [cx, cy] = t(e.center.x, e.center.y);
      const r = Math.abs(e.radius * scale);
      paths.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="0.5"/>`);
    } else if (e.type === "ARC" && e.center != null && e.radius != null && e.startAngle != null && e.endAngle != null) {
      const [cx, cy] = t(e.center.x, e.center.y);
      const r = Math.abs(e.radius * scale);
      const x1 = cx + r * Math.cos(e.startAngle);
      const y1 = cy - r * Math.sin(e.startAngle);
      const x2 = cx + r * Math.cos(e.endAngle);
      const y2 = cy - r * Math.sin(e.endAngle);
      const sweep = e.endAngle >= e.startAngle ? 1 : 0;
      const large = Math.abs(e.endAngle - e.startAngle) >= Math.PI ? 1 : 0;
      paths.push(`<path d="M ${x1} ${y1} A ${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}" fill="none" stroke="${stroke}" stroke-width="0.5"/>`);
    } else if (e.type === "TEXT" && e.startPoint && e.text) {
      const [sx, sy] = t(e.startPoint.x, e.startPoint.y);
      const h = Math.max(2, (e.textHeight ?? 2) * scale);
      const rot = e.rotation ?? 0;
      const fill = colorToHex(e.color);
      texts.push(`<text x="${sx}" y="${sy}" font-size="${Math.max(2, h)}" fill="${fill}" text-anchor="start" dominant-baseline="alphabetic" transform="rotate(${-rot} ${sx} ${sy})">${escapeXml(e.text)}</text>`);
    } else if (e.type === "POLYLINE" && e.vertices && e.vertices.length > 0) {
      const pts = (e.vertices as Point[]).map((v) => t(v.x, v.y)).map(([a, b]) => `${a},${b}`).join(" ");
      paths.push(`<polyline points="${pts}" fill="none" stroke="${stroke}" stroke-width="0.5"/>`);
    }
  }

  const svgPaths = paths.join("\n    ");
  const svgTexts = texts.join("\n    ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <g>${svgPaths}</g>
  <g>${svgTexts}</g>
</svg>`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function polygonCentroid(pts: Point[]): Point {
  if (!pts.length) return { x: 0, y: 0 };
  let sumX = 0, sumY = 0;
  for (const p of pts) {
    sumX += p.x;
    sumY += p.y;
  }
  return { x: sumX / pts.length, y: sumY / pts.length };
}

export interface DxfToSvgBidangOnlyOptions {
  width?: number;
  height?: number;
  padding?: number;
}

/**
 * Renders only closed LWPOLYLINE from layer BIDANG, black stroke, no text overlays.
 */
export function dxfToSvgBidangOnly(
  dxfString: string,
  options: DxfToSvgBidangOnlyOptions = {}
): string {
  const { width = 200, height = 120, padding = 8 } = options;
  let dxf: { entities?: unknown[] } | null;
  try {
    const parser = new DxfParser();
    dxf = parser.parse(dxfString);
  } catch {
    return "";
  }
  if (!dxf?.entities?.length) return "";

  const entities = dxf.entities as {
    type: string;
    layer?: string;
    shape?: boolean;
    vertices?: Point[];
  }[];

  const LAYER = "BIDANG";
  const bidang = entities.filter(
    (e) =>
      e.type === "LWPOLYLINE" &&
      (e.layer as string)?.trim().toUpperCase() === LAYER &&
      e.shape &&
      e.vertices?.length
  );

  if (!bidang.length) return "";

  const bbox = getBbox(bidang);
  if (!bbox) return "";

  const dx = bbox.maxX - bbox.minX || 1;
  const dy = bbox.maxY - bbox.minY || 1;
  const scale = Math.min((width - 2 * padding) / dx, (height - 2 * padding) / dy);
  const t = (x: number, y: number) => transform(x, y, bbox, width, height, padding);

  const paths: string[] = [];

  for (const e of bidang) {
    const pts = e.vertices!.map((v) => t(v.x, v.y)).map(([a, b]) => `${a},${b}`).join(" ");
    paths.push(`<polygon points="${pts}" fill="none" stroke="#000000" stroke-width="0.5"/>`);
  }

  const svgPaths = paths.join("\n    ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <g>${svgPaths}</g>
</svg>`;
}
