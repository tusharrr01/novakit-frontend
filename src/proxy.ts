import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'supersecret_nextauth_987654321' });
  const { pathname } = req.nextUrl;

  const isAuthenticated = !!token;
  const isAuthPage = pathname.startsWith('/auth');

  // Allowed guest/public routes
  const isGuestAllowed =
    isAuthPage ||
    pathname === '/' ||
    pathname.startsWith('/templates') ||
    pathname.startsWith('/designs') ||
    pathname.startsWith('/services');

  // 1. Redirect authenticated users away from /auth pages to their dashboard/home
  if (isAuthPage && isAuthenticated) {
    const role = token?.role?.toString().toLowerCase();
    const destination = role === 'admin' ? '/admin' : '/';
    return NextResponse.redirect(new URL(destination, req.url));
  }

  // 2. Redirect unauthenticated users attempting to access protected routes to login
  if (!isAuthenticated && !isGuestAllowed) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // 3. Centralized Admin role guard for /admin routes
  if (pathname.startsWith('/admin') && isAuthenticated) {
    const role = token?.role?.toString().toLowerCase();
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|otf|css|js)).*)',
  ],
};
