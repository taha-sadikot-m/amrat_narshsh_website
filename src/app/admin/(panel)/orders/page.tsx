'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type OrderRow = {
  id: string;
  createdAt: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
  fullName: string;
  email: string;
  phone: string;
  items: { name: string; quantity: number; weight: string }[];
};

const STATUSES = [
  'all',
  'Awaiting Payment',
  'Awaiting WhatsApp Confirmation',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    void fetch('/api/admin/orders')
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []));
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (status !== 'all' && order.status !== status) return false;
      if (!q) return true;
      return [order.id, order.fullName, order.email, order.phone].some((value) =>
        String(value ?? '').toLowerCase().includes(q),
      );
    });
  }, [orders, query, status]);

  return (
    <div className="space-y-6">
      <h1 className="font-display font-black text-3xl">Orders</h1>
      <div className="flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search id, name, phone"
          className="px-3 py-2 rounded-xl border border-[#EADFCB] text-sm min-w-[220px]"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 rounded-xl border border-[#EADFCB] text-sm">
          {STATUSES.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>
      <div className="space-y-4">
        {shown.map((order) => (
          <Link key={order.id} href={`/admin/orders/${order.id}`} className="block bg-white rounded-3xl border border-[#EADFCB] p-5 hover:border-[#C90018]">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <div className="font-display font-bold">{order.id}</div>
                <div className="text-xs text-gray-500">{order.fullName} · {order.phone} · {order.email}</div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-wide text-[#8B3D2E]">
                  {order.status} · {order.paymentMethod} · {order.paymentStatus}
                </div>
              </div>
              <div className="font-black text-[#C90018]">₹{order.total}</div>
            </div>
            <p className="text-xs text-gray-600 mt-2">{order.items.map((i) => `${i.quantity}× ${i.name} (${i.weight})`).join(', ')}</p>
          </Link>
        ))}
        {!shown.length && <p className="text-sm text-gray-500">No orders match.</p>}
      </div>
    </div>
  );
}
