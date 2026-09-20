'use client';

import { useRouter } from 'next/navigation';
import { PhoneOtpForm } from '@/components/auth/PhoneOtpForm';

export function LoginClient({ next }: { next: string }) {
  const router = useRouter();
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-[#EADFCB] bg-white p-8 shadow-xl">
        <p className="text-xs font-extrabold uppercase tracking-wider text-[#C90018]">Amrat Narsih</p>
        <h1 className="mt-2 font-display text-3xl font-black text-gray-900">Sign in with mobile</h1>
        <p className="mt-2 text-sm text-gray-600">
          We will send a one-time password. First-time OTP creates your account.
        </p>
        <div className="mt-6">
          <PhoneOtpForm onVerified={() => router.push(next)} />
        </div>
      </div>
    </main>
  );
}
