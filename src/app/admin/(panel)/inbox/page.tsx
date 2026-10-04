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

type Fork = {
  id: string;
  title: string;
  status: string;
  steps: { instruction?: string }[];
  extras: string[];
  customer: { name: string | null; phone: string };
  recipe: { title: string; slug: string };
};

export default function AdminInboxPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [forks, setForks] = useState<Fork[]>([]);

  const load = () => {
    fetch('/api/admin/inbox').then((r) => r.json()).then((d) => setMessages(d.messages || []));
    fetch('/api/admin/forks').then((r) => r.json()).then((d) => setForks(d.forks || []));
  };
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
      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold">Recipe forks waiting</h2>
        {forks.map((fork) => (
          <article key={fork.id} className="rounded-3xl border border-[#C90018] bg-white p-5">
            <p className="font-bold">{fork.title}</p>
            <p className="text-xs text-gray-500">{fork.recipe.title} · {fork.customer.name || fork.customer.phone}</p>
            <ul className="mt-2 list-disc pl-5 text-sm">
              {(fork.steps || []).map((step) => (
                <li key={step.instruction}>{step.instruction}</li>
              ))}
            </ul>
            {fork.extras?.length ? <p className="mt-2 text-xs">Extras: {fork.extras.join(', ')}</p> : null}
            <div className="mt-3 flex gap-3 text-xs font-bold">
              <button
                type="button"
                onClick={async () => {
                  await fetch('/api/admin/forks', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: fork.id, status: 'approved' }),
                  });
                  load();
                }}
              >
                Approve
              </button>
              <button
                type="button"
                onClick={async () => {
                  await fetch('/api/admin/forks', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: fork.id, status: 'rejected' }),
                  });
                  load();
                }}
              >
                Reject
              </button>
            </div>
          </article>
        ))}
        {!forks.length && <p className="text-sm text-gray-500">No forks waiting.</p>}
      </section>
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
