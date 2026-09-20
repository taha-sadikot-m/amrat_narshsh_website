'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type OrderRow = {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  items: { name: string; quantity: number }[];
};

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const response = await fetch('/api/me/orders', { credentials: 'include' });
      const data = await response.json();
      setOrders(data.orders ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="text-sm text-gray-500">Loading orders…</p>;
  if (orders.length === 0) {
    return <p className="text-sm text-gray-600">No orders yet. Mixes you buy will appear here.</p>;
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.id} className="rounded-2xl border border-[#EADFCB] bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-bold text-gray-900">{order.id}</p>
              <p className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString('en-IN')} · {order.status}
              </p>
              <p className="mt-1 text-xs text-gray-600">
                {order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}
              </p>
            </div>
            <div className="text-right">
              <p className="font-black text-[#C90018]">₹{order.total}</p>
              <Link href={`/track-order/${order.id}`} className="text-xs font-bold text-[#3E2723] underline">
                Track
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
