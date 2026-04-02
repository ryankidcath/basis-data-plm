# Handoff — Frontend Engineer → Project Manager

## From
Frontend Engineer

## To
Project Manager

## Context
Penutupan **pm-to-frontend-021** (pasca **devops-to-pm-012**): `/robots.txt` 404 di prod + sinyal noindex tidak terlihat di curl.

## Result

| Area | Perubahan |
|------|-----------|
| **`/robots.txt`** | **`middleware.ts`** mem-short-circuit **`GET /robots.txt`** → **200** `text/plain; charset=utf-8`, body `User-agent: *` + `Disallow: /`, **`X-Robots-Tag`**, `Cache-Control` 24h. Tidak bergantung pada **`public/`** ikut artifact deploy. |
| **`public/robots.txt`** | **Dihapus** — satu sumber kebenaran (edge middleware). |
| **Matcher** | Ditambah **`/robots.txt`**, **`/auth/:path*`** (refresh sesi callback tetap jalan). |
| **`X-Robots-Tag`** | **`withNoIndexHeader()`** pada setiap **`return`** middleware (redirect + `NextResponse.next`). |
| **`app/layout.tsx`** | **`metadata.robots`** dikembalikan (selaras meta literal di `<head>`). |
| **`next.config.js`** | **`headers()`** tetap sebagai lapisan cadangan. |
| **Docs** | **`docs/DEVELOPMENT.md`** — deskripsi strategi diperbarui. |

Auth / redirect **`/` → `/login`**, **`/dashboard`** tanpa sesi → tidak diubah.

## Verifikasi lokal (`npm run build` + `next start -p 3001`)

```text
curl.exe -sI http://localhost:3001/robots.txt   → 200, content-type text/plain, x-robots-tag
curl.exe -s   http://localhost:3001/robots.txt → User-agent / Disallow
curl.exe -sI http://localhost:3001/login       → 200, x-robots-tag
curl.exe -s   http://localhost:3001/login      → substring meta robots noindex,nofollow
```

## Done when (repo)

- [x] `npm run build` OK
- [x] Cuplikan curl di atas

## Next

- **Merge + redeploy** (**pm-to-devops-015**); ulang curl ke **`https://plm.kjsbbenning.id`**; DevOps isi **`devops-to-pm-013`** (atau file tersedia) **PASS**; QA **pm-to-qa-013**.
