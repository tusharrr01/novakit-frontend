import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export type AuthUser = {
  email: string;
  name: string;
  avatar?: string;
  joinedAt: string;
  plan: 'Free' | 'Pro' | 'Studio';
};

const STORAGE_KEY = 'novakit:user';
const EVENT = 'novakit:auth-changed';
const listeners = new Set<() => void>();

function readRaw(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function notify() {
  listeners.forEach((l) => l());
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(EVENT));
  }
}

export const authStore = {
  get: readRaw,
  signIn(email: string, password: string): AuthUser {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new Error('Enter a valid email');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters');
    const nameFromEmail = email
      .split('@')[0]
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const existing = readRaw();
    const user: AuthUser =
      existing && existing.email === email
        ? existing
        : {
            email,
            name: nameFromEmail || 'NovaKit User',
            joinedAt: new Date().toISOString(),
            plan: 'Pro',
          };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    notify();
    return user;
  },
  update(patch: Partial<AuthUser>) {
    const current = readRaw();
    if (!current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch }));
    notify();
  },
  signOut() {
    localStorage.removeItem(STORAGE_KEY);
    notify();
  },
};

export function useAuth() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user) {
      const isUserAdmin = (session.user as any).role?.toString().toLowerCase() === 'admin';
      setUser({
        name: session.user.name || 'NovaKit User',
        email: session.user.email || '',
        plan: (session.user as any).plan || (isUserAdmin ? 'Studio' : 'Pro'),
        joinedAt: new Date().toISOString(),
      });
    } else {
      setUser(readRaw());
    }
    setHydrated(true);

    const onChange = () => {
      if (!session?.user) {
        setUser(readRaw());
      }
    };
    listeners.add(onChange);
    window.addEventListener(EVENT, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      listeners.delete(onChange);
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, [session, status]);

  const isAuthenticated = status === 'authenticated' || (status === 'unauthenticated' && !!user);

  return {
    user,
    isAuthenticated: hydrated ? isAuthenticated : false,
    hydrated,
  };
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}
