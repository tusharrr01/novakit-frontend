import type { AnnouncementsSettings, PopupVariantSettings } from '@/src/lib/announcements';

function cleanSettings(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(cleanSettings);

  const clean: any = {};
  for (const key of Object.keys(obj).sort()) {
    if (['_id', '__v', 'created_at', 'updated_at', 'broadcastUpdatedAt'].includes(key)) continue;
    clean[key] = cleanSettings(obj[key]);
  }
  return clean;
}

/**
 * Checks if the current local drafts are dirty (different from the remote settings)
 */
export function checkSettingsDirty(draft: AnnouncementsSettings, remote: AnnouncementsSettings): boolean {
  if (!draft || !remote) return false;
  return JSON.stringify(cleanSettings(draft)) !== JSON.stringify(cleanSettings(remote));
}

/**
 * Get active popup variant settings if enabled
 */
export function getEnabledPopupVariant(settings: AnnouncementsSettings): PopupVariantSettings | null {
  if (!settings.popup.enabled) return null;
  const trigger = settings.popup.trigger;
  if (trigger === 'festival') {
    const festData = settings.popup.festival;
    const festivals = festData?.festivals || [];
    const activeFest = festivals.find((f) => f.id === festData?.activeFestivalId) || festivals[0];
    if (!activeFest || !activeFest.enabled) return null;
    return {
      enabled: activeFest.enabled,
      version: 'v1',
      title: activeFest.title,
      body: activeFest.body,
      ctaLabel: activeFest.ctaLabel,
      ctaUrl: activeFest.ctaUrl,
      imageUrl: '',
      dismissible: true,
      accentColor: activeFest.accentColor,
      darkAccentColor: activeFest.darkAccentColor,
    };
  }
  const variant = settings.popup.variants[trigger as 'welcome' | 'broadcast' | 'birthday'];
  return variant && variant.enabled ? variant : null;
}

/**
 * Checks if the marquee banner should render on a specific pathname based on configuration
 */
export function isMarqueeActive(settings: AnnouncementsSettings, pathname: string): boolean {
  const m = settings.marquee;
  if (!m.enabled) return false;
  if (pathname === '/' && m.showOnLanding) return true;
  if ((pathname.startsWith('/products') || pathname.startsWith('/templates') || pathname.startsWith('/designs') || pathname.startsWith('/services')) && m.showOnShop) return true;
  return false;
}
