import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/src/lib/auth';
import {
  useAnnouncements,
  isPopupDismissedForVersion,
  dismissPopup,
  markPopupShownThisSession,
  wasPopupShownThisSession,
} from '@/src/lib/announcements';

const FIRST_LOGIN_KEY = 'novakit:popup-first-login-shown';
const POPUP_DELAY_MS = 3500;

export function AnnouncementPopup() {
  const { popup } = useAnnouncements();
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  const trigger = popup.trigger;
  const variant = popup.variants[trigger];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!popup.enabled || !variant.enabled || !variant.title.trim()) return;

    const v = variant.version;
    const alreadyThisSession = wasPopupShownThisSession(v);
    if (alreadyThisSession) return;

    const dismissedForVersion = isPopupDismissedForVersion(v);

    let shouldShow = false;
    switch (trigger) {
      case 'everyVisit':
        shouldShow = !dismissedForVersion;
        break;
      case 'onceEver':
        shouldShow = !dismissedForVersion;
        break;
      case 'everyLogin':
        shouldShow = isAuthenticated && !dismissedForVersion;
        break;
      case 'firstLogin': {
        if (!isAuthenticated || !user) break;
        const seenKey = `${FIRST_LOGIN_KEY}:${v}:${user.email}`;
        const seen = window.localStorage.getItem(seenKey);
        if (!seen) {
          shouldShow = true;
          window.localStorage.setItem(seenKey, '1');
        }
        break;
      }
    }

    if (!shouldShow) return;

    const timer = window.setTimeout(() => {
      setOpen(true);
      markPopupShownThisSession(v);
    }, POPUP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [popup, variant, trigger, isAuthenticated, user]);

  if (!open) return null;

  const close = () => {
    setOpen(false);
    if (trigger === 'onceEver' || trigger === 'everyLogin' || trigger === 'everyVisit') {
      dismissPopup(variant.version);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={variant.dismissible ? close : undefined}
      role="dialog"
      aria-modal="true"
      aria-label={variant.title}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-1.5 w-full"
          style={{ background: `linear-gradient(90deg, ${variant.accentColor}, ${variant.accentColor}88)` }}
        />
        {variant.dismissible && (
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {variant.imageUrl && (
          <img
            src={variant.imageUrl}
            alt=""
            className="h-40 w-full object-cover"
            loading="lazy"
          />
        )}
        <div className="p-6">
          <h3 className="font-display text-xl font-semibold" style={{ color: variant.accentColor }}>
            {variant.title}
          </h3>
          {variant.body && (
            <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
              {variant.body}
            </p>
          )}
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            {variant.dismissible && (
              <button
                type="button"
                onClick={close}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Not now
              </button>
            )}
            {variant.ctaLabel && variant.ctaUrl && (
              <a
                href={variant.ctaUrl}
                onClick={close}
                className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${variant.accentColor}, ${variant.accentColor}cc)`,
                  boxShadow: `0 10px 30px -12px ${variant.accentColor}80`,
                }}
              >
                {variant.ctaLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
