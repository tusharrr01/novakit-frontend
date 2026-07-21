import { useEffect, useState } from 'react';

export type SystemPreferences = {
  general: {
    appName: string;
    appEmail: string;
    appDescription: string;
    supportEmail: string;
    defaultTheme: 'light' | 'dark' | 'system';
    sessionExpirationDays: number;
    allowUserSignup: boolean;
    enableCookiePopup: boolean;
    demoMode: boolean;
  };
  branding: {
    favicon: string;
    logoLight: string;
    logoDark: string;
    sidebarFaviconLight: string;
    sidebarFaviconDark: string;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    fromName: string;
    fromEmail: string;
  };
  google: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
  aws: {
    enabled: boolean;
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
  };
  limits: {
    mediaSharing: boolean;
    documentMb: number;
    audioMb: number;
    videoMb: number;
    imageMb: number;
    multiFileMb: number;
    totalStorageMb: number;
    allowedTypes: string[];
    restoreOnDelete: boolean;
  };
  otp: {
    method: 'email' | 'whatsapp';
  };
  maintenance: {
    appLoaderLabel: string;
    enabled: boolean;
    title: string;
    message: string;
    allowedIps: string[];
    maintenanceImage: string;
    notFoundTitle: string;
    notFoundContent: string;
    notFoundImage: string;
    noInternetTitle: string;
    noInternetContent: string;
    noInternetImage: string;
  };
  signup: {
    enableAgreementLine: boolean;
    prefixText: string;
    linkText: string;
    targetPageSlug: string;
    requiredPageSlugs: string[]; // page slugs the user must accept via checkboxes
  };
  seo: {
    favicon: string;
    title: string;
    description: string;
    keywords: string;
    canonicalUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterCard: 'summary' | 'summary_large_image';
    twitterHandle: string;
    facebookAppId: string;
    linkedinUrl: string;
    robots: string;
    jsonLd: string;
  };
};

export const defaultSystemPreferences: SystemPreferences = {
  general: {
    appName: 'NovaKit',
    appEmail: 'support@example.com',
    appDescription: 'AI-first templates & starter kits.',
    supportEmail: 'support@example.com',
    defaultTheme: 'light',
    sessionExpirationDays: 7,
    allowUserSignup: true,
    enableCookiePopup: false,
    demoMode: false,
  },
  branding: {
    favicon: '',
    logoLight: '',
    logoDark: '',
    sidebarFaviconLight: '',
    sidebarFaviconDark: '',
  },
  email: {
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromName: 'NovaKit',
    fromEmail: 'no-reply@example.com',
  },
  google: {
    clientId: '',
    clientSecret: '',
    redirectUri: 'https://example.com/api/google/callback',
  },
  aws: {
    enabled: false,
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1',
    bucket: '',
  },
  limits: {
    mediaSharing: true,
    documentMb: 15,
    audioMb: 15,
    videoMb: 20,
    imageMb: 10,
    multiFileMb: 10,
    totalStorageMb: 80,
    allowedTypes: [
      '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
      '.mp4', '.mpeg', '.mov', '.webm',
      '.mp3', '.wav', '.ogg',
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.ppt', '.pptx', '.txt', '.json',
    ],
    restoreOnDelete: true,
  },
  otp: { method: 'email' },
  maintenance: {
    appLoaderLabel: 'One And Only',
    enabled: false,
    title: 'Under Maintenance',
    message: 'We are performing some maintenance. Please check back later.',
    allowedIps: ['192.168.29.34'],
    maintenanceImage: '',
    notFoundTitle: 'Page Not Found',
    notFoundContent: 'The page you are looking for does not exist.',
    notFoundImage: '',
    noInternetTitle: 'No Internet Connection',
    noInternetContent: 'Please check your internet connection and try again.',
    noInternetImage: '',
  },
  signup: {
    enableAgreementLine: true,
    prefixText: 'I agree to the',
    linkText: 'Privacy Policy & Terms',
    targetPageSlug: 'privacy-policy',
    requiredPageSlugs: [],
  },
  seo: {
    favicon: '',
    title: 'NovaKit — AI-first templates & starter kits',
    description: 'Beautifully designed, production-ready templates and dashboards for teams shipping serious products.',
    keywords: 'templates, dashboards, saas, starter, ai',
    canonicalUrl: '',
    ogTitle: 'NovaKit',
    ogDescription: 'AI-first templates & starter kits.',
    ogImage: '',
    twitterCard: 'summary_large_image',
    twitterHandle: '@novakit',
    facebookAppId: '',
    linkedinUrl: '',
    robots: 'index,follow',
    jsonLd: '',
  },
};

const KEY = 'novakit.system-preferences.v1';
const listeners = new Set<() => void>();

function read(): SystemPreferences {
  if (typeof window === 'undefined') return defaultSystemPreferences;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultSystemPreferences;
    const parsed = JSON.parse(raw);
    // shallow-merge each section so new keys pick up defaults
    const merged: SystemPreferences = { ...defaultSystemPreferences };
    for (const k of Object.keys(defaultSystemPreferences) as (keyof SystemPreferences)[]) {
      merged[k] = { ...(defaultSystemPreferences[k] as object), ...(parsed?.[k] ?? {}) } as never;
    }
    return merged;
  } catch {
    return defaultSystemPreferences;
  }
}

export const systemPreferencesStore = {
  get: read,
  save(prefs: SystemPreferences) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(KEY, JSON.stringify(prefs));
    listeners.forEach((l) => l());
  },
  reset() {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(KEY);
    listeners.forEach((l) => l());
  },
};

export function useSystemPreferences(): SystemPreferences {
  const [state, setState] = useState<SystemPreferences>(defaultSystemPreferences);
  useEffect(() => {
    setState(read());
    const cb = () => setState(read());
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  }, []);
  return state;
}
