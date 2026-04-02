# Handoff: DevOps / PIC → PM — bukti curl produksi (sesi pm-to-devops-015)

> **Produksi — curl PASS (2026-04-02):** bukti ringkas + output mentah ada di **`devops-to-pm-014.md`**. Dokumen **013** di bawah ini tetap arsip sesi **015**/**016**/**017** (FAIL / diagnosis).

## From
DevOps / PIC (verifikasi agen)

## To
Project Manager

## Context
**pm-to-devops-015** / **016** + **ceo-to-pm-016** / **017** — gate redeploy + bukti sebelum **pm-to-qa-013**.

**Temuan git (pm-to-devops-016, repo lokal `basis-data-plm`):** isi **`middleware.ts` pada `HEAD` / `origin/main`** (`6c33a34`) **tidak** memuat short-circuit **`/robots.txt`** (masih pola lama tanpa FE021). Perubahan **frontend-to-pm-021** ada di **working tree** ter-modifikasi, **bukan** di commit yang akan dibangun Vercel. **Tanpa commit + push** ke branch Production, redeploy saja **tidak** akan membawa fix.

**Kesimpulan agen:** **(1)** **Frontend / PIC git:** commit & push **`middleware.ts`** (+ berkas terkait **021**) ke **`main`** (remote). **(2)** **Vercel:** redeploy / promote dari **HEAD** remote yang sudah berisi commit itu. **(3)** Ulangi curl; barulah ringkasan bisa **PASS**.

**Pembaruan pm-to-devops-017 (agen, setelah `git fetch`):** **`origin/main`** sudah memuat **FE021** (commit fungsional **`8d9a59e`**, tip **`117b0b1`**). Sesi **017** mencatat produksi **masih** gagal curl hingga build Vercel diperbaiki.

**Pembaruan pasca deploy hijau:** **`devops-to-pm-014.md`** berisi bukti **PASS** (2026-04-02), termasuk commit **`edb8360`** (**`lib/site-url.ts`**) dan curl mentah.

---

## Ringkasan verifikasi (sesi agen)

| Pengecekan | Target | Hasil |
|------------|--------|--------|
| `curl.exe -sI …/robots.txt` | **200** + `text/plain` | **404** — **GAGAL** |
| `curl.exe -sI …/login` | **X-Robots-Tag** | **Tidak ada** — **GAGAL** |
| `curl.exe -s …/login` | `meta … robots … noindex, nofollow` | Substring **robots** tidak ditemukan di body (pencarian agen) — **GAGAL** |

**Status keseluruhan:** **FAIL** — **curl produksi** belum hijau (**017**: git remote sudah OK, **Vercel** belum pada HEAD baru). Setelah **redeploy** + curl **PASS**, ubah ringkasan ke **PASS** atau buat **`devops-to-pm-014.md`** hanya-PASS (arsip **013** tetap FAIL).

---

## Output mentah — `curl.exe -sI https://plm.kjsbbenning.id/robots.txt` (sesi **016**)

```
HTTP/1.1 404 Not Found
Accept-Ranges: bytes
Access-Control-Allow-Origin: *
Age: 65775
Cache-Control: public, max-age=0, must-revalidate
Content-Disposition: inline; filename="404"
Content-Length: 7318
Content-Type: text/html; charset=utf-8
Date: Thu, 02 Apr 2026 05:12:45 GMT
Etag: "97b399796b3ba68198827c8d259187bf"
Last-Modified: Wed, 01 Apr 2026 10:56:30 GMT
Server: Vercel
Strict-Transport-Security: max-age=63072000
X-Matched-Path: /404
X-Next-Error-Status: 404
X-Vercel-Cache: HIT
X-Vercel-Id: sin1::466kk-1775106765942-806b597aff4f
```

---

## Output mentah — `curl.exe -sI https://plm.kjsbbenning.id/login` (sesi **016**)

```
HTTP/1.1 200 OK
Accept-Ranges: bytes
Access-Control-Allow-Origin: *
Age: 3576
Cache-Control: public, max-age=0, must-revalidate
Content-Disposition: inline
Content-Length: 10758
Content-Type: text/html; charset=utf-8
Date: Thu, 02 Apr 2026 05:12:48 GMT
Etag: "b04782327031668e238ffb8575ad0548"
Server: Vercel
Strict-Transport-Security: max-age=63072000
Vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch
X-Matched-Path: /login
X-Vercel-Cache: HIT
X-Vercel-Id: sin1::t6ksm-1775106767581-c75db6af6e58
```

---

## `curl.exe -s https://plm.kjsbbenning.id/login` — pencarian `robots`

Agen: **PowerShell `Select-String -Pattern "robots"`** pada body → **tanpa keluaran** (meta `noindex, nofollow` tidak terlihat pada HTML statis yang diunduh).

