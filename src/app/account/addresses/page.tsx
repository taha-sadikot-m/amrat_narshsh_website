'use client';

import { useEffect, useState } from 'react';

type Address = {
  id: string;
  label: string;
  fullName: string;
  email: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

const emptyForm = {
  label: 'Home',
  fullName: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: 'Gujarat',
  pincode: '',
  isDefault: true,
};

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');

  async function load() {
    const response = await fetch('/api/me/addresses', { credentials: 'include' });
    const data = await response.json();
    setAddresses(data.addresses ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/me/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setMessage(response.ok ? 'Address saved.' : data.error || 'Could not save.');
    if (response.ok) {
      setForm(emptyForm);
      await load();
    }
  }

  async function remove(id: string) {
    await fetch(`/api/me/addresses/${id}`, { method: 'DELETE', credentials: 'include' });
    await load();
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-3">
        {addresses.length === 0 ? <p className="text-sm text-gray-600">No saved addresses yet.</p> : null}
        {addresses.map((address) => (
          <div key={address.id} className="rounded-2xl border border-[#EADFCB] bg-white p-4 text-sm">
            <p className="font-bold">
              {address.label} {address.isDefault ? '· Default' : ''}
            </p>
            <p>{address.fullName}</p>
            <p className="text-gray-600">
              {address.addressLine1}
              {address.addressLine2 ? `, ${address.addressLine2}` : ''}, {address.city}, {address.state}{' '}
              {address.pincode}
            </p>
            <button type="button" onClick={() => void remove(address.id)} className="mt-2 text-xs font-bold text-red-600">
              Delete
            </button>
          </div>
        ))}
      </div>
      <form onSubmit={(event) => void create(event)} className="space-y-3 rounded-3xl border border-[#EADFCB] bg-white p-6">
        <h2 className="font-display text-lg font-bold">Add address</h2>
        <input
          placeholder="Label (Home / Work)"
          value={form.label}
          onChange={(event) => setForm({ ...form, label: event.target.value })}
          className="w-full rounded-xl border border-[#EADFCB] bg-[#FCFAF5] px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Full name"
          value={form.fullName}
          onChange={(event) => setForm({ ...form, fullName: event.target.value })}
          className="w-full rounded-xl border border-[#EADFCB] bg-[#FCFAF5] px-3 py-2 text-sm"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          className="w-full rounded-xl border border-[#EADFCB] bg-[#FCFAF5] px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Address line"
          value={form.addressLine1}
          onChange={(event) => setForm({ ...form, addressLine1: event.target.value })}
          className="w-full rounded-xl border border-[#EADFCB] bg-[#FCFAF5] px-3 py-2 text-sm"
        />
        <input
          placeholder="Landmark (optional)"
          value={form.addressLine2}
          onChange={(event) => setForm({ ...form, addressLine2: event.target.value })}
          className="w-full rounded-xl border border-[#EADFCB] bg-[#FCFAF5] px-3 py-2 text-sm"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            required
            placeholder="City"
            value={form.city}
            onChange={(event) => setForm({ ...form, city: event.target.value })}
            className="rounded-xl border border-[#EADFCB] bg-[#FCFAF5] px-3 py-2 text-sm"
          />
          <input
            required
            placeholder="Pincode"
            value={form.pincode}
            onChange={(event) => setForm({ ...form, pincode: event.target.value })}
            className="rounded-xl border border-[#EADFCB] bg-[#FCFAF5] px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(event) => setForm({ ...form, isDefault: event.target.checked })}
          />
          Default address
        </label>
        <button type="submit" className="w-full rounded-2xl bg-[#C90018] py-3 text-xs font-bold text-white">
          Save address
        </button>
        {message ? <p className="text-xs text-gray-600">{message}</p> : null}
      </form>
    </div>
  );
}
