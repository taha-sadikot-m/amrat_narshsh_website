'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Stats = {
  productCount: number;
  openOrders: number;
  unreadMessages: number;
  orderCount: number;
  lowStock: { name: string; stockCount: number; inStock: boolean }[];
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const cards = [
    { label: 'Products', value: stats?.productCount ?? '—', href: '/admin/products' },
    { label: 'Open orders', value: stats?.openOrders ?? '—', href: '/admin/orders' },
    { label: 'All orders', value: stats?.orderCount ?? '—', href: '/admin/orders' },
    { label: 'Unread messages', value: stats?.unreadMessages ?? '—', href: '/admin/inbox' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-black text-3xl">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">A snapshot of the Amrat Narsih storefront.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="bg-white rounded-3xl border border-[#EADFCB] p-5 hover:border-[#C90018] transition-colors">
            <div className="text-[11px] font-black uppercase tracking-widest text-gray-400">{card.label}</div>
            <div className="font-display font-black text-3xl mt-2 text-[#C90018]">{card.value}</div>
          </Link>
        ))}
      </div>
      <div className="bg-white rounded-3xl border border-[#EADFCB] p-6">
        <h2 className="font-display font-bold text-lg mb-4">Low stock</h2>
        {!stats?.lowStock?.length ? (
          <p className="text-sm text-gray-500">No low-stock alerts. Threshold is under 20 units or marked out of stock.</p>
        ) : (
          <ul className="space-y-2">
            {stats.lowStock.map((p) => (
              <li key={p.name} className="flex justify-between text-sm border-b border-[#EADFCB] pb-2">
                <span className="font-semibold">{p.name}</span>
                <span className="text-[#C90018] font-bold">{p.inStock ? `${p.stockCount} left` : 'Out of stock'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
