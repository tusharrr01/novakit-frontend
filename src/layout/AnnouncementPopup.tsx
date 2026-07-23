'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { io } from 'socket.io-client';
import { useAuth } from '@/src/lib/auth';
import {
  useAnnouncements,
  isPopupDismissedForVersion,
  dismissPopup,
  markPopupShownThisSession,
  wasPopupShownThisSession,
  type FestivalVariant,
  type PopupVariantSettings,
} from '@/src/lib/announcements';

const FIRST_LOGIN_KEY = 'novakit:popup-welcome-shown';
const POPUP_DELAY_MS = 2000;
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

function getTodayMMDD(): string {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${m}-${d}`;
}

function getTodayYYYYMMDD(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function AnnouncementPopup() {
  const { popup } = useAnnouncements();
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [activePopupData, setActivePopupData] = useState<{
    title: string;
    body: string;
    ctaLabel: string;
    ctaUrl: string;
    dismissible: boolean;
    accentColor: string;
    dismissKey: string;
  } | null>(null);

  const isDark = useIsDarkMode();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!popup?.enabled) return;

    const trigger = popup.trigger || 'welcome';
    const userName = (user as any)?.name || (user as any)?.username || (user as any)?.email?.split('@')[0] || 'there';
    const todayMMDD = getTodayMMDD();
    const todayYYYYMMDD = getTodayYYYYMMDD();

    let resolvedData: {
      title: string;
      body: string;
      ctaLabel: string;
      ctaUrl: string;
      dismissible: boolean;
      accentColor: string;
      dismissKey: string;
    } | null = null;

    if (trigger === 'festival') {
      const festivalSettings = popup.festival;
      const festivals = festivalSettings?.festivals || [];
      const activeFest = festivals.find((f) => f.id === festivalSettings?.activeFestivalId) || festivals[0];

      if (activeFest && activeFest.enabled && activeFest.title.trim()) {
        const festDate = activeFest.date.trim();
        const matchesDate = festDate === todayMMDD || festDate === todayYYYYMMDD;

        if (matchesDate) {
          const dismissKey = `festival:${activeFest.id}:${todayYYYYMMDD}`;
          if (!isPopupDismissedForVersion(dismissKey) && !wasPopupShownThisSession(dismissKey)) {
            const accColor = isDark && activeFest.darkAccentColor ? activeFest.darkAccentColor : activeFest.accentColor;
            resolvedData = {
              title: activeFest.title.replace(/\{name\}/g, userName).replace(/\{festival\}/g, activeFest.name),
              body: activeFest.body.replace(/\{name\}/g, userName).replace(/\{festival\}/g, activeFest.name),
              ctaLabel: activeFest.ctaLabel,
              ctaUrl: activeFest.ctaUrl,
              dismissible: true,
              accentColor: accColor || '#7c3aed',
              dismissKey,
            };
          }
        }
      }
    } else if (trigger === 'birthday') {
      const birthdayVariant = popup.variants?.birthday;
      const userDob = (user as any)?.dob || (user as any)?.birthdate;

      if (isAuthenticated && userDob && birthdayVariant && birthdayVariant.enabled && birthdayVariant.title.trim()) {
        const dobMMDD = String(userDob).slice(-5); // Extract MM-DD from YYYY-MM-DD
        const isBirthdayToday = dobMMDD === todayMMDD;

        if (isBirthdayToday) {
          const dismissKey = `birthday:${user?.email || 'user'}:${todayYYYYMMDD}`;
          if (!isPopupDismissedForVersion(dismissKey) && !wasPopupShownThisSession(dismissKey)) {
            const accColor = isDark && birthdayVariant.darkAccentColor ? birthdayVariant.darkAccentColor : birthdayVariant.accentColor;
            resolvedData = {
              title: birthdayVariant.title.replace(/\{name\}/g, userName),
              body: birthdayVariant.body.replace(/\{name\}/g, userName),
              ctaLabel: birthdayVariant.ctaLabel,
              ctaUrl: birthdayVariant.ctaUrl,
              dismissible: birthdayVariant.dismissible !== false,
              accentColor: accColor || '#ec4899',
              dismissKey,
            };
          }
        }
      }
    } else if (trigger === 'broadcast') {
      const broadcastVariant = popup.variants?.broadcast;
      if (broadcastVariant && broadcastVariant.enabled && broadcastVariant.title.trim()) {
        // Check 7-day expiration (1 week)
        const updatedTime = broadcastVariant.broadcastUpdatedAt ? new Date(broadcastVariant.broadcastUpdatedAt).getTime() : Date.now();
        const isExpired = Date.now() - updatedTime > ONE_WEEK_MS;

        if (!isExpired) {
          const dismissKey = `broadcast:${broadcastVariant.version || 'v1'}`;
          if (!isPopupDismissedForVersion(dismissKey) && !wasPopupShownThisSession(dismissKey)) {
            const accColor = isDark && broadcastVariant.darkAccentColor ? broadcastVariant.darkAccentColor : broadcastVariant.accentColor;
            resolvedData = {
              title: broadcastVariant.title.replace(/\{name\}/g, userName),
              body: broadcastVariant.body.replace(/\{name\}/g, userName),
              ctaLabel: broadcastVariant.ctaLabel,
              ctaUrl: broadcastVariant.ctaUrl,
              dismissible: broadcastVariant.dismissible !== false,
              accentColor: accColor || '#3b82f6',
              dismissKey,
            };
          }
        }
      }
    } else if (trigger === 'welcome') {
      const welcomeVariant = popup.variants?.welcome;
      if (isAuthenticated && welcomeVariant && welcomeVariant.enabled && welcomeVariant.title.trim()) {
        const dismissKey = `welcome:${welcomeVariant.version || 'v1'}:${user?.email}`;
        const seen = window.localStorage.getItem(`${FIRST_LOGIN_KEY}:${user?.email}`);

        if (!seen && !isPopupDismissedForVersion(dismissKey) && !wasPopupShownThisSession(dismissKey)) {
          const accColor = isDark && welcomeVariant.darkAccentColor ? welcomeVariant.darkAccentColor : welcomeVariant.accentColor;
          resolvedData = {
            title: welcomeVariant.title.replace(/\{name\}/g, userName),
            body: welcomeVariant.body.replace(/\{name\}/g, userName),
            ctaLabel: welcomeVariant.ctaLabel,
            ctaUrl: welcomeVariant.ctaUrl,
            dismissible: welcomeVariant.dismissible !== false,
            accentColor: accColor || '#7c3aed',
            dismissKey,
          };
        }
      }
    }

    if (!resolvedData) return;

    const dataToShow = resolvedData;
    const timer = window.setTimeout(() => {
      setActivePopupData(dataToShow);
      setOpen(true);
      markPopupShownThisSession(dataToShow.dismissKey);
    }, POPUP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [popup, isAuthenticated, user, isDark]);

  // Real-time Socket.io broadcast listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:5000';
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socket.on('broadcast:popup', (data: any) => {
      const bVariant = data?.popup?.variants?.broadcast;
      const isBroadcastTrigger = data?.popup?.trigger === 'broadcast';

      if (isBroadcastTrigger && bVariant && bVariant.enabled && bVariant.title?.trim()) {
        const userName = (user as any)?.name || (user as any)?.username || (user as any)?.email?.split('@')[0] || 'there';
        const dismissKey = `broadcast:${bVariant.version || 'v1'}`;
        const accColor = isDark && bVariant.darkAccentColor ? bVariant.darkAccentColor : (bVariant.accentColor || '#3b82f6');

        setActivePopupData({
          title: (bVariant.title || '').replace(/\{name\}/g, userName),
          body: (bVariant.body || '').replace(/\{name\}/g, userName),
          ctaLabel: bVariant.ctaLabel || '',
          ctaUrl: bVariant.ctaUrl || '/products',
          dismissible: bVariant.dismissible !== false,
          accentColor: accColor,
          dismissKey,
        });
        setOpen(true);
        markPopupShownThisSession(dismissKey);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user, isDark]);

  if (!open || !activePopupData) return null;

  const close = () => {
    setOpen(false);
    if (activePopupData?.dismissKey) {
      dismissPopup(activePopupData.dismissKey);
      if (popup?.trigger === 'welcome' && user?.email) {
        window.localStorage.setItem(`${FIRST_LOGIN_KEY}:${user.email}`, '1');
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={activePopupData.dismissible ? close : undefined}
      role="dialog"
      aria-modal="true"
      aria-label={activePopupData.title}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-1.5 w-full"
          style={{ background: `linear-gradient(90deg, ${activePopupData.accentColor}, ${activePopupData.accentColor}88)` }}
        />
        {activePopupData.dismissible && (
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground transition hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="p-6">
          <h3 className="font-display text-xl font-semibold" style={{ color: activePopupData.accentColor }}>
            {activePopupData.title}
          </h3>
          {activePopupData.body && (
            <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
              {activePopupData.body}
            </p>
          )}
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            {activePopupData.ctaLabel && activePopupData.ctaUrl && (
              <a
                href={activePopupData.ctaUrl}
                onClick={close}
                className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
                style={{
                  background: `linear-gradient(135deg, ${activePopupData.accentColor}, ${activePopupData.accentColor}cc)`,
                  boxShadow: `0 10px 30px -12px ${activePopupData.accentColor}80`,
                }}
              >
                {activePopupData.ctaLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
