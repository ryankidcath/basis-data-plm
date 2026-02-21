import { createClient } from "@/lib/supabase/server";

const DISCORD_API = "https://discord.com/api/v10";

function getConfig() {
  const token = process.env.DISCORD_BOT_TOKEN?.trim();
  const channelId = process.env.DISCORD_CHANNEL_ID?.trim();
  return { token, channelId };
}

/**
 * Returns the Discord thread channel ID for this permohonan.
 * If none exists, creates a thread (name = kode_kjsb), saves it, and returns it.
 * Returns null if Discord is not configured.
 */
export async function getOrCreateThreadForPermohonan(
  permohonanId: string
): Promise<string | null> {
  const { token, channelId } = getConfig();
  if (!token || !channelId) {
    console.warn("[Discord] DISCORD_BOT_TOKEN atau DISCORD_CHANNEL_ID tidak diset; thread tidak dibuat.");
    return null;
  }

  const supabase = await createClient();
  const { data: row, error: fetchError } = await supabase
    .from("permohonan")
    .select("kode_kjsb, discord_thread_id")
    .eq("id", permohonanId)
    .single();

  if (fetchError || !row) {
    console.error("[Discord] Gagal baca permohonan:", fetchError?.message ?? "row tidak ditemukan", "permohonanId:", permohonanId);
    return null;
  }
  const kodeKjsb = (row as { kode_kjsb: string; discord_thread_id: string | null }).kode_kjsb;
  const existing = (row as { discord_thread_id: string | null }).discord_thread_id;
  if (existing) return existing;

  const res = await fetch(`${DISCORD_API}/channels/${channelId}/threads`, {
    method: "POST",
    headers: {
      Authorization: `Bot ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: kodeKjsb.slice(0, 100),
      message: { content: `Permohonan ${kodeKjsb}` },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[Discord] create thread gagal:", res.status, err, "| channelId:", channelId, "| Gunakan Forum channel dan pastikan bot punya permission Create Posts.");
    return null;
  }

  const thread = (await res.json()) as { id: string };
  const threadId = thread.id;

  const { error: updateError } = await supabase
    .from("permohonan")
    .update({ discord_thread_id: threadId })
    .eq("id", permohonanId);

  if (updateError) {
    console.error("[Discord] discord_thread_id tidak tersimpan di Supabase:", updateError.message, "| permohonanId:", permohonanId);
  }

  return threadId;
}

/**
 * Sends a file to a Discord thread (channel). No-op if token missing.
 */
export async function sendFileToThread(
  threadId: string,
  fileBuffer: Buffer,
  filename: string,
  content?: string
): Promise<void> {
  const { token } = getConfig();
  if (!token) return;

  const form = new FormData();
  form.append("file", new Blob([fileBuffer]), filename);
  if (content) form.append("content", content);

  const res = await fetch(`${DISCORD_API}/channels/${threadId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bot ${token}` },
    body: form,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[Discord] send file failed:", res.status, err);
  }
}

/**
 * Fetches the first .dxf file found in the thread's messages (newest first).
 * Returns buffer or null if no DXF attachment or Discord not configured.
 */
export async function fetchDxfFromThread(threadId: string): Promise<Buffer | null> {
  const { token } = getConfig();
  if (!token) return null;

  const res = await fetch(`${DISCORD_API}/channels/${threadId}/messages?limit=50`, {
    headers: { Authorization: `Bot ${token}` },
  });
  if (!res.ok) return null;

  const messages = (await res.json()) as { attachments?: { filename: string; url: string }[] }[];
  for (const msg of messages) {
    const att = msg.attachments?.find((a) => a.filename.toLowerCase().endsWith(".dxf"));
    if (!att) continue;
    const fileRes = await fetch(att.url);
    if (!fileRes.ok) continue;
    const ab = await fileRes.arrayBuffer();
    return Buffer.from(ab);
  }
  return null;
}
