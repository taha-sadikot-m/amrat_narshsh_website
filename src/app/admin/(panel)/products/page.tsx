'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/types';

const LOW_STOCK = 20;

type StockFilter = 'all' | 'in' | 'low' | 'out';

function stockKind(product: Product): Exclude<StockFilter, 'all'> {
  if (!product.inStock || product.stockCount <= 0) return 'out';
  if (product.stockCount < LOW_STOCK) return 'low';
  return 'in';
}

function stockLabel(product: Product) {
  const kind = stockKind(product);
  if (kind === 'out') return { text: 'Out of stock', className: 'bg-[#C90018]/10 text-[#C90018]' };
  if (kind === 'low') return { text: `${product.stockCount} left`, className: 'bg-[#F4C400]/20 text-[#6F3E24]' };
  return { text: `${product.stockCount} in stock`, className: 'bg-emerald-50 text-emerald-800' };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [stock, setStock] = useState<StockFilter>('all');
  const [featured, setFeatured] = useState(false);
  const [bestseller, setBestseller] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const load = () => fetch('/api/admin/products').then((r) => r.json()).then((d) => setProducts(d.products || []));
  useEffect(() => {
    void load();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.categoryName).filter(Boolean))).sort();
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      if (q) {
        const haystack = `${product.name} ${product.gujaratiName} ${product.slug}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (category !== 'all' && product.categoryName !== category) return false;
      if (stock !== 'all' && stockKind(product) !== stock) return false;
      if (featured && !product.isFeatured) return false;
      if (bestseller && !product.isBestseller) return false;
      if (isNew && !product.isNew) return false;
      return true;
    });
  }, [products, query, category, stock, featured, bestseller, isNew]);

  const remove = async (id: string) => {
    if (!confirm('Delete this product from the storefront?')) return;
    await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
    await load();
  };

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-wider ${
      active ? 'border-[#C90018] bg-[#C90018] text-white' : 'border-[#EADFCB] bg-white text-gray-600'
    }`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="font-display font-black text-3xl">Products</h1>
          <p className="text-sm text-gray-600 mt-1">Catalog, pricing, and inventory.</p>
        </div>
        <Link href="/admin/products/new" className="btn-vibrant-cta px-5 py-2.5 rounded-full text-xs font-black uppercase text-center">
          New product
        </Link>
      </div>

      <div className="sticky top-0 z-10 space-y-3 rounded-3xl border border-[#EADFCB] bg-white/95 p-4 backdrop-blur-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400">
            Search
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, Gujarati name, or slug"
              className="mt-1 w-full rounded-xl border border-[#EADFCB] px-3 py-2 text-sm font-medium text-[#191919] normal-case tracking-normal"
            />
          </label>
          <label className="text-xs font-black uppercase tracking-widest text-gray-400">
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#EADFCB] px-3 py-2 text-sm font-medium text-[#191919] normal-case tracking-normal"
            >
              <option value="all">All categories</option>
              {categories.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-black uppercase tracking-widest text-gray-400">
            Stock
            <select
              value={stock}
              onChange={(e) => setStock(e.target.value as StockFilter)}
              className="mt-1 w-full rounded-xl border border-[#EADFCB] px-3 py-2 text-sm font-medium text-[#191919] normal-case tracking-normal"
            >
              <option value="all">All stock</option>
              <option value="in">In stock</option>
              <option value="low">Low (under 20)</option>
              <option value="out">Out of stock</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setFeatured((v) => !v)} className={chip(featured)}>
            Featured
          </button>
          <button type="button" onClick={() => setBestseller((v) => !v)} className={chip(bestseller)}>
            Bestseller
          </button>
          <button type="button" onClick={() => setIsNew((v) => !v)} className={chip(isNew)}>
            New
          </button>
          <span className="ml-auto text-xs font-semibold text-gray-500">
            {filtered.length} of {products.length}
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-3xl border border-[#EADFCB] bg-white px-5 py-10 text-center text-sm text-gray-500">
          No products match these filters.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => {
            const badge = stockLabel(product);
            return (
              <article key={product.id} className="flex flex-col overflow-hidden rounded-3xl border border-[#EADFCB] bg-white">
                <Link href={`/admin/products/${product.id}`} className="block aspect-square bg-[#FCFAF5] p-4">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs font-semibold text-gray-400">
                      No image
                    </div>
                  )}
                </Link>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link href={`/admin/products/${product.id}`} className="font-display font-black text-lg leading-tight hover:text-[#C90018]">
                        {product.name}
                      </Link>
                      {product.gujaratiName && (
                        <p className="mt-0.5 text-sm text-gray-500">{product.gujaratiName}</p>
                      )}
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black uppercase ${badge.className}`}>
                      {badge.text}
                    </span>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{product.categoryName}</p>
                  <p className="font-display font-black text-[#C90018]">₹{product.defaultPrice}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                    {product.isFeatured && <span className="rounded-full bg-[#191919] px-2 py-0.5 text-[10px] font-black uppercase text-white">Featured</span>}
                    {product.isBestseller && <span className="rounded-full bg-[#C90018] px-2 py-0.5 text-[10px] font-black uppercase text-white">Bestseller</span>}
                    {product.isNew && <span className="rounded-full bg-[#F4C400] px-2 py-0.5 text-[10px] font-black uppercase text-[#191919]">New</span>}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Link href={`/admin/products/${product.id}`} className="text-xs font-black uppercase tracking-wider text-[#C90018]">
                      Edit
                    </Link>
                    <button type="button" onClick={() => remove(product.id)} className="text-xs font-black uppercase tracking-wider text-gray-400 hover:text-[#C90018]">
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
