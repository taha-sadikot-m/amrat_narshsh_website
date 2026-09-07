import { NextResponse } from 'next/server';
import { getPublicCombos } from '@/lib/catalog';

export async function GET() {
  const combos = await getPublicCombos(true);
  return NextResponse.json({ combos });
}
