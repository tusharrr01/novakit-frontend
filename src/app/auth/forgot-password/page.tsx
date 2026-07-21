'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { AuthShell } from '@/src/components/layout/AuthShell';
import { useAuthPage } from '@/src/lib/auth-content';

export default function ForgotPasswordPage() {
  const cfg = useAuthPage('forgotPassword');
  const emailField = cfg.fields.find((f) => f.key === 'email');

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Mimic API reset link dispatch
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  }

  return (
    <AuthShell
      eyebrow={cfg.eyebrow}
      title={sent ? 'Check your inbox' : cfg.title}
      subtitle={
        sent
          ? `We've sent a password reset link to ${email}.`
          : cfg.subtitle
      }
      footer={
        <Link href="/auth/login" className="inline-flex items-center gap-1 text-brand hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> {cfg.footerLinkLabel}
        </Link>
      }
    >
      {sent ? (
        <div className="text-center py-4">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
            <Mail className="h-6 w-6 text-emerald-500" />
          </div>
          <p className="text-sm text-muted-foreground">
            Click the link in the email to set a new password. The link will expire in 15 minutes.
          </p>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          {emailField && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{emailField.label}</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder={emailField.placeholder}
                  required
                  className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-3 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient text-sm font-medium text-white shadow-lg shadow-brand/25 transition hover:opacity-95 disabled:opacity-70"
          >
            {loading ? 'Sending…' : cfg.submitLabel} <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-center text-xs text-muted-foreground">
            The link will expire in 15 minutes for your security.
          </p>
        </form>
      )}
    </AuthShell>
  );
}
