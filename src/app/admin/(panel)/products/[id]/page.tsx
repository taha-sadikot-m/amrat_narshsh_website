'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductEditor } from '../../../../../components/admin/ProductEditor';
import type { Product } from '@/types';

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch('/api/admin/products')
      .then((r) => r.json())
      .then((d) => setProduct((d.products || []).find((p: Product) => p.id === params.id) || null));
  }, [params.id]);

  if (!product) return <p className="text-sm">Loading…</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-display font-black text-3xl">Edit {product.name}</h1>
      <ProductEditor initial={product} />
    </div>
  );
}
