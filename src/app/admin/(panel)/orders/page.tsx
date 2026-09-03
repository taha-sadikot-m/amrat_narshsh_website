'use client';

import { useEffect, useState } from 'react';

type Order = {
  id: string;
  createdAt: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
  fullName: string;
  email: string;
  items: { name: string; quantity: number; weight: string }[];
};

const STATUSES = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const load = () => fetch('/api/admin/orders').then((r) => r.json()).then((d) => setOrders(d.orders || []));
  useEffect(() => {
    void load();
  }, []);

  const setStatus = async (id: string, status: string) => {
    await fetch('/api/admin/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    await load();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display font-black text-3xl">Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-3xl border border-[#EADFCB] p-5 space-y-2">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <div className="font-display font-bold">{order.id}</div>
                <div className="text-xs text-gray-500">{order.fullName} · {order.email}</div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-wide text-[#8B3D2E]">
                  {order.paymentMethod} · {order.paymentStatus}
                </div>
              </div>
              <div className="font-black text-[#C90018]">₹{order.total}</div>
            </div>
            <p className="text-xs text-gray-600">{order.items.map((i) => `${i.quantity}× ${i.name} (${i.weight})`).join(', ')}</p>
            <select value={order.status} onChange={(e) => setStatus(order.id, e.target.value)} className="text-xs border border-[#EADFCB] rounded-xl px-3 py-2">
              {!STATUSES.includes(order.status) && (
                <option value={order.status} disabled>{order.status}</option>
              )}
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        ))}
        {!orders.length && <p className="text-sm text-gray-500">No orders yet.</p>}
      </div>
    </div>
  );
}
