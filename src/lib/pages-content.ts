import { useEffect, useState } from 'react';

export type DynamicPage = {
  id: string;
  slug: string;
  title: string;
  content: string; // markdown/plain
  updatedAt: string;
};

const KEY = 'novakit.pages.v1';
const listeners = new Set<() => void>();

const defaultPages: DynamicPage[] = [
  {
    id: 'pg_privacy',
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    content:
      '# Privacy Policy\n\nWe respect your privacy. This is a placeholder policy — edit it from the admin Page Management tab.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pg_terms',
    slug: 'terms-and-conditions',
    title: 'Terms & Conditions',
    content:
      '# Terms & Conditions\n\nBy using this service you agree to these terms. Edit this from the admin Page Management tab.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pg_about',
    slug: 'about',
    title: 'About',
    content: '# About Us\n\nTell your story here.',
    updatedAt: new Date().toISOString(),
  },
];

function read(): DynamicPage[] {
  if (typeof window === 'undefined') return defaultPages;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultPages;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultPages;
    return parsed;
  } catch {
    return defaultPages;
  }
}

function write(list: DynamicPage[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
  listeners.forEach((l) => l());
}

export const pagesStore = {
  list: read,
  upsert(page: DynamicPage) {
    const list = read();
    const idx = list.findIndex((p) => p.id === page.id);
    const next = { ...page, updatedAt: new Date().toISOString() };
    if (idx >= 0) list[idx] = next;
    else list.push(next);
    write(list);
  },
  remove(id: string) {
    write(read().filter((p) => p.id !== id));
  },
  reset() {
    write(defaultPages);
  },
};

export function usePages(): DynamicPage[] {
  const [pages, setPages] = useState<DynamicPage[]>(defaultPages);
  useEffect(() => {
    setPages(read());
    const cb = () => setPages(read());
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  }, []);
  return pages;
}
