import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const ADMIN_COOKIE = 'amrat_admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function secretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET || 'dev-only-amrat-narsih-admin-secret-change-me';
  return new TextEncoder().encode(secret);
}

export function getAdminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || 'admin@amratnarsih.com').trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || 'amratnarsih-admin',
  };
}

export async function signAdminToken(email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey());
}

export async function verifyAdminToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return typeof payload.email === 'string' ? payload.email : null;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const jar = await cookies();
  return verifyAdminToken(jar.get(ADMIN_COOKIE)?.value);
}

export function applySessionCookie(response: NextResponse, token: string) {
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
  return response;
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return response;
}

export async function requireAdminApi() {
  const email = await getAdminSession();
  if (!email) {
    return { email: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { email, error: null };
}
