import { NextResponse } from 'next/server';
import { getHeroCarousel } from '@/lib/site-content';

export async function GET() {
  try {
    const hero = await getHeroCarousel();
    return NextResponse.json({ hero });
  } catch {
    return NextResponse.json({ error: 'Hero content is unavailable.' }, { status: 500 });
  }
}
