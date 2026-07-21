import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'supersecret_nextauth_987654321' });
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!token;

  // If visiting auth pages but already authenticated, redirect to admin
  const isAuthPage = pathname.startsWith('/auth');
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // Define protected pages that require authentication
  const isProtectedRoute = pathname.startsWith('/admin') || pathname.startsWith('/profile') || pathname.startsWith('/orders');

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', req.url);
    // Optionally redirect back after login
    loginUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, icons, etc. with extensions)
     */
    '/((?!api/|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|otf|css|js)).*)',
  ],
};
