// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// ─── Role definitions ────────────────────────────────────────────────────────
export type UserRole = 'customer' | 'Partner' | 'Wholesale Buyer' | 'Admin' | 'Super Admin';

// ─── Route access rules ──────────────────────────────────────────────────────
// Each entry: { path prefix → allowed roles (empty = any authenticated user) }
const PROTECTED_ROUTES: { prefix: string; roles: UserRole[] }[] = [
  { prefix: '/admin',     roles: ['Admin', 'Super Admin'] },
  { prefix: '/wholesale', roles: ['Wholesale Buyer', 'Admin', 'Super Admin'] },
  { prefix: '/partner',   roles: ['Partner', 'Admin', 'Super Admin'] },
  { prefix: '/account',   roles: ['customer', 'Admin', 'Super Admin'] },
  { prefix: '/checkout',  roles: ['customer', 'Admin', 'Super Admin'] },
];

// Routes that logged-in users should be bounced away from
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

// Where each role lands after login
const ROLE_HOME: Record<string, string> = {
  'customer':        '/account',
  'Partner':         '/partner',
  'Wholesale Buyer': '/wholesale',
  'Admin':           '/admin',
  'Super Admin':     '/admin',
};

// ─── Main middleware ──────────────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the Sanctum token from cookie (set by your login flow)
  const token = request.cookies.get('auth_token')?.value;

  let userRole: UserRole | null = null;

  if (token) {
    try {
      // Validate Sanctum token by calling the Laravel /api/me endpoint
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        // Short timeout so a slow backend doesn't hang the page
        signal: AbortSignal.timeout(3000),
      });

      if (res.ok) {
        const user = await res.json();
        // Covers both { data: { role: "Partner" } } and { role: "Partner" } shapes
        userRole = user?.data?.role ?? user?.role ?? null;
      }
    } catch {
      // Network error or timeout — treat as unauthenticated
      userRole = null;
    }
  }

  const isAuthenticated = !!userRole;

  // ── 1. Logged-in users visiting login/register → redirect to their dashboard ──
  if (isAuthenticated && AUTH_ROUTES.some(r => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL(ROLE_HOME[userRole!] ?? '/', request.url));
  }

  // ── 2. Check if this route needs protection ───────────────────────────────
  const rule = PROTECTED_ROUTES.find(r => pathname.startsWith(r.prefix));

  if (rule) {
    // Not logged in at all → go to login with a return URL
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Logged in but wrong role → send to their correct dashboard
    if (!rule.roles.includes(userRole!)) {
      return NextResponse.redirect(new URL(ROLE_HOME[userRole!] ?? '/', request.url));
    }
  }

  // ── 3. Pass role to pages via header (read with `headers()` in server components)
  const response = NextResponse.next();
  if (userRole) response.headers.set('x-user-role', userRole);
  return response;
}

// ─── Which routes does middleware run on? ────────────────────────────────────
// Exclude static files, images, fonts — only run on actual pages
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)',
  ],
};
