# Handoff: DevOps / PIC → PM — bukti curl produksi **PASS** (pasca deploy hijau)

## From
DevOps / PIC (verifikasi)

## To
Project Manager

## Context
Rantai **pm-to-devops-015** … **017** + perbaikan build Vercel (**`lib/site-url.ts`** ter-commit, **`edb8360`** di **`main`**). Produksi **`https://plm.kjsbbenning.id`** memenuhi gate **noindex / robots** (**frontend-to-pm-021**, **ceo-to-pm-017**). Arsip kegagalan curl tetap di **`devops-to-pm-013.md`**.

**PM:** lanjut **`pm-to-qa-013`** dengan merujuk file ini sebagai bukti **PASS**.

---

## Ringkasan verifikasi — **PASS**

| Pengecekan | Target | Hasil |
|------------|--------|--------|
| `curl.exe -sI -X GET …/robots.txt` | **200** + `text/plain` | **200** + **`Content-Type: text/plain; charset=utf-8`** |
| `curl.exe -sI …/login` | **`X-Robots-Tag`** | **`X-Robots-Tag: noindex, nofollow`** |
| `curl.exe -s …/login` \| `Select-String -Pattern "robots"` | Meta noindex terlihat | **`meta name="robots" content="noindex, nofollow"`** |

**Catatan:** Untuk **`/robots.txt`**, respons **HEAD** implisit di beberapa jalur edge bisa **tidak** menyertakan `Content-Type`; gate **`text/plain`** dibuktikan dengan **`curl.exe -sI -X GET`** atau isi body (lihat bawah).

**Status keseluruhan:** **PASS** — **2026-04-02**.

---

## Output mentah — `curl.exe -sI -X GET https://plm.kjsbbenning.id/robots.txt`

```
HTTP/1.1 200 OK
Cache-Control: public, max-age=86400, s-maxage=86400
Content-Type: text/plain; charset=utf-8
Date: Thu, 02 Apr 2026 05:43:58 GMT
Server: Vercel
Strict-Transport-Security: max-age=63072000
X-Robots-Tag: noindex, nofollow
X-Vercel-Id: sin1::gxbwh-1775108638623-f1298150a86a
Transfer-Encoding: chunked
```

## Isi body — `curl.exe -s https://plm.kjsbbenning.id/robots.txt`

```
User-agent: *
Disallow: /
```

---

## Output mentah — `curl.exe -sI https://plm.kjsbbenning.id/login`

```
HTTP/1.1 200 OK
Accept-Ranges: bytes
Access-Control-Allow-Origin: *
Age: 113
Cache-Control: public, max-age=0, must-revalidate
Content-Disposition: inline
Content-Length: 11052
Content-Type: text/html; charset=utf-8
Date: Thu, 02 Apr 2026 05:43:48 GMT
Etag: "222af0b8ad269ddaca5b4474290b4d5b"
Server: Vercel
Strict-Transport-Security: max-age=63072000
Vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch
X-Matched-Path: /login
X-Robots-Tag: noindex, nofollow
X-Vercel-Cache: HIT
X-Vercel-Id: sin1::rtwm5-1775108628437-8160e2eb96cd
```

---

## `curl.exe -s https://plm.kjsbbenning.id/login` — pencarian `robots` (PowerShell)

Perintah: **`Select-String -Pattern "robots"`** pada body.

Cuplikan yang cocok (terminal pengguna / agen): beberapa kemunculan **`meta name="robots" content="noindex, nofollow"`** di `<head>` / payload RSC.

---

## Referensi git (bukan bukti runtime)

- **`origin/main`** (sesi dokumentasi ini): **`edb8360`** — `fix(plm): add lib/site-url.ts for Vercel build (metadataBase + auth origin)`.
- Perilaku edge: **`middleware.ts`** (**FE021**), **`app/layout.tsx`** (meta robots).
