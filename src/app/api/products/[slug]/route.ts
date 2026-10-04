import { NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/catalog';
import { getCustomerSession } from '@/lib/customer-auth';
import { isLockedReward, purchasedProductIds } from '@/lib/storefront-catalog';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  const customer = await getCustomerSession();
  const purchased = await purchasedProductIds(customer?.id ?? null);
  if (isLockedReward(product.id, purchased)) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json({ product });
}
