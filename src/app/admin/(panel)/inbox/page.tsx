'use client';

import { useEffect, useState } from 'react';

type Msg = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  readAt: string | null;
};

export default function AdminInboxPage() {
  const [messages, setMessages] = useState<Msg[]>([]);

  const load = () => fetch('/api/admin/inbox').then((r) => r.json()).then((d) => setMessages(d.messages || []));
  useEffect(() => {
    void load();
  }, []);

  const mark = async (id: string, read: boolean) => {
    await fetch('/api/admin/inbox', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },      body: JSON.stringify({ id, read }),
    });
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/admin/inbox?id=${id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display font-black text-3xl">Inbox</h1>
      <div className="space-y-3">
        {messages.map((m) => (
          <article key={m.id} className={`bg-white rounded-3xl border p-5 ${m.readAt ? 'border-[#EADFCB]' : 'border-[#C90018]'}`}>
            <div className="flex justify-between gap-2">
              <div>
                <div className="font-bold">{m.name} · {m.subject}</div>
                <div className="text-xs text-gray-500">{m.email} {m.phone ? `· ${m.phone}` : ''}</div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => mark(m.id, !m.readAt)} className="text-xs font-bold">{m.readAt ? 'Unread' : 'Read'}</button>
                <button type="button" onClick={() => remove(m.id)} className="text-xs font-bold text-[#C90018]">Delete</button>
              </div>
            </div>
            <p className="text-sm mt-3 whitespace-pre-wrap">{m.message}</p>
          </article>
        ))}
        {!messages.length && <p className="text-sm text-gray-500">No messages yet.</p>}
      </div>
    </div>
  );
}
