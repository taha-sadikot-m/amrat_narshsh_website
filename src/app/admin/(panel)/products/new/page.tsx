'use client';

import { ProductEditor } from '../../../../../components/admin/ProductEditor';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display font-black text-3xl">New product</h1>
      <ProductEditor />
    </div>
  );
}
