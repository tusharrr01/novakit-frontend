import { useEffect, useState, useMemo } from 'react';
import { useGetAnnouncementsQuery } from '@/src/redux/api/announcementApi';

export type PopupTrigger = 'welcome' | 'broadcast' | 'festival' | 'birthday';

export type MarqueeSettings = {
  enabled: boolean;
  message: string;
  ctaLabel: string;
  ctaUrl: string;
  speedSeconds: number; // full loop duration
  backgroundColor: string;
  textColor: string;
  darkBackgroundColor?: string;
  darkTextColor?: string;
  dismissible: boolean;
  showOnLanding: boolean;
  showOnShop: boolean;
};

export type PopupVariantSettings = {
  enabled: boolean;
  version: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  imageUrl: string;
  dismissible: boolean;
  accentColor: string;
  darkAccentColor?: string;
  broadcastUpdatedAt?: string;
};

export type FestivalVariant = {
  id: string;
  name: string;
  date: string; // MM-DD or YYYY-MM-DD
  enabled: boolean;
  title: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  accentColor: string;
  darkAccentColor?: string;
};

export type PopupSettings = {
  enabled: boolean;
  trigger: PopupTrigger;
  variants: {
    welcome: PopupVariantSettings;
    broadcast: PopupVariantSettings;
    birthday: PopupVariantSettings;
  };
  festival: {
    activeFestivalId: string;
    festivals: FestivalVariant[];
  };
};

export type AnnouncementsSettings = {
  marquee: MarqueeSettings;
  popup: PopupSettings;
};

const defaultFestivalVariants: FestivalVariant[] = [
  {
    id: 'diwali',
    name: 'Diwali Wishing',
    date: '11-01',
    enabled: true,
    title: '🪔 Happy Diwali, {name}! ✨',
    body: 'May your year be filled with lights, prosperity, and joy. Enjoy special festival offers today!',
    ctaLabel: 'View Festival Deals',
    ctaUrl: '/products',
    accentColor: '#f59e0b',
    darkAccentColor: '#fbbf24',
  },
  {
    id: 'christmas',
    name: 'Christmas Wishing',
    date: '12-25',
    enabled: true,
    title: '🎄 Merry Christmas, {name}! 🎁',
    body: 'Wishing you peace, joy, and all the best this holiday season!',
    ctaLabel: 'Claim Holiday Gift',
    ctaUrl: '/products',
    accentColor: '#ef4444',
    darkAccentColor: '#f87171',
  },
  {
    id: 'newyear',
    name: 'New Year Wishing',
    date: '01-01',
    enabled: true,
    title: '🎆 Happy New Year, {name}! 🥂',
    body: 'Cheers to a new year of growth and success! Grab our New Year special discounts.',
    ctaLabel: 'Explore Offers',
    ctaUrl: '/products',
    accentColor: '#10b981',
    darkAccentColor: '#34d399',
  },
];

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
    darkBackgroundColor: '#4c1d95',
    darkTextColor: '#ffffff',
    dismissible: true,
    showOnLanding: true,
    showOnShop: true,
  },
  popup: {
    enabled: true,
    trigger: 'welcome',
    variants: {
      welcome: {
        enabled: true,
        version: 'v1',
        title: 'Welcome to NovaKit ✨',
        body: 'Thanks for joining us! Explore our premium tools & templates.',
        ctaLabel: 'Get Started',
        ctaUrl: '/products',
        imageUrl: '',
        dismissible: true,
        accentColor: '#7c3aed',
        darkAccentColor: '#a855f7',
      },
      broadcast: {
        enabled: true,
        version: 'v1',
        title: '📢 Platform Announcement',
        body: 'Important update for all users: check out our newest features!',
        ctaLabel: 'Learn More',
        ctaUrl: '/products',
        imageUrl: '',
        dismissible: true,
        accentColor: '#3b82f6',
        darkAccentColor: '#60a5fa',
        broadcastUpdatedAt: new Date().toISOString(),
      },
      birthday: {
        enabled: true,
        version: 'v1',
        title: '🎂 Happy Birthday, {name}! 🎉',
        body: 'Wishing you a wonderful birthday! Enjoy a special celebration discount on us today.',
        ctaLabel: 'Claim Birthday Gift',
        ctaUrl: '/products',
        imageUrl: '',
        dismissible: true,
        accentColor: '#ec4899',
        darkAccentColor: '#f472b6',
      },
    },
    festival: {
      activeFestivalId: 'diwali',
      festivals: defaultFestivalVariants,
    },
  },
};

