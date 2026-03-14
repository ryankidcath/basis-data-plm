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
 * Returns the Discord thread channel ID for the given kode KJSB.
 * Lists active threads, then archived/public; if not found, creates a new thread.
 * No DB lookup — used before permohonan exists.
 * Returns null if Discord is not configured.
 */
export async function getOrCreateThreadByKode(kodeKjsb: string): Promise<string | null> {
  const { token, channelId } = getConfig();
  if (!token || !channelId) {
    console.warn("[Discord] DISCORD_BOT_TOKEN atau DISCORD_CHANNEL_ID tidak diset; thread tidak dibuat.");
    return null;
  }

  const searchName = kodeKjsb.trim().slice(0, 100);
  if (!searchName) return null;

  const headers = { Authorization: `Bot ${token}` };

  // 1. Search active threads
  const activeRes = await fetch(
    `${DISCORD_API}/channels/${channelId}/threads/active`,
    { headers }
  );
  if (activeRes.ok) {
    const data = (await activeRes.json()) as { threads: { id: string; name: string }[] };
    const found = data.threads?.find((t) => t.name === searchName);
    if (found) return found.id;
  }

  // 2. Search archived/public threads
  const archivedRes = await fetch(
    `${DISCORD_API}/channels/${channelId}/threads/archived/public?limit=100`,
    { headers }
  );
  if (archivedRes.ok) {
    const data = (await archivedRes.json()) as { threads: { id: string; name: string }[] };
    const found = data.threads?.find((t) => t.name === searchName);
    if (found) return found.id;
  }

  // 3. Create new thread
  const createRes = await fetch(`${DISCORD_API}/channels/${channelId}/threads`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: searchName,
      message: { content: `Berkas ${searchName}` },
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    console.error("[Discord] create thread by kode gagal:", createRes.status, err, "| kodeKjsb:", searchName);
    return null;
  }

  const thread = (await createRes.json()) as { id: string };
  return thread.id;
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
  form.append("file", new Blob([new Uint8Array(fileBuffer)]), filename);
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
