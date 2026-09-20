import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Customer } from '@prisma/client';
import type { CustomerPublic } from '@/types';

export const CUSTOMER_COOKIE = 'amrat_customer_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export type { CustomerPublic };

function secretKey() {
  const secret =
    process.env.CUSTOMER_SESSION_SECRET || 'dev-only-amrat-narsih-customer-secret-change-me';
  return new TextEncoder().encode(secret);
}

export function toPublicCustomer(customer: Customer): CustomerPublic {
  return {
    id: customer.id,
    phone: customer.phone,
    name: customer.name,
    email: customer.email,
  };
}

export async function signCustomerToken(customerId: string, phone: string) {
  return new SignJWT({ phone })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(customerId)
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secretKey());
}

export async function verifyCustomerToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const sub = typeof payload.sub === 'string' ? payload.sub : null;
    const phone = typeof payload.phone === 'string' ? payload.phone : null;
    if (!sub || !phone) return null;
    return { customerId: sub, phone };
  } catch {
    return null;
  }
}

export async function getCustomerSession(): Promise<Customer | null> {
  const jar = await cookies();
  const claims = await verifyCustomerToken(jar.get(CUSTOMER_COOKIE)?.value);
  if (!claims) return null;
  return prisma.customer.findUnique({ where: { id: claims.customerId } });
}

export function applyCustomerCookie(response: NextResponse, token: string) {
  response.cookies.set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
  return response;
}

export function clearCustomerCookie(response: NextResponse) {
  response.cookies.set(CUSTOMER_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return response;
}

export async function requireCustomerApi(): Promise<
  | { customer: Customer; error: null }
  | { customer: null; error: NextResponse }
> {
  const customer = await getCustomerSession();
  if (!customer) {
    return {
      customer: null,
      error: NextResponse.json({ error: 'Please sign in with your mobile number.' }, { status: 401 }),
    };
  }
  return { customer, error: null };
}
