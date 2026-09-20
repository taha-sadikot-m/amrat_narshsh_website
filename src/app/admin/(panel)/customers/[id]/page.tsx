'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AdminCustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    if (!params.id) return;
    void fetch(`/api/admin/customers/${params.id}`)
      .then((r) => r.json())
      .then((d) => setCustomer(d.customer));
  }, [params.id]);

  if (!customer) return <p className="text-sm text-gray-500">Loading customer…</p>;

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/admin/customers" className="text-xs font-bold text-[#C90018]">← All customers</Link>
      <h1 className="font-display font-black text-3xl">{customer.name || 'Customer'}</h1>
      <p className="text-sm">{customer.phone} · {customer.email || 'No email'}</p>
      <div className="bg-white rounded-3xl border border-[#EADFCB] p-5 space-y-3">
        <h2 className="font-display font-bold">Addresses</h2>
        {(customer.addresses ?? []).map((address: any) => (
          <p key={address.id} className="text-sm text-gray-700">
            {address.label}: {address.fullName}, {address.addressLine1}, {address.city} {address.pincode}
          </p>
        ))}
        {!customer.addresses?.length && <p className="text-sm text-gray-500">No saved addresses.</p>}
      </div>
      <div className="bg-white rounded-3xl border border-[#EADFCB] p-5 space-y-2">
        <h2 className="font-display font-bold">Orders</h2>
        {(customer.orders ?? []).map((order: any) => (
          <Link key={order.id} href={`/admin/orders/${order.id}`} className="block text-sm font-bold hover:text-[#C90018]">
            {order.id} · ₹{order.total} · {order.status}
          </Link>
        ))}
        {!customer.orders?.length && <p className="text-sm text-gray-500">No orders.</p>}
      </div>
    </div>
  );
}
