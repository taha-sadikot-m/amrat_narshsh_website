'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type OrderDetail = {
  id: string;
  createdAt: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  trackingNumber: string;
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  couponCode: string | null;
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
  customerId: string | null;
  items: { name: string; quantity: number; weight: string; price: number }[];
};

const STATUSES = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [status, setStatus] = useState('');
  const [tracking, setTracking] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!params.id) return;
    void fetch(`/api/admin/orders/${encodeURIComponent(params.id)}`)
      .then((r) => r.json())
      .then((d) => {
        setOrder(d.order);
        setStatus(d.order?.status ?? '');
        setTracking(d.order?.trackingNumber ?? '');
      });
  }, [params.id]);

  const save = async () => {
    if (!order) return;
    const res = await fetch('/api/admin/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: order.id, status, trackingNumber: tracking }),
    });
    setMessage(res.ok ? 'Saved.' : 'Could not update order.');
  };

  if (!order) return <p className="text-sm text-gray-500">Loading order…</p>;

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/admin/orders" className="text-xs font-bold text-[#C90018]">← All orders</Link>
      <h1 className="font-display font-black text-3xl">{order.id}</h1>
      <div className="bg-white rounded-3xl border border-[#EADFCB] p-5 space-y-2 text-sm">
        <p><strong>{order.fullName}</strong> · {order.phone} · {order.email}</p>
        <p>{order.addressLine1}{order.addressLine2 ? `, ${order.addressLine2}` : ''}</p>
        <p>{order.city}, {order.state} {order.pincode}</p>
        <p className="text-xs text-gray-500">{order.paymentMethod} · {order.paymentStatus} · coupon {order.couponCode || 'none'}</p>
        {order.customerId ? (
          <Link href={`/admin/customers/${order.customerId}`} className="text-xs font-bold underline">View customer</Link>
        ) : null}
      </div>
      <ul className="bg-white rounded-3xl border border-[#EADFCB] p-5 space-y-2 text-sm">
        {order.items.map((item) => (
          <li key={`${item.name}-${item.weight}`} className="flex justify-between">
            <span>{item.quantity}× {item.name} ({item.weight})</span>
            <span>₹{item.price * item.quantity}</span>
          </li>
        ))}
        <li className="flex justify-between font-bold pt-2 border-t border-[#EADFCB]">
          <span>Total</span>
          <span>₹{order.total}</span>
        </li>
      </ul>
      <div className="bg-white rounded-3xl border border-[#EADFCB] p-5 space-y-3">
        <label className="text-xs font-bold block">Status
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full rounded-xl border border-[#EADFCB] px-3 py-2">
            {!STATUSES.includes(status) ? <option value={status}>{status}</option> : null}
            {STATUSES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold block">Tracking number
          <input value={tracking} onChange={(e) => setTracking(e.target.value)} className="mt-1 w-full rounded-xl border border-[#EADFCB] px-3 py-2" />
        </label>
        <button type="button" onClick={() => void save()} className="btn-vibrant-cta px-5 py-2 rounded-full text-xs font-black uppercase">Save fulfillment</button>
        {message ? <p className="text-xs">{message}</p> : null}
      </div>
    </div>
  );
}
