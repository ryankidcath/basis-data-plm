import React from "react";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchDxfFromThread } from "@/lib/discord";
import {
  dxfToSvg,
  dxfToSvgBidangOnly,
  getBboxFromDxf,
  getBboxBidangFromDxf,
} from "@/lib/dxf-to-svg";
import { renderToBuffer } from "@react-pdf/renderer";
import sharp from "sharp";
import { GambarHasilUkurPdf } from "@/components/cetak/GambarHasilUkurPdf";

export async function GET(request: NextRequest) {
  const permohonanId = request.nextUrl.searchParams.get("permohonanId");
  const format = request.nextUrl.searchParams.get("format");

  if (!permohonanId) {
    return NextResponse.json({ error: "permohonanId required" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("permohonan")
      .select("discord_thread_id")
      .eq("id", permohonanId)
      .single();

    if (error || !row) {
      return NextResponse.json({ error: "Permohonan tidak ditemukan" }, { status: 404 });
    }

    const threadId = (row as { discord_thread_id: string | null }).discord_thread_id;
    if (!threadId) {
      return NextResponse.json(
        { error: "Belum ada thread Discord untuk permohonan ini. Upload DXF di tab NIB, GU, dan PBT." },
        { status: 404 }
      );
    }

    const dxfBuffer = await fetchDxfFromThread(threadId);
    if (!dxfBuffer || dxfBuffer.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada file DXF di thread Discord. Upload DXF di tab NIB, GU, dan PBT." },
        { status: 404 }
      );
    }

    const { data: bidangRows } = await supabase
      .from("bidang_tanah")
      .select("id, luas_otomatis, nib")
      .eq("permohonan_id", permohonanId)
      .order("created_at", { ascending: true });

    const overlays = (bidangRows ?? []).map((r: { luas_otomatis: number | null; nib: string | null }) => ({
      nib: (r.nib ?? "").trim(),
      luas: r.luas_otomatis ?? 0,
    }));

    const dxfString = dxfBuffer.toString("utf-8");
    const bbox = getBboxFromDxf(dxfString);
    if (!bbox) {
      return NextResponse.json(
        { error: "File DXF tidak dapat di-render (kosong atau format tidak didukung)." },
        { status: 422 }
      );
    }

    const SCALE = 250;
    const MAX_WIDTH_MM = 148;
    const padding = 10;

    let widthMm = ((bbox.maxX - bbox.minX) * 1000) / SCALE;
    let heightMm = ((bbox.maxY - bbox.minY) * 1000) / SCALE;
    if (widthMm > MAX_WIDTH_MM) {
      const ratio = MAX_WIDTH_MM / widthMm;
      widthMm = MAX_WIDTH_MM;
      heightMm *= ratio;
    }

    const svgFull = dxfToSvg(dxfString, widthMm, heightMm, padding, overlays);
    if (!svgFull) {
      return NextResponse.json(
        { error: "File DXF tidak dapat di-render (kosong atau format tidak didukung)." },
        { status: 422 }
      );
    }

    const bboxBidang = getBboxBidangFromDxf(dxfString);
    let dimensionsBidang: { widthMm: number; heightMm: number } | null = null;
    let svgBidang = "";
    if (bboxBidang) {
      let wB = ((bboxBidang.maxX - bboxBidang.minX) * 1000) / SCALE;
      let hB = ((bboxBidang.maxY - bboxBidang.minY) * 1000) / SCALE;
      if (wB > MAX_WIDTH_MM) {
        const ratio = MAX_WIDTH_MM / wB;
        wB = MAX_WIDTH_MM;
        hB *= ratio;
      }
      dimensionsBidang = { widthMm: wB, heightMm: hB };
      svgBidang = dxfToSvgBidangOnly(dxfString, {
        width: wB,
        height: hB,
        padding,
      });
    }

    if (format === "pdf") {
      const DPI = 150;
      const mmToPx = (mm: number) => Math.round((mm / 25.4) * DPI);

      const svgToPng = async (svg: string, wMm: number, hMm: number): Promise<string> => {
        const png = await sharp(Buffer.from(svg))
          .resize({
            width: mmToPx(wMm),
            height: mmToPx(hMm),
            fit: "fill",
          })
          .png()
          .toBuffer();
        return png.toString("base64");
      };

      const mainImageBase64 = await svgToPng(svgFull, widthMm, heightMm);
      let fieldImageBase64: string | null = null;
      let fieldImageWidthMm = 0;
      let fieldImageHeightMm = 0;

      if (svgBidang && dimensionsBidang) {
        fieldImageBase64 = await svgToPng(
          svgBidang,
          dimensionsBidang.widthMm,
          dimensionsBidang.heightMm
        );
        fieldImageWidthMm = dimensionsBidang.widthMm;
        fieldImageHeightMm = dimensionsBidang.heightMm;
      }

      const pdfBuffer = await renderToBuffer(
        React.createElement(GambarHasilUkurPdf, {
          mainImageBase64,
          mainImageWidthMm: widthMm,
          mainImageHeightMm: heightMm,
          fieldImageBase64,
          fieldImageWidthMm,
          fieldImageHeightMm,
        }) as React.ReactElement
      );

      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="gambar-hasil-ukur.pdf"',
        },
      });
    }

    return NextResponse.json({
      svgFull,
      svgBidang: svgBidang || "",
      dimensions: { widthMm, heightMm },
      dimensionsBidang,
    });
  } catch (err) {
    console.error("[cetak/gambar-hasil-ukur]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal mengambil gambar hasil ukur" },
      { status: 500 }
    );
  }
}
