import type { AnnouncementsSettings, PopupVariantSettings } from '@/src/lib/announcements';

/**
 * Checks if the current local drafts are dirty (different from the remote settings)
 */
export function checkSettingsDirty(draft: AnnouncementsSettings, remote: AnnouncementsSettings): boolean {
  return JSON.stringify(draft) !== JSON.stringify(remote);
}

/**
 * Get active popup variant settings if enabled
 */
export function getEnabledPopupVariant(settings: AnnouncementsSettings): PopupVariantSettings | null {
  if (!settings.popup.enabled) return null;
  const trigger = settings.popup.trigger;
  const variant = settings.popup.variants[trigger];
  return variant.enabled ? variant : null;
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
