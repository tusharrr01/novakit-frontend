import type { SystemPreferences } from '@/src/lib/system-preferences';

export function isSystemConfigDirty(draft: SystemPreferences, remote: SystemPreferences): boolean {
  return JSON.stringify(draft) !== JSON.stringify(remote);
}

export function validateSMTPConfig(smtp: SystemPreferences['email']): string | null {
  if (
    smtp.smtpHost.trim() ||
    smtp.smtpUsername.trim() ||
    smtp.smtpPassword.trim()
  ) {
    if (!smtp.smtpHost.trim() || !smtp.smtpUsername.trim() || !smtp.smtpPassword.trim()) {
      return 'SMTP Host, Username and Password must all be provided together';
    }
    if (smtp.smtpPort <= 0) {
      return 'SMTP Port must be a valid positive number';
    }
  }
  return null;
}
