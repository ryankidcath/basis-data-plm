import { NextRequest, NextResponse } from "next/server";
import { getOrCreateThreadForPermohonan } from "@/lib/discord";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const permohonanId = body?.permohonanId as string | undefined;
    if (!permohonanId || typeof permohonanId !== "string") {
      return NextResponse.json(
        { error: "permohonanId required" },
        { status: 400 }
      );
    }

    const threadId = await getOrCreateThreadForPermohonan(permohonanId);
    return NextResponse.json({ threadId });
  } catch (err) {
    console.error("[discord/create-thread]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal membuat thread Discord" },
      { status: 500 }
    );
  }
}
