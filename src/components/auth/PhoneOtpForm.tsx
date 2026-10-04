'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  RecaptchaVerifier,
  initializeRecaptchaConfig,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseClientConfigured } from '@/lib/firebase-client';
import { normalizeIndianE164 } from '@/lib/phone';
import { useAuth } from '@/context/AuthContext';

type PhoneOtpFormProps = {
  onVerified?: () => void;
  compact?: boolean;
};

function destroyVerifier(widget: RecaptchaVerifier | null) {
  if (!widget) return;
  try {
    widget.clear();
  } catch {
    // clear() throws once the instance is already destroyed
  }
}

export function PhoneOtpForm({ onVerified, compact }: PhoneOtpFormProps) {
  const { refresh } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [captchaEpoch, setCaptchaEpoch] = useState(0);
  const confirmation = useRef<ConfirmationResult | null>(null);
  const verifier = useRef<RecaptchaVerifier | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    if (!isFirebaseClientConfigured()) return;
    void initializeRecaptchaConfig(getFirebaseAuth()).catch(() => {
      // signInWithPhoneNumber loads this config again if the first call fails
    });
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (!isFirebaseClientConfigured()) {
      setError('Phone sign-in is not configured. Add Firebase keys to .env.');
      return;
    }

    let cancelled = false;
    let widget: RecaptchaVerifier | null = null;

    // Wait out React Strict Mode's setup/cleanup/setup so only one widget is created.
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      const currentHost = hostRef.current;
      if (!currentHost) return;
      destroyVerifier(verifier.current);
      verifier.current = null;
      currentHost.replaceChildren();

      const slot = document.createElement('div');
      currentHost.appendChild(slot);
      widget = new RecaptchaVerifier(getFirebaseAuth(), slot, { size: 'invisible' });
      verifier.current = widget;
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      destroyVerifier(widget);
      if (widget && verifier.current === widget) verifier.current = null;
      host.replaceChildren();
    };
  }, [captchaEpoch]);

  function resetCaptcha() {
    setCaptchaEpoch((value) => value + 1);
  }

  async function sendCode() {
    setError('');
    if (!isFirebaseClientConfigured()) {
      setError('Phone sign-in is not configured. Add Firebase keys to .env.');
      return;
    }
    const e164 = normalizeIndianE164(phone);
    if (!e164) {
      setError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    const recaptcha = verifier.current;
    if (!recaptcha) {
      setError('Captcha is still loading. Try again in a moment.');
      return;
    }
    setBusy(true);
    try {
      confirmation.current = await signInWithPhoneNumber(getFirebaseAuth(), e164, recaptcha);
      setStep('otp');
      setCooldown(30);
      resetCaptcha();
    } catch (caught) {
      resetCaptcha();
      setError(caught instanceof Error ? caught.message : 'Could not send OTP.');
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode() {
    setError('');
    if (!confirmation.current) {
      setError('Request a new OTP.');
      return;
    }
    setBusy(true);
    try {
      const result = await confirmation.current.confirm(otp.trim());
      const idToken = await result.user.getIdToken();
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idToken }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not create a session.');
      await refresh();
      onVerified?.();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Invalid OTP.');
    } finally {
      setBusy(false);
    }
  }

  const phoneReady = Boolean(normalizeIndianE164(phone));

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      {step === 'phone' ? (
        <>
          <label className="text-[11px] font-bold text-gray-700 block">Mobile number</label>
          <div className="flex gap-2">
            <span className="flex items-center rounded-xl border border-[#EADFCB] bg-[#FCFAF5] px-3 text-xs font-bold">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="98765 43210"
              className="w-full rounded-xl border border-[#EADFCB] bg-[#FCFAF5] px-3.5 py-2.5 text-xs font-medium"
            />
          </div>
          <button
            type="button"
            disabled={busy || !phoneReady}
            onClick={() => void sendCode()}
            className="w-full rounded-2xl bg-[#C90018] py-3 text-xs font-bold text-white disabled:opacity-50"
          >
            {busy ? 'Sending OTP…' : 'Send OTP'}
          </button>
        </>
      ) : (
        <>
          <p className="text-xs text-gray-600">Enter the 6-digit code sent to +91 {phone}</p>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full rounded-xl border border-[#EADFCB] bg-[#FCFAF5] px-3.5 py-2.5 text-center text-lg tracking-[0.4em] font-bold"
          />
          <button
            type="button"
            disabled={busy || otp.length !== 6}
            onClick={() => void verifyCode()}
            className="w-full rounded-2xl bg-[#C90018] py-3 text-xs font-bold text-white disabled:opacity-50"
          >
            {busy ? 'Verifying…' : 'Verify & continue'}
          </button>
          <button
            type="button"
            disabled={busy || cooldown > 0 || !phoneReady}
            onClick={() => void sendCode()}
            className="w-full text-xs font-bold text-[#C90018] disabled:text-gray-400"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
          </button>
          <button
            type="button"
            className="w-full text-[11px] text-gray-500"
            onClick={() => {
              setStep('phone');
              setOtp('');
              setError('');
              resetCaptcha();
            }}
          >
            Change number
          </button>
        </>
      )}
      <div ref={hostRef} />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
