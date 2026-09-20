'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { indianPhoneDigits } from '@/lib/phone';

export default function AccountProfilePage() {
  const { customer, refresh, logout } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setName(customer?.name ?? '');
    setEmail(customer?.email ?? '');
  }, [customer]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch('/api/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email }),
    });
    const data = await response.json();
    setMessage(response.ok ? 'Saved.' : data.error || 'Could not save.');
    if (response.ok) await refresh();
  }

  return (
    <div className="max-w-lg space-y-6 rounded-3xl border border-[#EADFCB] bg-white p-6">
      <p className="text-sm text-gray-600">
        Mobile (cannot change):{' '}
        <strong>+91 {indianPhoneDigits(customer?.phone ?? '') ?? customer?.phone}</strong>
      </p>
      <form onSubmit={(event) => void save(event)} className="space-y-3">
        <label className="block text-[11px] font-bold">Full name</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-xl border border-[#EADFCB] bg-[#FCFAF5] px-3 py-2.5 text-sm"
        />
        <label className="block text-[11px] font-bold">Email (optional)</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-[#EADFCB] bg-[#FCFAF5] px-3 py-2.5 text-sm"
        />
        <button type="submit" className="rounded-2xl bg-[#C90018] px-5 py-3 text-xs font-bold text-white">
          Save profile
        </button>
        {message ? <p className="text-xs text-gray-600">{message}</p> : null}
      </form>
      <button
        type="button"
        onClick={() => void logout().then(() => { window.location.href = '/'; })}
        className="text-xs font-bold text-[#C90018]"
      >
        Sign out
      </button>
    </div>
  );
}