---

## Bukti git (pm-to-devops-016) — *bukan produksi*

```text
# git log -1 --oneline (lokal, setelah fetch)
6c33a34 Ganti tampilan

# middleware.ts di HEAD (10 baris pertama) — tanpa handler /robots.txt FE021
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
```

Perubahan **021** (short-circuit `robots.txt`, `withNoIndexHeader`, matcher) **hanya** di working tree; **`git status`**: `M middleware.ts`, dll. **Eskalasi Frontend / PIC:** **commit + push** ke **`origin/main`** (atau branch yang dipakai Vercel), lalu redeploy.

## pm-to-devops-017 — bukti git (remote) + curl produksi (masih FAIL)

### Git (`git fetch origin` lalu `origin/main`)

```text
# git log -1 --oneline origin/main
117b0b1 docs(handoff): stabilize frontend-to-pm-022 (anchor FE021 8d9a59e)

# middleware.ts di origin/main — FE021 (short-circuit /robots.txt + X-Robots-Tag)
const ROBOTS_BODY = "User-agent: *\nDisallow: /\n";
…
if (request.nextUrl.pathname === "/robots.txt") {
  return new NextResponse(ROBOTS_BODY, { status: 200, headers: { … "X-Robots-Tag": X_ROBOTS } });
}
```

Commit fungsional **021:** **`8d9a59e`** `fix(plm): serve robots.txt in middleware + X-Robots-Tag (frontend-to-pm-021)`.

### Output mentah — `curl.exe -sI https://plm.kjsbbenning.id/robots.txt` (sesi **017**, 2026-04-02)

```
HTTP/1.1 404 Not Found
Accept-Ranges: bytes
Access-Control-Allow-Origin: *
Age: 66675
Cache-Control: public, max-age=0, must-revalidate
Content-Disposition: inline; filename="404"
Content-Length: 7318
Content-Type: text/html; charset=utf-8
Date: Thu, 02 Apr 2026 05:27:46 GMT
Etag: "97b399796b3ba68198827c8d259187bf"
Last-Modified: Wed, 01 Apr 2026 10:56:30 GMT
Server: Vercel
Strict-Transport-Security: max-age=63072000
X-Matched-Path: /404
X-Next-Error-Status: 404
X-Vercel-Cache: HIT
X-Vercel-Id: sin1::k8c7c-1775107666760-4fa0f10ac688
```

Dengan header `Cache-Control: no-cache` / `Pragma: no-cache` hasil **tetap 404** (bukan sekadar cache browser).

### Output mentah — `curl.exe -sI https://plm.kjsbbenning.id/login` (sesi **017**)

```
HTTP/1.1 200 OK
Accept-Ranges: bytes
Access-Control-Allow-Origin: *
Age: 4475
Cache-Control: public, max-age=0, must-revalidate
Content-Disposition: inline
Content-Length: 10758
Content-Type: text/html; charset=utf-8
Date: Thu, 02 Apr 2026 05:27:47 GMT
Etag: "b04782327031668e238ffb8575ad0548"
Server: Vercel
Strict-Transport-Security: max-age=63072000
Vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch
X-Matched-Path: /login
X-Vercel-Cache: HIT
X-Vercel-Id: sin1::6cph5-1775107667057-f3c3afdf959a
```

### `curl.exe -s …/login` — pencarian `robots` (sesi **017**)

Agen: **`Select-String -Pattern "robots"`** → **tanpa keluaran**.

## Tindakan PIC (**015** … **017**)

1. **Git:** **terpenuhi di remote (017)** — **`origin/main`** memuat **`8d9a59e`** / tip **`117b0b1`** dengan **FE021** di **`middleware.ts`**.
2. **Vercel:** **redeploy** / promote **Production** **basis-data-plm** dari **HEAD** branch yang sama dengan remote di atas; pastikan deployment aktif **bukan** build pr-**8d9a59e**. Purge / invalidate bila panel menyediakan opsi.
3. Ulangi tiga curl (**016** / **017**); jika **PASS** → **`devops-to-pm-014.md`** (hanya PASS) **atau** perbarui bagian atas **013**; **PM** → **pm-to-qa-013** (**ceo-to-pm-017**).
4. **Tanpa** deployment baru yang menyamai remote, redeploy ulang **tidak** mengubah fakta curl — tetapi **setelah** push, **tanpa** langkah Vercel ini produksi **tetap** gagal (**017** constraint sebaliknya sudah lewat: remote siap).

---

## Referensi repo (bukan bukti prod)

- **`handoff/frontend-to-pm-021.md`** — perilaku yang diharapkan setelah deploy.
- **`middleware.ts`** — `pathname === "/robots.txt"` → `NextResponse` 200 + `ROBOTS_BODY`.
