import { NextRequest, NextResponse } from "next/server";
import { getOrCreateThreadForPermohonan, sendFileToThread } from "@/lib/discord";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

function isValidPdf(file: File): boolean {
  const type = file.type?.toLowerCase();
  const name = file.name?.toLowerCase() ?? "";
  return type === "application/pdf" || name.endsWith(".pdf");
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const permohonanId = (formData.get("permohonanId") as string)?.trim() || null;

    if (!permohonanId) {
      return NextResponse.json(
        { error: "permohonanId wajib diisi." },
        { status: 400 }
      );
    }

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: "File PDF tidak ada atau kosong." },
        { status: 400 }
      );
    }

    if (!isValidPdf(file)) {
      return NextResponse.json(
        { error: "Hanya file PDF (application/pdf atau ekstensi .pdf) yang diterima." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file melebihi batas 25MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const threadId = await getOrCreateThreadForPermohonan(permohonanId);
    if (!threadId) {
      return NextResponse.json(
        { error: "Permohonan tidak ditemukan atau Discord tidak terkonfigurasi." },
        { status: 404 }
      );
    }

    await sendFileToThread(threadId, buffer, file.name, "Upload PDF");

    return NextResponse.json({
      ok: true,
      message: "PDF berhasil dikirim ke Discord.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal mengirim PDF ke Discord.";
    console.error("[upload-pdf]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
