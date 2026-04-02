# Test execution — PLM go-live (pm-to-qa-009 + pm-to-qa-010)

**URL produksi:** `https://plm.kjsbbenning.id`  
**Hosting (uji asumsi):** Vercel — `ceo-to-pm-010`  
**Referensi AC / rencana:** `docs/QA-plm-go-live-008.md` (termasuk S-7..S-9, A10-W, AC-5.2, AC-6)  
**ARCH §10:** `docs/ARCH-domain-auth-subdomain-001.md` §10 + `docs/supabase-production-plm.md` §8  

**Cara pakai:** isi kolom **Hasil** (`PASS` / `FAIL` / `N/A` / `PEND`) dan **Catatan**; window production disepakati dengan PM/DevOps.

**Status handoff:** **pm-to-qa-012** — setelah DNS publik live (**2026-04-02**), §B **AUTO-5** = **PASS**; §C–D sebagian terisi dari **curl**; login / allowlist / logout = **PEND** operator + kredensial.

---

## A. Verifikasi statis (kode) — diisi QA

| ID | Item | Hasil | Bukti / catatan |
|----|------|-------|-----------------|
| **CR-1** | noindex,nofollow (meta dan/atau header) | **PASS** (pasca **pm-to-frontend-020**) | `app/layout.tsx`: `<meta name="robots" content="noindex, nofollow">` + `next.config.js`: `X-Robots-Tag` |
| **CR-2** | `robots.txt` disallow seluruh situs | **PASS** (pasca **pm-to-frontend-021**) | **`middleware.ts`** → `GET /robots.txt` = 200 `text/plain` + `Disallow: /` (bukan hanya `public/`) |
| **CR-3** | Allowlist client di login | **PASS** | `app/login/page.tsx` memakai `isEmailDomainAllowed`; `lib/auth/email-allowlist.ts` |
| **CR-4** | Callback path dokumentasi | **PASS** | `GET /auth/callback` — `supabase-production-plm.md` §1 |

---

## B. Pemeriksaan jarak jauh (opsional, otomatis)

| ID | Perintah / tindakan | Hasil | Catatan |
|----|---------------------|-------|---------|
| **AUTO-1** | `curl.exe -sI "https://plm.kjsbbenning.id/"` | **FAIL / N/E** | **2026-04-02 (pm-to-qa-011):** exit **6** (tidak ada respons TLS/HTTP). |
| **AUTO-2** | `nslookup plm.kjsbbenning.id` | **FAIL / N/E** | **2026-04-02:** resolver lokal → **Non-existent domain** (NXDOMAIN). Menunjukkan hostname **belum** ter-resolve dari jaringan ini — kemungkinan DNS cutover belum live, belum dipublish, atau zona terbatas. |
| **AUTO-3** | `curl.exe -sL "https://plm.kjsbbenning.id/robots.txt"` | **FAIL / N/E** | Sama pemblokir DNS/connect seperti AUTO-1. |
| **AUTO-4** | Ulang §B **pm-to-qa-012** — `nslookup` + `curl -sI` | **FAIL / N/E** | **2026-04-02 (sesi awal):** **NXDOMAIN**; `curl` exit **6**. |
| **AUTO-5** | §B **pm-to-qa-012** — ulang setelah DNS live | **PASS** | **2026-04-02:** `nslookup` → CNAME `*.vercel-dns-017.com`, A **216.198.79.65** / **64.29.17.65**. `curl -sI https://plm.kjsbbenning.id/` → **307** `Location: /login`, lalu **200** HTML; **Server: Vercel**; **Strict-Transport-Security** ada. |

**Kesimpulan otomatis:** hostname **resolve** dan **HTTPS** merespons (**AUTO-5**). Lanjutkan §C–D (smoke yang bisa di-**curl**); skenario sesi/login/allowlist UI = **PEND** operator. **Temuan:** `GET /robots.txt` → **404** (lihat **BUG-PLM-001** §F).

---

## C. Matriks manual — smoke & ARCH §10

> **2026-04-02:** **AUTO-5 PASS** — lanjut uji. **PEND** = operator + browser + akun. **S-7** ada temuan otomatis (§F).

| ID | AC / sumber | Langkah | Hasil | Catatan |
|----|-------------|---------|-------|---------|
| S-1 | AC-1 | HTTPS ke origin PLM | **PASS** | TLS OK; Vercel; HSTS; 307→`/login`→200 |
| S-2 | AC-2 | Incognito: `/dashboard` tanpa sesi | **PASS** | `curl -sI /dashboard` → **307** `Location: /login` → 200 login |
| S-3 | AC-3 | Login kredensial valid | **PEND** | Butuh akun internal + browser |
| S-4 | AC-3 | F5 di halaman internal | **PEND** | Bergantung S-3 |
| S-5 | AC-4 | Logout → akses ulang internal | **PEND** | Bergantung S-3 |
| S-6 | AC-1 | `http://plm.kjsbbenning.id` → upgrade | **PASS** | **308** → `https://…` lalu alur HTTPS |
| S-7 | AC-5.2 | Meta robots + `/robots.txt` | **FAIL** / **PEND** | **`/robots.txt` → 404** (BUG-PLM-001). HTML awal `/login` tanpa `<meta name="robots">` di shell — konfirmasi browser |
| S-8 | AC-6.1 | Email di luar allowlist ditolak | **PEND** | UI; N/A jika allowlist kosong |
| S-9 | AC-6.2 | `@kjsbbenning.id` valid login | **PEND** | Butuh kredensial |
| A10-W | ARCH §10 | Website utama tidak redirect paksa ke PLM | **PASS** | `curl -sI https://kjsbbenning.id/` → **200**; tanpa `Location` ke `plm.*` |

