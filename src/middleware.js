import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname, hostname } = request.nextUrl;

  // ── /r shortcut → resume PDF ────────────────────────────
  if (pathname === '/r' || pathname === '/resume') {
    return NextResponse.redirect(new URL('/resume.pdf', request.url));
  }

  // ── Admin Authentication ──────────────────────────────────
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session   = request.cookies.get('admin_session')?.value;
    const adminPass = process.env.ADMIN_PASSWORD;

    // If password is set in env and user doesn't have the cookie, redirect
    if (adminPass && session !== adminPass) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // ── Security headers on all responses ───────────────────
  const response = NextResponse.next();

  response.headers.set('X-Content-Type-Options',    'nosniff');
  response.headers.set('X-Frame-Options',            'DENY');
  response.headers.set('X-XSS-Protection',           '1; mode=block');
  response.headers.set('Referrer-Policy',             'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  return response;
}

export const config = {
  // Run on all routes except static files and Next.js internals
  matcher: ['/((?!_next/static|_next/image|favicon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf|ico)$).*)'],
};
