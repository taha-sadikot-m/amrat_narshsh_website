import { NextResponse } from 'next/server';
import { getRecipes } from '@/lib/recipes';

export async function GET() {
  const recipes = await getRecipes({ publishedOnly: true });
  return NextResponse.json({ recipes });
}
