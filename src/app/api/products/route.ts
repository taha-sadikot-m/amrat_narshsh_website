import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/catalog';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const products = await getProducts({
    category: searchParams.get('category'),
    mood: searchParams.get('mood'),
    dietary: searchParams.get('dietary'),
    q: searchParams.get('q'),
  });
  return NextResponse.json({ products });
}
