import { useEffect, useState } from 'react';

export type AuthPageKey =
  | 'login'
  | 'register'
  | 'forgotPassword'
  | 'resetPassword'
  | 'otp';

export type AuthField = {
  key: string;
  label: string;
  placeholder: string;
};

export type AuthPageContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  submitLabel: string;
  footerText: string;
  footerLinkLabel: string;
  showSocials: boolean;
  fields: AuthField[];
};

export type AuthContent = Record<AuthPageKey, AuthPageContent>;

export const AUTH_PAGE_META: {
  key: AuthPageKey;
  label: string;
  route: string;
  fieldKeys: string[];
}[] = [
  { key: 'login', label: 'Sign in', route: '/login', fieldKeys: ['email', 'password'] },
  { key: 'register', label: 'Register', route: '/register', fieldKeys: ['name', 'email', 'password'] },
  { key: 'forgotPassword', label: 'Forgot password', route: '/forgot-password', fieldKeys: ['email'] },
  { key: 'resetPassword', label: 'Reset password', route: '/reset-password', fieldKeys: ['password', 'confirmPassword'] },
  { key: 'otp', label: 'OTP verification', route: '/otp', fieldKeys: [] },
];

export const defaultAuthContent: AuthContent = {
  login: {
    eyebrow: 'Welcome back',
    title: 'Sign in to NovaKit',
    subtitle: 'Continue building beautiful products.',
    submitLabel: 'Sign in',
    footerText: 'Don\'t have an account?',
    footerLinkLabel: 'Create one',
    showSocials: true,
    fields: [
      { key: 'email', label: 'Email', placeholder: 'you@company.com' },
      { key: 'password', label: 'Password', placeholder: '••••••••' },
    ],
  },
  register: {
    eyebrow: 'Get started',
    title: 'Create your NovaKit account',
    subtitle: 'Free forever for personal projects. No credit card required.',
    submitLabel: 'Create account',
    footerText: 'Already have an account?',
    footerLinkLabel: 'Sign in',
    showSocials: true,
    fields: [
      { key: 'name', label: 'Full name', placeholder: 'Ava Bennett' },
      { key: 'email', label: 'Work email', placeholder: 'you@company.com' },
      { key: 'password', label: 'Password', placeholder: 'Create a strong password' },
    ],
  },
  forgotPassword: {
    eyebrow: 'Password help',
    title: 'Forgot your password?',
    subtitle: 'Enter your email and we\'ll send you a secure link to reset it.',
    submitLabel: 'Send reset link',
    footerText: 'Remembered it?',
    footerLinkLabel: 'Back to sign in',
    showSocials: false,
    fields: [{ key: 'email', label: 'Email', placeholder: 'you@company.com' }],
  },
  resetPassword: {
    eyebrow: 'Set new password',
    title: 'Choose a new password',
    subtitle: 'Make it strong — you won\'t have to change it again for a while.',
    submitLabel: 'Reset password',
    footerText: '',
    footerLinkLabel: 'Back to sign in',
    showSocials: false,
    fields: [
      { key: 'password', label: 'New password', placeholder: '••••••••' },
      { key: 'confirmPassword', label: 'Confirm password', placeholder: '••••••••' },
    ],
  },
  otp: {
    eyebrow: 'Almost there',
    title: 'Verify your email',
    subtitle: 'We\'ve sent a 6-digit code to your email. Enter it below to continue.',
    submitLabel: 'Verify & continue',
    footerText: 'Wrong email?',
    footerLinkLabel: 'Go back',
    showSocials: false,
    fields: [],
  },
};

const STORAGE_KEY = 'novakit:auth-content';
const EVENT = 'novakit:auth-content-changed';
const listeners = new Set<() => void>();

function read(): AuthContent {
  if (typeof window === 'undefined') return defaultAuthContent;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAuthContent;
    const parsed = JSON.parse(raw) as Partial<AuthContent>;
    const merged = { ...defaultAuthContent };
    (Object.keys(defaultAuthContent) as AuthPageKey[]).forEach((k) => {
      merged[k] = { ...defaultAuthContent[k], ...(parsed[k] || {}) };
    });
    return merged;
  } catch {
    return defaultAuthContent;
  }
}

function notify() {
  listeners.forEach((l) => l());
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(EVENT));
}

export const authContentStore = {
  get: read,
  save(next: AuthContent) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    notify();
  },
  update(key: AuthPageKey, patch: Partial<AuthPageContent>) {
    const current = read();
    const next = { ...current, [key]: { ...current[key], ...patch } };
    this.save(next);
  },
  reset() {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_KEY);
    notify();
  },
};

export function useAuthContent(): AuthContent {
  const [state, setState] = useState<AuthContent>(defaultAuthContent);
  useEffect(() => {
    setState(read());
    const on = () => setState(read());
    listeners.add(on);
    window.addEventListener(EVENT, on);
    window.addEventListener('storage', on);
    return () => {
      listeners.delete(on);
      window.removeEventListener(EVENT, on);
      window.removeEventListener('storage', on);
    };
  }, []);
  return state;
}

export function useAuthPage(key: AuthPageKey): AuthPageContent {
  return useAuthContent()[key];
}

export function getField(page: AuthPageContent, key: string, fallback: AuthField): AuthField {
  return page.fields.find((f) => f.key === key) || fallback;
}
