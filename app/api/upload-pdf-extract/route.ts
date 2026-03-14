import { NextRequest, NextResponse } from "next/server";
import { getOrCreateThreadByKode, sendFileToThread } from "@/lib/discord";

export const runtime = "nodejs";
export const maxDuration = 60;

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
    const kodeKjsb = (formData.get("kodeKjsb") as string)?.trim() || null;

    if (!kodeKjsb) {
      return NextResponse.json(
        { error: "kodeKjsb wajib diisi." },
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

    const threadId = await getOrCreateThreadByKode(kodeKjsb);
    if (!threadId) {
      return NextResponse.json(
        { error: "Discord tidak terkonfigurasi." },
        { status: 404 }
      );
    }

    await sendFileToThread(threadId, buffer, file.name, "Upload PDF");

    return NextResponse.json({ discordThreadId: threadId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal mengirim PDF ke Discord.";
    console.error("[upload-pdf-extract]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
