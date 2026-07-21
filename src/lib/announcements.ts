import { useEffect, useState } from 'react';

export type PopupTrigger =
  | 'everyVisit'
  | 'everyLogin'
  | 'firstLogin'
  | 'onceEver';

export type MarqueeSettings = {
  enabled: boolean;
  message: string;
  ctaLabel: string;
  ctaUrl: string;
  speedSeconds: number; // full loop duration
  backgroundColor: string;
  textColor: string;
  dismissible: boolean;
  showOnLanding: boolean;
  showOnShop: boolean;
};

export type PopupVariantSettings = {
  enabled: boolean;
  version: string; // bump to re-show to users who've dismissed
  title: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  imageUrl: string;
  dismissible: boolean;
  accentColor: string;
};

export type PopupSettings = {
  enabled: boolean;
  trigger: PopupTrigger;
  variants: Record<PopupTrigger, PopupVariantSettings>;
};

export type AnnouncementsSettings = {
  marquee: MarqueeSettings;
  popup: PopupSettings;
};

const defaultPopupVariants: Record<PopupTrigger, PopupVariantSettings> = {
  firstLogin: {
    enabled: true,
    version: 'v1',
    title: 'Welcome to NovaKit ✨',
    body: 'Thanks for joining. Grab 20% off your first template with the code NOVA20.',
    ctaLabel: 'Claim discount',
    ctaUrl: '/products',
    imageUrl: '',
    dismissible: true,
    accentColor: '#7c3aed',
  },
  everyLogin: {
    enabled: true,
    version: 'v1',
    title: 'Welcome back 👋',
    body: 'Check out the latest templates added this week.',
    ctaLabel: 'Browse new',
    ctaUrl: '/products',
    imageUrl: '',
    dismissible: true,
    accentColor: '#7c3aed',
  },
  onceEver: {
    enabled: true,
    version: 'v1',
    title: 'Limited time offer',
    body: 'Get 25% off your first purchase. Offer ends soon.',
    ctaLabel: 'Shop now',
    ctaUrl: '/products',
    imageUrl: '',
    dismissible: true,
    accentColor: '#7c3aed',
  },
  everyVisit: {
    enabled: true,
    version: 'v1',
    title: "Don't miss out",
    body: 'Subscribe to our newsletter for exclusive deals.',
    ctaLabel: 'Subscribe',
    ctaUrl: '/products',
    imageUrl: '',
    dismissible: true,
    accentColor: '#7c3aed',
  },
};

export const defaultAnnouncements: AnnouncementsSettings = {
  marquee: {
    enabled: true,
    message:
      '🚀 Black Friday sale — save 40% on every NovaKit template. Ends Sunday.',
    ctaLabel: 'Browse deals',
    ctaUrl: '/products',
    speedSeconds: 28,
    backgroundColor: '#7c3aed',
    textColor: '#ffffff',
    dismissible: true,
    showOnLanding: true,
    showOnShop: true,
  },
  popup: {
    enabled: true,
    trigger: 'firstLogin',
    variants: defaultPopupVariants,
  },
};

const STORAGE_KEY = 'novakit:announcements';
const EVENT = 'novakit:announcements-changed';
const listeners = new Set<() => void>();

function mergePopupSettings(stored: any): PopupSettings {
  const base = defaultAnnouncements.popup;
  if (!stored) return base;

  // Migrate old flat popup format (pre-variants) to the new per-trigger shape.
  if (!stored.variants) {
    const trigger: PopupTrigger = stored.trigger || 'firstLogin';
    const fallback = base.variants[trigger];
    const variant: PopupVariantSettings = {
      enabled: true,
      version: stored.version || fallback.version,
      title: stored.title || fallback.title,
      body: stored.body || fallback.body,
      ctaLabel: stored.ctaLabel || fallback.ctaLabel,
      ctaUrl: stored.ctaUrl || fallback.ctaUrl,
      imageUrl: stored.imageUrl || fallback.imageUrl,
      dismissible: stored.dismissible ?? fallback.dismissible,
      accentColor: stored.accentColor || fallback.accentColor,
    };
    return {
      enabled: stored.enabled ?? base.enabled,
      trigger,
      variants: {
        ...base.variants,
        [trigger]: variant,
      },
    };
  }

  const variants = { ...base.variants };
  for (const key of Object.keys(base.variants) as PopupTrigger[]) {
    variants[key] = { ...base.variants[key], ...(stored.variants[key] || {}) };
  }

  return {
    enabled: stored.enabled ?? base.enabled,
    trigger: stored.trigger || base.trigger,
    variants,
  };
}

function read(): AnnouncementsSettings {
  if (typeof window === 'undefined') return defaultAnnouncements;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAnnouncements;
    const parsed = JSON.parse(raw) as Partial<AnnouncementsSettings>;
    return {
      marquee: { ...defaultAnnouncements.marquee, ...(parsed.marquee || {}) },
      popup: mergePopupSettings(parsed.popup),
    };
  } catch {
    return defaultAnnouncements;
  }
}

function notify() {
  listeners.forEach((l) => l());
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(EVENT));
}

export const announcementsStore = {
  get: read,
  save(next: AnnouncementsSettings) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    notify();
  },
  updateMarquee(patch: Partial<MarqueeSettings>) {
    const cur = read();
    this.save({ ...cur, marquee: { ...cur.marquee, ...patch } });
  },
  updatePopup(patch: Partial<PopupSettings>) {
    const cur = read();
    this.save({ ...cur, popup: { ...cur.popup, ...patch } });
  },
  reset() {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_KEY);
    notify();
  },
};

export function useAnnouncements(): AnnouncementsSettings {
  const [state, setState] = useState<AnnouncementsSettings>(defaultAnnouncements);
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

// Dismiss tracking (marquee: per-message; popup: per-version per trigger)
const MARQUEE_DISMISS_KEY = 'novakit:marquee-dismissed';
const POPUP_DISMISS_KEY = 'novakit:popup-dismissed';
const POPUP_SESSION_KEY = 'novakit:popup-session-shown';

export function isMarqueeDismissed(message: string): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(MARQUEE_DISMISS_KEY) === hash(message);
}
export function dismissMarquee(message: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(MARQUEE_DISMISS_KEY, hash(message));
}

export function isPopupDismissedForVersion(version: string): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(POPUP_DISMISS_KEY) === version;
}
export function dismissPopup(version: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(POPUP_DISMISS_KEY, version);
}

export function markPopupShownThisSession(version: string) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(POPUP_SESSION_KEY, version);
}
export function wasPopupShownThisSession(version: string): boolean {
  if (typeof window === 'undefined') return false;
  return window.sessionStorage.getItem(POPUP_SESSION_KEY) === version;
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return String(h);
}
