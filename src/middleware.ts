import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { ADMIN_COOKIE } from '@/lib/admin-auth';

const CUSTOMER_COOKIE = 'amrat_customer_session';

function adminSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || 'dev-only-amrat-narsih-admin-secret-change-me';
  return new TextEncoder().encode(secret);
}

function customerSecret() {
  const secret =
    process.env.CUSTOMER_SESSION_SECRET || 'dev-only-amrat-narsih-customer-secret-change-me';
  return new TextEncoder().encode(secret);
}

async function hasValidToken(token: string | undefined, secret: Uint8Array) {
  if (!token) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === '/admin/login';
  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');
  const isAccount = pathname === '/account' || pathname.startsWith('/account/');

  if (isAccount) {
    const valid = await hasValidToken(request.cookies.get(CUSTOMER_COOKIE)?.value, customerSecret());
    if (valid) return NextResponse.next();
    const login = new URL('/login', request.url);
    login.searchParams.set('from', pathname);
    login.searchParams.set('next', pathname);
    return NextResponse.redirect(login);
  }

  if (!isAdminPage && !isAdminApi) return NextResponse.next();
  if (isLogin || pathname === '/api/admin/login') return NextResponse.next();

  const valid = await hasValidToken(request.cookies.get(ADMIN_COOKIE)?.value, adminSecret());
  if (valid) return NextResponse.next();

  if (isAdminApi) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const login = new URL('/admin/login', request.url);
  login.searchParams.set('from', pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/account', '/account/:path*'],
};
