'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Github, Check } from 'lucide-react';
import { AuthShell } from '@/src/components/site/auth-shell';
import { useAuthPage } from '@/src/lib/auth-content';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function RegisterPage() {
  const cfg = useAuthPage('register');
  const nameField = cfg.fields.find((f) => f.key === 'name');
  const emailField = cfg.fields.find((f) => f.key === 'email');
  const passwordField = cfg.fields.find((f) => f.key === 'password');

  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rules = [
    { label: '8+ characters', ok: pw.length >= 8 },
    { label: 'One number', ok: /\d/.test(pw) },
    { label: 'One uppercase', ok: /[A-Z]/.test(pw) },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setError('Please accept the Terms & Privacy Policy.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password: pw }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Registration failed.');
        setLoading(false);
        return;
      }

      // Auto sign in after successful registration
      const result = await signIn('credentials', {
        email: email.trim(),
        password: pw,
        redirect: false,
      });
      if (result?.error) {
        router.push('/login');
      } else {
        router.push('/otp'); // Go to OTP verification page!
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl: '/' });
  }

  async function handleGithub() {
    setGithubLoading(true);
    await signIn('github', { callbackUrl: '/' });
  }

  return (
    <AuthShell
      eyebrow={cfg.eyebrow}
      title={cfg.title}
      subtitle={cfg.subtitle}
      footer={
        <>
          {cfg.footerText}{' '}
          <Link href="/login" className="font-medium text-brand hover:underline">
            {cfg.footerLinkLabel}
          </Link>
        </>
      }
    >
      {cfg.showSocials && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={githubLoading}
              onClick={handleGithub}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-medium transition hover:border-brand/40 disabled:opacity-60"
            >
              <Github className="h-4 w-4" />
              {githubLoading ? 'GitHub...' : 'GitHub'}
            </button>
            <button
              type="button"
              disabled={googleLoading}
              onClick={handleGoogle}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-medium transition hover:border-brand/40 disabled:opacity-60"
            >
              <GoogleIcon />
              {googleLoading ? 'Google...' : 'Google'}
            </button>
          </div>
          <Divider />
        </>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {nameField && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{nameField.label}</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder={nameField.placeholder}
                required
                className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-3 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </div>
        )}

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

        {passwordField && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{passwordField.label}</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                type={show ? 'text' : 'password'}
                placeholder={passwordField.placeholder}
                required
                className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-11 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs">
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
          </div>
        )}

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-500">
            {error}
          </p>
        )}

        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 rounded border-border accent-[var(--brand)]"
          />
          <span>
            I agree to NovaKit's{' '}
            <a className="text-brand hover:underline" href="#">Terms</a> and{' '}
            <a className="text-brand hover:underline" href="#">Privacy Policy</a>.
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient text-sm font-medium text-white shadow-lg shadow-brand/25 transition hover:opacity-95 disabled:opacity-70"
        >
          {loading ? 'Registering...' : cfg.submitLabel} <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </AuthShell>
  );
}

function Divider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function GoogleIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} width="16" height="16" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3.5 14.7 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12S6.8 21.5 12 21.5c6.9 0 9.5-4.8 9.5-9 0-.6-.1-1.1-.2-1.6H12z" />
    </svg>
  );
}
