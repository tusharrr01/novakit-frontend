'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Github } from 'lucide-react';
import { AuthShell } from '@/src/components/layout/AuthShell';
import { useAuthPage } from '@/src/lib/auth-content';

function LoginForm() {
  const cfg = useAuthPage('login');
  const emailField = cfg.fields.find((f) => f.key === 'email');
  const passwordField = cfg.fields.find((f) => f.key === 'password');

  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/';
  const errorParam = params.get('error');

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(
    errorParam === 'CredentialsSignin' ? 'Invalid email or password.' : null
  );
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        setError('Invalid email or password.');
        setLoading(false);
      } else {
        router.push(res?.url || callbackUrl);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl });
  }

  async function handleGithub() {
    setGithubLoading(true);
    await signIn('github', { callbackUrl });
  }

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
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {emailField?.label ?? 'Email'}
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              placeholder={emailField?.placeholder ?? 'you@company.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-3 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground">
              {passwordField?.label ?? 'Password'}
            </label>
            <Link href="/auth/forgot-password" className="text-xs text-brand hover:underline">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type={show ? 'text' : 'password'}
              placeholder={passwordField?.placeholder ?? '••••••••'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-11 text-sm outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-500">
            {error}
          </p>
        )}

        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" defaultChecked className="h-3.5 w-3.5 rounded border-border accent-[var(--brand)]" />
          Remember me for 30 days
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient text-sm font-medium text-white shadow-lg shadow-brand/25 transition hover:opacity-95 disabled:opacity-70"
        >
          {loading ? 'Signing in…' : cfg.submitLabel} <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-xs text-neutral-500">Loading auth screen...</div>}>
      <LoginForm />
    </Suspense>
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