## D. Regression (middleware / redirect)

| ID | Fokus | Hasil | Catatan |
|----|-------|-------|---------|
| R-1 | Middleware, trailing slash | **PEND** | Uji `/dashboard/` vs `/dashboard` |
| R-2 | Session expired → sama seperti unauth | **PEND** | Butuh sesi lalu expire |
| R-3 | Magic link/OAuth → `/auth/callback`, hostname PLM | **N/A** | Flow password utama |
| R-4 | Deep link tanpa sesi aman | **PASS** | Sama bukti **S-2** |

---

## E. Go-live checklist (cuplikan — detail penuh di QA-plm-go-live-008 §3)

| # | Item | Centang | Bukti / catatan |
|---|------|---------|-----------------|
| G-1 | DNS + TLS Vercel | [x] | AUTO-5: resolve Vercel + HTTPS + HSTS |
| G-2 | Supabase Site URL + Redirect URLs | [ ] | Konfirmasi operator / Dashboard |
| G-3 | Env: `NEXT_PUBLIC_SITE_URL`, allowlist | [ ] | Konfirmasi DevOps |
| G-4 | Sign-up publik mati (Dashboard) | [ ] | Konfirmasi operator |

---

## F. Bug / regresi

| ID | Severity | Deskripsi | Owner |
|----|----------|-----------|-------|
| **BUG-PLM-001** | **High** (AC-5.2) | `https://plm.kjsbbenning.id/robots.txt` mengembalikan **404** HTML (bukan `text/plain` disallow). Repo punya `app/robots.ts` — deploy/routing perlu dicek **FE/DevOps**. | Frontend / DevOps |
| **BUG-PLM-002** | **Medium** | Respons HTML awal `/login` (curl) tidak memuat `<meta name="robots" …>` di `<head>`; metadata root `layout.tsx` mungkin tidak termuat di shell dokumentasi — verifikasi **FE** + uji browser. | Frontend |

**Pembaruan kode (2026-04-02):** **pm-to-frontend-020** / **`handoff/frontend-to-pm-020.md`** — `public/robots.txt`, meta literal di layout, `X-Robots-Tag` di `next.config.js`. **Ulang curl produksi** setelah deploy; tandai §C **S-7** / verdict setelah bukti live.

**Pembaruan kode (2026-04-02, lanjutan):** **pm-to-frontend-021** / **`handoff/frontend-to-pm-021.md`** — `/robots.txt` dilayani **middleware** (edge 200); `X-Robots-Tag` pada semua respons middleware; hapus `public/robots.txt`. **Redeploy wajib** — lalu ulang curl prod.

---

## G. Verdict go-live MVP (isi setelah baris prioritas terisi)

**Pilih satu:** `PASS` / `CONDITIONAL PASS` / `FAIL`

**Ringkasan satu kalimat:**

**CONDITIONAL PASS** — **2026-04-02:** DNS + HTTPS + redirect unauth + HTTP→HTTPS + isolasi domain utama **PASS** (bukti curl). **AC-5.2** gagal pada **`/robots.txt` (404)** dan sinyal meta robots **belum terkonfirmasi** di HTML awal → **BUG-PLM-001** / **002**. S-3..S-5, S-8, S-9, R-1, R-2, §E G-2..G-4 = **PEND** operator. **Bukan PASS penuh** sampai noindex/robots diperbaiki atau diverifikasi di browser + skenario sesi selesai.

**Penanggung jawab eksekusi manual:** QA (otomatis) + Operator (sisa PEND) **Tanggal:** 2026-04-02

---

## H. Catatan integrasi handoff

- **pm-to-qa-009:** eksekusi formal S-1..S-6, R-1..R-4 + ARCH §10 (via mapping di `QA-plm-go-live-008` §2.2–2.3).
- **pm-to-qa-010:** S-7 (noindex wajib), S-8/S-9 (allowlist), asumsi Vercel + URL tetap.
- **Open question PM:** allowlist dikosongkan → S-8 = N/A, dokumentasikan di §F atau G.
- **pm-to-qa-011:** Isi §C–G setelah hostname live; percobaan 2026-04-02: DNS NXDOMAIN → §C–F kosong, §G diisi **CONDITIONAL PASS (blocked)**.
- **pm-to-qa-012:** Ulang §B — **AUTO-5 PASS** setelah DNS live; §C sebagian terisi; handoff balik **`qa-to-pm-009.md`**.
- **Eskalasi NXDOMAIN:** tidak lagi aktif pada jaringan uji ini (resolve OK).
