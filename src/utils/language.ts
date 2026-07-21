import type { Language } from '@/src/lib/i18n';

export function calculateProgress(dict: Record<string, string>, englishKeysCount: number): number {
  if (englishKeysCount === 0) return 0;
  const translated = Object.values(dict).filter((v) => v.trim().length > 0).length;
  return Math.min(100, Math.round((translated / englishKeysCount) * 100));
}

export function validateLanguage(draft: Partial<Language>, isEdit: boolean, list: Language[]): string | null {
  const code = (draft.code || '').trim().toLowerCase();
  const name = (draft.name || '').trim();
  if (!code || !name) {
    return 'Language Code and Name are required';
  }
  if (!isEdit && list.some((l) => l.code === code)) {
    return `Language with code "${code}" already exists`;
  }
  return null;
}
