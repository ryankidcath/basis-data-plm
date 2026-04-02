import type { NextRequest } from "next/server";

/**
 * Base URL untuk `metadataBase` / Open Graph (build-time).
 * Urutan: `NEXT_PUBLIC_SITE_URL` → `VERCEL_URL` (preview) → `http://localhost:3000`.
 * ARCH §6: produksi wajib set `NEXT_PUBLIC_SITE_URL=https://plm.kjsbbenning.id`.
 */
export function getSiteMetadataBase(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (explicit) {
    return new URL(explicit);
  }
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }
  return new URL("http://localhost:3000");
}

/**
 * Origin publik kanonis PLM (ARCH-domain-auth-subdomain-001 §6).
 * Produksi: set NEXT_PUBLIC_SITE_URL=https://plm.kjsbbenning.id (tanpa trailing slash).
 */
export function getPublicSiteOrigin(request: NextRequest): string {
  const requestOrigin = request.nextUrl.origin;
  if (process.env.NODE_ENV === "development") {
    return requestOrigin;
  }
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (explicit) {
    return explicit;
  }
  const forwarded = request.headers.get("x-forwarded-host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  if (forwarded) {
    return `${proto}://${forwarded}`;
  }
  return requestOrigin;
}
