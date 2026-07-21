import { useEffect, useState, useSyncExternalStore } from 'react';
import { faqStore, testimonialStore } from './site-content';
import { authContentStore, AUTH_PAGE_META, type AuthContent } from './auth-content';
import { emailTemplatesStore, EMAIL_TEMPLATE_META } from './email-templates-content';

export type Language = {
  code: string;
  name: string;
  rtl?: boolean;
  enabled?: boolean;
};

export type LanguageDictionary = Record<string, string>;
export type TranslationsStore = {
  active: string; // language code, "en" by default
  languages: Language[];
  dictionaries: Record<string, LanguageDictionary>;
};

const STORAGE_KEY = 'novakit:i18n';
const EVENT = 'novakit:i18n-changed';

const DEFAULT_STORE: TranslationsStore = {
  active: 'en',
  languages: [{ code: 'en', name: 'English', rtl: false, enabled: true }],
  dictionaries: { en: {} },
};

function normalizeLang(l: Language): Language {
  return { rtl: false, enabled: true, ...l };
}

let cached: TranslationsStore = DEFAULT_STORE;
let hydrated = false;

function computeFromStorage(): TranslationsStore {
  if (typeof window === 'undefined') return DEFAULT_STORE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STORE;
    const parsed = JSON.parse(raw) as TranslationsStore;
    return {
      active: parsed.active || 'en',
      languages: parsed.languages?.length
        ? parsed.languages.map(normalizeLang)
        : DEFAULT_STORE.languages,
      dictionaries: parsed.dictionaries || { en: {} },
    };
  } catch {
    return DEFAULT_STORE;
  }
}

function read(): TranslationsStore {
  if (typeof window === 'undefined') return DEFAULT_STORE;
  if (!hydrated) {
    cached = computeFromStorage();
    hydrated = true;
  }
  return cached;
}

function write(next: TranslationsStore) {
  if (typeof window === 'undefined') return;
  cached = next;
  hydrated = true;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
}

if (typeof window !== 'undefined') {
  const refresh = () => {
    cached = computeFromStorage();
  };
  window.addEventListener(EVENT, refresh);
  window.addEventListener('storage', refresh);
}

export const i18nStore = {
  get: read,
  setActive(code: string) {
    const state = read();
    const lang = state.languages.find((l) => l.code === code);
    if (!lang || lang.enabled === false) return;
    write({ ...state, active: code });
  },
  upsertLanguage(lang: Language, dictionary?: LanguageDictionary) {
    const state = read();
    const normalized = normalizeLang(lang);
    const languages = state.languages.some((l) => l.code === lang.code)
      ? state.languages.map((l) => (l.code === lang.code ? normalized : l))
      : [...state.languages, normalized];
    const dictionaries = { ...state.dictionaries };
    if (dictionary) dictionaries[lang.code] = dictionary;
    else if (!dictionaries[lang.code]) dictionaries[lang.code] = {};
    write({ ...state, languages, dictionaries });
  },
  setStatus(code: string, enabled: boolean) {
    const state = read();
    const languages = state.languages.map((l) =>
      l.code === code ? { ...l, enabled } : l,
    );
    const active = !enabled && state.active === code ? 'en' : state.active;
    write({ ...state, languages, active });
  },
  updateEntry(code: string, key: string, value: string) {
    const state = read();
    const current = state.dictionaries[code] || {};
    write({
      ...state,
      dictionaries: { ...state.dictionaries, [code]: { ...current, [key]: value } },
    });
  },
  saveDictionary(code: string, dictionary: LanguageDictionary) {
    const state = read();
    write({
      ...state,
      dictionaries: { ...state.dictionaries, [code]: dictionary },
    });
  },
  removeLanguage(code: string) {
    if (code === 'en') return;
    const state = read();
    const dictionaries = { ...state.dictionaries };
    delete dictionaries[code];
    write({
      active: state.active === code ? 'en' : state.active,
      languages: state.languages.filter((l) => l.code !== code),
      dictionaries,
    });
  },
  reset() {
    write(DEFAULT_STORE);
  },
};

export const STATIC_STRINGS: string[] = [
  'Products',
  'Admin',
  'Pricing',
  'Docs',
  'Sign in',
  'Get started',
  'Your profile',
  'Purchases & downloads',
  'Billing & invoices',
  'Settings',
  'Sign out',
  'AI-first templates, dashboards and starters for teams shipping serious products. Beautifully designed. Production ready.',
  'Product',
  'Company',
  'Templates',
  'Admin Kit',
  'Auth Flows',
  'About',
  'Changelog',
  'Contact',
  'License',
  'All rights reserved.',
  'Built with care · v1.0',
  'New · NovaKit v2 with AI-native building blocks',
  'The',
  'AI-first',
  'toolkit',
  'for shipping serious products.',
  'Explore templates',
  'View live demo',
  'Language',
  'Loading…',
  'Save',
  'Cancel',
  'Delete',
  'Edit',
  'Search',
];

export function collectDynamicStrings(): string[] {
  const out = new Set<string>();

  // FAQs
  for (const f of faqStore.list()) {
    if (f.question) out.add(f.question);
    if (f.answer) out.add(f.answer);
    if (f.category) out.add(f.category);
  }

  // Testimonials
  for (const t of testimonialStore.list()) {
    if (t.quote) out.add(t.quote);
    if (t.role) out.add(t.role);
    if (t.company) out.add(t.company);
  }

  // Auth pages
  const auth = authContentStore.get() as AuthContent;
  for (const meta of AUTH_PAGE_META) {
    const page = auth[meta.key];
    if (!page) continue;
    for (const v of [
      page.eyebrow,
      page.title,
      page.subtitle,
      page.submitLabel,
      page.footerText,
      page.footerLinkLabel,
    ]) {
      if (v) out.add(v);
    }
    for (const f of page.fields) {
      if (f.label) out.add(f.label);
      if (f.placeholder) out.add(f.placeholder);
    }
  }

  // Email templates
  const emails = emailTemplatesStore.get();
  for (const meta of EMAIL_TEMPLATE_META) {
    const tpl = emails[meta.key];
    if (!tpl) continue;
    for (const v of [
      tpl.subject,
      tpl.preheader,
      tpl.heading,
      tpl.body,
      tpl.ctaLabel,
      tpl.footerNote,
    ]) {
      if (v) out.add(v);
    }
  }

  return Array.from(out);
}

export function buildEnglishDictionary(): LanguageDictionary {
  const dict: LanguageDictionary = {};
  const all = new Set<string>([...STATIC_STRINGS, ...collectDynamicStrings()]);
  for (const s of all) dict[s] = s;
  return dict;
}

function subscribe(cb: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}

export function useI18n() {
  const state = useSyncExternalStore(subscribe, read, () => DEFAULT_STORE);
  const dict = state.dictionaries[state.active] || {};
  const t = (source: string) => dict[source] || source;
  return { t, active: state.active, languages: state.languages };
}

export function useT() {
  return useI18n().t;
}

export function useI18nState(): TranslationsStore {
  return useSyncExternalStore(subscribe, read, () => DEFAULT_STORE);
}

export function useLegacyI18n() {
  const [state, setState] = useState<TranslationsStore>(DEFAULT_STORE);
  useEffect(() => {
    const sync = () => setState(read());
    sync();
    return subscribe(sync);
  }, []);
  return state;
}
