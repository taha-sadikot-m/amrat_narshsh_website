import { NextResponse } from 'next/server';
import {
  applySessionCookie,
  getAdminCredentials,
  signAdminToken,
} from '@/lib/admin-auth';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? '')
    .trim()
    .toLowerCase();
  const password = String(body?.password ?? '');
  const expected = getAdminCredentials();

  if (email !== expected.email || password !== expected.password) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const token = await signAdminToken(email);
  const response = NextResponse.json({ ok: true });
  return applySessionCookie(response, token);
}
