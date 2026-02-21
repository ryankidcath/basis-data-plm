import { NextRequest, NextResponse } from "next/server";
import { dxfToGeoJson } from "@/lib/dxf-to-geojson";
import { getOrCreateThreadForPermohonan, sendFileToThread } from "@/lib/discord";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const layerName = (formData.get("layerName") as string)?.trim() || "BIDANG";
    const permohonanId = (formData.get("permohonanId") as string)?.trim() || null;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: "File DXF tidak ada atau kosong." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const dxfString = new TextDecoder().decode(arrayBuffer);
    const polygons = dxfToGeoJson(dxfString, {
      layerName: layerName || undefined,
      transformToWgs84: true,
    });

    if (polygons.length === 0) {
      return NextResponse.json(
        {
          error:
            "Tidak ditemukan LWPOLYLINE tertutup di layer tersebut. Pastikan layer nama benar dan poliline dalam keadaan closed.",
        },
        { status: 422 }
      );
    }

    if (permohonanId) {
      try {
        const threadId = await getOrCreateThreadForPermohonan(permohonanId);
        if (threadId) {
          const buffer = Buffer.from(arrayBuffer);
          await sendFileToThread(threadId, buffer, file.name, "Upload DXF");
        }
      } catch (discordErr) {
        console.error("[upload-dxf] Discord send failed:", discordErr);
      }
    }

    return NextResponse.json({
      geometries: polygons.map((p) => ({ type: "Polygon" as const, coordinates: p.coordinates })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal memproses DXF.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
