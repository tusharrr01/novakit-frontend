import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import {
  useAnnouncements,
  isMarqueeDismissed,
  dismissMarquee,
} from '@/src/lib/announcements';

type Props = { location: 'landing' | 'shop' };

export function AnnouncementMarquee({ location }: Props) {
  const { marquee } = useAnnouncements();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (!marquee.enabled) return setHidden(true);
    if (location === 'landing' && !marquee.showOnLanding) return setHidden(true);
    if (location === 'shop' && !marquee.showOnShop) return setHidden(true);
    if (marquee.dismissible && isMarqueeDismissed(marquee.message))
      return setHidden(true);
    setHidden(false);
  }, [marquee, location]);

  if (hidden || !marquee.message.trim()) return null;

  const item = (
    <span className="mx-8 inline-flex items-center gap-3 whitespace-nowrap text-sm font-medium">
      {marquee.message}
      {marquee.ctaLabel && marquee.ctaUrl && (
        <a
          href={marquee.ctaUrl}
          className="rounded-full border border-white/40 px-3 py-0.5 text-xs font-semibold hover:bg-white/10"
          style={{ color: marquee.textColor }}
        >
          {marquee.ctaLabel}
        </a>
      )}
    </span>
  );

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: marquee.backgroundColor, color: marquee.textColor }}
      role="region"
      aria-label="Site announcement"
    >
      <div className="flex items-center">
        <div className="min-w-0 flex-1 overflow-hidden py-2">
          <div
            className="flex w-max animate-marquee"
            style={{ animationDuration: `${Math.max(6, marquee.speedSeconds)}s` }}
          >
            {/* duplicate content so the loop is seamless */}
            <div className="flex shrink-0 items-center">
              {item}
              {item}
              {item}
              {item}
            </div>
            <div className="flex shrink-0 items-center" aria-hidden="true">
              {item}
              {item}
              {item}
              {item}
            </div>
          </div>
        </div>
        {marquee.dismissible && (
          <button
            type="button"
            onClick={() => {
              dismissMarquee(marquee.message);
              setHidden(true);
            }}
            aria-label="Dismiss announcement"
            className="mx-2 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition hover:bg-white/15"
            style={{ color: marquee.textColor }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
