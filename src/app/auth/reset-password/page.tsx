'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { AuthShell } from '@/src/components/layout/AuthShell';
import { useAuthPage } from '@/src/lib/auth-content';

export default function ResetPasswordPage() {
  const cfg = useAuthPage('resetPassword');
  const pwField = cfg.fields.find((f) => f.key === 'password');
  const confirmField = cfg.fields.find((f) => f.key === 'confirmPassword');

  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [show, setShow] = useState(false);

  const rules = [
    { label: '8+ characters', ok: pw.length >= 8 },
    { label: 'One number', ok: /\d/.test(pw) },
    { label: 'One uppercase', ok: /[A-Z]/.test(pw) },
    { label: 'Passwords match', ok: pw.length > 0 && pw === pw2 },
  ];

  return (
    <AuthShell
      eyebrow={cfg.eyebrow}
      title={cfg.title}
      subtitle={cfg.subtitle}
      footer={
        <Link href="/auth/login" className="text-brand hover:underline">
          {cfg.footerLinkLabel}
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {pwField && (
          <PasswordInput
            label={pwField.label}
            placeholder={pwField.placeholder}
            value={pw}
            onChange={setPw}
            show={show}
            onToggle={() => setShow((v) => !v)}
          />
        )}
        {confirmField && (
          <PasswordInput
            label={confirmField.label}
            placeholder={confirmField.placeholder}
            value={pw2}
            onChange={setPw2}
            show={show}
            onToggle={() => setShow((v) => !v)}
          />
        )}

        <div className="grid grid-cols-2 gap-2 text-xs">
          {rules.map((r) => (
            <span
              key={r.label}
              className={`inline-flex items-center gap-1 ${
                r.ok ? 'text-emerald-500' : 'text-muted-foreground'
              }`}
            >
              <Check className="h-3 w-3" /> {r.label}
            </span>
          ))}
        </div>

        <Link
          href="/auth/login"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient text-sm font-medium text-white shadow-lg shadow-brand/25 transition hover:opacity-95"
        >
          {cfg.submitLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      </form>
    </AuthShell>
  );
}

function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  show,
  onToggle,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={show ? 'text' : 'password'}
          placeholder={placeholder ?? '••••••••'}
          className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-11 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
