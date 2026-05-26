import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("user_role")?.value;
  const { pathname } = request.nextUrl;

  // 1. If trying to access protected route without token, redirect to login
  const isProtectedRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/partner") ||
    pathname.startsWith("/wholesale") ||
    pathname.startsWith("/account");

  if (isProtectedRoute && !token) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // 2. Role-based routing restrictions
  if (token && role) {
    // If Admin or Super Admin tries to access partner/wholesale routes etc, or vice versa
    if (
      pathname.startsWith("/admin") &&
      !(role === "Super Admin" || role === "Admin")
    ) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (pathname.startsWith("/partner") && role !== "Partner") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (pathname.startsWith("/wholesale") && role !== "Wholesale Buyer") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // 3. Prevent logged in users from visiting login page
  if (pathname.startsWith("/auth/login") && token && role) {
    // Redirect based on role
    switch (role) {
      case "Super Admin":
      case "Admin":
        return NextResponse.redirect(new URL("/admin", request.url));
      case "Partner":
        return NextResponse.redirect(
          new URL("/partner/dashboard", request.url),
        );
      case "Wholesale Buyer":
        return NextResponse.redirect(
          new URL("/wholesale/dashboard", request.url),
        );
      default:
        return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  return NextResponse.next();
}

// Matcher to specify which routes this proxy applies to
export const config = {
  matcher: [
    "/admin/:path*",
    "/partner/:path*",
    "/wholesale/:path*",
    "/account/:path*",
    "/auth/login",
  ],
};
