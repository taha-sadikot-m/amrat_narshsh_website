'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type CustomerRow = {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  createdAt: string;
  orderCount: number;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    void fetch('/api/admin/customers')
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers || []));
  }, []);

  const shown = customers.filter((customer) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [customer.phone, customer.name, customer.email, customer.id].some((value) =>
      String(value ?? '').toLowerCase().includes(q),
    );
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display font-black text-3xl">Customers</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search phone or name"
        className="px-3 py-2 rounded-xl border border-[#EADFCB] text-sm w-full max-w-md"
      />
      <ul className="space-y-2">
        {shown.map((customer) => (
          <li key={customer.id}>
            <Link href={`/admin/customers/${customer.id}`} className="block bg-white rounded-2xl border border-[#EADFCB] p-4 hover:border-[#C90018]">
              <div className="font-bold">{customer.name || 'Unnamed'} · {customer.phone}</div>
              <div className="text-xs text-gray-500">{customer.email || 'No email'} · {customer.orderCount} orders</div>
            </Link>
          </li>
        ))}
        {!shown.length && <p className="text-sm text-gray-500">No customers yet.</p>}
      </ul>
    </div>
  );
}
