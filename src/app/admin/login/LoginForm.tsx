'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || 'Could not sign in.');
      return;
    }
    router.push(searchParams.get('from') || '/admin');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#FCFAF5] flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-3xl border border-[#EADFCB] shadow-sm p-8 space-y-5">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-[#C90018]">Amrat Narsih</div>
          <h1 className="font-display font-black text-2xl mt-1">Studio sign in</h1>
          <p className="text-xs text-gray-500 mt-1">Manage hero, offers, products, and orders.</p>
        </div>
        <label className="block text-xs font-bold">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full px-4 py-3 rounded-2xl border border-[#EADFCB] bg-[#FCFAF5] text-sm font-medium"
          />
        </label>
        <label className="block text-xs font-bold">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full px-4 py-3 rounded-2xl border border-[#EADFCB] bg-[#FCFAF5] text-sm font-medium"
          />
        </label>
        {error && <p className="text-xs font-semibold text-[#C90018]">{error}</p>}
        <button type="submit" disabled={loading} className="btn-vibrant-cta w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider disabled:opacity-60">
          {loading ? 'Signing in…' : 'Enter studio'}
        </button>
      </form>
    </div>
  );
}
