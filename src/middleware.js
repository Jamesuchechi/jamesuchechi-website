import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname, hostname } = request.nextUrl;

  // ── /r shortcut → resume PDF ────────────────────────────
  if (pathname === '/r' || pathname === '/resume') {
    return NextResponse.redirect(new URL('/resume.pdf', request.url));
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
