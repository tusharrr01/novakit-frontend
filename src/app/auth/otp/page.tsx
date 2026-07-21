'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { AuthShell } from '@/src/components/site/auth-shell';
import { useAuthPage } from '@/src/lib/auth-content';

const LEN = 6;

export default function OtpPage() {
  const cfg = useAuthPage('otp');
  const [code, setCode] = useState<string[]>(Array(LEN).fill(''));
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const set = (i: number, v: string) => {
    const c = v.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[i] = c;
    setCode(next);
    if (c && i < LEN - 1) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const txt = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LEN);
    if (!txt) return;
    e.preventDefault();
    const next = Array(LEN).fill('');
    txt.split('').forEach((c, i) => (next[i] = c));
    setCode(next);
    refs.current[Math.min(txt.length, LEN - 1)]?.focus();
  };

  return (
    <AuthShell
      eyebrow={cfg.eyebrow}
      title={cfg.title}
      subtitle={cfg.subtitle}
      footer={
        <>
          {cfg.footerText}{' '}
          <Link href="/auth/register" className="font-medium text-brand hover:underline">
            {cfg.footerLinkLabel}
          </Link>
        </>
      }
    >
      <div className="mb-6 flex items-center gap-2 rounded-xl border border-border bg-card p-3 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-brand" />
        For your security, this code expires in 10 minutes.
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="flex justify-between gap-2" onPaste={onPaste}>
          {code.map((c, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={c}
              onChange={(e) => set(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              inputMode="numeric"
              maxLength={1}
              className="h-14 w-full rounded-xl border border-border bg-card text-center font-display text-xl font-semibold outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
            />
          ))}
        </div>

        <Link
          href="/admin"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient text-sm font-medium text-white shadow-lg shadow-brand/25 transition hover:opacity-95"
        >
          {cfg.submitLabel} <ArrowRight className="h-4 w-4" />
        </Link>

        <p className="text-center text-xs text-muted-foreground">
          Didn't get a code?{' '}
          <button type="button" className="font-medium text-brand hover:underline">
            Resend in 30s
          </button>
        </p>
      </form>
    </AuthShell>
  );
}
