import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { ADMIN_COOKIE } from '@/lib/admin-auth';

function secretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET || 'dev-only-amrat-narsih-admin-secret-change-me';
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === '/admin/login';
  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');

  if (!isAdminPage && !isAdminApi) return NextResponse.next();
  if (isLogin || pathname === '/api/admin/login') return NextResponse.next();

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  let valid = false;
  if (token) {
    try {
      await jwtVerify(token, secretKey());
      valid = true;
    } catch {
      valid = false;
    }
  }

  if (valid) return NextResponse.next();

  if (isAdminApi) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const login = new URL('/admin/login', request.url);
  login.searchParams.set('from', pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
