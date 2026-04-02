# Pengembangan lokal & environment (Basis Data PLM)

Ringkasan untuk developer; detail arsitektur domain/auth: **`docs/ARCH-domain-auth-subdomain-001.md`**, Supabase: **`docs/supabase-production-plm.md`**.

## Persyaratan

- Node.js sesuai `package.json`
- Salin `.env.local.example` → **`.env.local`** dan isi nilai nyata (jangan commit `.env.local`)

## Variabel — lokal vs produksi (tanpa secret)

| Variable | Lokal (contoh bentuk) | Produksi (`plm.kjsbbenning.id`) |
|----------|------------------------|----------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Sama (project Supabase prod) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key (dari dashboard) | Sama |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | **`https://plm.kjsbbenning.id`** (tanpa trailing slash) |
| `DISCORD_BOT_TOKEN` | token bot (server-only) | token prod |
| `DISCORD_CHANNEL_ID` | id channel | id prod |

**Opsional:** `NEXT_PUBLIC_ALLOWED_AUTH_EMAIL_DOMAINS` — lihat `.env.local.example`.

## Perilaku penting

- **SEO / indeks:** PLM internal — **`middleware.ts`** melayani **`GET /robots.txt`** (200 `text/plain`, `Disallow: /`) + **`X-Robots-Tag`** di semua path yang lewat middleware; root layout: meta literal + `metadata.robots`; **`next.config.js` → `headers()`** sebagai cadangan — AC-5.2 (**pm-to-frontend-021**).
- **Login / redirect:** path relatif (`/login`, `/dashboard`); tidak hardcode domain di UI.
- **Callback OAuth/PKCE:** `app/auth/callback/route.ts` — daftarkan **`https://plm.kjsbbenning.id/auth/callback`** di Supabase Redirect URLs (ARCH §5.2).
- **Metadata / OG:** `app/layout.tsx` memakai `metadataBase` dari `getSiteMetadataBase()` (`lib/site-url.ts`) agar URL kanonis mengikuti `NEXT_PUBLIC_SITE_URL` di build produksi.

## Perintah

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start    # setelah build
```

## Verifikasi cepat sebelum deploy

1. `NEXT_PUBLIC_SITE_URL` di panel hosting production = `https://plm.kjsbbenning.id`.
2. Build lokal dengan env prod (atau preview) — tidak mengandalkan localhost untuk redirect callback.
3. Smoke ARCH §10 / `docs/QA-plm-go-live-008.md` setelah go-live.
