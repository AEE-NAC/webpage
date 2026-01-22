import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "./context/adapt";

export function proxy(request: NextRequest) {
  // 1. Protect Admin Routes
  if (request.nextUrl.pathname.includes("/admin")) {
    // Exclude public admin routes
    if (
      request.nextUrl.pathname.includes("/admin/login") ||
      request.nextUrl.pathname.includes("/admin/invite")
    ) {
      return NextResponse.next();
    }

    const session = request.cookies.get("cms_session");

    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = `/${request.nextUrl.locale || "fr"}/admin/login`; // Default to FR if no locale
      // Try to preserve locale if in path (e.g. /en/admin)
      const segments = request.nextUrl.pathname.split("/");
      if (segments.length > 2 && ["en", "fr", "es", "ht"].includes(segments[1])) {
        url.pathname = `/${segments[1]}/admin/login`;
      }
      return NextResponse.redirect(url);
    }
  }

  const { pathname } = request.nextUrl;

  // Skip internal next files, api, and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return;
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = defaultLocale;
  request.nextUrl.pathname = `/${locale}${pathname}`;

  // Return a redirect response (307 Temporary Redirect is default, use 308 for SEO permanent if confident)
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
  ],
};