const STORAGE_KEY = 'novakit:announcements';
const EVENT = 'novakit:announcements-changed';
const listeners = new Set<() => void>();

function mergePopupSettings(stored: any): PopupSettings {
  const base = defaultAnnouncements.popup;
  if (!stored) return base;

  const validTriggers: PopupTrigger[] = ['welcome', 'broadcast', 'festival', 'birthday'];
  const trigger: PopupTrigger = validTriggers.includes(stored.trigger) ? stored.trigger : 'welcome';

  const variants = {
    welcome: { ...base.variants.welcome, ...(stored.variants?.welcome || stored.variants?.firstLogin || {}) },
    broadcast: { ...base.variants.broadcast, ...(stored.variants?.broadcast || stored.variants?.onceEver || {}) },
    birthday: { ...base.variants.birthday, ...(stored.variants?.birthday || stored.variants?.everyLogin || {}) },
  };

  const festivalData = stored.festival || {};
  const festivalsList: FestivalVariant[] = Array.isArray(festivalData.festivals) && festivalData.festivals.length > 0
    ? festivalData.festivals.map((f: any) => ({
        id: f.id || f._id || 'fest',
        name: f.name || 'Festival',
        date: f.date || '11-01',
        enabled: f.enabled ?? true,
        title: f.title || '',
        body: f.body || '',
        ctaLabel: f.ctaLabel || '',
        ctaUrl: f.ctaUrl || '/products',
        accentColor: f.accentColor || '#f59e0b',
        darkAccentColor: f.darkAccentColor || '#fbbf24',
      }))
    : base.festival.festivals;

  return {
    enabled: stored.enabled ?? base.enabled,
    trigger,
    variants,
    festival: {
      activeFestivalId: festivalData.activeFestivalId || festivalsList[0]?.id || 'diwali',
      festivals: festivalsList,
    },
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

export function normalizeAnnouncements(data: any): AnnouncementsSettings {
  if (!data) return defaultAnnouncements;
  return {
    marquee: { ...defaultAnnouncements.marquee, ...(data.marquee || {}) },
    popup: mergePopupSettings(data.popup),
  };
}

export function useAnnouncements(): AnnouncementsSettings {
  const { data: resp } = useGetAnnouncementsQuery(undefined);
  const [localState, setLocalState] = useState<AnnouncementsSettings>(defaultAnnouncements);

  useEffect(() => {
    setLocalState(read());
    const on = () => setLocalState(read());
    listeners.add(on);
    window.addEventListener(EVENT, on);
    window.addEventListener('storage', on);
    return () => {
      listeners.delete(on);
      window.removeEventListener(EVENT, on);
      window.removeEventListener('storage', on);
    };
  }, []);

  return useMemo(() => {
    if (resp?.data) {
      return normalizeAnnouncements(resp.data);
    }
    return localState;
  }, [resp?.data, localState]);
}

// Dismiss tracking (marquee: per-message; popup: per-key/version)
const MARQUEE_DISMISS_KEY = 'novakit:marquee-dismissed';
const POPUP_DISMISS_KEY = 'novakit:popup-dismissed';

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
  return window.localStorage.getItem(`${POPUP_DISMISS_KEY}:${version}`) === 'true';
}
export function dismissPopup(version: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(`${POPUP_DISMISS_KEY}:${version}`, 'true');
}

const POPUP_SESSION_KEY = 'novakit:popup-session-shown';

export function markPopupShownThisSession(version: string) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(`${POPUP_SESSION_KEY}:${version}`, 'true');
}
export function wasPopupShownThisSession(version: string): boolean {
  if (typeof window === 'undefined') return false;
  return window.sessionStorage.getItem(`${POPUP_SESSION_KEY}:${version}`) === 'true';
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return String(h);
}
