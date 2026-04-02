import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options: CookieOptions };

const ROBOTS_BODY = "User-agent: *\nDisallow: /\n";
const X_ROBOTS = "noindex, nofollow";

/** PLM internal — header di edge untuk semua respons middleware (pm-to-frontend-021). */
function withNoIndexHeader(res: NextResponse) {
  res.headers.set("X-Robots-Tag", X_ROBOTS);
  return res;
}

/** Copy Set-Cookie lines from session refresh onto a redirect response. */
function applySetCookieHeaders(from: NextResponse, to: NextResponse) {
  const lines = from.headers.getSetCookie?.() ?? [];
  for (const line of lines) {
    to.headers.append("Set-Cookie", line);
  }
}

export async function middleware(request: NextRequest) {
  // Satu sumber /robots.txt di edge — menghindari 404 bila public/ tidak ikut deploy (devops-to-pm-012).
  if (request.nextUrl.pathname === "/robots.txt") {
    return new NextResponse(ROBOTS_BODY, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "X-Robots-Tag": X_ROBOTS,
      },
    });
  }

  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const redirect = NextResponse.redirect(url);
    applySetCookieHeaders(response, redirect);
    return withNoIndexHeader(redirect);
  }

  if (request.nextUrl.pathname === "/login" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    const redirect = NextResponse.redirect(url);
    applySetCookieHeaders(response, redirect);
    return withNoIndexHeader(redirect);
  }

  if (request.nextUrl.pathname === "/" && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const redirect = NextResponse.redirect(url);
    applySetCookieHeaders(response, redirect);
    return withNoIndexHeader(redirect);
  }

  return withNoIndexHeader(response);
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/robots.txt", "/auth/:path*"],
};
